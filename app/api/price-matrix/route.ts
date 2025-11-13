import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all price matrix entries or filter by category/tier
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tier = searchParams.get('tier');

    const where: any = {};
    if (category) where.category = category;
    if (tier) where.tier = tier;

    const entries = await prisma.priceMatrix.findMany({
      where,
      orderBy: [{ category: 'asc' }, { tier: 'asc' }, { lengthCm: 'asc' }],
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
    const body = await request.json();
    const { entries } = body; // Array of { category, tier, lengthCm, pricePerGramCzk }

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: 'entries must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate all entries
    for (const entry of entries) {
      const { category, tier, lengthCm, pricePerGramCzk } = entry;
      if (!category || !tier || !lengthCm || pricePerGramCzk === undefined) {
        return NextResponse.json(
          { error: 'All entries must have category, tier, lengthCm, pricePerGramCzk' },
          { status: 400 }
        );
      }
    }

    // Upsert all entries
    const results = await Promise.all(
      entries.map((entry) =>
        prisma.priceMatrix.upsert({
          where: {
            category_tier_lengthCm: {
              category: entry.category,
              tier: entry.tier,
              lengthCm: entry.lengthCm,
            },
          },
          update: {
            pricePerGramCzk: entry.pricePerGramCzk,
          },
          create: entry,
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
