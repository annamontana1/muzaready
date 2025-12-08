import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { generateInvoicePDF, generateInvoiceNumber } from '@/lib/invoice-generator';
import { sendInvoiceEmail } from '@/lib/email';
export const runtime = 'nodejs';

/**
 * POST /api/invoices/generate
 * Generate invoice for an order (after payment)
 *
 * Body: { orderId: string }
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            sku: true,
          },
        },
        invoice: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if invoice already exists
    if (order.invoice) {
      return NextResponse.json(
        {
          error: 'Invoice already exists for this order',
          invoice: order.invoice,
        },
        { status: 400 }
      );
    }

    // Get last invoice number to generate new one
    const lastInvoice = await prisma.invoice.findFirst({
      orderBy: { invoiceNumber: 'desc' },
      select: { invoiceNumber: true },
    });

    const invoiceNumber = generateInvoiceNumber(lastInvoice?.invoiceNumber);

    // Calculate VAT (21%)
    const vatRate = 21.0;
    const subtotal = order.total / (1 + vatRate / 100); // reverse calculate
    const vatAmount = order.total - subtotal;

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: order.id,

        // Supplier info (will be configured via env vars or settings)
        supplierName: process.env.INVOICE_SUPPLIER_NAME || 'Mùza Hair s.r.o.',
        supplierStreet: process.env.INVOICE_SUPPLIER_STREET,
        supplierCity: process.env.INVOICE_SUPPLIER_CITY,
        supplierZipCode: process.env.INVOICE_SUPPLIER_ZIP,
        supplierCountry: 'CZ',
        supplierIco: process.env.INVOICE_SUPPLIER_ICO,
        supplierDic: process.env.INVOICE_SUPPLIER_DIC,
        supplierEmail: process.env.INVOICE_SUPPLIER_EMAIL || 'info@muzahair.cz',
        supplierPhone: process.env.INVOICE_SUPPLIER_PHONE || '+420 728 722 880',

        // Customer info
        customerName: order.companyName || `${order.firstName} ${order.lastName}`,
        customerEmail: order.email,
        customerPhone: order.phone,
        customerStreet: order.billingStreet || order.streetAddress,
        customerCity: order.billingCity || order.city,
        customerZipCode: order.billingZipCode || order.zipCode,
        customerCountry: order.billingCountry || order.country,
        customerIco: order.ico,
        customerDic: order.dic,

        // Amounts
        subtotal,
        vatRate,
        vatAmount,
        total: order.total,

        // Payment
        paymentMethod: order.paymentMethod,
        variableSymbol: invoiceNumber, // Use invoice number as VS
        bankAccount: process.env.INVOICE_BANK_ACCOUNT,
        iban: process.env.INVOICE_IBAN,
        swift: process.env.INVOICE_SWIFT,

        // Dates
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        taxDate: order.paidAt || new Date(),
        paidDate: order.paidAt,

        // Status
        status: order.paymentStatus === 'paid' ? 'paid' : 'issued',
      },
    });

    // Generate PDF
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

      items: order.items.map(item => ({
        name: item.nameSnapshot || item.sku.name || 'Product',
        quantity: item.grams / 100, // convert grams to displayable quantity
        unitPrice: item.pricePerGram * 100, // price per 100g
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
      data: {
        pdfGenerated: true,
        // TODO: Upload PDF to storage and save URL
        // pdfUrl: uploadedUrl,
      },
    });

    // Send invoice email (async, don't wait)
    if (order.email) {
      sendInvoiceEmail(order.email, invoiceNumber, pdfBase64).catch((err) => {
        console.error('Failed to send invoice email:', err);
      });
    }

    return NextResponse.json(
      {
        success: true,
        invoice,
        pdfBase64, // Return PDF for download/display
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Generate invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
