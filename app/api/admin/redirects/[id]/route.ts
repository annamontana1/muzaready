import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/redirects/[id]
 * Fetch single redirect by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const redirect = await prisma.redirect.findUnique({
      where: { id: params.id },
    });

    if (!redirect) {
      return NextResponse.json(
        { error: 'Přesměrování nenalezeno' },
        { status: 404 }
      );
    }

    return NextResponse.json(redirect, { status: 200 });
  } catch (error) {
    console.error('Error fetching redirect:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání přesměrování' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/redirects/[id]
 * Update redirect
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { fromPath, toPath, statusCode, isActive, note } = body;

    const currentRedirect = await prisma.redirect.findUnique({
      where: { id: params.id },
    });

    if (!currentRedirect) {
      return NextResponse.json(
        { error: 'Přesměrování nenalezeno' },
        { status: 404 }
      );
    }

    // If changing fromPath, check it doesn't conflict
    if (fromPath && fromPath !== currentRedirect.fromPath) {
      const existing = await prisma.redirect.findUnique({
        where: { fromPath },
      });
      if (existing) {
        return NextResponse.json(
          { error: 'Přesměrování z této cesty již existuje' },
          { status: 409 }
        );
      }
    }

    const redirect = await prisma.redirect.update({
      where: { id: params.id },
      data: {
        fromPath: fromPath !== undefined ? fromPath : currentRedirect.fromPath,
        toPath: toPath !== undefined ? toPath : currentRedirect.toPath,
        statusCode: statusCode !== undefined ? statusCode : currentRedirect.statusCode,
        isActive: isActive !== undefined ? isActive : currentRedirect.isActive,
        note: note !== undefined ? note : currentRedirect.note,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(redirect, { status: 200 });
  } catch (error) {
    console.error('Error updating redirect:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci přesměrování' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/redirects/[id]
 * Delete redirect
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const redirect = await prisma.redirect.findUnique({
      where: { id: params.id },
    });

    if (!redirect) {
      return NextResponse.json(
        { error: 'Přesměrování nenalezeno' },
        { status: 404 }
      );
    }

    await prisma.redirect.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      deletedFromPath: redirect.fromPath
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting redirect:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání přesměrování' },
      { status: 500 }
    );
  }
}
