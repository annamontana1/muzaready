import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendLowStockAlert } from '@/lib/email';

const prisma = new PrismaClient();

// Force dynamic rendering to avoid caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Low stock threshold in grams
const LOW_STOCK_THRESHOLD = 100;

// Admin email to receive alerts (from environment or default)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'muzahaircz@gmail.com';

// Rate limiting: Store last alert time in memory (simple approach)
let lastAlertTime: number = 0;
const RATE_LIMIT_HOURS = 1; // Only send 1 email per hour

/**
 * Cron endpoint: Check for low stock SKUs and send alert email
 *
 * Schedule: Every 4 hours (0 *\/4 * * *)
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

    // Check rate limiting
    const now = Date.now();
    const hoursSinceLastAlert = (now - lastAlertTime) / (1000 * 60 * 60);

    if (lastAlertTime > 0 && hoursSinceLastAlert < RATE_LIMIT_HOURS) {
      return NextResponse.json({
        message: 'Rate limit: Alert already sent recently',
        lastAlertTime: new Date(lastAlertTime).toISOString(),
        nextAllowedTime: new Date(lastAlertTime + RATE_LIMIT_HOURS * 60 * 60 * 1000).toISOString(),
      }, { status: 429 });
    }

    // Query low stock SKUs
    const lowStockSkus = await prisma.sku.findMany({
      where: {
        OR: [
          { availableGrams: { lt: LOW_STOCK_THRESHOLD } },
          { soldOut: true },
        ],
      },
      select: {
        sku: true,
        name: true,
        shade: true,
        shadeName: true,
        lengthCm: true,
        availableGrams: true,
        soldOut: true,
      },
      orderBy: {
        availableGrams: 'asc', // Show lowest stock first
      },
    });

    // If no low stock items, return early
    if (lowStockSkus.length === 0) {
      return NextResponse.json({
        message: 'No low stock items found',
        threshold: LOW_STOCK_THRESHOLD,
        checkedAt: new Date().toISOString(),
      });
    }

    // Format items for email
    const formattedItems = lowStockSkus.map((item) => ({
      sku: item.sku,
      name: item.name,
      shade: item.shadeName || item.shade,
      lengthCm: item.lengthCm,
      availableGrams: item.availableGrams || 0,
    }));

    // Send email alert
    await sendLowStockAlert(ADMIN_EMAIL, formattedItems);

    // Update last alert time
    lastAlertTime = now;

    return NextResponse.json({
      success: true,
      message: `Low stock alert sent to ${ADMIN_EMAIL}`,
      itemCount: lowStockSkus.length,
      items: formattedItems,
      sentAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error in check-low-stock cron:', error);
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
