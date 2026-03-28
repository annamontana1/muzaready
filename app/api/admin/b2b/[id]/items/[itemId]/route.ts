import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// PATCH: Edit a B2B item
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  try {
    const { itemId } = await params;
    const body = await req.json();
    const { druh, barva, delkaCm, gramaz, cenaPerGram, stav, notes } = body;

    const item = await prisma.b2bItem.update({
      where: { id: itemId },
      data: {
        ...(druh !== undefined && { druh }),
        ...(barva !== undefined && { barva }),
        ...(delkaCm !== undefined && { delkaCm: Number(delkaCm) }),
        ...(gramaz !== undefined && { gramaz: Number(gramaz) }),
        ...(cenaPerGram !== undefined && {
          cenaPerGram: Number(cenaPerGram),
          celkem: Math.round(Number(gramaz ?? 0) * Number(cenaPerGram)),
        }),
        ...(stav !== undefined && { stav }),
        ...(notes !== undefined && { notes }),
        // Přepočítej celkem pokud se změnila gramáž nebo cena
        ...(gramaz !== undefined && cenaPerGram === undefined && {
          celkem: Math.round(Number(gramaz) * Number(body.existingCenaPerGram ?? 0)),
        }),
      },
    });

    // Přepočítej celkem správně
    if (gramaz !== undefined || cenaPerGram !== undefined) {
      const fresh = await prisma.b2bItem.findUnique({ where: { id: itemId } });
      if (fresh) {
        await prisma.b2bItem.update({
          where: { id: itemId },
          data: { celkem: Math.round(fresh.gramaz * Number(fresh.cenaPerGram)) },
        });
      }
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('B2B item PATCH error:', error);
    return NextResponse.json({ error: 'Chyba při úpravě položky' }, { status: 500 });
  }
}

// DELETE: Remove a B2B item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  try {
    const { itemId } = await params;
    await prisma.b2bItem.delete({ where: { id: itemId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('B2B item DELETE error:', error);
    return NextResponse.json({ error: 'Chyba při mazání položky' }, { status: 500 });
  }
}
