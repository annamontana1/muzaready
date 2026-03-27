import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST: Create new shipment with items
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    const body = await req.json();
    const { date, notes, items } = body;

    // Verify partner exists
    const partner = await prisma.b2bPartner.findUnique({ where: { id } });
    if (!partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Zásilka musí obsahovat alespoň jednu položku' }, { status: 400 });
    }

    const shipment = await prisma.b2bShipment.create({
      data: {
        partnerId: id,
        date: new Date(date || new Date()),
        notes: notes || null,
        items: {
          create: items.map((item: {
            druh: string;
            barva: string;
            delkaCm: number;
            gramaz: number;
            cenaPerGram: number;
            celkem?: number;
            stav?: string;
            notes?: string;
          }) => ({
            druh: item.druh,
            barva: item.barva,
            delkaCm: item.delkaCm,
            gramaz: item.gramaz,
            cenaPerGram: item.cenaPerGram,
            celkem: item.celkem || item.gramaz * item.cenaPerGram,
            stav: item.stav || 'skladem',
            notes: item.notes || null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(shipment, { status: 201 });
  } catch (error) {
    console.error('B2B shipment POST error:', error);
    return NextResponse.json({ error: 'Chyba při vytváření zásilky' }, { status: 500 });
  }
}

// PUT: Update item status
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const body = await req.json();
    const { itemId, stav } = body;

    const validStates = ['skladem', 'prodano', 'vraceni', 'zaplaceno'];
    if (!validStates.includes(stav)) {
      return NextResponse.json({ error: 'Neplatný stav položky' }, { status: 400 });
    }

    const item = await prisma.b2bItem.update({
      where: { id: itemId },
      data: { stav },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('B2B item PUT error:', error);
    return NextResponse.json({ error: 'Chyba při aktualizaci položky' }, { status: 500 });
  }
}
