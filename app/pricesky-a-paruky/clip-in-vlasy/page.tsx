import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Clip-in vlasy z pravých vlasů | Příčesky | Mùza Hair Praha',
  description: 'Clip-in vlasy z pravých slovanských vlasů — rychlé nasazení bez lepidla. Standard, LUXE, Platinum. Vlastní výroba Praha. Snadná aplikace doma.',
  alternates: { canonical: 'https://www.muzahair.cz/pricesky-a-paruky/clip-in-vlasy' },
  openGraph: {
    title: 'Clip-in vlasy z pravých vlasů | Příčesky | Mùza Hair Praha',
    description: 'Clip-in vlasy z pravých slovanských vlasů — rychlé nasazení bez lepidla. Standard, LUXE, Platinum. Vlastní výroba Praha. Snadná aplikace doma.',
    url: 'https://www.muzahair.cz/pricesky-a-paruky/clip-in-vlasy',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function ClipInVlasyPage() {
  return <PagePlaceholder title="Clip in vlasy" description="Clip-in vlasy pro jednoduché a rychlé prodloužení." icon="💁‍♀️" />;
}
