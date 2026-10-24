/**
 * Structured Data (JSON-LD) Components
 * SEO + AEO optimalizace – schema.org
 */

const BASE_URL = 'https://muzahair.cz';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'HairSalon', 'Store'],
    '@id': `${BASE_URL}/#organization`,
    name: 'Mùza Hair',
    alternateName: ['Muza Hair Praha', 'Muzahair', 'Múza Hair'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/logo/muza-hair-logo.png`,
      width: 300,
      height: 100,
    },
    description: 'Český výrobce pravých vlasů k prodloužení od roku 2016. Vlastní barvírna v Praze, ruční výroba v ČR. Nebarvené panenské vlasy, barvené blond, keratin, pásky, tresy.',
    image: `${BASE_URL}/og-image.jpg`,
    priceRange: '6 900 Kč – 10 900 Kč',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Praha',
      addressLocality: 'Praha',
      postalCode: '110 00',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.0755,
      longitude: 14.4378,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@muzahair.cz',
      contactType: 'customer service',
      availableLanguage: ['Czech', 'Slovak'],
      contactOption: 'TollFree',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    currenciesAccepted: 'CZK',
    areaServed: {
      '@type': 'Country',
      name: 'Czech Republic',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [
      'https://www.instagram.com/muzahair.cz',
    ],
    foundingDate: '2016',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: 5,
    },
    knowsAbout: [
      'prodloužení vlasů',
      'panenské vlasy',
      'keratin vlasy',
      'nano tapes',
      'vlasové tresy',
      'příčesky',
      'paruky',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'Mùza Hair',
    url: BASE_URL,
    description: 'Český výrobce pravých vlasů k prodloužení od roku 2016.',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    inLanguage: 'cs-CZ',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/hledat?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Product ──────────────────────────────────────────────────────────────────

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  brand?: string;
  price: number;
  currency?: string;
  availability: boolean;
  url: string;
  rating?: {
    value: number;
    count: number;
  };
}

export function ProductSchema({
  name,
  description,
  image,
  sku,
  brand = 'Mùza Hair',
  price,
  currency = 'CZK',
  availability,
  url,
  rating,
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: image.startsWith('http') ? image : `${BASE_URL}${image}`,
    sku,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    manufacturer: {
      '@id': `${BASE_URL}/#organization`,
    },
    offers: {
      '@type': 'Offer',
      url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: availability
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: {
        '@id': `${BASE_URL}/#organization`,
      },
    },
  };

  if (rating && rating.count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value.toFixed(1),
      reviewCount: rating.count,
      bestRating: '5',
      worstRating: '1',
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
// AEO: FAQ schema pomáhá AI vyhledávačům (ChatGPT, Perplexity, Google SGE)
// vytáhnout přímo odpovědi na otázky zákaznic.

export interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Speakable ────────────────────────────────────────────────────────────────
// AEO: Speakable schema označuje části stránky, které mají být čteny
// hlasovými asistenty a AI – klíčové pro Google Assistant, Siri, Perplexity.

interface SpeakableSchemaProps {
  url: string;
  cssSelector?: string[];
  xPath?: string[];
}

export function SpeakableSchema({ url, cssSelector, xPath }: SpeakableSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      ...(cssSelector && { cssSelector }),
      ...(xPath && { xPath }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── ItemList ────────────────────────────────────────────────────────────────
// AEO: Pro kategoriové stránky – pomáhá AI pochopit strukturu nabídky.

interface ItemListSchemaProps {
  name: string;
  description: string;
  url: string;
  items: Array<{
    name: string;
    url: string;
    image?: string;
    description?: string;
    price?: number;
  }>;
}

export function ItemListSchema({ name, description, url, items }: ItemListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
      ...(item.description && { description: item.description }),
      ...(item.image && {
        image: item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`,
      }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── HowTo ────────────────────────────────────────────────────────────────────
// AEO: Pro návody a průvodce – Google / AI vyhledávače zobrazují
// jako rich snippet s kroky přímo ve výsledcích.

interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration, např. "PT30M"
  steps: HowToStep[];
}

export function HowToSchema({ name, description, totalTime, steps }: HowToSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: step.image.startsWith('http') ? step.image : `${BASE_URL}${step.image}`,
      }),
    })),
  };

  if (totalTime) schema.totalTime = totalTime;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Review ───────────────────────────────────────────────────────────────────

interface ReviewSchemaProps {
  itemName: string;
  itemUrl: string;
  reviews: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
  }>;
}

export function ReviewSchema({ itemName, itemUrl, reviews }: ReviewSchemaProps) {
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName,
    url: itemUrl.startsWith('http') ? itemUrl : `${BASE_URL}${itemUrl}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: r.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: r.text,
      datePublished: r.date,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
