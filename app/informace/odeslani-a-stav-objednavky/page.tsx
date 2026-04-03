import { redirect } from 'next/navigation';

export const metadata = {
  alternates: { canonical: 'https://muzahair.cz/sledovani-objednavky' },
};

export default function Page() {
  redirect('/sledovani-objednavky');
}