import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { MODULE_VARKY, monthRange, prazdnaMarze, pridejCulikDoMarze, pridejDoMarze, sectiMarze } from '@/lib/odberatele';
import { currentMonthPrague } from '@/lib/odberatele-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reports/marze?month=YYYY-MM
 * Marže za měsíc: objednávky zaplacené v měsíci + várky odběratelů předané
 * v měsíci (bez vrácených culíků). Položky bez nákladu se do marže nepočítají.
 */
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const month = req.nextUrl.searchParams.get('month') || currentMonthPrague();
    const range = monthRange(month);
    if (!range) return NextResponse.json({ error: 'Neplatný měsíc' }, { status: 400 });
    const inMonth = { gte: range.start, lt: range.end };

    const [orders, shipments, payments] = await Promise.all([
      prisma.order.findMany({
        where: {
          paymentStatus: 'paid',
          orderStatus: { notIn: ['draft', 'cancelled'] },
          OR: [{ paidAt: inMonth }, { paidAt: null, createdAt: inMonth }],
        },
        select: { total: true, naklad: true },
      }),
      prisma.b2bShipment.findMany({
        // odběratelé vedení v Objednávkách se tu nepočítají (byli by v marži dvakrát)
        where: { date: inMonth, partner: { module: MODULE_VARKY, vObjednavkach: false } },
        select: { items: { select: { gramaz: true, cenaPerGram: true, keratinPerGram: true, nakladPerGram: true, stav: true } } },
      }),
      prisma.b2bPayment.aggregate({
        where: { date: inMonth, partner: { module: MODULE_VARKY, vObjednavkach: false } },
        _sum: { amount: true },
      }),
    ]);

    const objednavky = prazdnaMarze();
    for (const o of orders) pridejDoMarze(objednavky, o.total || 0, o.naklad ?? null);

    const odberatele = prazdnaMarze();
    for (const s of shipments) for (const i of s.items) pridejCulikDoMarze(odberatele, i);

    const celkem = sectiMarze(objednavky, odberatele);

    return NextResponse.json({
      month,
      objednavky,
      odberatele,
      celkem,
      platbyOdberatelu: payments._sum.amount || 0,
    });
  } catch (error) {
    console.error('Marze report error:', error);
    return NextResponse.json({ error: 'Marži se nepodařilo spočítat' }, { status: 500 });
  }
}
