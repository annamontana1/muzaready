import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Ostatní příslušenství pro prodloužení vlasů | Múza Hair',
  description: 'Ostatní příslušenství pro prodloužení a péči o vlasy. Vše potřebné pro keratin i nanotapes metodu. Múza Hair Praha.',
  alternates: { canonical: 'https://muzahair.cz/prislusenstvi/ostatni' },
  openGraph: {
    title: 'Ostatní příslušenství pro prodloužení vlasů | Múza Hair',
    description: 'Ostatní příslušenství pro prodloužení a péči o vlasy. Vše potřebné pro keratin i nanotapes metodu. Múza Hair Praha.',
    url: 'https://muzahair.cz/prislusenstvi/ostatni',
    locale: 'cs_CZ',
    type: 'website',
  },
};
export default function Page() {
  return <PagePlaceholder title="Ostatní příslušenství" description="Další užitečné produkty pro práci s vlasy." icon="📦" />;
}
