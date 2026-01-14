import PagePlaceholder from '@/components/PagePlaceholder';

// ISR - revalidate every day
export const revalidate = 86400;

export default function Page() {
  return <PagePlaceholder title="Jak nakupovat" description="Návod jak nakupovat v našem e-shopu." icon="🛒" />;
}