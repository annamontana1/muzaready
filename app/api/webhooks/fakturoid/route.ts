// Webhook z Fakturoidu — platba spárovaná z banky / faktura po splatnosti.
//
// Nastavení ve Fakturoidu: Nastavení → Webhooky → Přidat webhook
//   URL:     https://muzahair.cz/api/webhooks/fakturoid
//   Události: invoice_paid, invoice_overdue
//   (volitelně) Authorization hlavička = hodnota env FAKTUROID_WEBHOOK_SECRET
//
// Bezpečnost: tělu webhooku se nevěří. Z něj se vezme jen ID dokladu a jeho stav
// se ověří přímo v API Fakturoidu — podvržený požadavek tak nic nezmění.

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cancelInvoice } from '@/lib/fakturoid';
import { customerEmailOf, settleOrderPaid, verifyInvoiceStatus } from '@/lib/order-invoice';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Volitelná kontrola sdíleného tajemství (když je nastavené na obou stranách)
    const secret = process.env.FAKTUROID_WEBHOOK_SECRET;
    if (secret && req.headers.get('authorization') !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // Fakturoid v3: { webhook_id, event_name, created_at, body: { invoice, payment? } }
    // (starší tvar { event, invoice } necháváme pro jistotu taky)
    const event: string = payload?.event_name || payload?.event || '';
    const invoice = payload?.body?.invoice || payload?.invoice;
    const invoiceId = Number(invoice?.id);

    if (!invoiceId || (event !== 'invoice_paid' && event !== 'invoice_overdue')) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    // ── Ověření u Fakturoidu ───────────────────────────────────────────────
    const expected = event === 'invoice_paid' ? 'paid' : 'overdue';
    const verified = await verifyInvoiceStatus(invoiceId, expected);
    if (!verified.ok) {
      console.warn(`Fakturoid webhook ${event} for invoice ${invoiceId} not confirmed by API — ignored`);
      return NextResponse.json({ ok: true, ignored: true });
    }

    const number: string | undefined = verified.invoice?.number;
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { fakturoidInvoiceId: String(invoiceId) },
          ...(number ? [{ fakturoidInvoiceNum: number }] : []),
        ],
      },
    });

    if (!order) {
      // Doklad nepatří k žádné objednávce e-shopu (např. ruční faktura) — nic neděláme
      return NextResponse.json({ ok: true, ignored: true });
    }

    // ── Zaplaceno ──────────────────────────────────────────────────────────
    if (event === 'invoice_paid') {
      const paidOn = verified.invoice?.paid_on ? new Date(verified.invoice.paid_on) : new Date();

      // Atomický přechod na „zaplaceno“ — proběhne jen jednou, i když webhook
      // přijde opakovaně nebo objednávku mezitím odškrtl admin.
      const transition = await prisma.order.updateMany({
        where: { id: order.id, paymentStatus: { not: 'paid' } },
        data: {
          paymentStatus: 'paid',
          paidAt: paidOn,
          ...(order.orderStatus === 'pending' || order.orderStatus === 'draft'
            ? { orderStatus: 'processing' }
            : {}),
          lastStatusChangeAt: new Date(),
        },
      });

      if (transition.count === 1) {
        await prisma.orderHistory.create({
          data: {
            orderId: order.id,
            field: 'paymentStatus',
            oldValue: order.paymentStatus,
            newValue: 'paid',
            changeType: 'status_change',
            note: `Platba spárována ve Fakturoidu (faktura ${number || invoiceId})`,
            changedBy: 'fakturoid',
          },
        });
        await settleOrderPaid(order.id, 'fakturoid');
        console.log(`Order ${order.id} marked as paid via Fakturoid webhook (invoice ${number})`);
      }

      return NextResponse.json({ ok: true });
    }

    // ── Po splatnosti → storno objednávky i faktury ────────────────────────
    const cancelled = await prisma.order.updateMany({
      where: { id: order.id, paymentStatus: 'unpaid', orderStatus: { not: 'cancelled' } },
      data: { orderStatus: 'cancelled', lastStatusChangeAt: new Date() },
    });

    if (cancelled.count === 1) {
      await prisma.orderHistory.create({
        data: {
          orderId: order.id,
          field: 'orderStatus',
          oldValue: order.orderStatus,
          newValue: 'cancelled',
          changeType: 'status_change',
          note: `Faktura ${number || invoiceId} nebyla uhrazena ve splatnosti — objednávka stornována`,
          changedBy: 'fakturoid',
        },
      });

      try {
        await cancelInvoice(invoiceId);
      } catch (e) {
        console.error('Fakturoid cancel error:', e);
      }

      const email = customerEmailOf(order);
      if (email) {
        try {
          const { sendOrderCancellationEmail } = await import('@/lib/email');
          await sendOrderCancellationEmail(email, order.id, 'Faktura nebyla uhrazena ve lhůtě splatnosti');
        } catch (e) {
          console.error('Cancel email error:', e);
        }
      }

      console.log(`Order ${order.id} stornována — faktura po splatnosti`);
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Fakturoid webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
