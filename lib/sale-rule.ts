// Pravidlo prodeje (majitelka, platí trvale):
// Baby Shades se prodávají jen jako celý culík, všechny ostatní kategorie po gramech s krokem 10 g.
// Jediný zdroj pravdy pro detail, katalog, výpočet ceny i rezervaci skladu.
export const GRAM_STEP = 10;
// Nákup z kusu po gramech: nejméně 50 g, nejvýš 300 g, krok 10 g
export const PIECE_MIN_GRAMS = 50;
export const PIECE_MAX_GRAMS = 300;
// Culík prodávaný po gramech je vyprodaný, když po prodeji zbude 50 g nebo méně (zbytek zůstává v ateliéru)
export const PIECE_SOLD_OUT_AT = 50;

type SaleSku = { saleMode: string; customerCategory?: string | null };
type GramsSku = { availableGrams?: number | null; weightTotalG?: number | null; weightGrams?: number | null };

/** Prodává se po gramech? (zásoba na gramy vždy; jedinečný culík jen mimo Baby Shades) */
export function soldByGrams(sku: SaleSku): boolean {
  return sku.saleMode === 'BULK_G' || sku.customerCategory !== 'BABY_SHADES';
}

/** Kolik gramů z jedinečného culíku ještě zbývá (po dřívějších prodejích po gramech) */
export function pieceGramsLeft(sku: GramsSku): number {
  return sku.availableGrams ?? sku.weightTotalG ?? sku.weightGrams ?? 0;
}

/** Platná gramáž z kusu: 50–300 g po 10 g (nejvýš co zbývá), nebo celý zbytek, pokud je do 300 g */
export function validPieceGrams(grams: number, left: number): boolean {
  if (grams === left) return left <= PIECE_MAX_GRAMS;
  return grams >= PIECE_MIN_GRAMS && grams <= Math.min(left, PIECE_MAX_GRAMS) && grams % GRAM_STEP === 0;
}

/** Nabídka gramáží pro výběr: 50, 60, … do 300 g (nebo do zbytku kusu, je-li menší) */
export function pieceGramOptions(left: number): number[] {
  const top = Math.min(left, PIECE_MAX_GRAMS);
  const out: number[] = [];
  for (let g = PIECE_MIN_GRAMS; g <= top; g += GRAM_STEP) out.push(g);
  if (left <= PIECE_MAX_GRAMS && out[out.length - 1] !== left) out.push(left);
  return out;
}

/** Výchozí gramáž na detailu: 100 g, pokud jde, jinak nejbližší možná */
export function defaultPieceGrams(left: number): number {
  const opts = pieceGramOptions(left);
  return opts.includes(100) ? 100 : opts[opts.length - 1] ?? left;
}
