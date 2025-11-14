/**
 * Catalog Adapter - převádí SKU data ze skladu na Product Card View Model
 * 
 * LOGIKA:
 * - VlasyX (Standard/LUXE): BULK_G - spočítá zásobu v gramech po délkách z pohybů
 * - VlasyY (Platinum): PIECE_BY_WEIGHT - inStock (qty > 0)
 */

import prisma from './prisma';
import { Product, ProductVariant, ProductCategory, ProductTier, HAIR_COLORS } from '@/types/product';

// Fallback délky pro rychlé "Do košíku" (100g)
const FALLBACK_LENGTHS = [45, 40, 50, 55, 60, 65, 70, 75, 80];

interface SkuWithStock {
  id: string;
  sku: string;
  name: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | null;
  shade: string | null;
  shadeName: string | null;
  shadeHex: string | null;
  lengthCm: number | null;
  structure: string | null;
  saleMode: 'PIECE_BY_WEIGHT' | 'BULK_G';
  pricePerGramCzk: number;
  weightTotalG: number | null;
  availableGrams: number | null;
  minOrderG: number | null;
  stepG: number | null;
  inStock: boolean;
  soldOut: boolean;
  isListed: boolean;
  listingPriority: number | null;
  createdAt: Date;
  updatedAt: Date;
  // Vypočtené z pohybů (pro BULK_G)
  stockByLength?: Map<number, number>; // lengthCm -> available grams
}

/**
 * Spočítá zásobu v gramech po délkách z pohybů skladu
 */
async function calculateStockByLength(skuId: string): Promise<Map<number, number>> {
  const movements = await prisma.stockMovement.findMany({
    where: { skuId },
    orderBy: { createdAt: 'asc' },
  });

  const stockMap = new Map<number, number>();
  
  // Pro BULK_G potřebujeme seskupit podle délky
  // Pro jednoduchost použijeme availableGrams z SKU, pokud není délka specifikována
  // TODO: Pokud máme v movements informaci o délce, použijeme ji
  
  return stockMap;
}

/**
 * Mapuje customerCategory na ProductTier
 */
function mapCustomerCategoryToTier(category: string | null): ProductTier {
  switch (category) {
    case 'STANDARD':
      return 'Standard';
    case 'LUXE':
      return 'LUXE';
    case 'PLATINUM_EDITION':
      return 'Platinum edition';
    default:
      return 'Standard';
  }
}

/**
 * Mapuje shade string na číslo
 */
function parseShadeCode(shade: string | null): number | null {
  if (!shade) return null;
  // Zkus extrahovat číslo z shade (např. "1", "shade-1", "odstin-5")
  const match = shade.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Vytvoří slug z produktu
 */
function createSlug(
  category: ProductCategory,
  tier: ProductTier,
  shade: number | null,
  structure: string | null,
  lengthCm: number | null
): string {
  const categorySlug = category === 'nebarvene_panenske' ? 'nebarvene' : 'barvene';
  const tierSlug = tier === 'Standard' ? 'standard' : tier === 'LUXE' ? 'luxe' : 'platinum-edition';
  const shadeSlug = shade ? `odstin-${shade}` : 'odstin-1';
  const structureSlug = structure ? structure.replace(/\s+/g, '-') : 'rovne';
  const lengthSlug = lengthCm ? `-${lengthCm}cm` : '';
  
  return `${categorySlug}-${tierSlug}-${shadeSlug}-${structureSlug}${lengthSlug}`;
}

/**
 * Načte SKU ze skladu a převede na Product Card View Model
 */
export async function getCatalogProducts(
  categoryParam?: ProductCategory,
  tier?: ProductTier
): Promise<Product[]> {
  const where: any = {
    isListed: true,
    inStock: true,
  };

  // Filtrování podle kategorie
  // Pro nebarvené: shade 1-4 nebo shade není 5-10
  // Pro barvené: shade 5-10 nebo shadeName obsahuje "blond"
  if (categoryParam) {
    if (categoryParam === 'nebarvene_panenske') {
      // Nebarvené: shade 1-4 nebo shadeName neobsahuje "blond"
      where.OR = [
        { shade: { in: ['1', '2', '3', '4'] } },
        { 
          AND: [
            { shade: { not: { in: ['5', '6', '7', '8', '9', '10'] } } },
            { shadeName: { not: { contains: 'blond' } } },
          ]
        },
      ];
    } else {
      // Barvené: shade 5-10 nebo shadeName obsahuje "blond"
      where.OR = [
        { shade: { in: ['5', '6', '7', '8', '9', '10'] } },
        { shadeName: { contains: 'blond' } },
      ];
    }
  }

  // Filtrování podle tieru
  if (tier) {
    const tierMap: Record<ProductTier, string> = {
      'Standard': 'STANDARD',
      'LUXE': 'LUXE',
      'Platinum edition': 'PLATINUM_EDITION',
    };
    where.customerCategory = tierMap[tier];
  }

  const skus = await prisma.sku.findMany({
    where,
    include: {
      movements: {
        orderBy: { createdAt: 'desc' },
        take: 100, // Posledních 100 pohybů pro výpočet zásoby
      },
    },
    orderBy: [
      { listingPriority: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  // Debug logging
  console.log(`[Catalog Adapter] Found ${skus.length} SKUs with filters:`, JSON.stringify(where, null, 2));

  // Seskupení SKU podle kombinace: category + tier + shade + structure
  // Pro VlasyX (Standard/LUXE): jedna karta pro všechny délky
  // Pro VlasyY (Platinum): jedna karta pro každou délku
  const productMap = new Map<string, SkuWithStock[]>();

  for (const sku of skus) {
    const shadeCode = parseShadeCode(sku.shade);
    if (!shadeCode) continue;

    const tier = mapCustomerCategoryToTier(sku.customerCategory);
    const isPlatinum = tier === 'Platinum edition';
    
    // Klíč pro seskupení
    const key = isPlatinum && sku.lengthCm
      ? `${sku.customerCategory}_${shadeCode}_${sku.structure}_${sku.lengthCm}`
      : `${sku.customerCategory}_${shadeCode}_${sku.structure}`;

    if (!productMap.has(key)) {
      productMap.set(key, []);
    }
    productMap.get(key)!.push(sku as any);
  }

  // Převod na Product[]
  const products: Product[] = [];

  for (const [key, skuGroup] of Array.from(productMap.entries())) {
    const firstSku = skuGroup[0];
    const shadeCode = parseShadeCode(firstSku.shade) || 1;
    const tier = mapCustomerCategoryToTier(firstSku.customerCategory);
    
    // Urči kategorii - pokud je předána jako parametr, použij ji, jinak podle shade
    let category: ProductCategory;
    if (categoryParam) {
      category = categoryParam;
    } else {
      // Fallback: podle shade (shade 5-10 = barvené, 1-4 = nebarvené)
      category = (shadeCode >= 5 && shadeCode <= 10) 
        ? 'barvene_blond' 
        : 'nebarvene_panenske';
    }
    
    const isPlatinum = tier === 'Platinum edition';
    const structure = firstSku.structure || 'rovné';
    const shadeName = firstSku.shadeName || HAIR_COLORS[shadeCode]?.name || 'Neznámá';
    const shadeHex = firstSku.shadeHex || HAIR_COLORS[shadeCode]?.hex || '#1A1A1A';

    // Pro Platinum: jedna karta na délku
    // Pro Standard/LUXE: jedna karta pro všechny délky
    if (isPlatinum) {
      for (const sku of skuGroup) {
        if (!sku.lengthCm || sku.soldOut || !sku.inStock) continue;

        const slug = createSlug(category, tier, shadeCode, structure, sku.lengthCm);
        const tierNormalized: 'standard' | 'luxe' | 'platinum' = 'platinum';
        const softnessScale: 1 | 2 | 3 = 3;
        const product: Product = {
          id: sku.id,
          sku: sku.sku,
          slug,
          category,
          tier,
          name: `${shadeName} #${shadeCode}`,
          description: `${tier} panenské vlasy, odstín ${shadeName}, ${structure}, ${sku.lengthCm} cm`,
          measurement_note: 'Měříme tak, jak jsou (nenatažené)',
          variants: [{
            id: sku.id,
            sku: sku.sku,
            shade: shadeCode,
            shade_name: shadeName,
            shade_hex: shadeHex,
            length_cm: sku.lengthCm,
            weight_g: sku.weightTotalG || 0,
            structure: structure as any,
            ending: 'keratin' as any, // Default, lze změnit na PDP
            price_czk: (sku.pricePerGramCzk * (sku.weightTotalG || 0)) / 100, // Cena za 100g
            in_stock: sku.inStock && !sku.soldOut,
            stock_quantity: 1, // Platinum = 1 kus
            ribbon_color: shadeHex,
          }],
          images: {
            main: `/images/shades/${String(shadeCode).padStart(2, '0')}-${shadeName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
            hover: `/images/shades/${String(shadeCode).padStart(2, '0')}-${shadeName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
            gallery: [],
          },
          base_price_per_100g_45cm: sku.pricePerGramCzk * 100, // Cena za 100g
          in_stock: sku.inStock && !sku.soldOut,
          stock_quantity: 1,
          meta_title: `${shadeName} #${shadeCode} - ${tier} | Mùza Hair`,
          meta_description: `${tier} panenské vlasy, odstín ${shadeName}, ${structure}, ${sku.lengthCm} cm`,
          features: [`${tier} kvalita`, '100% panenské vlasy', structure],
          care_instructions: 'Profesionální péče doporučena',
          how_to_use: 'Konzultace s odborníkem',
          average_rating: 0,
          review_count: 0,
          tier_normalized: tierNormalized,
          tier_keywords: [],
          softness_scale: softnessScale,
          search_text: `${shadeName} ${tier} ${structure} ${category}`.toLowerCase(),
          created_at: sku.createdAt || new Date(),
          updated_at: sku.updatedAt || new Date(),
        };
        products.push(product);
      }
    } else {
      // Standard/LUXE: jedna karta, více délek
      // Spočítáme dostupné délky a zásobu
      const availableLengths: number[] = [];
      const lengthStock = new Map<number, number>();

      for (const sku of skuGroup) {
        if (sku.lengthCm && sku.availableGrams && sku.availableGrams >= (sku.minOrderG || 0)) {
          availableLengths.push(sku.lengthCm);
          lengthStock.set(sku.lengthCm, sku.availableGrams);
        }
      }

      if (availableLengths.length === 0) continue;

      // Použijeme první dostupnou délku pro zobrazení
      const displayLength = availableLengths[0];
      const displaySku = skuGroup.find(s => s.lengthCm === displayLength) || firstSku;

      const slug = createSlug(category, tier, shadeCode, structure, null);
      const product: Product = {
        id: `bulk-${key}`,
        sku: firstSku.sku,
        slug,
        category,
        tier,
        name: `${shadeName} #${shadeCode}`,
        description: `${tier} panenské vlasy, odstín ${shadeName}, ${structure}`,
        measurement_note: 'Měříme tak, jak jsou (nenatažené)',
        variants: availableLengths.map(length => {
          const lengthSku = skuGroup.find(s => s.lengthCm === length) || firstSku;
          const stock = lengthStock.get(length) || 0;
          return {
            id: `${firstSku.id}-${length}`,
            sku: lengthSku.sku,
            shade: shadeCode,
            shade_name: shadeName,
            shade_hex: shadeHex,
            length_cm: length,
            weight_g: 100, // Default pro zobrazení
            structure: structure as any,
            ending: 'keratin' as any,
            price_czk: lengthSku.pricePerGramCzk * 100, // Cena za 100g
            in_stock: stock >= (lengthSku.minOrderG || 0),
            stock_quantity: stock,
            ribbon_color: shadeHex,
          };
        }),
        images: {
          main: `/images/shades/${String(shadeCode).padStart(2, '0')}-${shadeName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          hover: `/images/shades/${String(shadeCode).padStart(2, '0')}-${shadeName.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          gallery: [],
        },
        base_price_per_100g_45cm: displaySku.pricePerGramCzk * 100,
        in_stock: availableLengths.length > 0,
        stock_quantity: Array.from(lengthStock.values()).reduce((sum, val) => sum + val, 0),
        meta_title: `${shadeName} #${shadeCode} - ${tier} | Mùza Hair`,
        meta_description: `${tier} panenské vlasy, odstín ${shadeName}, ${structure}`,
        features: [`${tier} kvalita`, '100% panenské vlasy', structure],
        care_instructions: 'Profesionální péče doporučena',
        how_to_use: 'Konzultace s odborníkem',
        average_rating: 0,
        review_count: 0,
        tier_normalized: (tier === 'Standard' ? 'standard' : 'luxe') as 'standard' | 'luxe',
        tier_keywords: [],
        softness_scale: (tier === 'Standard' ? 1 as const : 2 as const),
        search_text: `${shadeName} ${tier} ${structure} ${category}`.toLowerCase(),
        created_at: firstSku.createdAt || new Date(),
        updated_at: firstSku.updatedAt || new Date(),
      };
      products.push(product);
    }
  }

  return products;
}

/**
 * Najde první dostupnou délku s ≥100g pro rychlé "Do košíku"
 */
export function findFallbackLength(
  variants: ProductVariant[],
  minGrams: number = 100
): { length: number; grams: number } | null {
  for (const fallbackLength of FALLBACK_LENGTHS) {
    const variant = variants.find(v => v.length_cm === fallbackLength);
    if (variant && variant.in_stock && variant.stock_quantity >= minGrams) {
      return { length: fallbackLength, grams: minGrams };
    }
  }
  return null;
}

