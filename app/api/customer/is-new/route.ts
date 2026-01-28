import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/customer/is-new?email=...
 * Check if customer is new (no previous paid orders)
 *
 * Used for Meta Pixel tracking with is_new_customer flag
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Check if customer has any previous PAID orders
    const previousOrders = await prisma.order.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        paymentStatus: 'paid',
      },
      select: { id: true },
    });

    const isNewCustomer = !previousOrders;

    return NextResponse.json({
      isNewCustomer,
      email,
    });
  } catch (error: any) {
    console.error('Check new customer error:', error);
    return NextResponse.json(
      { error: 'Failed to check customer status' },
      { status: 500 }
    );
  }
}
