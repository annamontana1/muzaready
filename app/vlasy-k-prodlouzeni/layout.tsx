import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vlasy k prodloužení | Keratin, Nanotapes, Weft | Múza Hair',
  description: 'Prémiové pravé vlasy k prodloužení — Standard, LUXE, Platinum. Keratinové pramínky, nanotapes, vlasové tresy. Český výrobce, showroom Praha.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni' },
  openGraph: {
    title: 'Vlasy k prodloužení | Múza Hair Praha',
    description: 'Prémiové pravé vlasy k prodloužení od českého výrobce. Standard, LUXE, Platinum. Showroom Praha.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function VlasyKProdlouzeniLayout({ children }: { children: React.ReactNode }) {
  return children;
}
