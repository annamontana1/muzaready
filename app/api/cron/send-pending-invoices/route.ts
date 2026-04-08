import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendInvoiceByEmail, isWithinSendingHours } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/cron/send-pending-invoices
 * Spouštěno cronem v 9:00 každý den.
 * Najde objednávky s fakturoidEmailPending=true a odešle faktury zákazníkům.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Extra pojistka — spouštět jen v odesílacím okně
  if (!isWithinSendingHours()) {
    return NextResponse.json({ skipped: true, reason: 'Mimo odesílací okno 9–20 hod' });
  }

  try {
    // Najdi objednávky s čekajícím emailem a existujícím Fakturoid ID
    const pending = await prisma.order.findMany({
      where: {
        fakturoidEmailPending: true,
        fakturoidInvoiceId: { not: null },
        email: { not: null },
        orderStatus: { not: 'cancelled' },
      },
      select: {
        id: true,
        email: true,
        fakturoidInvoiceId: true,
        fakturoidInvoiceNum: true,
      },
    });

    if (pending.length === 0) {
      return NextResponse.json({ sent: 0, message: 'Žádné čekající faktury' });
    }

    const results: { orderId: string; success: boolean; error?: string }[] = [];

    for (const order of pending) {
      try {
        await sendInvoiceByEmail(Number(order.fakturoidInvoiceId), order.email ?? undefined);

        await prisma.order.update({
          where: { id: order.id },
          data: { fakturoidEmailPending: false },
        });

        results.push({ orderId: order.id, success: true });
        console.log(`✅ Pending invoice email sent: ${order.fakturoidInvoiceNum} → ${order.email}`);
      } catch (err: any) {
        results.push({ orderId: order.id, success: false, error: err.message });
        console.error(`❌ Failed to send pending invoice ${order.fakturoidInvoiceNum}:`, err.message);
      }
    }

    const sentCount = results.filter((r) => r.success).length;
    return NextResponse.json({
      sent: sentCount,
      failed: results.length - sentCount,
      results,
    });
  } catch (error: any) {
    console.error('send-pending-invoices cron error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
