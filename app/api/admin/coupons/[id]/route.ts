import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

interface Params {
  id: string;
}

/**
 * GET /api/admin/coupons/[id]
 * Get a single coupon by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    const coupon = await prisma.coupon.findUnique({
      where: { id },
      include: {
        orders: {
          select: {
            id: true,
            email: true,
            total: true,
            discountAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Kupón nenalezen' }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error fetching coupon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupon' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/coupons/[id]
 * Update a coupon
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();

    // If code is being changed, check uniqueness
    if (body.code) {
      const existing = await prisma.coupon.findFirst({
        where: {
          code: body.code.toUpperCase(),
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'Kupón s tímto kódem již existuje' },
          { status: 409 }
        );
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: body.code ? body.code.toUpperCase() : undefined,
        description: body.description,
        discountValue: body.discountValue,
        minOrderAmount: body.minOrderAmount,
        maxDiscount: body.maxDiscount,
        maxUses: body.maxUses,
        maxUsesPerUser: body.maxUsesPerUser,
        validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
        validUntil: body.validUntil ? new Date(body.validUntil) : null,
        isActive: body.isActive,
        rules: body.rules ? JSON.stringify(body.rules) : null,
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('Error updating coupon:', error);
    return NextResponse.json(
      { error: 'Failed to update coupon' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/coupons/[id]
 * Delete a coupon
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    // Check if coupon has been used
    const usageCount = await prisma.order.count({
      where: { couponId: id },
    });

    if (usageCount > 0) {
      return NextResponse.json(
        {
          error: `Nelze smazat kupón, který byl již použit (${usageCount}x). Místo toho ho deaktivujte.`,
        },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}
