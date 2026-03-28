import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { createInvoiceFromOrder, isFakturoidConfigured } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function generateReceiptHtml(params: {
  partnerName: string;
  partnerIco: string | null;
  saleDate: string;
  items: Array<{ druh: string; barva: string; delkaCm: number; gramaz: number; celkem: number }>;
  totalAmount: number;
  notes: string | null;
}): string {
  const { partnerName, partnerIco, saleDate, items, totalAmount, notes } = params;
  const dateStr = new Date(saleDate).toLocaleDateString('cs-CZ');
  const receiptNumber = `B2B-${Date.now()}`;

  const rows = items
    .map(
      (item, i) => `
    <tr style="border-bottom:1px solid #eee;">
      <td style="padding:8px 4px;">${i + 1}.</td>
      <td style="padding:8px 4px;">${item.druh} ${item.barva} ${item.delkaCm} cm</td>
      <td style="padding:8px 4px;text-align:right;">${item.gramaz} g</td>
      <td style="padding:8px 4px;text-align:right;">${new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(item.celkem)}</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="cs">
<head>
<meta charset="UTF-8" />
<title>Účtenka ${receiptNumber}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 13px; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; }
  h1 { color: #722F37; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { background: #722F37; color: #fff; padding: 8px 4px; text-align: left; }
  .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 12px; }
  .footer { margin-top: 24px; font-size: 11px; color: #888; }
</style>
</head>
<body>
  <h1>Mùza Hair</h1>
  <p style="margin:0;">Účtenka č. <strong>${receiptNumber}</strong></p>
  <p style="margin:4px 0;">Datum: ${dateStr}</p>
  <hr />
  <p><strong>Partner:</strong> ${partnerName}${partnerIco ? ` &nbsp;|&nbsp; IČO: ${partnerIco}` : ''}</p>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Položka</th>
        <th style="text-align:right;">Gramáž</th>
        <th style="text-align:right;">Cena</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="total">Celkem: ${new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(totalAmount)}</p>
  ${notes ? `<p><em>Poznámka: ${notes}</em></p>` : ''}
  <div class="footer">
    <p>Mùza Hair s.r.o. &bull; info@muzahair.cz &bull; muzahair.cz</p>
    <p>Tato účtenka slouží jako doklad o komisním prodeji.</p>
  </div>
</body>
</html>`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    const body = await req.json();
    const {
      items,
      invoiceType,
      sendEmail,
      notes,
      saleDate,
    }: {
      items: Array<{ b2bItemId: string; amount: number }>;
      invoiceType: 'fakturoid' | 'uctenka' | 'zadna';
      sendEmail: boolean;
      notes: string;
      saleDate: string;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Žádné položky' }, { status: 400 });
    }

    const partner = await prisma.b2bPartner.findUnique({ where: { id } });
    if (!partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    // Fetch items to validate they belong to this partner and are 'skladem'
    const b2bItemIds = items.map((i) => i.b2bItemId);
    const existingItems = await prisma.b2bItem.findMany({
      where: { id: { in: b2bItemIds } },
      include: { shipment: { select: { partnerId: true } } },
    });

    for (const item of existingItems) {
      if (item.shipment.partnerId !== id) {
        return NextResponse.json({ error: `Položka ${item.id} nepatří tomuto partnerovi` }, { status: 400 });
      }
    }

    const totalAmount = items.reduce((sum, i) => sum + i.amount, 0);
    const saleDateParsed = saleDate ? new Date(saleDate) : new Date();

    // Create sale + sale items in transaction
    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.b2bSale.create({
        data: {
          partnerId: id,
          saleDate: saleDateParsed,
          totalAmount,
          invoiceType,
          notes: notes || null,
          items: {
            create: items.map((i) => ({
              b2bItemId: i.b2bItemId,
              amount: i.amount,
            })),
          },
        },
        include: { items: { include: { b2bItem: true } } },
      });

      // Mark items as sold
      await tx.b2bItem.updateMany({
        where: { id: { in: b2bItemIds } },
        data: { stav: 'prodano', soldAt: saleDateParsed },
      });

      return newSale;
    });

    let receiptHtml: string | undefined;
    let fakturoidId: string | undefined;
    let invoiceNumber: string | undefined;
    let invoiceUrl: string | undefined;

    // Handle invoice type
    if (invoiceType === 'fakturoid') {
      try {
        const configured = isFakturoidConfigured();
        if (configured && partner.email) {
          const result = await createInvoiceFromOrder({
            orderId: sale.id,
            customerName: partner.name,
            customerEmail: partner.email || '',
            customerIco: partner.ico || undefined,
            items: sale.items.map((si) => ({
              name: `${si.b2bItem.druh} ${si.b2bItem.barva} ${si.b2bItem.delkaCm} cm`,
              quantity: 1,
              unitPrice: si.amount,
              unit: 'ks',
            })),
            paymentMethod: 'bank',
            isPaid: false,
          });
          if (result.success) {
            fakturoidId = String(result.invoiceId);
            invoiceNumber = result.invoiceNumber;
            await prisma.b2bSale.update({
              where: { id: sale.id },
              data: {
                fakturoidId,
                invoiceNumber: invoiceNumber || null,
              },
            });
          }
        }
      } catch (e) {
        console.error('Fakturoid error:', e);
      }
    }

    if (invoiceType === 'uctenka') {
      receiptHtml = generateReceiptHtml({
        partnerName: partner.name,
        partnerIco: partner.ico,
        saleDate: saleDateParsed.toISOString(),
        items: sale.items.map((si) => ({
          druh: si.b2bItem.druh,
          barva: si.b2bItem.barva,
          delkaCm: si.b2bItem.delkaCm,
          gramaz: si.b2bItem.gramaz,
          celkem: si.amount,
        })),
        totalAmount,
        notes: notes || null,
      });
    }

    // Send email if requested
    if (sendEmail && partner.email) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const dateStr = saleDateParsed.toLocaleDateString('cs-CZ');
        const itemsList = sale.items
          .map(
            (si) =>
              `<li>${si.b2bItem.druh} ${si.b2bItem.barva} ${si.b2bItem.delkaCm} cm — ${new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(si.amount)}</li>`
          )
          .join('');

        await resend.emails.send({
          from: 'Mùza Hair <info@mail.muzahair.cz>',
          to: partner.email,
          subject: `Potvrzení prodeje – ${dateStr}`,
          html: `
            <h2 style="color:#722F37;">Potvrzení komisního prodeje</h2>
            <p>Dobrý den, ${partner.contactName || partner.name},</p>
            <p>potvrzujeme prodej následujících položek ze dne ${dateStr}:</p>
            <ul>${itemsList}</ul>
            <p><strong>Celkem: ${new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(totalAmount)}</strong></p>
            ${notes ? `<p>Poznámka: ${notes}</p>` : ''}
            ${invoiceUrl ? `<p><a href="${invoiceUrl}">Zobrazit fakturu</a></p>` : ''}
            <hr/>
            <p style="color:#888;font-size:12px;">Mùza Hair s.r.o. &bull; info@muzahair.cz</p>
          `,
          attachments: receiptHtml
            ? [
                {
                  filename: `uctenka-${sale.id}.html`,
                  content: Buffer.from(receiptHtml).toString('base64'),
                },
              ]
            : undefined,
        });

        await prisma.b2bSale.update({
          where: { id: sale.id },
          data: { emailSent: true, emailSentAt: new Date() },
        });
      } catch (e) {
        console.error('Email send error:', e);
      }
    }

    // Log event
    await prisma.b2bEvent.create({
      data: {
        partnerId: id,
        type: 'items_sold',
        description: `Prodáno ${items.length} položek za ${new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(totalAmount)}`,
        data: JSON.stringify({ saleId: sale.id, itemCount: items.length, totalAmount, invoiceType }),
        createdBy: 'admin',
      },
    });

    return NextResponse.json({ sale, receiptHtml }, { status: 201 });
  } catch (error) {
    console.error('B2B sale POST error:', error);
    return NextResponse.json({ error: 'Chyba při vytváření prodeje' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    const sales = await prisma.b2bSale.findMany({
      where: { partnerId: id },
      include: {
        items: {
          include: { b2bItem: true },
        },
      },
      orderBy: { saleDate: 'desc' },
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error('B2B sale GET error:', error);
    return NextResponse.json({ error: 'Chyba při načítání prodejů' }, { status: 500 });
  }
}
