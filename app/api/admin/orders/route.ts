import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;

    const orderStatus = searchParams.get('orderStatus');
    const paymentStatus = searchParams.get('paymentStatus');
    const deliveryStatus = searchParams.get('deliveryStatus');
    const channel = searchParams.get('channel');
    const emailSearch = searchParams.get('email');
    const nameSearch = searchParams.get('name');
    const filterMonth = searchParams.get('month');
    const filterDay = searchParams.get('day');

    let limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    if (isNaN(limit) || limit < 1) limit = 50;
    if (limit > 100) limit = 100;

    const sortParam = searchParams.get('sort') || '-createdAt';
    const isDescending = sortParam.startsWith('-');
    const sortField = isDescending ? sortParam.slice(1) : sortParam;
    const allowedSortFields = ['createdAt', 'updatedAt', 'total', 'id', 'email'];
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'createdAt';

    const supabase = getSupabaseAdminClient();

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        id, email, firstName, lastName, total, subtotal, shippingCost, discountAmount,
        orderStatus, paymentStatus, deliveryStatus, channel, tags, riskScore, naklad,
        notesInternal, createdAt, updatedAt, lastStatusChangeAt,
        order_items(id)
      `, { count: 'exact' });

    if (orderStatus) query = query.eq('orderStatus', orderStatus);
    if (paymentStatus) query = query.eq('paymentStatus', paymentStatus);
    if (deliveryStatus) query = query.eq('deliveryStatus', deliveryStatus);
    if (channel) query = query.eq('channel', channel);
    if (emailSearch) query = query.ilike('email', `%${emailSearch}%`);

    if (nameSearch) {
      query = query.or(`firstName.ilike.%${nameSearch}%,lastName.ilike.%${nameSearch}%`);
    }

    if (filterMonth) {
      const [year, month] = filterMonth.split('-').map(Number);
      const start = new Date(year, month - 1, 1).toISOString();
      const end = new Date(year, month, 1).toISOString();
      if (filterDay) {
        const day = parseInt(filterDay);
        const dayStart = new Date(year, month - 1, day).toISOString();
        const dayEnd = new Date(year, month - 1, day + 1).toISOString();
        query = query.gte('createdAt', dayStart).lt('createdAt', dayEnd);
      } else {
        query = query.gte('createdAt', start).lt('createdAt', end);
      }
    }

    query = query
      .order(validSortField, { ascending: !isDescending })
      .range(offset, offset + limit - 1);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error.message);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    const total = count ?? 0;

    const transformedOrders = (orders || []).map((order: any) => ({
      id: order.id,
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost || 0,
      discountAmount: order.discountAmount || 0,
      orderStatus: order.orderStatus || 'draft',
      paymentStatus: order.paymentStatus || 'unpaid',
      deliveryStatus: order.deliveryStatus || 'pending',
      channel: order.channel || 'web',
      tags: order.tags ? (typeof order.tags === 'string' ? JSON.parse(order.tags) : order.tags) : [],
      riskScore: order.riskScore || 0,
      naklad: order.naklad ?? null,
      notesInternal: order.notesInternal || null,
      itemCount: (order.order_items || []).length,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      lastStatusChangeAt: order.lastStatusChangeAt,
    }));

    return NextResponse.json(
      { orders: transformedOrders, total, limit, offset, hasMore: offset + limit < total },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { orderId, orderStatus, paymentStatus, deliveryStatus, tags, notesInternal, notesCustomer, riskScore } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing required field: orderId' }, { status: 400 });
    }

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (deliveryStatus) updateData.deliveryStatus = deliveryStatus;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (notesInternal !== undefined) updateData.notesInternal = notesInternal;
    if (notesCustomer !== undefined) updateData.notesCustomer = notesCustomer;
    if (riskScore !== undefined) updateData.riskScore = riskScore;
    if (orderStatus || paymentStatus || deliveryStatus) {
      updateData.lastStatusChangeAt = new Date().toISOString();
    }

    const { data: order, error } = await getSupabaseAdminClient()
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update order', details: error.message }, { status: 500 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
