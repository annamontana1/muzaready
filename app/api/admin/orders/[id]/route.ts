import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

/**
 * GET /api/admin/orders/[id]
 * Fetch single order with full details and items
 *
 * Response:
 * {
 *   id, email, firstName, lastName, phone, address fields...
 *   orderStatus, paymentStatus, deliveryStatus, channel, tags, riskScore,
 *   notesInternal, notesCustomer, total, subtotal, shippingCost, discountAmount,
 *   paymentMethod, deliveryMethod,
 *   items: [{ id, nameSnapshot, grams, pricePerGram, lineTotal, saleMode, skuId, sku: { id, sku, name, shadeName, lengthCm } }],
 *   createdAt, updatedAt, lastStatusChangeAt
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
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
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            status: true,
            createdAt: true,
            pdfGenerated: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Transform order to include all admin-facing fields
    const transformedOrder = {
      ...order,
      orderStatus: (order as any).orderStatus || 'draft',
      paymentStatus: (order as any).paymentStatus || 'unpaid',
      deliveryStatus: (order as any).deliveryStatus || 'pending',
      channel: (order as any).channel || 'web',
      tags: (order as any).tags ? JSON.parse((order as any).tags) : [],
      riskScore: (order as any).riskScore || 0,
      notesInternal: (order as any).notesInternal,
      notesCustomer: (order as any).notesCustomer,
      lastStatusChangeAt: (order as any).lastStatusChangeAt,
    };

    return NextResponse.json(transformedOrder, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch order',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/orders/[id]
 * Update order status and metadata
 *
 * Request Body:
 * {
 *   orderStatus?: "draft" | "pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled"
 *   paymentStatus?: "unpaid" | "partial" | "paid" | "refunded"
 *   deliveryStatus?: "pending" | "shipped" | "delivered" | "returned"
 *   tags?: string[]
 *   notesInternal?: string
 *   notesCustomer?: string
 *   riskScore?: number (0-100)
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate statuses if provided
    const validOrderStatuses = ['draft', 'pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
    const validPaymentStatuses = ['unpaid', 'partial', 'paid', 'refunded'];
    const validDeliveryStatuses = ['pending', 'shipped', 'delivered', 'returned'];

    if (body.orderStatus && !validOrderStatuses.includes(body.orderStatus)) {
      return NextResponse.json(
        { error: `Invalid orderStatus. Must be one of: ${validOrderStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.paymentStatus && !validPaymentStatuses.includes(body.paymentStatus)) {
      return NextResponse.json(
        { error: `Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    if (body.deliveryStatus && !validDeliveryStatuses.includes(body.deliveryStatus)) {
      return NextResponse.json(
        { error: `Invalid deliveryStatus. Must be one of: ${validDeliveryStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (body.orderStatus !== undefined) updateData.orderStatus = body.orderStatus;
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus;
    if (body.deliveryStatus !== undefined) updateData.deliveryStatus = body.deliveryStatus;
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;
    if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags);
    if (body.notesInternal !== undefined) updateData.notesInternal = body.notesInternal;
    if (body.notesCustomer !== undefined) updateData.notesCustomer = body.notesCustomer;
    if (body.riskScore !== undefined) updateData.riskScore = body.riskScore;

    // Always update lastStatusChangeAt if any status changed
    if (body.orderStatus || body.paymentStatus || body.deliveryStatus) {
      updateData.lastStatusChangeAt = new Date();
    }

    const order = await prisma.order.update({
      where: { id },
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

    // Transform order to include all admin-facing fields
    const transformedOrder = {
      ...order,
      orderStatus: (order as any).orderStatus || 'draft',
      paymentStatus: (order as any).paymentStatus || 'unpaid',
      deliveryStatus: (order as any).deliveryStatus || 'pending',
      channel: (order as any).channel || 'web',
      tags: (order as any).tags ? JSON.parse((order as any).tags) : [],
      riskScore: (order as any).riskScore || 0,
      notesInternal: (order as any).notesInternal,
      notesCustomer: (order as any).notesCustomer,
      lastStatusChangeAt: (order as any).lastStatusChangeAt,
    };

    return NextResponse.json(transformedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      {
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
