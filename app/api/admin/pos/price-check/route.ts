import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/pos/price-check?category=barvene&tier=standard&lengthCm=50&shade=3
 *
 * Looks up the price-per-gram from the PriceMatrix table.
 * shade is used to determine correct shadeRange for Platinum (1-4 vs 5-7).
 * Returns { pricePerGramCzk: number } or { error: string }.
 */

function resolveShadeRange(
  tier: string,
  category: string,
  shade: number | null
): { shadeRangeStart: number; shadeRangeEnd: number } {
  if (tier === 'baby_shades') return { shadeRangeStart: 7, shadeRangeEnd: 10 };
  if (category === 'barvene') return { shadeRangeStart: 5, shadeRangeEnd: 10 };
  // nebarvené — Platinum má dvě sady: 1-4 a 5-7
  if (tier === 'platinum' && shade !== null && shade >= 5) {
    return { shadeRangeStart: 5, shadeRangeEnd: 7 };
  }
  return { shadeRangeStart: 1, shadeRangeEnd: 4 };
}

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // nebarvene | barvene
    const tierRaw = searchParams.get('tier');       // standard | luxe | platinum_edition | baby_shades
    const lengthCmRaw = searchParams.get('lengthCm');
    const shadeRaw = searchParams.get('shade');

    if (!category || !tierRaw || !lengthCmRaw) {
      return NextResponse.json(
        { error: 'Chybějící parametry: category, tier, lengthCm' },
        { status: 400 }
      );
    }

    const lengthCm = parseInt(lengthCmRaw, 10);
    if (isNaN(lengthCm)) {
      return NextResponse.json({ error: 'lengthCm musí být číslo' }, { status: 400 });
    }

    // Normalize tier name (platinum_edition → platinum)
    const tier = tierRaw === 'platinum_edition' ? 'platinum' : tierRaw;
    const shade = shadeRaw ? parseInt(shadeRaw, 10) : null;
    const { shadeRangeStart, shadeRangeEnd } = resolveShadeRange(tier, category, shade);

    const row = await prisma.priceMatrix.findFirst({
      where: { category, tier, lengthCm, shadeRangeStart, shadeRangeEnd },
    });

    if (!row) {
      return NextResponse.json(
        { error: `Cena není v matici (${tier} ${category} ${shadeRangeStart}-${shadeRangeEnd} ${lengthCm}cm)` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      pricePerGramCzk: Number(row.pricePerGramCzk),
    });
  } catch (error: any) {
    console.error('Price-check error:', error);
    return NextResponse.json(
      { error: 'Chyba při vyhledávání ceny: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
