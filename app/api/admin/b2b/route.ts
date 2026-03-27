import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: List all B2B partners with summary stats
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const partners = await prisma.b2bPartner.findMany({
      include: {
        shipments: {
          include: {
            items: true,
          },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const partnersWithStats = partners.map((partner) => {
      const allItems = partner.shipments.flatMap((s) => s.items);
      const totalValue = allItems.reduce((sum, item) => sum + item.celkem, 0);
      const totalGrams = allItems.reduce((sum, item) => sum + item.gramaz, 0);
      const totalPaid = partner.payments.reduce((sum, p) => sum + p.amount, 0);
      const outstanding = totalValue - totalPaid;
      const returnedValue = allItems
        .filter((item) => item.stav === 'vraceni')
        .reduce((sum, item) => sum + item.celkem, 0);
      const effectiveDebt = totalValue - returnedValue - totalPaid;

      return {
        id: partner.id,
        name: partner.name,
        contactName: partner.contactName,
        email: partner.email,
        phone: partner.phone,
        ico: partner.ico,
        totalValue: Math.round(totalValue),
        totalGrams: Math.round(totalGrams),
        totalPaid: Math.round(totalPaid),
        outstanding: Math.round(effectiveDebt),
        shipmentsCount: partner.shipments.length,
        itemsCount: allItems.length,
        status: effectiveDebt <= 0 ? 'settled' : 'active',
        createdAt: partner.createdAt,
      };
    });

    return NextResponse.json(partnersWithStats);
  } catch (error) {
    console.error('B2B partners GET error:', error);
    return NextResponse.json({ error: 'Chyba při načítání partnerů' }, { status: 500 });
  }
}

// POST: Create new partner
export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const body = await req.json();
    const { name, contactName, email, phone, ico, address, notes } = body;

    if (!name) {
      return NextResponse.json({ error: 'Název partnera je povinný' }, { status: 400 });
    }

    const partner = await prisma.b2bPartner.create({
      data: {
        name,
        contactName: contactName || null,
        email: email || null,
        phone: phone || null,
        ico: ico || null,
        address: address || null,
        notes: notes || null,
      },
    });

    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    console.error('B2B partner POST error:', error);
    return NextResponse.json({ error: 'Chyba při vytváření partnera' }, { status: 500 });
  }
}
