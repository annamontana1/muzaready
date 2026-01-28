/**
 * Meta Ads (Facebook) API Client
 * Wrapper pro volání Facebook Graph API pro marketing data
 */

interface MetaCredentials {
  accessToken: string;
  adAccountId: string;
}

interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  date: string;
  impressions: number;
  clicks: number;
  spend: number; // v CZK cents
  conversions: number;
  conversionValue: number; // v CZK cents
  ctr?: number;
  cpc?: number;
  cpa?: number;
  roas?: number;
}

interface AdSetMetrics extends CampaignMetrics {
  adsetId: string;
  adsetName: string;
}

/**
 * Načte credentials z databáze
 */
export async function getMetaCredentials(): Promise<MetaCredentials | null> {
  try {
    const prisma = (await import('@/lib/prisma')).default;

    const connection = await prisma.marketingConnection.findFirst({
      where: {
        platform: 'meta',
        connected: true,
      },
    });

    if (!connection || !connection.credentials) {
      return null;
    }

    const creds = JSON.parse(connection.credentials);
    return {
      accessToken: creds.accessToken,
      adAccountId: creds.adAccountId,
    };
  } catch (error) {
    console.error('Failed to load Meta credentials:', error);
    return null;
  }
}

/**
 * Fetch campaigns z Meta Ads
 */
export async function fetchMetaCampaigns(
  credentials: MetaCredentials,
  datePreset: string = 'last_30d'
): Promise<any[]> {
  const { accessToken, adAccountId } = credentials;

  const fields = [
    'id',
    'name',
    'status',
    'objective',
    'daily_budget',
    'lifetime_budget',
    'created_time',
    'updated_time',
  ].join(',');

  const url = `https://graph.facebook.com/v18.0/${adAccountId}/campaigns?fields=${fields}&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Meta API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch ad sets z Meta Ads
 */
export async function fetchMetaAdSets(
  credentials: MetaCredentials,
  campaignId?: string
): Promise<any[]> {
  const { accessToken, adAccountId } = credentials;

  const fields = [
    'id',
    'name',
    'campaign_id',
    'status',
    'daily_budget',
    'lifetime_budget',
    'targeting',
    'created_time',
    'updated_time',
  ].join(',');

  let url = `https://graph.facebook.com/v18.0/${adAccountId}/adsets?fields=${fields}&access_token=${accessToken}`;

  if (campaignId) {
    url = `https://graph.facebook.com/v18.0/${campaignId}/adsets?fields=${fields}&access_token=${accessToken}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Meta API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch ads z Meta Ads
 */
export async function fetchMetaAds(
  credentials: MetaCredentials,
  adsetId?: string
): Promise<any[]> {
  const { accessToken, adAccountId } = credentials;

  const fields = [
    'id',
    'name',
    'adset_id',
    'status',
    'creative',
    'created_time',
    'updated_time',
  ].join(',');

  let url = `https://graph.facebook.com/v18.0/${adAccountId}/ads?fields=${fields}&access_token=${accessToken}`;

  if (adsetId) {
    url = `https://graph.facebook.com/v18.0/${adsetId}/ads?fields=${fields}&access_token=${accessToken}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Meta API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Fetch insights (metriky) pro kampaně
 */
export async function fetchCampaignInsights(
  credentials: MetaCredentials,
  dateFrom: string, // YYYY-MM-DD
  dateTo: string // YYYY-MM-DD
): Promise<CampaignMetrics[]> {
  const { accessToken, adAccountId } = credentials;

  const fields = [
    'campaign_id',
    'campaign_name',
    'impressions',
    'clicks',
    'spend',
    'actions', // obsahuje conversions
    'action_values', // obsahuje conversion value
  ].join(',');

  const url = `https://graph.facebook.com/v18.0/${adAccountId}/insights?fields=${fields}&time_range={"since":"${dateFrom}","until":"${dateTo}"}&level=campaign&time_increment=1&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Meta API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const insights = data.data || [];

  return insights.map((insight: any) => {
    const spend = parseFloat(insight.spend || '0') * 100; // CZK to cents
    const impressions = parseInt(insight.impressions || '0');
    const clicks = parseInt(insight.clicks || '0');

    // Extract conversions from actions array
    const conversions = extractConversions(insight.actions);
    const conversionValue = extractConversionValue(insight.action_values) * 100; // CZK to cents

    // Calculate metrics
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpa = conversions > 0 ? spend / conversions : 0;
    const roas = spend > 0 ? conversionValue / spend : 0;

    return {
      campaignId: insight.campaign_id,
      campaignName: insight.campaign_name,
      date: insight.date_start,
      impressions,
      clicks,
      spend: Math.round(spend),
      conversions,
      conversionValue: Math.round(conversionValue),
      ctr: parseFloat(ctr.toFixed(2)),
      cpc: Math.round(cpc),
      cpa: Math.round(cpa),
      roas: parseFloat(roas.toFixed(2)),
    };
  });
}

/**
 * Fetch insights pro ad sets
 */
export async function fetchAdSetInsights(
  credentials: MetaCredentials,
  dateFrom: string,
  dateTo: string
): Promise<AdSetMetrics[]> {
  const { accessToken, adAccountId } = credentials;

  const fields = [
    'campaign_id',
    'campaign_name',
    'adset_id',
    'adset_name',
    'impressions',
    'clicks',
    'spend',
    'actions',
    'action_values',
  ].join(',');

  const url = `https://graph.facebook.com/v18.0/${adAccountId}/insights?fields=${fields}&time_range={"since":"${dateFrom}","until":"${dateTo}"}&level=adset&time_increment=1&access_token=${accessToken}`;

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Meta API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  const insights = data.data || [];

  return insights.map((insight: any) => {
    const spend = parseFloat(insight.spend || '0') * 100;
    const impressions = parseInt(insight.impressions || '0');
    const clicks = parseInt(insight.clicks || '0');
    const conversions = extractConversions(insight.actions);
    const conversionValue = extractConversionValue(insight.action_values) * 100;

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpa = conversions > 0 ? spend / conversions : 0;
    const roas = spend > 0 ? conversionValue / spend : 0;

    return {
      campaignId: insight.campaign_id,
      campaignName: insight.campaign_name,
      adsetId: insight.adset_id,
      adsetName: insight.adset_name,
      date: insight.date_start,
      impressions,
      clicks,
      spend: Math.round(spend),
      conversions,
      conversionValue: Math.round(conversionValue),
      ctr: parseFloat(ctr.toFixed(2)),
      cpc: Math.round(cpc),
      cpa: Math.round(cpa),
      roas: parseFloat(roas.toFixed(2)),
    };
  });
}

/**
 * Helper: Extract conversions from actions array
 */
function extractConversions(actions: any[]): number {
  if (!actions || !Array.isArray(actions)) return 0;

  const conversionAction = actions.find(
    (action) =>
      action.action_type === 'purchase' ||
      action.action_type === 'offsite_conversion.fb_pixel_purchase'
  );

  return conversionAction ? parseInt(conversionAction.value) : 0;
}

/**
 * Helper: Extract conversion value from action_values array
 */
function extractConversionValue(actionValues: any[]): number {
  if (!actionValues || !Array.isArray(actionValues)) return 0;

  const valueAction = actionValues.find(
    (action) =>
      action.action_type === 'purchase' ||
      action.action_type === 'offsite_conversion.fb_pixel_purchase'
  );

  return valueAction ? parseFloat(valueAction.value) : 0;
}
