import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    const { itemIds } = await req.json() as { itemIds: string[] };

    if (!itemIds || itemIds.length === 0) {
      return NextResponse.json({ error: 'Žádné položky' }, { status: 400 });
    }

    // Get partner info
    const partner = await prisma.b2bPartner.findUnique({
      where: { id },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    // Get items — verify they belong to this partner via shipment
    const items = await prisma.b2bItem.findMany({
      where: {
        id: { in: itemIds },
        shipment: { partnerId: id },
      },
    });

    if (items.length === 0) {
      return NextResponse.json({ error: 'Položky nenalezeny' }, { status: 404 });
    }

    const now = new Date();

    // Mark items as returned
    await prisma.b2bItem.updateMany({
      where: { id: { in: itemIds } },
      data: { stav: 'vraceni', returnedAt: now },
    });

    // Log event (B2bHistory doesn't exist — use B2bEvent)
    await prisma.b2bEvent.create({
      data: {
        partnerId: id,
        type: 'items_returned',
        description: `Vráceno ${items.length} položek: ${items.map((i) => `${i.druh} ${i.delkaCm}cm ${i.barva} ${i.gramaz}g`).join(', ')}`,
        data: JSON.stringify({ itemIds, itemCount: items.length }),
        createdBy: 'admin',
      },
    });

    // Send confirmation email via Resend if partner has email
    if (partner.email) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const itemsList = items
          .map(
            (i) =>
              `<tr>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${i.druh}</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${i.delkaCm} cm</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${i.barva}</td>
                <td style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0;">${i.gramaz} g</td>
              </tr>`
          )
          .join('');

        await resend.emails.send({
          from: 'Mùza Hair <info@mail.muzahair.cz>',
          to: partner.email,
          subject: `Potvrzení vrácení vlasů — ${now.toLocaleDateString('cs-CZ')}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #722F37; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-size: 22px;">Mùza Hair</h1>
              </div>
              <div style="background: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px;">
                <p>Dobrý den, <strong>${partner.contactName || partner.name}</strong>,</p>
                <p>potvrzujeme přijetí vrácených vlasů dne <strong>${now.toLocaleDateString('cs-CZ')}</strong>.</p>

                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                  <thead>
                    <tr style="background: #f9f9f9;">
                      <th style="padding: 8px 12px; text-align: left; font-size: 13px; color: #666;">Druh</th>
                      <th style="padding: 8px 12px; text-align: left; font-size: 13px; color: #666;">Délka</th>
                      <th style="padding: 8px 12px; text-align: left; font-size: 13px; color: #666;">Barva</th>
                      <th style="padding: 8px 12px; text-align: left; font-size: 13px; color: #666;">Gramáž</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>

                <p>Celkem vráceno: <strong>${items.length} položek</strong></p>
                <p>Děkujeme za spolupráci.</p>
                <p>S pozdravem,<br/><strong>Mùza Hair</strong></p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('B2B return email error:', emailError);
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json({ success: true, returned: items.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Neznámá chyba';
    console.error('B2B bulk return error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
