import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { skuPhotos } from '@/lib/sku-image';
import { PIECE_LENGTHS, soldByGrams } from '@/lib/sale-rule';
export const runtime = 'nodejs';


/**
 * GET /api/sku/public/[id]
 * Public endpoint for fetching SKU details (no auth required)
 * Used by frontend to display product detail pages
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'SKU ID is required' },
        { status: 400 }
      );
    }

    const sku = await prisma.sku.findUnique({
      where: { id },
      select: {
        id: true,
        sku: true,
        name: true,
        customerCategory: true,
        shade: true,
        shadeName: true,
        lengthCm: true,
        structure: true,
        saleMode: true,
        pricePerGramCzk: true,
        weightTotalG: true,
        weightGrams: true,
        availableGrams: true,
        minOrderG: true,
        stepG: true,
        inStock: true,
        soldOut: true,
        imageUrl: true,
        images: true,
        shadeHex: true,
        isDyed: true,
      },
    });

    if (!sku) {
      return NextResponse.json(
        { error: 'SKU not found' },
        { status: 404 }
      );
    }

    const photos = skuPhotos(sku.imageUrl, sku.images);

    // Kus prodávaný po gramech: zákaznice vybírá délku (30–90 cm) a gramáž
    const lengthOptions = sku.saleMode === 'PIECE_BY_WEIGHT' && soldByGrams(sku) ? PIECE_LENGTHS : [];

    return NextResponse.json({ ...sku, imageUrl: photos[0] ?? null, images: photos, lengthOptions });
  } catch (error: any) {
    console.error('SKU public fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SKU' },
      { status: 500 }
    );
  }
}