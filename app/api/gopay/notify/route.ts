import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { GoPayNotificationSchema } from '@/lib/validation/orders';
import crypto from 'crypto';
export const runtime = 'nodejs';

/**
 * Verify GoPay webhook signature to prevent fake payment notifications
 * GoPay sends X-Signature header with HMAC-SHA256 signature
 */
function verifyGoPaySignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;

  const secret = process.env.GOPAY_CLIENT_SECRET;
  if (!secret) {
    console.error('GOPAY_CLIENT_SECRET not configured');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

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
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('X-Signature');

    // Verify request is actually from GoPay
    if (!verifyGoPaySignature(rawBody, signature)) {
      console.error('GoPay webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);

    // Validate webhook payload
    const validation = GoPayNotificationSchema.safeParse(body);
    if (!validation.success) {
      console.error('Invalid GoPay webhook payload:', validation.error);
      return NextResponse.json(
        {
          error: 'Invalid webhook payload',
          details: validation.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { orderId, state, paymentId } = validation.data;

    // Only process PAID notifications
    if (state !== 'PAID') {
      console.log(`GoPay notification: order ${orderId} state=${state} (ignoring)`);
      return NextResponse.json(
        { success: true, message: 'Notification received but not PAID' },
        { status: 200 }
      );
    }

    // Use a transaction to atomically update order status and deduct stock
    // IMPORTANT: Idempotency check is INSIDE transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Fetch order with lock to prevent concurrent processing
      const order = await tx.order.findUnique({
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
        throw new Error('Order not found');
      }

      // Prevent double-processing: if order is already paid, return success
      if (order.paymentStatus === 'paid') {
        console.log(`Order ${orderId} already paid (idempotent)`);
        return order;
      }

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