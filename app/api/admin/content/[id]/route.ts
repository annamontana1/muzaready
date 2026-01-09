import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

/**
 * GET /api/admin/content/[id]
 * Fetch single page content by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const content = await prisma.pageContent.findUnique({
      where: { id: params.id },
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Obsah stránky nenalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání obsahu stránky' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/content/[id]
 * Update page content + trigger ISR revalidation
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
      pageName,
      pageType,
      sectionKey,
      contentCs,
      contentEn,
      isPublished,
      sortOrder
    } = body;

    // Get current content to know the slug for revalidation
    const currentContent = await prisma.pageContent.findUnique({
      where: { id: params.id },
    });

    if (!currentContent) {
      return NextResponse.json(
        { error: 'Obsah stránky nenalezen' },
        { status: 404 }
      );
    }

    // Update the content
    const content = await prisma.pageContent.update({
      where: { id: params.id },
      data: {
        pageName: pageName !== undefined ? pageName : currentContent.pageName,
        pageType: pageType !== undefined ? pageType : currentContent.pageType,
        sectionKey: sectionKey !== undefined ? sectionKey : currentContent.sectionKey,
        contentCs: contentCs !== undefined ? contentCs : currentContent.contentCs,
        contentEn: contentEn !== undefined ? contentEn : currentContent.contentEn,
        isPublished: isPublished !== undefined ? isPublished : currentContent.isPublished,
        sortOrder: sortOrder !== undefined ? sortOrder : currentContent.sortOrder,
        updatedAt: new Date(),
      },
    });

    // CRITICAL: Trigger ISR revalidation for immediate update
    try {
      // Determine which path to revalidate based on slug
      const pathToRevalidate = content.slug.startsWith('/')
        ? content.slug
        : `/${content.slug}`;

      revalidatePath(pathToRevalidate);

      // For homepage sections, also revalidate homepage
      if (content.pageType === 'homepage_section') {
        revalidatePath('/');
      }

      console.log(`[Content] Revalidated path: ${pathToRevalidate}`);
    } catch (revalidateError) {
      console.error('[Content] Revalidation error:', revalidateError);
    }

    return NextResponse.json({
      ...content,
      revalidated: true,
      revalidatedPath: content.slug
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci obsahu stránky' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/content/[id]
 * Delete page content
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const content = await prisma.pageContent.findUnique({
      where: { id: params.id },
    });

    if (!content) {
      return NextResponse.json(
        { error: 'Obsah stránky nenalezen' },
        { status: 404 }
      );
    }

    await prisma.pageContent.delete({
      where: { id: params.id },
    });

    // Revalidate the deleted content path
    try {
      const pathToRevalidate = content.slug.startsWith('/')
        ? content.slug
        : `/${content.slug}`;
      revalidatePath(pathToRevalidate);

      if (content.pageType === 'homepage_section') {
        revalidatePath('/');
      }
    } catch (revalidateError) {
      console.error('[Content] Revalidation error:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      deletedSlug: content.slug
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting page content:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání obsahu stránky' },
      { status: 500 }
    );
  }
}
