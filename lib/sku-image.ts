// Fotky culíků z focení 9. 2. 2026 jsou v Supabase s různě nasvíceným pozadím.
// Sjednocené verze (pozadí ivory #F0EAE3) leží v /public/images/sku, takže je API
// vrací místo originálů. Ostatní adresy projdou beze změny.
const SHOOT = /\/product-images\/skus\/Photo_09\.02\.2026_(\d{2}_\d{2}_\d{2})\.jpg$/;

export function skuImage(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const m = url.match(SHOOT);
  return m ? `/images/sku/${m[1]}.webp` : url;
}

export function skuImages(urls: string[] | null | undefined): string[] {
  return (urls ?? []).map((u) => skuImage(u)).filter((u): u is string => Boolean(u));
}
