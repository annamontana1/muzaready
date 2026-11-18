import { describe, expect, it } from 'vitest';
import { buildPriceMatrixMap, matrixPriceFor, pickMatrixRow, type MatrixRow } from '../price-matrix-bands';

const row = (
  category: string, tier: string, lengthCm: number, price: number,
  start: number | null = null, end: number | null = null
): MatrixRow => ({ category, tier, lengthCm, pricePerGramCzk: price, shadeRangeStart: start, shadeRangeEnd: end });

// Platinum nebarvené 50 cm: tři pásma podle ceníku
const platinum50 = [
  row('nebarvene', 'platinum', 50, 85, 1, 3),
  row('nebarvene', 'platinum', 50, 105, 4, 6),
  row('nebarvene', 'platinum', 50, 130, 7, 8),
];

describe('pickMatrixRow', () => {
  it('vybere pásmo, do kterého odstín patří', () => {
    expect(pickMatrixRow(platinum50, 2)?.pricePerGramCzk).toBe(85);
    expect(pickMatrixRow(platinum50, 4)?.pricePerGramCzk).toBe(105);
    expect(pickMatrixRow(platinum50, 8)?.pricePerGramCzk).toBe(130);
  });

  it('odstín mimo pásma (9, 10) spadne do nejbližšího', () => {
    expect(pickMatrixRow(platinum50, 9)?.pricePerGramCzk).toBe(130);
    expect(pickMatrixRow(platinum50, 10)?.pricePerGramCzk).toBe(130);
  });

  it('bez odstínu použije střední pásmo', () => {
    expect(pickMatrixRow(platinum50, null)?.pricePerGramCzk).toBe(105);
  });

  it('jediný řádek platí pro všechny odstíny, i mimo jeho rozsah', () => {
    const luxe = [row('nebarvene', 'luxe', 50, 79, 1, 5)];
    expect(pickMatrixRow(luxe, 9)?.pricePerGramCzk).toBe(79);
    expect(pickMatrixRow(luxe, null)?.pricePerGramCzk).toBe(79);
  });

  it('prázdný seznam vrací null', () => {
    expect(pickMatrixRow([], 5)).toBeNull();
  });
});

describe('buildPriceMatrixMap + matrixPriceFor', () => {
  const map = buildPriceMatrixMap([
    ...platinum50,
    row('barvene', 'platinum', 50, 122, 7, 10),
    row('nebarvene', 'standard', 50, 60, 1, 4),
    row('nebarvene', 'standard', 30, 0, 1, 4),
  ]);

  it('Platinum nebarvené: cena podle odstínu kusu', () => {
    expect(matrixPriceFor(map, 'nebarvene', 'platinum', 50, '2')).toBe(85);
    expect(matrixPriceFor(map, 'nebarvene', 'platinum', 50, 5)).toBe(105);
    expect(matrixPriceFor(map, 'nebarvene', 'platinum', 50, '10')).toBe(130);
    expect(matrixPriceFor(map, 'nebarvene', 'platinum', 50, null)).toBe(105);
  });

  it('kombinace s jednou cenou se chová jako dřív (odstín nehraje roli)', () => {
    expect(matrixPriceFor(map, 'barvene', 'platinum', 50, 5)).toBe(122);
    expect(matrixPriceFor(map, 'nebarvene', 'standard', 50, 3)).toBe(60);
    expect(matrixPriceFor(map, 'nebarvene', 'standard', 50)).toBe(60);
  });

  it('nesmyslný odstín (např. "undefined") se ignoruje', () => {
    expect(matrixPriceFor(map, 'nebarvene', 'platinum', 50, 'undefined')).toBe(105);
  });

  it('chybějící délka nebo kombinace vrací undefined; nulová cena zůstává 0', () => {
    expect(matrixPriceFor(map, 'nebarvene', 'luxe', 50, 3)).toBeUndefined();
    expect(matrixPriceFor(map, 'nebarvene', 'standard', null, 3)).toBeUndefined();
    expect(matrixPriceFor(map, 'nebarvene', 'standard', 30, 3)).toBe(0);
  });
});
