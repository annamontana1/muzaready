import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

/**
 * POST /api/admin/stock/inventory
 * Create a new stock take (inventura)
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, performedBy, notes } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Název inventury je povinný' },
        { status: 400 }
      );
    }

    const stockTake = await prisma.stockTake.create({
      data: {
        name,
        performedBy,
        notes,
        status: 'PLANNED',
      },
    });

    return NextResponse.json({
      success: true,
      stockTake,
    });
  } catch (error) {
    console.error('Error creating stock take:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření inventury' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/stock/inventory
 * Get all stock takes
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const stockTakes = await prisma.stockTake.findMany({
      where: {
        ...(status && { status: status as any }),
      },
      include: {
        items: {
          include: {
            sku: {
              select: {
                id: true,
                sku: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      stockTakes,
      total: stockTakes.length,
    });
  } catch (error) {
    console.error('Error fetching stock takes:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání inventur' },
      { status: 500 }
    );
  }
}
