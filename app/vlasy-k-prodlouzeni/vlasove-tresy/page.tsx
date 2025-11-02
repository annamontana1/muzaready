import PagePlaceholder from '@/components/PagePlaceholder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vlasové tresy – ručně šité (sewing weft) | Mùza Hair',
  description: 'Ručně šité vlasové tresy z pravých vlasů. Pevné, pohodlné, dlouhá životnost.',
};

export default function VlasoveTresyPage() {
  return (
    <PagePlaceholder
      title="Vlasové tresy (ručně šité)"
      description="Ručně šité vlasové tresy z pravých vlasů. Pevné, pohodlné, dlouhá životnost. Nebarvené i barvené varianty."
      icon="🧵"
    />
  );
}
