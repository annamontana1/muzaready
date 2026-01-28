import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/marketing/connections/meta
 * Get Meta Ads connection status
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const connection = await prisma.marketingConnection.findFirst({
      where: { platform: 'meta' },
    });

    return NextResponse.json({
      connected: connection?.connected || false,
      accountName: connection?.accountName,
      lastSync: connection?.lastSync,
      error: connection?.error,
    });
  } catch (error: any) {
    console.error('Error loading Meta connection:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání připojení' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/marketing/connections/meta
 * Save Meta Ads connection (OAuth callback or manual token)
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { accessToken, adAccountId, pageId } = body;

    if (!accessToken || !adAccountId) {
      return NextResponse.json(
        { error: 'Access token a Ad Account ID jsou povinné' },
        { status: 400 }
      );
    }

    // Test connection with Meta API
    try {
      const testResponse = await fetch(
        `https://graph.facebook.com/v18.0/${adAccountId}?fields=name,account_id&access_token=${accessToken}`
      );

      if (!testResponse.ok) {
        return NextResponse.json(
          { error: 'Neplatný access token nebo ad account ID' },
          { status: 400 }
        );
      }

      const accountData = await testResponse.json();

      // Save connection
      await prisma.marketingConnection.upsert({
        where: {
          id: 'meta', // Use fixed ID for singleton
        },
        create: {
          id: 'meta',
          platform: 'meta',
          connected: true,
          credentials: JSON.stringify({
            accessToken,
            adAccountId,
            pageId,
          }),
          accountId: adAccountId,
          accountName: accountData.name,
          lastSync: new Date(),
        },
        update: {
          connected: true,
          credentials: JSON.stringify({
            accessToken,
            adAccountId,
            pageId,
          }),
          accountId: adAccountId,
          accountName: accountData.name,
          lastSync: new Date(),
          error: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Meta Ads úspěšně připojeno',
        accountName: accountData.name,
      });
    } catch (apiError: any) {
      return NextResponse.json(
        { error: 'Chyba při testování připojení: ' + apiError.message },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error saving Meta connection:', error);
    return NextResponse.json(
      { error: 'Chyba při ukládání: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/marketing/connections/meta
 * Disconnect Meta Ads
 */
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    await prisma.marketingConnection.updateMany({
      where: { platform: 'meta' },
      data: {
        connected: false,
        credentials: null,
        error: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Meta Ads odpojeno',
    });
  } catch (error: any) {
    console.error('Error disconnecting Meta:', error);
    return NextResponse.json(
      { error: 'Chyba při odpojování' },
      { status: 500 }
    );
  }
}
