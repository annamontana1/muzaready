import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Clip-in ofiny z pravých vlasů | Mùza Hair Praha',
  description: 'Clip-in ofiny z pravých vlasů — přirozený vzhled, snadná aplikace. Více odstínů. Vlastní výroba Mùza Hair Praha. Okamžité nasazení bez kadeřníka.',
  alternates: { canonical: 'https://www.muzahair.cz/pricesky-a-paruky/clip-in-ofiny' },
  openGraph: {
    title: 'Clip-in ofiny z pravých vlasů | Mùza Hair Praha',
    description: 'Clip-in ofiny z pravých vlasů — přirozený vzhled, snadná aplikace. Více odstínů. Vlastní výroba Mùza Hair Praha. Okamžité nasazení bez kadeřníka.',
    url: 'https://www.muzahair.cz/pricesky-a-paruky/clip-in-ofiny',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function ClipInOfinyPage() {
  return <PagePlaceholder title="Clip-in ofiny" description="Clip-in ofiny pro okamžité prodloužení vlasů. Snadná aplikace, přirozený vzhled." icon="💇‍♀️" />;
}
