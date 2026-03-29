import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/b2b/stats?month=2026-03
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month'); // "2026-03"

    let dateFilter: { gte: Date; lt: Date } | undefined;
    if (month) {
      const [year, m] = month.split('-').map(Number);
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      dateFilter = { gte: start, lt: end };
    }

    const [payments, sales] = await Promise.all([
      prisma.b2bPayment.aggregate({
        _sum: { amount: true },
        where: dateFilter ? { date: dateFilter } : {},
      }),
      prisma.b2bSale.aggregate({
        _sum: { totalAmount: true },
        where: dateFilter ? { createdAt: dateFilter } : {},
      }),
    ]);

    const totalPayments = payments._sum.amount || 0;
    const totalSales = sales._sum.totalAmount || 0;

    return NextResponse.json({
      totalPayments,
      totalSales,
      total: totalPayments + totalSales,
    });
  } catch (error) {
    console.error('B2B stats GET error:', error);
    return NextResponse.json({ error: 'Chyba při načítání statistik' }, { status: 500 });
  }
}
