import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Časté otázky o prodloužení vlasů | FAQ | Mùza Hair Praha',
  description: 'Odpovědi na nejčastější otázky o prodloužení vlasů — keratin, nanotapes, weft, péče, trvanlivost, ceny. Mùza Hair Praha.',
  alternates: { canonical: 'https://www.muzahair.cz/informace/faq' },
  openGraph: {
    title: 'Časté otázky o prodloužení vlasů | FAQ | Mùza Hair Praha',
    description: 'Odpovědi na nejčastější otázky o prodloužení vlasů — keratin, nanotapes, weft, péče, trvanlivost, ceny. Mùza Hair Praha.',
    url: 'https://www.muzahair.cz/informace/faq',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
