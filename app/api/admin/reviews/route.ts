import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/reviews
 * List all reviews with filtering
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const isApproved = searchParams.get('isApproved');
    const skuId = searchParams.get('skuId');

    const where: any = {};

    if (isApproved !== null && isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }

    if (skuId) {
      where.skuId = skuId;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        sku: {
          select: {
            sku: true,
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        order: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání recenzí' },
      { status: 500 }
    );
  }
}
