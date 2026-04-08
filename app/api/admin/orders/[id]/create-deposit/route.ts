import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { createInvoiceFromOrder, isFakturoidConfigured } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/orders/[id]/create-deposit
 * Vytvoří zálohovou proformu na zadanou částku (ne nutně celková cena objednávky).
 * Body: { amount: number, note?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const amount = Number(body.amount);
    const note = body.note as string | undefined;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Zadejte platnou částku' }, { status: 400 });
    }

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

    const label = note
      ? `Záloha — ${note}`
      : `Záloha na objednávku ${order.id.substring(0, 8).toUpperCase()}`;

    const result = await createInvoiceFromOrder({
      orderId: order.id,
      customerName: `${order.firstName ?? ''} ${order.lastName ?? ''}`.trim() || 'Zákazník',
      customerEmail: order.email ?? undefined,
      customerPhone: order.phone ?? undefined,
      customerStreet: order.streetAddress ?? undefined,
      customerCity: order.city ?? undefined,
      customerZip: order.zipCode ?? undefined,
      items: [{ name: label, quantity: 1, unitPrice: amount, unit: 'ks' }],
      shippingPrice: 0,
      paymentMethod: order.paymentMethod ?? 'bank_transfer',
      isPaid: false,
      proforma: true, // vždy proforma (záloha)
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Nepodařilo se vytvořit zálohu' }, { status: 500 });
    }

    // Ulož Fakturoid ID do objednávky
    await prisma.order.update({
      where: { id },
      data: {
        fakturoidInvoiceId: result.invoiceId ? String(result.invoiceId) : undefined,
        fakturoidIsProforma: true,
        fakturoidInvoiceUrl: result.invoiceUrl ?? undefined,
        fakturoidInvoiceNum: result.invoiceNumber ?? undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Zálohová faktura ${result.invoiceNumber || ''} na ${amount.toLocaleString('cs-CZ')} Kč vytvořena a odeslána`,
      invoiceId: result.invoiceId,
      invoiceNumber: result.invoiceNumber,
      invoiceUrl: result.invoiceUrl,
    });
  } catch (error: any) {
    console.error('create-deposit error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
