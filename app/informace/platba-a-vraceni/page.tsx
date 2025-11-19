import PagePlaceholder from '@/components/PagePlaceholder';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // zabraň statickému prerenderu

export default function Page() {
  return <PagePlaceholder title="Platba a vrácení" description="Informace o platebních metodách a vrácení zboží." icon="💳" />;
}
