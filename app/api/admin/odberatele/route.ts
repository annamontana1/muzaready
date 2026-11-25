import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { MODULE_VARKY, isTypOdberatele, jeVraceno, cenaCelkem, dateKey } from '@/lib/odberatele';
import { currentMonthPrague, partnerInclude, serializeSummary } from '@/lib/odberatele-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: seznam odběratelů (várky) se souhrnem dluhu
export async function GET(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const [partners, archivPartneri, archivVydeje] = await Promise.all([
      prisma.b2bPartner.findMany({
        where: { module: MODULE_VARKY },
        include: partnerInclude,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      }),
      prisma.b2bPartner.count({ where: { module: { not: MODULE_VARKY } } }),
      prisma.b2bShipment.count({ where: { partner: { module: { not: MODULE_VARKY } } } }),
    ]);

    const mesic = currentMonthPrague();
    let predanoMesic = 0;
    let platbyMesic = 0;
    for (const p of partners) {
      for (const s of p.shipments) {
        if (dateKey(s.date).slice(0, 7) !== mesic) continue;
        for (const i of s.items) if (!jeVraceno(i)) predanoMesic += cenaCelkem(i);
      }
      for (const x of p.payments) if (dateKey(x.date).slice(0, 7) === mesic) platbyMesic += x.amount;
    }

    const odberatele = partners.map(serializeSummary);
    return NextResponse.json({
      odberatele,
      souhrn: {
        mesic,
        zbyvaCelkem: odberatele.reduce((a, o) => a + o.zbyva, 0),
        predanoMesic,
        platbyMesic,
      },
      archiv: { partneri: archivPartneri, vydeje: archivVydeje },
    });
  } catch (error) {
    console.error('Odberatele GET error:', error);
    return NextResponse.json({ error: 'Odběratele se nepodařilo načíst' }, { status: 500 });
  }
}

// POST: nový odběratel
export async function POST(req: NextRequest) {
  const authError = await requireAdmin(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim().slice(0, 120);
    if (!name) return NextResponse.json({ error: 'Doplňte jméno odběratele' }, { status: 400 });
    const type = isTypOdberatele(body?.type) ? body.type : 'keratin';

    const last = await prisma.b2bPartner.findFirst({
      where: { module: MODULE_VARKY },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const partner = await prisma.b2bPartner.create({
      data: { name, type, module: MODULE_VARKY, sortOrder: (last?.sortOrder ?? 0) + 1 },
    });
    return NextResponse.json({ id: partner.id }, { status: 201 });
  } catch (error) {
    console.error('Odberatele POST error:', error);
    return NextResponse.json({ error: 'Odběratele se nepodařilo založit' }, { status: 500 });
  }
}
