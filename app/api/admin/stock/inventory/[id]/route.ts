import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Params {
  id: string;
}

/**
 * GET /api/admin/stock/inventory/[id]
 * Get single stock take details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    const stockTake = await prisma.stockTake.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            sku: true,
          },
        },
      },
    });

    if (!stockTake) {
      return NextResponse.json(
        { error: 'Inventura nenalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json(stockTake);
  } catch (error) {
    console.error('Error fetching stock take:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání inventury' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/stock/inventory/[id]
 * Update stock take status or add/update items
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();
    const { status, items } = body;

    // Update status
    if (status) {
      const stockTake = await prisma.stockTake.update({
        where: { id },
        data: {
          status,
          ...(status === 'IN_PROGRESS' && !body.startedAt ? { startedAt: new Date() } : {}),
          ...(status === 'COMPLETED' && !body.completedAt ? { completedAt: new Date() } : {}),
        },
      });

      // If completing inventory, create adjustment movements for differences
      if (status === 'COMPLETED') {
        const stockTakeItems = await prisma.stockTakeItem.findMany({
          where: { stockTakeId: id },
        });

        // Create adjustments for items with differences
        for (const item of stockTakeItems) {
          if (item.difference !== 0) {
            await prisma.stockMovement.create({
              data: {
                skuId: item.skuId,
                type: 'ADJUST',
                grams: item.difference, // Positive or negative
                note: `Inventurní úprava - ${stockTake.name}`,
                reason: 'inventory_adjustment',
              },
            });

            // Update SKU available grams
            await prisma.sku.update({
              where: { id: item.skuId },
              data: {
                availableGrams: item.countedGrams,
                inStock: item.countedGrams > 0,
              },
            });
          }
        }
      }

      return NextResponse.json({
        success: true,
        stockTake,
      });
    }

    // Add or update items
    if (items && Array.isArray(items)) {
      const createdItems = [];

      for (const item of items) {
        const { skuId, countedGrams, expectedGrams, location, notes } = item;

        const difference = countedGrams - expectedGrams;

        const stockTakeItem = await prisma.stockTakeItem.create({
          data: {
            stockTakeId: id,
            skuId,
            expectedGrams,
            countedGrams,
            difference,
            location,
            notes,
          },
        });

        createdItems.push(stockTakeItem);
      }

      return NextResponse.json({
        success: true,
        items: createdItems,
      });
    }

    return NextResponse.json(
      { error: 'Žádná data k aktualizaci' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating stock take:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci inventury' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/stock/inventory/[id]
 * Delete stock take
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    // Check if already completed
    const stockTake = await prisma.stockTake.findUnique({
      where: { id },
    });

    if (stockTake?.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Nelze smazat dokončenou inventuru' },
        { status: 400 }
      );
    }

    await prisma.stockTake.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Inventura smazána',
    });
  } catch (error) {
    console.error('Error deleting stock take:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání inventury' },
      { status: 500 }
    );
  }
}
