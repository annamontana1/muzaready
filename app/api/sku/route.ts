import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET SKUs with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tier = searchParams.get('tier');
    const isListed = searchParams.get('isListed');

    const where: any = {};
    if (category) where.shade = { contains: category }; // Simplified, adjust as needed
    if (tier) where.customerCategory = tier;
    if (isListed !== null) where.isListed = isListed === 'true';

    const skus = await prisma.sku.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(skus, { status: 200 });
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    return NextResponse.json({ error: 'Failed to fetch SKUs' }, { status: 500 });
  }
}

// POST – create new SKU(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      skuCode,
      name,
      category,
      tier,
      shade,
      shadeName,
      structure,
      lengthCm,
      saleMode, // 'BULK_G' or 'PIECE_BY_WEIGHT'
      pricePerGramCzk,
      // BULK_G specific
      availableGrams,
      minOrderG,
      stepG,
      // PIECE_BY_WEIGHT specific
      weightTotalG,
      // Common
      isListed,
      listingPriority,
    } = body;

    if (!skuCode || !saleMode || !pricePerGramCzk) {
      return NextResponse.json(
        { error: 'Missing required fields: skuCode, saleMode, pricePerGramCzk' },
        { status: 400 }
      );
    }

    // Map category string to enum
    let customerCategory: any = category;
    if (tier === 'standard') customerCategory = 'STANDARD';
    else if (tier === 'luxe') customerCategory = 'LUXE';
    else if (tier === 'platinum') customerCategory = 'PLATINUM_EDITION';

    // Create SKU
    const sku = await prisma.sku.create({
      data: {
        sku: skuCode,
        name: name || skuCode,
        shade,
        shadeName,
        structure,
        lengthCm,
        customerCategory,
        saleMode,
        pricePerGramCzk: Math.round(parseFloat(pricePerGramCzk) * 100) / 100, // Store as integer cents or decimal
        // BULK_G
        availableGrams: saleMode === 'BULK_G' ? availableGrams : null,
        minOrderG: saleMode === 'BULK_G' ? minOrderG : null,
        stepG: saleMode === 'BULK_G' ? stepG : null,
        // PIECE_BY_WEIGHT
        weightTotalG: saleMode === 'PIECE_BY_WEIGHT' ? weightTotalG : null,
        // Listing
        isListed: isListed || false,
        listingPriority: isListed ? listingPriority : null,
        inStock: true,
      },
    });

    return NextResponse.json(
      { success: true, sku },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating SKU:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: `SKU ${error.meta?.target?.[0]} již existuje` },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create SKU' },
      { status: 500 }
    );
  }
}
