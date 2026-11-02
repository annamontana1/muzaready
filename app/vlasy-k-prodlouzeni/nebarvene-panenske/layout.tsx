import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nebarvené panenské vlasy k prodloužení | Mùza Hair Praha',
  description: 'Nebarvené panenské vlasy — chemicky neupravené, se zachovanou kutikulou. Standard, LUXE, Platinum. Slovanský původ, vlastní barvírna Praha. Od 3 900 Kč.',
  alternates: { canonical: 'https://www.muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske' },
  openGraph: {
    title: 'Nebarvené panenské vlasy k prodloužení | Mùza Hair Praha',
    description: 'Nebarvené panenské vlasy — chemicky neupravené, se zachovanou kutikulou. Standard, LUXE, Platinum. Slovanský původ, vlastní barvírna Praha. Od 3 900 Kč.',
    url: 'https://www.muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
