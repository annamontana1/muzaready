import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// DELETE: Remove a shipment and all its items
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; shipmentId: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id, shipmentId } = await params;

    // Verify shipment belongs to this partner
    const shipment = await prisma.b2bShipment.findFirst({
      where: { id: shipmentId, partnerId: id },
    });

    if (!shipment) {
      return NextResponse.json({ error: 'Zásilka nenalezena' }, { status: 404 });
    }

    // Delete items first, then shipment
    await prisma.b2bItem.deleteMany({ where: { shipmentId } });
    await prisma.b2bShipment.delete({ where: { id: shipmentId } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting shipment:', error);
    return NextResponse.json({ error: error.message || 'Chyba při mazání zásilky' }, { status: 500 });
  }
}
