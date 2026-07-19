import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveShadeRange(
  tier: string,
  category: string,
  shade: number | null
): { shadeRangeStart: number; shadeRangeEnd: number } {
  if (tier === 'baby_shades') return { shadeRangeStart: 7, shadeRangeEnd: 10 };
  if (category === 'barvene') return { shadeRangeStart: 5, shadeRangeEnd: 10 };
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
    const { shadeRangeStart, shadeRangeEnd } = resolveShadeRange(tier, category, shade);

    const { data: row, error } = await getSupabaseAdminClient()
      .from('price_matrix')
      .select('pricePerGramCzk')
      .eq('category', category)
      .eq('tier', tier)
      .eq('lengthCm', lengthCm)
      .eq('shadeRangeStart', shadeRangeStart)
      .eq('shadeRangeEnd', shadeRangeEnd)
      .maybeSingle();

    if (error) {
      console.error('Price-check error:', error.message);
      return NextResponse.json(
        { error: 'Chyba při vyhledávání ceny: ' + error.message },
        { status: 500 }
      );
    }

    if (!row) {
      return NextResponse.json(
        { error: `Cena není v matici (${tier} ${category} ${shadeRangeStart}-${shadeRangeEnd} ${lengthCm}cm)` },
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
