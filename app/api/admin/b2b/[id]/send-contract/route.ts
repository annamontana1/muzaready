import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function formatCzk(val: number) {
  return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(val);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;

    const partner = await prisma.b2bPartner.findUnique({
      where: { id },
      include: {
        shipments: {
          include: { items: true },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    if (!partner.email) {
      return NextResponse.json({ error: 'Partner nema zadany email' }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ error: 'RESEND_API_KEY neni nakonfigurovany' }, { status: 500 });
    }

    // Get items with status "skladem"
    const sklademItems = partner.shipments.flatMap((s) => s.items).filter((i) => i.stav === 'skladem');
    const totalValue = sklademItems.reduce((sum, i) => sum + i.celkem, 0);
    const todayStr = new Date().toLocaleDateString('cs-CZ');

    const itemsRowsHtml = sklademItems
      .map(
        (item, idx) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; color: #666;">${idx + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${item.druh}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5;">${item.barva}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">${item.delkaCm} cm</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">${item.gramaz} g</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right;">${item.cenaPerGram} Kc</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: bold;">${formatCzk(item.celkem)}</td>
        </tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 700px; margin: 0 auto; padding: 30px; }
            h1 { text-align: center; color: #722F37; font-size: 22px; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px; }
            .divider { width: 60px; height: 2px; background: #722F37; margin: 10px auto 30px; }
            .parties { display: flex; gap: 40px; margin-bottom: 30px; }
            .party { flex: 1; }
            .party-label { font-size: 11px; font-weight: bold; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
            .party-name { font-weight: bold; font-size: 14px; }
            .party-detail { font-size: 13px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
            th { background: #f5f5f5; padding: 10px 8px; text-align: left; font-weight: 600; color: #555; border-bottom: 2px solid #ddd; }
            .total-row td { background: #f5f5f5; font-weight: bold; padding: 10px 8px; }
            .conditions { margin-top: 25px; }
            .conditions h3 { font-size: 14px; margin-bottom: 10px; }
            .conditions ol { padding-left: 20px; font-size: 13px; color: #555; }
            .conditions li { margin-bottom: 6px; }
            .signatures { display: flex; gap: 80px; margin-top: 60px; }
            .signature { flex: 1; text-align: center; }
            .signature-line { border-top: 1px solid #999; padding-top: 8px; font-size: 13px; font-weight: 500; }
            .signature-sub { font-size: 11px; color: #999; margin-top: 2px; }
            .date { font-size: 13px; color: #555; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Komisni smlouva</h1>
            <div class="divider"></div>

            <table style="width: 100%; border: none; margin-bottom: 25px;">
              <tr>
                <td style="vertical-align: top; width: 50%; padding: 0 20px 0 0; border: none;">
                  <div class="party-label">Komitent (dodavatel)</div>
                  <div class="party-name">Anna Zvinchuk</div>
                  <div class="party-detail">ICO: 17989230</div>
                  <div class="party-detail">Sramkova 430/12, Lesna</div>
                  <div class="party-detail">638 00 Brno</div>
                </td>
                <td style="vertical-align: top; width: 50%; padding: 0; border: none;">
                  <div class="party-label">Komisar (prodejce)</div>
                  <div class="party-name">${partner.name}</div>
                  ${partner.ico ? `<div class="party-detail">ICO: ${partner.ico}</div>` : ''}
                  ${partner.contactName ? `<div class="party-detail">Kontakt: ${partner.contactName}</div>` : ''}
                  ${partner.address ? `<div class="party-detail">${partner.address}</div>` : ''}
                </td>
              </tr>
            </table>

            <h3 style="font-size: 14px; margin-bottom: 5px;">Predmet smlouvy</h3>
            <p style="font-size: 13px; color: #555; margin-bottom: 10px;">
              Komitent predava komisari nasledujici zbozi k prodeji:
            </p>

            ${sklademItems.length === 0
              ? '<p style="font-size: 13px; color: #999; font-style: italic;">Zadne polozky se stavem "skladem".</p>'
              : `
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Druh</th>
                    <th>Barva</th>
                    <th style="text-align: right;">Delka</th>
                    <th style="text-align: right;">Gramaz</th>
                    <th style="text-align: right;">Cena/g</th>
                    <th style="text-align: right;">Celkem</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRowsHtml}
                </tbody>
                <tfoot>
                  <tr class="total-row">
                    <td colspan="6" style="text-align: right;">Celkova hodnota:</td>
                    <td style="text-align: right;">${formatCzk(totalValue)}</td>
                  </tr>
                </tfoot>
              </table>
            `}

            <div class="conditions">
              <h3>Podminky</h3>
              <ol>
                <li>Komisar prodava zbozi vlastnim jmenem na ucet komitenta.</li>
                <li>Neprodane zbozi vrati komisar komitentovi na vyzadani.</li>
                <li>Komisar uhradi komitentovi prodejni cenu do 30 dnu od prodeje.</li>
                <li>Komitent zustava vlastnikem zbozi do zaplaceni.</li>
              </ol>
            </div>

            <div class="date">V Brne dne: ${todayStr}</div>

            <table style="width: 100%; border: none; margin-top: 50px;">
              <tr>
                <td style="width: 50%; text-align: center; padding: 0 30px; border: none;">
                  <div class="signature-line">Komitent</div>
                  <div class="signature-sub">Anna Zvinchuk</div>
                </td>
                <td style="width: 50%; text-align: center; padding: 0 30px; border: none;">
                  <div class="signature-line">Komisar</div>
                  <div class="signature-sub">${partner.name}</div>
                </td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'Muza Hair <mail@muzahair.cz>',
      to: partner.email,
      subject: 'Komisni smlouva - Muza Hair',
      html,
    });

    console.log('Commission contract email sent:', result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Send contract error:', error);
    return NextResponse.json({ error: 'Chyba pri odesilani smlouvy' }, { status: 500 });
  }
}
