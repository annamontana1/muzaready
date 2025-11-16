/**
 * Shades Helper - mapa odstínů pro admin konfigurátor
 * Používá existující HAIR_COLORS z types/product.ts
 */

import { HAIR_COLORS } from '@/types/product';

export interface ShadeInfo {
  code: number;
  name: string;
  hex: string;
  colorGroup: 'BARVA1' | 'BARVA2';
}

/**
 * Získá informace o odstínu podle čísla (1-10)
 */
export function getShadeInfo(shadeCode: number): ShadeInfo | null {
  if (shadeCode < 1 || shadeCode > 10) return null;

  const hairColor = HAIR_COLORS[shadeCode];
  if (!hairColor) return null;

  // Urči color_group: 1-3 → BARVA1, 4-10 → BARVA2
  const colorGroup: 'BARVA1' | 'BARVA2' = shadeCode >= 1 && shadeCode <= 3 ? 'BARVA1' : 'BARVA2';

  return {
    code: shadeCode,
    name: hairColor.name,
    hex: hairColor.hex,
    colorGroup,
  };
}

/**
 * Vrátí všechny dostupné odstíny
 */
export function getAllShades(): ShadeInfo[] {
  return Array.from({ length: 10 }, (_, i) => i + 1)
    .map((code) => getShadeInfo(code))
    .filter((info): info is ShadeInfo => info !== null);
}

