/**
 * Mùza Hair SEO Engine
 * Komplexní SEO systém s podporou sezónních aktualizací, GEO a AIEO
 */

export * from './keywords';
export * from './seasonal';
export * from './geo';
export * from './aieo';

import { ALL_KEYWORDS, PRIMARY_KEYWORDS, LONGTAIL_KEYWORDS, LOCAL_KEYWORDS } from './keywords';
import { getCurrentSeason, getCurrentEvent, getSeasonalSeoContent, SEASONAL_CONTENT, EVENT_CONTENT } from './seasonal';
import { LOCATIONS, generateGeoSeo, generateNearMeSchema } from './geo';
import { generateAIEOContent, generateFAQSchema, generateEntityMarkup, optimizeForAICitation } from './aieo';

// Page type definitions
export type PageType =
  | 'homepage'
  | 'category'
  | 'product'
  | 'method'
  | 'info'
  | 'contact'
  | 'about'
  | 'blog'
  | 'faq'
  | 'legal';

// Page to keyword mapping
const PAGE_KEYWORD_MAP: Record<string, {
  type: PageType;
  primaryKeywords: string[];
  secondaryKeywords: string[];
}> = {
  '/': {
    type: 'homepage',
    primaryKeywords: ['vlasy k prodloužení', 'prodej vlasů', 'Mùza Hair Praha'],
    secondaryKeywords: [...PRIMARY_KEYWORDS.service.slice(0, 5), ...PRIMARY_KEYWORDS.ecommerce.slice(0, 5)],
  },
  '/vlasy-k-prodlouzeni': {
    type: 'category',
    primaryKeywords: ['vlasy k prodloužení', 'pravé vlasy', 'vlasy na prodloužení'],
    secondaryKeywords: PRIMARY_KEYWORDS.ecommerce,
  },
  '/vlasy-k-prodlouzeni/nebarvene-panenske': {
    type: 'category',
    primaryKeywords: ['nebarvené panenské vlasy', 'virgin hair', 'panenské vlasy'],
    secondaryKeywords: ['remy vlasy', 'přírodní vlasy', 'české vlasy'],
  },
  '/vlasy-k-prodlouzeni/barvene-vlasy': {
    type: 'category',
    primaryKeywords: ['barvené vlasy', 'blond vlasy', 'profesionálně barvené vlasy'],
    secondaryKeywords: ['ombre vlasy', 'balayage vlasy', 'platinové vlasy'],
  },
  '/metody-zakonceni/vlasy-na-keratin': {
    type: 'method',
    primaryKeywords: ['keratinové vlasy', 'keratin prodlužování', 'hot fusion'],
    secondaryKeywords: LONGTAIL_KEYWORDS.howTo.filter(k => k.includes('keratin')),
  },
  '/metody-zakonceni/pasky-nano-tapes': {
    type: 'method',
    primaryKeywords: ['tape in vlasy', 'nano tapes', 'vlasové pásky'],
    secondaryKeywords: ['neviditelné pásky', 'invisible tape'],
  },
  '/pricesky-a-paruky': {
    type: 'category',
    primaryKeywords: ['příčesky', 'paruky', 'paruky z pravých vlasů'],
    secondaryKeywords: ['toupee', 'clip in', 'vlasové tresy'],
  },
  '/kontakt': {
    type: 'contact',
    primaryKeywords: ['Mùza Hair kontakt', 'showroom Praha', 'prodlužování vlasů Praha'],
    secondaryKeywords: LOCAL_KEYWORDS.praha,
  },
  '/o-nas': {
    type: 'about',
    primaryKeywords: ['Mùza Hair', 'český výrobce vlasů', 'vlastní barvírna'],
    secondaryKeywords: ['historie Mùza Hair', 'výroba vlasů Praha'],
  },
  '/velkoobchod': {
    type: 'info',
    primaryKeywords: ['velkoobchod vlasy', 'vlasy pro salony', 'B2B vlasy'],
    secondaryKeywords: ['dodavatel vlasů', 'vlasy pro kadeřníky'],
  },
  '/informace/faq': {
    type: 'faq',
    primaryKeywords: ['FAQ prodlužování vlasů', 'otázky a odpovědi vlasy'],
    secondaryKeywords: LONGTAIL_KEYWORDS.howTo,
  },
};

// Main SEO generation function
export interface GeneratedSEO {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  structuredData: object[];
  aieoContent: ReturnType<typeof generateAIEOContent>;
  seasonal: {
    season: ReturnType<typeof getCurrentSeason>;
    event: ReturnType<typeof getCurrentEvent>;
    isSeasonallyOptimized: boolean;
  };
  geo: {
    primaryLocation: string;
    nearMeSchema: object;
  };
}

export function generateCompleteSEO(
  slug: string,
  options: {
    includeSeasonalContent?: boolean;
    includeGeo?: boolean;
    includeAIEO?: boolean;
    customTitle?: string;
    customDescription?: string;
  } = {}
): GeneratedSEO {
  const {
    includeSeasonalContent = true,
    includeGeo = true,
    includeAIEO = true,
    customTitle,
    customDescription,
  } = options;

  // Get page config
  const pageConfig = PAGE_KEYWORD_MAP[slug] || {
    type: 'info' as PageType,
    primaryKeywords: ['Mùza Hair'],
    secondaryKeywords: [],
  };

  // Base SEO
  const pageName = slug.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Stránka';
  let title = customTitle || `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} | Mùza Hair Praha`;
  let description = customDescription || `${pageName} - Mùza Hair, český výrobce pravých vlasů k prodloužení. Showroom Praha, vlastní barvírna. Dodání do 48h.`;
  let keywords = [...pageConfig.primaryKeywords, ...pageConfig.secondaryKeywords];

  // Apply seasonal content
  const season = getCurrentSeason();
  const event = getCurrentEvent();

  if (includeSeasonalContent) {
    const eventContent = EVENT_CONTENT[event];
    const seasonContent = SEASONAL_CONTENT[season];
    const activeContent = eventContent || seasonContent;

    if (activeContent && (event !== 'none' || slug === '/')) {
      title = `${title} ${activeContent.titleSuffix}`;
      description = `${activeContent.descriptionPrefix}${description}`;
      keywords = [...keywords, ...activeContent.keywords];
    }
  }

  // Apply GEO optimization
  if (includeGeo) {
    const primaryLocation = LOCATIONS[0]; // Praha
    if (!title.includes('Praha') && pageConfig.type !== 'legal') {
      keywords = [...keywords, ...LOCAL_KEYWORDS.praha.slice(0, 3)];
    }
  }

  // Generate AIEO content
  const aieoContent = includeAIEO
    ? generateAIEOContent(pageConfig.type)
    : generateAIEOContent('info');

  // Optimize description for AI citation
  description = optimizeForAICitation(description);

  // Build structured data array
  const structuredData: object[] = [
    generateEntityMarkup(),
    generateNearMeSchema(),
  ];

  if (aieoContent.faq.length > 0) {
    structuredData.push(generateFAQSchema(aieoContent.faq));
  }

  return {
    title,
    description,
    keywords: [...new Set(keywords)].slice(0, 15), // Unique, max 15
    canonicalUrl: `https://muzahair.cz${slug}`,
    ogImage: 'https://muzahair.cz/og-image.jpg',
    structuredData,
    aieoContent,
    seasonal: {
      season,
      event,
      isSeasonallyOptimized: includeSeasonalContent && event !== 'none',
    },
    geo: {
      primaryLocation: 'Praha',
      nearMeSchema: generateNearMeSchema(),
    },
  };
}

// Check if SEO needs refresh
export function needsSeoRefresh(lastUpdated: Date): {
  shouldRefresh: boolean;
  reason: string;
} {
  const now = new Date();
  const daysSinceUpdate = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

  // Check for event change
  const currentEvent = getCurrentEvent();
  if (currentEvent !== 'none') {
    return {
      shouldRefresh: true,
      reason: `Aktivní událost: ${currentEvent}`,
    };
  }

  // Check for 6-month refresh
  if (daysSinceUpdate >= 180) {
    return {
      shouldRefresh: true,
      reason: `SEO starší než 6 měsíců (${daysSinceUpdate} dní)`,
    };
  }

  // Check for season change (quarterly)
  if (daysSinceUpdate >= 90) {
    return {
      shouldRefresh: true,
      reason: `Doporučená čtvrtletní aktualizace`,
    };
  }

  return {
    shouldRefresh: false,
    reason: `SEO je aktuální (${daysSinceUpdate} dní od poslední aktualizace)`,
  };
}

// Get all keywords for a page type
export function getKeywordsForPageType(pageType: PageType): string[] {
  switch (pageType) {
    case 'homepage':
      return [
        ...PRIMARY_KEYWORDS.service,
        ...PRIMARY_KEYWORDS.ecommerce,
        ...LOCAL_KEYWORDS.praha.slice(0, 5),
      ];
    case 'category':
      return [
        ...PRIMARY_KEYWORDS.ecommerce,
        ...LONGTAIL_KEYWORDS.whereToBuy,
      ];
    case 'product':
      return [
        ...PRIMARY_KEYWORDS.ecommerce,
        ...LONGTAIL_KEYWORDS.price,
      ];
    case 'method':
      return [
        ...PRIMARY_KEYWORDS.methods,
        ...LONGTAIL_KEYWORDS.howTo,
        ...LONGTAIL_KEYWORDS.comparison,
      ];
    case 'faq':
      return [
        ...LONGTAIL_KEYWORDS.howTo,
        ...LONGTAIL_KEYWORDS.problemSolution,
      ];
    case 'contact':
      return [
        ...LOCAL_KEYWORDS.praha,
        ...LOCAL_KEYWORDS.nearMe,
      ];
    default:
      return PRIMARY_KEYWORDS.service;
  }
}
