import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/orders
 * List orders with filtering, pagination, and sorting
 *
 * Query Parameters:
 * - orderStatus: Filter by order status (draft, pending, paid, processing, shipped, completed, cancelled)
 * - paymentStatus: Filter by payment status (unpaid, partial, paid, refunded)
 * - deliveryStatus: Filter by delivery status (pending, shipped, delivered, returned)
 * - channel: Filter by sales channel (web, pos, ig_dm)
 * - email: Search by customer email (partial, case-insensitive)
 * - limit: Items per page (1-100, default 50)
 * - offset: Pagination offset (default 0)
 * - sort: Sort field (default -createdAt). Prefix with - for descending
 */
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Use request.nextUrl.searchParams instead of new URL(request.url)
    const searchParams = request.nextUrl.searchParams;

    // Extract and validate filters
    const orderStatus = searchParams.get('orderStatus');
    const paymentStatus = searchParams.get('paymentStatus');
    const deliveryStatus = searchParams.get('deliveryStatus');
    const channel = searchParams.get('channel');
    const emailSearch = searchParams.get('email');

    // Pagination
    let limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate and clamp limit
    if (isNaN(limit) || limit < 1) limit = 50;
    if (limit > 100) limit = 100;

    // Sorting
    const sortParam = searchParams.get('sort') || '-createdAt';
    const isDescending = sortParam.startsWith('-');
    const sortField = isDescending ? sortParam.slice(1) : sortParam;

    // Whitelist safe sort fields to prevent injection
    const allowedSortFields = ['createdAt', 'updatedAt', 'total', 'id', 'email'];
    const validSortField = allowedSortFields.includes(sortField) ? sortField : 'createdAt';

    // Build where clause
    const where: any = {};

    if (orderStatus) where.orderStatus = orderStatus;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (deliveryStatus) where.deliveryStatus = deliveryStatus;
    if (channel) where.channel = channel;

    // Email search (case-insensitive partial match)
    if (emailSearch) {
      where.email = {
        contains: emailSearch,
        mode: 'insensitive',
      };
    }

    // Fetch orders in parallel with total count
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              sku: {
                select: {
                  id: true,
                  sku: true,
                  name: true,
                  shadeName: true,
                  lengthCm: true,
                },
              },
            },
          },
        },
        orderBy: {
          [validSortField]: isDescending ? 'desc' : 'asc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
    ]);

    // Transform to admin-friendly format
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      email: order.email,
      firstName: order.firstName,
      lastName: order.lastName,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost || 0,
      discountAmount: order.discountAmount || 0,
      orderStatus: (order as any).orderStatus || 'draft',
      paymentStatus: (order as any).paymentStatus || 'unpaid',
      deliveryStatus: (order as any).deliveryStatus || 'pending',
      channel: (order as any).channel || 'web',
      tags: (order as any).tags ? JSON.parse((order as any).tags) : [],
      riskScore: (order as any).riskScore || 0,
      itemCount: order.items.length,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      lastStatusChangeAt: (order as any).lastStatusChangeAt,
    }));

    const hasMore = offset + limit < total;

    return NextResponse.json(
      {
        orders: transformedOrders,
        total,
        limit,
        offset,
        hasMore,
      },
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

/**
 * PATCH /api/admin/orders
 * Update order status and metadata
 *
 * Request Body:
 * - orderId: Order ID to update (required)
 * - orderStatus: New order status (draft, pending, paid, processing, shipped, completed, cancelled)
 * - paymentStatus: New payment status (unpaid, partial, paid, refunded)
 * - deliveryStatus: New delivery status (pending, shipped, delivered, returned)
 * - tags: Tags array (optional)
 * - notesInternal: Internal admin notes (optional)
 * - notesCustomer: Customer-facing notes (optional)
 * - riskScore: Risk score 0-100 (optional)
 */
export async function PATCH(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { orderId, orderStatus, paymentStatus, deliveryStatus, tags, notesInternal, notesCustomer, riskScore } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
        { status: 400 }
      );
    }

    // Validate statuses if provided
    const validOrderStatuses = ['draft', 'pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
    const validPaymentStatuses = ['unpaid', 'partial', 'paid', 'refunded'];
    const validDeliveryStatuses = ['pending', 'shipped', 'delivered', 'returned'];

    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { error: `Invalid orderStatus. Must be one of: ${validOrderStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return NextResponse.json(
        { error: `Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (deliveryStatus && !validDeliveryStatuses.includes(deliveryStatus)) {
      return NextResponse.json(
        { error: `Invalid deliveryStatus. Must be one of: ${validDeliveryStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (deliveryStatus) updateData.deliveryStatus = deliveryStatus;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (notesInternal !== undefined) updateData.notesInternal = notesInternal;
    if (notesCustomer !== undefined) updateData.notesCustomer = notesCustomer;
    if (riskScore !== undefined) updateData.riskScore = riskScore;

    // Always update lastStatusChangeAt if any status changed
    if (orderStatus || paymentStatus || deliveryStatus) {
      updateData.lastStatusChangeAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: {
            sku: {
              select: {
                id: true,
                sku: true,
                name: true,
                shadeName: true,
                lengthCm: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
