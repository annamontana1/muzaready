import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog vlasů na prodloužení | Všechny produkty | Múza Hair',
  description: 'Kompletní katalog vlasů na prodloužení Múza Hair — Standard, LUXE, Platinum. Nebarvené i barvené vlasy, příčesky, paruky. Showroom Praha.',
  alternates: { canonical: 'https://muzahair.cz/katalog' },
  openGraph: {
    title: 'Katalog vlasů na prodloužení | Všechny produkty | Múza Hair',
    description: 'Kompletní katalog vlasů na prodloužení Múza Hair — Standard, LUXE, Platinum. Nebarvené i barvené vlasy, příčesky, paruky. Showroom Praha.',
    url: 'https://muzahair.cz/katalog',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
