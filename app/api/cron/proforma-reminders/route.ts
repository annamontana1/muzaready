import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendProformaReminder } from '@/lib/emails/proforma-reminder';
import { cancelInvoice } from '@/lib/fakturoid';
import { BANK_TRANSFER_DUE_DAYS, customerEmailOf } from '@/lib/order-invoice';

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
    const DAY = 24 * 60 * 60 * 1000;

    // Nezaplacené doklady k úhradě převodem: běžné faktury (Instagram, prodej
    // z adminu) i starší zálohovky. Splatnost BANK_TRANSFER_DUE_DAYS dní.
    const awaitingPayment = {
      fakturoidInvoiceId: { not: null },
      paymentStatus: 'unpaid',
      orderStatus: { not: 'cancelled' },
      OR: [{ fakturoidIsProforma: true }, { paymentMethod: 'bank_transfer' }],
    };

    // ── 1. Připomínka: splatnost je zítra ──
    const orders = await prisma.order.findMany({
      where: {
        ...awaitingPayment,
        createdAt: {
          gte: new Date(now - (BANK_TRANSFER_DUE_DAYS - 1) * DAY),
          lte: new Date(now - (BANK_TRANSFER_DUE_DAYS - 2) * DAY),
        },
      },
    });

    let reminded = 0;
    for (const order of orders) {
      const reminderEmail = customerEmailOf(order);
      if (!reminderEmail || !order.fakturoidInvoiceUrl) continue;
      const dueDate = new Date(order.createdAt);
      dueDate.setDate(dueDate.getDate() + BANK_TRANSFER_DUE_DAYS);
      await sendProformaReminder({
        customerEmail: reminderEmail,
        customerName: `${order.firstName} ${order.lastName}`,
        invoiceNumber: order.fakturoidInvoiceNum || '',
        amount: order.total,
        dueDate,
        invoiceUrl: order.fakturoidInvoiceUrl,
      });
      reminded++;
    }

    // ── 2. Auto-storno: den po splatnosti a stále nezaplaceno ──
    const expiredOrders = await prisma.order.findMany({
      where: {
        ...awaitingPayment,
        createdAt: { lte: new Date(now - (BANK_TRANSFER_DUE_DAYS + 1) * DAY) },
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

      // Email zákazníkovi (objednávky bez e-mailu jsou uložené na adresu prodejny — tam neposílat)
      const cancelEmail = customerEmailOf(order);
      if (cancelEmail) {
        try {
          const { sendOrderCancellationEmail } = await import('@/lib/email');
          await sendOrderCancellationEmail(cancelEmail, order.id, 'Faktura nebyla uhrazena ve lhůtě splatnosti');
        } catch (e) {
          console.error(`Cancel email failed for order ${order.id}:`, e);
        }
      }

      cancelled++;
    }

    return NextResponse.json({ success: true, reminded, cancelled });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
