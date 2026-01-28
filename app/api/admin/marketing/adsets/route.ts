import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/marketing/adsets
 * Get ad sets with aggregated metrics
 *
 * Query params:
 * - platform: meta | google
 * - campaignId: filter by campaign (optional)
 * - days: 7 | 30 | 90
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'meta';
    const campaignId = searchParams.get('campaignId');
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate() - days);

    const where: any = {
      platform,
      level: 'adset',
      date: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    if (campaignId) {
      where.campaignId = campaignId;
    }

    // Fetch ad set metrics
    const metrics = await prisma.marketingMetricsDaily.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    // Group by ad set and aggregate
    const adsetMap = new Map();

    for (const metric of metrics) {
      const key = metric.entityId;

      if (!adsetMap.has(key)) {
        adsetMap.set(key, {
          adsetId: metric.entityId,
          adsetName: metric.entityName,
          campaignId: metric.campaignId,
          campaignName: metric.campaignName,
          impressions: 0,
          clicks: 0,
          spend: 0,
          conversions: 0,
          conversionValue: 0,
          days: 0,
        });
      }

      const adset = adsetMap.get(key);
      adset.impressions += metric.impressions;
      adset.clicks += metric.clicks;
      adset.spend += metric.spend;
      adset.conversions += metric.conversions;
      adset.conversionValue += metric.conversionValue;
      adset.days++;
    }

    // Calculate metrics and convert to array
    const adsets = Array.from(adsetMap.values()).map((a) => {
      const ctr = a.impressions > 0 ? (a.clicks / a.impressions) * 100 : 0;
      const cpc = a.clicks > 0 ? a.spend / a.clicks : 0;
      const cpa = a.conversions > 0 ? a.spend / a.conversions : 0;
      const roas = a.spend > 0 ? a.conversionValue / a.spend : 0;

      return {
        ...a,
        ctr: parseFloat(ctr.toFixed(2)),
        cpc: Math.round(cpc),
        cpa: Math.round(cpa),
        roas: parseFloat(roas.toFixed(2)),
      };
    });

    // Sort by spend desc
    adsets.sort((a, b) => b.spend - a.spend);

    return NextResponse.json({
      adsets,
      dateRange: {
        from: dateFrom.toISOString().split('T')[0],
        to: dateTo.toISOString().split('T')[0],
      },
    });
  } catch (error: any) {
    console.error('Get ad sets error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání ad setů' },
      { status: 500 }
    );
  }
}
