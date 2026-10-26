# Béžové pozadí bez zásahu do vlasů: vlasy zůstanou v původních pixelech originálu,
# jen podíl pozadí v pixelu se posune z původního světla pozadí na barvu webu.
import sys, glob, os
import numpy as np
from PIL import Image, ImageFilter, ImageOps
sys.path.insert(0, os.path.dirname(__file__))
from normalize import illumination, TARGET

IVORY = np.array([0xF0, 0xEA, 0xE3], np.float32)

def ivory(src, dst, max_side=1400):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    ill = np.clip(illumination(im), 40, 255)
    n = np.clip(a / ill * TARGET, 0, 255)          # jen pro výpočet masky pozadí
    light, sat = n.min(2), n.max(2) - n.min(2)
    m = np.clip((light - 175) / 73, 0, 1) ** 2 * np.clip((55 - sat) / 30, 0, 1)
    m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32)[..., None] / 255
    out = a + m * (IVORY - ill)                     # vlasy (m≈0) beze změny
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst, quality=88, method=6)

if __name__ == '__main__':
    ivory(sys.argv[1], sys.argv[2])
