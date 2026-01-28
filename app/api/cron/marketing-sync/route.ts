import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  getMetaCredentials,
  fetchCampaignInsights,
  fetchAdSetInsights,
} from '@/lib/marketing/meta-ads-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes for cron

/**
 * GET /api/cron/marketing-sync
 * Daily cron job - sync yesterday's data from Meta Ads
 *
 * Run daily at 6:00 AM
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if Meta Ads is connected
    const credentials = await getMetaCredentials();

    if (!credentials) {
      console.log('[CRON] Meta Ads not connected, skipping sync');
      return NextResponse.json({
        success: true,
        message: 'Meta Ads not connected, skipped',
      });
    }

    // Sync yesterday's data
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    console.log(`[CRON] Syncing Meta Ads data for ${dateStr}`);

    // Fetch insights
    const [campaignInsights, adsetInsights] = await Promise.all([
      fetchCampaignInsights(credentials, dateStr, dateStr),
      fetchAdSetInsights(credentials, dateStr, dateStr),
    ]);

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

    // Update last sync
    await prisma.marketingConnection.updateMany({
      where: { platform: 'meta' },
      data: { lastSync: new Date() },
    });

    console.log(`[CRON] Synced ${savedCampaigns} campaigns, ${savedAdSets} ad sets for ${dateStr}`);

    return NextResponse.json({
      success: true,
      message: `Synced ${savedCampaigns} campaigns, ${savedAdSets} ad sets`,
      date: dateStr,
      stats: {
        campaigns: savedCampaigns,
        adSets: savedAdSets,
      },
    });
  } catch (error: any) {
    console.error('[CRON] Marketing sync error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
