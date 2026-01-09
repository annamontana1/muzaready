import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/admin/faq
 * Fetch all FAQ items
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    const where: any = {};
    if (category) where.category = category;
    if (published === 'true') where.isPublished = true;
    if (published === 'false') where.isPublished = false;

    const items = await prisma.faqItem.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' },
      ],
    });

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error('Error fetching FAQ items:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání FAQ položek' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/faq
 * Create new FAQ item
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { category, questionCs, questionEn, answerCs, answerEn, sortOrder, isPublished } = body;

    if (!category || !questionCs || !answerCs) {
      return NextResponse.json(
        { error: 'Kategorie, otázka a odpověď jsou povinné' },
        { status: 400 }
      );
    }

    const item = await prisma.faqItem.create({
      data: {
        category,
        questionCs,
        questionEn: questionEn || null,
        answerCs,
        answerEn: answerEn || null,
        sortOrder: sortOrder || 0,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ item:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření FAQ položky' },
      { status: 500 }
    );
  }
}
