import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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
      returnDate,
      reason,
      sendEmail,
      notes,
    }: {
      items: string[];
      returnDate: string;
      reason: string;
      sendEmail: boolean;
      notes: string;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Žádné položky' }, { status: 400 });
    }

    const partner = await prisma.b2bPartner.findUnique({ where: { id } });
    if (!partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    const returnDateParsed = returnDate ? new Date(returnDate) : new Date();

    // Validate items belong to this partner
    const existingItems = await prisma.b2bItem.findMany({
      where: { id: { in: items } },
      include: { shipment: { select: { partnerId: true } } },
    });

    for (const item of existingItems) {
      if (item.shipment.partnerId !== id) {
        return NextResponse.json({ error: `Položka ${item.id} nepatří tomuto partnerovi` }, { status: 400 });
      }
    }

    // Create return record + return items in transaction
    const returnRecord = await prisma.$transaction(async (tx) => {
      const newReturn = await tx.b2bReturn.create({
        data: {
          partnerId: id,
          returnDate: returnDateParsed,
          reason: reason || null,
          notes: notes || null,
          items: {
            create: items.map((itemId) => ({
              b2bItemId: itemId,
            })),
          },
        },
        include: { items: { include: { b2bItem: true } } },
      });

      // Mark items as vraceni
      await tx.b2bItem.updateMany({
        where: { id: { in: items } },
        data: { stav: 'vraceni', returnedAt: returnDateParsed },
      });

      return newReturn;
    });

    // Send email if requested
    if (sendEmail && partner.email) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const dateStr = returnDateParsed.toLocaleDateString('cs-CZ');
        const itemsList = returnRecord.items
          .map(
            (ri) =>
              `<li>${ri.b2bItem.druh} ${ri.b2bItem.barva} ${ri.b2bItem.delkaCm} cm</li>`
          )
          .join('');

        await resend.emails.send({
          from: 'Mùza Hair <info@mail.muzahair.cz>',
          to: partner.email,
          subject: `Potvrzení vrácení zboží – ${dateStr}`,
          html: `
            <h2 style="color:#722F37;">Potvrzení vrácení zboží</h2>
            <p>Dobrý den, ${partner.contactName || partner.name},</p>
            <p>potvrzujeme přijetí vrácených položek ze dne ${dateStr}:</p>
            <ul>${itemsList}</ul>
            ${reason ? `<p>Důvod vrácení: ${reason}</p>` : ''}
            ${notes ? `<p>Poznámka: ${notes}</p>` : ''}
            <hr/>
            <p style="color:#888;font-size:12px;">Mùza Hair s.r.o. &bull; info@muzahair.cz</p>
          `,
        });

        await prisma.b2bReturn.update({
          where: { id: returnRecord.id },
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
        type: 'items_returned',
        description: `Vráceno ${items.length} položek${reason ? `: ${reason}` : ''}`,
        data: JSON.stringify({ returnId: returnRecord.id, itemCount: items.length, reason }),
        createdBy: 'admin',
      },
    });

    return NextResponse.json({ return: returnRecord }, { status: 201 });
  } catch (error) {
    console.error('B2B return POST error:', error);
    return NextResponse.json({ error: 'Chyba při vytváření vrácení' }, { status: 500 });
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
    const returns = await prisma.b2bReturn.findMany({
      where: { partnerId: id },
      include: {
        items: {
          include: { b2bItem: true },
        },
      },
      orderBy: { returnDate: 'desc' },
    });
    return NextResponse.json(returns);
  } catch (error) {
    console.error('B2B return GET error:', error);
    return NextResponse.json({ error: 'Chyba při načítání vrácení' }, { status: 500 });
  }
}
