import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { buildSkuDisplayName } from '@/lib/stock';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { customer, shipping, items, payment, channel, notesInternal, notesCustomer } = body;

    if (!customer?.email || !customer?.firstName || !customer?.lastName) {
      return NextResponse.json({ error: 'Chybí zákaznické údaje (email, firstName, lastName)' }, { status: 400 });
    }
    if (!shipping?.city || !shipping?.zipCode || !shipping?.country) {
      return NextResponse.json({ error: 'Chybí doručovací údaje (city, zipCode, country)' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Objednávka musí obsahovat alespoň 1 položku' }, { status: 400 });
    }
    if (shipping.deliveryMethod === 'zasilkovna' && !shipping.packetaPoint?.id) {
      return NextResponse.json({ error: 'Pro Zásilkovnu musí být vybrané výdejní místo' }, { status: 400 });
    }

    const shippingCostMap: Record<string, number> = {
      zasilkovna: 150,
      dpd: 200,
      standard: 150,
      personal: 0,
    };
    const shippingCost = shippingCostMap[shipping.deliveryMethod] || 150;

    const supabase = getSupabaseAdminClient();
    const skuIds = items.map((item: any) => item.skuId);

    const { data: skus, error: skuError } = await supabase
      .from('skus')
      .select('*')
      .in('id', skuIds);

    if (skuError || !skus || skus.length !== skuIds.length) {
      return NextResponse.json({ error: 'Jeden nebo více SKU nebylo nalezeno' }, { status: 404 });
    }

    // Calculate line totals
    let subtotal = 0;
    const itemsWithPrices = items.map((item: any) => {
      const sku = skus.find((s: any) => s.id === item.skuId);
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
        assemblyFeeTotal = 0;
      }

      subtotal += lineTotal + assemblyFeeTotal;

      return {
        skuId: item.skuId,
        sku,
        saleMode: item.saleMode,
        grams: item.grams || 0,
        pricePerGram: sku.pricePerGramCzk || 0,
        lineTotal,
        nameSnapshot: buildSkuDisplayName(sku),
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
          return NextResponse.json({
            error: `Nedostatečný sklad pro ${item.sku.name || item.sku.sku}. Dostupné: ${item.sku.availableGrams}g, požadováno: ${item.grams}g`
          }, { status: 400 });
        }
      } else if (item.saleMode === 'SINGLE_PIECE') {
        if (!item.sku.inStock || item.sku.soldOut) {
          return NextResponse.json({ error: `${item.sku.name || item.sku.sku} není na skladě` }, { status: 400 });
        }
      }
    }

    // Create order
    const orderId = randomUUID();
    const now = new Date().toISOString();

    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
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
      paidAt: payment?.paidAt ? new Date(payment.paidAt).toISOString() : null,
      packetaPointId: shipping.packetaPoint?.id || null,
      packetaPointName: shipping.packetaPoint?.name || null,
      packetaPointData: shipping.packetaPoint ? JSON.stringify(shipping.packetaPoint) : null,
      createdAt: now,
      updatedAt: now,
    });

    if (orderError) {
      console.error('Order create error:', orderError.message);
      return NextResponse.json({ error: 'Chyba při vytváření objednávky: ' + orderError.message }, { status: 500 });
    }

    // Create order items
    const { error: itemsError } = await supabase.from('order_items').insert(
      itemsWithPrices.map((item: any) => ({
        id: randomUUID(),
        orderId,
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
        createdAt: now,
      }))
    );
    if (itemsError) console.error('Order items error:', itemsError.message);

    // Update stock and log movements for BULK_G items
    for (const item of itemsWithPrices as any[]) {
      if (item.saleMode === 'BULK_G') {
        const newAvailableGrams = (item.sku.availableGrams || 0) - item.grams;
        await supabase.from('skus').update({
          availableGrams: newAvailableGrams,
          inStock: newAvailableGrams > 0,
          soldOut: newAvailableGrams === 0,
          updatedAt: now,
        }).eq('id', item.skuId);

        await supabase.from('stock_movements').insert({
          id: randomUUID(),
          skuId: item.skuId,
          type: 'OUT',
          grams: item.grams,
          refOrderId: orderId,
          reason: `Order ${orderId.substring(0, 8)}`,
          createdAt: now,
        });
      }
    }

    // Create order history
    await supabase.from('order_history').insert({
      id: randomUUID(),
      orderId,
      field: 'orderStatus',
      oldValue: null,
      newValue: payment?.paymentStatus === 'paid' ? 'paid' : 'pending',
      changeType: 'status_change',
      note: `Order created via admin (${channel}) - ${itemsWithPrices.length} items`,
      changedBy: 'admin',
      createdAt: now,
    });

    // Send order confirmation email
    if (!customer.email.includes('@example.com')) {
      try {
        const { sendOrderConfirmationEmail } = await import('@/lib/email');
        await sendOrderConfirmationEmail(
          customer.email,
          orderId,
          itemsWithPrices.map((item: any) => ({
            variant: item.nameSnapshot || 'Vlasy',
            quantity: item.grams ? `${item.grams}g` : '1',
            price: item.lineTotal,
          })),
          total
        );
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Objednávka byla úspěšně vytvořena',
      order: {
        id: orderId,
        email: customer.email,
        total,
        status: payment?.paymentStatus === 'paid' ? 'paid' : 'pending',
        deliveryMethod: shipping.deliveryMethod,
        hasZasilkovnaPoint: !!shipping.packetaPoint?.id,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Chyba při vytváření objednávky:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření objednávky: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
