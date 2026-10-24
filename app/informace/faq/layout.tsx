import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Časté otázky o prodloužení vlasů | FAQ | Múza Hair Praha',
  description: 'Odpovědi na nejčastější otázky o prodloužení vlasů — keratin, nanotapes, weft, péče, trvanlivost, ceny. Múza Hair Praha.',
  alternates: { canonical: 'https://muzahair.cz/informace/faq' },
  openGraph: {
    title: 'Časté otázky o prodloužení vlasů | FAQ | Múza Hair Praha',
    description: 'Odpovědi na nejčastější otázky o prodloužení vlasů — keratin, nanotapes, weft, péče, trvanlivost, ceny. Múza Hair Praha.',
    url: 'https://muzahair.cz/informace/faq',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
