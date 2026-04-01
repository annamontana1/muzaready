import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { cancelInvoice } from '@/lib/fakturoid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/orders/[id]/cancel-fakturoid
 * Manually cancel Fakturoid invoice for an order (even if order is already cancelled in admin).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, fakturoidInvoiceId: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });
    }

    if (!order.fakturoidInvoiceId) {
      return NextResponse.json({ error: 'Objednávka nemá přiřazenou Fakturoid fakturu' }, { status: 400 });
    }

    const result = await cancelInvoice(Number(order.fakturoidInvoiceId));

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Faktura stornována ve Fakturoidu' });
    } else {
      return NextResponse.json({ error: result.message || 'Storno se nezdařilo' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Cancel Fakturoid error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
