/**
 * Utilities for selecting optimal BULK product configurations
 * Used for catalog cards and PDP pre-filling
 */

import { Product, ProductVariant } from '@/types/product';
import { BULK_DEFAULT_GRAMS, BULK_DEFAULT_LENGTH_CM, BULK_LENGTH_FALLBACK_ORDER } from './bulk-defaults';

/**
 * Normalize grams to valid step value
 * Rounds up to next valid step
 */
export function normalizeGrams(
  wanted: number,
  minOrderGrams: number = 50,
  stepGrams: number = 10
): number {
  if (wanted < minOrderGrams) return minOrderGrams;

  const steps = Math.ceil((wanted - minOrderGrams) / stepGrams);
  return minOrderGrams + steps * stepGrams;
}

/**
 * Build prioritized length fallback order
 * Respects portfolio if provided, then fills in missing lengths
 */
export function buildLengthFallbackOrder(
  target: number,
  portfolio?: number[]
): number[] {
  // Start with explicit target
  const order: number[] = [target];

  // Add portfolio lengths in order if provided
  if (portfolio && portfolio.length > 0) {
    for (const len of portfolio) {
      if (len !== target && !order.includes(len)) {
        order.push(len);
      }
    }
  }

  // Fill in standard fallback order
  for (const len of BULK_LENGTH_FALLBACK_ORDER) {
    if (len !== target && !order.includes(len)) {
      order.push(len);
    }
  }

  return order;
}

export interface DefaultBulkCombo {
  lengthCm: number;
  grams: number;
  structure?: string;
  ending?: string;
  variant?: ProductVariant;
}

/**
 * Pick optimal default BULK configuration for a product
 *
 * Strategy:
 * 1. 100g + 45cm with preferred structure/ending (if exist)
 * 2. 100g + 45cm (any structure/ending)
 * 3. 100g + fallback lengths (40, 50, 55, ...)
 * 4. null (no available 100g in any length)
 */
export function pickDefaultBulkCombo(product: Product): DefaultBulkCombo | null {
  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  const normalizedGrams = normalizeGrams(BULK_DEFAULT_GRAMS);
  const targetLength = BULK_DEFAULT_LENGTH_CM;

  // Build portfolio from all variant lengths
  const availableLengths = Array.from(
    new Set(product.variants.map(v => v.length_cm))
  ).sort((a, b) => a - b);

  const lengthOrder = buildLengthFallbackOrder(targetLength, availableLengths);

  // Step 1: Try 100g + 45cm with preferred structure
  const preferred45 = product.variants.find(
    v => v.length_cm === targetLength &&
         v.weight_g >= normalizedGrams &&
         v.in_stock
  );

  if (preferred45) {
    return {
      lengthCm: targetLength,
      grams: normalizedGrams,
      structure: preferred45.structure,
      ending: preferred45.ending,
      variant: preferred45,
    };
  }

  // Step 2: Try 100g + fallback lengths in order
  for (const length of lengthOrder) {
    if (length === targetLength) continue; // Already tried

    const variant = product.variants.find(
      v => v.length_cm === length &&
           v.weight_g >= normalizedGrams &&
           v.in_stock
    );

    if (variant) {
      return {
        lengthCm: length,
        grams: normalizedGrams,
        structure: variant.structure,
        ending: variant.ending,
        variant: variant,
      };
    }
  }

  // Step 3: No available 100g in any length
  return null;
}

/**
 * Get display text for default grams/length combo
 * e.g., "100 g • 45 cm"
 */
export function formatBulkComboDisplay(combo: DefaultBulkCombo | null): string {
  if (!combo) return 'Cena na dotaz';
  return `${combo.grams} g • ${combo.lengthCm} cm`;
}

/**
 * Calculate price for a BULK product at default configuration
 */
export function calculateBulkPrice(
  pricePerGramCzk: number,
  combo: DefaultBulkCombo | null
): number | null {
  if (!combo) return null;
  // Ponech přesnost na 2 desetinná místa bez zaokrouhlování
  return Number((pricePerGramCzk * combo.grams).toFixed(2));
}
