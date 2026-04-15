import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baby Shades — Světlé vlasy na prodloužení | Múza Hair Praha',
  description: 'Kolekce Baby Shades — prémiové světlé a blond vlasy na prodloužení. Skandinávské a světlé odstíny, panenské vlasy, showroom Praha 1.',
  keywords: [
    'světlé vlasy na prodloužení',
    'blond vlasy na prodloužení Praha',
    'baby shades vlasy',
    'platinová blond vlasy',
    'platinové vlasy na prodloužení',
    'světlá blond prodloužení',
    'skandinávské vlasy Praha',
    'velmi světlá blond vlasy',
    'champagne blond vlasy',
    'nordic blond vlasy prodloužení',
    'světlé hnědé blond vlasy',
    'tmavá blond vlasy Praha',
    'nebarvené světlé vlasy',
  ],
  openGraph: {
    title: 'Baby Shades — Světlé vlasy na prodloužení | Múza Hair Praha',
    description: 'Prémiové světlé a blond vlasy na prodloužení. Vlastní barvírna, showroom Praha 1.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/baby-shades',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/baby-shades',
  },
};

export default function BabyShadesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
      { '@type': 'ListItem', position: 2, name: 'Vlasy k prodloužení', item: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
      { '@type': 'ListItem', position: 3, name: 'Baby Shades — světlé vlasy', item: 'https://muzahair.cz/vlasy-k-prodlouzeni/baby-shades' },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
