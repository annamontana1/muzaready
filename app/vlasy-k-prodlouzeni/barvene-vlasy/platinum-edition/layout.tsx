import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barvené Platinum vlasy na prodloužení | Slovanské blond | Múza Hair',
  description: 'Barvené Platinum Edition — nejkvalitnější slovanské vlasy v blond odstínech. Trvanlivost 18–24 měsíců, certifikát původu. Vlastní barvírna Praha.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition' },
  openGraph: {
    title: 'Barvené Platinum vlasy na prodloužení | Slovanské blond | Múza Hair',
    description: 'Barvené Platinum Edition — nejkvalitnější slovanské vlasy v blond odstínech. Trvanlivost 18–24 měsíců, certifikát původu. Vlastní barvírna Praha.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
