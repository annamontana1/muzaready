import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/catalog-adapter';
export const runtime = 'nodejs';


export const dynamic = 'force-dynamic';

/**
 * GET /api/catalog/[slug]
 * Get a single product by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Fetch all products and find by slug
    // We need to check all categories
    const categories: Array<'nebarvene_panenske' | 'barvene_blond' | undefined> = [
      undefined, // all
      'nebarvene_panenske',
      'barvene_blond',
    ];

    for (const category of categories) {
      const products = await getCatalogProducts(category);
      const product = products.find((p) => p.slug === slug);

      if (product) {
        return NextResponse.json(product, { status: 200 });
      }
    }

    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
