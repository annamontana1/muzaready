import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { isFakturoidConfigured } from '@/lib/fakturoid';
import { createFakturoidInvoiceForOrder, customerEmailOf } from '@/lib/order-invoice';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/orders/[id]/resend-invoice
 * Vystaví běžnou fakturu ve Fakturoidu z položek objednávky a pošle ji zákazníkovi.
 * (Stejná logika jako při vytvoření prodeje — lib/order-invoice.ts.)
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
      return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });
    }

    if (!isFakturoidConfigured()) {
      return NextResponse.json({ error: 'Fakturoid není nakonfigurován' }, { status: 500 });
    }

    const result = await createFakturoidInvoiceForOrder(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Nepodařilo se vytvořit fakturu' }, { status: 500 });
    }

    const email = customerEmailOf(order);
    const delivery = result.emailSent
      ? `a odeslána na ${email}`
      : email
        ? '— e-mail se nepodařilo odeslat, pošlete zákazníkovi odkaz ručně'
        : '— zákazník nemá e-mail, pošlete mu odkaz ručně';

    return NextResponse.json({
      success: true,
      message: `Faktura ${result.invoiceNumber || ''} byla vytvořena ${delivery}`,
      invoiceId: result.invoiceId,
      invoiceNumber: result.invoiceNumber,
      invoiceUrl: result.invoiceUrl,
      emailSent: !!result.emailSent,
    });
  } catch (error: any) {
    console.error('Resend invoice error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
