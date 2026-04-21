import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getGoPayBaseUrl, getGoPayAccessToken } from '@/lib/gopay';

export const runtime = 'nodejs';

/**
 * GoPay Webhook (Notification) Endpoint
 *
 * GoPay sends GET or POST with payment ID when payment status changes.
 * We verify by calling GoPay status API — never trust the webhook payload alone.
 *
 * GET:  /api/gopay/notify?id=<paymentId>&parent_id=<parentId>
 * POST: application/x-www-form-urlencoded body with `id` parameter
 *
 * GoPay REQUIRES HTTP 200 response — on any internal error we still return 200
 * and log the error so GoPay doesn't keep retrying with a broken request.
 */

async function handleNotification(gopayPaymentId: string | null): Promise<NextResponse> {
  if (!gopayPaymentId) {
    console.error('GoPay webhook: missing payment id');
    // Return 200 so GoPay stops retrying — this is a misconfigured notification URL
    return NextResponse.json({ success: true, message: 'No payment id' }, { status: 200 });
  }

  console.log(`GoPay webhook received for payment ${gopayPaymentId}`);

  try {
    // Verify payment status by calling GoPay API directly
    const accessToken = await getGoPayAccessToken('payment-all');
    const baseUrl = getGoPayBaseUrl();

    const statusResponse = await fetch(`${baseUrl}/api/payments/payment/${gopayPaymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error(`GoPay status API error (${statusResponse.status}): ${errorText}`);
      // Return 200 anyway so GoPay doesn't flood with retries
      return NextResponse.json({ success: true, message: 'Notification received' }, { status: 200 });
    }

    const paymentData = await statusResponse.json();
    const { state, order_number: orderId } = paymentData;

    console.log(`GoPay payment ${gopayPaymentId}: state=${state}, order=${orderId}`);

    // Only process PAID state — for all other states just acknowledge
    if (state !== 'PAID') {
      console.log(`GoPay payment ${gopayPaymentId} state=${state} (not PAID, skipping)`);
      return NextResponse.json({ success: true, message: `Notification received, state=${state}` });
    }

    // Process payment confirmation in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          OR: [
            { gopayPaymentId: String(gopayPaymentId) },
            { id: orderId },
          ],
        },
        include: { items: { include: { sku: true } } },
      });

      if (!order) {
        throw new Error(`Order not found for GoPay payment ${gopayPaymentId} / order ${orderId}`);
      }

      // Idempotence: skip if already paid
      if (order.paymentStatus === 'paid') {
        console.log(`Order ${order.id} already paid (idempotent)`);
        return order;
      }

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus:
            order.orderStatus === 'pending' || order.orderStatus === 'draft'
              ? 'processing'
              : order.orderStatus,
          paymentStatus: 'paid',
          paidAt: new Date(),
          gopayPaymentId: String(gopayPaymentId),
          updatedAt: new Date(),
        },
        include: { items: { include: { sku: true } } },
      });

      // Update stock movements from "Rezervace" to "Prodáno"
      for (const item of updatedOrder.items) {
        await tx.stockMovement.updateMany({
          where: {
            refOrderId: order.id,
            skuId: item.skuId,
            note: { contains: 'Rezervace' },
          },
          data: {
            note:
              item.sku.saleMode === 'PIECE_BY_WEIGHT'
                ? `Prodáno (objednávka ${order.id.substring(0, 8)})`
                : `Prodáno ${item.grams}g (objednávka ${order.id.substring(0, 8)})`,
          },
        });
      }

      return updatedOrder;
    });

    console.log(`Order ${result.id} payment confirmed`);

    // ── Non-critical side effects (failures don't affect HTTP 200 response) ──

    // Meta Ads conversion tracking
    try {
      const { trackServerSidePurchase } = await import('@/lib/marketing/meta-conversions');
      await trackServerSidePurchase({
        orderId: result.id,
        email: result.email,
        phone: result.phone || undefined,
        firstName: result.firstName || undefined,
        lastName: result.lastName || undefined,
        city: result.city || undefined,
        zipCode: result.zipCode || undefined,
        country: result.country || undefined,
        value: result.total,
        currency: 'CZK',
        numItems: result.items.length,
        productIds: result.items.map((item: any) => item.skuId),
      });
    } catch (e) {
      console.error('Meta conversion tracking failed (non-critical):', e);
    }

    // Payment confirmation email
    try {
      const { sendPaymentConfirmationEmail } = await import('@/lib/email');
      await sendPaymentConfirmationEmail(result.email, result.id, result.total);
    } catch (e) {
      console.error('Payment confirmation email failed (non-critical):', e);
    }

    // Invoice generation (PDF + Fakturoid)
    try {
      const { generateInvoicePDF, generateInvoiceNumber } = await import('@/lib/invoice-generator');
      const { sendInvoiceEmail } = await import('@/lib/email');

      const existingInvoice = await prisma.invoice.findUnique({ where: { orderId: result.id } });

      if (!existingInvoice) {
        const lastInvoice = await prisma.invoice.findFirst({
          orderBy: { invoiceNumber: 'desc' },
          select: { invoiceNumber: true },
        });
        const invoiceNumber = generateInvoiceNumber(lastInvoice?.invoiceNumber);
        const vatRate = 21.0;
        const subtotal = result.total / (1 + vatRate / 100);
        const vatAmount = result.total - subtotal;

        const invoice = await prisma.invoice.create({
          data: {
            invoiceNumber,
            orderId: result.id,
            supplierName: process.env.INVOICE_SUPPLIER_NAME || 'Mùza Hair s.r.o.',
            supplierStreet: process.env.INVOICE_SUPPLIER_STREET,
            supplierCity: process.env.INVOICE_SUPPLIER_CITY,
            supplierZipCode: process.env.INVOICE_SUPPLIER_ZIP,
            supplierCountry: 'CZ',
            supplierIco: process.env.INVOICE_SUPPLIER_ICO,
            supplierDic: process.env.INVOICE_SUPPLIER_DIC,
            supplierEmail: process.env.INVOICE_SUPPLIER_EMAIL || 'info@muzahair.cz',
            supplierPhone: process.env.INVOICE_SUPPLIER_PHONE || '+420 728 722 880',
            customerName: result.companyName || `${result.firstName} ${result.lastName}`,
            customerEmail: result.email,
            customerPhone: result.phone,
            customerStreet: result.billingStreet || result.streetAddress,
            customerCity: result.billingCity || result.city,
            customerZipCode: result.billingZipCode || result.zipCode,
            customerCountry: result.billingCountry || result.country,
            customerIco: result.ico,
            customerDic: result.dic,
            subtotal,
            vatRate,
            vatAmount,
            total: result.total,
            paymentMethod: 'gopay',
            variableSymbol: invoiceNumber,
            bankAccount: process.env.INVOICE_BANK_ACCOUNT,
            iban: process.env.INVOICE_IBAN,
            swift: process.env.INVOICE_SWIFT,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            taxDate: new Date(),
            paidDate: new Date(),
            status: 'paid',
          },
        });

        const pdfBase64 = generateInvoicePDF({
          invoiceNumber: invoice.invoiceNumber,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          taxDate: invoice.taxDate,
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
          items: result.items.map((item: any) => ({
            name: item.nameSnapshot || item.sku?.name || 'Product',
            quantity: item.grams / 100,
            unitPrice: item.pricePerGram * 100,
            total: item.lineTotal,
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
        });

        await prisma.invoice.update({ where: { id: invoice.id }, data: { pdfGenerated: true } });

        sendInvoiceEmail(result.email, invoiceNumber, pdfBase64).catch((err) => {
          console.error('Invoice email failed:', err);
        });

        console.log(`Invoice ${invoiceNumber} generated for order ${result.id}`);
      }
    } catch (e) {
      console.error('Invoice generation failed (non-critical):', e);
    }

    // Fakturoid
    try {
      const { createInvoiceFromOrder, isFakturoidConfigured } = await import('@/lib/fakturoid');
      if (isFakturoidConfigured()) {
        const fakturoidResult = await createInvoiceFromOrder({
          orderId: result.id.substring(0, 12),
          customerName:
            result.companyName || `${result.firstName || ''} ${result.lastName || ''}`.trim(),
          customerEmail: result.email,
          customerPhone: result.phone || undefined,
          customerStreet: result.billingStreet || result.streetAddress || undefined,
          customerCity: result.billingCity || result.city || undefined,
          customerZip: result.billingZipCode || result.zipCode || undefined,
          customerCountry: result.billingCountry || result.country || 'CZ',
          customerIco: result.ico || undefined,
          customerDic: result.dic || undefined,
          items: result.items.map((item: any) => ({
            name: item.sku?.name || item.skuId,
            quantity: item.quantity || 1,
            unitPrice: item.totalPrice || item.grams * (item.sku?.pricePerGramCzk || 0),
            unit: item.sku?.saleMode === 'PIECE_BY_WEIGHT' ? 'ks' : 'g',
          })),
          shippingPrice: result.shippingPrice || 0,
          shippingName: result.deliveryMethod || 'Doprava',
          paymentMethod: 'gopay',
          isPaid: true,
        });
        if (fakturoidResult.success) {
          console.log(`Fakturoid invoice ${fakturoidResult.invoiceNumber} created for order ${result.id}`);
        } else {
          console.error('Fakturoid invoice failed:', fakturoidResult.error);
        }
      }
    } catch (e) {
      console.error('Fakturoid integration failed (non-critical):', e);
    }

    // Auto-create Zásilkovna shipment
    const packetaPointId = (result as any).packetaPointId;
    if (packetaPointId && (result as any).deliveryMethod === 'zasilkovna') {
      try {
        const { createPacket } = await import('@/lib/zasilkovna');
        const shipmentResult = await createPacket(
          result.id.substring(0, 12),
          {
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            phone: result.phone || '',
          },
          parseInt(packetaPointId, 10),
          result.total,
          0.5,
          0
        );
        if (shipmentResult.success && shipmentResult.barcode) {
          await prisma.order.update({
            where: { id: result.id },
            data: {
              deliveryStatus: 'shipped',
              trackingNumber: shipmentResult.barcode,
              carrier: 'zasilkovna',
              shippedAt: new Date(),
            },
          });
          try {
            const { sendShippingNotificationEmail } = await import('@/lib/email');
            await sendShippingNotificationEmail(result.email, result.id, shipmentResult.barcode, 'zasilkovna');
          } catch (e) {
            console.error('Shipping notification email failed:', e);
          }
          console.log(`Zásilkovna shipment auto-created: ${shipmentResult.barcode}`);
        }
      } catch (e) {
        console.error('Zásilkovna auto-shipment failed (non-critical):', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed',
      orderId: result.id,
      orderStatus: result.orderStatus,
      paymentStatus: result.paymentStatus,
    });
  } catch (error) {
    console.error('GoPay webhook error:', error);
    // Return 200 so GoPay doesn't keep retrying — internal error is logged
    return NextResponse.json({ success: true, message: 'Notification received' }, { status: 200 });
  }
}

/** GoPay sends GET: /api/gopay/notify?id=<paymentId>&parent_id=<parentId> */
export async function GET(request: NextRequest) {
  const gopayPaymentId = request.nextUrl.searchParams.get('id');
  return handleNotification(gopayPaymentId);
}

/** GoPay may also send POST with application/x-www-form-urlencoded body */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const gopayPaymentId =
    params.get('id') || request.nextUrl.searchParams.get('id');
  return handleNotification(gopayPaymentId);
}
