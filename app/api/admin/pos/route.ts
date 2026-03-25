import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { createInvoiceFromOrder, isFakturoidConfigured } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PosItem {
  skuId: string;
  saleMode: 'BULK_G' | 'PIECE_BY_WEIGHT';
  grams: number;
  ending?: 'KERATIN' | 'NONE';
  assemblyFeeCzk?: number;
}

interface PosBody {
  customerType: 'anonymous' | 'b2b';
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    ico?: string;
  };
  items: PosItem[];
  paymentMethod: 'hotovost' | 'karta' | 'prevod';
  note?: string;
}

/**
 * POST /api/admin/pos
 * Create a POS (store) order.
 *
 * 1. Validate input
 * 2. Create Order with channel="store"
 * 3. Create OrderItems
 * 4. Deduct stock from each SKU
 * 5. If payment != hotovost, create Fakturoid invoice
 * 6. Return created order
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body: PosBody = await request.json();
    const { customerType, customer, items, paymentMethod, note } = body;

    // --- Validate ---
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Objednávka musí obsahovat alespoň 1 položku' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['hotovost', 'karta', 'prevod'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Neplatný způsob platby' },
        { status: 400 }
      );
    }

    // For B2B, require at least company name
    if (customerType === 'b2b' && !customer?.companyName && !customer?.firstName) {
      return NextResponse.json(
        { error: 'Zadejte jméno firmy nebo kontaktní osobu' },
        { status: 400 }
      );
    }

    // --- Fetch SKUs ---
    const skuIds = items.map((i) => i.skuId);
    const skus = await prisma.sku.findMany({
      where: { id: { in: skuIds } },
    });

    if (skus.length !== new Set(skuIds).size) {
      return NextResponse.json(
        { error: 'Jeden nebo více SKU nebylo nalezeno' },
        { status: 404 }
      );
    }

    const skuMap = new Map(skus.map((s) => [s.id, s]));

    // --- Calculate line totals & validate stock ---
    let subtotal = 0;
    const processedItems: Array<{
      skuId: string;
      sku: any;
      saleMode: 'BULK_G' | 'PIECE_BY_WEIGHT';
      grams: number;
      pricePerGram: number;
      lineTotal: number;
      nameSnapshot: string;
      ending: 'KERATIN' | 'NONE';
      assemblyFeeCzk: number;
      assemblyFeeTotal: number;
    }> = [];

    for (const item of items) {
      const sku = skuMap.get(item.skuId);
      if (!sku) {
        return NextResponse.json(
          { error: `SKU ${item.skuId} nebylo nalezeno` },
          { status: 404 }
        );
      }

      if (item.saleMode === 'BULK_G') {
        const available = sku.availableGrams || 0;
        if (available < item.grams) {
          return NextResponse.json(
            {
              error: `Nedostatečný sklad pro ${sku.shadeName || sku.sku}. Dostupné: ${available}g, požadováno: ${item.grams}g`,
            },
            { status: 400 }
          );
        }
        const pricePerGram = sku.pricePerGramCzk || 0;
        const lineTotal = Math.round(pricePerGram * item.grams);
        const assemblyFeeCzk = item.assemblyFeeCzk || 0;
        const assemblyFeeTotal = assemblyFeeCzk * item.grams;

        subtotal += lineTotal + assemblyFeeTotal;

        processedItems.push({
          skuId: item.skuId,
          sku,
          saleMode: 'BULK_G',
          grams: item.grams,
          pricePerGram: Math.round(pricePerGram),
          lineTotal,
          nameSnapshot: sku.name || sku.shadeName || sku.sku,
          ending: item.ending || 'NONE',
          assemblyFeeCzk,
          assemblyFeeTotal,
        });
      } else {
        // PIECE_BY_WEIGHT
        if (!sku.inStock || sku.soldOut) {
          return NextResponse.json(
            { error: `${sku.shadeName || sku.sku} není na skladě` },
            { status: 400 }
          );
        }
        const totalPrice = sku.priceCzkTotal || 0;
        const weight = sku.weightTotalG || 0;
        const pricePerGram = weight > 0 ? Math.round(totalPrice / weight) : 0;

        subtotal += Math.round(totalPrice);

        processedItems.push({
          skuId: item.skuId,
          sku,
          saleMode: 'PIECE_BY_WEIGHT',
          grams: weight,
          pricePerGram,
          lineTotal: Math.round(totalPrice),
          nameSnapshot: sku.name || sku.shadeName || sku.sku,
          ending: item.ending || 'NONE',
          assemblyFeeCzk: 0,
          assemblyFeeTotal: 0,
        });
      }
    }

    const total = subtotal; // No shipping for store sales

    // Map payment method to DB value
    const paymentMethodMap: Record<string, string> = {
      hotovost: 'cash',
      karta: 'card',
      prevod: 'bank_transfer',
    };

    const firstName = customer?.firstName || 'Prodejní';
    const lastName = customer?.lastName || 'Místo';
    const email = customer?.email || 'prodejna@muzahair.cz';

    // --- Create order in transaction ---
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          email,
          firstName,
          lastName,
          phone: customer?.phone || null,
          companyName: customer?.companyName || null,
          ico: customer?.ico || null,
          streetAddress: '',
          city: 'Praha',
          zipCode: '11000',
          country: 'CZ',
          deliveryMethod: 'personal',
          orderStatus: paymentMethod === 'prevod' ? 'pending' : 'paid',
          paymentStatus: paymentMethod === 'prevod' ? 'unpaid' : 'paid',
          deliveryStatus: 'delivered',
          paymentMethod: paymentMethodMap[paymentMethod] || 'cash',
          channel: 'store',
          subtotal,
          shippingCost: 0,
          discountAmount: 0,
          total,
          tags: JSON.stringify(['pos', 'store']),
          riskScore: 0,
          notesInternal: note || 'POS prodej na prodejně',
          paidAt: paymentMethod !== 'prevod' ? new Date() : null,
          items: {
            create: processedItems.map((item) => ({
              skuId: item.skuId,
              saleMode: item.saleMode,
              grams: item.grams,
              pricePerGram: item.pricePerGram,
              lineTotal: item.lineTotal + item.assemblyFeeTotal,
              nameSnapshot: item.nameSnapshot,
              ending: item.ending,
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

      // Deduct stock
      for (const item of processedItems) {
        if (item.saleMode === 'BULK_G') {
          const newAvailable = (item.sku.availableGrams || 0) - item.grams;
          await tx.sku.update({
            where: { id: item.skuId },
            data: {
              availableGrams: Math.max(0, newAvailable),
              inStock: newAvailable > 0,
              soldOut: newAvailable <= 0,
            },
          });
        } else {
          // PIECE_BY_WEIGHT - mark as sold
          await tx.sku.update({
            where: { id: item.skuId },
            data: {
              inStock: false,
              soldOut: true,
              availableGrams: 0,
            },
          });
        }

        // Log stock movement
        await tx.stockMovement.create({
          data: {
            skuId: item.skuId,
            type: 'OUT',
            grams: item.grams,
            refOrderId: newOrder.id,
            reason: `POS prodej #${newOrder.id.substring(0, 8)}`,
          },
        });
      }

      // Create order history entry
      await tx.orderHistory.create({
        data: {
          orderId: newOrder.id,
          field: 'orderStatus',
          oldValue: null,
          newValue: paymentMethod === 'prevod' ? 'pending' : 'paid',
          changeType: 'status_change',
          note: `POS prodej na prodejně - ${processedItems.length} položek, platba: ${paymentMethod}`,
          changedBy: 'admin',
        },
      });

      return newOrder;
    });

    // --- Fakturoid invoice for all payments ---
    let invoiceResult = null;
    if (isFakturoidConfigured()) {
      try {
        invoiceResult = await createInvoiceFromOrder({
          orderId: order.id,
          customerName: customer?.companyName || `${firstName} ${lastName}`,
          customerEmail: email,
          customerPhone: customer?.phone,
          customerIco: customer?.ico,
          items: processedItems.map((item) => ({
            name: item.nameSnapshot,
            quantity: item.saleMode === 'BULK_G' ? item.grams : 1,
            unitPrice:
              item.saleMode === 'BULK_G'
                ? item.pricePerGram
                : item.lineTotal,
            unit: item.saleMode === 'BULK_G' ? 'g' : 'ks',
          })),
          paymentMethod: paymentMethodMap[paymentMethod] || 'cash',
          isPaid: paymentMethod !== 'prevod',
        });
      } catch (invoiceError) {
        console.error('Fakturoid invoice error (non-blocking):', invoiceError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Prodej byl úspěšně vytvořen',
        order: {
          id: order.id,
          total: order.total,
          status: order.orderStatus,
          paymentMethod,
          itemCount: order.items.length,
        },
        invoice: invoiceResult,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POS order creation error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření prodeje: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
