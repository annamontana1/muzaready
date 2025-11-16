/**
 * SKU Generator
 * Generuje SKU podle formátu: CAT-TIER-SHD-LEN-W-STR-END-BATCH
 */

import {
  ProductCategory,
  ProductTier,
  HairStructure,
  HairEnding,
} from "@/types/product";

interface SKUParams {
  category: ProductCategory;
  tier: ProductTier;
  shade: number;
  lengthCm: number;
  weightGrams: number;
  structure: HairStructure;
  ending: HairEnding;
  batch?: string;
}

// Token mappings
const SKU_TOKENS = {
  category: {
    nebarvene_panenske: "NB",
    barvene_blond: "BB",
  },
  tier: {
    Standard: "ST",
    LUXE: "LX",
    "Platinum edition": "PL",
  },
  structure: {
    rovné: "R",
    "mírně vlnité": "MV",
    vlnité: "V",
    kudrnaté: "K",
  },
  ending: {
    keratin: "KER",
    microkeratin: "MKR",
    nano_tapes: "NTP",
    vlasove_tresy: "VTR",
  },
};

/**
 * Generuje SKU podle specifikace
 *
 * Příklad: NB-LX-4-60-120-MV-KER-A25
 * (Nebarvené, LUXE, odstín 4, 60cm, 120g, mírně vlnité, keratin, šarže A25)
 */
export function generateSKU(params: SKUParams): string {
  const cat = SKU_TOKENS.category[params.category];
  const tier = SKU_TOKENS.tier[params.tier];
  const shade = params.shade.toString().padStart(2, "0"); // 01-10
  const length = params.lengthCm.toString(); // 35-90
  const weight = params.weightGrams.toString().padStart(3, "0"); // 050-300
  const structure = SKU_TOKENS.structure[params.structure];
  const ending = SKU_TOKENS.ending[params.ending];
  const batch = params.batch || "A01"; // Default batch

  return `${cat}-${tier}-${shade}-${length}-${weight}-${structure}-${ending}-${batch}`;
}

/**
 * Parsuje SKU zpět na parametry
 */
export function parseSKU(sku: string): SKUParams | null {
  const parts = sku.split("-");
  if (parts.length !== 8) return null;

  const [cat, tier, shade, length, weight, structure, ending, batch] = parts;

  // Reverse lookup
  const category = Object.entries(SKU_TOKENS.category).find(
    ([, v]) => v === cat
  )?.[0] as ProductCategory | undefined;

  const tierFull = Object.entries(SKU_TOKENS.tier).find(
    ([, v]) => v === tier
  )?.[0] as ProductTier | undefined;

  const structureFull = Object.entries(SKU_TOKENS.structure).find(
    ([, v]) => v === structure
  )?.[0] as HairStructure | undefined;

  const endingFull = Object.entries(SKU_TOKENS.ending).find(
    ([, v]) => v === ending
  )?.[0] as HairEnding | undefined;

  if (!category || !tierFull || !structureFull || !endingFull) return null;

  return {
    category,
    tier: tierFull,
    shade: parseInt(shade, 10),
    lengthCm: parseInt(length, 10),
    weightGrams: parseInt(weight, 10),
    structure: structureFull,
    ending: endingFull,
    batch,
  };
}

/**
 * Validuje SKU formát
 */
export function isValidSKU(sku: string): boolean {
  return parseSKU(sku) !== null;
}
