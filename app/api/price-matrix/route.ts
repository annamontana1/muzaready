import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
export const runtime = 'nodejs';


const EXCHANGE_RATE_ID = 'GLOBAL_RATE';
const FALLBACK_CZK_TO_EUR = 1 / 25.5;

async function resolveCzkToEur() {
  const rate = await prisma.exchangeRate.findFirst({
    where: { id: EXCHANGE_RATE_ID },
  });

  if (!rate) {
    console.warn('Exchange rate not set, using fallback 1 EUR = 25.5 CZK');
    return FALLBACK_CZK_TO_EUR;
  }

  return Number(rate.czk_to_eur);
}

// GET all price matrix entries or filter by category/tier/shade range
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tier = searchParams.get('tier');
    const shadeRangeStart = searchParams.get('shadeRangeStart');
    const shadeRangeEnd = searchParams.get('shadeRangeEnd');

    const where: Record<string, any> = {};
    if (category) where.category = category;
    if (tier) where.tier = tier;
    if (shadeRangeStart) where.shadeRangeStart = parseInt(shadeRangeStart, 10);
    if (shadeRangeEnd) where.shadeRangeEnd = parseInt(shadeRangeEnd, 10);

    const entries = await prisma.priceMatrix.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { tier: 'asc' },
        { shadeRangeStart: 'asc' },
        { lengthCm: 'asc' },
      ],
    });

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error fetching price matrix:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price matrix' },
      { status: 500 }
    );
  }
}

// POST – create or upsert price matrix entries (bulk)
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const { entries } = body; // Array of { category, tier, shadeRangeStart, shadeRangeEnd, lengthCm, pricePerGramCzk }

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: 'entries must be a non-empty array' },
        { status: 400 }
      );
    }

    for (const entry of entries) {
      const { category, tier, lengthCm, pricePerGramCzk, shadeRangeStart, shadeRangeEnd } = entry;
      if (
        !category ||
        !tier ||
        !lengthCm ||
        pricePerGramCzk === undefined ||
        shadeRangeStart === undefined ||
        shadeRangeEnd === undefined
      ) {
        return NextResponse.json(
          {
            error:
              'All entries must have category, tier, shadeRangeStart, shadeRangeEnd, lengthCm, pricePerGramCzk',
          },
          { status: 400 }
        );
      }
    }

    const czkToEur = await resolveCzkToEur();

    // Upsert all entries
    const results = await Promise.all(
      entries.map((entry) =>
        prisma.priceMatrix.upsert({
          where: {
            category_tier_shadeRangeStart_shadeRangeEnd_lengthCm: {
              category: entry.category,
              tier: entry.tier,
              shadeRangeStart: entry.shadeRangeStart,
              shadeRangeEnd: entry.shadeRangeEnd,
              lengthCm: entry.lengthCm,
            },
          },
          update: {
            pricePerGramCzk: entry.pricePerGramCzk,
            pricePerGramEur: Number((entry.pricePerGramCzk * czkToEur).toFixed(3)),
            shadeRangeStart: entry.shadeRangeStart,
            shadeRangeEnd: entry.shadeRangeEnd,
          },
          create: {
            ...entry,
            pricePerGramEur: Number((entry.pricePerGramCzk * czkToEur).toFixed(3)),
          },
        })
      )
    );

    return NextResponse.json(
      { success: true, count: results.length, entries: results },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating price matrix:', error);
    return NextResponse.json(
      { error: 'Failed to create price matrix' },
      { status: 500 }
    );
  }
}

// PUT – bulk update existing entries by ID
export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAdmin(request);
    if (authError) return authError;

    const body = await request.json();
    const entries = body.entries;

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: 'Entries must be a non-empty array' },
        { status: 400 }
      );
    }

    const czkToEur = await resolveCzkToEur();

    const updateResults = await Promise.all(
      entries.map((entry: { id: string; pricePerGramCzk: number }) =>
        prisma.priceMatrix.update({
          where: { id: entry.id },
          data: {
            pricePerGramCzk: entry.pricePerGramCzk,
            pricePerGramEur: Number((entry.pricePerGramCzk * czkToEur).toFixed(3)),
          },
        })
      )
    );

    return NextResponse.json(
      { success: true, updated: updateResults.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating price matrix:', error);
    return NextResponse.json(
      { error: 'Failed to update price matrix' },
      { status: 500 }
    );
  }
}