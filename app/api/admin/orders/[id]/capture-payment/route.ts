import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

interface Params {
  id: string;
}

/**
 * POST /api/admin/orders/[id]/capture-payment
 * Mark order as paid - simulates payment capture
 *
 * Request Body:
 * {
 *   "amount": 5000  // (optional) amount paid, validates against order total
 * }
 *
 * Response: Updated order with paymentStatus = "paid"
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();
    const { amount } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch current order
    const currentOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            sku: {
              select: {
                id: true,
                sku: true,
                name: true,
                shadeName: true,
                lengthCm: true,
              },
            },
          },
        },
      },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate amount if provided
    if (amount !== undefined) {
      if (typeof amount !== 'number' || amount <= 0) {
        return NextResponse.json(
          { error: 'Amount must be a positive number' },
          { status: 400 }
        );
      }

      // Check if amount matches order total (or is less for partial payment)
      if (amount > currentOrder.total) {
        return NextResponse.json(
          {
            error: `Amount (${amount}) cannot exceed order total (${currentOrder.total})`,
          },
          { status: 400 }
        );
      }

      // If partial payment, mark as 'partial', otherwise 'paid'
      const paymentStatus = amount < currentOrder.total ? 'partial' : 'paid';

      // Use transaction to ensure atomicity (payment + stock deduction)
      const updatedOrder = await prisma.$transaction(async (tx) => {
        // Update order payment status
        const order = await tx.order.update({
          where: { id },
          data: {
            paymentStatus,
            orderStatus: paymentStatus === 'paid' && currentOrder.orderStatus === 'pending'
              ? 'processing'
              : currentOrder.orderStatus,
            lastStatusChangeAt: new Date(),
          },
          include: {
            items: {
              include: {
                sku: true,
              },
            },
          },
        });

        // Deduct stock ONLY if fully paid (not partial payment)
        if (paymentStatus === 'paid') {
          for (const item of order.items) {
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
                  note: `Prodáno - admin manual capture (objednávka ${id.substring(0, 8)})`,
                  refOrderId: id,
                },
              });
            } else if (item.sku.saleMode === 'BULK_G') {
              // Deduct grams from available stock
              const newAvailableGrams = (item.sku.availableGrams || 0) - item.grams;

              await tx.sku.update({
                where: { id: item.skuId },
                data: {
                  availableGrams: Math.max(0, newAvailableGrams),
                  inStock: newAvailableGrams > 0,
                },
              });

              // Record stock movement
              await tx.stockMovement.create({
                data: {
                  skuId: item.skuId,
                  type: 'OUT',
                  grams: item.grams,
                  note: `Prodáno ${item.grams}g - admin manual capture (objednávka ${id.substring(0, 8)})`,
                  refOrderId: id,
                },
              });
            }
          }
        }

        return order;
      });

      const transformedOrder = {
        ...updatedOrder,
        orderStatus: (updatedOrder as any).orderStatus || 'draft',
        paymentStatus: (updatedOrder as any).paymentStatus || 'unpaid',
        deliveryStatus: (updatedOrder as any).deliveryStatus || 'pending',
        channel: (updatedOrder as any).channel || 'web',
        tags: (updatedOrder as any).tags
          ? JSON.parse((updatedOrder as any).tags)
          : [],
        riskScore: (updatedOrder as any).riskScore || 0,
        notesInternal: (updatedOrder as any).notesInternal,
        notesCustomer: (updatedOrder as any).notesCustomer,
        lastStatusChangeAt: (updatedOrder as any).lastStatusChangeAt,
      };

      return NextResponse.json(
        {
          success: true,
          message: `Payment of ${amount} captured. Status: ${paymentStatus}`,
          order: transformedOrder,
        },
        { status: 200 }
      );
    }

    // No amount provided - mark as paid and deduct stock
    // Use transaction to ensure atomicity (payment + stock deduction)
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Prevent double-processing: if order is already paid, return it
      if (currentOrder.paymentStatus === 'paid') {
        console.log(`Order ${id} already paid (idempotent)`);
        return currentOrder;
      }

      // Update order payment status
      const order = await tx.order.update({
        where: { id },
        data: {
          paymentStatus: 'paid',
          orderStatus: currentOrder.orderStatus === 'pending'
            ? 'processing'
            : currentOrder.orderStatus,
          lastStatusChangeAt: new Date(),
        },
        include: {
          items: {
            include: {
              sku: true,
            },
          },
        },
      });

      // Deduct stock for each order item
      for (const item of order.items) {
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
              note: `Prodáno - admin manual capture (objednávka ${id.substring(0, 8)})`,
              refOrderId: id,
            },
          });
        } else if (item.sku.saleMode === 'BULK_G') {
          // Deduct grams from available stock
          const newAvailableGrams = (item.sku.availableGrams || 0) - item.grams;

          await tx.sku.update({
            where: { id: item.skuId },
            data: {
              availableGrams: Math.max(0, newAvailableGrams),
              inStock: newAvailableGrams > 0,
            },
          });

          // Record stock movement
          await tx.stockMovement.create({
            data: {
              skuId: item.skuId,
              type: 'OUT',
              grams: item.grams,
              note: `Prodáno ${item.grams}g - admin manual capture (objednávka ${id.substring(0, 8)})`,
              refOrderId: id,
            },
          });
        }
      }

      return order;
    });

    const transformedOrder = {
      ...updatedOrder,
      orderStatus: (updatedOrder as any).orderStatus || 'draft',
      paymentStatus: (updatedOrder as any).paymentStatus || 'unpaid',
      deliveryStatus: (updatedOrder as any).deliveryStatus || 'pending',
      channel: (updatedOrder as any).channel || 'web',
      tags: (updatedOrder as any).tags
        ? JSON.parse((updatedOrder as any).tags)
        : [],
      riskScore: (updatedOrder as any).riskScore || 0,
      notesInternal: (updatedOrder as any).notesInternal,
      notesCustomer: (updatedOrder as any).notesCustomer,
      lastStatusChangeAt: (updatedOrder as any).lastStatusChangeAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: `Payment captured for full order amount (${currentOrder.total})`,
        order: transformedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error capturing payment:', error);
    return NextResponse.json(
      {
        error: 'Failed to capture payment',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
