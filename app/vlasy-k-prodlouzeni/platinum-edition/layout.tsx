import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platinum Edition — Exkluzivní vlasy na prodloužení | Múza Hair Praha',
  description: 'Exkluzivní kolekce Platinum Edition — nejvyšší kvalita panenských vlasů na prodloužení. Slovanské vlasy, vlastní barvírna Praha, showroom Revoluční 8, Praha 1.',
  keywords: [
    'platinum vlasy na prodloužení',
    'exkluzivní vlasy Praha',
    'prémiové vlasy prodloužení Praha',
    'panenské vlasy Praha',
    'luxusní vlasy na prodloužení Praha',
    'nejlepší vlasy na prodloužení Praha',
  ],
  openGraph: {
    title: 'Platinum Edition — Exkluzivní vlasy na prodloužení | Múza Hair Praha',
    description: 'Nejvyšší kvalita panenských vlasů. Vlastní barvírna, showroom Praha 1.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/platinum-edition',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/platinum-edition',
  },
};

export default function PlatinumLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
      { '@type': 'ListItem', position: 2, name: 'Vlasy k prodloužení', item: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
      { '@type': 'ListItem', position: 3, name: 'Platinum Edition', item: 'https://muzahair.cz/vlasy-k-prodlouzeni/platinum-edition' },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
