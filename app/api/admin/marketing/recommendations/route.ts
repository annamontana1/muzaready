import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  generateRecommendations,
  getRecentRecommendations,
} from '@/lib/marketing/ai-analyzer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // AI analysis can take time

/**
 * GET /api/admin/marketing/recommendations
 * Get recent AI recommendations
 *
 * Query params:
 * - limit: number of recommendations to return (default 10)
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const recommendations = await getRecentRecommendations(limit);

    return NextResponse.json({
      recommendations,
      count: recommendations.length,
    });
  } catch (error: any) {
    console.error('Get recommendations error:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání doporučení' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/marketing/recommendations
 * Generate new AI recommendations
 *
 * Body:
 * - days: number of days to analyze (default 30)
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => ({}));
    const days = body.days || 30;

    // Check if Anthropic API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key není nakonfigurován' },
        { status: 500 }
      );
    }

    // Generate recommendations
    const recommendations = await generateRecommendations(days);

    if (recommendations.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Žádná data pro analýzu',
        recommendations: [],
      });
    }

    return NextResponse.json({
      success: true,
      message: `Vygenerováno ${recommendations.length} doporučení`,
      recommendations,
      count: recommendations.length,
    });
  } catch (error: any) {
    console.error('Generate recommendations error:', error);
    return NextResponse.json(
      {
        error: 'Chyba při generování doporučení',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
