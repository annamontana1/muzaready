import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { MODULE_VARKY, cenaCelkem, jeVraceno, monthRange } from '@/lib/odberatele';
import { currentMonthPrague } from '@/lib/odberatele-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Radek {
  trzby: number;
  /** tržby položek, u kterých známe náklad – jen z nich se počítá marže */
  trzbySNakladem: number;
  naklady: number;
  marze: number;
  pocet: number;
  chybiNaklad: number;
}

const prazdny = (): Radek => ({ trzby: 0, trzbySNakladem: 0, naklady: 0, marze: 0, pocet: 0, chybiNaklad: 0 });

function pridej(r: Radek, trzba: number, naklad: number | null) {
  r.pocet += 1;
  r.trzby += trzba;
  if (naklad === null || naklad <= 0) {
    r.chybiNaklad += 1;
    return;
  }
  r.trzbySNakladem += trzba;
  r.naklady += naklad;
  r.marze += trzba - naklad;
}

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
        where: { date: inMonth, partner: { module: MODULE_VARKY } },
        select: { items: { select: { gramaz: true, cenaPerGram: true, keratinPerGram: true, nakladPerGram: true, stav: true } } },
      }),
      prisma.b2bPayment.aggregate({
        where: { date: inMonth, partner: { module: MODULE_VARKY } },
        _sum: { amount: true },
      }),
    ]);

    const objednavky = prazdny();
    for (const o of orders) pridej(objednavky, o.total || 0, o.naklad ?? null);

    const odberatele = prazdny();
    for (const s of shipments) {
      for (const i of s.items) {
        if (jeVraceno(i)) continue;
        pridej(odberatele, cenaCelkem(i), i.nakladPerGram === null ? null : i.gramaz * i.nakladPerGram);
      }
    }

    const celkem = prazdny();
    for (const r of [objednavky, odberatele]) {
      celkem.trzby += r.trzby;
      celkem.trzbySNakladem += r.trzbySNakladem;
      celkem.naklady += r.naklady;
      celkem.marze += r.marze;
      celkem.pocet += r.pocet;
      celkem.chybiNaklad += r.chybiNaklad;
    }

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
