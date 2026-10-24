import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baby Shades vlasy | Jemné dětské odstíny | Múza Hair Praha',
  description: 'Baby Shades — jemné dětské vlasy v přirozených světlých odstínech. Ideální pro blond zákaznice. Vlastní barvírna Praha, slovanský původ.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/baby-shades' },
  openGraph: {
    title: 'Baby Shades vlasy | Jemné dětské odstíny | Múza Hair Praha',
    description: 'Baby Shades — jemné dětské vlasy v přirozených světlých odstínech. Ideální pro blond zákaznice. Vlastní barvírna Praha, slovanský původ.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/baby-shades',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
