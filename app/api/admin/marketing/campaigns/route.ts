import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/marketing/campaigns
 * Get campaigns with aggregated metrics
 *
 * Query params:
 * - platform: meta | google
 * - days: 7 | 30 | 90
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || 'meta';
    const days = parseInt(searchParams.get('days') || '30');

    // Calculate date range
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate() - days);

    // Fetch campaign metrics
    const metrics = await prisma.marketingMetricsDaily.findMany({
      where: {
        platform,
        level: 'campaign',
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
      orderBy: { date: 'desc' },
    });

    // Group by campaign and aggregate
    const campaignMap = new Map();

    for (const metric of metrics) {
      const key = metric.entityId;

      if (!campaignMap.has(key)) {
        campaignMap.set(key, {
          campaignId: metric.entityId,
          campaignName: metric.entityName,
          impressions: 0,
          clicks: 0,
          spend: 0,
          conversions: 0,
          conversionValue: 0,
          days: 0,
        });
      }

      const campaign = campaignMap.get(key);
      campaign.impressions += metric.impressions;
      campaign.clicks += metric.clicks;
      campaign.spend += metric.spend;
      campaign.conversions += metric.conversions;
      campaign.conversionValue += metric.conversionValue;
      campaign.days++;
    }

    // Calculate metrics and convert to array
    const campaigns = Array.from(campaignMap.values()).map((c) => {
      const ctr = c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;
      const cpc = c.clicks > 0 ? c.spend / c.clicks : 0;
      const cpa = c.conversions > 0 ? c.spend / c.conversions : 0;
      const roas = c.spend > 0 ? c.conversionValue / c.spend : 0;

      return {
        ...c,
        ctr: parseFloat(ctr.toFixed(2)),
        cpc: Math.round(cpc),
        cpa: Math.round(cpa),
        roas: parseFloat(roas.toFixed(2)),
      };
    });

    // Sort by spend desc
    campaigns.sort((a, b) => b.spend - a.spend);

    return NextResponse.json({
      campaigns,
      dateRange: {
        from: dateFrom.toISOString().split('T')[0],
        to: dateTo.toISOString().split('T')[0],
      },
    });
  } catch (error: any) {
    console.error('Get campaigns error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání kampaní' },
      { status: 500 }
    );
  }
}
