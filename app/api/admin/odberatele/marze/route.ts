import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { MODULE_VARKY, marzePoMesicich } from '@/lib/odberatele';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/odberatele/marze
 * Čistá marže odběratelů po měsících (podle data várky, bez vrácených culíků).
 * Interní – náklady se nikdy neposílají odběratelům.
 */
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const partners = await prisma.b2bPartner.findMany({
      where: { module: MODULE_VARKY },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: {
        id: true,
        name: true,
        shipments: {
          select: {
            date: true,
            items: { select: { gramaz: true, cenaPerGram: true, keratinPerGram: true, nakladPerGram: true, stav: true } },
          },
        },
      },
    });

    const mesice = marzePoMesicich(partners.map((p) => ({ id: p.id, name: p.name, varky: p.shipments })));
    return NextResponse.json({ mesice });
  } catch (error) {
    console.error('Odberatele marze error:', error);
    return NextResponse.json({ error: 'Marži se nepodařilo spočítat' }, { status: 500 });
  }
}
