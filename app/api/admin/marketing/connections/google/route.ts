import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/marketing/connections/google
 * Get Google Ads connection status (placeholder)
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  return NextResponse.json({
    connected: false,
    message: 'Google Ads integrace bude přidána ve Fázi 2',
  });
}

/**
 * POST /api/admin/marketing/connections/google
 * Save Google Ads connection (placeholder)
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  return NextResponse.json(
    { error: 'Google Ads integrace bude přidána ve Fázi 2' },
    { status: 501 }
  );
}

/**
 * DELETE /api/admin/marketing/connections/google
 * Disconnect Google Ads (placeholder)
 */
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  return NextResponse.json(
    { error: 'Google Ads integrace bude přidána ve Fázi 2' },
    { status: 501 }
  );
}
