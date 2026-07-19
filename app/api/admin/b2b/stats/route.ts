import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month');

    const supabase = getSupabaseAdminClient();

    let paymentsQuery = supabase.from('b2b_payments').select('amount');
    let salesQuery = supabase.from('b2b_sales').select('totalAmount');

    if (month) {
      const [year, m] = month.split('-').map(Number);
      const start = new Date(year, m - 1, 1).toISOString();
      const end = new Date(year, m, 1).toISOString();
      paymentsQuery = paymentsQuery.gte('date', start).lt('date', end);
      salesQuery = salesQuery.gte('createdAt', start).lt('createdAt', end);
    }

    const [paymentsResult, salesResult] = await Promise.all([
      paymentsQuery,
      salesQuery,
    ]);

    const totalPayments = (paymentsResult.data || []).reduce(
      (sum, p) => sum + (Number(p.amount) || 0), 0
    );
    const totalSales = (salesResult.data || []).reduce(
      (sum, s) => sum + (Number(s.totalAmount) || 0), 0
    );

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
