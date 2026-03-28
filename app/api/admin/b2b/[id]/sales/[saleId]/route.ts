import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// DELETE: Remove a B2B sale and restore items to skladem
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; saleId: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;
  try {
    const { saleId } = await params;

    // Find sale items to restore their status
    const sale = await prisma.b2bSale.findUnique({
      where: { id: saleId },
      include: { items: true },
    });
    if (!sale) return NextResponse.json({ error: 'Prodej nenalezen' }, { status: 404 });

    // Restore b2bItems to skladem
    await prisma.b2bItem.updateMany({
      where: { id: { in: sale.items.map(si => si.b2bItemId) } },
      data: { stav: 'skladem', soldAt: null },
    });

    await prisma.b2bSale.delete({ where: { id: saleId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('B2B sale DELETE error:', error);
    return NextResponse.json({ error: 'Chyba při mazání prodeje' }, { status: 500 });
  }
}
