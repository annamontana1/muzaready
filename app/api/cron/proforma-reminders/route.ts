import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendProformaReminder } from '@/lib/emails/proforma-reminder';
import { cancelInvoice } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// This endpoint is called by a cron job daily at 8:00
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = Date.now();

    // ── 1. Reminder: zálohovky expirují zítra (vytvořeny přesně před 2 dny) ──
    const orders = await prisma.order.findMany({
      where: {
        fakturoidIsProforma: true,
        paymentStatus: 'unpaid',
        orderStatus: { not: 'cancelled' },
        createdAt: {
          gte: new Date(now - 2 * 24 * 60 * 60 * 1000),
          lte: new Date(now - 1 * 24 * 60 * 60 * 1000),
        },
      },
    });

    let reminded = 0;
    for (const order of orders) {
      if (!order.email || !order.fakturoidInvoiceUrl) continue;
      const dueDate = new Date(order.createdAt);
      dueDate.setDate(dueDate.getDate() + 3);
      await sendProformaReminder({
        customerEmail: order.email,
        customerName: `${order.firstName} ${order.lastName}`,
        invoiceNumber: order.fakturoidInvoiceNum || '',
        amount: order.total,
        dueDate,
        invoiceUrl: order.fakturoidInvoiceUrl,
      });
      reminded++;
    }

    // ── 2. Auto-storno: zálohovky starší 3+ dnů, stále nezaplacené ──
    const expiredOrders = await prisma.order.findMany({
      where: {
        fakturoidIsProforma: true,
        paymentStatus: 'unpaid',
        orderStatus: { not: 'cancelled' },
        createdAt: { lte: new Date(now - 3 * 24 * 60 * 60 * 1000) },
      },
    });

    let cancelled = 0;
    for (const order of expiredOrders) {
      // Stornovat objednávku v adminu
      await prisma.order.update({
        where: { id: order.id },
        data: { orderStatus: 'cancelled', lastStatusChangeAt: new Date() },
      });

      // Stornovat ve Fakturoidu
      if (order.fakturoidInvoiceId) {
        try {
          await cancelInvoice(Number(order.fakturoidInvoiceId));
        } catch (e) {
          console.error(`Fakturoid cancel failed for order ${order.id}:`, e);
        }
      }

      // Email zákazníkovi
      try {
        const { sendOrderCancellationEmail } = await import('@/lib/email');
        await sendOrderCancellationEmail(order.email, order.id, 'Zálohovka vypršela bez zaplacení');
      } catch (e) {
        console.error(`Cancel email failed for order ${order.id}:`, e);
      }

      cancelled++;
    }

    return NextResponse.json({ success: true, reminded, cancelled });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
