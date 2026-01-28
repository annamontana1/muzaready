import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getMetaCredentials,
  fetchCampaignInsights,
  fetchAdSetInsights,
} from '@/lib/marketing/meta-ads-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Extended timeout for API calls

/**
 * POST /api/admin/marketing/sync
 * Manually trigger data sync from Meta Ads
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { platform = 'meta', days = 7 } = body;

    if (platform !== 'meta') {
      return NextResponse.json(
        { error: 'Pouze Meta Ads je podporováno' },
        { status: 400 }
      );
    }

    // Load credentials
    const credentials = await getMetaCredentials();

    if (!credentials) {
      return NextResponse.json(
        { error: 'Meta Ads není připojeno' },
        { status: 400 }
      );
    }

    // Calculate date range
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate() - days);

    const dateFromStr = dateFrom.toISOString().split('T')[0];
    const dateToStr = dateTo.toISOString().split('T')[0];

    // Fetch campaign insights
    const campaignInsights = await fetchCampaignInsights(
      credentials,
      dateFromStr,
      dateToStr
    );

    // Fetch adset insights
    const adsetInsights = await fetchAdSetInsights(
      credentials,
      dateFromStr,
      dateToStr
    );

    // Save to database
    let savedCampaigns = 0;
    let savedAdSets = 0;

    for (const insight of campaignInsights) {
      await prisma.marketingMetricsDaily.upsert({
        where: {
          date_platform_level_entityId: {
            date: new Date(insight.date),
            platform: 'meta',
            level: 'campaign',
            entityId: insight.campaignId,
          },
        },
        create: {
          date: new Date(insight.date),
          platform: 'meta',
          level: 'campaign',
          entityId: insight.campaignId,
          entityName: insight.campaignName,
          impressions: insight.impressions,
          clicks: insight.clicks,
          spend: insight.spend,
          conversions: insight.conversions,
          conversionValue: insight.conversionValue,
          ctr: insight.ctr,
          cpc: insight.cpc,
          cpa: insight.cpa,
          roas: insight.roas,
        },
        update: {
          entityName: insight.campaignName,
          impressions: insight.impressions,
          clicks: insight.clicks,
          spend: insight.spend,
          conversions: insight.conversions,
          conversionValue: insight.conversionValue,
          ctr: insight.ctr,
          cpc: insight.cpc,
          cpa: insight.cpa,
          roas: insight.roas,
        },
      });

      savedCampaigns++;
    }

    for (const insight of adsetInsights) {
      await prisma.marketingMetricsDaily.upsert({
        where: {
          date_platform_level_entityId: {
            date: new Date(insight.date),
            platform: 'meta',
            level: 'adset',
            entityId: insight.adsetId,
          },
        },
        create: {
          date: new Date(insight.date),
          platform: 'meta',
          level: 'adset',
          entityId: insight.adsetId,
          entityName: insight.adsetName,
          campaignId: insight.campaignId,
          campaignName: insight.campaignName,
          impressions: insight.impressions,
          clicks: insight.clicks,
          spend: insight.spend,
          conversions: insight.conversions,
          conversionValue: insight.conversionValue,
          ctr: insight.ctr,
          cpc: insight.cpc,
          cpa: insight.cpa,
          roas: insight.roas,
        },
        update: {
          entityName: insight.adsetName,
          campaignName: insight.campaignName,
          impressions: insight.impressions,
          clicks: insight.clicks,
          spend: insight.spend,
          conversions: insight.conversions,
          conversionValue: insight.conversionValue,
          ctr: insight.ctr,
          cpc: insight.cpc,
          cpa: insight.cpa,
          roas: insight.roas,
        },
      });

      savedAdSets++;
    }

    // Update last sync time
    await prisma.marketingConnection.updateMany({
      where: { platform: 'meta' },
      data: { lastSync: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: `Synchronizováno ${savedCampaigns} kampaní a ${savedAdSets} ad setů`,
      stats: {
        campaigns: savedCampaigns,
        adSets: savedAdSets,
        dateRange: {
          from: dateFromStr,
          to: dateToStr,
        },
      },
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      {
        error: 'Chyba při synchronizaci: ' + (error.message || String(error)),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/marketing/sync
 * Get last sync status
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const connection = await prisma.marketingConnection.findFirst({
      where: { platform: 'meta', connected: true },
    });

    if (!connection) {
      return NextResponse.json({
        synced: false,
        message: 'Meta Ads není připojeno',
      });
    }

    // Get metrics count
    const metricsCount = await prisma.marketingMetricsDaily.count({
      where: { platform: 'meta' },
    });

    // Get latest metric date
    const latestMetric = await prisma.marketingMetricsDaily.findFirst({
      where: { platform: 'meta' },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({
      synced: metricsCount > 0,
      lastSync: connection.lastSync,
      metricsCount,
      latestDate: latestMetric?.date,
    });
  } catch (error: any) {
    console.error('Get sync status error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání stavu' },
      { status: 500 }
    );
  }
}
