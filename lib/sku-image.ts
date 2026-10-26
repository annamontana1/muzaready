// Fotky culíků z focení 9. 2. 2026 jsou v Supabase s různě nasvíceným pozadím.
// Sjednocené verze (pozadí ivory #F0EAE3) leží v /public/images/sku, takže je API
// vrací místo originálů. Ostatní adresy projdou beze změny, bílé fotky vypadnou.
const SHOOT = /\/product-images\/skus\/Photo_09\.02\.2026_(\d{2}_\d{2}_\d{2})\.jpg$/;

// Fotky s vybělením na čistě bílé pozadí: na e-shopu se nezobrazují.
// Z focení 9. 2. 2026 (čas snímku):
const WHITE_SHOOT = new Set([
  '11_51_23', '12_01_49', '12_02_49', '12_06_05', '12_07_12', '12_09_29',
  '12_10_46', '12_12_20', '12_13_19', '12_18_19', '12_19_57', '12_21_16',
  '12_21_23', '12_23_22', '12_24_04', '12_26_33', '12_28_04', '12_29_19',
  '12_30_32', '12_32_39', '12_33_29', '12_34_25', '12_35_32', '12_37_36',
  '12_39_44', '12_40_57', '12_42_23', '12_43_12', '12_43_22', '12_44_14',
  '12_44_58', '12_45_40', '12_46_52', '12_48_32', '12_50_17', '12_52_15',
  '12_52_30', '12_53_39', '12_54_52', '12_55_39', '12_56_55', '13_03_05',
  '13_04_23', '13_05_43', '13_06_36', '13_08_28', '13_08_41', '13_09_41',
  '13_10_50', '13_12_06', '13_13_21', '13_14_19', '13_16_56', '13_18_15',
  '13_26_12', '13_28_25', '13_28_39',
]);
// Ostatní nahrané fotky (název souboru bez přípony):
const WHITE_OTHER = new Set([
  '1774353894323-cf1p9h', '1776251741752-90rdel', '1776268073711-6haqk', '1776268216869-mnmd1s',
  '1776271516184-l9ipac', '1776272438533-kva5sv',
]);

function isWhite(url: string): boolean {
  const t = url.match(/Photo[_-]09\.02\.2026[_-](\d{2})[_-](\d{2})[_-](\d{2})/);
  if (t) return WHITE_SHOOT.has(`${t[1]}_${t[2]}_${t[3]}`);
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
