import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendShippingNotificationEmail } from '@/lib/email';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
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
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID je vyžadován' },
        { status: 400 }
      );
    }

    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status je vyžadován' },
        { status: 400 }
      );
    }

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

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status,
      },
      include: {
        items: true,
      },
    });

    // Send shipping notification if status changed to "shipped"
    if (currentOrder.status !== 'shipped' && status === 'shipped') {
      try {
        await sendShippingNotificationEmail(currentOrder.email, id);
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
