import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin, verifyAdminSession } from '@/lib/admin-auth';
export const runtime = 'nodejs';


const SINGLETON_ID = 'GLOBAL_RATE';

type ExchangeRateRecord = {
  czk_to_eur: any;
  description: string | null;
  lastUpdated: Date;
  updatedBy: string | null;
};

const serializeRate = (rate: ExchangeRateRecord) => {
  const czkToEur = Number(rate.czk_to_eur);
  return {
    czkToEur,
    eurToCzk: czkToEur === 0 ? 0 : Number((1 / czkToEur).toFixed(6)),
    description: rate.description,
    lastUpdated: rate.lastUpdated,
    updatedBy: rate.updatedBy,
  };
};

export async function GET() {
  try {
    const rate = await prisma.exchangeRate.findFirst({
      where: { id: SINGLETON_ID },
    });

    if (!rate) {
      return NextResponse.json(
        { error: 'Exchange rate not set' },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeRate(rate));
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rate' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { eurToCzk, czkToEur, description } = body ?? {};

    let czkToEurValue: number | null = null;

    if (typeof czkToEur === 'number' && czkToEur > 0) {
      czkToEurValue = czkToEur;
    } else if (typeof eurToCzk === 'number' && eurToCzk > 0) {
      czkToEurValue = Number((1 / eurToCzk).toFixed(6));
    }

    if (!czkToEurValue) {
      return NextResponse.json(
        { error: 'eurToCzk or czkToEur must be provided and greater than zero.' },
        { status: 400 }
      );
    }

    const session = await verifyAdminSession(request);
    const updatedBy = session.valid ? session.admin?.email ?? null : null;
    const defaultDescription = `1 EUR = ${(1 / czkToEurValue).toFixed(2)} CZK`;

    const rate = await prisma.exchangeRate.upsert({
      where: { id: SINGLETON_ID },
      update: {
        czk_to_eur: czkToEurValue,
        description: description || defaultDescription,
        lastUpdated: new Date(),
        updatedBy,
      },
      create: {
        id: SINGLETON_ID,
        czk_to_eur: czkToEurValue,
        description: description || defaultDescription,
        updatedBy,
      },
    });

    return NextResponse.json(serializeRate(rate));
  } catch (error) {
    console.error('Failed to update exchange rate:', error);
    return NextResponse.json(
      { error: 'Failed to update exchange rate' },
      { status: 500 }
    );
  }
}