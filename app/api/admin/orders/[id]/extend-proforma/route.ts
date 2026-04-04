import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { updateInvoiceDueDate, sendInvoiceByEmail } from '@/lib/fakturoid';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { dueDateIso } = await request.json();
    if (!dueDateIso) return NextResponse.json({ error: 'Chybí datum splatnosti' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });
    if (!order.fakturoidInvoiceId) return NextResponse.json({ error: 'Objednávka nemá proformu ve Fakturoidu' }, { status: 400 });

    const invoiceId = Number(order.fakturoidInvoiceId);

    // Update due date in Fakturoid
    await updateInvoiceDueDate(invoiceId, dueDateIso);

    // Restore order status
    await prisma.order.update({
      where: { id: params.id },
      data: { orderStatus: 'pending', paymentStatus: 'unpaid', updatedAt: new Date() },
    });

    // Send updated proforma email
    if (order.email) {
      await sendInvoiceByEmail(invoiceId, order.email);
    }

    return NextResponse.json({ success: true, message: `Splatnost prodloužena do ${dueDateIso} a proforma odeslána na email ✓` });
  } catch (err: any) {
    console.error('extend-proforma error:', err);
    return NextResponse.json({ error: err.message || 'Chyba' }, { status: 500 });
  }
}
