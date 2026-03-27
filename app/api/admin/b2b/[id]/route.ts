import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: Partner detail with shipments, items, and payments
export async function GET(
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
          include: {
            items: {
              orderBy: { id: 'asc' },
            },
          },
          orderBy: { date: 'desc' },
        },
        payments: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    // Calculate summary stats
    const allItems = partner.shipments.flatMap((s) => s.items);
    const totalValue = allItems.reduce((sum, item) => sum + item.celkem, 0);
    const totalGrams = allItems.reduce((sum, item) => sum + item.gramaz, 0);
    const totalPaid = partner.payments.reduce((sum, p) => sum + p.amount, 0);
    const returnedValue = allItems
      .filter((item) => item.stav === 'vraceni')
      .reduce((sum, item) => sum + item.celkem, 0);

    return NextResponse.json({
      ...partner,
      type: (partner as any).type || 'komise',
      stats: {
        totalValue: Math.round(totalValue),
        totalGrams: Math.round(totalGrams),
        totalPaid: Math.round(totalPaid),
        outstanding: Math.round(totalValue - returnedValue - totalPaid),
        returnedValue: Math.round(returnedValue),
        itemsCount: allItems.length,
      },
    });
  } catch (error) {
    console.error('B2B partner GET error:', error);
    return NextResponse.json({ error: 'Chyba při načítání partnera' }, { status: 500 });
  }
}

// PUT: Update partner info
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    const body = await req.json();
    const { name, contactName, email, phone, ico, address, notes, type } = body;

    const partner = await prisma.b2bPartner.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(contactName !== undefined && { contactName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(ico !== undefined && { ico }),
        ...(address !== undefined && { address }),
        ...(notes !== undefined && { notes }),
        ...(type !== undefined && { type }),
      } as any,
    });

    return NextResponse.json(partner);
  } catch (error) {
    console.error('B2B partner PUT error:', error);
    return NextResponse.json({ error: 'Chyba při aktualizaci partnera' }, { status: 500 });
  }
}
