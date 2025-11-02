/**
 * Pricing Types
 * Based on Muza Hair E-shop Technical Specification v2.0
 */

import { ProductCategory, ProductTier, HairStructure, HairEnding } from "./product";

// Pricing Configuration
export interface PricingConfig {
  base_price_per_100g_45cm_czk: Record<ProductCategory, Record<ProductTier, number>>;
  length_multiplier: Record<number, number>;
  structure_multiplier: Record<HairStructure, number>;
  shade_surcharge_czk: {
    barvene_blond: Record<number, number>;
  };
  ending_surcharge_czk: Record<HairEnding, number>;
  weight_step_g: number;
  rounding_rule: string;
}

// Price Calculation Input
export interface PriceCalculationInput {
  category: ProductCategory;
  tier: ProductTier;
  shade: number;
  lengthCm: number;
  weightG: number;
  structure: HairStructure;
  ending: HairEnding;
}

// Pricing Configuration Data
export const PRICING_CONFIG: PricingConfig = {
  base_price_per_100g_45cm_czk: {
    nebarvene_panenske: {
      Standard: 6900,
      LUXE: 8900,
      "Platinum edition": 10900,
    },
    barvene_blond: {
      Standard: 5900,
      LUXE: 7900,
      "Platinum edition": 9900,
    },
  },

  length_multiplier: {
    35: 0.85,
    40: 0.92,
    45: 1.0,
    50: 1.08,
    55: 1.16,
    60: 1.25,
    65: 1.36,
    70: 1.48,
    75: 1.62,
    80: 1.78,
    85: 1.95,
    90: 2.15,
  },

  structure_multiplier: {
    rovné: 1.0,
    "mírně vlnité": 1.03,
    vlnité: 1.06,
    kudrnaté: 1.1,
  },

  shade_surcharge_czk: {
    barvene_blond: {
      5: 0,
      6: 90,
      7: 180,
      8: 290,
      9: 390,
      10: 490,
    },
  },

  ending_surcharge_czk: {
    keratin: 0,
    microkeratin: 0,
    nano_tapes: 450,
    sewing_weft: 650,
  },

  weight_step_g: 10,
  rounding_rule: "round_to_10_czk",
};
