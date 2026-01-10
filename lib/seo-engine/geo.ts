/**
 * GEO SEO Engine
 * Geographic SEO optimization for local search
 */

export interface GeoLocation {
  city: string;
  district?: string;
  region: string;
  keywords: string[];
  population: number;
  priority: 'high' | 'medium' | 'low';
}

// Czech cities and regions for GEO targeting
export const LOCATIONS: GeoLocation[] = [
  // Praha - highest priority
  {
    city: 'Praha',
    region: 'Praha',
    keywords: ['Praha', 'Praha 1', 'centrum Prahy', 'hlavní město'],
    population: 1300000,
    priority: 'high',
  },
  {
    city: 'Praha',
    district: 'Praha 1',
    region: 'Praha',
    keywords: ['Praha 1', 'Staré Město', 'centrum'],
    population: 30000,
    priority: 'high',
  },
  {
    city: 'Praha',
    district: 'Praha 2',
    region: 'Praha',
    keywords: ['Praha 2', 'Vinohrady', 'Nové Město'],
    population: 50000,
    priority: 'high',
  },
  {
    city: 'Praha',
    district: 'Praha 3',
    region: 'Praha',
    keywords: ['Praha 3', 'Žižkov', 'Vinohrady'],
    population: 70000,
    priority: 'medium',
  },
  {
    city: 'Praha',
    district: 'Praha 4',
    region: 'Praha',
    keywords: ['Praha 4', 'Nusle', 'Podolí', 'Krč'],
    population: 130000,
    priority: 'medium',
  },
  {
    city: 'Praha',
    district: 'Praha 5',
    region: 'Praha',
    keywords: ['Praha 5', 'Smíchov', 'Anděl'],
    population: 85000,
    priority: 'medium',
  },
  // Other major cities
  {
    city: 'Brno',
    region: 'Jihomoravský',
    keywords: ['Brno', 'Morava', 'jižní Morava'],
    population: 380000,
    priority: 'high',
  },
  {
    city: 'Ostrava',
    region: 'Moravskoslezský',
    keywords: ['Ostrava', 'Slezsko', 'severní Morava'],
    population: 290000,
    priority: 'medium',
  },
  {
    city: 'Plzeň',
    region: 'Plzeňský',
    keywords: ['Plzeň', 'západní Čechy'],
    population: 175000,
    priority: 'medium',
  },
  {
    city: 'Liberec',
    region: 'Liberecký',
    keywords: ['Liberec', 'severní Čechy'],
    population: 105000,
    priority: 'medium',
  },
  {
    city: 'Olomouc',
    region: 'Olomoucký',
    keywords: ['Olomouc', 'Haná', 'střední Morava'],
    population: 100000,
    priority: 'medium',
  },
  {
    city: 'České Budějovice',
    region: 'Jihočeský',
    keywords: ['České Budějovice', 'jižní Čechy'],
    population: 95000,
    priority: 'low',
  },
  {
    city: 'Hradec Králové',
    region: 'Královéhradecký',
    keywords: ['Hradec Králové', 'východní Čechy'],
    population: 93000,
    priority: 'low',
  },
  {
    city: 'Pardubice',
    region: 'Pardubický',
    keywords: ['Pardubice', 'východní Čechy'],
    population: 91000,
    priority: 'low',
  },
  {
    city: 'Zlín',
    region: 'Zlínský',
    keywords: ['Zlín', 'Valašsko'],
    population: 75000,
    priority: 'low',
  },
  {
    city: 'Karlovy Vary',
    region: 'Karlovarský',
    keywords: ['Karlovy Vary', 'lázeňské město', 'západní Čechy'],
    population: 48000,
    priority: 'low',
  },
];

// Generate GEO-optimized SEO content
export function generateGeoSeo(
  baseSeo: { title: string; description: string; keywords: string[] },
  location: GeoLocation
): {
  title: string;
  description: string;
  keywords: string[];
  localBusinessSchema: object;
} {
  const cityName = location.district || location.city;

  return {
    title: `${baseSeo.title} | ${cityName}`,
    description: `${baseSeo.description} Showroom v ${location.city}. Rychlé dodání po celé ČR.`,
    keywords: [
      ...baseSeo.keywords,
      `prodlužování vlasů ${cityName}`,
      `vlasy ${cityName}`,
      `salon vlasů ${location.city}`,
      ...location.keywords.map((k) => `vlasy ${k}`),
    ],
    localBusinessSchema: {
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      name: 'Mùza Hair',
      image: 'https://muzahair.cz/og-image.jpg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Revoluční 8',
        addressLocality: 'Praha',
        postalCode: '110 00',
        addressCountry: 'CZ',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 50.0912,
        longitude: 14.4302,
      },
      url: 'https://muzahair.cz',
      telephone: '+420728722880',
      priceRange: '$$',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
      areaServed: {
        '@type': 'City',
        name: location.city,
      },
    },
  };
}

// Get nearby cities for "near me" searches
export function getNearbyCities(city: string, radius: number = 50): GeoLocation[] {
  // Simplified - in production you'd use actual geo coordinates
  const cityDistances: Record<string, string[]> = {
    Praha: ['Praha 1', 'Praha 2', 'Praha 3', 'Praha 4', 'Praha 5'],
    Brno: ['Ostrava', 'Olomouc', 'Zlín'],
    Ostrava: ['Brno', 'Olomouc'],
  };

  const nearby = cityDistances[city] || [];
  return LOCATIONS.filter(
    (loc) => nearby.includes(loc.city) || nearby.includes(loc.district || '')
  );
}

// Generate "near me" schema
export function generateNearMeSchema(userLocation?: { lat: number; lng: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Mùza Hair - Prodej vlasů a prodlužování',
    description:
      'Český výrobce pravých vlasů k prodloužení. Showroom Praha, dodání po celé ČR do 48h.',
    image: 'https://muzahair.cz/og-image.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Revoluční 8',
      addressLocality: 'Praha',
      addressRegion: 'Praha',
      postalCode: '110 00',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.0912,
      longitude: 14.4302,
    },
    hasMap: 'https://goo.gl/maps/muzahair',
    telephone: '+420728722880',
    email: 'info@muzahair.cz',
    url: 'https://muzahair.cz',
    priceRange: '$$',
    currenciesAccepted: 'CZK, EUR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    areaServed: [
      { '@type': 'Country', name: 'Czech Republic' },
      { '@type': 'Country', name: 'Slovakia' },
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 50.0912,
        longitude: 14.4302,
      },
      geoRadius: '500km',
    },
  };
}
