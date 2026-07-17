import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdminClient();

    const { count, error } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .or('orderStatus.eq.pending,and(orderStatus.eq.processing,paymentStatus.eq.paid,deliveryStatus.eq.pending)');

    if (error) {
      console.error('Error fetching pending orders count:', error.message);
      return NextResponse.json({ error: 'Failed to fetch pending orders count' }, { status: 500 });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch (error) {
    console.error('Error fetching pending orders count:', error);
    return NextResponse.json({ error: 'Failed to fetch pending orders count' }, { status: 500 });
  }
}
