import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Fetch products with variants
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        _count: {
          select: {
            favorites: true,
            cartItems: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to admin-friendly format
    const transformedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      tier: product.tier,
      base_price_per_100g_45cm: product.base_price_per_100g_45cm,
      set_id: product.set_id,
      variants: product.variants,
      favoritesCount: product._count.favorites,
      cartItemsCount: product._count.cartItems,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
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
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, category, tier, base_price_per_100g_45cm, set_id } = body;

    // Validation
    if (!name || !tier || base_price_per_100g_45cm === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, tier, base_price_per_100g_45cm' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        category: category || null,
        tier,
        base_price_per_100g_45cm: parseFloat(base_price_per_100g_45cm),
        set_id: set_id || null,
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

