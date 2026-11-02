import { Metadata } from 'next';
import PagePlaceholder from '@/components/PagePlaceholder';

export const metadata: Metadata = {
  title: 'Pomykadlo pro keratin vlasy | Příslušenství | Mùza Hair Praha',
  description: 'Profesionální pomykadlo (keratinová kleště) pro aplikaci keratinových bondů. Správná teplota pro dlouhou trvanlivost. Mùza Hair Praha.',
  alternates: { canonical: 'https://www.muzahair.cz/prislusenstvi/pomykadlo' },
  openGraph: {
    title: 'Pomykadlo pro keratin vlasy | Příslušenství | Mùza Hair Praha',
    description: 'Profesionální pomykadlo (keratinová kleště) pro aplikaci keratinových bondů. Správná teplota pro dlouhou trvanlivost. Mùza Hair Praha.',
    url: 'https://www.muzahair.cz/prislusenstvi/pomykadlo',
    locale: 'cs_CZ',
    type: 'website',
  },
};
export default function Page() {
  return <PagePlaceholder title="Pomykadlo" description="Pomykadlo pro snadnou manipulaci s vlasy." icon="🪛" />;
}
