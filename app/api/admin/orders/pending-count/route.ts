import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/orders/pending-count
 * Returns count of orders that need attention (pending status or unpaid)
 */
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Count orders that need attention:
    // 1. orderStatus = 'pending' (new orders)
    // 2. orderStatus = 'processing' but deliveryStatus = 'pending' (paid but not shipped)
    const count = await prisma.order.count({
      where: {
        OR: [
          // New orders waiting for payment
          {
            orderStatus: 'pending',
          },
          // Paid orders waiting to be shipped
          {
            orderStatus: 'processing',
            paymentStatus: 'paid',
            deliveryStatus: 'pending',
          },
        ],
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching pending orders count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending orders count' },
      { status: 500 }
    );
  }
}
