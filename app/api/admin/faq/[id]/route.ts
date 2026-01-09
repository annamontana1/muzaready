import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

/**
 * GET /api/admin/faq/[id]
 * Fetch single FAQ item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const item = await prisma.faqItem.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'FAQ položka nenalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQ item:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání FAQ položky' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/faq/[id]
 * Update FAQ item + trigger ISR revalidation
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      category,
      questionCs,
      questionEn,
      answerCs,
      answerEn,
      sortOrder,
      isPublished
    } = body;

    const currentItem = await prisma.faqItem.findUnique({
      where: { id: params.id },
    });

    if (!currentItem) {
      return NextResponse.json(
        { error: 'FAQ položka nenalezena' },
        { status: 404 }
      );
    }

    const item = await prisma.faqItem.update({
      where: { id: params.id },
      data: {
        category: category !== undefined ? category : currentItem.category,
        questionCs: questionCs !== undefined ? questionCs : currentItem.questionCs,
        questionEn: questionEn !== undefined ? questionEn : currentItem.questionEn,
        answerCs: answerCs !== undefined ? answerCs : currentItem.answerCs,
        answerEn: answerEn !== undefined ? answerEn : currentItem.answerEn,
        sortOrder: sortOrder !== undefined ? sortOrder : currentItem.sortOrder,
        isPublished: isPublished !== undefined ? isPublished : currentItem.isPublished,
        updatedAt: new Date(),
      },
    });

    // Revalidate FAQ page
    try {
      revalidatePath('/informace/faq');
      console.log('[FAQ] Revalidated /informace/faq');
    } catch (revalidateError) {
      console.error('[FAQ] Revalidation error:', revalidateError);
    }

    return NextResponse.json({
      ...item,
      revalidated: true
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating FAQ item:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci FAQ položky' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/faq/[id]
 * Delete FAQ item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const item = await prisma.faqItem.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'FAQ položka nenalezena' },
        { status: 404 }
      );
    }

    await prisma.faqItem.delete({
      where: { id: params.id },
    });

    // Revalidate FAQ page
    try {
      revalidatePath('/informace/faq');
    } catch (revalidateError) {
      console.error('[FAQ] Revalidation error:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      deletedId: params.id
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting FAQ item:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání FAQ položky' },
      { status: 500 }
    );
  }
}
