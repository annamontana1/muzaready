import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vlasy k prodloužení Praha | Keratin, Tape-In, Weft | Múza Hair',
  description: 'Pravé vlasy k prodloužení — kolekce Standard, LUXE, Platinum Edition a Baby Shades. Vlastní barvírna Praha, slovanské panenské vlasy, 10 odstínů. Showroom Revoluční 8, Praha 1.',
  keywords: [
    'vlasy k prodloužení',
    'vlasy na prodloužení Praha',
    'pravé vlasy k prodloužení',
    'panenské vlasy Praha',
    'slovanské vlasy prodloužení',
    'nebarvené vlasy na prodloužení',
    'barvené vlasy na prodloužení',
    'keratin vlasy Praha',
    'tape in vlasy Praha',
    'weft vlasy Praha',
    'koupit vlasy Praha',
    'Standard vlasy',
    'LUXE vlasy',
    'Platinum Edition vlasy',
    'Baby Shades vlasy',
    'světlé vlasy na prodloužení',
    'blond vlasy na prodloužení Praha',
    'hnědé vlasy na prodloužení',
    'černé vlasy na prodloužení',
  ],
  openGraph: {
    title: 'Vlasy k prodloužení Praha — kolekce Standard, LUXE, Platinum | Múza Hair',
    description: 'Pravé slovanské vlasy k prodloužení. Vlastní barvírna Praha, 10 odstínů, keratin / tape-in / weft. Showroom Praha 1.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni',
  },
};

export default function VlasyKProdlouzeniLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
      { '@type': 'ListItem', position: 2, name: 'Vlasy k prodloužení', item: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {children}
    </>
  );
}
