import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/scan-orders
 * Convert a completed scan session into an order
 *
 * Body:
 * {
 *   "sessionId": "session-id",
 *   "email": "customer@example.com",
 *   "firstName": "Jan",
 *   "lastName": "Novák",
 *   "phone": "+420732123456",
 *   "streetAddress": "Ulice 123",
 *   "city": "Praha",
 *   "zipCode": "11000",
 *   "country": "CZ",
 *   "deliveryMethod": "standard", // standard, express, pickup
 *   "paymentMethod": "bank_transfer" // gopay, bank_transfer, cash
 * }
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      sessionId,
      email,
      firstName,
      lastName,
      phone,
      streetAddress,
      city,
      zipCode,
      country = 'CZ',
      deliveryMethod = 'standard',
      paymentMethod,
    } = body;

    // Validate required fields
    if (!sessionId || !email || !firstName || !lastName || !streetAddress || !city || !zipCode) {
      return NextResponse.json(
        { error: 'Chybí povinná pole (sessionId, email, firstName, lastName, streetAddress, city, zipCode)' },
        { status: 400 }
      );
    }

    // Get scan session with items
    const session = await prisma.scanSession.findUnique({
      where: { id: sessionId },
      include: { items: { include: { sku: true } } },
    });

    if (!session) {
      return NextResponse.json(
        { error: `Skenovaná relace nebyla nalezena: ${sessionId}` },
        { status: 404 }
      );
    }

    if (session.status !== 'completed') {
      return NextResponse.json(
        { error: 'Relace musí být ve stavu "completed" pro vytvoření objednávky' },
        { status: 400 }
      );
    }

    if (session.items.length === 0) {
      return NextResponse.json(
        { error: 'Relace neobsahuje žádné položky' },
        { status: 400 }
      );
    }

    // Calculate delivery cost (simple: 0 for standard, 100 CZK for express)
    const shippingCost = deliveryMethod === 'express' ? 10000 : 0; // in CZK cents

    // Create order
    const order = await prisma.order.create({
      data: {
        // Customer info
        email,
        firstName,
        lastName,
        phone: phone || undefined,

        // Delivery address
        streetAddress,
        city,
        zipCode,
        country,

        // Delivery
        deliveryMethod,

        // Status
        orderStatus: 'pending',
        paymentStatus: 'unpaid',
        deliveryStatus: 'pending',
        paymentMethod: paymentMethod || undefined,

        // Order details
        subtotal: session.totalPrice,
        shippingCost,
        discountAmount: 0,
        total: session.totalPrice + shippingCost,

        // Items
        items: {
          create: session.items.map((item) => ({
            sku: { connect: { id: item.skuId } },
            nameSnapshot: item.skuName,
            pricePerGram: item.price,
            grams: item.quantity * 10, // Assume 10g per unit (placeholder)
            lineTotal: item.price * item.quantity,
            saleMode: item.sku.saleMode,
            ending: (item.sku.ending || 'NONE') as any,
          })),
        },
      },
      include: { items: true },
    });

    // Create stock movements for each scanned item
    for (const item of session.items) {
      await prisma.stockMovement.create({
        data: {
          skuId: item.skuId,
          type: 'OUT',
          grams: item.quantity * 10, // Placeholder: assume 10g per unit
          note: `Objednávka #${order.id} - skenovaná relace`,
          refOrderId: order.id,
        },
      });

      // Update SKU available grams
      const sku = item.sku;
      if (sku.availableGrams !== null) {
        const newAvailable = Math.max(0, sku.availableGrams - item.quantity * 10);
        await prisma.sku.update({
          where: { id: item.skuId },
          data: { availableGrams: newAvailable },
        });
      }
    }

    // Mark scan session as synced
    await prisma.scanSession.update({
      where: { id: sessionId },
      data: {
        status: 'synced',
        syncedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Objednávka byla úspěšně vytvořena',
        order: {
          id: order.id,
          email: order.email,
          total: order.total,
          itemCount: order.items.length,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          deliveryStatus: order.deliveryStatus,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      {
        error: 'Chyba při vytváření objednávky',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/scan-orders?sessionId=xxx
 * Get order created from scan session
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId parameter is required' },
        { status: 400 }
      );
    }

    // Find order by session reference in stock movements
    // This is a bit indirect, but we need to find the order that was created from this session
    const movements = await prisma.stockMovement.findMany({
      where: {
        note: {
          contains: sessionId,
        },
      },
      include: {
        sku: true,
      },
      take: 1,
    });

    if (movements.length === 0) {
      return NextResponse.json(
        { error: 'Objednávka pro tuto relaci nebyla nalezena' },
        { status: 404 }
      );
    }

    // Get the order via refOrderId
    const order = await prisma.order.findUnique({
      where: { id: movements[0].refOrderId || '' },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Objednávka nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET order error:', error);
    return NextResponse.json(
      {
        error: 'Chyba při načítání objednávky',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
