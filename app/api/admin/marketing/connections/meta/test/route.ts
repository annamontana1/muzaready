import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/marketing/connections/meta/test
 * Test Meta Ads connection
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Load connection
    const connection = await prisma.marketingConnection.findFirst({
      where: { platform: 'meta' },
    });

    if (!connection || !connection.connected || !connection.credentials) {
      return NextResponse.json(
        { error: 'Meta Ads není připojeno' },
        { status: 400 }
      );
    }

    const credentials = JSON.parse(connection.credentials);
    const { accessToken, adAccountId } = credentials;

    // Test API call
    const testResponse = await fetch(
      `https://graph.facebook.com/v18.0/${adAccountId}?fields=name,account_id,account_status,currency&access_token=${accessToken}`
    );

    if (!testResponse.ok) {
      const errorData = await testResponse.json();

      // Update error in DB
      await prisma.marketingConnection.update({
        where: { id: connection.id },
        data: {
          error: errorData.error?.message || 'Test selhal',
        },
      });

      return NextResponse.json(
        { error: 'Test připojení selhal: ' + (errorData.error?.message || 'Neznámá chyba') },
        { status: 400 }
      );
    }

    const accountData = await testResponse.json();

    // Update last sync
    await prisma.marketingConnection.update({
      where: { id: connection.id },
      data: {
        lastSync: new Date(),
        error: null,
        accountName: accountData.name,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Připojení funguje!',
      account: {
        name: accountData.name,
        id: accountData.account_id,
        status: accountData.account_status,
        currency: accountData.currency,
      },
    });
  } catch (error: any) {
    console.error('Error testing Meta connection:', error);
    return NextResponse.json(
      { error: 'Chyba při testování: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}
