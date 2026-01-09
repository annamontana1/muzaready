import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const runtime = 'nodejs';

/**
 * GET /api/admin/seo/[id]
 * Fetch single SEO page by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const page = await prisma.pageSeo.findUnique({
      where: { id: params.id },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'SEO stránka nenalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json(page, { status: 200 });
  } catch (error) {
    console.error('Error fetching SEO page:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání SEO stránky' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/[id]
 * Update SEO page + trigger ISR revalidation
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
      titleCs,
      titleEn,
      descriptionCs,
      descriptionEn,
      keywordsCs,
      keywordsEn,
      ogImageUrl,
      ogType,
      structuredData,
      canonicalUrl,
      noIndex,
      noFollow
    } = body;

    // Get current page to know the slug for revalidation
    const currentPage = await prisma.pageSeo.findUnique({
      where: { id: params.id },
    });

    if (!currentPage) {
      return NextResponse.json(
        { error: 'SEO stránka nenalezena' },
        { status: 404 }
      );
    }

    // Update the page
    const page = await prisma.pageSeo.update({
      where: { id: params.id },
      data: {
        pageName: pageName !== undefined ? pageName : currentPage.pageName,
        titleCs: titleCs !== undefined ? titleCs : currentPage.titleCs,
        titleEn: titleEn !== undefined ? titleEn : currentPage.titleEn,
        descriptionCs: descriptionCs !== undefined ? descriptionCs : currentPage.descriptionCs,
        descriptionEn: descriptionEn !== undefined ? descriptionEn : currentPage.descriptionEn,
        keywordsCs: keywordsCs !== undefined ? keywordsCs : currentPage.keywordsCs,
        keywordsEn: keywordsEn !== undefined ? keywordsEn : currentPage.keywordsEn,
        ogImageUrl: ogImageUrl !== undefined ? ogImageUrl : currentPage.ogImageUrl,
        ogType: ogType !== undefined ? ogType : currentPage.ogType,
        structuredData: structuredData !== undefined ? structuredData : currentPage.structuredData,
        canonicalUrl: canonicalUrl !== undefined ? canonicalUrl : currentPage.canonicalUrl,
        noIndex: noIndex !== undefined ? noIndex : currentPage.noIndex,
        noFollow: noFollow !== undefined ? noFollow : currentPage.noFollow,
        updatedAt: new Date(),
      },
    });

    // CRITICAL: Trigger ISR revalidation for immediate update
    try {
      revalidatePath(page.slug);
      // Also revalidate sitemap
      revalidatePath('/sitemap.xml');
      console.log(`[SEO] Revalidated path: ${page.slug}`);
    } catch (revalidateError) {
      console.error('[SEO] Revalidation error:', revalidateError);
      // Don't fail the request if revalidation fails
    }

    return NextResponse.json({
      ...page,
      revalidated: true,
      revalidatedPath: page.slug
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating SEO page:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci SEO stránky' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/seo/[id]
 * Delete SEO page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const page = await prisma.pageSeo.findUnique({
      where: { id: params.id },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'SEO stránka nenalezena' },
        { status: 404 }
      );
    }

    await prisma.pageSeo.delete({
      where: { id: params.id },
    });

    // Revalidate the deleted page path
    try {
      revalidatePath(page.slug);
      revalidatePath('/sitemap.xml');
    } catch (revalidateError) {
      console.error('[SEO] Revalidation error:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      deletedSlug: page.slug
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting SEO page:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání SEO stránky' },
      { status: 500 }
    );
  }
}
