import PagePlaceholder from '@/components/PagePlaceholder';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function Page() {
  return <PagePlaceholder title="Jak nakupovat" description="Návod jak nakupovat v našem e-shopu." icon="🛒" />;
}