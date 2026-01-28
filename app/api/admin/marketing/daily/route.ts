import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/marketing/daily
 * Get daily aggregated metrics for charts
 *
 * Query params:
 * - platform: meta | google | all
 * - days: 7 | 30 | 90
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'all';
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate() - days);

    // Build where clause
    const where: any = {
      level: 'campaign',
      date: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    if (platform !== 'all') {
      where.platform = platform;
    }

    // Fetch daily metrics
    const metrics = await prisma.marketingMetricsDaily.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    // Group by date and aggregate
    const dailyMap = new Map();

    for (const metric of metrics) {
      const dateKey = metric.date.toISOString().split('T')[0];

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          impressions: 0,
          clicks: 0,
          spend: 0,
          conversions: 0,
          conversionValue: 0,
        });
      }

      const daily = dailyMap.get(dateKey);
      daily.impressions += metric.impressions;
      daily.clicks += metric.clicks;
      daily.spend += metric.spend;
      daily.conversions += metric.conversions;
      daily.conversionValue += metric.conversionValue;
    }

    // Calculate metrics and convert to array
    const dailyData = Array.from(dailyMap.values()).map((d) => {
      const ctr = d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0;
      const cpc = d.clicks > 0 ? d.spend / d.clicks : 0;
      const cpa = d.conversions > 0 ? d.spend / d.conversions : 0;
      const roas = d.spend > 0 ? d.conversionValue / d.spend : 0;

      return {
        date: d.date,
        impressions: d.impressions,
        clicks: d.clicks,
        spend: d.spend,
        conversions: d.conversions,
        conversionValue: d.conversionValue,
        ctr: parseFloat(ctr.toFixed(2)),
        cpc: Math.round(cpc),
        cpa: Math.round(cpa),
        roas: parseFloat(roas.toFixed(2)),
      };
    });

    return NextResponse.json({
      daily: dailyData,
      dateRange: {
        from: dateFrom.toISOString().split('T')[0],
        to: dateTo.toISOString().split('T')[0],
      },
    });
  } catch (error: any) {
    console.error('Get daily metrics error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání denních metrik' },
      { status: 500 }
    );
  }
}
