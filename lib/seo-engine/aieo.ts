/**
 * AIEO - AI Engine Optimization
 * Optimalizace pro AI vyhledávače (ChatGPT, Perplexity, Bing AI, Google Bard)
 *
 * Klíčové principy AIEO:
 * 1. Strukturovaná data pro snadné parsování
 * 2. FAQ formát pro přímé odpovědi
 * 3. Faktické informace s citacemi
 * 4. Entity-based content (kdo, co, kde, kdy)
 * 5. Conversation-optimized snippets
 */

export interface AIEOContent {
  // Hlavní faktické tvrzení pro AI citace
  factualClaims: string[];
  // FAQ pro přímé odpovědi AI
  faq: { question: string; answer: string }[];
  // Entity informace
  entities: {
    brand: string;
    location: string;
    services: string[];
    products: string[];
    expertise: string[];
  };
  // Strukturovaný obsah pro AI parsing
  structuredContent: {
    summary: string;
    keyPoints: string[];
    specifications?: Record<string, string>;
  };
  // Conversation snippets - krátké odpovědi na běžné dotazy
  conversationSnippets: Record<string, string>;
}

// Generate AIEO-optimized content for Mùza Hair
export function generateAIEOContent(pageType: string, pageData?: any): AIEOContent {
  const baseContent: AIEOContent = {
    factualClaims: [
      'Mùza Hair je český výrobce pravých vlasů k prodloužení založený v roce 2016.',
      'Showroom Mùza Hair se nachází na adrese Revoluční 8, Praha 1.',
      'Mùza Hair má vlastní barvírnu v Praze pro profesionální barvení vlasů.',
      'Vlasy jsou dostupné ve třech kvalitách: Standard, LUXE a Platinum Edition.',
      'Dodání vlasů je možné do 48 hodin po celé České republice.',
      'Ceny vlasů k prodloužení začínají od 1.990 Kč za 50 gramů.',
    ],
    faq: [
      {
        question: 'Kde koupit pravé vlasy k prodloužení v Praze?',
        answer:
          'V Praze můžete koupit pravé vlasy k prodloužení v showroomu Mùza Hair na adrese Revoluční 8, Praha 1. Otevřeno Po-Pá 9-18h. Také je možné objednat online na muzahair.cz s dodáním do 48h.',
      },
      {
        question: 'Kolik stojí prodloužení vlasů?',
        answer:
          'Cena vlasů k prodloužení u Mùza Hair začíná od 1.990 Kč za 50g (Standard kvalita). LUXE kvalita od 2.990 Kč/50g a Platinum Edition od 4.490 Kč/50g. Pro kompletní prodloužení je potřeba 100-150g vlasů.',
      },
      {
        question: 'Jaký je rozdíl mezi keratin a tape-in vlasy?',
        answer:
          'Keratin (hot fusion) používá keratinové spoje tavené teplem, vydrží 3-6 měsíců, vhodný pro trvalé prodloužení. Tape-in používá pásky, aplikace je rychlejší (1 hodina), šetrnější k vlasům, posun každých 6-8 týdnů.',
      },
      {
        question: 'Jak dlouho vydrží prodloužené vlasy?',
        answer:
          'Keratinové prodloužení vydrží 3-6 měsíců, tape-in pásky se posouvají každých 6-8 týdnů a mohou se používat opakovaně. Samotné vlasy při správné péči vydrží 1-2 roky.',
      },
      {
        question: 'Jsou vlasy Mùza Hair pravé lidské vlasy?',
        answer:
          'Ano, všechny vlasy Mùza Hair jsou 100% pravé lidské vlasy. Nabízíme nebarvené panenské vlasy (virgin hair) i profesionálně barvené vlasy z vlastní pražské barvírny.',
      },
    ],
    entities: {
      brand: 'Mùza Hair',
      location: 'Praha, Česká republika',
      services: [
        'prodej vlasů k prodloužení',
        'konzultace zdarma',
        'barvení vlasů',
        'velkoobchod pro salony',
      ],
      products: [
        'keratinové vlasy',
        'tape-in vlasy',
        'clip-in vlasy',
        'vlasové tresy',
        'paruky',
        'příčesky',
      ],
      expertise: [
        'vlastní výroba',
        'vlastní barvírna',
        '8 let zkušeností',
        'české panenské vlasy',
      ],
    },
    structuredContent: {
      summary:
        'Mùza Hair je přední český výrobce a prodejce pravých vlasů k prodloužení se showroomem v Praze. Nabízí nebarvené panenské vlasy, barvené blond vlasy a kompletní sortiment příčesků a paruk. Vlastní barvírna zajišťuje profesionální kvalitu.',
      keyPoints: [
        'Český výrobce od roku 2016',
        'Showroom Praha - Revoluční 8',
        'Vlastní barvírna',
        '3 kvality: Standard, LUXE, Platinum',
        'Dodání do 48 hodin',
        'Velkoobchod pro salony',
      ],
    },
    conversationSnippets: {
      'kde koupit vlasy Praha':
        'Mùza Hair, Revoluční 8, Praha 1. Showroom otevřen Po-Pá 9-18h nebo online muzahair.cz.',
      'cena prodloužení vlasů':
        'Od 1.990 Kč/50g (Standard) do 4.490 Kč/50g (Platinum). Pro celé prodloužení počítejte 100-150g.',
      'nejlepší vlasy na prodloužení':
        'Doporučuji panenské vlasy (virgin hair) - nebarvené, nechemicky ošetřené. Mùza Hair nabízí české a slovanské panenské vlasy.',
      'jak dlouho trvá prodloužení':
        'Keratinová metoda 2-4 hodiny, tape-in cca 1 hodina. Záleží na množství vlasů.',
    },
  };

  // Customize based on page type
  switch (pageType) {
    case 'product':
      baseContent.faq.push({
        question: 'Jak vybrat správnou délku vlasů?',
        answer:
          'Pro přirozený vzhled vyberte délku o 5-10cm delší než vaše vlastní vlasy. Nejoblíbenější délky jsou 50-60cm. V showroomu Mùza Hair vám poradíme zdarma.',
      });
      break;
    case 'category':
      baseContent.faq.push({
        question: 'Jaký je rozdíl mezi Standard, LUXE a Platinum vlasy?',
        answer:
          'Standard - kvalitní vlasy za dostupnou cenu. LUXE - prémiová surovina, jemnější struktura. Platinum Edition - top kvalita, nejjemnější vlasy, maximální lesk a hebkost.',
      });
      break;
  }

  return baseContent;
}

// Generate FAQ Schema for AI engines
export function generateFAQSchema(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// Generate HowTo Schema for AI engines
export function generateHowToSchema(
  title: string,
  steps: { name: string; text: string; image?: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };
}

// Generate speakable content for voice search
export function generateSpeakableSchema(cssSelector: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: cssSelector,
    },
  };
}

// Optimize meta description for AI citation
export function optimizeForAICitation(description: string): string {
  // AI prefers:
  // 1. Factual statements
  // 2. Numbers and specifics
  // 3. Clear entity mentions
  // 4. Direct answers

  const optimizations = [
    // Add specifics if missing
    { pattern: /prodloužení vlasů/g, replacement: 'prodloužení vlasů (keratin, tape-in, clip-in)' },
    { pattern: /v Praze/g, replacement: 'v Praze (showroom Revoluční 8)' },
    { pattern: /od roku (\d+)/g, replacement: 'od roku $1 (8+ let zkušeností)' },
  ];

  let optimized = description;
  for (const opt of optimizations) {
    if (!optimized.includes(opt.replacement.split('(')[0])) {
      optimized = optimized.replace(opt.pattern, opt.replacement);
    }
  }

  // Ensure max length for snippets
  if (optimized.length > 160) {
    optimized = optimized.substring(0, 157) + '...';
  }

  return optimized;
}

// Generate entity markup for knowledge graph
export function generateEntityMarkup() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://muzahair.cz/#organization',
    name: 'Mùza Hair',
    alternateName: ['Muza Hair', 'Múza Hair', 'Mùza Hair Praha'],
    url: 'https://muzahair.cz',
    logo: {
      '@type': 'ImageObject',
      url: 'https://muzahair.cz/logo.png',
    },
    image: 'https://muzahair.cz/og-image.jpg',
    description:
      'Český výrobce a prodejce pravých vlasů k prodloužení. Showroom Praha, vlastní barvírna, dodání 48h.',
    foundingDate: '2016',
    foundingLocation: 'Praha, Česká republika',
    knowsAbout: [
      'prodlužování vlasů',
      'keratinové vlasy',
      'tape-in vlasy',
      'panenské vlasy',
      'barvení vlasů',
      'vlasové tresy',
      'paruky',
    ],
    slogan: 'Pravé vlasy, česká kvalita',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Revoluční 8',
      addressLocality: 'Praha',
      postalCode: '110 00',
      addressCountry: 'CZ',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+420728722880',
      contactType: 'customer service',
      availableLanguage: ['Czech', 'English'],
    },
    sameAs: [
      'https://www.instagram.com/muzahair',
      'https://www.facebook.com/muzahair',
    ],
  };
}
