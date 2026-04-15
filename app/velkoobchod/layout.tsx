import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Velkoobchod vlasů Praha — B2B pro kadeřnice | Múza Hair',
  description: 'Dodavatel vlasů pro kadeřnické salony Praha. Velkoobchodní ceny na panenské vlasy k prodloužení — keratin, tape in, weft. Vlastní barvírna. Partnerský program pro salony.',
  keywords: [
    'dodavatel vlasů pro salony Praha',
    'vlasy velkoobchod Praha',
    'vlasy pro kadeřnice ČR',
    'velkoobchod tape in vlasy',
    'panenské vlasy velkoobchod',
    'vlasy pro kadeřnický salon Praha',
    'partnerský program vlasy',
    'kadeřnický velkoobchod vlasy',
    'hair supplier Czech Republic',
    'wholesale hair extensions Prague',
    'B2B vlasy Praha',
  ],
  openGraph: {
    title: 'B2B Velkoobchod vlasů Praha — Múza Hair pro kadeřnické salony',
    description: 'Prémiový dodavatel vlasů pro kadeřnické salony. Velkoobchodní ceny, vlastní barvírna, showroom Praha 1. Partnerský program pro kadeřnice.',
    url: 'https://muzahair.cz/velkoobchod',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/velkoobchod',
  },
};

export default function VelkoobchodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
