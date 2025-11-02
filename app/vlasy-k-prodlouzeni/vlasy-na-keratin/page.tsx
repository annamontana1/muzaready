import PagePlaceholder from '@/components/PagePlaceholder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vlasy na keratin – pravé lidské vlasy | Mùza Hair',
  description: 'Prémiové vlasy k prodloužení vhodné pro keratinovou metodu.',
};

export default function VlasyNaKeratinPage() {
  return (
    <PagePlaceholder
      title="Vlasy na keratin"
      description="Prémiové vlasy k prodloužení vhodné pro keratinovou metodu. Nebarvené i barvené, všechny odstíny a délky."
      icon="🔥"
    />
  );
}
