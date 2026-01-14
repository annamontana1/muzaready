import PagePlaceholder from '@/components/PagePlaceholder';

// ISR - revalidate every day
export const revalidate = 86400;

export default function CenikPage() {
  return <PagePlaceholder title="Ceník" description="Kompletní ceník všech produktů a služeb." icon="💰" />;
}
