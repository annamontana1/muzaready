import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect to the new order tracking page
  redirect('/sledovani-objednavky');
}
