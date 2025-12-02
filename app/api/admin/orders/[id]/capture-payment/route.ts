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

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: {
          paymentStatus,
          lastStatusChangeAt: new Date(),
          // Track payment amount if needed (you may want to add this field to schema)
        },
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

    // No amount provided - simply mark as paid
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: 'paid',
        lastStatusChangeAt: new Date(),
      },
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
