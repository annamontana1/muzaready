#!/usr/bin/env python3
"""Béžové pozadí produktových fotek culíků; vlasy zůstanou přesně jako na originále.

Použití:  python3 tools/photo/bezove_pozadi.py VSTUP.jpg VYSTUP.webp

1. Z jasných a nebarevných pixelů (to je pozadí) se proloží plynulá plocha:
   jak světlé je pozadí v každém místě fotky (i se stínem v rohu).
2. Pixel se posune na béžovou jen tehdy, když je skoro stejně světlý jako pozadí
   v tom místě. Vlasy, i lesklé a světlé prameny, jsou tmavší, takže zůstanou beze změny;
   jemné konečky na okraji se přebarví jen z části, takže nevznikne lem.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter, ImageOps

IVORY = np.array([0xF0, 0xEA, 0xE3], np.float32)
MARGIN = 16          # o kolik může být pixel tmavší než pozadí, aby se ještě bral jako pozadí


def background(a: np.ndarray) -> np.ndarray:
    """Plynulý odhad barvy pozadí (kvadratická plocha proložená pixely pozadí)."""
    h, w, _ = a.shape
    step = max(1, min(h, w) // 200)
    s = a[::step, ::step]
    lo, sat = s.min(2), s.max(2) - s.min(2)
    pick = (lo > np.percentile(lo, 60)) & (sat < 28) & (lo > 170)
    ys, xs = np.nonzero(pick)
    if len(ys) < 200:                                  # skoro bez pozadí: jen konstanta z nejsvětlejších
        return np.broadcast_to(np.percentile(s.reshape(-1, 3), 98, axis=0), a.shape).astype(np.float32)
    def basis(y, x):
        y, x = y / s.shape[0] - .5, x / s.shape[1] - .5
        return np.stack([np.ones_like(x), x, y, x * x, y * y, x * y], 1)
    A = basis(ys.astype(np.float32), xs.astype(np.float32))
    coef = np.linalg.lstsq(A, s[ys, xs], rcond=None)[0]
    gy, gx = np.mgrid[0:s.shape[0], 0:s.shape[1]]
    bg = (basis(gy.ravel().astype(np.float32), gx.ravel().astype(np.float32)) @ coef).reshape(s.shape)
    bg = Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(bg).astype(np.float32)


def bezove(src: str, dst: str, max_side: int = 1400) -> None:
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    bg = background(a)
    lum, bglum = a.mean(2), bg.mean(2)
    sat = a.max(2) - a.min(2)
    m = np.clip((lum - (bglum - MARGIN)) / MARGIN, 0, 1) ** 2 * np.clip((40 - sat) / 20, 0, 1)
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32)[..., None] / 255
    out = a + m * (IVORY - bg)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst, quality=90, method=6)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    bezove(sys.argv[1], sys.argv[2])
