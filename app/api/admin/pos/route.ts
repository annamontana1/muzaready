import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { createInvoiceFromOrder, isFakturoidConfigured } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Ending surcharges per gram
const ENDING_SURCHARGE: Record<string, number> = {
  'Bez zakončení': 0,
  'Keratin': 10,
  'Mikrokeratin': 10,
  'Pásky keratinu': 10,
  'Weft': 50,
  'Tapes': 50,
};

interface PosItem {
  category: string;    // 'standard' | 'luxe' | 'platinum_edition' | 'baby_shades'
  shadeCode: string;
  structure: string;
  lengthCm: number;
  ending: string;
  grams: number;
  pricePerGram: number;
  endingPricePerGram: number;
  productType: string; // 'barvene' | 'nebarvene'
}

interface PosBody {
  channel: 'prodejna' | 'instagram' | 'eshop';
  customerType: 'anonymous' | 'new' | 'b2b';
  customer: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    companyName?: string;
    ico?: string;
    contactPerson?: string;
  };
  items: PosItem[];
  discountPercent: number;
  shipping?: {
    carrier: string;
    price: number;
  } | null;
  paymentMethod: 'hotovost' | 'karta' | 'prevod';
  note?: string;
}

/**
 * POST /api/admin/pos
 * Create a POS order (prodejna, instagram, or manual e-shop).
 * Does NOT deduct from stock — items are selected by dropdown, not from inventory.
 * Calculates price from PriceMatrix + ending surcharges.
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body: PosBody = await request.json();
    const { channel, customerType, customer, items, discountPercent, shipping, paymentMethod, note } = body;

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

    // --- Calculate totals ---
    let subtotal = 0;
    const processedItems: Array<{
      name: string;
      grams: number;
      pricePerGram: number;
      endingPricePerGram: number;
      lineTotal: number;
      endingTotal: number;
      ending: string;
      lengthCm: number;
    }> = [];

    for (const item of items) {
      const pricePerGram = item.pricePerGram || 0;
      const endingPricePerGram = item.endingPricePerGram || 0;
      const hairCost = Math.round(pricePerGram * item.grams * 10) / 10;
      const endingCost = Math.round(endingPricePerGram * item.grams * 10) / 10;
      const lineTotal = Math.round(hairCost + endingCost);

      const tierNames: Record<string, string> = {
        standard: 'Standard',
        luxe: 'Luxe',
        platinum_edition: 'Platinum Edition',
        baby_shades: 'Baby Shades',
      };

      const name = `${tierNames[item.category] || item.category} – #${item.shadeCode} ${item.structure} ${item.lengthCm}cm`;

      subtotal += lineTotal;
      processedItems.push({
        name,
        grams: item.grams,
        pricePerGram,
        endingPricePerGram,
        lineTotal,
        endingTotal: Math.round(endingCost),
        ending: item.ending || 'Bez zakončení',
        lengthCm: item.lengthCm,
      });
    }

    // Apply discount
    const discountAmount = discountPercent > 0 ? Math.round(subtotal * (discountPercent / 100)) : 0;
    const afterDiscount = subtotal - discountAmount;

    // Add shipping
    const shippingCost = shipping?.price || 0;
    const total = afterDiscount + shippingCost;

    // Map payment method and channel
    const paymentMethodMap: Record<string, string> = {
      hotovost: 'cash',
      karta: 'card',
      prevod: 'bank_transfer',
    };

    const channelMap: Record<string, string> = {
      prodejna: 'store',
      instagram: 'instagram',
      eshop: 'web',
    };

    const firstName = customer?.contactPerson || customer?.firstName || 'Prodejní';
    const lastName = customer?.lastName || (customerType === 'anonymous' ? 'Místo' : '');
    const email = customer?.email || 'prodejna@muzahair.cz';

    // --- Find or create matching SKUs for each item ---
    const itemSkuIds: string[] = [];
    for (const item of items) {
      // Try to find existing SKU matching this product
      const tierMap: Record<string, string> = {
        standard: 'STANDARD',
        luxe: 'LUXE',
        platinum_edition: 'PLATINUM_EDITION',
        baby_shades: 'BABY_SHADES',
      };
      const structureMap: Record<string, string> = {
        rovne: 'STRAIGHT',
        vlnite: 'WAVY',
        mirne_vlnite: 'SLIGHTLY_WAVY',
        kudrnate: 'CURLY',
      };

      // CustomerCategory enum = STANDARD, LUXE, PLATINUM_EDITION, BABY_SHADES
      const customerCategoryMap: Record<string, string> = {
        standard: 'STANDARD',
        luxe: 'LUXE',
        platinum_edition: 'PLATINUM_EDITION',
        baby_shades: 'BABY_SHADES',
      };
      const custCat = customerCategoryMap[item.category] || 'STANDARD';

      let sku = await prisma.sku.findFirst({
        where: {
          shade: String(item.shadeCode),
          structure: structureMap[item.structure] || item.structure,
          customerCategory: custCat as any,
        },
      });

      if (!sku) {
        const skuCode = `POS-${item.category}-${item.shadeCode}-${item.structure}-${Date.now()}`;
        sku = await prisma.sku.create({
          data: {
            sku: skuCode,
            shade: String(item.shadeCode),
            shadeName: `Odstín #${item.shadeCode}`,
            structure: structureMap[item.structure] || 'STRAIGHT',
            customerCategory: custCat as any,
            saleMode: 'BULK_G',
            lengthCm: item.lengthCm,
            availableGrams: 0,
            pricePerGramCzk: item.pricePerGram,
          },
        });
      }

      itemSkuIds.push(sku.id);
    }

    // --- Create order ---
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
          deliveryMethod: shipping?.carrier || 'osobni',
          orderStatus: paymentMethod === 'prevod' ? 'pending' : 'paid',
          paymentStatus: paymentMethod === 'prevod' ? 'unpaid' : 'paid',
          deliveryStatus: channel === 'prodejna' ? 'delivered' : 'pending',
          paymentMethod: paymentMethodMap[paymentMethod] || 'cash',
          channel: channelMap[channel] || 'store',
          subtotal,
          shippingCost,
          discountAmount,
          total,
          tags: JSON.stringify(['pos', channel]),
          riskScore: 0,
          notesInternal: note || `POS prodej – ${channel}`,
          paidAt: paymentMethod !== 'prevod' ? new Date() : null,
          items: {
            create: processedItems.map((item, idx) => {
              // Map ending string to EndingOption enum (KERATIN | NONE)
              const endingEnum = item.ending === 'Bez zakončení' || item.ending === 'bez' ? 'NONE' : 'KERATIN';
              return {
                skuId: itemSkuIds[idx],
                saleMode: 'BULK_G' as const,
                grams: item.grams,
                pricePerGram: item.pricePerGram,
                lineTotal: item.lineTotal,
                nameSnapshot: item.name,
                ending: endingEnum as any,
                assemblyFeeCzk: item.endingPricePerGram,
                assemblyFeeTotal: item.endingTotal,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      // Create order history entry
      await tx.orderHistory.create({
        data: {
          orderId: newOrder.id,
          field: 'orderStatus',
          oldValue: null,
          newValue: paymentMethod === 'prevod' ? 'pending' : 'paid',
          changeType: 'status_change',
          note: `POS prodej – ${channel} – ${processedItems.length} položek, platba: ${paymentMethod}`,
          changedBy: 'admin',
        },
      });

      return newOrder;
    });

    // --- Fakturoid ---
    let invoiceResult = null;
    if (paymentMethod !== 'hotovost' && isFakturoidConfigured()) {
      try {
        const invoiceLines = processedItems.map((item) => ({
          name: item.name + (item.ending !== 'Bez zakončení' ? ` + ${item.ending}` : ''),
          quantity: item.grams,
          unitPrice: item.pricePerGram + item.endingPricePerGram,
          unit: 'g',
        }));

        // Add shipping line
        if (shippingCost > 0 && shipping) {
          invoiceLines.push({
            name: `Doprava – ${shipping.carrier}`,
            quantity: 1,
            unitPrice: shippingCost,
            unit: 'ks',
          });
        }

        // Add discount line
        if (discountAmount > 0) {
          invoiceLines.push({
            name: `Sleva ${discountPercent}%`,
            quantity: 1,
            unitPrice: -discountAmount,
            unit: 'ks',
          });
        }

        invoiceResult = await createInvoiceFromOrder({
          orderId: order.id,
          customerName: customer?.companyName || `${firstName} ${lastName}`.trim(),
          customerEmail: email,
          customerPhone: customer?.phone,
          customerIco: customer?.ico,
          items: invoiceLines,
          shippingPrice: 0, // already included in lines
          paymentMethod: paymentMethodMap[paymentMethod] || 'cash',
          isPaid: paymentMethod !== 'prevod',
          proforma: paymentMethod === 'prevod', // proforma for bank transfer (instagram)
        });
      } catch (invoiceError) {
        console.error('Fakturoid invoice error (non-blocking):', invoiceError);
      }
    }

    // --- Send email via Resend for Instagram orders ---
    if (channel === 'instagram' && email && email !== 'prodejna@muzahair.cz') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const itemsList = processedItems
          .map((item) => `• ${item.name} – ${item.grams}g – ${item.lineTotal.toLocaleString('cs-CZ')} Kč${item.ending !== 'Bez zakončení' ? ` (+ ${item.ending} ${item.endingTotal} Kč)` : ''}`)
          .join('\n');

        await resend.emails.send({
          from: 'Mùza Hair <info@mail.muzahair.cz>',
          to: email,
          subject: `Proforma faktura – Objednávka #${order.id.substring(0, 8).toUpperCase()}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #722F37;">Mùza Hair – Proforma faktura</h2>
              <p>Dobrý den,</p>
              <p>děkujeme za Vaši objednávku. Níže naleznete souhrn:</p>
              <hr style="border: 1px solid #eee;" />
              <pre style="font-family: Arial; white-space: pre-wrap;">${itemsList}</pre>
              ${discountAmount > 0 ? `<p><strong>Sleva ${discountPercent}%:</strong> -${discountAmount.toLocaleString('cs-CZ')} Kč</p>` : ''}
              ${shippingCost > 0 ? `<p><strong>Doprava (${shipping?.carrier}):</strong> ${shippingCost.toLocaleString('cs-CZ')} Kč</p>` : ''}
              <h3 style="color: #722F37;">Celkem k úhradě: ${total.toLocaleString('cs-CZ')} Kč</h3>
              <hr style="border: 1px solid #eee;" />
              <p><strong>Platební údaje:</strong></p>
              <p>Číslo účtu: [doplnit]<br/>
              Variabilní symbol: ${order.id.substring(0, 8).toUpperCase()}<br/>
              Částka: ${total.toLocaleString('cs-CZ')} Kč</p>
              <p>Po připsání platby na účet Vám zašleme daňový doklad.</p>
              <br/>
              <p>S pozdravem,<br/><strong>Mùza Hair</strong><br/>www.muzahair.cz</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Resend email error (non-blocking):', emailError);
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
      { error: error.message || 'Chyba při vytváření objednávky' },
      { status: 500 }
    );
  }
}
