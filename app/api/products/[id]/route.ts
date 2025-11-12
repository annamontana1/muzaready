import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  id: string;
}

export async function GET(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Produkt ID je vyžadován' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Produkt nebyl nalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání produktu' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Produkt ID je vyžadován' },
        { status: 400 }
      );
    }

    const { name, tier, base_price_per_100g_45cm } = body;

    // Validate required fields
    if (!name || !tier || base_price_per_100g_45cm === undefined) {
      return NextResponse.json(
        { error: 'Název, tier a cena jsou vyžadovány' },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        tier,
        base_price_per_100g_45cm: parseFloat(base_price_per_100g_45cm),
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci produktu' },
      { status: 500 }
    );
  }
}
