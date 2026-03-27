import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/pos/price-check?category=barvene&tier=standard&lengthCm=50
 *
 * Looks up the price-per-gram from the PriceMatrix table.
 * Returns { pricePerGramCzk: number } or { error: string }.
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // nebarvene | barvene
    const tier = searchParams.get('tier'); // standard | luxe | platinum_edition | baby_shades
    const lengthCmRaw = searchParams.get('lengthCm');

    if (!category || !tier || !lengthCmRaw) {
      return NextResponse.json(
        { error: 'Chybějící parametry: category, tier, lengthCm' },
        { status: 400 }
      );
    }

    const lengthCm = parseInt(lengthCmRaw, 10);
    if (isNaN(lengthCm)) {
      return NextResponse.json(
        { error: 'lengthCm musí být číslo' },
        { status: 400 }
      );
    }

    const row = await prisma.priceMatrix.findFirst({
      where: { category, tier, lengthCm },
    });

    if (!row) {
      return NextResponse.json(
        { error: 'Cena není v matici' },
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
