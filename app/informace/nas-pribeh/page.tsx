import PagePlaceholder from '@/components/PagePlaceholder';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function Page() {
  return <PagePlaceholder title="Náš příběh" description="Příběh značky Mùza Hair - 8 let na trhu." icon="📖" />;
}