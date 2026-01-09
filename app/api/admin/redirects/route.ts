import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/redirects
 * Fetch all redirects
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    const where: any = {};
    if (active === 'true') where.isActive = true;
    if (active === 'false') where.isActive = false;

    const redirects = await prisma.redirect.findMany({
      where,
      orderBy: { fromPath: 'asc' },
    });

    return NextResponse.json(redirects, { status: 200 });
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání přesměrování' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/redirects
 * Create new redirect
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { fromPath, toPath, statusCode, isActive, note } = body;

    if (!fromPath || !toPath) {
      return NextResponse.json(
        { error: 'fromPath a toPath jsou povinné' },
        { status: 400 }
      );
    }

    // Check if fromPath already exists
    const existing = await prisma.redirect.findUnique({
      where: { fromPath },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Přesměrování z této cesty již existuje' },
        { status: 409 }
      );
    }

    const redirect = await prisma.redirect.create({
      data: {
        fromPath,
        toPath,
        statusCode: statusCode || 301,
        isActive: isActive !== undefined ? isActive : true,
        note: note || null,
      },
    });

    return NextResponse.json(redirect, { status: 201 });
  } catch (error) {
    console.error('Error creating redirect:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření přesměrování' },
      { status: 500 }
    );
  }
}
