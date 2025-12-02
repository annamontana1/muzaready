import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

/**
 * POST /api/admin/orders/bulk
 * Bulk update multiple orders
 *
 * Request Body:
 * {
 *   "ids": ["order1", "order2", "order3"],
 *   "action": "mark-shipped" | "mark-paid" | "update-status",
 *   "data": {
 *     "orderStatus": "paid",
 *     "paymentStatus": "paid",
 *     "deliveryStatus": "shipped",
 *     "tags": ["expedovano"],
 *     "notesInternal": "Updated via bulk action"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { ids, action, data } = body;

    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid ids array' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Missing action' },
        { status: 400 }
      );
    }

    // Validate allowed actions
    const allowedActions = ['mark-shipped', 'mark-paid', 'update-status'];
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${allowedActions.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate data object
    if (!data || typeof data !== 'object') {
      return NextResponse.json(
        { error: 'Missing or invalid data object' },
        { status: 400 }
      );
    }

    // Build update data based on action
    const updateData: any = {};

    // Validate statuses if provided
    const validOrderStatuses = [
      'draft',
      'pending',
      'paid',
      'processing',
      'shipped',
      'completed',
      'cancelled',
    ];
    const validPaymentStatuses = ['unpaid', 'partial', 'paid', 'refunded'];
    const validDeliveryStatuses = ['pending', 'shipped', 'delivered', 'returned'];

    if (data.orderStatus) {
      if (!validOrderStatuses.includes(data.orderStatus)) {
        return NextResponse.json(
          {
            error: `Invalid orderStatus. Must be one of: ${validOrderStatuses.join(', ')}`,
          },
          { status: 400 }
        );
      }
      updateData.orderStatus = data.orderStatus;
    }

    if (data.paymentStatus) {
      if (!validPaymentStatuses.includes(data.paymentStatus)) {
        return NextResponse.json(
          {
            error: `Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(
              ', '
            )}`,
          },
          { status: 400 }
        );
      }
      updateData.paymentStatus = data.paymentStatus;
    }

    if (data.deliveryStatus) {
      if (!validDeliveryStatuses.includes(data.deliveryStatus)) {
        return NextResponse.json(
          {
            error: `Invalid deliveryStatus. Must be one of: ${validDeliveryStatuses.join(
              ', '
            )}`,
          },
          { status: 400 }
        );
      }
      updateData.deliveryStatus = data.deliveryStatus;
    }

    // Handle other fields
    if (data.tags !== undefined) {
      updateData.tags = JSON.stringify(data.tags);
    }
    if (data.notesInternal !== undefined) {
      updateData.notesInternal = data.notesInternal;
    }
    if (data.notesCustomer !== undefined) {
      updateData.notesCustomer = data.notesCustomer;
    }
    if (data.riskScore !== undefined) {
      updateData.riskScore = data.riskScore;
    }
    if (data.channel !== undefined) {
      updateData.channel = data.channel;
    }

    // Always update lastStatusChangeAt if any status changed
    if (data.orderStatus || data.paymentStatus || data.deliveryStatus) {
      updateData.lastStatusChangeAt = new Date();
    }

    // Handle special actions
    if (action === 'mark-shipped') {
      updateData.deliveryStatus = 'shipped';
      updateData.lastStatusChangeAt = new Date();
    } else if (action === 'mark-paid') {
      updateData.paymentStatus = 'paid';
      updateData.lastStatusChangeAt = new Date();
    }

    // Perform bulk update
    const result = await prisma.order.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    });

    // Fetch updated orders for response
    const updatedOrders = await prisma.order.findMany({
      where: { id: { in: ids } },
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

    return NextResponse.json(
      {
        success: true,
        updated: result.count,
        totalRequested: ids.length,
        orders: updatedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in bulk order update:', error);
    return NextResponse.json(
      {
        error: 'Failed to perform bulk action',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
