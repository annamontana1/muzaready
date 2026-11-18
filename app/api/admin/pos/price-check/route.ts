import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { pickMatrixRow, type MatrixRow } from '@/lib/price-matrix-bands';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tierRaw = searchParams.get('tier');
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

    const tier = tierRaw === 'platinum_edition' ? 'platinum' : tierRaw;
    const shade = shadeRaw ? parseInt(shadeRaw, 10) : null;
    // Všechny řádky ceníku pro kategorii × typ × délku; pásmo se vybere podle odstínu
    // (pásmo obsahující odstín → nejbližší pásmo → jediný řádek).
    const { data: rows, error } = await getSupabaseAdminClient()
      .from('price_matrix')
      .select('category, tier, lengthCm, shadeRangeStart, shadeRangeEnd, pricePerGramCzk')
      .eq('category', category)
      .eq('tier', tier)
      .eq('lengthCm', lengthCm);

    if (error) {
      console.error('Price-check error:', error.message);
      return NextResponse.json(
        { error: 'Chyba při vyhledávání ceny: ' + error.message },
        { status: 500 }
      );
    }

    const row = pickMatrixRow((rows || []) as MatrixRow[], shade);

    if (!row || !Number(row.pricePerGramCzk)) {
      return NextResponse.json(
        { error: `Cena není v ceníku (${tier} ${category} ${lengthCm} cm) — zadejte ji ručně` },
        { status: 404 }
      );
    }

    return NextResponse.json({ pricePerGramCzk: Number(row.pricePerGramCzk) });
  } catch (error: any) {
    console.error('Price-check error:', error);
    return NextResponse.json(
      { error: 'Chyba při vyhledávání ceny: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
