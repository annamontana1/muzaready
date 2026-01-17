import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/orders/bulk-delete
 * Delete test orders and their items
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { ids, deleteTestOrders } = await request.json();

    let ordersToDelete;

    if (deleteTestOrders) {
      // Find test orders (orders with "Test" in customer name or email containing "test")
      ordersToDelete = await prisma.order.findMany({
        where: {
          OR: [
            { firstName: { contains: 'Test', mode: 'insensitive' } },
            { lastName: { contains: 'Test', mode: 'insensitive' } },
            { email: { contains: 'test', mode: 'insensitive' } },
            { firstName: { contains: 'test', mode: 'insensitive' } },
            { lastName: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
    } else if (ids && Array.isArray(ids)) {
      ordersToDelete = await prisma.order.findMany({
        where: { id: { in: ids } },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
    } else {
      return NextResponse.json(
        { error: 'Either ids array or deleteTestOrders flag is required' },
        { status: 400 }
      );
    }

    if (ordersToDelete.length === 0) {
      return NextResponse.json({
        deleted: 0,
        message: 'No orders found to delete',
      });
    }

    const orderIds = ordersToDelete.map((o) => o.id);

    // Delete order items first
    await prisma.orderItem.deleteMany({
      where: { orderId: { in: orderIds } },
    });

    // Delete the orders
    const result = await prisma.order.deleteMany({
      where: { id: { in: orderIds } },
    });

    return NextResponse.json({
      deleted: result.count,
      deletedOrders: ordersToDelete.map((o) => `${o.firstName} ${o.lastName} (${o.email})`),
      message: `Successfully deleted ${result.count} orders`,
    });
  } catch (error) {
    console.error('Error deleting orders:', error);
    return NextResponse.json(
      { error: 'Failed to delete orders' },
      { status: 500 }
    );
  }
}
