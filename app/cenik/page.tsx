import PagePlaceholder from '@/components/PagePlaceholder';

// Don't pre-render this page during build
export const dynamic = 'force-dynamic';

export default function CenikPage() {
  return <PagePlaceholder title="Ceník" description="Kompletní ceník všech produktů a služeb." icon="💰" />;
}
