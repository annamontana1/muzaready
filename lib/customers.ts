/**
 * CRM — zákazníci zadaní v adminu (tabulka `customers`).
 *
 * Zákazník se páruje podle e-mailu, pak podle Instagram jména, pak podle
 * telefonu. Díky tomu jde dohledat i klient, který e-mail nedal.
 */
import prisma from '@/lib/prisma';

export interface CustomerInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  instagramHandle?: string;
  companyName?: string;
  ico?: string;
  dic?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  note?: string;
  source?: string; // instagram | store | web | admin
}

export interface CustomerRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  instagramHandle: string | null;
  companyName: string | null;
  ico: string | null;
  dic: string | null;
  street: string | null;
  city: string | null;
  zipCode: string | null;
  country: string;
  note: string | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Úložiště zákazníků — v provozu Prisma (`prisma.customer`), v testech náhrada.
 * Pozn.: tabulka `customers` je dostupná jen přes Prisma (role postgres);
 * Supabase service_role na ni práva nemá.
 */
export interface CustomerStore {
  findFirst(args: { where: Record<string, unknown>; orderBy?: Record<string, 'asc' | 'desc'> }): Promise<CustomerRow | null>;
  findMany(args: { where: Record<string, unknown>; orderBy?: Record<string, 'asc' | 'desc'>; take?: number }): Promise<CustomerRow[]>;
  create(args: { data: Record<string, unknown> }): Promise<CustomerRow>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<CustomerRow>;
}

function defaultStore(): CustomerStore {
  return (prisma as any).customer as CustomerStore;
}

export function normalizeEmail(email?: string | null): string | null {
  const v = (email || '').trim().toLowerCase();
  return v && v.includes('@') ? v : null;
}

/** "+420 728 722 880" → "+420728722880" */
export function normalizePhone(phone?: string | null): string | null {
  const v = (phone || '').replace(/[\s\-()./]/g, '');
  return v.length >= 6 ? v : null;
}

/** "@Muza.Hair", "https://instagram.com/muza.hair/?hl=cs" → "muza.hair" */
export function normalizeInstagram(handle?: string | null): string | null {
  let v = (handle || '').trim().toLowerCase();
  if (!v) return null;
  v = v.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '');
  v = v.replace(/^@+/, '');
  v = v.split(/[/?#\s]/)[0];
  return v || null;
}

function clean(v?: string | null): string | null {
  const t = (v || '').trim();
  return t || null;
}

/**
 * Najde zákazníka (e-mail → Instagram → telefon) nebo ho založí.
 * U existujícího doplní / přepíše jen ta pole, která jsou teď vyplněná —
 * prázdné pole ve formuláři nikdy nesmaže uložený údaj.
 * Při chybě databáze vrací null (prodej se kvůli CRM nesmí zablokovat).
 */
export async function findOrCreateCustomer(
  input: CustomerInput,
  store: CustomerStore = defaultStore()
): Promise<CustomerRow | null> {
  const email = normalizeEmail(input.email);
  const phone = normalizePhone(input.phone);
  const instagramHandle = normalizeInstagram(input.instagramHandle);
  const firstName = clean(input.firstName);
  const lastName = clean(input.lastName);
  const companyName = clean(input.companyName);

  // Bez jména i bez kontaktu není co ukládat (anonymní prodej)
  if (!email && !phone && !instagramHandle && !firstName && !companyName) return null;

  try {
    let existing: CustomerRow | null = null;

    const lookups: Array<[string, string | null]> = [
      ['email', email],
      ['instagramHandle', instagramHandle],
      ['phone', phone],
    ];
    for (const [column, value] of lookups) {
      if (!value || existing) continue;
      existing = await store.findFirst({ where: { [column]: value }, orderBy: { createdAt: 'asc' } });
    }

    const fields: Record<string, string | null> = {
      firstName,
      lastName,
      email,
      phone,
      instagramHandle,
      companyName,
      ico: clean(input.ico),
      dic: clean(input.dic),
      street: clean(input.street),
      city: clean(input.city),
      zipCode: clean(input.zipCode),
      note: clean(input.note),
    };

    if (existing) {
      const patch: Record<string, string> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value && value !== (existing as any)[key]) patch[key] = value;
      }
      // E-mail je unikátní — nepřepisovat, pokud už patří jinému zákazníkovi
      if (patch.email) {
        const clash = await store.findFirst({ where: { email: patch.email, NOT: { id: existing.id } } });
        if (clash) delete patch.email;
      }
      if (Object.keys(patch).length === 0) return existing;
      return await store.update({ where: { id: existing.id }, data: patch });
    }

    return await store.create({
      data: {
        ...fields,
        firstName: firstName || '',
        lastName: lastName || '',
        source: input.source || 'admin',
      },
    });
  } catch (error: any) {
    console.error('Customer find/create error:', error?.message || error);
    return null;
  }
}

/**
 * Hledání zákazníků pro našeptávač (jméno, e-mail, telefon, IG, firma, IČO).
 */
export async function searchCustomers(
  query: string,
  limit = 8,
  store: CustomerStore = defaultStore()
): Promise<CustomerRow[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const contains = (value: string) => ({ contains: value, mode: 'insensitive' });
  const ig = normalizeInstagram(q) || q;
  const phone = normalizePhone(q);

  const or: Record<string, unknown>[] = [
    { firstName: contains(q) },
    { lastName: contains(q) },
    { email: contains(q) },
    { companyName: contains(q) },
    { ico: contains(q) },
    { instagramHandle: contains(ig) },
  ];
  if (phone) or.push({ phone: contains(phone) });

  // "Jana Nováková" — jméno může být ve dvou sloupcích
  if (q.includes(' ')) {
    const [first, ...rest] = q.split(/\s+/);
    or.push({ AND: [{ firstName: contains(first) }, { lastName: contains(rest.join(' ')) }] });
  }

  try {
    return await store.findMany({ where: { OR: or }, orderBy: { updatedAt: 'desc' }, take: limit });
  } catch (error: any) {
    console.error('Customer search error:', error?.message || error);
    return [];
  }
}
