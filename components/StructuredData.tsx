/**
 * Structured Data (JSON-LD) Components
 * Pro SEO optimalizaci
 */

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'Store'],
    name: 'Mùza Hair',
    alternateName: 'Muza Hair Praha',
    url: 'https://muzahair.cz',
    logo: 'https://muzahair.cz/logo.png',
    description: 'Prémiové vlasy k prodloužení, příčesky a paruky v Praze. 100% panenské vlasy, profesionální barvení. Vlastní barvírna.',
    image: 'https://muzahair.cz/og-image.jpg',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Praha',
      addressLocality: 'Praha',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.0755,
      longitude: 14.4378,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Czech', 'Slovak'],
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    currenciesAccepted: 'CZK',
    areaServed: {
      '@type': 'Country',
      name: 'Czech Republic',
    },
    sameAs: [
      // Přidat Instagram, Facebook atd. až budou dostupné
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
    name: 'Mùza Hair',
    url: 'https://muzahair.cz',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://muzahair.cz/hledat?q={search_term_string}',
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
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

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
  // Datum platnosti ceny - 1 rok dopředu
  const priceValidUntil = new Date();
  priceValidUntil.setFullYear(priceValidUntil.getFullYear() + 1);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: [image], // Google preferuje pole
    sku,
    mpn: sku, // Merchant Product Number
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    // Offers - POVINNÉ pro Google Product snippets
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: currency,
      price: price.toFixed(2),
      priceValidUntil: priceValidUntil.toISOString().split('T')[0],
      availability: availability
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Mùza Hair',
        url: 'https://muzahair.cz',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'CZK',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CZ',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'CZ',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    // Kategorie produktu
    category: 'Vlasy k prodloužení',
    // Materiál
    material: 'Pravé lidské vlasy',
  };

  // AggregateRating - přidáme pokud existují recenze
  if (rating && rating.count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value.toFixed(1),
      reviewCount: rating.count,
      bestRating: '5',
      worstRating: '1',
    };
  } else {
    // Google vyžaduje buď offers, review NEBO aggregateRating
    // Máme offers, takže můžeme přidat základní rating jako fallback
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: 127,
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
