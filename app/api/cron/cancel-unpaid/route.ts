import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendOrderCancellationEmail } from '@/lib/email';

const prisma = new PrismaClient();

// Force dynamic rendering to avoid caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Cancel orders that are older than 7 days and still unpaid
const CANCEL_AFTER_DAYS = 7;

/**
 * Cron endpoint: Auto-cancel unpaid orders after 7 days
 *
 * Schedule: Daily at 2:00 AM (0 2 * * *)
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

    // Calculate cutoff date (7 days ago)
    const cutoffDate = new Date(Date.now() - CANCEL_AFTER_DAYS * 24 * 60 * 60 * 1000);

    // Find unpaid orders older than 7 days
    const unpaidOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'unpaid',
        orderStatus: {
          notIn: ['cancelled', 'completed'], // Don't cancel already cancelled/completed orders
        },
        createdAt: {
          lt: cutoffDate,
        },
      },
      include: {
        items: {
          include: {
            sku: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (unpaidOrders.length === 0) {
      return NextResponse.json({
        message: 'No unpaid orders found requiring cancellation',
        cutoffDate: cutoffDate.toISOString(),
        checkedAt: new Date().toISOString(),
      });
    }

    // Cancel orders and return stock
    const results = [];
    const errors = [];

    for (const order of unpaidOrders) {
      try {
        // Use transaction to ensure atomicity
        await prisma.$transaction(async (tx) => {
          // 1. Update order status to cancelled
          await tx.order.update({
            where: { id: order.id },
            data: {
              orderStatus: 'cancelled',
              lastStatusChangeAt: new Date(),
            },
          });

          // 2. Return stock for each item
          for (const item of order.items) {
            if (item.sku.saleMode === 'PIECE_BY_WEIGHT') {
              // Return piece to stock
              await tx.sku.update({
                where: { id: item.skuId },
                data: {
                  soldOut: false,
                  inStock: true,
                  inStockSince: new Date(),
                },
              });

              // Record stock movement
              await tx.stockMovement.create({
                data: {
                  skuId: item.skuId,
                  type: 'IN',
                  grams: item.grams,
                  note: `Auto-zrušení nezaplacené objednávky (${order.id.substring(0, 8)}) - vráceno na sklad`,
                  refOrderId: order.id,
                },
              });
            } else if (item.sku.saleMode === 'BULK_G') {
              // Return grams to available stock
              const newAvailableGrams = (item.sku.availableGrams || 0) + item.grams;

              // Update SKU availability
              await tx.sku.update({
                where: { id: item.skuId },
                data: {
                  availableGrams: newAvailableGrams,
                  inStock: true,
                  inStockSince: newAvailableGrams > 0 ? new Date() : item.sku.inStockSince,
                },
              });

              // Record stock movement
              await tx.stockMovement.create({
                data: {
                  skuId: item.skuId,
                  type: 'IN',
                  grams: item.grams,
                  note: `Auto-zrušení nezaplacené objednávky ${item.grams}g (${order.id.substring(0, 8)}) - vráceno na sklad`,
                  refOrderId: order.id,
                },
              });
            }
          }

          // 3. Log to OrderHistory
          await tx.orderHistory.create({
            data: {
              orderId: order.id,
              action: 'auto_cancelled',
              details: JSON.stringify({
                reason: 'Unpaid order older than 7 days',
                cancelledAt: new Date().toISOString(),
                daysSinceOrder: Math.floor(
                  (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                ),
              }),
              performedBy: 'system',
            },
          });
        });

        // 4. Send cancellation email (outside transaction to avoid blocking)
        try {
          await sendOrderCancellationEmail(
            order.email,
            order.id,
            'Objednávka nebyla zaplacena do 7 dnů a byla automaticky zrušena.'
          );
        } catch (emailError) {
          console.error(`Failed to send cancellation email for order ${order.id}:`, emailError);
          // Don't fail the cancellation if email fails
        }

        results.push({
          orderId: order.id,
          email: order.email,
          daysSinceOrder: Math.floor(
            (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)
          ),
          itemsReturned: order.items.length,
          success: true,
        });

      } catch (error: any) {
        console.error(`Error cancelling order ${order.id}:`, error);
        errors.push({
          orderId: order.id,
          email: order.email,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cancelled ${results.length} unpaid order(s)`,
      totalOrders: unpaidOrders.length,
      successful: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
      cutoffDate: cutoffDate.toISOString(),
      processedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error in cancel-unpaid cron:', error);
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
