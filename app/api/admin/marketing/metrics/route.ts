import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/marketing/metrics
 * Get metrics for charts and tables
 *
 * Query params:
 * - platform: meta | google | all
 * - level: campaign | adset | ad
 * - days: 7 | 30 | 90
 * - campaignId: filter by campaign (optional)
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'meta';
    const level = searchParams.get('level') || 'campaign';
    const days = parseInt(searchParams.get('days') || '30');
    const campaignId = searchParams.get('campaignId');

    // Calculate date range
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate() - days);

    // Build where clause
    const where: any = {
      platform: platform === 'all' ? undefined : platform,
      level,
      date: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    if (campaignId) {
      where.campaignId = campaignId;
    }

    // Fetch metrics
    const metrics = await prisma.marketingMetricsDaily.findMany({
      where,
      orderBy: [{ date: 'desc' }, { entityName: 'asc' }],
    });

    // Calculate aggregates
    const totals = metrics.reduce(
      (acc, m) => {
        acc.impressions += m.impressions;
        acc.clicks += m.clicks;
        acc.spend += m.spend;
        acc.conversions += m.conversions;
        acc.conversionValue += m.conversionValue;
        return acc;
      },
      {
        impressions: 0,
        clicks: 0,
        spend: 0,
        conversions: 0,
        conversionValue: 0,
      }
    );

    // Calculate aggregate metrics
    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
    const cpa = totals.conversions > 0 ? totals.spend / totals.conversions : 0;
    const roas = totals.spend > 0 ? totals.conversionValue / totals.spend : 0;

    return NextResponse.json({
      metrics,
      totals: {
        ...totals,
        ctr: parseFloat(ctr.toFixed(2)),
        cpc: Math.round(cpc),
        cpa: Math.round(cpa),
        roas: parseFloat(roas.toFixed(2)),
      },
      dateRange: {
        from: dateFrom.toISOString().split('T')[0],
        to: dateTo.toISOString().split('T')[0],
      },
    });
  } catch (error: any) {
    console.error('Get metrics error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání metrik' },
      { status: 500 }
    );
  }
}
