import { redirect } from 'next/navigation';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export default function Page() {
  // Redirect to the new order tracking page
  redirect('/sledovani-objednavky');
}