import {
  SEARCH_SYNONYMS,
  TIER_KEYWORDS,
  ProductTierNormalized,
  HairStructure,
  HairEnding,
  HAIR_COLORS,
  COLOR_FAMILIES,
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
 * Extract shade code from query (priority: exact number 1-10)
 */
export function extractShadeCode(query: string): number | null {
  // Look for standalone number 1-10
  const match = query.match(/\b(10|[1-9])\b/);
  if (match) {
    const shade = parseInt(match[1], 10);
    if (shade >= 1 && shade <= 10) {
      return shade;
    }
  }
  return null;
}

/**
 * Detect shade by name or synonyms
 * Prioritizes longer/more specific matches
 * Excludes matches that are also color family keywords (prefer family detection)
 */
export function detectShadeByName(normalizedQuery: string): { shades: number[]; matchedActualName: boolean } {
  const matchesWithLength: Array<{ shade: number; length: number; matchedText: string; isActualName: boolean }> = [];
  const familyKeywords = Object.keys(COLOR_FAMILIES).map(k => normalizeText(k));

  Object.entries(HAIR_COLORS).forEach(([code, color]) => {
    const shadeCode = parseInt(code, 10);

    // Check name
    const normalizedName = normalizeText(color.name);
    if (normalizedQuery.includes(normalizedName)) {
      // Skip if this shade name is also a family keyword
      if (!familyKeywords.includes(normalizedName)) {
        matchesWithLength.push({ shade: shadeCode, length: normalizedName.length, matchedText: normalizedName, isActualName: true });
      }
      return;
    }

    // Check synonyms
    for (const synonym of color.synonyms) {
      const normalizedSynonym = normalizeText(synonym);
      if (normalizedQuery.includes(normalizedSynonym)) {
        // Skip if this synonym is also a family keyword
        if (!familyKeywords.includes(normalizedSynonym)) {
          matchesWithLength.push({ shade: shadeCode, length: normalizedSynonym.length, matchedText: normalizedSynonym, isActualName: false });
        }
        return;
      }
    }
  });

  // If no matches, return empty
  if (matchesWithLength.length === 0) {
    return { shades: [], matchedActualName: false };
  }

  // Find the maximum match length
  const maxLength = Math.max(...matchesWithLength.map(m => m.length));

  // Return only matches with maximum length (most specific)
  const longestMatches = matchesWithLength.filter(m => m.length === maxLength);

  return {
    shades: longestMatches.map(m => m.shade),
    matchedActualName: longestMatches.some(m => m.isActualName),
  };
}

/**
 * Detect shades by color family (hnědá → 2,3,4,5)
 */
export function detectShadeByFamily(normalizedQuery: string): number[] {
  for (const [family, shades] of Object.entries(COLOR_FAMILIES)) {
    if (normalizedQuery.includes(normalizeText(family))) {
      return shades;
    }
  }
  return [];
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
  shadeCode: number | null; // Exact shade code from number
  shadesByName: number[]; // Shades matched by name/synonyms
  shadeNameMatchedActualName: boolean; // True if matched actual shade name (not synonym)
  shadesByFamily: number[]; // Shades matched by color family
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
  const shadeCode = extractShadeCode(withSynonyms);
  const shadeNameResult = detectShadeByName(withSynonyms);
  const shadesByName = shadeNameResult.shades;
  const shadeNameMatchedActualName = shadeNameResult.matchedActualName;
  const shadesByFamily = detectShadeByFamily(withSynonyms);
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

  // Remove shade code (number)
  if (shadeCode) {
    cleaned = cleaned.replace(new RegExp(`\\b${shadeCode}\\b`, 'g'), '');
  }

  // Remove shade names and synonyms (sort by name length desc to remove longer names first)
  const sortedShadesByName = [...shadesByName].sort((a, b) => {
    const nameA = HAIR_COLORS[a].name;
    const nameB = HAIR_COLORS[b].name;
    return nameB.length - nameA.length;
  });

  sortedShadesByName.forEach(shade => {
    const color = HAIR_COLORS[shade];
    if (color) {
      // Remove name
      cleaned = cleaned.replace(normalizeText(color.name), '');
      // Remove synonyms (sort by length desc as well)
      const sortedSynonyms = [...color.synonyms].sort((a, b) => b.length - a.length);
      sortedSynonyms.forEach(synonym => {
        cleaned = cleaned.replace(normalizeText(synonym), '');
      });
    }
  });

  // Remove color family keywords
  Object.keys(COLOR_FAMILIES).forEach(family => {
    cleaned = cleaned.replace(normalizeText(family), '');
  });

  // Clean up extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return {
    normalizedText: withSynonyms,
    tier,
    length,
    shadeCode,
    shadesByName,
    shadeNameMatchedActualName,
    shadesByFamily,
    structure,
    ending,
    cleanedQuery: cleaned,
  };
}
