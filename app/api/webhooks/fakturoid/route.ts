// Register this webhook in Fakturoid:
// App.fakturoid.cz → Nastavení → Webhooky → Přidat webhook
// URL: https://muzahair.cz/api/webhooks/fakturoid
// Events: invoice_paid, proforma_paid, invoice_overdue

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { convertProformaToInvoice } from '@/lib/fakturoid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, invoice } = body;

    if (!invoice?.number) {
      return NextResponse.json({ ok: true });
    }

    const invoiceNumber = invoice.number as string;
    const paidAt = invoice.paid_at ? new Date(invoice.paid_at) : new Date();

    if (event === 'invoice_paid' || event === 'proforma_paid') {
      // Try to find matching Order by fakturoidInvoiceNum
      const order = await prisma.order.findFirst({
        where: {
          fakturoidInvoiceNum: invoiceNumber,
        },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'paid',
            paidAt,
          },
        });
        console.log(`Order ${order.id} marked as paid via Fakturoid webhook`);
      }

      // Try to find matching B2bSale by invoiceNumber
      const b2bSale = await prisma.b2bSale.findFirst({
        where: { invoiceNumber },
        include: { partner: true },
      });

      if (b2bSale) {
        // Create B2bPayment record automatically (avoid duplicates)
        const existingPayment = await prisma.b2bPayment.findFirst({
          where: {
            partnerId: b2bSale.partnerId,
            note: { contains: invoiceNumber },
          },
        });

        if (!existingPayment) {
          await prisma.b2bPayment.create({
            data: {
              partnerId: b2bSale.partnerId,
              amount: invoice.total,
              method: 'airbank',
              date: paidAt,
              note: `Automaticky z Fakturoidu — faktura ${invoiceNumber}`,
            },
          });
          console.log(`B2bPayment vytvořena: ${invoice.total} Kč pro partnera ${b2bSale.partnerId}`);
        }

        // Log to B2bHistory
        try {
          await prisma.b2bHistory.create({
            data: {
              partnerId: b2bSale.partnerId,
              type: 'payment_received',
              description: `Platba ${invoice.total} Kč přijata automaticky (faktura ${invoiceNumber})`,
              amount: invoice.total,
            },
          });
        } catch (e) {
          console.error('B2bHistory error (non-blocking):', e);
        }

        console.log(`B2bSale ${b2bSale.id} platba zpracována přes Fakturoid webhook`);
      }

      // For proforma_paid: convert to final invoice and deliver to customer
      if (event === 'proforma_paid' && invoice.id) {
        try {
          const result = await convertProformaToInvoice(invoice.id);
          console.log('Proforma converted to invoice:', result);
        } catch (err) {
          console.error('Failed to convert proforma:', err);
        }
      }
    }

    // Proforma vypršela — automaticky stornovat objednávku
    if (event === 'invoice_overdue') {
      const order = await prisma.order.findFirst({
        where: { fakturoidInvoiceNum: invoiceNumber, paymentStatus: 'unpaid' },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: { orderStatus: 'cancelled', lastStatusChangeAt: new Date() },
        });

        // Stornovat zálohovku ve Fakturoidu
        if (order.fakturoidInvoiceId) {
          try {
            const { cancelInvoice } = await import('@/lib/fakturoid');
            await cancelInvoice(Number(order.fakturoidInvoiceId));
          } catch (e) {
            console.error('Fakturoid cancel error:', e);
          }
        }

        // Poslat email zákazníkovi
        try {
          const { sendOrderCancellationEmail } = await import('@/lib/email');
          await sendOrderCancellationEmail(order.email, order.id, 'Zálohovka vypršela');
        } catch (e) {
          console.error('Cancel email error:', e);
        }

        console.log(`Order ${order.id} automaticky stornována — zálohovka vypršela`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Fakturoid webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
