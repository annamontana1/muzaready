import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/pos/customer-search?q=...
 *
 * Rychlé vyhledávání zákazníků pro POS formulář.
 * Prohledává Users (registrovaní) i Orders (host zákazníci).
 * Vrací max. 8 výsledků.
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  const q = request.nextUrl.searchParams.get('q')?.trim() || '';
  if (q.length < 2) {
    return NextResponse.json({ customers: [] });
  }

  try {
    // 1. Registrovaní uživatelé
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
          { companyName: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        companyName: true,
        taxId: true,
        isWholesale: true,
      },
      take: 6,
    });

    const registeredEmails = new Set(users.map((u) => u.email.toLowerCase()));

    // 2. Host zákazníci z objednávek (email/jméno/firma/IČO)
    const guestOrders = await prisma.order.findMany({
      where: {
        NOT: { email: { in: Array.from(registeredEmails) } },
        OR: [
          { email: { contains: q, mode: 'insensitive' } },
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
          { companyName: { contains: q, mode: 'insensitive' } },
          { ico: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        companyName: true,
        ico: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Deduplikace hostů podle emailu
    const guestMap = new Map<string, typeof guestOrders[0]>();
    for (const o of guestOrders) {
      if (!guestMap.has(o.email.toLowerCase())) {
        guestMap.set(o.email.toLowerCase(), o);
      }
    }
    const uniqueGuests = Array.from(guestMap.values()).slice(0, 6);

    // 3. Sloučení
    const result = [
      ...users.map((u) => ({
        source: 'registered' as const,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone || '',
        companyName: u.companyName || '',
        ico: u.taxId || '',
        isB2B: u.isWholesale || !!u.companyName,
      })),
      ...uniqueGuests
        .filter((g) => !registeredEmails.has(g.email.toLowerCase()))
        .map((g) => ({
          source: 'order' as const,
          email: g.email,
          firstName: g.firstName,
          lastName: g.lastName,
          phone: g.phone || '',
          companyName: g.companyName || '',
          ico: g.ico || '',
          isB2B: !!g.companyName || !!g.ico,
        })),
    ].slice(0, 8);

    return NextResponse.json({ customers: result });
  } catch (error: any) {
    console.error('Customer search error:', error);
    return NextResponse.json({ customers: [] });
  }
}
