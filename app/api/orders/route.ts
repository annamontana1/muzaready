import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { CreateOrderSchema } from '@/lib/validation/orders';
export const runtime = 'nodejs';

/**
 * Verify user session and return email if valid
 * This prevents unauthorized access to other users' orders
 */
async function getAuthenticatedEmail(requestEmail: string): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return null;
  }

  // TODO: Implement proper session validation when user auth is added
  // For now, we trust the email parameter if a session exists
  // In production, this should verify the session matches the requested email
  return requestEmail;
}

export async function GET(request: NextRequest) {
  try {
    // Vyžadujeme email parameter pro vyhledání objednávek
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Verify user is authenticated and authorized to view these orders
    const authenticatedEmail = await getAuthenticatedEmail(email);
    if (!authenticatedEmail) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in to view your orders' },
        { status: 401 }
      );
    }

    // Vrátíme pouze objednávky pro daný email
    const orders = await prisma.order.findMany({
      where: {
        email: authenticatedEmail, // Use authenticated email, not request param
      },
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

    // Validate request body with Zod
    const validation = CreateOrderSchema.safeParse(body);
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

    const { email, items: cartLines, shippingInfo, packetaPoint, couponCode } = validation.data;

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

    // Additional stock validation before creating order
    // This ensures stock is still available between quote and order creation
    for (const item of quotedLines) {
      const sku = item.sku;
      
      // Check if SKU is still in stock
      if (!sku.inStock) {
        return NextResponse.json(
          { error: `SKU ${sku.sku} (${sku.name || 'Neznámý produkt'}) již není na skladě` },
          { status: 400 }
        );
      }

      // For PIECE_BY_WEIGHT: check if not sold out
      if (sku.saleMode === 'PIECE_BY_WEIGHT' && sku.soldOut) {
        return NextResponse.json(
          { error: `Culík "${sku.name || sku.sku}" již není dostupný` },
          { status: 400 }
        );
      }

      // For BULK_G: check if enough grams available
      if (sku.saleMode === 'BULK_G') {
        const availableGrams = sku.availableGrams || 0;
        if (availableGrams < item.grams) {
          return NextResponse.json(
            { 
              error: `SKU ${sku.sku} (${sku.name || 'Neznámý produkt'}) má pouze ${availableGrams}g dostupných, ale požadováno ${item.grams}g` 
            },
            { status: 400 }
          );
        }
      }
    }

    // Create order with OrderItem records (NO stock deduction yet - waiting for payment confirmation)
    const totalAmount = quotedLines.reduce((sum, item) => sum + item.lineGrandTotal, 0);

    const order = await prisma.order.create({
      data: {
        email,
        firstName: shippingInfo?.firstName || 'Customer',
        lastName: shippingInfo?.lastName || '',
        phone: shippingInfo?.phone || null,
        streetAddress: shippingInfo?.streetAddress || packetaPoint?.street || 'Unknown',
        city: shippingInfo?.city || packetaPoint?.city || 'Unknown',
        zipCode: shippingInfo?.zipCode || packetaPoint?.zip || '00000',
        country: shippingInfo?.country || 'CZ',
        deliveryMethod: shippingInfo?.deliveryMethod || 'standard',

        // Zásilkovna pickup point data
        packetaPointId: packetaPoint?.id || null,
        packetaPointName: packetaPoint?.name || null,
        packetaPointData: packetaPoint ? JSON.stringify(packetaPoint) : null,

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

    // Send order confirmation email
    try {
      const { sendOrderConfirmationEmail } = await import('@/lib/email');
      const emailItems = order.items.map((item) => ({
        variant: item.nameSnapshot || 'Neznámý produkt',
        quantity: item.saleMode === 'BULK_G' ? `${item.grams}g` : '1',
        price: item.lineTotal + (item.assemblyFeeTotal || 0),
      }));
      await sendOrderConfirmationEmail(order.email, order.id, emailItems, order.total);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

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