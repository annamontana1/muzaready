import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { isTypOdberatele } from '@/lib/odberatele';
import { findOdberatel, serializeOdberatel } from '@/lib/odberatele-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

// GET: detail odběratele – várky, culíky, platby, dluh
export async function GET(req: NextRequest, { params }: Ctx) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const partner = await findOdberatel(id);
    if (!partner) return NextResponse.json({ error: 'Odběratel nenalezen' }, { status: 404 });
    return NextResponse.json(serializeOdberatel(partner));
  } catch (error) {
    console.error('Odberatel GET error:', error);
    return NextResponse.json({ error: 'Odběratele se nepodařilo načíst' }, { status: 500 });
  }
}

// PUT: jméno, typ, poznámka
export async function PUT(req: NextRequest, { params }: Ctx) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const { id } = await params;
    const partner = await findOdberatel(id);
    if (!partner) return NextResponse.json({ error: 'Odběratel nenalezen' }, { status: 404 });

    const body = await req.json();
    const name = String(body?.name ?? '').trim().slice(0, 120);
    if (!name) return NextResponse.json({ error: 'Doplňte jméno odběratele' }, { status: 400 });

    await prisma.b2bPartner.update({
      where: { id },
      data: {
        name,
        type: isTypOdberatele(body?.type) ? body.type : partner.type,
        notes: String(body?.notes ?? '').trim().slice(0, 1000) || null,
      },
    });

    const fresh = await findOdberatel(id);
    return NextResponse.json(serializeOdberatel(fresh!));
  } catch (error) {
    console.error('Odberatel PUT error:', error);
    return NextResponse.json({ error: 'Změny se nepodařilo uložit' }, { status: 500 });
  }
}
