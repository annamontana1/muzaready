import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Toupee z pravých vlasů | Příčešek na temeno | Múza Hair Praha',
  description: 'Toupee (příčešek na temeno) z pravých vlasů pro muže i ženy. Zakrytí řídkých vlasů a lysiny. Individuální výroba v Praze, přirozený vzhled.',
  alternates: { canonical: 'https://muzahair.cz/pricesky-a-paruky/toupee' },
  openGraph: {
    title: 'Toupee z pravých vlasů | Příčešek na temeno | Múza Hair Praha',
    description: 'Toupee (příčešek na temeno) z pravých vlasů pro muže i ženy. Zakrytí řídkých vlasů a lysiny. Individuální výroba v Praze, přirozený vzhled.',
    url: 'https://muzahair.cz/pricesky-a-paruky/toupee',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function ToupeePage() {
  return <PagePlaceholder title="Toupee/tupé" description="Toupee příčešek na temeno pro zakrytí řídkých vlasů." icon="👑" />;
}
