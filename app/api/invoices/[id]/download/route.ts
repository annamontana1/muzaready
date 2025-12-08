import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { generateInvoicePDF } from '@/lib/invoice-generator';
export const runtime = 'nodejs';

/**
 * GET /api/invoices/[id]/download
 * Download invoice PDF
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    // Fetch invoice with order
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            items: {
              include: {
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

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

      items: invoice.order.items.map((item: any) => ({
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

    // Return PDF directly
    return new NextResponse(pdfBase64, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Download invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to download invoice', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
