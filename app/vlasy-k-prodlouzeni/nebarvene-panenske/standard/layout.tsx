import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Standard vlasy na prodloužení | Keratinové pramínky | Múza Hair',
  description: 'Standard vlasy na prodloužení — Remy vlasy, trvanlivost 6–9 měsíců. Keratinové pramínky, nanotapes nebo weft. Český výrobce Praha. Od 3 900 Kč.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/standard' },
  openGraph: {
    title: 'Standard vlasy na prodloužení | Keratinové pramínky | Múza Hair',
    description: 'Standard vlasy na prodloužení — Remy vlasy, trvanlivost 6–9 měsíců. Keratinové pramínky, nanotapes nebo weft. Český výrobce Praha. Od 3 900 Kč.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/standard',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
