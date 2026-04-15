import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vlasy na prodloužení Praha | Kolekce Standard | Múza Hair',
  description: 'Kvalitní pravé vlasy na prodloužení — kolekce Standard. Nebarvené i barvené odstíny, slovanský původ, vlastní barvírna Praha. Showroom Revoluční 8, Praha 1.',
  keywords: [
    'vlasy na prodloužení Praha',
    'vlasy k prodloužení Praha',
    'koupit vlasy na prodloužení',
    'pravé vlasy na prodloužení',
    'keratin vlasy Praha',
    'tape in vlasy Praha',
    'obchod vlasy na prodloužení Praha',
    'kde koupit vlasy Praha',
    'hnědé vlasy na prodloužení',
    'tmavě hnědé vlasy Praha',
    'světlé hnědé karamelové vlasy',
    'černé vlasy na prodloužení Praha',
    'blond vlasy prodloužení Praha',
    'nebarvené vlasy na prodloužení',
    'řecké vlasy Praha',
    'jemné vlasy prodloužení',
  ],
  openGraph: {
    title: 'Vlasy na prodloužení Praha — Standard kolekce | Múza Hair',
    description: 'Kvalitní pravé vlasy k prodloužení. Vlastní barvírna, showroom Praha 1. Keratin, tape in, weft.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/standard',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/standard',
  },
};

export default function StandardLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
      { '@type': 'ListItem', position: 2, name: 'Vlasy k prodloužení', item: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
      { '@type': 'ListItem', position: 3, name: 'Standard vlasy', item: 'https://muzahair.cz/vlasy-k-prodlouzeni/standard' },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
