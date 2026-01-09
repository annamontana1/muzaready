import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/admin/seo
 * Fetch all SEO pages
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const pages = await prisma.pageSeo.findMany({
      orderBy: [
        { slug: 'asc' },
      ],
    });

    return NextResponse.json(pages, { status: 200 });
  } catch (error) {
    console.error('Error fetching SEO pages:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání SEO stránek' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo
 * Create new SEO page entry
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { slug, pageName, titleCs, titleEn, descriptionCs, descriptionEn, keywordsCs, keywordsEn, ogImageUrl, ogType, structuredData, canonicalUrl, noIndex, noFollow } = body;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug je povinný' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.pageSeo.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Stránka s tímto slugem již existuje' },
        { status: 409 }
      );
    }

    const page = await prisma.pageSeo.create({
      data: {
        slug,
        pageName: pageName || null,
        titleCs: titleCs || null,
        titleEn: titleEn || null,
        descriptionCs: descriptionCs || null,
        descriptionEn: descriptionEn || null,
        keywordsCs: keywordsCs || null,
        keywordsEn: keywordsEn || null,
        ogImageUrl: ogImageUrl || null,
        ogType: ogType || 'website',
        structuredData: structuredData || null,
        canonicalUrl: canonicalUrl || null,
        noIndex: noIndex || false,
        noFollow: noFollow || false,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating SEO page:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření SEO stránky' },
      { status: 500 }
    );
  }
}
