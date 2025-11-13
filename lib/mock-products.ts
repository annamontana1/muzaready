/**
 * Mock produkty pro development a ukázku
 * NOVÁ LOGIKA: Standard/LUXE = jeden produkt s více variantami délek
 *              Platinum = separátní produkty pro každou délku
 *
 * AKTUÁLNÍ STAV: Všechny mock produkty byly odstraněny pro ruční zadávání
 */

import {
  Product,
  HAIR_COLORS,
  ProductTier,
  ProductTierNormalized,
  TIER_KEYWORDS,
  SoftnessScale,
  ProductVariant,
} from '@/types/product';
import { normalizeText } from './search-utils';

// Helper pro generování search polí
function generateSearchFields(tier: ProductTier, name: string, description: string, category: string) {
  const tier_normalized: ProductTierNormalized =
    tier === 'Standard' ? 'standard' :
    tier === 'LUXE' ? 'luxe' :
    'platinum';

  const tier_keywords = TIER_KEYWORDS[tier_normalized];

  const softness_scale: SoftnessScale =
    tier === 'Standard' ? 1 :
    tier === 'LUXE' ? 2 :
    3;

  // Combine all searchable text
  const searchText = normalizeText([
    name,
    description,
    tier,
    tier_normalized,
    ...tier_keywords,
    category,
  ].join(' '));

  return {
    tier_normalized,
    tier_keywords,
    softness_scale,
    search_text: searchText,
  };
}

// Generátor mock produktů - SMAZÁNO KVŮLI MANUÁLNÍMU ZADÁVÁNÍ
function generateMockProducts(): Product[] {
  // Vrací prázdný seznam - všechny produkty se musí zadat manuálně
  return [];
}

export const mockProducts: Product[] = generateMockProducts();
