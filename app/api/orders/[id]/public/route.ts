import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Public order confirmation endpoint — orderId (UUID v4) acts as the access token.
// Returns only what the confirmation page needs; no sensitive address/contact data.
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return NextResponse.json({ error: 'Neplatné ID objednávky' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        orderStatus: true,
        paymentStatus: true,
        deliveryStatus: true,
        subtotal: true,
        shippingCost: true,
        discountAmount: true,
        total: true,
        createdAt: true,
        items: {
          select: {
            id: true,
            skuId: true,
            nameSnapshot: true,
            grams: true,
            pricePerGram: true,
            lineTotal: true,
            saleMode: true,
            ending: true,
            assemblyFeeTotal: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Objednávka nebyla nalezena' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order confirmation:', error);
    return NextResponse.json({ error: 'Chyba při načítání objednávky' }, { status: 500 });
  }
}
