/**
 * Product Data Types
 * Based on Muza Hair E-shop Technical Specification v2.0
 */

// Category Types
export type ProductCategory = "nebarvene_panenske" | "barvene_blond";
export type ProductTier = "Standard" | "LUXE" | "Platinum edition";
export type HairStructure = "rovné" | "mírně vlnité" | "vlnité" | "kudrnaté";
export type HairEnding = "keratin" | "microkeratin" | "nano_tapes" | "vlasove_tresy";

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
}

// Hair Colors Database
export const HAIR_COLORS: Record<number, HairColor> = {
  1: { code: 1, name: "Jet Black", hex: "#1A1A1A", ribbonColor: "#1A1A1A" },
  2: { code: 2, name: "Dark Brown", hex: "#2C2416", ribbonColor: "#2C2416" },
  3: { code: 3, name: "Medium Brown", hex: "#4A3728", ribbonColor: "#4A3728" },
  4: { code: 4, name: "Chestnut", hex: "#6B5444", ribbonColor: "#6B5444" },
  5: { code: 5, name: "Light Brown", hex: "#8B7355", ribbonColor: "#8B7355" },
  6: { code: 6, name: "Caramel", hex: "#A68A5E", ribbonColor: "#A68A5E" },
  7: { code: 7, name: "Sandy Blonde", hex: "#B39B7A", ribbonColor: "#B39B7A" },
  8: { code: 8, name: "Honey Blonde", hex: "#C9B089", ribbonColor: "#C9B089" },
  9: { code: 9, name: "Ash Blonde", hex: "#D5C5A8", ribbonColor: "#D5C5A8" },
  10: { code: 10, name: "Platinum Blonde", hex: "#E5D5B7", ribbonColor: "#E5D5B7" },
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
