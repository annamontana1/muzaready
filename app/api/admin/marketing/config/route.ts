import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/marketing/config
 * Načte marketing konfiguraci
 */
export async function GET(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Get or create config
    let config = await prisma.marketingConfig.findUnique({
      where: { id: 'main' },
    });

    if (!config) {
      // Create default config
      config = await prisma.marketingConfig.create({
        data: {
          id: 'main',
          businessType: 'ecommerce',
          averageOrderValue: 1000000, // 10 000 Kč v haléřích
          grossMarginPercent: 50.0,
          breakEvenRoas: 2.0, // 100 / 50
          maxCpa: 500000, // 5 000 Kč v haléřích
        },
      });
    }

    return NextResponse.json(config);
  } catch (error: any) {
    console.error('Error loading marketing config:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání konfigurace: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/marketing/config
 * Uloží marketing konfiguraci
 */
export async function POST(request: NextRequest) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      averageOrderValue,
      grossMarginPercent,
      targetRoas,
      targetCpa,
      monthlyBudget,
    } = body;

    // Validate required fields
    if (!averageOrderValue || !grossMarginPercent) {
      return NextResponse.json(
        { error: 'AOV a marže jsou povinné' },
        { status: 400 }
      );
    }

    // Calculate auto values
    const breakEvenRoas = 100 / grossMarginPercent;
    const maxCpa = Math.floor(averageOrderValue * (grossMarginPercent / 100));

    // Upsert config
    const config = await prisma.marketingConfig.upsert({
      where: { id: 'main' },
      create: {
        id: 'main',
        businessType: 'ecommerce',
        averageOrderValue,
        grossMarginPercent,
        targetRoas,
        targetCpa,
        monthlyBudget,
        breakEvenRoas,
        maxCpa,
      },
      update: {
        averageOrderValue,
        grossMarginPercent,
        targetRoas,
        targetCpa,
        monthlyBudget,
        breakEvenRoas,
        maxCpa,
      },
    });

    return NextResponse.json({
      success: true,
      config,
    });
  } catch (error: any) {
    console.error('Error saving marketing config:', error);
    return NextResponse.json(
      { error: 'Chyba při ukládání: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
