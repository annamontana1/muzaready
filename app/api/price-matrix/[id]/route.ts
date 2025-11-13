import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single price matrix entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entry = await prisma.priceMatrix.findUnique({
      where: { id: params.id },
    });

    if (!entry) {
      return NextResponse.json(
        { error: 'Price matrix entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(entry, { status: 200 });
  } catch (error) {
    console.error('Error fetching price matrix entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price matrix entry' },
      { status: 500 }
    );
  }
}

// PUT – update single price matrix entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { pricePerGramCzk } = body;

    if (pricePerGramCzk === undefined) {
      return NextResponse.json(
        { error: 'pricePerGramCzk is required' },
        { status: 400 }
      );
    }

    const updated = await prisma.priceMatrix.update({
      where: { id: params.id },
      data: { pricePerGramCzk },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Price matrix entry not found' },
        { status: 404 }
      );
    }
    console.error('Error updating price matrix:', error);
    return NextResponse.json(
      { error: 'Failed to update price matrix' },
      { status: 500 }
    );
  }
}

// DELETE single price matrix entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.priceMatrix.delete({
      where: { id: params.id },
    });

    return NextResponse.json(deleted, { status: 200 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Price matrix entry not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting price matrix:', error);
    return NextResponse.json(
      { error: 'Failed to delete price matrix' },
      { status: 500 }
    );
  }
}
