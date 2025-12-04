import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';


export async function GET(request: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            sku: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items: cartLines, shippingInfo } = body;

    if (!email || !cartLines || cartLines.length === 0) {
      return NextResponse.json(
        { error: 'Email a položky objednávky jsou povinné' },
        { status: 400 }
      );
    }

    // Import the quote function at runtime to avoid circular dependencies
    const { quoteCartLines } = await import('@/lib/stock');

    // Validate and quote the cart lines - recalculate all prices to ensure freshness
    let quotedLines;
    try {
      // Note: This recalculates ALL prices from the database/matrix
      // This prevents price discrepancies from stale cart items
      const quote = await quoteCartLines(cartLines);
      quotedLines = quote.items;
    } catch (quoteError: any) {
      return NextResponse.json(
        { error: quoteError.message || 'Chyba při kalkulaci ceny' },
        { status: 400 }
      );
    }

    // Create order with OrderItem records (NO stock deduction yet - waiting for payment confirmation)
    const totalAmount = quotedLines.reduce((sum, item) => sum + item.lineGrandTotal, 0);
    const order = await prisma.order.create({
      data: {
        email,
        firstName: shippingInfo?.firstName || 'Customer',
        lastName: shippingInfo?.lastName || '',
        streetAddress: shippingInfo?.streetAddress || 'Unknown',
        city: shippingInfo?.city || 'Unknown',
        zipCode: shippingInfo?.zipCode || '00000',
        country: shippingInfo?.country || 'CZ',
        orderStatus: 'pending', // Waiting for GoPay payment confirmation
        paymentStatus: 'unpaid',
        deliveryStatus: 'pending',
        subtotal: totalAmount,
        total: totalAmount,
        items: {
          create: quotedLines.map((item) => ({
            sku: {
              connect: {
                id: item.sku.id,
              },
            },
            saleMode: item.sku.saleMode,
            grams: item.grams,
            pricePerGram: item.pricePerGram ?? 0,
            lineTotal: item.lineTotal,
            nameSnapshot: item.snapshotName,
            ending: item.ending as any,
            assemblyFeeType: item.assemblyFeeType,
            assemblyFeeCzk: item.assemblyFeeCzk,
            assemblyFeeTotal: item.assemblyFeeTotal,
          })),
        },
      },
      include: {
        items: {
          include: {
            sku: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        orderId: order.id,
        email: order.email,
        total: order.total,
        orderStatus: order.orderStatus,
        message: 'Objednávka vytvořena. Čeká na platbu přes GoPay.',
        items: order.items,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Chyba při vytvoření objednávky' },
      { status: 500 }
    );
  }
}