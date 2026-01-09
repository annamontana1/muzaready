import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/orders/[id]/history
 * Fetch order history (audit log) for a specific order
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

    // Try to fetch history, but handle case where table doesn't exist yet
    try {
      const history = await prisma.orderHistory.findMany({
        where: { orderId: id },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      // If OrderHistory table doesn't exist yet, return empty array
      if (error.code === 'P2021' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          success: true,
          data: [],
          message: 'OrderHistory table does not exist yet. Run migration to enable history tracking.',
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Error fetching order history:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch order history',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

