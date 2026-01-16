import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/skus/bulk-delete
 * Delete multiple SKUs at once (only those without orders)
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { ids, deleteAll } = await request.json();

    // Get SKUs to delete
    let skusToDelete;

    if (deleteAll) {
      // Delete all SKUs without orders
      skusToDelete = await prisma.sku.findMany({
        where: {
          orderItems: {
            none: {},
          },
        },
        select: { id: true, sku: true },
      });
    } else if (ids && Array.isArray(ids)) {
      // Delete specific SKUs
      skusToDelete = await prisma.sku.findMany({
        where: {
          id: { in: ids },
          orderItems: {
            none: {},
          },
        },
        select: { id: true, sku: true },
      });
    } else {
      return NextResponse.json(
        { error: 'Either ids array or deleteAll flag is required' },
        { status: 400 }
      );
    }

    if (skusToDelete.length === 0) {
      return NextResponse.json({
        deleted: 0,
        message: 'No SKUs found to delete (or all have existing orders)',
      });
    }

    const idsToDelete = skusToDelete.map((s) => s.id);

    // First delete related records (cascade doesn't work for all relations)
    await prisma.stockMovement.deleteMany({
      where: { skuId: { in: idsToDelete } },
    });

    await prisma.scanItem.deleteMany({
      where: { skuId: { in: idsToDelete } },
    });

    await prisma.review.deleteMany({
      where: { skuId: { in: idsToDelete } },
    });

    await prisma.stockTakeItem.deleteMany({
      where: { skuId: { in: idsToDelete } },
    });

    // Now delete the SKUs
    const result = await prisma.sku.deleteMany({
      where: { id: { in: idsToDelete } },
    });

    return NextResponse.json({
      deleted: result.count,
      deletedSkus: skusToDelete.map((s) => s.sku),
      message: `Successfully deleted ${result.count} SKUs`,
    });
  } catch (error) {
    console.error('Error deleting SKUs:', error);
    return NextResponse.json(
      { error: 'Failed to delete SKUs' },
      { status: 500 }
    );
  }
}
