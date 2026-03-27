import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: List payments for partner
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;

    const payments = await prisma.b2bPayment.findMany({
      where: { partnerId: id },
      orderBy: { date: 'desc' },
    });

    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({ payments, total: Math.round(total) });
  } catch (error) {
    console.error('B2B payments GET error:', error);
    return NextResponse.json({ error: 'Chyba při načítání plateb' }, { status: 500 });
  }
}

// POST: Add payment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    const body = await req.json();
    const { date, amount, method, note } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Částka musí být kladné číslo' }, { status: 400 });
    }

    // Verify partner exists
    const partner = await prisma.b2bPartner.findUnique({ where: { id } });
    if (!partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    const payment = await prisma.b2bPayment.create({
      data: {
        partnerId: id,
        date: new Date(date || new Date()),
        amount,
        method: method || 'airbank',
        note: note || null,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('B2B payment POST error:', error);
    return NextResponse.json({ error: 'Chyba při přidávání platby' }, { status: 500 });
  }
}
