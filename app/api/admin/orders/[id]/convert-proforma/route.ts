import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { convertProformaToInvoice } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/orders/[id]/convert-proforma
 * Convert a Fakturoid proforma invoice to a final invoice.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (!order.fakturoidInvoiceId || !order.fakturoidIsProforma) {
      return NextResponse.json({ error: 'Order nemá proformu' }, { status: 400 });
    }

    const result = await convertProformaToInvoice(Number(order.fakturoidInvoiceId));
    if (!result.success) {
      return NextResponse.json({ error: 'Nepodařilo se převést proformu na fakturu' }, { status: 500 });
    }

    // Update order - mark as no longer proforma
    await prisma.order.update({
      where: { id },
      data: {
        fakturoidIsProforma: false,
        fakturoidInvoiceUrl: result.invoiceUrl || order.fakturoidInvoiceUrl,
        fakturoidInvoiceNum: result.invoiceNumber || order.fakturoidInvoiceNum,
      },
    });

    return NextResponse.json({
      success: true,
      invoiceUrl: result.invoiceUrl,
      invoiceNumber: result.invoiceNumber,
    });
  } catch (error: any) {
    console.error('Convert proforma error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
