import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Kosmetika pro prodloužené vlasy | Péče | Mùza Hair Praha',
  description: 'Profesionální kosmetika pro péči o prodloužené vlasy — šampony, kondicionéry, séra. Šetrné složení pro keratin i nanotapes. Mùza Hair Praha.',
  alternates: { canonical: 'https://www.muzahair.cz/prislusenstvi/kosmetika' },
  openGraph: {
    title: 'Kosmetika pro prodloužené vlasy | Péče | Mùza Hair Praha',
    description: 'Profesionální kosmetika pro péči o prodloužené vlasy — šampony, kondicionéry, séra. Šetrné složení pro keratin i nanotapes. Mùza Hair Praha.',
    url: 'https://www.muzahair.cz/prislusenstvi/kosmetika',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Page() {
  return <PagePlaceholder title="Kosmetika" description="Péče o prodloužené vlasy. Šampony, kondicionéry, masky." icon="🧴" />;
}
