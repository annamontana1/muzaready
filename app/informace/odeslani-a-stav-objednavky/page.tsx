import { redirect } from 'next/navigation';

// ISR - revalidate every day
export const revalidate = 86400;


export default function Page() {
  // Redirect to the new order tracking page
  redirect('/sledovani-objednavky');
}