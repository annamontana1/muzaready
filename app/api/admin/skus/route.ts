import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import {
  validateFilters,
  buildSkuFilters,
  calculatePagination,
  type SkuFilters,
} from '@/lib/sku-filter-utils';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Parse query parameters
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

    // Validate and sanitize filters
    const filters: SkuFilters = validateFilters(rawFilters);

    // Set defaults for pagination
    const page = filters.page || 1;
    const limit = filters.limit || 25;
    const skip = (page - 1) * limit;

    // Build Prisma WHERE clause
    const where = buildSkuFilters(filters);

    // Execute queries in parallel
    const [skus, total] = await Promise.all([
      prisma.sku.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.sku.count({ where }),
    ]);

    // Calculate pagination metadata
    const pagination = calculatePagination(page, limit, total);

    // Return response with data and metadata
    return NextResponse.json({
      skus,
      pagination,
      appliedFilters: filters,
    });
  } catch (error) {
    console.error('Error fetching SKUs:', error);
    return NextResponse.json({ error: 'Failed to fetch SKUs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;
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
      weightGrams,
      availableGrams,
      minOrderG,
      stepG,
      inStock,
    } = body;

    if (!sku || !saleMode || !pricePerGramCzk) {
      return NextResponse.json({ error: 'Chybí povinná pole' }, { status: 400 });
    }

    if (saleMode === 'PIECE_BY_WEIGHT' && !(weightTotalG || weightGrams)) {
      return NextResponse.json({ error: 'Culík musí mít váhu' }, { status: 400 });
    }

    if (saleMode === 'BULK_G' && !availableGrams) {
      return NextResponse.json({ error: 'Sypané vlasy musí mít dostupné gramy' }, { status: 400 });
    }

    const resolvedInStock = typeof inStock === 'boolean' ? inStock : true;

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
        weightTotalG: saleMode === 'PIECE_BY_WEIGHT' ? (weightTotalG || weightGrams) : null,
        weightGrams: saleMode === 'PIECE_BY_WEIGHT' ? (weightGrams || weightTotalG) : null,
        availableGrams: saleMode === 'BULK_G' ? availableGrams : null,
        minOrderG: saleMode === 'BULK_G' ? minOrderG : null,
        stepG: saleMode === 'BULK_G' ? stepG : null,
        inStock: resolvedInStock,
        inStockSince: resolvedInStock ? new Date() : null,
        isListed: true,
      },
    });

    return NextResponse.json(newSku, { status: 201 });
  } catch (error) {
    console.error('Error creating SKU:', error);
    return NextResponse.json({ error: 'Failed to create SKU' }, { status: 500 });
  }
}