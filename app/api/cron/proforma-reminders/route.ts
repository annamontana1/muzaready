import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendProformaReminder } from '@/lib/emails/proforma-reminder';

// This endpoint is called by a cron job daily
export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    // Find orders with unpaid proformas expiring tomorrow
    const orders = await prisma.order.findMany({
      where: {
        fakturoidIsProforma: true,
        paymentStatus: 'unpaid',
        createdAt: {
          gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // created within last 2 days
          lte: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // but at least 1 day ago
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

    return NextResponse.json({ success: true, reminded });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
