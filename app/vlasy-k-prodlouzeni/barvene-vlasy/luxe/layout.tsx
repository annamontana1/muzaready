import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barvené vlasy LUXE na prodloužení | Panenské blond | Múza Hair',
  description: 'Barvené LUXE vlasy — panenské vlasy v blond odstínech, trvanlivost 12–18 měsíců. Vlastní barvírna Praha. Keratin, nanotapes, weft. Od 7 900 Kč.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-vlasy/luxe' },
  openGraph: {
    title: 'Barvené vlasy LUXE na prodloužení | Panenské blond | Múza Hair',
    description: 'Barvené LUXE vlasy — panenské vlasy v blond odstínech, trvanlivost 12–18 měsíců. Vlastní barvírna Praha. Keratin, nanotapes, weft. Od 7 900 Kč.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-vlasy/luxe',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
