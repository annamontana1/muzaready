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
