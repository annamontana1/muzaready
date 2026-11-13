import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { isFakturoidConfigured } from '@/lib/fakturoid';
import { findOrCreateCustomer, normalizeEmail, normalizeInstagram, normalizePhone } from '@/lib/customers';
import { BANK_TRANSFER_DUE_DAYS, STORE_EMAIL, createFakturoidInvoiceForOrder } from '@/lib/order-invoice';

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
  channel: 'prodejna' | 'store' | 'instagram' | 'eshop';
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
    instagramHandle?: string;
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

    // --- Zákazník ---
    const isStoreSale = channel === 'prodejna' || channel === 'store';
    const isTransfer = paymentMethod === 'prevod';
    const customerEmail = normalizeEmail(customer?.email);
    const customerPhone = normalizePhone(customer?.phone);
    const customerInstagram = normalizeInstagram(customer?.instagramHandle);
    const customerDisplayName = (
      customer?.companyName || `${customer?.contactPerson || customer?.firstName || ''} ${customer?.lastName || ''}`
    ).trim();

    // Platba převodem = faktura na jméno → zákazníka musíme znát a umět mu ji doručit.
    // (Dřív se takový prodej uložil na adresu prodejny a klient nešel dohledat.)
    if (channel === 'instagram' || isTransfer) {
      if (customerType === 'anonymous' || !customerDisplayName) {
        return NextResponse.json(
          { error: 'Vyplňte jméno zákazníka — u prodeje na fakturu nemůže být anonymní.' },
          { status: 400 }
        );
      }
      if (!customerEmail && !customerPhone && !customerInstagram) {
        return NextResponse.json(
          { error: 'Vyplňte aspoň jeden kontakt na zákazníka: e-mail, telefon nebo Instagram.' },
          { status: 400 }
        );
      }
    }
    if (customer?.email && !customerEmail) {
      return NextResponse.json({ error: 'E-mail zákazníka nemá platný tvar.' }, { status: 400 });
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
    const email = customerEmail || STORE_EMAIL;

    const supabase = getSupabaseAdminClient();
    const now = new Date().toISOString();

    const warnings: string[] = [];

    // --- CRM: najít nebo založit zákazníka (e-mail → Instagram → telefon) ---
    let customerId: string | null = null;
    if (customerType !== 'anonymous') {
      const crmCustomer = await findOrCreateCustomer({
        firstName: customer?.contactPerson || customer?.firstName,
        lastName: customer?.lastName,
        email: customerEmail || undefined,
        phone: customer?.phone,
        instagramHandle: customer?.instagramHandle,
        companyName: customer?.companyName,
        ico: customer?.ico,
        dic: customer?.dic,
        street: customer?.street,
        city: customer?.city,
        zipCode: customer?.zipCode,
        source: channel === 'instagram' ? 'instagram' : isStoreSale ? 'store' : 'admin',
      });
      customerId = crmCustomer?.id || null;
      if (!customerId) {
        warnings.push('Zákazníka se nepodařilo uložit do sekce Zákazníci — objednávka i faktura vznikly normálně.');
      }
    }

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
    const isPaid = !isTransfer;

    const { data: insertedOrder, error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      customerId,
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
      deliveryStatus: isStoreSale ? 'delivered' : 'pending',
      paymentMethod: paymentMethodMap[paymentMethod] || 'cash',
      channel: channelMap[channel] || 'store',
      subtotal,
      shippingCost,
      discountAmount,
      total,
      tags: JSON.stringify(['pos', channel]),
      riskScore: 0,
      notesInternal: [
        note || `POS prodej – ${channel}`,
        customerInstagram ? `Instagram: @${customerInstagram}` : '',
      ].filter(Boolean).join('\n'),
      paidAt: isPaid ? now : null,
      createdAt: now,
      updatedAt: now,
    }).select('orderNumber').single();

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
      // Sloupce jsou celočíselné; přesná částka je v lineTotal / assemblyFeeTotal
      pricePerGram: Math.round(item.pricePerGram),
      lineTotal: item.lineTotal,
      nameSnapshot: item.name,
      ending: endingMap[item.ending] || 'NONE',
      assemblyFeeCzk: Math.round(item.endingPricePerGram),
      assemblyFeeTotal: item.endingTotal,
      createdAt: now,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
    if (itemsError) {
      console.error('Order items create error:', itemsError.message);
      warnings.push('Položky objednávky se nepodařilo uložit — zkontrolujte objednávku v detailu.');
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
    // Převod = vždy faktura (je na ní číslo účtu, VS a QR kód). Běžná faktura, ne zálohovka.
    const wantsInvoice = invoiceType === 'fakturoid' || isTransfer;
    let invoiceResult: Awaited<ReturnType<typeof createFakturoidInvoiceForOrder>> | null = null;
    let invoiceEmailSent = false;

    if (wantsInvoice && !isFakturoidConfigured()) {
      warnings.push('Fakturoid není nakonfigurován — faktura nevznikla.');
    } else if (wantsInvoice) {
      try {
        invoiceResult = await createFakturoidInvoiceForOrder(orderId);
        invoiceEmailSent = !!invoiceResult.emailSent;

        if (!invoiceResult.success) {
          warnings.push(
            `Fakturu se nepodařilo vytvořit (${invoiceResult.error || 'neznámá chyba'}). Vytvořte ji v detailu objednávky.`
          );
        } else if (customerEmail && !invoiceEmailSent && invoiceResult.invoiceUrl) {
          // Fakturoid e-mail neodeslal → pošleme odkaz na fakturu sami
          const { sendInvoiceLinkEmail } = await import('@/lib/email');
          const dueDate = isPaid ? undefined : new Date(Date.now() + BANK_TRANSFER_DUE_DAYS * 24 * 60 * 60 * 1000);
          invoiceEmailSent = await sendInvoiceLinkEmail(customerEmail, {
            customerName: customerDisplayName,
            orderNumber: insertedOrder?.orderNumber ?? orderId.substring(0, 8),
            invoiceNumber: invoiceResult.invoiceNumber,
            invoiceUrl: invoiceResult.invoiceUrl,
            amount: total,
            dueDate,
          });
          if (!invoiceEmailSent) {
            warnings.push('Fakturu se nepodařilo odeslat e-mailem — pošlete zákazníkovi odkaz ručně.');
          }
        }
      } catch (invoiceError: any) {
        console.error('Fakturoid invoice error (non-blocking):', invoiceError);
        warnings.push('Chyba při vytváření faktury — vytvořte ji v detailu objednávky.');
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Prodej byl úspěšně vytvořen',
        order: {
          id: orderId,
          orderNumber: insertedOrder?.orderNumber ?? null,
          total,
          status: isPaid ? 'paid' : 'pending',
          paymentMethod,
          itemCount: processedItems.length,
        },
        customer: {
          id: customerId,
          name: customerDisplayName,
          email: customerEmail,
          instagramHandle: customerInstagram,
        },
        invoice: invoiceResult
          ? {
              success: invoiceResult.success,
              invoiceNumber: invoiceResult.invoiceNumber || null,
              invoiceUrl: invoiceResult.invoiceUrl || null,
              emailSent: invoiceEmailSent,
              dueDays: isPaid ? null : BANK_TRANSFER_DUE_DAYS,
            }
          : null,
        warnings,
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
