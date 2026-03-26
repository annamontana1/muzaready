import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { createInvoiceFromOrder, isFakturoidConfigured } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Types ──────────────────────────────────────────────────────

interface InstagramItem {
  category: string;       // STANDARD, LUXE, PLATINUM_EDITION, BABY_SHADES
  dyeType: string;        // nebarvene, barvene
  structure: string;      // rovné, vlnité, kudrnaté
  shade: number;          // 1-10
  lengthCm: number;       // 40-80, step 5
  grams: number;          // weight in grams
  ending: string;         // bez_zakonceni, keratin, mikrokeratin, pásky keratinu, weft, tapes
  pricePerGram: number;   // from price matrix
  endingSurcharge: number; // calculated surcharge
  discount: number;       // discount in CZK
  lineTotal: number;      // total for this item
}

interface InstagramBody {
  customer: {
    name: string;
    email: string;
    phone?: string;
    street?: string;
    city?: string;
    zipCode?: string;
  };
  items: InstagramItem[];
  shipping: {
    method: string;       // 'zadna' | 'dpd' | 'zasilkovna' | 'jiny'
    customName?: string;  // for 'jiny'
    price: number;
  };
  note?: string;
}

// ─── Ending surcharge rates (per gram) ──────────────────────────

const ENDING_SURCHARGE_PER_GRAM: Record<string, number> = {
  bez_zakonceni: 0,
  keratin: 10,          // 1000 Kč / 100g
  mikrokeratin: 10,     // 1000 Kč / 100g
  'pásky keratinu': 50, // 5000 Kč / 100g
  weft: 50,             // 5000 Kč / 100g
  tapes: 50,            // 5000 Kč / 100g
};

// ─── Category → tier mapping ────────────────────────────────────

const CATEGORY_TIER_MAP: Record<string, string> = {
  STANDARD: 'standard',
  LUXE: 'luxe',
  PLATINUM_EDITION: 'platinum',
  BABY_SHADES: 'baby_shades',
};

// ─── Shipping labels ────────────────────────────────────────────

const SHIPPING_LABELS: Record<string, string> = {
  zadna: 'Osobní odběr',
  dpd: 'DPD',
  zasilkovna: 'Zásilkovna',
  jiny: 'Jiný dopravce',
};

/**
 * POST /api/admin/pos/instagram
 * Create an Instagram order (bank transfer, no stock deduction).
 *
 * 1. Validate input
 * 2. Look up prices from price matrix
 * 3. Create Order with channel="instagram"
 * 4. NO stock deduction
 * 5. Create Fakturoid invoice (bank transfer, unpaid)
 * 6. Return order ID + invoice info
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body: InstagramBody = await request.json();
    const { customer, items, shipping, note } = body;

    // --- Validate customer ---
    if (!customer?.name || !customer?.email) {
      return NextResponse.json(
        { error: 'Jméno a email zákazníka jsou povinné' },
        { status: 400 }
      );
    }

    // --- Validate items ---
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Objednávka musí obsahovat alespoň 1 položku' },
        { status: 400 }
      );
    }

    // --- Validate & recalculate prices from price matrix ---
    let subtotal = 0;
    const verifiedItems: Array<InstagramItem & { description: string }> = [];

    for (const item of items) {
      if (!item.category || !item.lengthCm || !item.grams || !item.ending) {
        return NextResponse.json(
          { error: 'Každá položka musí mít kategorii, délku, gramáž a zakončení' },
          { status: 400 }
        );
      }

      // Look up price from matrix
      // DB schema: category = nebarvene/barvene, tier = standard/luxe/platinum
      const tier = CATEGORY_TIER_MAP[item.category] || item.category.toLowerCase();
      const dyeType = item.dyeType || 'nebarvene';
      const matrixEntry = await prisma.priceMatrix.findFirst({
        where: {
          category: dyeType,
          tier,
          lengthCm: item.lengthCm,
        },
      });

      // Use provided price if matrix entry not found (admin can override)
      const pricePerGram = matrixEntry
        ? matrixEntry.pricePerGramCzk
        : item.pricePerGram;

      // Calculate ending surcharge
      const endingSurchargePerGram = ENDING_SURCHARGE_PER_GRAM[item.ending.toLowerCase()] || 0;
      const endingSurcharge = Math.round(endingSurchargePerGram * item.grams);

      // Calculate line total (with discount)
      const basePrice = Math.round(pricePerGram * item.grams);
      const itemDiscount = item.discount || 0;
      const lineTotal = Math.max(0, basePrice + endingSurcharge - itemDiscount);

      // Build description
      const categoryLabels: Record<string, string> = {
        STANDARD: 'Standard',
        LUXE: 'Luxe',
        PLATINUM_EDITION: 'Platinum Edition',
        BABY_SHADES: 'Baby Shades',
      };
      const dyeLabel = dyeType === 'barvene' ? 'barvené' : 'nebarvené';
      const endingLabel = item.ending === 'bez_zakonceni' ? 'bez zakončení' : item.ending;
      const description = `${categoryLabels[item.category] || item.category} ${dyeLabel} ${item.structure} #${item.shade} ${item.lengthCm}cm ${item.grams}g — ${endingLabel}`;

      subtotal += lineTotal;

      verifiedItems.push({
        ...item,
        pricePerGram,
        endingSurcharge,
        lineTotal,
        description,
      });
    }

    // --- Shipping ---
    const shippingCost = shipping?.price || 0;
    const shippingLabel = shipping?.method === 'jiny' && shipping?.customName
      ? shipping.customName
      : SHIPPING_LABELS[shipping?.method || 'zadna'] || 'Doprava';

    const total = subtotal + shippingCost;

    // --- Parse customer name ---
    const nameParts = customer.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // --- Build items detail for notes ---
    const itemsDetail = verifiedItems.map((item, i) =>
      `${i + 1}. ${item.description} = ${item.lineTotal} Kč (základ ${Math.round(item.pricePerGram * item.grams)} Kč + zakončení ${item.endingSurcharge} Kč)`
    ).join('\n');

    const deliveryMethodMap: Record<string, string> = {
      zadna: 'personal',
      dpd: 'dpd',
      zasilkovna: 'zasilkovna',
      jiny: 'other',
    };

    // --- Create order ---
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          email: customer.email,
          firstName,
          lastName,
          phone: customer.phone || null,
          streetAddress: customer.street || '',
          city: customer.city || '',
          zipCode: customer.zipCode || '',
          country: 'CZ',
          deliveryMethod: deliveryMethodMap[shipping?.method || 'zadna'] || 'personal',
          orderStatus: 'pending',
          paymentStatus: 'unpaid',
          deliveryStatus: 'pending',
          paymentMethod: 'bank_transfer',
          channel: 'instagram',
          subtotal,
          shippingCost,
          discountAmount: 0,
          total,
          tags: JSON.stringify(['instagram', 'bank_transfer']),
          riskScore: 0,
          notesInternal: [
            'Instagram prodej — faktura (převod)',
            note ? `Poznámka: ${note}` : '',
            '',
            'Položky:',
            itemsDetail,
            '',
            `Doprava: ${shippingLabel} (${shippingCost} Kč)`,
          ].filter(Boolean).join('\n'),
        },
      });

      // Create order history entry
      await tx.orderHistory.create({
        data: {
          orderId: newOrder.id,
          field: 'orderStatus',
          oldValue: null,
          newValue: 'pending',
          changeType: 'status_change',
          note: `Instagram prodej — ${verifiedItems.length} položek, celkem ${total} Kč, platba převodem`,
          changedBy: 'admin',
        },
      });

      return newOrder;
    });

    // --- Create Fakturoid invoice (always for Instagram) ---
    let invoiceResult = null;
    if (isFakturoidConfigured()) {
      try {
        invoiceResult = await createInvoiceFromOrder({
          orderId: order.id,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerStreet: customer.street,
          customerCity: customer.city,
          customerZip: customer.zipCode,
          items: verifiedItems.map((item) => ({
            name: item.description,
            quantity: 1,
            unitPrice: item.lineTotal,
            unit: 'ks',
          })),
          shippingPrice: shippingCost,
          shippingName: shippingLabel,
          paymentMethod: 'bank_transfer',
          isPaid: false,
          proforma: true, // Instagram = proforma faktura (záloha)
        });
      } catch (invoiceError) {
        console.error('Fakturoid invoice error (non-blocking):', invoiceError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Instagram prodej byl úspěšně vytvořen',
        order: {
          id: order.id,
          total: order.total,
          status: order.orderStatus,
          paymentMethod: 'bank_transfer',
          itemCount: verifiedItems.length,
        },
        invoice: invoiceResult,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Instagram order creation error:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření prodeje: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
