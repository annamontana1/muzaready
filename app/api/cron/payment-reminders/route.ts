import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendPaymentReminderEmail } from '@/lib/email';

const prisma = new PrismaClient();

// Force dynamic rendering to avoid caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Send reminder for orders that are 3 days old (but not older than 4 days to avoid duplicates)
const REMINDER_DAYS_MIN = 3;
const REMINDER_DAYS_MAX = 4;

/**
 * Cron endpoint: Send payment reminder emails for unpaid orders
 *
 * Schedule: Daily at 10:00 AM (0 10 * * *)
 *
 * Security: Vercel Cron runs with Authorization header
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Verify Vercel Cron authorization header
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate date range (3-4 days ago)
    const now = new Date();
    const minDate = new Date(now.getTime() - REMINDER_DAYS_MAX * 24 * 60 * 60 * 1000);
    const maxDate = new Date(now.getTime() - REMINDER_DAYS_MIN * 24 * 60 * 60 * 1000);

    // Find unpaid orders in the date range
    const unpaidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'unpaid',
        createdAt: {
          gte: minDate,
          lte: maxDate,
        },
        // Only send to non-cancelled orders
        orderStatus: {
          notIn: ['cancelled'],
        },
      },
      select: {
        id: true,
        email: true,
        total: true,
        createdAt: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (unpaidOrders.length === 0) {
      return NextResponse.json({
        message: 'No orders found requiring payment reminders',
        dateRange: {
          from: minDate.toISOString(),
          to: maxDate.toISOString(),
        },
        checkedAt: new Date().toISOString(),
      });
    }

    // Send reminder emails
    const results = [];
    const errors = [];

    for (const order of unpaidOrders) {
      try {
        // Calculate days since order
        const daysSinceOrder = Math.floor(
          (now.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Send reminder email
        await sendPaymentReminderEmail(
          order.email,
          order.id,
          order.total,
          daysSinceOrder
        );

        results.push({
          orderId: order.id,
          email: order.email,
          daysSinceOrder,
          success: true,
        });

        // Optional: Log to OrderHistory
        await prisma.orderHistory.create({
          data: {
            orderId: order.id,
            action: 'payment_reminder_sent',
            details: JSON.stringify({
              daysSinceOrder,
              sentAt: new Date().toISOString(),
            }),
            performedBy: 'system',
          },
        });

      } catch (error: any) {
        console.error(`Error sending reminder for order ${order.id}:`, error);
        errors.push({
          orderId: order.id,
          email: order.email,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${results.length} payment reminder(s)`,
      totalOrders: unpaidOrders.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
      dateRange: {
        from: minDate.toISOString(),
        to: maxDate.toISOString(),
      },
      sentAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error in payment-reminders cron:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
