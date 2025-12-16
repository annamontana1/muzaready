import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

interface Params {
  id: string;
}

/**
 * PATCH /api/admin/reviews/[id]
 * Approve/reject a review or update it
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();

    const review = await prisma.review.update({
      where: { id },
      data: {
        isApproved: body.isApproved !== undefined ? body.isApproved : undefined,
        adminNotes: body.adminNotes !== undefined ? body.adminNotes : undefined,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Chyba při úpravě recenze' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reviews/[id]
 * Delete a review
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání recenze' },
      { status: 500 }
    );
  }
}
