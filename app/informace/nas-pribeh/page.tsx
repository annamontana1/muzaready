import PagePlaceholder from '@/components/PagePlaceholder';

// ISR - revalidate every day
export const revalidate = 86400;

export default function Page() {
  return <PagePlaceholder title="Náš příběh" description="Příběh značky Mùza Hair - 8 let na trhu." icon="📖" />;
}