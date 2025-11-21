import PagePlaceholder from '@/components/PagePlaceholder';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function Page() {
  return <PagePlaceholder title="FAQ - Často kladené otázky" description="Odpovědi na nejčastější dotazy." icon="❓" />;
}