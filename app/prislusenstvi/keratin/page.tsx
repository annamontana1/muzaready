import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Keratinové bondy na prodloužení vlasů | Příslušenství | Mùza Hair',
  description: 'Keratinové bondy pro aplikaci vlasů na prodloužení. Profesionální kvalita, vhodné pro keratin metodu. Mùza Hair Praha.',
  alternates: { canonical: 'https://www.muzahair.cz/prislusenstvi/keratin' },
  openGraph: {
    title: 'Keratinové bondy na prodloužení vlasů | Příslušenství | Mùza Hair',
    description: 'Keratinové bondy pro aplikaci vlasů na prodloužení. Profesionální kvalita, vhodné pro keratin metodu. Mùza Hair Praha.',
    url: 'https://www.muzahair.cz/prislusenstvi/keratin',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Page() {
  return <PagePlaceholder title="Keratin" description="Kvalitní keratin pro prodlužování vlasů." icon="💊" />;
}
