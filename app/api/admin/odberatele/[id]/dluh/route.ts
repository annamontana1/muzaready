import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { TYPY_PLATBY, ZPUSOBY_PLATBY, num, parseDateKey } from '@/lib/odberatele';
import { findOdberatel, serializeOdberatel } from '@/lib/odberatele-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PUT: uloží kartu „Dluh a platby“ – dluh z minula, várky počítat od, seznam plateb
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const partner = await findOdberatel(id);
    if (!partner) return NextResponse.json({ error: 'Odběratel nenalezen' }, { status: 404 });

    const body = await req.json();
    if (!Array.isArray(body?.platby)) return NextResponse.json({ error: 'Chybí platby' }, { status: 400 });

    const debtFromRaw = String(body?.debtFrom ?? '').trim();
    const debtFrom = debtFromRaw ? parseDateKey(debtFromRaw) : null;
    if (debtFromRaw && !debtFrom) return NextResponse.json({ error: 'Neplatné datum „Várky počítat od“' }, { status: 400 });

    const existingIds = new Set(partner.payments.map((p) => p.id));
    const keepIds: string[] = [];
    const writes: any[] = [];

    for (const raw of body.platby) {
      const date = parseDateKey(raw?.date);
      if (!date) return NextResponse.json({ error: 'U každé platby doplňte datum' }, { status: 400 });
      const data = {
        date,
        amount: Math.max(0, num(raw?.amount)),
        method: ZPUSOBY_PLATBY.some((m) => m.key === raw?.method) ? raw.method : 'hotove',
        type: TYPY_PLATBY.some((t) => t.key === raw?.type) ? raw.type : 'platba',
        note: String(raw?.note ?? '').trim().slice(0, 500) || null,
      };
      if (typeof raw?.id === 'string' && existingIds.has(raw.id)) {
        keepIds.push(raw.id);
        writes.push(prisma.b2bPayment.update({ where: { id: raw.id }, data }));
      } else {
        writes.push(prisma.b2bPayment.create({ data: { ...data, partnerId: id } }));
      }
    }

    await prisma.$transaction([
      prisma.b2bPartner.update({ where: { id }, data: { openingDebt: num(body?.openingDebt), debtFrom } }),
      // platby, které Anna ve formuláři smazala
      prisma.b2bPayment.deleteMany({ where: { partnerId: id, id: { notIn: keepIds } } }),
      ...writes,
    ]);

    const fresh = await findOdberatel(id);
    return NextResponse.json(serializeOdberatel(fresh!));
  } catch (error) {
    console.error('Dluh PUT error:', error);
    return NextResponse.json({ error: 'Dluh a platby se nepodařilo uložit' }, { status: 500 });
  }
}
