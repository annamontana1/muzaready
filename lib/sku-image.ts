// Fotky culíků z focení 9. 2. 2026 jsou v Supabase s různě nasvíceným pozadím.
// Verze s béžovým pozadím (ivory #F0EAE3, vlasy beze změny; tools/photo/bezove_pozadi.py)
// leží v /public/images/sku, takže je API
// vrací místo originálů. Ostatní adresy projdou beze změny.
const SHOOT = /\/product-images\/skus\/Photo_09\.02\.2026_(\d{2}_\d{2}_\d{2})\.jpg$/;

// Fotky z focení 9. 2. se ukazují ve sjednocené verzi (ivory), bílé pozadí nemají.
// Ostatní nahrané fotky s vybělením na čistě bílé pozadí se nezobrazují
// (název souboru bez přípony):
const WHITE_OTHER = new Set([
  '1774353894323-cf1p9h', '1776251741752-90rdel', '1776268073711-6haqk', '1776268216869-mnmd1s',
  '1776271516184-l9ipac', '1776272438533-kva5sv',
]);

function isWhite(url: string): boolean {
  const name = url.split('?')[0].split('/').pop()?.replace(/\.\w+$/, '') ?? '';
  return WHITE_OTHER.has(name);
}

export function skuImage(url: string | null | undefined): string | undefined {
  if (!url || isWhite(url)) return undefined;
  const m = url.match(SHOOT);
  return m ? `/images/sku/${m[1]}.webp` : url;
}

export function skuImages(urls: string[] | null | undefined): string[] {
  return (urls ?? []).map((u) => skuImage(u)).filter((u): u is string => Boolean(u));
}

/** Všechny použitelné fotky produktu (hlavní + galerie) bez bílých a bez duplicit; [] = produkt se nezobrazí. */
export function skuPhotos(imageUrl: string | null | undefined, images: string[] | null | undefined): string[] {
  return Array.from(new Set(skuImages([imageUrl ?? '', ...(images ?? [])].filter(Boolean))));
}
