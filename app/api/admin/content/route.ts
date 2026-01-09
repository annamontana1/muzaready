import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/content
 * Fetch all page content entries
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get('pageType');

    const where = pageType ? { pageType } : {};

    const content = await prisma.pageContent.findMany({
      where,
      orderBy: [
        { pageType: 'asc' },
        { sortOrder: 'asc' },
        { slug: 'asc' },
      ],
    });

    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání obsahu stránek' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content
 * Create new page content entry
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { slug, pageName, pageType, sectionKey, contentCs, contentEn, isPublished, sortOrder } = body;

    if (!slug || !pageType) {
      return NextResponse.json(
        { error: 'Slug a pageType jsou povinné' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.pageContent.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Obsah s tímto slugem již existuje' },
        { status: 409 }
      );
    }

    const content = await prisma.pageContent.create({
      data: {
        slug,
        pageName: pageName || null,
        pageType,
        sectionKey: sectionKey || null,
        contentCs: contentCs || null,
        contentEn: contentEn || null,
        isPublished: isPublished !== undefined ? isPublished : true,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Error creating page content:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření obsahu stránky' },
      { status: 500 }
    );
  }
}
