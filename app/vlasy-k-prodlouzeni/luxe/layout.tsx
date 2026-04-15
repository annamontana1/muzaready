import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxusní vlasy na prodloužení Praha | Kolekce LUXE | Múza Hair',
  description: 'Prémiové panenské vlasy na prodloužení — kolekce LUXE. Slovanské vlasy z Evropy, 100% remy, vlastní barvírna Praha. Showroom Revoluční 8, Praha 1. Konzultace zdarma.',
  keywords: [
    'luxusní vlasy na prodloužení',
    'prémiové vlasy na prodloužení',
    'panenské vlasy Praha',
    'slovanské vlasy na prodloužení',
    'LUXE vlasy prodloužení',
    'pravé vlasy na prodloužení Praha',
    'nejkvalitnější vlasy na prodloužení',
    'remy vlasy Praha',
    'evropské vlasy na prodloužení',
    'černé vlasy na prodloužení',
    'hnědé vlasy na prodloužení',
    'tmavě hnědé vlasy prodloužení',
    'blond vlasy na prodloužení Praha',
    'karamelové vlasy prodloužení',
    'světlé hnědé vlasy prodloužení',
    'platinové vlasy na prodloužení',
    'středoevropské vlasy Praha',
    'východoevropské vlasy prodloužení',
  ],
  openGraph: {
    title: 'Luxusní vlasy na prodloužení — kolekce LUXE | Múza Hair Praha',
    description: 'Prémiové panenské slovanské vlasy na prodloužení. Vlastní barvírna, showroom Praha 1. Keratin, tape in, weft. Konzultace zdarma.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/luxe',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/luxe',
  },
};

export default function LuxeLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
      { '@type': 'ListItem', position: 2, name: 'Vlasy k prodloužení', item: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
      { '@type': 'ListItem', position: 3, name: 'LUXE vlasy', item: 'https://muzahair.cz/vlasy-k-prodlouzeni/luxe' },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
