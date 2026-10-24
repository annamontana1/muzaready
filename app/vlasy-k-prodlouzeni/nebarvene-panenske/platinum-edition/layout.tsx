import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platinum vlasy na prodloužení | Nejkvalitnější vlasy | Múza Hair',
  description: 'Platinum Edition — nejkvalitnější slovanské panenské vlasy, trvanlivost 18–24 měsíců. Certifikát původu UA/PL/RO. Showroom Praha. Od 10 900 Kč.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition' },
  openGraph: {
    title: 'Platinum vlasy na prodloužení | Nejkvalitnější vlasy | Múza Hair',
    description: 'Platinum Edition — nejkvalitnější slovanské panenské vlasy, trvanlivost 18–24 měsíců. Certifikát původu UA/PL/RO. Showroom Praha. Od 10 900 Kč.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
