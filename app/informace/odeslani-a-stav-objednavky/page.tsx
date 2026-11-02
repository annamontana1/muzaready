import { redirect } from 'next/navigation';

export const metadata = {
  alternates: { canonical: 'https://www.muzahair.cz/sledovani-objednavky' },
};

export default function Page() {
  redirect('/sledovani-objednavky');
}