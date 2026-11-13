import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { searchCustomers } from '@/lib/customers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STORE_EMAIL = 'prodejna@muzahair.cz';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const q = request.nextUrl.searchParams.get('q')?.trim() || '';
  if (q.length < 2) {
    return NextResponse.json({ customers: [] });
  }

  try {
    const supabase = getSupabaseAdminClient();

    // 1) CRM zákazníci (jméno, e-mail, telefon, Instagram, firma, IČO)
    const crm = await searchCustomers(q, 8);
    const crmResult = crm.map((c) => ({
      source: 'customer' as const,
      customerId: c.id,
      email: c.email || '',
      firstName: c.firstName,
      lastName: c.lastName,
      phone: c.phone || '',
      instagramHandle: c.instagramHandle || '',
      companyName: c.companyName || '',
      ico: c.ico || '',
      dic: c.dic || '',
      street: c.street || '',
      city: c.city || '',
      zipCode: c.zipCode || '',
      isB2B: !!(c.companyName || c.ico),
    }));

    // 2) Starší zákazníci, kteří jsou zatím jen v objednávkách
    // Search orders — match name, email, phone, company, ICO
    // Use ilike for case-insensitive partial match
    const { data: orders } = await supabase
      .from('orders')
      .select('email, firstName, lastName, phone, companyName, ico, dic, streetAddress, city, zipCode, createdAt')
      .neq('email', STORE_EMAIL)
      .or(
        `email.ilike.%${q}%,firstName.ilike.%${q}%,lastName.ilike.%${q}%,phone.ilike.%${q}%,companyName.ilike.%${q}%,ico.ilike.%${q}%`
      )
      .order('createdAt', { ascending: false })
      .limit(40);

    // Deduplicate: prefer the most recent record per email.
    // If no email (or store email), fall back to phone dedup.
    // Zákazníky, které už vrátilo CRM, z objednávek neopakovat.
    const seenEmails = new Set<string>(crmResult.map((c) => c.email.toLowerCase()).filter(Boolean));
    const seenPhones = new Set<string>(crmResult.map((c) => c.phone.replace(/\s/g, '')).filter(Boolean));
    const unique: NonNullable<typeof orders> = [];

    for (const o of orders || []) {
      const emailKey = o.email?.toLowerCase();
      const phoneKey = o.phone?.replace(/\s/g, '');

      if (emailKey && emailKey !== STORE_EMAIL) {
        if (seenEmails.has(emailKey)) continue;
        seenEmails.add(emailKey);
      } else if (phoneKey) {
        if (seenPhones.has(phoneKey)) continue;
        seenPhones.add(phoneKey);
      }

      unique.push(o);
      if (crmResult.length + unique.length >= 8) break;
    }

    const orderResult = unique.map((o) => ({
      source: 'order' as const,
      email: o.email === STORE_EMAIL ? '' : o.email,
      firstName: o.firstName,
      lastName: o.lastName,
      phone: o.phone || '',
      instagramHandle: '',
      companyName: o.companyName || '',
      ico: o.ico || '',
      dic: o.dic || '',
      street: o.streetAddress || '',
      city: o.city || '',
      zipCode: o.zipCode || '',
      isB2B: !!(o.companyName || o.ico),
    }));

    return NextResponse.json({ customers: [...crmResult, ...orderResult] });
  } catch (error: any) {
    console.error('Customer search error:', error);
    return NextResponse.json({ customers: [] });
  }
}
