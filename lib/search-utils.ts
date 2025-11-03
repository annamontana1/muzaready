import {
  SEARCH_SYNONYMS,
  TIER_KEYWORDS,
  ProductTierNormalized,
  HairStructure,
  HairEnding,
} from '@/types/product';

/**
 * Remove diacritics from text
 */
export function removeDiacritics(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normalize text for search: lowercase, remove diacritics
 */
export function normalizeText(text: string): string {
  return removeDiacritics(text.toLowerCase().trim());
}

/**
 * Apply synonyms to normalized query
 */
export function applySynonyms(normalizedQuery: string): string {
  let result = normalizedQuery;

  // Replace known synonyms
  Object.entries(SEARCH_SYNONYMS).forEach(([synonym, canonical]) => {
    const regex = new RegExp(`\\b${synonym}\\b`, 'g');
    result = result.replace(regex, canonical);
  });

  return result;
}

/**
 * Detect tier from query
 */
export function detectTier(normalizedQuery: string): ProductTierNormalized | null {
  for (const [tier, keywords] of Object.entries(TIER_KEYWORDS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(normalizedQuery)) {
        return tier as ProductTierNormalized;
      }
    }
  }
  return null;
}

/**
 * Extract length from query (e.g., "50 cm", "50cm", "50")
 */
export function extractLength(query: string): number | null {
  const match = query.match(/(\d{2,3})\s*(cm)?/i);
  if (match) {
    const length = parseInt(match[1], 10);
    if (length >= 35 && length <= 90) {
      return length;
    }
  }
  return null;
}

/**
 * Extract shade group from query (1-10)
 */
export function extractShade(query: string): number | null {
  const match = query.match(/\bodstin\s*(\d{1,2})\b|\b(\d{1,2})\s*odstin\b/i);
  if (match) {
    const shade = parseInt(match[1] || match[2], 10);
    if (shade >= 1 && shade <= 10) {
      return shade;
    }
  }
  return null;
}

/**
 * Detect structure from query
 */
export function detectStructure(normalizedQuery: string): HairStructure | null {
  const structureMap: Record<string, HairStructure> = {
    'rovne': 'rovné',
    'rovné': 'rovné',
    'straight': 'rovné',
    'mirne vlnite': 'mírně vlnité',
    'mirne': 'mírně vlnité',
    'wavy': 'mírně vlnité',
    'vlnite': 'vlnité',
    'vlnité': 'vlnité',
    'kudrnate': 'kudrnaté',
    'kudrnaté': 'kudrnaté',
    'curly': 'kudrnaté',
  };

  for (const [key, value] of Object.entries(structureMap)) {
    if (normalizedQuery.includes(key)) {
      return value;
    }
  }
  return null;
}

/**
 * Detect ending from query
 */
export function detectEnding(normalizedQuery: string): HairEnding | null {
  if (normalizedQuery.includes('keratin') && normalizedQuery.includes('mikro')) {
    return 'microkeratin';
  }
  if (normalizedQuery.includes('keratin')) {
    return 'keratin';
  }
  if (normalizedQuery.includes('tape') || normalizedQuery.includes('nano')) {
    return 'nano_tapes';
  }
  if (normalizedQuery.includes('tres')) {
    return 'vlasove_tresy';
  }
  return null;
}

export interface ParsedQuery {
  normalizedText: string;
  tier: ProductTierNormalized | null;
  length: number | null;
  shade: number | null;
  structure: HairStructure | null;
  ending: HairEnding | null;
  cleanedQuery: string; // query with extracted attributes removed
}

/**
 * Parse search query and extract all recognizable attributes
 */
export function parseSearchQuery(query: string): ParsedQuery {
  const normalized = normalizeText(query);
  const withSynonyms = applySynonyms(normalized);

  const tier = detectTier(withSynonyms);
  const length = extractLength(withSynonyms);
  const shade = extractShade(withSynonyms);
  const structure = detectStructure(withSynonyms);
  const ending = detectEnding(withSynonyms);

  // Remove extracted attributes from query to get cleaned text for full-text search
  let cleaned = withSynonyms;

  // Remove tier keywords
  if (tier) {
    TIER_KEYWORDS[tier].forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      cleaned = cleaned.replace(regex, '');
    });
  }

  // Remove length
  if (length) {
    cleaned = cleaned.replace(/(\d{2,3})\s*(cm)?/gi, '');
  }

  // Remove shade
  if (shade) {
    cleaned = cleaned.replace(/\bodstin\s*\d{1,2}\b|\b\d{1,2}\s*odstin\b/gi, '');
  }

  // Clean up extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return {
    normalizedText: withSynonyms,
    tier,
    length,
    shade,
    structure,
    ending,
    cleanedQuery: cleaned,
  };
}
