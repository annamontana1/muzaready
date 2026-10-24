import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Paruky na míru z pravých vlasů | Múza Hair Praha',
  description: 'Paruky na míru z pravých slovanských vlasů. Individuální výroba v Praze — délka, hustota, cap size. Konzultace zdarma.',
  alternates: { canonical: 'https://muzahair.cz/pricesky-a-paruky/paruky-na-miru' },
  openGraph: {
    title: 'Paruky na míru z pravých vlasů | Múza Hair Praha',
    description: 'Paruky na míru z pravých slovanských vlasů. Individuální výroba v Praze — délka, hustota, cap size. Konzultace zdarma.',
    url: 'https://muzahair.cz/pricesky-a-paruky/paruky-na-miru',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function ParukyNaMiruPage() {
  return <PagePlaceholder title="Paruky na míru" description="Prémiové paruky šité na míru podle vašich představ. 100% přírodní vlasy." icon="✨" />;
}
