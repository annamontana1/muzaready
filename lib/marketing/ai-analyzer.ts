import Anthropic from '@anthropic-ai/sdk';
import prisma from '@/lib/prisma';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

type MetricsData = {
  platform: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  conversionValue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
};

type BusinessConfig = {
  aov: number;
  margin: number;
  targetRoas: number;
  targetCpa: number;
};

type Recommendation = {
  type: 'optimization' | 'alert' | 'opportunity';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action: string;
  platform?: string;
  campaignId?: string;
  estimatedImpact?: string;
};

/**
 * Get business configuration from database
 */
async function getBusinessConfig(): Promise<BusinessConfig> {
  const config = await prisma.marketingConfig.findFirst({
    orderBy: { updatedAt: 'desc' },
  });

  if (!config) {
    // Default values if not configured
    return {
      aov: 1000000, // 10,000 Kč in haléře
      margin: 50,
      targetRoas: 3.0,
      targetCpa: 500000, // 5,000 Kč in haléře
    };
  }

  return {
    aov: config.aov,
    margin: config.margin,
    targetRoas: config.targetRoas,
    targetCpa: config.targetCpa,
  };
}

/**
 * Create system prompt for hair extensions marketing analysis
 */
function createSystemPrompt(config: BusinessConfig): string {
  const avgOrderValue = config.aov / 100; // Convert to Kč
  const breakEvenRoas = 100 / config.margin;
  const maxCpa = (avgOrderValue * config.margin) / 100;

  return `You are an expert AI marketing analyst specializing in e-commerce for luxury hair extensions (panenské vlasy) in the Czech market.

# Business Context
- Company: Muzahair.cz
- Product: Premium hair extensions (panenské vlasy)
- Average Order Value (AOV): ${avgOrderValue.toLocaleString('cs-CZ')} Kč
- Gross Margin: ${config.margin}%
- Target ROAS: ${config.targetRoas}x
- Target CPA: ${(config.targetCpa / 100).toLocaleString('cs-CZ')} Kč
- Break-even ROAS: ${breakEvenRoas.toFixed(2)}x
- Max profitable CPA: ${maxCpa.toLocaleString('cs-CZ')} Kč

# Primary Marketing Channel
Meta Ads (Instagram/Facebook) is the primary channel. Instagram is especially effective for visual products like hair extensions.

# Your Task
Analyze the provided marketing metrics and generate 3-5 actionable recommendations. For each recommendation, provide:

1. **Type**: optimization (improve existing), alert (problem to fix), or opportunity (new potential)
2. **Priority**: high, medium, or low
3. **Title**: Short, clear headline (max 60 chars)
4. **Description**: Explain what you found (2-3 sentences)
5. **Impact**: Expected business impact (e.g., "Zvýšení ROAS o 0.5x", "Úspora 5,000 Kč/měsíc")
6. **Action**: Specific action to take (e.g., "Zvýš denní budget o 20%", "Zastaví kampaň XYZ")

# Focus Areas
- ROAS optimization (target: ${config.targetRoas}x+)
- CPA reduction (target: below ${(config.targetCpa / 100).toLocaleString('cs-CZ')} Kč)
- Budget allocation between campaigns
- Underperforming campaigns to pause
- High-performing campaigns to scale
- CTR improvement opportunities
- Audience targeting suggestions

# Response Format
Return a JSON array of recommendations. Each recommendation must include all fields.

Example:
[
  {
    "type": "alert",
    "priority": "high",
    "title": "Kampaň s negativním ROAS",
    "description": "Kampaň 'Winter Sale' má ROAS pouze 0.8x, což je pod break-even ${breakEvenRoas.toFixed(2)}x. Za posledních 30 dní jsi utratil 15,000 Kč s minimálními konverzemi.",
    "impact": "Ušetření až 10,000 Kč měsíčně",
    "action": "Pozastav kampaň a přerozdělej budget do top performerů",
    "platform": "meta",
    "campaignId": "123456789",
    "estimatedImpact": "+15% celkový ROAS"
  }
]

Be specific, data-driven, and actionable. Use Czech language for all text fields.`;
}

/**
 * Format metrics data for Claude analysis
 */
function formatMetricsForAnalysis(
  allMetrics: MetricsData[],
  campaignMetrics: any[],
  config: BusinessConfig
): string {
  const formatCurrency = (cents: number) =>
    (cents / 100).toLocaleString('cs-CZ') + ' Kč';

  let analysis = `# Marketing Performance Data\n\n`;

  // Overall summary
  analysis += `## Overall Performance\n`;
  allMetrics.forEach((m) => {
    if (m.spend === 0) return;
    analysis += `\n### ${m.platform.toUpperCase()}\n`;
    analysis += `- Spend: ${formatCurrency(m.spend)}\n`;
    analysis += `- Impressions: ${m.impressions.toLocaleString('cs-CZ')}\n`;
    analysis += `- Clicks: ${m.clicks.toLocaleString('cs-CZ')}\n`;
    analysis += `- CTR: ${m.ctr.toFixed(2)}%\n`;
    analysis += `- CPC: ${formatCurrency(m.cpc)}\n`;
    analysis += `- Conversions: ${m.conversions}\n`;
    analysis += `- CPA: ${formatCurrency(m.cpa)}\n`;
    analysis += `- Revenue: ${formatCurrency(m.conversionValue)}\n`;
    analysis += `- ROAS: ${m.roas.toFixed(2)}x\n`;
  });

  // Campaign breakdown
  if (campaignMetrics.length > 0) {
    analysis += `\n## Campaign Breakdown (Top 10 by Spend)\n`;
    campaignMetrics.slice(0, 10).forEach((c) => {
      analysis += `\n### ${c.campaignName} (ID: ${c.campaignId})\n`;
      analysis += `- Platform: ${c.platform || 'meta'}\n`;
      analysis += `- Spend: ${formatCurrency(c.spend)}\n`;
      analysis += `- Conversions: ${c.conversions}\n`;
      analysis += `- ROAS: ${c.roas.toFixed(2)}x\n`;
      analysis += `- CPA: ${formatCurrency(c.cpa)}\n`;

      // Flag issues
      const breakEvenRoas = 100 / config.margin;
      if (c.roas < breakEvenRoas && c.spend > 50000) {
        analysis += `- ⚠️ WARNING: Below break-even ROAS\n`;
      }
      if (c.roas > config.targetRoas) {
        analysis += `- ✅ OPPORTUNITY: High ROAS, consider scaling\n`;
      }
    });
  }

  return analysis;
}

/**
 * Analyze marketing data and generate AI recommendations
 */
export async function generateRecommendations(
  days: number = 30
): Promise<Recommendation[]> {
  try {
    // Fetch business config
    const config = await getBusinessConfig();

    // Calculate date range
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setDate(dateTo.getDate() - days);

    // Fetch metrics for all platforms
    const metricsMeta = await prisma.marketingMetricsDaily.findMany({
      where: {
        platform: 'meta',
        level: 'campaign',
        date: { gte: dateFrom, lte: dateTo },
      },
    });

    const metricsGoogle = await prisma.marketingMetricsDaily.findMany({
      where: {
        platform: 'google',
        level: 'campaign',
        date: { gte: dateFrom, lte: dateTo },
      },
    });

    // Check if we have any data
    if (metricsMeta.length === 0 && metricsGoogle.length === 0) {
      return [];
    }

    // Aggregate by platform
    const aggregatePlatform = (metrics: any[]): MetricsData => {
      const totals = metrics.reduce(
        (acc, m) => ({
          impressions: acc.impressions + m.impressions,
          clicks: acc.clicks + m.clicks,
          spend: acc.spend + m.spend,
          conversions: acc.conversions + m.conversions,
          conversionValue: acc.conversionValue + m.conversionValue,
        }),
        { impressions: 0, clicks: 0, spend: 0, conversions: 0, conversionValue: 0 }
      );

      const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
      const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;
      const cpa = totals.conversions > 0 ? totals.spend / totals.conversions : 0;
      const roas = totals.spend > 0 ? totals.conversionValue / totals.spend : 0;

      return {
        ...totals,
        ctr,
        cpc,
        cpa,
        roas,
      } as MetricsData;
    };

    const platformMetrics: MetricsData[] = [];
    if (metricsMeta.length > 0) {
      platformMetrics.push({ platform: 'meta', ...aggregatePlatform(metricsMeta) });
    }
    if (metricsGoogle.length > 0) {
      platformMetrics.push({ platform: 'google', ...aggregatePlatform(metricsGoogle) });
    }

    // Aggregate campaigns
    const campaignMap = new Map();
    [...metricsMeta, ...metricsGoogle].forEach((m) => {
      const key = `${m.platform}_${m.entityId}`;
      if (!campaignMap.has(key)) {
        campaignMap.set(key, {
          platform: m.platform,
          campaignId: m.entityId,
          campaignName: m.entityName,
          impressions: 0,
          clicks: 0,
          spend: 0,
          conversions: 0,
          conversionValue: 0,
        });
      }
      const c = campaignMap.get(key);
      c.impressions += m.impressions;
      c.clicks += m.clicks;
      c.spend += m.spend;
      c.conversions += m.conversions;
      c.conversionValue += m.conversionValue;
    });

    const campaigns = Array.from(campaignMap.values()).map((c) => ({
      ...c,
      ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0,
      cpc: c.clicks > 0 ? c.spend / c.clicks : 0,
      cpa: c.conversions > 0 ? c.spend / c.conversions : 0,
      roas: c.spend > 0 ? c.conversionValue / c.spend : 0,
    }));

    // Sort by spend
    campaigns.sort((a, b) => b.spend - a.spend);

    // Format data for Claude
    const metricsText = formatMetricsForAnalysis(platformMetrics, campaigns, config);

    // Call Claude API
    const systemPrompt = createSystemPrompt(config);
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze this marketing data and generate 3-5 actionable recommendations:\n\n${metricsText}`,
        },
      ],
    });

    // Parse response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from response (Claude might wrap it in markdown)
    let recommendations: Recommendation[] = [];
    try {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        recommendations = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText);
      throw new Error('Failed to parse AI recommendations');
    }

    // Save recommendations to database
    for (const rec of recommendations) {
      await prisma.marketingRecommendation.create({
        data: {
          type: rec.type,
          priority: rec.priority,
          title: rec.title,
          description: rec.description,
          impact: rec.impact,
          action: rec.action,
          platform: rec.platform || null,
          campaignId: rec.campaignId || null,
          estimatedImpact: rec.estimatedImpact || null,
          status: 'pending',
          dateRange: `${dateFrom.toISOString().split('T')[0]} - ${
            dateTo.toISOString().split('T')[0]
          }`,
        },
      });
    }

    return recommendations;
  } catch (error: any) {
    console.error('AI analysis error:', error);
    throw error;
  }
}

/**
 * Get recent recommendations from database
 */
export async function getRecentRecommendations(limit: number = 10) {
  return await prisma.marketingRecommendation.findMany({
    where: {
      status: { in: ['pending', 'applied'] },
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    take: limit,
  });
}

/**
 * Mark recommendation as applied
 */
export async function markRecommendationApplied(id: string) {
  return await prisma.marketingRecommendation.update({
    where: { id },
    data: { status: 'applied', appliedAt: new Date() },
  });
}

/**
 * Dismiss recommendation
 */
export async function dismissRecommendation(id: string) {
  return await prisma.marketingRecommendation.update({
    where: { id },
    data: { status: 'dismissed' },
  });
}
