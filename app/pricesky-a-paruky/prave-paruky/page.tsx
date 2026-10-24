import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Pravé paruky z lidských vlasů | Múza Hair Praha',
  description: 'Pravé paruky z lidských vlasů — přirozený vzhled, pohodlné nošení. Vlastní výroba Múza Hair Praha. Možnost barvení a tvarování.',
  alternates: { canonical: 'https://muzahair.cz/pricesky-a-paruky/prave-paruky' },
  openGraph: {
    title: 'Pravé paruky z lidských vlasů | Múza Hair Praha',
    description: 'Pravé paruky z lidských vlasů — přirozený vzhled, pohodlné nošení. Vlastní výroba Múza Hair Praha. Možnost barvení a tvarování.',
    url: 'https://muzahair.cz/pricesky-a-paruky/prave-paruky',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function PraveParukyPage() {
  return <PagePlaceholder title="Pravé paruky" description="Prémiové paruky z pravých vlasů na míru." icon="✨" />;
}
