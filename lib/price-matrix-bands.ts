/**
 * Ceník (price_matrix) s cenovými pásmy podle odstínu.
 *
 * Většina kombinací kategorie × typ × délka má jednu cenu. Platinum nebarvené
 * má tři pásma (odstíny 1–3, 4–6, 7–8) s různou cenou — pak rozhoduje odstín kusu.
 * Odstín mimo všechna pásma (např. 9–10) spadne do nejbližšího pásma.
 *
 * Čisté funkce bez databáze, aby šly testovat a použít na serveru i v adminu.
 */

export interface MatrixRow {
  category: string;
  tier: string;
  lengthCm: number;
  shadeRangeStart: number | null;
  shadeRangeEnd: number | null;
  pricePerGramCzk: number | string | { toString(): string };
}

const SHADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const MIDDLE_SHADE = 5;

function priceOf(row: MatrixRow): number {
  const p = row.pricePerGramCzk;
  return typeof p === 'number' ? p : parseFloat(p.toString());
}

function hasRange(row: MatrixRow): boolean {
  return row.shadeRangeStart != null && row.shadeRangeEnd != null;
}

/** Vzdálenost odstínu od pásma (0 = odstín v pásmu leží). Jen pro řádky s pásmem. */
function distance(row: MatrixRow, shade: number): number {
  const start = row.shadeRangeStart as number;
  const end = row.shadeRangeEnd as number;
  if (shade < start) return start - shade;
  if (shade > end) return shade - end;
  return 0;
}

/**
 * Vybere řádek ceníku pro daný odstín z řádků jedné kombinace kategorie × typ × délka.
 * Pořadí: pásmo obsahující odstín → nejbližší pásmo → řádek bez pásma → první řádek.
 */
export function pickMatrixRow<T extends MatrixRow>(rows: T[], shade?: number | null): T | null {
  if (rows.length === 0) return null;
  if (rows.length === 1) return rows[0];

  const banded = rows.filter(hasRange);
  const open = rows.find((r) => !hasRange(r));

  if (shade != null && !Number.isNaN(shade) && banded.length > 0) {
    // Při shodné vzdálenosti vyhrává nižší (tmavší) pásmo — řazení je stabilní
    const sorted = [...banded].sort(
      (a, b) =>
        distance(a, shade) - distance(b, shade) ||
        (a.shadeRangeStart as number) - (b.shadeRangeStart as number)
    );
    return sorted[0];
  }

  if (open) return open;
  if (banded.length > 0) return pickMatrixRow(banded, MIDDLE_SHADE);
  return rows[0];
}

export function matrixBaseKey(category: string, tier: string, lengthCm: number): string {
  return `${category}_${tier}_${lengthCm}`;
}

/**
 * Mapa cen: základní klíč `kategorie_tier_délka` (jedna cena, nebo výchozí pásmo)
 * a u kombinací s více pásmy navíc `kategorie_tier_délka_s<odstín>` pro odstíny 1–10.
 */
export function buildPriceMatrixMap(rows: MatrixRow[]): Map<string, number> {
  const groups = new Map<string, MatrixRow[]>();
  for (const row of rows) {
    const key = matrixBaseKey(row.category, row.tier, row.lengthCm);
    const group = groups.get(key);
    if (group) group.push(row);
    else groups.set(key, [row]);
  }

  const map = new Map<string, number>();
  groups.forEach((group, key) => {
    const base = pickMatrixRow(group, null);
    if (base) map.set(key, priceOf(base));
    if (group.length > 1) {
      for (const shade of SHADES) {
        const row = pickMatrixRow(group, shade);
        if (row) map.set(`${key}_s${shade}`, priceOf(row));
      }
    }
  });
  return map;
}

/** Cena za gram z mapy pro konkrétní kus (odstín je nepovinný). */
export function matrixPriceFor(
  map: Map<string, number>,
  category: string,
  tier: string,
  lengthCm: number | null | undefined,
  shade?: number | string | null
): number | undefined {
  if (lengthCm == null) return undefined;
  const key = matrixBaseKey(category, tier, lengthCm);
  const shadeNum = typeof shade === 'string' ? parseInt(shade, 10) : shade;
  if (shadeNum != null && !Number.isNaN(shadeNum)) {
    const banded = map.get(`${key}_s${shadeNum}`);
    if (banded !== undefined) return banded;
  }
  return map.get(key);
}
