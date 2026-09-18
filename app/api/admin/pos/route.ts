import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { createInvoiceFromOrder, isFakturoidConfigured } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PosItem {
  category: string;    // 'standard' | 'luxe' | 'platinum_edition' | 'baby_shades' | 'keratin'
  shadeCode?: string;
  structure?: string;
  lengthCm?: number;
  ending?: string;
  grams: number;
  pricePerGram: number;
  endingPricePerGram: number;
  productType: string;
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
    dic?: string;
    contactPerson?: string;
    street?: string;
    city?: string;
    zipCode?: string;
  };
  items: PosItem[];
  discountPercent: number;
  shipping?: { carrier: string; price: number } | null;
  paymentMethod: 'hotovost' | 'karta' | 'prevod';
  invoiceType?: 'fakturoid' | 'uctenka' | 'zadna';
  note?: string;
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body: PosBody = await request.json();
    const { channel, customerType, customer, items, discountPercent, shipping, paymentMethod, invoiceType, note } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Objednávka musí obsahovat alespoň 1 položku' }, { status: 400 });
    }

    if (!paymentMethod || !['hotovost', 'karta', 'prevod'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Neplatný způsob platby' }, { status: 400 });
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

      const keratinColorNames: Record<string, string> = {
        cerny: 'Černý',
        hnedy: 'Hnědý',
        tmave_hnedy: 'Tmavě hnědý',
        pruhledny: 'Průhledný',
      };

      const name = item.category === 'keratin'
        ? `Italský keratin – ${keratinColorNames[item.productType] || keratinColorNames[item.shadeCode ?? ''] || item.shadeCode}`
        : `${tierNames[item.category] || item.category} – #${item.shadeCode} ${item.structure} ${item.lengthCm}cm`;

      subtotal += lineTotal;
      processedItems.push({
        name,
        grams: item.grams,
        pricePerGram,
        endingPricePerGram,
        lineTotal,
        endingTotal: Math.round(endingCost),
        ending: item.ending || 'Bez zakončení',
        lengthCm: item.lengthCm ?? 0,
      });
    }

    const discountAmount = discountPercent > 0 ? Math.round(subtotal * (discountPercent / 100)) : 0;
    const shippingCost = shipping?.price || 0;
    const total = subtotal - discountAmount + shippingCost;

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

    const supabase = getSupabaseAdminClient();
    const now = new Date().toISOString();

    // --- Find or create matching SKUs ---
    const structureMap: Record<string, string> = {
      rovne: 'STRAIGHT',
      vlnite: 'WAVY',
      mirne_vlnite: 'SLIGHTLY_WAVY',
      kudrnate: 'CURLY',
    };

    const customerCategoryMap: Record<string, string> = {
      standard: 'STANDARD',
      luxe: 'LUXE',
      platinum_edition: 'PLATINUM_EDITION',
      baby_shades: 'BABY_SHADES',
    };

    const keratinColorNames: Record<string, string> = {
      cerny: 'Černý',
      hnedy: 'Hnědý',
      tmave_hnedy: 'Tmavě hnědý',
      pruhledny: 'Průhledný',
    };

    const itemSkuIds: string[] = [];
    for (const item of items) {
      // Keratin items get a dedicated SKU per colour — no length/structure
      if (item.category === 'keratin') {
        const colorKey = item.productType || item.shadeCode || 'cerny';
        const { data: existingKeratin } = await supabase
          .from('skus')
          .select('id')
          .ilike('sku', `KERATIN-${colorKey}-%`)
          .maybeSingle();

        if (existingKeratin) {
          itemSkuIds.push(existingKeratin.id);
        } else {
          const newSkuId = randomUUID();
          await supabase.from('skus').insert({
            id: newSkuId,
            sku: `KERATIN-${colorKey}-${Date.now()}`,
            shade: colorKey,
            shadeName: `Italský keratin – ${keratinColorNames[colorKey] || colorKey}`,
            structure: 'STRAIGHT',
            customerCategory: 'STANDARD',
            saleMode: 'BULK_G',
            lengthCm: 0,
            availableGrams: 0,
            pricePerGramCzk: item.pricePerGram,
            inStock: false,
            soldOut: true,
            isListed: false,
            createdAt: now,
            updatedAt: now,
          });
          itemSkuIds.push(newSkuId);
        }
        continue;
      }

      const custCat = customerCategoryMap[item.category] || 'STANDARD';
      const structureValue = structureMap[item.structure ?? 'rovne'] || item.structure;

      const { data: existingSku } = await supabase
        .from('skus')
        .select('id')
        .eq('shade', String(item.shadeCode))
        .eq('structure', structureValue)
        .eq('customerCategory', custCat)
        .eq('lengthCm', item.lengthCm ?? 0)
        .maybeSingle();

      if (existingSku) {
        itemSkuIds.push(existingSku.id);
      } else {
        const skuCode = `POS-${item.category}-${item.shadeCode}-${item.structure}-${Date.now()}`;
        const newSkuId = randomUUID();
        const { error: skuError } = await supabase.from('skus').insert({
          id: newSkuId,
          sku: skuCode,
          shade: String(item.shadeCode ?? ''),
          shadeName: `Odstín #${item.shadeCode}`,
          structure: structureValue,
          customerCategory: custCat,
          saleMode: 'BULK_G',
          lengthCm: item.lengthCm ?? 0,
          availableGrams: 0,
          pricePerGramCzk: item.pricePerGram,
          inStock: false,
          soldOut: true,
          isListed: false,
          createdAt: now,
          updatedAt: now,
        });
        if (skuError) {
          console.error('SKU create error:', skuError.message);
          return NextResponse.json(
            { error: 'Chyba při vytváření SKU: ' + skuError.message },
            { status: 500 }
          );
        }
        itemSkuIds.push(newSkuId);
      }
    }

    // --- Create order ---
    const orderId = randomUUID();
    const isPaid = paymentMethod !== 'prevod';

    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      email,
      firstName,
      lastName,
      phone: customer?.phone || null,
      companyName: customer?.companyName || null,
      ico: customer?.ico || null,
      dic: customer?.dic || null,
      streetAddress: customer?.street || '',
      city: customer?.city || 'Praha',
      zipCode: customer?.zipCode || '11000',
      country: 'CZ',
      deliveryMethod: shipping?.carrier || 'osobni',
      orderStatus: isPaid ? 'paid' : 'pending',
      paymentStatus: isPaid ? 'paid' : 'unpaid',
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
      paidAt: isPaid ? now : null,
      createdAt: now,
      updatedAt: now,
    });

    if (orderError) {
      console.error('Order create error:', orderError.message);
      return NextResponse.json(
        { error: 'Chyba při vytváření objednávky: ' + orderError.message },
        { status: 500 }
      );
    }

    // --- Create order items ---
    const endingMap: Record<string, string> = {
      'bez': 'NONE',
      'Bez zakončení': 'NONE',
      'keratin': 'KERATIN',
      'Keratin': 'KERATIN',
      'mikrokeratin': 'MIKROKERATIN',
      'Mikrokeratin': 'MIKROKERATIN',
      'pasky_keratinu': 'PASKY_KERATINU',
      'Pásky keratinu': 'PASKY_KERATINU',
      'weft': 'WEFT',
      'Weft': 'WEFT',
      'tapes': 'TAPES',
      'Tapes': 'TAPES',
    };

    const orderItemsData = processedItems.map((item, idx) => ({
      id: randomUUID(),
      orderId,
      skuId: itemSkuIds[idx],
      saleMode: 'BULK_G',
      grams: item.grams,
      pricePerGram: item.pricePerGram,
      lineTotal: item.lineTotal,
      nameSnapshot: item.name,
      ending: endingMap[item.ending] || 'NONE',
      assemblyFeeCzk: item.endingPricePerGram,
      assemblyFeeTotal: item.endingTotal,
      createdAt: now,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
    if (itemsError) {
      console.error('Order items create error:', itemsError.message);
    }

    // --- Create order history entry ---
    const { error: historyError } = await supabase.from('order_history').insert({
      id: randomUUID(),
      orderId,
      field: 'orderStatus',
      oldValue: null,
      newValue: isPaid ? 'paid' : 'pending',
      changeType: 'status_change',
      note: `POS prodej – ${channel} – ${processedItems.length} položek, platba: ${paymentMethod}`,
      changedBy: 'admin',
      createdAt: now,
    });
    if (historyError) {
      console.error('Order history create error:', historyError.message);
    }

    // --- Fakturoid ---
    let invoiceResult = null;
    if (invoiceType === 'fakturoid' && isFakturoidConfigured()) {
      try {
        const invoiceLines = processedItems.map((item) => ({
          name: item.name + (item.ending !== 'Bez zakončení' ? ` + ${item.ending}` : ''),
          quantity: item.grams,
          unitPrice: item.pricePerGram + item.endingPricePerGram,
          unit: 'g',
        }));

        if (shippingCost > 0 && shipping) {
          invoiceLines.push({
            name: `Doprava – ${shipping.carrier}`,
            quantity: 1,
            unitPrice: shippingCost,
            unit: 'ks',
          });
        }

        if (discountAmount > 0) {
          invoiceLines.push({
            name: `Sleva ${discountPercent}%`,
            quantity: 1,
            unitPrice: -discountAmount,
            unit: 'ks',
          });
        }

        // Use the actual customer email only — not the store fallback.
        // Using the store email would find an existing contact and apply its name instead of the typed one.
        const invoiceEmail = customer?.email || undefined;

        invoiceResult = await createInvoiceFromOrder({
          orderId,
          customerName: customer?.companyName || `${firstName} ${lastName}`.trim(),
          customerEmail: invoiceEmail,
          customerPhone: customer?.phone,
          customerIco: customer?.ico,
          customerDic: customer?.dic,
          customerStreet: customer?.street,
          customerCity: customer?.city,
          customerZip: customer?.zipCode,
          items: invoiceLines,
          shippingPrice: 0,
          paymentMethod: paymentMethodMap[paymentMethod] || 'cash',
          isPaid,
          proforma: paymentMethod === 'prevod',
        });

        if (invoiceResult?.success && invoiceResult.invoiceId) {
          await supabase
            .from('orders')
            .update({
              fakturoidInvoiceId: String(invoiceResult.invoiceId),
              fakturoidIsProforma: paymentMethod === 'prevod',
              fakturoidInvoiceUrl: invoiceResult.invoiceUrl || null,
              fakturoidInvoiceNum: invoiceResult.invoiceNumber || null,
              updatedAt: new Date().toISOString(),
            })
            .eq('id', orderId);
        }
      } catch (invoiceError) {
        console.error('Fakturoid invoice error (non-blocking):', invoiceError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Prodej byl úspěšně vytvořen',
        order: {
          id: orderId,
          total,
          status: isPaid ? 'paid' : 'pending',
          paymentMethod,
          itemCount: processedItems.length,
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
