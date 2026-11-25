import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { parseDateKey } from '@/lib/odberatele';
import { findOdberatel } from '@/lib/odberatele-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST: nová (prázdná) várka – culíky se doplní na stránce várky
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const partner = await findOdberatel(id);
    if (!partner) return NextResponse.json({ error: 'Odběratel nenalezen' }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const date = parseDateKey(body?.date);
    if (!date) return NextResponse.json({ error: 'Doplňte datum várky' }, { status: 400 });

    const varka = await prisma.b2bShipment.create({ data: { partnerId: id, date } });
    return NextResponse.json({ id: varka.id }, { status: 201 });
  } catch (error) {
    console.error('Varka POST error:', error);
    return NextResponse.json({ error: 'Várku se nepodařilo založit' }, { status: 500 });
  }
}
