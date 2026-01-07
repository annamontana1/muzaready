import { Metadata } from 'next';

// Force dynamic rendering - prevents prerendering of child pages during build
// This ensures the catalog page fetches real data from API, not empty build-time state
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Nebarvené panenské vlasy | Mùza Hair Praha',
  description: '100 % nebarvené panenské vlasy z našeho výkupu. Přirozené odstíny, dlouhá životnost, vhodné pro profesionální barvení a odbarvování.',
};

export default function NebarvenePanskeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
