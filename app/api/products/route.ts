import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';

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

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, category, tier, base_price_per_100g_45cm } = body;

    // Validation
    if (!name || !category || !tier || base_price_per_100g_45cm === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, tier, base_price_per_100g_45cm' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        category,
        tier,
        base_price_per_100g_45cm: parseFloat(base_price_per_100g_45cm),
        set_id: null, // Will be assigned later if needed
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(
      {
        id: product.id,
        name: product.name,
        category: product.category,
        tier: product.tier,
        base_price_per_100g_45cm: product.base_price_per_100g_45cm,
        set_id: product.set_id,
        variants: product.variants,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}