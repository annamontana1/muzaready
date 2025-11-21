import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';


/**
 * GET /api/sku/[id]
 * Fetch a single SKU item by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'SKU ID is required' },
        { status: 400 }
      );
    }

    const sku = await prisma.sku.findUnique({
      where: { id },
      include: {
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!sku) {
      return NextResponse.json(
        { error: 'SKU not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(sku);
  } catch (error: any) {
    console.error('SKU fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SKU' },
      { status: 500 }
    );
  }
}