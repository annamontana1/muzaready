import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;

    const events = await prisma.b2bEvent.findMany({
      where: { partnerId: id },
      orderBy: { createdAt: 'desc' },
    });

    // Parse data JSON strings
    const parsed = events.map((e) => ({
      ...e,
      data: e.data ? (() => { try { return JSON.parse(e.data!); } catch { return e.data; } })() : null,
    }));

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('B2B events GET error:', error);
    return NextResponse.json({ error: 'Chyba při načítání událostí' }, { status: 500 });
  }
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
    const { type, description, data } = body;

    if (!type || !description) {
      return NextResponse.json({ error: 'Chybí typ nebo popis události' }, { status: 400 });
    }

    const event = await prisma.b2bEvent.create({
      data: {
        partnerId: id,
        type,
        description,
        data: data ? JSON.stringify(data) : null,
        createdBy: 'admin',
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('B2B event POST error:', error);
    return NextResponse.json({ error: 'Chyba při vytváření události' }, { status: 500 });
  }
}
