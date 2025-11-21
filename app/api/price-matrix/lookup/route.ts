export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';


const FALLBACK_CZK_TO_EUR = 1 / 25.5;

const tierMap: Record<string, string> = {
  STANDARD: 'standard',
  LUXE: 'luxe',
  PLATINUM: 'platinum',
};

const categoryMap: Record<string, string> = {
  NEBARVENE: 'nebarvene',
  BARVENE: 'barvene',
  CESKE: 'ceske',
};

const defaultShadeRange = (category: string, tier: string) => {
  if (category === 'barvene') return { start: 5, end: 10 };
  if (category === 'ceske') return { start: 1, end: 4 };
  if (tier === 'standard') return { start: 1, end: 4 };
  return null; // LUXE / PLATINUM pro nebarvene mají více rozsahů → vyžadují shade
};

const resolveShadeRange = (category: string, tier: string, shade?: number | null) => {
  if (shade && Number.isFinite(shade)) {
    if (category === 'barvene') return { start: 5, end: 10 };
    if (category === 'ceske') return { start: 1, end: 4 };
    if (shade <= 4) return { start: 1, end: 4 };
    if (shade <= 7) return { start: 5, end: 7 };
    return { start: 8, end: 10 };
  }
  return defaultShadeRange(category, tier);
};

/**
 * GET /api/price-matrix/lookup?line=STANDARD&segment=NEBARVENE&lengthCm=40&shade=5
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const line = searchParams.get('line');
    const segment = searchParams.get('segment');
    const lengthCm = searchParams.get('lengthCm');
    const shadeParam = searchParams.get('shade');
    const shadeRangeParam = searchParams.get('shadeRange');

    if (!line || !segment || !lengthCm) {
      return NextResponse.json(
        { error: 'Missing required parameters: line, segment, lengthCm' },
        { status: 400 }
      );
    }

    const tier = tierMap[line.toUpperCase()];
    const category = categoryMap[segment.toUpperCase()];
    const length = parseInt(lengthCm, 10);

    if (!tier || !category || Number.isNaN(length)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    let shadeRange: { start: number; end: number } | null = null;

    if (shadeRangeParam) {
      const [startStr, endStr] = shadeRangeParam.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        shadeRange = { start, end };
      }
    }

    if (!shadeRange) {
      const shadeNumber = shadeParam ? parseInt(shadeParam, 10) : null;
      shadeRange = resolveShadeRange(category, tier, shadeNumber);
    }

    if (!shadeRange) {
      return NextResponse.json(
        { error: 'Shade range required for this combination. Provide ?shade= nebo ?shadeRange=start-end.' },
        { status: 400 }
      );
    }

    const entry = await prisma.priceMatrix.findUnique({
      where: {
        category_tier_shadeRangeStart_shadeRangeEnd_lengthCm: {
          category,
          tier,
          shadeRangeStart: shadeRange.start,
          shadeRangeEnd: shadeRange.end,
          lengthCm: length,
        },
      },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Price not found in matrix', found: false }, { status: 404 });
    }

    const pricePerGramCzk = Number(entry.pricePerGramCzk);
    const pricePerGramEur = entry.pricePerGramEur
      ? Number(entry.pricePerGramEur)
      : Number((pricePerGramCzk * FALLBACK_CZK_TO_EUR).toFixed(3));

    return NextResponse.json(
      {
        found: true,
        pricePerGramCzk,
        pricePerGramEur,
        pricePer100gCzk: pricePerGramCzk * 100,
        pricePer100gEur: pricePerGramEur * 100,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error looking up price:', error);
    return NextResponse.json({ error: 'Failed to lookup price' }, { status: 500 });
  }
}