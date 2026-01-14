import PagePlaceholder from '@/components/PagePlaceholder';

// ISR - revalidate every day
export const revalidate = 86400;

export default function Page() {
  return <PagePlaceholder title="Platba a vrácení" description="Informace o platebních metodách a vrácení zboží." icon="💳" />;
}
