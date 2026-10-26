// Pravidlo prodeje (majitelka, platí trvale):
// Baby Shades se prodávají jen jako celý culík, všechny ostatní kategorie po gramech:
// u každého kusu si zákaznice vybere délku z ceníku a 50–300 g po 10 g.
// Sklad se u prodeje po gramech nekontroluje (vede se souhrnně po odstínech).
// Jediný zdroj pravdy pro detail, katalog, výpočet ceny i objednávku.
export const GRAM_STEP = 10;
export const PIECE_MIN_GRAMS = 50;
export const PIECE_MAX_GRAMS = 300;
export const PIECE_DEFAULT_GRAMS = 100;
// Délky na výběr u kusu po gramech (sklad se povede po odstínu a délce, cena podle délky)
export const PIECE_LENGTHS = Array.from({ length: 13 }, (_, i) => 30 + i * 5); // 30–90 cm po 5 cm
export const PIECE_DEFAULT_LENGTH = 50;

type SaleSku = { saleMode: string; customerCategory?: string | null };
type GramsSku = { availableGrams?: number | null; weightTotalG?: number | null; weightGrams?: number | null };

/** Prodává se po gramech? (zásoba na gramy vždy; kus mimo Baby Shades také) */
export function soldByGrams(sku: SaleSku): boolean {
  return sku.saleMode === 'BULK_G' || sku.customerCategory !== 'BABY_SHADES';
}

/** Hmotnost celého culíku (Baby Shades se prodávají celé) */
export function pieceGramsLeft(sku: GramsSku): number {
  return sku.availableGrams ?? sku.weightTotalG ?? sku.weightGrams ?? 0;
}

/** Platná gramáž při prodeji kusu po gramech: 50–300 g po 10 g */
export function validPieceGrams(grams: number): boolean {
  return grams >= PIECE_MIN_GRAMS && grams <= PIECE_MAX_GRAMS && grams % GRAM_STEP === 0;
}

/** Nabídka gramáží: 50, 60, … 300 */
export function pieceGramOptions(): number[] {
  const out: number[] = [];
  for (let g = PIECE_MIN_GRAMS; g <= PIECE_MAX_GRAMS; g += GRAM_STEP) out.push(g);
  return out;
}

/** Ceník (price_matrix): kategorie podle druhu kusu, tier podle kategorie zákazníka */
export function matrixCategory(sku: { saleMode: string; isDyed?: boolean | null; shade?: string | null }): 'barvene' | 'nebarvene' {
  if (sku.saleMode === 'PIECE_BY_WEIGHT') return sku.isDyed ? 'barvene' : 'nebarvene';
  return parseInt(sku.shade || '1', 10) >= 5 ? 'barvene' : 'nebarvene';
}
export const MATRIX_TIER: Record<string, string> = {
  STANDARD: 'standard',
  LUXE: 'luxe',
  PLATINUM_EDITION: 'platinum',
  BABY_SHADES: 'baby_shades',
};
