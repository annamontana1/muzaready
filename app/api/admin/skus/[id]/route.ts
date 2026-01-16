import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const sku = await prisma.sku.findUnique({
      where: { id: params.id },
      include: {
        movements: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10, // Last 10 movements
        },
        _count: {
          select: {
            orderItems: true,
            movements: true,
          },
        },
      },
    });

    if (!sku) {
      return NextResponse.json({ error: 'SKU not found' }, { status: 404 });
    }

    return NextResponse.json(sku, { status: 200 });
  } catch (error) {
    console.error('Error fetching SKU:', error);
    return NextResponse.json({ error: 'Failed to fetch SKU' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      name,
      description,
      images,
      shade,
      shadeName,
      shadeHex,
      lengthCm,
      structure,
      customerCategory,
      pricePerGramCzk,
      pricePerGramEur,
      weightTotalG,
      weightGrams,
      availableGrams,
      minOrderG,
      stepG,
      inStock,
      isListed,
      listingPriority,
      soldOut,
    } = body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = images;
    if (shade !== undefined) updateData.shade = shade;
    if (shadeName !== undefined) updateData.shadeName = shadeName;
    if (shadeHex !== undefined) updateData.shadeHex = shadeHex;
    if (lengthCm !== undefined) updateData.lengthCm = lengthCm;
    if (structure !== undefined) updateData.structure = structure;
    if (customerCategory !== undefined) updateData.customerCategory = customerCategory;
    if (pricePerGramCzk !== undefined) updateData.pricePerGramCzk = pricePerGramCzk;
    if (pricePerGramEur !== undefined) updateData.pricePerGramEur = pricePerGramEur;
    if (weightTotalG !== undefined) updateData.weightTotalG = weightTotalG;
    if (weightGrams !== undefined) updateData.weightGrams = weightGrams;
    if (availableGrams !== undefined) updateData.availableGrams = availableGrams;
    if (minOrderG !== undefined) updateData.minOrderG = minOrderG;
    if (stepG !== undefined) updateData.stepG = stepG;
    if (isListed !== undefined) updateData.isListed = isListed;
    if (listingPriority !== undefined) updateData.listingPriority = listingPriority;
    if (soldOut !== undefined) updateData.soldOut = soldOut;

    if (inStock !== undefined) {
      updateData.inStock = inStock;
      updateData.inStockSince = inStock ? new Date() : null;
    }

    const updatedSku = await prisma.sku.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(updatedSku, { status: 200 });
  } catch (error) {
    console.error('Error updating SKU:', error);
    return NextResponse.json({ error: 'Failed to update SKU' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Check if SKU has order items
    const sku = await prisma.sku.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!sku) {
      return NextResponse.json({ error: 'SKU not found' }, { status: 404 });
    }

    if (sku._count.orderItems > 0) {
      return NextResponse.json(
        { error: 'Cannot delete SKU with existing order items. Mark as soldOut instead.' },
        { status: 400 }
      );
    }

    await prisma.sku.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'SKU deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting SKU:', error);
    return NextResponse.json({ error: 'Failed to delete SKU' }, { status: 500 });
  }
}
