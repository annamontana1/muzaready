import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/orders/create
 * Create a manual order (Instagram, POS, phone orders)
 *
 * Body:
 * {
 *   "customer": {
 *     "email": "zakaznik@example.com",
 *     "firstName": "Jan",
 *     "lastName": "Novák",
 *     "phone": "+420123456789"
 *   },
 *   "shipping": {
 *     "streetAddress": "Testovací 123",
 *     "city": "Praha",
 *     "zipCode": "11000",
 *     "country": "CZ",
 *     "deliveryMethod": "zasilkovna" | "standard" | "dpd",
 *     "packetaPoint": {  // Only if deliveryMethod === 'zasilkovna'
 *       "id": "12345",
 *       "name": "Praha 1 - Pošta",
 *       "street": "Ulice 123",
 *       "city": "Praha",
 *       "zip": "11000",
 *       "country": "cz"
 *     }
 *   },
 *   "items": [
 *     {
 *       "skuId": "sku_abc123",
 *       "saleMode": "BULK_G" | "SINGLE_PIECE",
 *       "grams": 100,  // for BULK_G
 *       "quantity": 1,  // for SINGLE_PIECE
 *       "ending": "NONE" | "CLIP" | "MICRORINGS",
 *       "assemblyFeeType": "FLAT" | "PER_GRAM",
 *       "assemblyFeeCzk": 0
 *     }
 *   ],
 *   "payment": {
 *     "paymentMethod": "bank_transfer" | "gopay" | "cash",
 *     "paymentStatus": "unpaid" | "paid",
 *     "paidAt": "2024-01-22T12:00:00Z"  // if paid
 *   },
 *   "channel": "ig_dm" | "pos" | "phone",
 *   "notesInternal": "Instagram DM objednávka",
 *   "notesCustomer": "Poznámka pro zákazníka"
 * }
 */
export async function POST(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { customer, shipping, items, payment, channel, notesInternal, notesCustomer } = body;

    // Validate required fields
    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      return NextResponse.json(
        { error: 'Chybí zákaznické údaje (email, firstName, lastName)' },
        { status: 400 }
      );
    }

    if (!shipping?.city || !shipping?.zipCode || !shipping?.country) {
      return NextResponse.json(
        { error: 'Chybí doručovací údaje (city, zipCode, country)' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Objednávka musí obsahovat alespoň 1 položku' },
        { status: 400 }
      );
    }

    // Validate Zásilkovna pickup point
    if (shipping.deliveryMethod === 'zasilkovna' && !shipping.packetaPoint?.id) {
      return NextResponse.json(
        { error: 'Pro Zásilkovnu musí být vybrané výdejní místo' },
        { status: 400 }
      );
    }

    // Calculate shipping cost
    const shippingCostMap: Record<string, number> = {
      zasilkovna: 150,
      dpd: 200,
      standard: 150,
      personal: 0,
    };
    const shippingCost = shippingCostMap[shipping.deliveryMethod] || 150;

    // Fetch SKUs and calculate totals
    const skuIds = items.map((item: any) => item.skuId);
    const skus = await prisma.sku.findMany({
      where: { id: { in: skuIds } },
    });

    if (skus.length !== skuIds.length) {
      return NextResponse.json(
        { error: 'Jeden nebo více SKU nebylo nalezeno' },
        { status: 404 }
      );
    }

    // Calculate line totals
    let subtotal = 0;
    const itemsWithPrices = items.map((item: any) => {
      const sku = skus.find((s) => s.id === item.skuId);
      if (!sku) throw new Error(`SKU ${item.skuId} not found`);

      let lineTotal = 0;
      let assemblyFeeTotal = 0;

      if (item.saleMode === 'BULK_G') {
        const pricePerGram = sku.pricePerGramCzk || 0;
        lineTotal = pricePerGram * item.grams;

        if (item.assemblyFeeType === 'PER_GRAM') {
          assemblyFeeTotal = (item.assemblyFeeCzk || 0) * item.grams;
        } else if (item.assemblyFeeType === 'FLAT') {
          assemblyFeeTotal = item.assemblyFeeCzk || 0;
        }
      } else if (item.saleMode === 'SINGLE_PIECE') {
        lineTotal = (sku.priceCzkTotal || 0) * (item.quantity || 1);
        assemblyFeeTotal = 0; // Single pieces have assembly included
      }

      const totalWithAssembly = lineTotal + assemblyFeeTotal;
      subtotal += totalWithAssembly;

      return {
        skuId: item.skuId,
        sku,
        saleMode: item.saleMode,
        grams: item.grams || 0,
        pricePerGram: sku.pricePerGramCzk || 0,
        lineTotal,
        nameSnapshot: sku.name || sku.sku,
        ending: item.ending || 'NONE',
        assemblyFeeType: item.assemblyFeeType || 'FLAT',
        assemblyFeeCzk: item.assemblyFeeCzk || 0,
        assemblyFeeTotal,
      };
    });

    const total = subtotal + shippingCost;

    // Check stock availability
    for (const item of itemsWithPrices as any[]) {
      if (item.saleMode === 'BULK_G') {
        if ((item.sku.availableGrams || 0) < item.grams) {
          return NextResponse.json(
            {
              error: `Nedostatečný sklad pro ${item.sku.name || item.sku.sku}. Dostupné: ${item.sku.availableGrams}g, požadováno: ${item.grams}g`
            },
            { status: 400 }
          );
        }
      } else if (item.saleMode === 'SINGLE_PIECE') {
        if (!item.sku.inStock || item.sku.soldOut) {
          return NextResponse.json(
            {
              error: `${item.sku.name || item.sku.sku} není na skladě`
            },
            { status: 400 }
          );
        }
      }
    }

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone || null,
          streetAddress: shipping.streetAddress || '',
          city: shipping.city,
          zipCode: shipping.zipCode,
          country: shipping.country,
          deliveryMethod: shipping.deliveryMethod,
          orderStatus: payment?.paymentStatus === 'paid' ? 'paid' : 'pending',
          paymentStatus: payment?.paymentStatus || 'unpaid',
          deliveryStatus: 'pending',
          channel: channel || 'ig_dm',
          paymentMethod: payment?.paymentMethod || 'bank_transfer',
          subtotal,
          shippingCost,
          discountAmount: 0,
          total,
          tags: JSON.stringify(['instagram', 'manual-order']),
          riskScore: 0,
          notesInternal: notesInternal || 'Manuálně vytvořená objednávka z admin panelu',
          notesCustomer: notesCustomer || null,
          paidAt: payment?.paidAt ? new Date(payment.paidAt) : null,
          // Zásilkovna pickup point
          packetaPointId: shipping.packetaPoint?.id || null,
          packetaPointName: shipping.packetaPoint?.name || null,
          packetaPointData: shipping.packetaPoint ? JSON.stringify(shipping.packetaPoint) : null,
          items: {
            create: itemsWithPrices.map((item: any) => ({
              skuId: item.skuId,
              saleMode: item.saleMode,
              grams: item.grams,
              pricePerGram: item.pricePerGram,
              lineTotal: item.lineTotal + item.assemblyFeeTotal,
              nameSnapshot: item.nameSnapshot,
              ending: item.ending,
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

      // Update stock for BULK_G items
      for (const item of itemsWithPrices) {
        if (item.saleMode === 'BULK_G') {
          const newAvailableGrams = (item.sku.availableGrams || 0) - item.grams;

          await tx.sku.update({
            where: { id: item.skuId },
            data: {
              availableGrams: newAvailableGrams,
              inStock: newAvailableGrams > 0,
              soldOut: newAvailableGrams === 0,
            },
          });

          // Log stock movement
          await tx.stockMovement.create({
            data: {
              skuId: item.skuId,
              type: 'OUT',
              grams: item.grams,
              refOrderId: newOrder.id,
              reason: `Order ${newOrder.id.substring(0, 8)}`,
            },
          });
        }
      }

      // Create order history
      await tx.orderHistory.create({
        data: {
          orderId: newOrder.id,
          field: 'orderStatus',
          oldValue: null,
          newValue: payment?.paymentStatus === 'paid' ? 'paid' : 'pending',
          changeType: 'status_change',
          note: `Order created via admin (${channel}) - ${itemsWithPrices.length} items`,
          changedBy: 'admin',
        },
      });

      return newOrder;
    });

    // Send order confirmation email if not test email
    if (!customer.email.includes('@example.com')) {
      try {
        const { sendOrderConfirmationEmail } = await import('@/lib/email');
        await sendOrderConfirmationEmail(
          customer.email,
          order.id,
          order.items.map((item: any) => ({
            variant: item.nameSnapshot || 'Vlasy',
            quantity: item.grams ? `${item.grams}g` : '1',
            price: item.lineTotal,
          })),
          order.total
        );
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Objednávka byla úspěšně vytvořena',
        order: {
          id: order.id,
          email: order.email,
          total: order.total,
          status: order.orderStatus,
          deliveryMethod: shipping.deliveryMethod,
          hasZasilkovnaPoint: !!shipping.packetaPoint?.id,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Chyba při vytváření objednávky:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření objednávky: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
