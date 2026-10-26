#!/usr/bin/env python3
"""Šablona úpravy fotek culíků (Múza Hair).

Použití:
    python3 tools/photo/culik_photo.py VSTUP.jpg|.heic [VYSTUP.jpg]

Co udělá s každou fotkou:
1. Vyřízne postavu a vlasy (rembg, model birefnet-portrait; stáhne se jednou, ~1 GB).
2. Pozadí nechá původní, jen ho ztmaví o 20 % (DARKEN), s měkkým přechodem kolem vlasů.
3. Pokud je na fotce člověk, přebarví oblečení (model segformer_b2_clothes) na jednotnou
   tmavě šedou CLOTH; kresba látky (záhyby, šev) zůstane a culík držený před tělem
   se nepřebarví. Pokud by šedá splývala s pozadím, oblečení se trochu zesvětlí.
Výstup: JPEG, delší strana max 2400 px.

Závislosti: pip install rembg pillow-heif transformers torch torchvision pymatting
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

DARKEN = 0.80                 # 1.0 = beze změny pozadí
CLOTH = np.array([58, 58, 60], np.float32)   # tmavě šedá
MAX_SIDE = 2400


def load(path: str) -> Image.Image:
    if path.lower().endswith(('.heic', '.heif')):
        import pillow_heif
        pillow_heif.register_heif_opener()
    im = Image.open(path).convert('RGB')
    im.thumbnail((MAX_SIDE, MAX_SIDE))
    return im


def mask(im: Image.Image, model: str) -> np.ndarray:
    from rembg import new_session, remove
    m = np.asarray(remove(im, session=new_session(model), only_mask=True).convert('L'))
    h = im.size[1]
    if m.shape[0] == 3 * h:      # u2net_cloth_seg: tři masky pod sebou (horní, spodní, celé oblečení)
        m = m.reshape(3, h, -1).max(0)
    return m.astype(np.float32) / 255


UPPER = {'Upper-clothes', 'Dress', 'Scarf'}       # za culíkem: chránit celou plochu vlasů
LOWER = {'Pants', 'Skirt', 'Belt'}                # pod culíkem: chránit jen samotné pramínky


def clothes(im: Image.Image) -> np.ndarray:
    """Maska oblečení (segformer_b2_clothes rozliší vlasy, kůži a oblečení; ~110 MB)."""
    from transformers import pipeline
    seg = pipeline('image-segmentation', model='mattmdjaga/segformer_b2_clothes')
    small = im.copy()
    small.thumbnail((1024, 1024))
    m = np.zeros((small.size[1], small.size[0]), np.float32)
    lower, hair = np.zeros_like(m), np.zeros_like(m)
    for r in seg(small):
        a = np.asarray(r['mask'], np.float32) / 255
        if r['label'] in UPPER:
            m = np.maximum(m, a)
        elif r['label'] in LOWER:
            lower = np.maximum(lower, a)
        elif r['label'] == 'Hair':
            hair = np.maximum(hair, a)
    # culík držený před tělem model často bere jako oblečení -> přidat světlé pramínky
    # a mezery mezi nimi uzavřít, ať oblečení neprosvítá pruhy; okraj změkčit
    hsv = np.asarray(small.convert('HSV')).astype(np.float32) / 255
    strands = (hsv[..., 2] > 0.75) & (hsv[..., 1] < 0.3)
    hair = np.maximum(hair, strands)
    k = max(9, small.size[0] // 40) | 1
    h = (Image.fromarray((hair * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(k))
         .filter(ImageFilter.MinFilter(k // 2 | 1)).filter(ImageFilter.GaussianBlur(k / 3)))
    m = np.maximum(m * (1 - np.asarray(h, np.float32) / 255), lower * ~strands)
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize(im.size, Image.BILINEAR)).astype(np.float32) / 255


def soft(m: np.ndarray, radius: float) -> np.ndarray:
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius))).astype(np.float32) / 255


def main(src: str, dst: str) -> None:
    im = load(src)
    img = np.asarray(im).astype(np.float32)

    subject = soft(mask(im, 'birefnet-portrait'), 3)[..., None]
    out = img * subject + img * DARKEN * (1 - subject)

    # oblečení: jen tam, kde je zároveň postava (aby se nepřebarvilo nic v pozadí)
    cloth = clothes(im) * (subject[..., 0] > 0.5)
    if cloth.mean() > 0.002:
        lum = img.mean(2, keepdims=True) / 255
        shade = CLOTH * (0.55 + 0.9 * lum)          # záhyby a světla látky zůstanou
        bg_lum = (img * (1 - subject)).sum() / max(1.0, (1 - subject).sum() * 3) * DARKEN
        if abs(shade.mean() - bg_lum) < 18:          # neslévat se s pozadím
            shade = shade + 22
        c = soft(cloth, 1.5)[..., None]
        out = out * (1 - c) + shade * c

    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst, quality=92)
    print(dst)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    s = sys.argv[1]
    main(s, sys.argv[2] if len(sys.argv) > 2 else str(Path(s).with_name(Path(s).stem + '_muza.jpg')))
