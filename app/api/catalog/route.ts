import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/catalog-adapter';
import { ProductCategory, ProductTier } from '@/types/product';
export const runtime = 'nodejs';


export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') as ProductCategory | null;
    const tier = searchParams.get('tier') as ProductTier | null;

    const products = await getCatalogProducts(category || undefined, tier || undefined);
    
    // Debug logging
    console.log(`[Catalog API] Category: ${category}, Tier: ${tier}, Products found: ${products.length}`);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching catalog products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
