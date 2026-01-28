import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  markRecommendationApplied,
  dismissRecommendation,
} from '@/lib/marketing/ai-analyzer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/marketing/recommendations/[id]
 * Update recommendation status
 *
 * Body:
 * - action: 'apply' | 'dismiss'
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { action } = body;
    const { id } = params;

    if (!action || !['apply', 'dismiss'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Use "apply" or "dismiss"' },
        { status: 400 }
      );
    }

    let recommendation;
    if (action === 'apply') {
      recommendation = await markRecommendationApplied(id);
    } else {
      recommendation = await dismissRecommendation(id);
    }

    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (error: any) {
    console.error('Update recommendation error:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci doporučení' },
      { status: 500 }
    );
  }
}
