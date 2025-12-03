import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * GET /api/admin/scan-sku?sku=VLASYX-BULK-001
 * Lookup SKU information for scanning
 * Returns pricing, availability, and product details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skuCode = searchParams.get('sku');

    if (!skuCode) {
      return NextResponse.json(
        { error: 'SKU parameter is required' },
        { status: 400 }
      );
    }

    const sku = await prisma.sku.findUnique({
      where: { sku: skuCode },
    });

    if (!sku) {
      return NextResponse.json(
        { error: `SKU not found: ${skuCode}` },
        { status: 404 }
      );
    }

    if (!sku.inStock || sku.soldOut) {
      return NextResponse.json(
        { error: `Product is out of stock: ${sku.name}` },
        { status: 400 }
      );
    }

    // Return SKU data for scanning
    return NextResponse.json(
      {
        success: true,
        sku: {
          id: sku.id,
          skuCode: sku.sku,
          name: sku.name,
          shade: sku.shade,
          shadeName: sku.shadeName,
          lengthCm: sku.lengthCm,
          structure: sku.structure,
          ending: sku.ending,
          customerCategory: sku.customerCategory,
          saleMode: sku.saleMode,

          // Pricing info
          pricePerGramCzk: sku.pricePerGramCzk,
          pricePerGramEur: sku.pricePerGramEur,
          weightTotalG: sku.weightTotalG,
          weightGrams: sku.weightGrams,
          priceCzkTotal: sku.priceCzkTotal,
          priceEurTotal: sku.priceEurTotal,

          // Stock info
          availableGrams: sku.availableGrams,
          minOrderG: sku.minOrderG,
          stepG: sku.stepG,

          // Status
          inStock: sku.inStock,
          isListed: sku.isListed,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('SKU lookup error:', error);
    return NextResponse.json(
      {
        error: 'Chyba při vyhledávání SKU',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
