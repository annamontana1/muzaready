import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/stock/receive
 * Receive stock (naskladnění zboží)
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { skuId, grams, location, batchNumber, costPerGramCzk, note, performedBy } = body;

    // Validation
    if (!skuId || !grams || grams <= 0) {
      return NextResponse.json(
        { error: 'SKU ID a množství (grams) jsou povinné' },
        { status: 400 }
      );
    }

    // Check if SKU exists
    const sku = await prisma.sku.findUnique({
      where: { id: skuId },
    });

    if (!sku) {
      return NextResponse.json(
        { error: 'SKU nenalezeno' },
        { status: 404 }
      );
    }

    // Create stock movement and update SKU in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create IN movement
      const movement = await tx.stockMovement.create({
        data: {
          skuId,
          type: 'IN',
          grams,
          location,
          batchNumber,
          costPerGramCzk,
          note,
          performedBy,
        },
      });

      // Update SKU available grams
      const currentGrams = sku.availableGrams || 0;
      const newGrams = currentGrams + grams;

      const updatedSku = await tx.sku.update({
        where: { id: skuId },
        data: {
          availableGrams: newGrams,
          inStock: newGrams > 0,
          soldOut: false, // Mark as not sold out when receiving stock
          inStockSince: !sku.inStock ? new Date() : sku.inStockSince,
        },
      });

      return { movement, sku: updatedSku };
    });

    return NextResponse.json({
      success: true,
      message: `Naskladněno ${grams}g produktu ${sku.name || sku.sku}`,
      movement: result.movement,
      sku: {
        id: result.sku.id,
        sku: result.sku.sku,
        name: result.sku.name,
        availableGrams: result.sku.availableGrams,
        inStock: result.sku.inStock,
      },
    });
  } catch (error) {
    console.error('Error receiving stock:', error);
    return NextResponse.json(
      { error: 'Chyba při naskladňování' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/stock/receive
 * Get recent stock receipts
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const skuId = searchParams.get('skuId');

    const movements = await prisma.stockMovement.findMany({
      where: {
        type: 'IN',
        ...(skuId && { skuId }),
      },
      include: {
        sku: {
          select: {
            id: true,
            sku: true,
            name: true,
            shadeName: true,
            lengthCm: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({
      movements,
      total: movements.length,
    });
  } catch (error) {
    console.error('Error fetching stock receipts:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání příjmů' },
      { status: 500 }
    );
  }
}
