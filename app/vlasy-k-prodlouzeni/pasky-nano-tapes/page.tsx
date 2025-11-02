import PagePlaceholder from '@/components/PagePlaceholder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nano tapes – vlasové pásky pro prodloužení | Mùza Hair',
  description: 'Profesionální nano tapes (vlasové pásky) z pravých vlasů. Rychlá aplikace, šetrné k vlasům.',
};

export default function PaskyNanoTapesPage() {
  return (
    <PagePlaceholder
      title="Pásky (nano tapes)"
      description="Profesionální nano tapes z pravých vlasů. Rychlá aplikace, šetrné k vlasům. Odstíny 5-10."
      icon="📏"
    />
  );
}
