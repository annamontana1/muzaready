import { Product, ProductCategory } from '@/types/product';
import { parseSearchQuery, ParsedQuery } from './search-utils';

export interface SearchResult {
  products: Product[];
  totalCount: number;
  query: ParsedQuery;
  suggestedQueries?: string[];
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  category?: ProductCategory;
}

/**
 * Search products with full-text and faceted filters
 */
export function searchProducts(
  products: Product[],
  query: string,
  options: SearchOptions = {}
): SearchResult {
  const { limit = 20, offset = 0, category } = options;

  // Parse query to extract attributes
  const parsedQuery = parseSearchQuery(query);

  // Filter products
  const filtered = products.filter(product => {
    // Category filter (if specified in options)
    if (category && product.category !== category) {
      return false;
    }

    // Tier filter (from parsed query)
    if (parsedQuery.tier && product.tier_normalized !== parsedQuery.tier) {
      return false;
    }

    // Length filter (check if any variant has this length)
    if (parsedQuery.length) {
      const hasLength = product.variants.some(
        v => v.length_cm === parsedQuery.length
      );
      if (!hasLength) {
        return false;
      }
    }

    // Shade filter (check if any variant has this shade)
    if (parsedQuery.shade !== null) {
      const hasShade = product.variants.some(
        v => v.shade === parsedQuery.shade
      );
      if (!hasShade) {
        return false;
      }
    }

    // Structure filter (check if any variant has this structure)
    if (parsedQuery.structure) {
      const hasStructure = product.variants.some(
        v => v.structure === parsedQuery.structure
      );
      if (!hasStructure) {
        return false;
      }
    }

    // Ending filter (check if any variant has this ending)
    if (parsedQuery.ending) {
      const hasEnding = product.variants.some(
        v => v.ending === parsedQuery.ending
      );
      if (!hasEnding) {
        return false;
      }
    }

    // Full-text search in search_text field
    if (parsedQuery.cleanedQuery) {
      const searchTerms = parsedQuery.cleanedQuery.split(' ').filter(t => t.length > 0);
      if (searchTerms.length > 0) {
        const productSearchText = product.search_text.toLowerCase();
        const matchesAll = searchTerms.every(term =>
          productSearchText.includes(term)
        );
        if (!matchesAll) {
          return false;
        }
      }
    }

    return true;
  });

  // Score results for relevance (simple scoring)
  const scored = filtered.map(product => {
    let score = 0;

    // Exact tier match
    if (parsedQuery.tier && product.tier_normalized === parsedQuery.tier) {
      score += 10;
    }

    // Full-text matches
    if (parsedQuery.cleanedQuery) {
      const searchTerms = parsedQuery.cleanedQuery.split(' ').filter(t => t.length > 0);
      searchTerms.forEach(term => {
        // Title match (higher weight)
        if (product.name.toLowerCase().includes(term)) {
          score += 5;
        }
        // Description match
        if (product.description.toLowerCase().includes(term)) {
          score += 2;
        }
        // Search text match
        if (product.search_text.includes(term)) {
          score += 1;
        }
      });
    }

    // In stock products get slight boost
    if (product.in_stock) {
      score += 1;
    }

    return { product, score };
  });

  // Sort by score (descending)
  scored.sort((a, b) => b.score - a.score);

  // Get products in order
  const sortedProducts = scored.map(s => s.product);

  // Apply pagination
  const paginatedProducts = sortedProducts.slice(offset, offset + limit);

  // Generate suggested queries if no results
  const suggestedQueries = filtered.length === 0 ? generateSuggestedQueries(parsedQuery) : undefined;

  return {
    products: paginatedProducts,
    totalCount: filtered.length,
    query: parsedQuery,
    suggestedQueries,
  };
}

/**
 * Generate suggested queries when no results found
 */
function generateSuggestedQueries(parsedQuery: ParsedQuery): string[] {
  const suggestions: string[] = [];

  // Suggest other tiers
  if (parsedQuery.tier) {
    if (parsedQuery.tier !== 'standard') {
      suggestions.push('standard');
    }
    if (parsedQuery.tier !== 'luxe') {
      suggestions.push('luxe');
    }
    if (parsedQuery.tier !== 'platinum') {
      suggestions.push('platinum');
    }
  } else {
    // No tier specified, suggest all
    suggestions.push('standard', 'luxe', 'platinum');
  }

  // Suggest common lengths
  if (!parsedQuery.length) {
    suggestions.push('standard 50 cm', 'luxe 60 cm', 'platinum 70 cm');
  }

  // Suggest structures
  if (!parsedQuery.structure) {
    suggestions.push('rovné vlasy', 'vlnité vlasy');
  }

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

/**
 * Get fallback CTA text when no results
 */
export function getFallbackCTA(parsedQuery: ParsedQuery, category?: ProductCategory): {
  text: string;
  url: string;
} {
  const categorySlug = category === 'barvene_blond'
    ? '/vlasy-k-prodlouzeni/barvene-blond'
    : '/vlasy-k-prodlouzeni/nebarvene-panenske';

  if (parsedQuery.tier) {
    const tierName = parsedQuery.tier === 'standard' ? 'Standard' :
                      parsedQuery.tier === 'luxe' ? 'LUXE' :
                      'Platinum edition';
    return {
      text: `Zobrazit všechny ${tierName} v ${category === 'barvene_blond' ? 'Barvených blond' : 'Nebarvených panenských'}`,
      url: `${categorySlug}?tier=${parsedQuery.tier}`,
    };
  }

  return {
    text: `Zobrazit všechny ${category === 'barvene_blond' ? 'Barvené blond' : 'Nebarvené panenské'} vlasy`,
    url: categorySlug,
  };
}
