import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { sendShippingNotificationEmail } from '@/lib/email';
import { UpdateOrderStatusSchema } from '@/lib/validation/orders';
export const runtime = 'nodejs';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID je vyžadován' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Objednávka nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání objednávky' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID je vyžadován' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = UpdateOrderStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { orderStatus, paymentStatus, deliveryStatus } = validation.data;

    // Get current order to check status change
    const currentOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Objednávka nebyla nalezena' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (orderStatus !== undefined) updateData.orderStatus = orderStatus;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;
    if (deliveryStatus !== undefined) updateData.deliveryStatus = deliveryStatus;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
      },
    });

    // Send shipping notification if delivery status changed to "shipped"
    if (currentOrder.deliveryStatus !== 'shipped' && deliveryStatus === 'shipped') {
      try {
        await sendShippingNotificationEmail(
          currentOrder.email,
          id,
          (updatedOrder as any).trackingNumber || undefined,
          (updatedOrder as any).carrier || undefined
        );
        console.log('Shipping notification email sent successfully');
      } catch (emailError) {
        console.error('Error sending shipping notification email:', emailError);
        // Don't fail the order update if email fails
      }
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci objednávky' },
      { status: 500 }
    );
  }
}