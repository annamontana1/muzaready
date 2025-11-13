import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockProducts } from '@/lib/mock-products';
import { Product } from '@/types/product';

/**
 * Unified catalog endpoint
 * Returns both BULK (Product) and PIECE (SKU) items in a single response
 *
 * BULK: Standard/LUXE products with configurable parameters
 * PIECE: Platinum/unique SKU items with fixed specs
 */

interface UnifiedItem {
  type: 'BULK' | 'PIECE';
  id: string;
  slug?: string; // BULK only
  name: string;
  tier: string; // "Standard" | "LUXE" | "Platinum edition"
  shade?: number; // 1-10
  shadeName?: string;
  structure?: string;
  lengthCm?: number;
  weightG?: number; // PIECE
  pricePerGramCzk?: number; // BULK
  priceCzk?: number; // PIECE
  inStock: boolean;
  priority: number;
}

export async function GET(request: NextRequest) {
  try {
    const items: UnifiedItem[] = [];
    let priority = 0;

    // ============================================================
    // BULK: Products (Standard/LUXE) - configurable items
    // ============================================================
    const products: Product[] = mockProducts || [];
    for (const product of products) {
      // Skip Platinum (those go in PIECE)
      if (product.tier === 'Platinum edition') continue;
      if (!product.variants || product.variants.length === 0) continue;

      const firstVariant = product.variants[0];

      items.push({
        type: 'BULK',
        id: product.id,
        slug: product.slug,
        name: product.name,
        tier: product.tier,
        shade: firstVariant?.shade,
        shadeName: firstVariant?.shade_name,
        structure: firstVariant?.structure,
        lengthCm: firstVariant?.length_cm,
        pricePerGramCzk: product.base_price_per_100g_45cm, // per gram
        inStock: product.in_stock,
        priority: priority++,
      });
    }

    // ============================================================
    // PIECE: SKUs from database (Platinum & unique items)
    // ============================================================
    try {
      const skus = await prisma.sku.findMany({
        where: {
          isListed: true, // Only show listed SKUs
        },
        take: 100,
      });

      for (const sku of skus) {
        items.push({
          type: 'PIECE',
          id: sku.id,
          name: sku.name || `Vlasy ${sku.sku}`,
          tier: sku.customerCategory === 'PLATINUM_EDITION'
            ? 'Platinum edition'
            : sku.customerCategory === 'LUXE'
            ? 'LUXE'
            : 'Standard',
          shade: sku.shade ? parseInt(sku.shade) : undefined,
          shadeName: sku.shadeName || undefined,
          structure: sku.structure || undefined,
          lengthCm: sku.lengthCm || undefined,
          weightG: sku.weightTotalG || sku.availableGrams || undefined,
          priceCzk: Math.round(sku.pricePerGramCzk * (sku.weightTotalG || 100)),
          inStock: sku.inStock && !sku.soldOut,
          priority: priority++,
        });
      }
    } catch (dbError) {
      console.warn('Could not fetch SKUs from database, continuing with mock data only:', dbError);
    }

    return NextResponse.json(items, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error('Catalog unified error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 }
    );
  }
}
