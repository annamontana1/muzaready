import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Fetch products with variants
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match existing frontend format
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      tier: product.tier,
      base_price_per_100g_45cm: product.base_price_per_100g_45cm,
      set_id: product.set_id,
      variants: product.variants.map((v) => ({
        id: v.id,
        name: v.name,
        length: parseInt(v.name), // Extract cm as number
      })),
    }));

    return NextResponse.json(transformedProducts, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
