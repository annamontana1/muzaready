import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdminClient();

    const { data: products, error } = await supabase
      .from('products')
      .select('*, variants(*)')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error.message);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    const transformedProducts = (products || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      tier: product.tier,
      base_price_per_100g_45cm: product.base_price_per_100g_45cm,
      set_id: product.set_id,
      variants: product.variants || [],
      favoritesCount: 0,
      cartItemsCount: 0,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, category, tier, base_price_per_100g_45cm, set_id } = body;

    if (!name || !tier || base_price_per_100g_45cm === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, tier, base_price_per_100g_45cm' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const { data: product, error } = await getSupabaseAdminClient()
      .from('products')
      .insert({
        id: randomUUID(),
        name,
        category: category || null,
        tier,
        base_price_per_100g_45cm: parseFloat(base_price_per_100g_45cm),
        set_id: set_id || null,
        createdAt: now,
        updatedAt: now,
      })
      .select('*, variants(*)')
      .single();

    if (error) {
      console.error('Error creating product:', error.message);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
