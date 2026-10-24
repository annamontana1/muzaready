import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barvené vlasy Standard na prodloužení | Blond | Múza Hair',
  description: 'Barvené vlasy Standard — Remy vlasy v blond odstínech 5–10, trvanlivost 6–9 měsíců. Vlastní barvírna Praha, šetrné odbarvování. Keratin i nanotapes.',
  alternates: { canonical: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-vlasy/standard' },
  openGraph: {
    title: 'Barvené vlasy Standard na prodloužení | Blond | Múza Hair',
    description: 'Barvené vlasy Standard — Remy vlasy v blond odstínech 5–10, trvanlivost 6–9 měsíců. Vlastní barvírna Praha, šetrné odbarvování. Keratin i nanotapes.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni/barvene-vlasy/standard',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
