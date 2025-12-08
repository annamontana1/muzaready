import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';

/**
 * POST /api/admin/test-order
 * Vytvoří test objednávku pro testování admin panelu
 */
export async function POST(request: NextRequest) {
  try {
    // Ověř admin session
    const session = await verifyAdminSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Najdi první dostupný SKU
    const sku = await prisma.sku.findFirst({
      where: { inStock: true },
    });

    if (!sku) {
      return NextResponse.json(
        { error: 'Nenalezen žádný SKU na skladě. Spusť nejdřív seed.' },
        { status: 400 }
      );
    }

    // Vytvoř test objednávku
    const order = await prisma.order.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        firstName: 'Test',
        lastName: 'Uživatel',
        phone: '+420123456789',
        streetAddress: 'Testovací 123',
        city: 'Praha',
        zipCode: '11000',
        country: 'CZ',
        orderStatus: 'pending',
        paymentStatus: 'unpaid',
        deliveryStatus: 'pending',
        channel: 'web',
        paymentMethod: 'gopay',
        deliveryMethod: 'standard',
        subtotal: 6500,
        shippingCost: 150,
        discountAmount: 0,
        total: 6650,
        tags: JSON.stringify(['test', 'admin-created']),
        riskScore: 0,
        notesInternal: 'Test objednávka vytvořená z admin panelu',
        items: {
          create: {
            skuId: sku.id,
            saleMode: 'BULK_G',
            grams: 100,
            pricePerGram: sku.pricePerGramCzk || 65,
            lineTotal: 6500,
            nameSnapshot: sku.name || sku.sku,
            ending: 'NONE',
            assemblyFeeType: 'FLAT',
            assemblyFeeCzk: 0,
            assemblyFeeTotal: 0,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Test objednávka byla úspěšně vytvořena',
        order: {
          id: order.id,
          email: order.email,
          total: order.total,
          status: order.orderStatus,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Chyba při vytváření test objednávky:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření test objednávky: ' + error.message },
      { status: 500 }
    );
  }
}

