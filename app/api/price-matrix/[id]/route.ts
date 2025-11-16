import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const EXCHANGE_RATE_ID = 'GLOBAL_RATE';
const FALLBACK_CZK_TO_EUR = 1 / 25.5;

async function resolveCzkToEur() {
  const rate = await prisma.exchangeRate.findFirst({
    where: { id: EXCHANGE_RATE_ID },
  });
  if (!rate) {
    console.warn('Exchange rate not set, using fallback 1 EUR = 25.5 CZK');
    return FALLBACK_CZK_TO_EUR;
  }
  return Number(rate.czk_to_eur);
}

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

    const czkToEur = await resolveCzkToEur();

    const updated = await prisma.priceMatrix.update({
      where: { id: params.id },
      data: {
        pricePerGramCzk,
        pricePerGramEur: Number((pricePerGramCzk * czkToEur).toFixed(3)),
      },
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
