import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { generateNextShortCode } from '@/lib/short-code';
import { validateFilters, calculatePagination, type SkuFilters } from '@/lib/sku-filter-utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const structureCodeMap: Record<string, string> = {
  'rovné': 'R',
  'mírně vlnité': 'MV',
  'vlnité': 'V',
  'kudrnaté': 'K',
};

const tierPrefixMap: Record<string, string> = {
  STANDARD: 'STD',
  LUXE: 'LUX',
  PLATINUM_EDITION: 'PLAT',
};

const tierLabelMap: Record<string, string> = {
  STANDARD: 'Standard',
  LUXE: 'LUXE',
  PLATINUM_EDITION: 'Platinum',
};

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const rawFilters: any = {
      search: searchParams.get('search'),
      shades: searchParams.get('shades')?.split(','),
      lengths: searchParams.get('lengths')?.split(','),
      stockStatus: searchParams.get('stockStatus'),
      saleModes: searchParams.get('saleModes')?.split(','),
      categories: searchParams.get('categories')?.split(','),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    };

    const filters: SkuFilters = validateFilters(rawFilters);
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdminClient();
    let query = supabase.from('skus').select('*', { count: 'exact' });

    // Apply search filter
    if (filters.search) {
      query = query.or(`sku.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
    }

    // Apply shade filter
    if (filters.shades && filters.shades.length > 0) {
      query = query.in('shade', filters.shades);
    }

    // Apply length filter
    if (filters.lengths && filters.lengths.length > 0) {
      query = query.in('lengthCm', filters.lengths);
    }

    // Apply stock status filter
    if (filters.stockStatus && filters.stockStatus !== 'ALL') {
      switch (filters.stockStatus) {
        case 'IN_STOCK':
          query = query.eq('inStock', true).or('weightTotalG.gt.0,availableGrams.gt.0');
          break;
        case 'SOLD_OUT':
          query = query.or('soldOut.eq.true,inStock.eq.false');
          break;
        case 'LOW_STOCK':
          query = query.eq('inStock', true).or('weightTotalG.lt.100,availableGrams.lt.100');
          break;
      }
    }

    // Apply sale mode filter
    if (filters.saleModes && filters.saleModes.length > 0) {
      query = query.in('saleMode', filters.saleModes);
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      query = query.in('customerCategory', filters.categories);
    }

    query = query.order('createdAt', { ascending: false }).range(offset, offset + limit - 1);

    const { data: skus, error, count } = await query;

    if (error) {
      console.error('Error fetching SKUs:', error.message);
      return NextResponse.json({ error: 'Failed to fetch SKUs' }, { status: 500 });
    }

    const total = count ?? 0;
    const pagination = calculatePagination(page, limit, total);

    return NextResponse.json({ skus: skus || [], pagination, appliedFilters: filters });
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    return NextResponse.json({ error: 'Failed to fetch SKUs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      sku: manualSku, name: manualName, shade, shadeName, shadeHex,
      lengthCm, structure, customerCategory, saleMode, pricePerGramCzk,
      weightTotalG, weightGrams, availableGrams, minOrderG, stepG,
      inStock, isListed, listingPriority,
    } = body;

    if (!saleMode || !pricePerGramCzk) {
      return NextResponse.json({ error: 'Chybí povinná pole' }, { status: 400 });
    }
    if (saleMode === 'PIECE_BY_WEIGHT' && !(weightTotalG || weightGrams)) {
      return NextResponse.json({ error: 'Culík musí mít váhu' }, { status: 400 });
    }
    if (saleMode === 'BULK_G' && !availableGrams) {
      return NextResponse.json({ error: 'Sypané vlasy musí mít dostupné gramy' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const cat = customerCategory || 'STANDARD';

    // Auto-generate SKU code with duplicate protection
    let finalSku: string;
    if (manualSku) {
      finalSku = manualSku;
    } else {
      const tierPrefix = tierPrefixMap[cat] || 'STD';
      const shadeCode = shade ? String(shade).replace(/\D/g, '').padStart(2, '0') : '00';
      const strCode = structureCodeMap[structure] || 'R';
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      const baseSkuCode = `X-NB-${tierPrefix}-O${shadeCode}-S${strCode}-${dateStr}-01`;

      finalSku = baseSkuCode;
      let counter = 1;
      while (true) {
        const { data: existing } = await supabase.from('skus').select('id').eq('sku', finalSku).maybeSingle();
        if (!existing) break;
        counter += 1;
        finalSku = `${baseSkuCode}-${String(counter).padStart(2, '0')}`;
      }
    }

    const finalName = manualName || (shadeName
      ? `${tierLabelMap[cat] || 'Standard'} – ${shadeName}`
      : tierLabelMap[cat] || 'Standard');

    const shortCode = await generateNextShortCode();
    const resolvedInStock = typeof inStock === 'boolean' ? inStock : true;
    const resolvedIsListed = typeof isListed === 'boolean' ? isListed : true;
    const now = new Date().toISOString();

    const { data: newSku, error } = await supabase
      .from('skus')
      .insert({
        id: randomUUID(),
        sku: finalSku,
        shortCode,
        name: finalName,
        shade: shade || null,
        shadeName: shadeName || null,
        shadeHex: shadeHex || null,
        lengthCm: lengthCm || null,
        structure: structure || null,
        customerCategory: customerCategory || null,
        saleMode,
        pricePerGramCzk,
        weightTotalG: saleMode === 'PIECE_BY_WEIGHT' ? (weightTotalG || weightGrams) : null,
        weightGrams: saleMode === 'PIECE_BY_WEIGHT' ? (weightGrams || weightTotalG) : null,
        availableGrams: saleMode === 'BULK_G' ? availableGrams : null,
        minOrderG: saleMode === 'BULK_G' ? minOrderG : null,
        stepG: saleMode === 'BULK_G' ? stepG : null,
        inStock: resolvedInStock,
        inStockSince: resolvedInStock ? now : null,
        isListed: resolvedIsListed,
        listingPriority: listingPriority || null,
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating SKU:', error.message);
      return NextResponse.json({ error: 'Failed to create SKU' }, { status: 500 });
    }

    return NextResponse.json(newSku, { status: 201 });
  } catch (error) {
    console.error('Error creating SKU:', error);
    return NextResponse.json({ error: 'Failed to create SKU' }, { status: 500 });
  }
}
