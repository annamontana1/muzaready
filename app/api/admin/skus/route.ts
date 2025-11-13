import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const skus = await prisma.sku.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(skus);
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    return NextResponse.json({ error: 'Failed to fetch SKUs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      sku,
      name,
      shade,
      shadeName,
      lengthCm,
      structure,
      saleMode,
      pricePerGramCzk,
      weightTotalG,
      availableGrams,
      minOrderG,
      stepG,
      inStock,
    } = body;

    if (!sku || !saleMode || !pricePerGramCzk) {
      return NextResponse.json({ error: 'Chybí povinná pole' }, { status: 400 });
    }

    if (saleMode === 'PIECE_BY_WEIGHT' && !weightTotalG) {
      return NextResponse.json({ error: 'Culík musí mít váhu' }, { status: 400 });
    }

    if (saleMode === 'BULK_G' && !availableGrams) {
      return NextResponse.json({ error: 'Sypané vlasy musí mít dostupné gramy' }, { status: 400 });
    }

    const newSku = await prisma.sku.create({
      data: {
        sku,
        name: name || null,
        shade: shade || null,
        shadeName: shadeName || null,
        lengthCm: lengthCm || null,
        structure: structure || null,
        saleMode,
        pricePerGramCzk,
        weightTotalG: saleMode === 'PIECE_BY_WEIGHT' ? weightTotalG : null,
        availableGrams: saleMode === 'BULK_G' ? availableGrams : null,
        minOrderG: saleMode === 'BULK_G' ? minOrderG : null,
        stepG: saleMode === 'BULK_G' ? stepG : null,
        inStock: inStock || false,
        inStockSince: inStock ? new Date() : null,
      },
    });

    return NextResponse.json(newSku, { status: 201 });
  } catch (error) {
    console.error('Error creating SKU:', error);
    return NextResponse.json({ error: 'Failed to create SKU' }, { status: 500 });
  }
}
