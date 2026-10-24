import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ceník vlasů na prodloužení 2025 | Múza Hair Praha',
  description: 'Ceník vlasů na prodloužení Múza Hair. Standard od 3 900 Kč, LUXE od 6 900 Kč, Platinum od 10 900 Kč. Ceny keratinu, nanotapes a weft aplikací.',
  alternates: { canonical: 'https://muzahair.cz/cenik' },
  openGraph: {
    title: 'Ceník vlasů na prodloužení | Múza Hair',
    description: 'Standard od 3 900 Kč, LUXE od 6 900 Kč, Platinum od 10 900 Kč. Ceny aplikací keratinu a nanotapes.',
    url: 'https://muzahair.cz/cenik',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function CenikLayout({ children }: { children: React.ReactNode }) {
  return children;
}
