import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Hřebeny pro prodloužené vlasy | Speciální péče | Múza Hair',
  description: 'Speciální hřebeny pro prodloužené vlasy — šetrné rozčesávání bez poškození bondů. Múza Hair Praha.',
  alternates: { canonical: 'https://muzahair.cz/prislusenstvi/hrebeny' },
  openGraph: {
    title: 'Hřebeny pro prodloužené vlasy | Speciální péče | Múza Hair',
    description: 'Speciální hřebeny pro prodloužené vlasy — šetrné rozčesávání bez poškození bondů. Múza Hair Praha.',
    url: 'https://muzahair.cz/prislusenstvi/hrebeny',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Page() {
  return <PagePlaceholder title="Hřebeny" description="Speciální hřebeny pro prodloužené vlasy." icon="💆‍♀️" />;
}
