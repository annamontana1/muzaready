/**
 * Product Data Types
 * Based on Muza Hair E-shop Technical Specification v2.0
 */

// Category Types
export type ProductCategory = "nebarvene_panenske" | "barvene_blond";
export type ProductTier = "Standard" | "LUXE" | "Platinum edition";
export type ProductTierNormalized = "standard" | "luxe" | "platinum";
export type HairStructure = "rovné" | "mírně vlnité" | "vlnité" | "kudrnaté";
export type HairEnding = "keratin" | "microkeratin" | "nano_tapes" | "vlasove_tresy";
export type SoftnessScale = 1 | 2 | 3;

// Product Interface
export interface Product {
  // Identity
  id: string;
  sku: string;
  slug: string;

  // Kategorizace
  category: ProductCategory;
  tier: ProductTier;

  // Základní info
  name: string;
  description: string;

  // Měření
  measurement_note: string; // "Měříme tak, jak jsou (nenatažené)"

  // Varianty
  variants: ProductVariant[];

  // Media
  images: {
    main: string;
    hover: string;
    gallery: string[];
    structure_detail?: string;
    ending_detail?: string;
  };

  // Pricing (base)
  base_price_per_100g_45cm: number; // v Kč

  // Inventory
  in_stock: boolean;
  stock_quantity?: number;
  lead_time_days?: number; // Pokud není skladem

  // SEO
  meta_title: string;
  meta_description: string;

  // Features
  features: string[];
  care_instructions: string;
  how_to_use: string;

  // Reviews
  average_rating: number;
  review_count: number;

  // Internal
  origin_code?: string;
  supplier?: string;
  processing_location?: string;
  batch?: string;

  // Search fields (denormalized for efficient search)
  tier_normalized: ProductTierNormalized;
  tier_keywords: string[]; // includes synonyms and typos
  softness_scale: SoftnessScale;
  search_text: string; // normalized text without diacritics for full-text search

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

// Product Variant Interface
export interface ProductVariant {
  id: string;
  sku: string; // Format: CAT-TIER-SHD-LEN-W-STR-END-BATCH

  // Konfigurace
  shade: number; // 1-10
  shade_name: string; // "Jet Black", "Platinum Blonde"
  shade_hex: string; // "#1A1A1A"

  length_cm: number; // 35-90
  weight_g: number; // 50-300 (step 10g)

  structure: HairStructure;
  ending: HairEnding;

  // Cena (vypočtená)
  price_czk: number;

  // Inventory
  in_stock: boolean;
  stock_quantity: number;

  // Dekorace
  ribbon_color: string; // Barva mašle podle odstínu
}

// Hair Color Definition
export interface HairColor {
  code: number; // 1-10
  name: string;
  hex: string;
  ribbonColor: string;
  synonyms: string[]; // CZ + EN synonyma
}

// Hair Colors Database
export const HAIR_COLORS: Record<number, HairColor> = {
  1: {
    code: 1,
    name: "Černá",
    hex: "#1A1A1A",
    ribbonColor: "#1A1A1A",
    synonyms: ["uhlová", "ebenová", "jet black", "black", "cerna"],
  },
  2: {
    code: 2,
    name: "Velmi tmavá hnědá",
    hex: "#2C2416",
    ribbonColor: "#2C2416",
    synonyms: ["espresso", "moka", "téměř černá", "temer cerna", "velmi tmava hneda"],
  },
  3: {
    code: 3,
    name: "Tmavá hnědá",
    hex: "#4A3728",
    ribbonColor: "#4A3728",
    synonyms: ["čokoládová", "kakaová", "tmavě kaštanová", "cokoladova", "tmave kaštanova", "tmava hneda"],
  },
  4: {
    code: 4,
    name: "Hnědá",
    hex: "#6B5444",
    ribbonColor: "#6B5444",
    synonyms: ["kaštanová", "ořechová", "čokoládová hnědá", "kastanova", "orechova", "hneda"],
  },
  5: {
    code: 5,
    name: "Světlá hnědá",
    hex: "#8B7355",
    ribbonColor: "#8B7355",
    synonyms: ["karamelová", "medová hnědá", "skořicová", "karamelova", "medova hneda", "skoricova", "svetla hneda"],
  },
  6: {
    code: 6,
    name: "Tmavá blond",
    hex: "#A68A5E",
    ribbonColor: "#A68A5E",
    synonyms: ["špinavá blond", "dark blonde", "popelavě blond tmavá", "spinava blond", "popelave blond tmava", "tmava blond"],
  },
  7: {
    code: 7,
    name: "Blond",
    hex: "#B39B7A",
    ribbonColor: "#B39B7A",
    synonyms: ["přírodní blond", "zlatá blond", "medová blond", "prirodni blond", "zlata blond", "medova blond", "blonde"],
  },
  8: {
    code: 8,
    name: "Světlá blond",
    hex: "#C9B089",
    ribbonColor: "#C9B089",
    synonyms: ["light blonde", "vanilková blond", "skandinávská blond", "vanilkova blond", "skandinavska blond", "svetla blond"],
  },
  9: {
    code: 9,
    name: "Velmi světlá blond",
    hex: "#D5C5A8",
    ribbonColor: "#D5C5A8",
    synonyms: ["písková blond", "champagne blond", "icy blond", "piskova blond", "champagne", "velmi svetla blond"],
  },
  10: {
    code: 10,
    name: "Ultra světlá blond / platinová blond",
    hex: "#E5D5B7",
    ribbonColor: "#E5D5B7",
    synonyms: ["platinová", "platinum", "nordic blond", "platinova", "ultra svetla blond"],
  },
};

// Color Families - rodiny barev pro vyhledávání
export const COLOR_FAMILIES: Record<string, number[]> = {
  "hneda": [2, 3, 4, 5],
  "hnědá": [2, 3, 4, 5],
  "brown": [2, 3, 4, 5],
  "blond": [6, 7, 8, 9, 10],
  "blonde": [6, 7, 8, 9, 10],
  "platinova": [10],
  "platinová": [10],
  "platinum": [10],
  "nordic": [10],
  "piskova": [9],
  "písková": [9],
  "champagne": [9],
  "icy": [9],
  "spinava blond": [6, 7],
  "špinavá blond": [6, 7],
  "dirty blond": [6, 7],
};

// Method Synonyms - synonyma metod pro vyhledávání
export const METHOD_SYNONYMS: Record<string, string[]> = {
  keratin: ["keratinové prameny", "keratin na prodloužení", "keratinove prameny"],
  mikrokeratin: ["micro keratin", "mikro keratin", "microkeratin"],
  "nano_tapes": ["vlasové pásky", "pásky do vlasů", "nano pásky", "vlasove pasky", "pasky do vlasu", "tape-in", "tape in"],
  vlasove_tresy: ["tresy", "šitý tres", "ručně šitý tres", "sity tres", "rucne sity tres", "sewing weft", "hand-tied weft"],
};

// Category Configuration
export interface CategoryConfig {
  nebarvene_panenske: {
    shades: {
      standard: number[];
      luxe: number[];
      platinum: number[];
    };
    lengths_cm: number[]; // 35-90
    weights_g: string[]; // ["50-100", "100-120", ...]
    structures: HairStructure[];
    endings: HairEnding[];
    tiers: ProductTier[];
  };
  barvene_blond: {
    shades: number[];
    lengths_cm: number[];
    weights_g: string[];
    structures: HairStructure[];
    endings: HairEnding[];
    tiers: ProductTier[];
  };
}

// Category Rules
export const CATEGORY_RULES: CategoryConfig = {
  nebarvene_panenske: {
    shades: {
      standard: [1, 2, 3, 4, 5],
      luxe: [1, 2, 3, 4, 5],
      platinum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    lengths_cm: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
    weights_g: ["50-100", "100-120", "120-150", "150-180", "180-230", "230+"],
    structures: ["rovné", "mírně vlnité", "vlnité", "kudrnaté"],
    endings: ["keratin", "microkeratin", "nano_tapes", "vlasove_tresy"],
    tiers: ["Standard", "LUXE", "Platinum edition"],
  },
  barvene_blond: {
    shades: [5, 6, 7, 8, 9, 10],
    lengths_cm: [35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90],
    weights_g: ["50-100", "100-120", "120-150", "150-180", "180-230", "230+"],
    structures: ["rovné", "mírně vlnité", "vlnité", "kudrnaté"],
    endings: ["keratin", "microkeratin", "nano_tapes", "vlasove_tresy"],
    tiers: ["Standard", "LUXE", "Platinum edition"],
  },
};

// Tier Keywords and Synonyms
export const TIER_KEYWORDS: Record<ProductTierNormalized, string[]> = {
  standard: ["standard", "standart", "std", "zakladni"],
  luxe: ["luxe", "lux", "luxusni", "luxury"],
  platinum: ["platinum", "platinova", "platinum edition", "plat"],
};

// Search Synonyms Map
export const SEARCH_SYNONYMS: Record<string, string> = {
  standart: "standard",
  platinova: "platinum",
  lux: "luxe",
  luxusni: "luxe",
  luxury: "luxe",
  plat: "platinum",
  std: "standard",
  zakladni: "standard",
};

// Filter Types
export interface ProductFilters {
  category?: ProductCategory;
  tier?: ProductTier[];
  shade?: number[];
  length?: [number, number]; // Range
  weight?: string[];
  structure?: HairStructure[];
  ending?: HairEnding[];
  price?: [number, number]; // Range
  in_stock?: boolean;
}

// Sort Options
export type SortOption =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "bestsellers";

export const SORT_OPTIONS = [
  { value: "recommended", label: "Doporučené" },
  { value: "price-asc", label: "Cena: Od nejnižší" },
  { value: "price-desc", label: "Cena: Od nejvyšší" },
  { value: "newest", label: "Nejnovější" },
  { value: "bestsellers", label: "Nejprodávanější" },
] as const;
