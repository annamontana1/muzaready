import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barvené vlasy na prodloužení | Blond odstíny | Múza Hair Praha',
  description: 'Profesionálně barvené vlasy na prodloužení — blond odstíny 5–10. Vlastní barvírna Praha, šetrné odbarvování. Standard, LUXE, Platinum. Keratin i nanotapes.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-vlasy' },
  openGraph: {
    title: 'Barvené vlasy na prodloužení | Blond odstíny | Múza Hair Praha',
    description: 'Profesionálně barvené vlasy na prodloužení — blond odstíny 5–10. Vlastní barvírna Praha, šetrné odbarvování. Standard, LUXE, Platinum. Keratin i nanotapes.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-vlasy',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
