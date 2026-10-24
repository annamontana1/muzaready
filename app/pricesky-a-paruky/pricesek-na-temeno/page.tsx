import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Příčešek na temeno | Toupee z pravých vlasů | Múza Hair',
  description: 'Příčešek na temeno (toupee) z pravých vlasů pro zakrytí řídkých vlasů. Vlastní výroba Praha, přirozený vzhled, individuální řešení.',
  alternates: { canonical: 'https://muzahair.cz/pricesky-a-paruky/pricesek-na-temeno' },
  openGraph: {
    title: 'Příčešek na temeno | Toupee z pravých vlasů | Múza Hair',
    description: 'Příčešek na temeno (toupee) z pravých vlasů pro zakrytí řídkých vlasů. Vlastní výroba Praha, přirozený vzhled, individuální řešení.',
    url: 'https://muzahair.cz/pricesky-a-paruky/pricesek-na-temeno',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function PriceskNaTemenoPage() {
  return <PagePlaceholder title="Příčešek na temeno (toupee)" description="Toupee pro zakrytí řídkých vlasů na temeni. Přirozený vzhled, pohodlné nošení." icon="👑" />;
}
