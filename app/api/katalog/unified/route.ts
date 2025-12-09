import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { mockProducts } from '@/lib/mock-products';
import { Product } from '@/types/product';
import { formatPlatinumName, formatPlatinumSlug } from '@/lib/platinum-format';
export const runtime = 'nodejs';


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
  weightGrams?: number; // PIECE
  pricePerGramCzk?: number; // BULK
  pricePerGramEur?: number;
  priceCzk?: number; // PIECE
  priceEur?: number;
  inStock: boolean;
  priority: number;
}

export async function GET(request: NextRequest) {
  try {
    const items: UnifiedItem[] = [];
    let priority = 0;
    let czkToEur = 1 / 25.5;
    try {
      const rate = await prisma.exchangeRate.findFirst({ where: { id: 'GLOBAL_RATE' } });
      if (rate) {
        czkToEur = Number(rate.czk_to_eur);
      }
    } catch (err) {
      console.warn('Exchange rate lookup failed, using fallback', err);
    }

    // ============================================================
    // BULK: Products (Standard/LUXE) - configurable items
    // ============================================================
    const products: Product[] = mockProducts || [];
    for (const product of products) {
      // Skip Platinum (those go in PIECE)
      if (product.tier === 'Platinum edition') continue;
      if (!product.variants || product.variants.length === 0) continue;
      // Only show products that are in stock
      if (!product.in_stock) continue;

      const firstVariant = product.variants[0];

      const pricePerGram = product.base_price_per_100g_45cm / 100;
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
        pricePerGramCzk: pricePerGram,
        pricePerGramEur: Number((pricePerGram * czkToEur).toFixed(3)),
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
          inStock: true, // Only show items in stock
          soldOut: false, // Exclude sold out items
        },
        take: 100,
      });

      for (const sku of skus) {
        // Skip items that are not in stock (already filtered in query, but double-check)
        if (!sku.inStock || sku.soldOut) continue;

        const shadeCode = sku.shade ? parseInt(sku.shade, 10) : undefined;
        const weight = sku.weightGrams ?? sku.weightTotalG ?? undefined;
        const isPlatinum = sku.customerCategory === 'PLATINUM_EDITION';
        const pieceName = isPlatinum
          ? formatPlatinumName(sku.lengthCm, shadeCode, weight) || sku.name || `Vlasy ${sku.sku}`
          : sku.name || `Vlasy ${sku.sku}`;
        const pieceSlug = isPlatinum ? formatPlatinumSlug(sku.lengthCm, shadeCode, weight) : undefined;
        const tierLabel = isPlatinum
          ? 'Platinum edition'
          : sku.customerCategory === 'LUXE'
          ? 'LUXE'
          : 'Standard';
        const computedPriceCzk = weight
          ? Number(((sku.pricePerGramCzk || 0) * weight).toFixed(2))
          : Number((sku.pricePerGramCzk || 0).toFixed(2));
        const priceCzk = sku.priceCzkTotal ?? computedPriceCzk;
        const priceEur = Number((priceCzk * czkToEur).toFixed(2));

        items.push({
          type: 'PIECE',
          id: sku.id,
          slug: pieceSlug,
          name: pieceName,
          tier: tierLabel,
          shade: shadeCode,
          shadeName: sku.shadeName || undefined,
          structure: sku.structure || undefined,
          lengthCm: sku.lengthCm || undefined,
          weightGrams: weight,
          priceCzk,
          priceEur,
          inStock: true, // All items here are in stock (already filtered)
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