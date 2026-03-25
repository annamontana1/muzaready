import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/pos/skus?q=...
 * Search SKUs for the POS form.
 * Returns id, shadeName, shade (shadeCode), structure, customerCategory,
 * lengthCm, availableGrams, pricePerGramCzk, saleMode, weightTotalG, priceCzkTotal, sku, name
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const q = request.nextUrl.searchParams.get('q') || '';

    const where: any = {};

    if (q.trim()) {
      where.OR = [
        { shadeName: { contains: q, mode: 'insensitive' } },
        { shade: { contains: q, mode: 'insensitive' } },
        { structure: { contains: q, mode: 'insensitive' } },
        { sku: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }

    const skus = await prisma.sku.findMany({
      where,
      select: {
        id: true,
        sku: true,
        name: true,
        shade: true,
        shadeName: true,
        structure: true,
        customerCategory: true,
        lengthCm: true,
        availableGrams: true,
        weightTotalG: true,
        pricePerGramCzk: true,
        priceCzkTotal: true,
        saleMode: true,
        inStock: true,
        soldOut: true,
      },
      orderBy: [{ shadeName: 'asc' }, { lengthCm: 'asc' }],
      take: 50,
    });

    return NextResponse.json({ skus });
  } catch (error: any) {
    console.error('POS SKU search error:', error);
    return NextResponse.json(
      { error: 'Chyba při vyhledávání SKU: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
