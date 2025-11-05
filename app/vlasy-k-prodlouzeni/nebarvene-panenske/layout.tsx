import { Metadata } from 'next';

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
