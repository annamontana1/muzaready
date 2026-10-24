import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LUXE vlasy na prodloužení | Panenské vlasy | Múza Hair Praha',
  description: 'LUXE panenské vlasy — trvanlivost 12–18 měsíců, nejoblíbenější kategorie. Slovanský původ, vlastní barvírna Praha. Keratin, nanotapes, weft. Od 6 900 Kč.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/luxe' },
  openGraph: {
    title: 'LUXE vlasy na prodloužení | Panenské vlasy | Múza Hair Praha',
    description: 'LUXE panenské vlasy — trvanlivost 12–18 měsíců, nejoblíbenější kategorie. Slovanský původ, vlastní barvírna Praha. Keratin, nanotapes, weft. Od 6 900 Kč.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/luxe',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
