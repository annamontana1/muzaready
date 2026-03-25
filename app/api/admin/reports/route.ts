import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reports
 * Sales reports with filtering by date range, channel, and payment method.
 *
 * Query Parameters:
 * - from: ISO date string (start of range)
 * - to: ISO date string (end of range)
 * - channel: "web" | "pos" | "ig_dm" (optional)
 * - paymentMethod: "cash" | "card" | "bank_transfer" | "gopay" (optional)
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;

    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const channel = searchParams.get('channel');
    const paymentMethod = searchParams.get('paymentMethod');

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      orderStatus: { notIn: ['draft', 'cancelled'] },
    };

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        where.createdAt.lte = toDate;
      }
    }

    if (channel) {
      where.channel = channel;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }

    // Fetch orders with items
    const orders = await (prisma as any).order.findMany({
      where,
      include: {
        items: {
          select: {
            grams: true,
            lineTotal: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Calculate summary stats
    let totalRevenue = 0;
    let totalGrams = 0;
    const orderCount = orders.length;

    for (const order of orders) {
      totalRevenue += order.total || 0;
      for (const item of order.items) {
        totalGrams += item.grams || 0;
      }
    }

    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Monthly breakdown
    const monthlyMap = new Map<string, {
      month: string;
      orderCount: number;
      revenue: number;
      grams: number;
    }>();

    for (const order of orders) {
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, {
          month: key,
          orderCount: 0,
          revenue: 0,
          grams: 0,
        });
      }

      const entry = monthlyMap.get(key)!;
      entry.orderCount += 1;
      entry.revenue += order.total || 0;
      for (const item of order.items) {
        entry.grams += item.grams || 0;
      }
    }

    const monthlyBreakdown = Array.from(monthlyMap.values()).sort(
      (a, b) => a.month.localeCompare(b.month)
    );

    // Channel breakdown
    const channelMap = new Map<string, {
      channel: string;
      orderCount: number;
      revenue: number;
      grams: number;
    }>();

    for (const order of orders) {
      const ch = order.channel || 'web';
      if (!channelMap.has(ch)) {
        channelMap.set(ch, {
          channel: ch,
          orderCount: 0,
          revenue: 0,
          grams: 0,
        });
      }

      const entry = channelMap.get(ch)!;
      entry.orderCount += 1;
      entry.revenue += order.total || 0;
      for (const item of order.items) {
        entry.grams += item.grams || 0;
      }
    }

    const channelBreakdown = Array.from(channelMap.values());

    return NextResponse.json({
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        orderCount,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        totalGrams,
      },
      monthlyBreakdown,
      channelBreakdown,
    });
  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json(
      { error: 'Chyba při generování reportu' },
      { status: 500 }
    );
  }
}
