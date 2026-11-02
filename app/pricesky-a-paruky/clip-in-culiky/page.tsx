import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Clip-in culíky z pravých vlasů | Mùza Hair Praha',
  description: 'Clip-in culíky z pravých vlasů — hustý, přirozený culík za pár vteřin. Různé délky a odstíny. Vlastní výroba Mùza Hair Praha.',
  alternates: { canonical: 'https://muzahair.cz/pricesky-a-paruky/clip-in-culiky' },
  openGraph: {
    title: 'Clip-in culíky z pravých vlasů | Mùza Hair Praha',
    description: 'Clip-in culíky z pravých vlasů — hustý, přirozený culík za pár vteřin. Různé délky a odstíny. Vlastní výroba Mùza Hair Praha.',
    url: 'https://muzahair.cz/pricesky-a-paruky/clip-in-culiky',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function ClipInCulikyPage() {
  return <PagePlaceholder title="Clip-in culíky" description="Nejkrásnější culíky široko daleko ❤️ Prémiová kvalita z pravých vlasů." icon="🎀" />;
}
