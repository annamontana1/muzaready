import { redirect } from 'next/navigation';

// Starý formulář „Nový prodej — Instagram“ je nahrazený jednotným formulářem
// Nový prodej (kanál Instagram): ukládá zákazníka do CRM, položky objednávky
// a vystavuje běžnou fakturu. Původní verze je v historii gitu.
export default function InstagramSalePage() {
  redirect('/admin/prodeje/novy');
}
