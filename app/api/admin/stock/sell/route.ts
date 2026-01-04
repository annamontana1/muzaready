import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';

/**
 * POST /api/admin/stock/sell
 * Sell a stock item - create OUT movement and decrease availableGrams
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { movementId, performedBy, note } = body;

    if (!movementId) {
      return NextResponse.json(
        { error: 'Movement ID is required' },
        { status: 400 }
      );
    }

    // Get the original IN movement
    const inMovement = await prisma.stockMovement.findUnique({
      where: { id: movementId },
      include: {
        sku: true,
      },
    });

    if (!inMovement) {
      return NextResponse.json(
        { error: 'Stock movement not found' },
        { status: 404 }
      );
    }

    if (inMovement.type !== 'IN') {
      return NextResponse.json(
        { error: 'Can only sell IN movements' },
        { status: 400 }
      );
    }

    // Check if already sold
    if (inMovement.soldAt) {
      return NextResponse.json(
        { error: 'This item has already been sold' },
        { status: 400 }
      );
    }

    // Check if SKU has enough stock
    if (!inMovement.sku.availableGrams || inMovement.sku.availableGrams < inMovement.grams) {
      return NextResponse.json(
        { error: `Insufficient stock. Available: ${inMovement.sku.availableGrams}g, needed: ${inMovement.grams}g` },
        { status: 400 }
      );
    }

    // Create OUT movement and update SKU in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create OUT movement
      const outMovement = await tx.stockMovement.create({
        data: {
          skuId: inMovement.skuId,
          type: 'OUT',
          grams: inMovement.grams,
          location: inMovement.location,
          batchNumber: inMovement.batchNumber,
          note: note || `Prodej položky ${inMovement.id}`,
          performedBy,
          refOrderId: null, // Will be set when creating actual order
        },
      });

      // Mark original IN movement as sold
      await tx.stockMovement.update({
        where: { id: movementId },
        data: {
          soldAt: new Date(),
          soldBy: performedBy,
        },
      });

      // Decrease SKU available grams
      const updatedSku = await tx.sku.update({
        where: { id: inMovement.skuId },
        data: {
          availableGrams: { decrement: inMovement.grams },
        },
      });

      // Mark as out of stock if necessary
      if (updatedSku.availableGrams <= 0) {
        await tx.sku.update({
          where: { id: inMovement.skuId },
          data: {
            inStock: false,
            soldOut: true,
          },
        });
      }

      return { outMovement, updatedSku };
    });

    return NextResponse.json({
      success: true,
      message: `Prodáno ${inMovement.grams}g produktu ${inMovement.sku.name || inMovement.sku.sku}`,
      outMovement: result.outMovement,
      remainingStock: result.updatedSku.availableGrams,
    });
  } catch (error) {
    console.error('Error selling stock item:', error);
    return NextResponse.json(
      { error: 'Failed to sell stock item' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/stock/sell?movementId=xxx
 * Get details of a stock movement for selling
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const movementId = searchParams.get('movementId');

    if (!movementId) {
      return NextResponse.json(
        { error: 'Movement ID is required' },
        { status: 400 }
      );
    }

    const movement = await prisma.stockMovement.findUnique({
      where: { id: movementId },
      include: {
        sku: {
          select: {
            id: true,
            sku: true,
            name: true,
            shadeName: true,
            lengthCm: true,
            availableGrams: true,
            priceCzkTotal: true,
            pricePerGramCzk: true,
          },
        },
      },
    });

    if (!movement) {
      return NextResponse.json(
        { error: 'Stock movement not found' },
        { status: 404 }
      );
    }

    // Calculate price
    const price = movement.sku.priceCzkTotal ||
                  (movement.sku.pricePerGramCzk * movement.grams) ||
                  0;

    return NextResponse.json({
      movement: {
        id: movement.id,
        grams: movement.grams,
        location: movement.location,
        batchNumber: movement.batchNumber,
        createdAt: movement.createdAt,
        soldAt: movement.soldAt,
        soldBy: movement.soldBy,
      },
      sku: movement.sku,
      price,
      canSell: movement.type === 'IN' && !movement.soldAt,
    });
  } catch (error) {
    console.error('Error fetching movement details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movement details' },
      { status: 500 }
    );
  }
}
