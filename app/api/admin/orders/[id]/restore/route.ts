import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: 'Objednávka nenalezena' }, { status: 404 });

    await prisma.order.update({
      where: { id: params.id },
      data: {
        orderStatus: 'pending',
        paymentStatus: 'unpaid',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'Objednávka obnovena' });
  } catch (err: any) {
    console.error('restore order error:', err);
    return NextResponse.json({ error: err.message || 'Chyba' }, { status: 500 });
  }
}
