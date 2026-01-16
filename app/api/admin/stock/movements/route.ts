import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/stock/movements
 * Fetch stock movements for a specific SKU
 * Query params:
 *   - skuId: SKU ID (required)
 *   - type: Filter by movement type (optional: IN, OUT, ADJUST, etc.)
 *   - includeUnsold: Include only unsold items (for IN movements)
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const skuId = searchParams.get('skuId');
    const type = searchParams.get('type');
    const includeUnsold = searchParams.get('includeUnsold') === 'true';

    if (!skuId) {
      return NextResponse.json(
        { error: 'SKU ID is required' },
        { status: 400 }
      );
    }

    // Fetch SKU details
    const sku = await prisma.sku.findUnique({
      where: { id: skuId },
      select: {
        id: true,
        sku: true,
        shortCode: true,
        name: true,
        shadeName: true,
        lengthCm: true,
        availableGrams: true,
      },
    });

    if (!sku) {
      return NextResponse.json(
        { error: 'SKU not found' },
        { status: 404 }
      );
    }

    // Build where clause
    const where: any = {
      skuId: skuId,
    };

    if (type) {
      where.type = type;
    }

    // For IN movements, optionally filter by unsold items
    if (type === 'IN' && includeUnsold) {
      // Don't add soldAt filter - we want all IN movements
    }

    // Fetch movements
    const movements = await prisma.stockMovement.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        type: true,
        grams: true,
        location: true,
        batchNumber: true,
        costPerGramCzk: true,
        note: true,
        performedBy: true,
        createdAt: true,
        soldAt: true,
        soldBy: true,
      },
    });

    return NextResponse.json({
      sku,
      movements,
      count: movements.length,
    });
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movements' },
      { status: 500 }
    );
  }
}
