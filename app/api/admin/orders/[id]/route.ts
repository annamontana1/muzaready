import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin, verifyAdminSession } from '@/lib/admin-auth';
import { buildSkuDisplayName } from '@/lib/stock';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function logOrderChange(
  orderId: string,
  field: string,
  oldValue: any,
  newValue: any,
  changeType: string,
  changedBy: string,
  note?: string
) {
  try {
    await getSupabaseAdminClient().from('order_history').insert({
      id: randomUUID(),
      orderId,
      changedBy,
      field,
      oldValue: oldValue !== null && oldValue !== undefined ? String(oldValue) : null,
      newValue: newValue !== null && newValue !== undefined ? String(newValue) : null,
      changeType,
      note,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to log order change:', err);
  }
}

/**
 * DELETE /api/admin/orders/[id]
 * Permanently delete an order. Restricted to owner role.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await verifyAdminSession(request);
  if (!session.valid || !session.admin) {
    return NextResponse.json({ error: 'Unauthorized - Admin session required' }, { status: 401 });
  }
  if (session.admin.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden - Only the owner can delete orders' }, { status: 403 });
  }

  const { id } = params;
  if (!id) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

  try {
    const supabase = getSupabaseAdminClient();

    const { data: order } = await supabase.from('orders').select('id').eq('id', id).maybeSingle();
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Delete in dependency order (invoices have no cascade from orders)
    await supabase.from('invoices').delete().eq('orderId', id);
    await supabase.from('order_history').delete().eq('orderId', id);
    await supabase.from('order_items').delete().eq('orderId', id);
    await supabase.from('orders').delete().eq('id', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/orders/[id]
 * Update naklad (cost) field. Restricted to owner role.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await verifyAdminSession(req);
  if (!session.valid || !session.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.admin.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { naklad } = await req.json();
  const supabase = getSupabaseAdminClient();

  const { data: order, error } = await supabase
    .from('orders')
    .update({ naklad: naklad !== undefined ? parseFloat(naklad) : null, updatedAt: new Date().toISOString() })
    .eq('id', params.id)
    .select('naklad')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to update naklad', details: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, naklad: order.naklad });
}

/**
 * GET /api/admin/orders/[id]
 * Fetch single order with full details and items.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

    const supabase = getSupabaseAdminClient();

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id, orderId, skuId, saleMode, grams, pricePerGram, lineTotal,
          nameSnapshot, ending, assemblyFeeCzk, assemblyFeeTotal, createdAt,
          skus(id, sku, name, shade, shadeName, lengthCm, saleMode, customerCategory)
        ),
        invoices(id, invoiceNumber, status, createdAt, pdfGenerated)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching order:', error.message);
      return NextResponse.json({ error: 'Failed to fetch order', details: error.message }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const transformedOrder = {
      ...order,
      orderStatus: order.orderStatus || 'draft',
      paymentStatus: order.paymentStatus || 'unpaid',
      deliveryStatus: order.deliveryStatus || 'pending',
      channel: order.channel || 'web',
      tags: order.tags ? (typeof order.tags === 'string' ? JSON.parse(order.tags) : order.tags) : [],
      riskScore: order.riskScore || 0,
      items: (order.order_items || []).map((item: any) => ({
        ...item,
        sku: item.skus || null,
      })),
      invoice: (order.invoices && order.invoices.length > 0) ? order.invoices[0] : null,
    };

    return NextResponse.json(transformedOrder, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/orders/[id]
 * Update order status and metadata with stock management and email notifications.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await verifyAdminSession(request);
  if (!session.valid || !session.admin) {
    return NextResponse.json({ error: 'Unauthorized - Admin session required' }, { status: 401 });
  }

  const adminEmail = session.admin.email;

  try {
    const { id } = params;
    const body = await request.json();

    if (!id) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });

    const validOrderStatuses = ['draft', 'pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'];
    const validPaymentStatuses = ['unpaid', 'partial', 'paid', 'refunded'];
    const validDeliveryStatuses = ['pending', 'shipped', 'delivered', 'returned'];

    if (body.orderStatus && !validOrderStatuses.includes(body.orderStatus)) {
      return NextResponse.json(
        { error: `Invalid orderStatus. Must be one of: ${validOrderStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    if (body.paymentStatus && !validPaymentStatuses.includes(body.paymentStatus)) {
      return NextResponse.json(
        { error: `Invalid paymentStatus. Must be one of: ${validPaymentStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    if (body.deliveryStatus && !validDeliveryStatuses.includes(body.deliveryStatus)) {
      return NextResponse.json(
        { error: `Invalid deliveryStatus. Must be one of: ${validDeliveryStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    // Fetch current order with items
    const { data: currentOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          id, skuId, saleMode, grams, pricePerGram, lineTotal,
          nameSnapshot, assemblyFeeTotal,
          skus(id, sku, saleMode, availableGrams, inStock, inStockSince, customerCategory)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Build update data
    const updateData: any = { updatedAt: new Date().toISOString() };

    if (body.orderStatus !== undefined) updateData.orderStatus = body.orderStatus;
    if (body.paymentStatus !== undefined) updateData.paymentStatus = body.paymentStatus;
    if (body.deliveryStatus !== undefined) updateData.deliveryStatus = body.deliveryStatus;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;
    if (body.deliveryMethod !== undefined) updateData.deliveryMethod = body.deliveryMethod;
    if (body.tags !== undefined) updateData.tags = JSON.stringify(body.tags);
    if (body.notesInternal !== undefined) updateData.notesInternal = body.notesInternal;
    if (body.notesCustomer !== undefined) updateData.notesCustomer = body.notesCustomer;
    if (body.riskScore !== undefined) updateData.riskScore = body.riskScore;

    // Automatic workflow: Set orderStatus to 'processing' when payment is marked as 'paid'
    if (body.paymentStatus === 'paid' && currentOrder.paymentStatus !== 'paid') {
      if (currentOrder.orderStatus === 'pending' || currentOrder.orderStatus === 'draft') {
        updateData.orderStatus = 'processing';
      }
    }

    // Automatic workflow: Set orderStatus to 'completed' when delivery is marked as 'delivered'
    if (body.deliveryStatus === 'delivered' && currentOrder.deliveryStatus !== 'delivered') {
      updateData.orderStatus = 'completed';
    }

    if (body.orderStatus || body.paymentStatus || body.deliveryStatus) {
      updateData.lastStatusChangeAt = new Date().toISOString();
    }

    // Stock change flags
    const isChangingToPaid = body.paymentStatus === 'paid' && currentOrder.paymentStatus !== 'paid';
    const isChangingToRefunded = body.paymentStatus === 'refunded' && currentOrder.paymentStatus !== 'refunded';
    const isChangingToCancelled = body.orderStatus === 'cancelled' && currentOrder.orderStatus !== 'cancelled';
    const isChangingToReturned = body.deliveryStatus === 'returned' && currentOrder.deliveryStatus !== 'returned';

    // Log status changes
    if (body.orderStatus !== undefined && body.orderStatus !== currentOrder.orderStatus) {
      await logOrderChange(id, 'orderStatus', currentOrder.orderStatus, body.orderStatus, 'status_change', adminEmail,
        `Status změněn z ${currentOrder.orderStatus} na ${body.orderStatus}`);
    }
    if (body.paymentStatus !== undefined && body.paymentStatus !== currentOrder.paymentStatus) {
      await logOrderChange(id, 'paymentStatus', currentOrder.paymentStatus, body.paymentStatus, 'status_change', adminEmail,
        `Platba změněna z ${currentOrder.paymentStatus} na ${body.paymentStatus}`);
    }
    if (body.deliveryStatus !== undefined && body.deliveryStatus !== currentOrder.deliveryStatus) {
      await logOrderChange(id, 'deliveryStatus', currentOrder.deliveryStatus, body.deliveryStatus, 'status_change', adminEmail,
        `Doručení změněno z ${currentOrder.deliveryStatus} na ${body.deliveryStatus}`);
    }
    if (body.email !== undefined && body.email !== currentOrder.email) {
      await logOrderChange(id, 'email', currentOrder.email, body.email, 'field_update', adminEmail, `Email zákazníka změněn`);
    }
    if (body.notesInternal !== undefined && body.notesInternal !== currentOrder.notesInternal) {
      await logOrderChange(id, 'notesInternal', currentOrder.notesInternal, body.notesInternal, 'note_added', adminEmail,
        `Interní poznámka ${currentOrder.notesInternal ? 'aktualizována' : 'přidána'}`);
    }
    if (body.notesCustomer !== undefined && body.notesCustomer !== currentOrder.notesCustomer) {
      await logOrderChange(id, 'notesCustomer', currentOrder.notesCustomer, body.notesCustomer, 'note_added', adminEmail,
        `Poznámka pro zákazníka ${currentOrder.notesCustomer ? 'aktualizována' : 'přidána'}`);
    }

    // --- Update order ---
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        order_items(
          id, skuId, saleMode, grams, pricePerGram, lineTotal,
          nameSnapshot, assemblyFeeTotal,
          skus(id, sku, name, shadeName, lengthCm, saleMode, availableGrams, inStock, inStockSince, customerCategory)
        )
      `)
      .single();

    if (updateError || !updatedOrder) {
      console.error('Order update error:', updateError?.message);
      return NextResponse.json({ error: 'Failed to update order', details: updateError?.message }, { status: 500 });
    }

    const orderItems = updatedOrder.order_items || [];

    // --- Stock: update movement notes when marking as paid ---
    if (isChangingToPaid) {
      for (const item of orderItems) {
        const sku = item.skus;
        if (!sku) continue;
        await supabase
          .from('stock_movements')
          .update({
            note: sku.saleMode === 'PIECE_BY_WEIGHT'
              ? `Prodáno (objednávka ${id.substring(0, 8)}) - ruční označení`
              : `Prodáno ${item.grams}g (objednávka ${id.substring(0, 8)}) - ruční označení`,
          })
          .eq('refOrderId', id)
          .eq('skuId', item.skuId)
          .ilike('note', '%Rezervace%');
      }

      await logOrderChange(id, 'stock', 'available', 'deducted', 'stock_deduction', adminEmail,
        `Zásoby odečteny při označení jako zaplaceno`);
    }

    // --- Stock: return stock on refund, cancel, or return ---
    if (isChangingToRefunded || isChangingToCancelled || isChangingToReturned) {
      const returnReason = isChangingToRefunded ? 'Refund' : isChangingToReturned ? 'Vrácení zákazníkem' : 'Zrušení';

      for (const item of orderItems) {
        const sku = item.skus;
        if (!sku) continue;

        if (sku.saleMode === 'PIECE_BY_WEIGHT') {
          await supabase.from('skus').update({ soldOut: false, inStock: true, inStockSince: new Date().toISOString() }).eq('id', item.skuId);
          await supabase.from('stock_movements').insert({
            id: randomUUID(),
            skuId: item.skuId,
            type: 'IN',
            grams: item.grams,
            note: `${returnReason} (objednávka ${id.substring(0, 8)}) - vráceno na sklad`,
            refOrderId: id,
            createdAt: new Date().toISOString(),
          });
        } else if (sku.saleMode === 'BULK_G') {
          const newAvailableGrams = (sku.availableGrams || 0) + item.grams;
          await supabase.from('skus').update({
            availableGrams: newAvailableGrams,
            inStock: true,
            inStockSince: newAvailableGrams > 0 ? new Date().toISOString() : sku.inStockSince,
          }).eq('id', item.skuId);
          await supabase.from('stock_movements').insert({
            id: randomUUID(),
            skuId: item.skuId,
            type: 'IN',
            grams: item.grams,
            note: `${returnReason} ${item.grams}g (objednávka ${id.substring(0, 8)}) - vráceno na sklad`,
            refOrderId: id,
            createdAt: new Date().toISOString(),
          });
        }
      }

      const logNote = isChangingToRefunded ? 'Zásoby vráceny při refundu'
        : isChangingToReturned ? 'Zásoby vráceny při fyzickém vrácení'
        : 'Zásoby vráceny při zrušení objednávky';
      await logOrderChange(id, 'stock', 'deducted', 'returned', 'stock_return', adminEmail, logNote);
    }

    // --- Invoice generation when marked as paid ---
    if (isChangingToPaid) {
      try {
        const { sendPaymentConfirmationEmail } = await import('@/lib/email');
        await sendPaymentConfirmationEmail(updatedOrder.email, id, updatedOrder.total);
      } catch (emailError) {
        console.error('Failed to send payment confirmation email:', emailError);
      }

      try {
        const { generateInvoicePDF, generateInvoiceNumber } = await import('@/lib/invoice-generator');
        const { sendInvoiceEmail } = await import('@/lib/email');

        const { data: existingInvoice } = await supabase
          .from('invoices')
          .select('id')
          .eq('orderId', id)
          .maybeSingle();

        if (!existingInvoice) {
          const { data: lastInvoiceRow } = await supabase
            .from('invoices')
            .select('invoiceNumber')
            .order('invoiceNumber', { ascending: false })
            .limit(1)
            .maybeSingle();

          const invoiceNumber = generateInvoiceNumber(lastInvoiceRow?.invoiceNumber);
          const vatRate = 21.0;
          const subtotal = updatedOrder.total / (1 + vatRate / 100);
          const vatAmount = updatedOrder.total - subtotal;
          const invoiceId = randomUUID();
          const now = new Date().toISOString();

          const { data: invoice, error: invoiceError } = await supabase.from('invoices').insert({
            id: invoiceId,
            invoiceNumber,
            orderId: id,
            supplierName: process.env.INVOICE_SUPPLIER_NAME || 'Mùza Hair s.r.o.',
            supplierStreet: process.env.INVOICE_SUPPLIER_STREET,
            supplierCity: process.env.INVOICE_SUPPLIER_CITY,
            supplierZipCode: process.env.INVOICE_SUPPLIER_ZIP,
            supplierCountry: 'CZ',
            supplierIco: process.env.INVOICE_SUPPLIER_ICO,
            supplierDic: process.env.INVOICE_SUPPLIER_DIC,
            supplierEmail: process.env.INVOICE_SUPPLIER_EMAIL || 'info@muzahair.cz',
            supplierPhone: process.env.INVOICE_SUPPLIER_PHONE || '+420 728 722 880',
            customerName: updatedOrder.companyName || `${updatedOrder.firstName} ${updatedOrder.lastName}`,
            customerEmail: updatedOrder.email,
            customerPhone: updatedOrder.phone,
            customerStreet: updatedOrder.billingStreet || updatedOrder.streetAddress,
            customerCity: updatedOrder.billingCity || updatedOrder.city,
            customerZipCode: updatedOrder.billingZipCode || updatedOrder.zipCode,
            customerCountry: updatedOrder.billingCountry || updatedOrder.country,
            customerIco: updatedOrder.ico,
            customerDic: updatedOrder.dic,
            subtotal,
            vatRate,
            vatAmount,
            total: updatedOrder.total,
            paymentMethod: updatedOrder.paymentMethod || 'manual',
            variableSymbol: invoiceNumber,
            bankAccount: process.env.INVOICE_BANK_ACCOUNT,
            iban: process.env.INVOICE_IBAN,
            swift: process.env.INVOICE_SWIFT,
            issueDate: now,
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            taxDate: now,
            paidDate: now,
            status: 'paid',
            pdfGenerated: false,
            createdAt: now,
            updatedAt: now,
          }).select().single();

          if (!invoiceError && invoice) {
            const invoiceData = {
              invoiceNumber: invoice.invoiceNumber,
              issueDate: new Date(invoice.issueDate),
              dueDate: new Date(invoice.dueDate),
              taxDate: new Date(invoice.taxDate),
              orderId: invoice.orderId,
              supplierName: invoice.supplierName,
              supplierStreet: invoice.supplierStreet,
              supplierCity: invoice.supplierCity,
              supplierZipCode: invoice.supplierZipCode,
              supplierCountry: invoice.supplierCountry,
              supplierIco: invoice.supplierIco,
              supplierDic: invoice.supplierDic,
              supplierEmail: invoice.supplierEmail,
              supplierPhone: invoice.supplierPhone,
              customerName: invoice.customerName,
              customerEmail: invoice.customerEmail,
              customerPhone: invoice.customerPhone,
              customerStreet: invoice.customerStreet,
              customerCity: invoice.customerCity,
              customerZipCode: invoice.customerZipCode,
              customerCountry: invoice.customerCountry,
              customerIco: invoice.customerIco,
              customerDic: invoice.customerDic,
              items: orderItems.map((item: any) => ({
                name: (item.nameSnapshot && item.nameSnapshot !== 'undefined')
                  ? item.nameSnapshot
                  : buildSkuDisplayName({ name: item.skus?.name ?? null, sku: item.skus?.sku ?? item.skuId, customerCategory: item.skus?.customerCategory ?? null, shade: item.skus?.shade ?? null }),
                quantity: item.saleMode === 'BULK_G' ? `${item.grams}g` : '1',
                unitPrice: item.pricePerGram,
                total: item.lineTotal + (item.assemblyFeeTotal || 0),
              })),
              subtotal: invoice.subtotal,
              vatRate: invoice.vatRate,
              vatAmount: invoice.vatAmount,
              total: invoice.total,
              paymentMethod: invoice.paymentMethod,
              variableSymbol: invoice.variableSymbol,
              bankAccount: invoice.bankAccount,
              iban: invoice.iban,
              swift: invoice.swift,
            };

            const pdfBase64 = generateInvoicePDF(invoiceData);
            await supabase.from('invoices').update({ pdfGenerated: true }).eq('id', invoice.id);
            sendInvoiceEmail(updatedOrder.email, invoiceNumber, pdfBase64).catch((err) => {
              console.error('Failed to send invoice email:', err);
            });
            console.log(`Invoice ${invoiceNumber} generated for order ${id}`);
          }
        }
      } catch (invoiceError) {
        console.error('Failed to generate invoice (non-critical):', invoiceError);
      }
    }

    // --- Delivery/completion emails ---
    const isChangingToDelivered = body.deliveryStatus === 'delivered' && currentOrder.deliveryStatus !== 'delivered';
    const isChangingToCompleted = body.orderStatus === 'completed' && currentOrder.orderStatus !== 'completed';
    if (isChangingToDelivered || isChangingToCompleted) {
      try {
        const { sendDeliveryConfirmationEmail } = await import('@/lib/email');
        await sendDeliveryConfirmationEmail(updatedOrder.email, id);
      } catch (emailError) {
        console.error('Failed to send delivery confirmation email:', emailError);
      }
    }

    // --- Shipping notification email ---
    const isChangingToShipped = body.deliveryStatus === 'shipped' && currentOrder.deliveryStatus !== 'shipped';
    if (isChangingToShipped) {
      try {
        const { sendShippingNotificationEmail } = await import('@/lib/email');
        await sendShippingNotificationEmail(
          updatedOrder.email, id,
          updatedOrder.trackingNumber || undefined,
          updatedOrder.carrier || undefined
        );
      } catch (emailError) {
        console.error('Failed to send shipping notification email:', emailError);
      }
    }

    // --- Cancellation/refund/return emails and Fakturoid cancel ---
    if (isChangingToCancelled || isChangingToRefunded || isChangingToReturned) {
      try {
        const { sendOrderCancellationEmail } = await import('@/lib/email');
        const reason = isChangingToRefunded ? 'Vrácení platby' : isChangingToReturned ? 'Přijetí vráceného zboží' : 'Zrušení objednávky';
        await sendOrderCancellationEmail(updatedOrder.email, id, reason);
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
      }

      if (currentOrder.fakturoidInvoiceId) {
        try {
          const { cancelInvoice } = await import('@/lib/fakturoid');
          const result = await cancelInvoice(Number(currentOrder.fakturoidInvoiceId));
          if (!result.success) console.warn('Fakturoid cancel warning:', result.message);
        } catch (fakturoidError) {
          console.error('Fakturoid cancel error (non-blocking):', fakturoidError);
        }
      }
    }

    const transformedOrder = {
      ...updatedOrder,
      orderStatus: updatedOrder.orderStatus || 'draft',
      paymentStatus: updatedOrder.paymentStatus || 'unpaid',
      deliveryStatus: updatedOrder.deliveryStatus || 'pending',
      channel: updatedOrder.channel || 'web',
      tags: updatedOrder.tags ? (typeof updatedOrder.tags === 'string' ? JSON.parse(updatedOrder.tags) : updatedOrder.tags) : [],
      riskScore: updatedOrder.riskScore || 0,
      items: orderItems.map((item: any) => ({ ...item, sku: item.skus || null })),
    };

    return NextResponse.json(transformedOrder, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
