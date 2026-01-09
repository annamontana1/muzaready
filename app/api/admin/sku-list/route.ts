import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/sku-list
 * Get simplified list of all SKUs for dropdowns
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const skus = await prisma.sku.findMany({
      select: {
        id: true,
        sku: true,
        name: true,
        shadeName: true,
        lengthCm: true,
        availableGrams: true,
        inStock: true,
        saleMode: true,
      },
      orderBy: [
        { inStock: 'desc' },
        { sku: 'asc' },
      ],
    });

    return NextResponse.json({
      skus,
      total: skus.length,
    });
  } catch (error) {
    console.error('Error fetching SKU list:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání SKU' },
      { status: 500 }
    );
  }
}
