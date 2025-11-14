import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/catalog-adapter';
import { ProductCategory, ProductTier } from '@/types/product';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as ProductCategory | null;
    const tier = searchParams.get('tier') as ProductTier | null;

    const products = await getCatalogProducts(category || undefined, tier || undefined);

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching catalog products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch catalog products' },
      { status: 500 }
    );
  }
}

