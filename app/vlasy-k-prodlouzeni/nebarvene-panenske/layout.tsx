import { Metadata } from 'next';

// ISR - revalidate every hour
export const revalidate = 3600;

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
