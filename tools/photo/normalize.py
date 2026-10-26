# Odhad osvětlení pozadí produktové fotky (používá bezove_pozadi.py).
# (maximum v okolí + rozmazání, cop je tmavší než pozadí) a fotka se jím vydělí,
# takže pozadí vyjde rovnoměrně neutrálně bílé bez fialového nádechu a stínu v rohu.
import sys
import numpy as np
from PIL import Image, ImageFilter

TARGET = 248.0

def illumination(im):
    small = im.copy()
    small.thumbnail((240, 240))
    k = max(3, (min(small.size) // 7) | 1)
    bg = small.filter(ImageFilter.MaxFilter(k)).filter(ImageFilter.GaussianBlur(k))
    return np.asarray(bg.resize(im.size, Image.BICUBIC)).astype(np.float32)

def normalize(src, dst, max_side=1600):
    im = Image.open(src).convert('RGB')
    im.thumbnail((max_side, max_side))
    a = np.asarray(im).astype(np.float32)
    ill = np.clip(illumination(im), 40, 255)
    out = np.clip(a / ill * TARGET, 0, 255)
    sat = out.max(2) - out.min(2)
    near = (out.min(2) > 236) & (sat < 12)
    out[near] = out[near] * 0.3 + 251 * 0.7
    Image.fromarray(out.astype(np.uint8)).save(dst, quality=88)

if __name__ == '__main__':
    normalize(sys.argv[1], sys.argv[2])
