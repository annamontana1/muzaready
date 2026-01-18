import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { GoPayNotificationSchema } from '@/lib/validation/orders';
import crypto from 'crypto';
export const runtime = 'nodejs';

/**
 * Verify GoPay webhook signature to prevent fake payment notifications
 * GoPay sends X-Signature header with HMAC-SHA256 signature
 */
function verifyGoPaySignature(payload: string, signature: string | null): boolean {
  if (!signature) return false;

  const secret = process.env.GOPAY_CLIENT_SECRET;
  if (!secret) {
    console.error('GOPAY_CLIENT_SECRET not configured');
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * GoPay Payment Confirmation Webhook Endpoint
 *
 * This endpoint is called by GoPay after successful payment.
 * It performs stock deduction and marks the order as paid.
 *
 * Request body from GoPay includes:
 * - orderId: The GoPay payment ID (our Order.id)
 * - state: 'PAID' | 'FAILED' | etc
 * - amount: Total amount paid
 * - paymentId: GoPay's internal payment ID
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('X-Signature');

    // Verify request is actually from GoPay
    if (!verifyGoPaySignature(rawBody, signature)) {
      console.error('GoPay webhook signature verification failed');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);

    // Validate webhook payload
    const validation = GoPayNotificationSchema.safeParse(body);
    if (!validation.success) {
      console.error('Invalid GoPay webhook payload:', validation.error);
      return NextResponse.json(
        {
          error: 'Invalid webhook payload',
          details: validation.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { orderId, state, paymentId } = validation.data;

    // Only process PAID notifications
    if (state !== 'PAID') {
      console.log(`GoPay notification: order ${orderId} state=${state} (ignoring)`);
      return NextResponse.json(
        { success: true, message: 'Notification received but not PAID' },
        { status: 200 }
      );
    }

    // Use a transaction to atomically update order status
    // NOTE: Stock was already reserved/deducted at order creation time
    // This webhook only confirms payment and updates status
    const result = await prisma.$transaction(async (tx) => {
      // Fetch order with lock to prevent concurrent processing
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              sku: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // Prevent double-processing: if order is already paid, return success
      if (order.paymentStatus === 'paid') {
        console.log(`Order ${orderId} already paid (idempotent)`);
        return order;
      }

      // Update order and payment status to 'paid'
      // Automatic workflow: Set orderStatus to 'processing' when payment is confirmed
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: order.orderStatus === 'pending' || order.orderStatus === 'draft' ? 'processing' : order.orderStatus,
          paymentStatus: 'paid',
          updatedAt: new Date(),
        },
        include: {
          items: {
            include: {
              sku: true,
            },
          },
        },
      });

      // Update stock movements from "Rezervace" to "Prodáno"
      for (const item of updatedOrder.items) {
        await tx.stockMovement.updateMany({
          where: {
            refOrderId: orderId,
            skuId: item.skuId,
            note: { contains: 'Rezervace' },
          },
          data: {
            note: item.sku.saleMode === 'PIECE_BY_WEIGHT'
              ? `Prodáno (objednávka ${orderId.substring(0, 8)})`
              : `Prodáno ${item.grams}g (objednávka ${orderId.substring(0, 8)})`,
          },
        });
      }

      return updatedOrder;
    });

    console.log(`✅ Order ${orderId} paid and stock deducted`);

    // Send payment confirmation email
    try {
      const { sendPaymentConfirmationEmail } = await import('@/lib/email');
      await sendPaymentConfirmationEmail(result.email, orderId, result.total);
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
      // Don't fail the payment processing if email fails
    }

    // Generate invoice automatically after successful payment
    try {
      const { generateInvoicePDF, generateInvoiceNumber } = await import('@/lib/invoice-generator');
      const { sendInvoiceEmail } = await import('@/lib/email');

      // Check if invoice already exists
      const existingInvoice = await prisma.invoice.findUnique({
        where: { orderId },
      });

      if (!existingInvoice) {
        // Get last invoice number
        const lastInvoice = await prisma.invoice.findFirst({
          orderBy: { invoiceNumber: 'desc' },
          select: { invoiceNumber: true },
        });

        const invoiceNumber = generateInvoiceNumber(lastInvoice?.invoiceNumber);

        // Calculate VAT
        const vatRate = 21.0;
        const subtotal = result.total / (1 + vatRate / 100);
        const vatAmount = result.total - subtotal;

        // Create invoice
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

        // Generate and send PDF invoice
        const invoiceData = {
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
        };

        const pdfBase64 = generateInvoicePDF(invoiceData);

        // Update invoice with PDF status
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: { pdfGenerated: true },
        });

        // Send invoice email (async, don't wait)
        sendInvoiceEmail(result.email, invoiceNumber, pdfBase64).catch((err) => {
          console.error('Failed to send invoice email:', err);
        });

        console.log(`📄 Invoice ${invoiceNumber} generated and sent for order ${orderId}`);
      } else {
        console.log(`📄 Invoice already exists for order ${orderId}`);
      }
    } catch (invoiceError) {
      console.error('Failed to generate invoice (non-critical):', invoiceError);
      // Don't fail the payment if invoice generation fails
    }

    // Automatically create Zásilkovna shipment if order has pickup point
    const packetaPointId = (result as any).packetaPointId;
    if (packetaPointId && (result as any).deliveryMethod === 'zasilkovna') {
      try {
        const { createPacket } = await import('@/lib/zasilkovna');

        const shipmentResult = await createPacket(
          orderId.substring(0, 12),
          {
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            phone: result.phone || '',
          },
          parseInt(packetaPointId, 10),
          result.total,
          0.5, // Default weight
          0 // No COD for prepaid orders
        );

        if (shipmentResult.success && shipmentResult.barcode) {
          // Update order with tracking info
          await prisma.order.update({
            where: { id: orderId },
            data: {
              deliveryStatus: 'shipped',
              trackingNumber: shipmentResult.barcode,
              carrier: 'zasilkovna',
              shippedAt: new Date(),
            },
          });

          // Send shipping notification email
          try {
            const { sendShippingNotificationEmail } = await import('@/lib/email');
            await sendShippingNotificationEmail(
              result.email,
              orderId,
              shipmentResult.barcode,
              `https://tracking.packeta.com/cs/?id=${shipmentResult.barcode}`
            );
          } catch (shippingEmailError) {
            console.error('Failed to send shipping email:', shippingEmailError);
          }

          console.log(`📦 Zásilkovna shipment auto-created: ${shipmentResult.barcode}`);
        } else {
          console.error('Failed to auto-create Zásilkovna shipment:', shipmentResult.error);
        }
      } catch (zasilkovnaError) {
        console.error('Zásilkovna auto-shipment error (non-critical):', zasilkovnaError);
        // Don't fail the payment if Zásilkovna fails - admin can create manually
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Payment confirmed and stock deducted',
        orderId,
        orderStatus: result.orderStatus,
        paymentStatus: result.paymentStatus,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GoPay notification error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment confirmation' },
      { status: 500 }
    );
  }
}