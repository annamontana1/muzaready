import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { createSku, createBulkSkus, lookupPrice, type CreateSkuInput, type BulkLengthEntry } from '@/lib/sku-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/skus/create
 *
 * Unified endpoint for creating SKUs.
 *
 * Single SKU:
 * {
 *   category, tier, shade, structure, lengthCm,
 *   initialGrams?, location?, batchNumber?, costPerGramCzk?,
 *   pricePerGramCzk?, saleMode?, weightTotalG?, czechHair?,
 *   imageUrl?, isListed?, listingPriority?, minOrderG?, stepG?,
 *   createStockMovement?
 * }
 *
 * Bulk SKU (multiple lengths):
 * {
 *   category, tier, shade, structure,
 *   lengths: [{ lengthCm, initialGrams, location? }],
 *   ... same optional fields as above
 * }
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const {
      category,
      tier,
      shade,
      structure,
      lengths,
      ...rest
    } = body;

    // Validate required fields
    if (!category || !tier || !shade || !structure) {
      return NextResponse.json(
        { error: 'Chybi povinna pole: category, tier, shade, structure' },
        { status: 400 }
      );
    }

    const shadeNum = Number(shade);
    if (!shadeNum || shadeNum < 1 || shadeNum > 10) {
      return NextResponse.json(
        { error: 'Neplatny odstin (1-10)' },
        { status: 400 }
      );
    }

    // Bulk creation (multiple lengths)
    if (Array.isArray(lengths) && lengths.length > 0) {
      const bulkLengths: BulkLengthEntry[] = lengths.map((l: any) => ({
        lengthCm: Number(l.lengthCm),
        initialGrams: Number(l.initialGrams) || 0,
        location: l.location,
      }));

      // Validate all lengths
      for (const l of bulkLengths) {
        if (!l.lengthCm || l.lengthCm < 20 || l.lengthCm > 120) {
          return NextResponse.json(
            { error: `Neplatna delka: ${l.lengthCm}cm` },
            { status: 400 }
          );
        }
      }

      const baseInput: Omit<CreateSkuInput, 'lengthCm' | 'initialGrams'> = {
        category,
        tier,
        shade: shadeNum,
        structure,
        ...rest,
      };

      const results = await createBulkSkus(baseInput, bulkLengths);

      return NextResponse.json({
        success: true,
        created: results.length,
        skus: results.map((r) => ({
          id: r.sku.id,
          code: r.sku.sku,
          shortCode: r.shortCode,
          lengthCm: r.sku.lengthCm,
          pricePerGramCzk: r.sku.pricePerGramCzk,
          qrCodeUrl: r.qrCodeUrl,
          movementId: r.stockMovement?.id,
        })),
      }, { status: 201 });
    }

    // Single SKU creation
    const { lengthCm, initialGrams, ...singleRest } = rest;

    if (!lengthCm) {
      return NextResponse.json(
        { error: 'Chybi delka (lengthCm)' },
        { status: 400 }
      );
    }

    const input: CreateSkuInput = {
      category,
      tier,
      shade: shadeNum,
      structure,
      lengthCm: Number(lengthCm),
      initialGrams: Number(initialGrams) || 0,
      ...singleRest,
    };

    const result = await createSku(input);

    return NextResponse.json({
      success: true,
      created: 1,
      skus: [{
        id: result.sku.id,
        code: result.sku.sku,
        shortCode: result.shortCode,
        lengthCm: result.sku.lengthCm,
        pricePerGramCzk: result.sku.pricePerGramCzk,
        qrCodeUrl: result.qrCodeUrl,
        movementId: result.stockMovement?.id,
      }],
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error in /api/admin/skus/create:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU kod jiz existuje' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Neznama chyba pri vytvareni SKU' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/skus/create?lookup=price&category=...&tier=...&lengthCm=...&shade=...
 *
 * Price lookup endpoint for the form to preview prices from the matrix.
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('lookup');

    if (action === 'price') {
      const category = searchParams.get('category') || '';
      const tier = searchParams.get('tier') || '';
      const lengthCm = Number(searchParams.get('lengthCm') || 0);
      const shade = Number(searchParams.get('shade') || 0);
      const czechHair = searchParams.get('czechHair') === 'true';

      if (!category || !tier || !lengthCm || !shade) {
        return NextResponse.json(
          { error: 'Chybi parametry pro vyhledani ceny' },
          { status: 400 }
        );
      }

      const price = await lookupPrice({ category, tier, lengthCm, shade, czechHair });

      return NextResponse.json({
        found: price !== null,
        pricePerGramCzk: price,
        category,
        tier,
        lengthCm,
        shade,
      });
    }

    return NextResponse.json({ error: 'Neznama akce' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in GET /api/admin/skus/create:', error);
    return NextResponse.json(
      { error: error.message || 'Chyba' },
      { status: 500 }
    );
  }
}
