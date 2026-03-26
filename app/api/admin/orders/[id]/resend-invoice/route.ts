import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { createInvoiceFromOrder, isFakturoidConfigured, sendInvoiceByEmail } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/orders/[id]/resend-invoice
 * Resend or create invoice for an order
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { sku: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });
    }

    if (!isFakturoidConfigured()) {
      return NextResponse.json({ error: 'Fakturoid není nakonfigurován' }, { status: 500 });
    }

    // Build items for invoice
    const invoiceItems = order.items.length > 0
      ? order.items.map((item) => ({
          name: item.nameSnapshot || `Položka`,
          quantity: 1,
          unitPrice: Number(item.lineTotal) || 0,
          unit: 'ks',
        }))
      : [{
          name: `Objednávka ${order.id.substring(0, 8)}`,
          quantity: 1,
          unitPrice: Number(order.total),
          unit: 'ks',
        }];

    const isInstagram = order.channel === 'instagram';

    const result = await createInvoiceFromOrder({
      orderId: order.id,
      customerName: `${order.firstName} ${order.lastName}`.trim(),
      customerEmail: order.email,
      customerPhone: order.phone || undefined,
      customerStreet: order.streetAddress || undefined,
      customerCity: order.city || undefined,
      customerZip: order.zipCode || undefined,
      items: invoiceItems,
      shippingPrice: Number(order.shippingCost) || 0,
      shippingName: 'Doprava',
      paymentMethod: order.paymentMethod || 'bank_transfer',
      isPaid: order.paymentStatus === 'paid',
      proforma: isInstagram, // proforma for Instagram orders
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Faktura ${result.invoiceNumber || ''} byla vytvořena a odeslána na ${order.email}`,
        invoiceId: result.invoiceId,
        invoiceNumber: result.invoiceNumber,
      });
    } else {
      return NextResponse.json({ error: result.error || 'Nepodařilo se vytvořit fakturu' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Resend invoice error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
