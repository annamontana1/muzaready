import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { parseDateKey } from '@/lib/odberatele';
import { cleanItem, findOdberatel, serializeOdberatel } from '@/lib/odberatele-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string; varkaId: string }> };

// PUT: uloží celou várku – datum a všechny culíky
export async function PUT(req: NextRequest, { params }: Ctx) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { id, varkaId } = await params;
    const partner = await findOdberatel(id);
    const varka = partner?.shipments.find((s) => s.id === varkaId);
    if (!partner || !varka) return NextResponse.json({ error: 'Várka nenalezena' }, { status: 404 });

    const body = await req.json();
    const date = parseDateKey(body?.date);
    if (!date) return NextResponse.json({ error: 'Doplňte datum várky' }, { status: 400 });
    if (!Array.isArray(body?.items)) return NextResponse.json({ error: 'Chybí culíky' }, { status: 400 });
    if (body.items.length > 300) return NextResponse.json({ error: 'Várka může mít nejvýš 300 culíků' }, { status: 400 });

    const existingIds = new Set(varka.items.map((i) => i.id));
    const keratinovy = partner.type === 'keratin';
    const keepIds: string[] = [];
    const writes: any[] = [];

    body.items.forEach((raw: any, index: number) => {
      const data = cleanItem(raw, keratinovy, index);
      if (typeof raw?.id === 'string' && existingIds.has(raw.id)) {
        keepIds.push(raw.id);
        writes.push(prisma.b2bItem.update({ where: { id: raw.id }, data }));
      } else {
        writes.push(prisma.b2bItem.create({ data: { ...data, shipmentId: varkaId } }));
      }
    });

    await prisma.$transaction([
      prisma.b2bShipment.update({ where: { id: varkaId }, data: { date } }),
      // culíky, které Anna ve formuláři smazala
      prisma.b2bItem.deleteMany({ where: { shipmentId: varkaId, id: { notIn: keepIds } } }),
      ...writes,
    ]);

    const fresh = await findOdberatel(id);
    return NextResponse.json(serializeOdberatel(fresh!));
  } catch (error) {
    console.error('Varka PUT error:', error);
    return NextResponse.json({ error: 'Várku se nepodařilo uložit' }, { status: 500 });
  }
}

// DELETE: smaže várku i s culíky (jen várky nové stránky Odběratelé)
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { id, varkaId } = await params;
    const partner = await findOdberatel(id);
    const varka = partner?.shipments.find((s) => s.id === varkaId);
    if (!partner || !varka) return NextResponse.json({ error: 'Várka nenalezena' }, { status: 404 });

    await prisma.$transaction([
      prisma.b2bItem.deleteMany({ where: { shipmentId: varkaId } }),
      prisma.b2bShipment.delete({ where: { id: varkaId } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Varka DELETE error:', error);
    return NextResponse.json({ error: 'Várku se nepodařilo smazat' }, { status: 500 });
  }
}
