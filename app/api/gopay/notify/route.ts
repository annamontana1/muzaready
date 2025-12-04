import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';


/**
 * GoPay Payment Confirmation Webhook Endpoint
 *
 * This endpoint is called by GoPay after successful payment.
 * It performs stock deduction and marks the order as paid.
 *
 * Request body from GoPay includes:
 * - orderId: The GoPay payment ID (our Order.id)
 * - state: 'PAID' | 'FAILED' | etc
 * - amount: Total amount paid
 * - paymentId: GoPay's internal payment ID
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, state, paymentId } = body;

    if (!orderId || !state) {
      return NextResponse.json(
        { error: 'Missing orderId or state' },
        { status: 400 }
      );
    }

    // Only process PAID notifications
    if (state !== 'PAID') {
      console.log(`GoPay notification: order ${orderId} state=${state} (ignoring)`);
      return NextResponse.json(
        { success: true, message: 'Notification received but not PAID' },
        { status: 200 }
      );
    }

    // Fetch the order with all items and SKU details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            sku: true,
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

    // Prevent double-processing: if order is already paid, return success
    if (order.paymentStatus === 'paid') {
      console.log(`Order ${orderId} already paid (idempotent)`);
      return NextResponse.json(
        { success: true, message: 'Order already paid (idempotent)' },
        { status: 200 }
      );
    }

    // Use a transaction to atomically update order status and deduct stock
    const result = await prisma.$transaction(async (tx) => {
      // Update order and payment status to 'paid'
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: 'paid',
          paymentStatus: 'paid',
          updatedAt: new Date(),
        },
        include: {
          items: {
            include: {
              sku: true,
            },
          },
        },
      });

      // For each order item, deduct stock based on sale mode
      for (const item of updatedOrder.items) {
        if (item.sku.saleMode === 'PIECE_BY_WEIGHT') {
          // Mark as sold out (pieces are fully consumed)
          await tx.sku.update({
            where: { id: item.skuId },
            data: {
              soldOut: true,
              inStock: false,
            },
          });

          // Record stock movement
          await tx.stockMovement.create({
            data: {
              skuId: item.skuId,
              type: 'OUT',
              grams: item.grams,
              note: `Prodáno (objednávka ${orderId.substring(0, 8)})`,
              refOrderId: orderId,
            },
          });
        } else if (item.sku.saleMode === 'BULK_G') {
          // Deduct grams from available stock
          const newAvailableGrams = (item.sku.availableGrams || 0) - item.grams;

          // Update SKU availability
          const updatedSku = await tx.sku.update({
            where: { id: item.skuId },
            data: {
              availableGrams: Math.max(0, newAvailableGrams),
              inStock: newAvailableGrams > 0, // Still in stock if grams remain
            },
          });

          // Record stock movement
          await tx.stockMovement.create({
            data: {
              skuId: item.skuId,
              type: 'OUT',
              grams: item.grams,
              note: `Prodáno ${item.grams}g (objednávka ${orderId.substring(0, 8)})`,
              refOrderId: orderId,
            },
          });
        }
      }

      return updatedOrder;
    });

    console.log(`✅ Order ${orderId} paid and stock deducted`);

    return NextResponse.json(
      {
        success: true,
        message: 'Payment confirmed and stock deducted',
        orderId,
        orderStatus: result.orderStatus,
        paymentStatus: result.paymentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GoPay notification error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment confirmation' },
      { status: 500 }
    );
  }
}