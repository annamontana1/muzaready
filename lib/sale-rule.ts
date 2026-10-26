// Pravidlo prodeje (majitelka, platí trvale):
// Baby Shades se prodávají jen jako celý culík, všechny ostatní kategorie po gramech s krokem 10 g.
// Jediný zdroj pravdy pro detail, katalog, výpočet ceny i rezervaci skladu.
export const GRAM_STEP = 10;
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

/** Platná gramáž z culíku: násobek kroku od kroku do zbytku, nebo celý zbytek */
export function validPieceGrams(grams: number, left: number): boolean {
  return grams === left || (grams >= GRAM_STEP && grams <= left && grams % GRAM_STEP === 0);
}
