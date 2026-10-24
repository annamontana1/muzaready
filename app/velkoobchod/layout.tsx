import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Velkoobchod vlasů pro salony | B2B | Múza Hair Praha',
  description: 'Velkoobchodní prodej pravých vlasů pro kadeřnické salony a extension specialisty. Vlastní barvírna Praha, slovanské vlasy, partnerský program. Vzorkovník zdarma.',
  alternates: { canonical: 'https://muzahair.cz/velkoobchod' },
  openGraph: {
    title: 'Velkoobchod vlasů | Múza Hair B2B',
    description: 'Velkoobchodní dodavatel pravých vlasů pro kadeřnické salony. Slovanské vlasy, vlastní barvírna Praha.',
    url: 'https://muzahair.cz/velkoobchod',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function VelkoobchodLayout({ children }: { children: React.ReactNode }) {
  return children;
}
