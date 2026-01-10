/**
 * Seasonal SEO Engine
 * Automatické přepínání SEO obsahu podle ročního období a událostí
 */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type Event = 'christmas' | 'blackFriday' | 'valentines' | 'wedding' | 'newYear' | 'easter' | 'backToSchool' | 'prom' | 'none';

interface SeasonalContent {
  titleSuffix: string;
  descriptionPrefix: string;
  keywords: string[];
  urgencyText: string;
  ctaText: string;
}

// Get current season
export function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

// Get current event (if any)
export function getCurrentEvent(): Event {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Christmas season (Dec 1 - Dec 26)
  if (month === 12 && day <= 26) return 'christmas';

  // New Year (Dec 27 - Jan 7)
  if ((month === 12 && day >= 27) || (month === 1 && day <= 7)) return 'newYear';

  // Valentine's (Feb 1 - Feb 14)
  if (month === 2 && day <= 14) return 'valentines';

  // Easter (varies, roughly March-April)
  if ((month === 3 && day >= 15) || (month === 4 && day <= 15)) return 'easter';

  // Wedding season (May - September peak)
  if (month >= 5 && month <= 9) return 'wedding';

  // Prom season (April - June)
  if (month >= 4 && month <= 6) return 'prom';

  // Back to school (Aug 15 - Sep 15)
  if ((month === 8 && day >= 15) || (month === 9 && day <= 15)) return 'backToSchool';

  // Black Friday (Nov 20 - Nov 30)
  if (month === 11 && day >= 20 && day <= 30) return 'blackFriday';

  return 'none';
}

// Seasonal content templates
export const SEASONAL_CONTENT: Record<Season, SeasonalContent> = {
  spring: {
    titleSuffix: '| Jarní kolekce 2026',
    descriptionPrefix: 'Jarní obnova vlasů! ',
    keywords: ['jarní trendy vlasy', 'jarní prodloužení', 'nová sezóna vlasy'],
    urgencyText: 'Připravte se na jaro s novými vlasy',
    ctaText: 'Objevte jarní kolekci',
  },
  summer: {
    titleSuffix: '| Letní edice',
    descriptionPrefix: 'Léto plné krásných vlasů! ',
    keywords: ['letní vlasy', 'plážové vlasy', 'prodloužení na léto', 'dovolená vlasy'],
    urgencyText: 'Buďte připravena na letní dovolenou',
    ctaText: 'Letní nabídka',
  },
  autumn: {
    titleSuffix: '| Podzimní trendy',
    descriptionPrefix: 'Podzimní proměna! ',
    keywords: ['podzimní trendy vlasy', 'podzimní barvy vlasů', 'teplé odstíny'],
    urgencyText: 'Nové barvy pro podzimní sezónu',
    ctaText: 'Podzimní kolekce',
  },
  winter: {
    titleSuffix: '| Zimní péče',
    descriptionPrefix: 'Zimní péče o vlasy! ',
    keywords: ['zimní péče vlasy', 'zimní prodloužení', 'vánoční vlasy'],
    urgencyText: 'Speciální zimní péče pro vaše vlasy',
    ctaText: 'Zimní nabídka',
  },
};

// Event content templates
export const EVENT_CONTENT: Record<Event, SeasonalContent | null> = {
  christmas: {
    titleSuffix: '| Vánoční akce -20%',
    descriptionPrefix: '🎄 Vánoční sleva! ',
    keywords: ['vánoční akce vlasy', 'dárek vlasy', 'vánoční prodloužení', 'vánoční sleva'],
    urgencyText: 'Limitovaná vánoční nabídka - pouze do 24.12.',
    ctaText: 'Vánoční akce',
  },
  blackFriday: {
    titleSuffix: '| Black Friday SLEVA',
    descriptionPrefix: '🖤 Black Friday! ',
    keywords: ['black friday vlasy', 'černý pátek sleva', 'akce prodloužení'],
    urgencyText: 'Black Friday - nejvýhodnější ceny roku!',
    ctaText: 'Black Friday slevy',
  },
  valentines: {
    titleSuffix: '| Valentýnská akce',
    descriptionPrefix: '💕 Valentýnská nabídka! ',
    keywords: ['valentýn vlasy', 'dárek pro ni', 'romantický účes'],
    urgencyText: 'Překvapte ji novými vlasy k Valentýnu',
    ctaText: 'Valentýnský dárek',
  },
  wedding: {
    titleSuffix: '| Svatební sezóna',
    descriptionPrefix: '💒 Svatební vlasy! ',
    keywords: ['svatební vlasy', 'prodloužení na svatbu', 'nevěsta vlasy', 'svatební účes'],
    urgencyText: 'Perfektní vlasy pro váš velký den',
    ctaText: 'Svatební nabídka',
  },
  newYear: {
    titleSuffix: '| Novoroční akce',
    descriptionPrefix: '🎆 Nový rok, nové vlasy! ',
    keywords: ['silvestr vlasy', 'nový rok proměna', 'novoroční předsevzetí'],
    urgencyText: 'Začněte nový rok s nádhernou hřívou',
    ctaText: 'Novoroční nabídka',
  },
  easter: {
    titleSuffix: '| Velikonoční akce',
    descriptionPrefix: '🐣 Velikonoční nabídka! ',
    keywords: ['velikonoce vlasy', 'jarní proměna'],
    urgencyText: 'Velikonoční sleva na všechny vlasy',
    ctaText: 'Velikonoční slevy',
  },
  backToSchool: {
    titleSuffix: '| Zpátky do školy',
    descriptionPrefix: '📚 Nový školní rok! ',
    keywords: ['vlasy pro studentky', 'školní rok vlasy'],
    urgencyText: 'Studentské slevy - září',
    ctaText: 'Studentská nabídka',
  },
  prom: {
    titleSuffix: '| Maturitní ples',
    descriptionPrefix: '👗 Plesová sezóna! ',
    keywords: ['maturitní ples vlasy', 'plesový účes', 'ples prodloužení'],
    urgencyText: 'Perfektní vlasy na váš ples',
    ctaText: 'Plesová nabídka',
  },
  none: null,
};

// Generate seasonal SEO content
export function getSeasonalSeoContent(baseSeo: {
  title: string;
  description: string;
  keywords: string[];
}): {
  title: string;
  description: string;
  keywords: string[];
  event: Event;
  season: Season;
  urgencyText: string;
  ctaText: string;
} {
  const season = getCurrentSeason();
  const event = getCurrentEvent();

  const seasonContent = SEASONAL_CONTENT[season];
  const eventContent = EVENT_CONTENT[event];

  // Event takes priority over season
  const activeContent = eventContent || seasonContent;

  return {
    title: `${baseSeo.title} ${activeContent.titleSuffix}`,
    description: `${activeContent.descriptionPrefix}${baseSeo.description}`,
    keywords: [...baseSeo.keywords, ...activeContent.keywords],
    event,
    season,
    urgencyText: activeContent.urgencyText,
    ctaText: activeContent.ctaText,
  };
}

// Check if SEO should be refreshed (every 6 months or on event change)
export function shouldRefreshSeo(lastUpdated: Date): boolean {
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  // Refresh if older than 6 months
  if (lastUpdated < sixMonthsAgo) return true;

  // Refresh if we're in a new event period
  const currentEvent = getCurrentEvent();
  if (currentEvent !== 'none') {
    // Check if event started after last update
    // This is a simplified check - in production you'd track the last event
    return true;
  }

  return false;
}
