import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/orders/lookup
 * Allows customers to look up their orders by email and order ID
 * Requires both email and orderId for privacy
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, orderId } = body;

    // Validate input
    if (!email || !orderId) {
      return NextResponse.json(
        { error: 'Email a ID objednávky jsou vyžadovány' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatná e-mailová adresa' },
        { status: 400 }
      );
    }

    // Look up order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            sku: {
              select: {
                name: true,
                shade: true,
                lengthCm: true,
                structure: true,
              },
            },
          },
        },
      },
    });

    // Check if order exists and email matches
    if (!order) {
      return NextResponse.json(
        { error: 'Objednávka nebyla nalezena' },
        { status: 404 }
      );
    }

    if (order.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'E-mailová adresa se neshoduje s objednávkou' },
        { status: 403 }
      );
    }

    // Return order details with formatted data
    const formattedOrder = {
      id: order.id,
      email: order.email,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.id,
        skuId: item.skuId,
        skuName: item.nameSnapshot || item.sku?.name,
        shade: item.sku?.shade,
        lengthCm: item.sku?.lengthCm,
        structure: item.sku?.structure,
        saleMode: item.saleMode,
        grams: item.grams,
        pricePerGram: item.pricePerGram,
        lineTotal: item.lineTotal,
        ending: item.ending,
        assemblyFeeType: item.assemblyFeeType,
        assemblyFeeCzk: item.assemblyFeeCzk,
        assemblyFeeTotal: item.assemblyFeeTotal,
        lineGrandTotal: item.lineTotal + (item.assemblyFeeTotal || 0),
      })),
    };

    return NextResponse.json(formattedOrder, { status: 200 });
  } catch (error) {
    console.error('Error looking up order:', error);
    return NextResponse.json(
      { error: 'Chyba při vyhledávání objednávky' },
      { status: 500 }
    );
  }
}
