import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * Search SKU by shortCode or ID
 * GET /api/sku/search?code=M0001
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code')?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: 'Missing code parameter' },
        { status: 400 }
      );
    }

    // Search by shortCode first
    let sku = await prisma.sku.findFirst({
      where: {
        shortCode: code,
      },
    });

    // If not found by shortCode, try SKU field
    if (!sku) {
      sku = await prisma.sku.findFirst({
        where: {
          sku: code,
        },
      });
    }

    if (!sku) {
      return NextResponse.json(
        { error: 'Product not found', code },
        { status: 404 }
      );
    }

    // Return product details
    return NextResponse.json({
      id: sku.id,
      shortCode: sku.shortCode,
      sku: sku.sku,
      name: sku.name,
      shade: sku.shade,
      shadeName: sku.shadeName,
      lengthCm: sku.lengthCm,
      structure: sku.structure,
      weightGrams: sku.weightGrams || sku.weightTotalG,
      priceCzk: sku.priceCzkTotal,
      pricePerGramCzk: sku.pricePerGramCzk,
      inStock: sku.inStock,
      soldOut: sku.soldOut,
      customerCategory: sku.customerCategory,
    });
  } catch (error: any) {
    console.error('SKU search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
