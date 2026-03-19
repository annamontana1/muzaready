import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getGoPayBaseUrl, getGoPayAccessToken } from '@/lib/gopay';

export const runtime = 'nodejs';

/**
 * GoPay Payment Creation Endpoint
 *
 * Creates a payment session via GoPay REST API (OAuth2 + JSON)
 * and returns the gateway URL for customer redirect.
 *
 * Environment variables required:
 * - GOPAY_CLIENT_ID: OAuth2 client ID
 * - GOPAY_CLIENT_SECRET: OAuth2 client secret
 * - GOPAY_GOID: Merchant GoID (numeric)
 * - GOPAY_ENV: 'test' or 'production'
 * - SITE_URL: Domain for callbacks (e.g., https://www.muzahair.cz)
 */

interface CreatePaymentBody {
  orderId: string;
  amount: number; // in CZK
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePaymentBody;
    const { orderId, amount, email, firstName, lastName, phone } = body;

    if (!orderId || !amount || !email) {
      return NextResponse.json(
        { error: 'Chybějící povinná pole: orderId, amount, email' },
        { status: 400 }
      );
    }

    const goId = process.env.GOPAY_GOID;
    if (!goId || !process.env.GOPAY_CLIENT_ID || !process.env.GOPAY_CLIENT_SECRET) {
      console.error('GoPay environment variables not configured');
      return NextResponse.json(
        { error: 'Platební brána není nakonfigurována. Kontaktujte podporu.' },
        { status: 500 }
      );
    }

    const siteUrl = process.env.SITE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    // 1. Get OAuth2 access token
    const accessToken = await getGoPayAccessToken('payment-create');

    // 2. Create payment via GoPay REST API
    const baseUrl = getGoPayBaseUrl();
    const amountInCents = Math.round(amount * 100);

    const paymentPayload = {
      payer: {
        default_payment_instrument: 'PAYMENT_CARD',
        allowed_payment_instruments: ['PAYMENT_CARD', 'BANK_ACCOUNT'],
        contact: {
          first_name: firstName || undefined,
          last_name: lastName || undefined,
          email,
          phone_number: phone || undefined,
        },
      },
      target: {
        type: 'ACCOUNT',
        goid: parseInt(goId, 10),
      },
      amount: amountInCents,
      currency: 'CZK',
      order_number: orderId,
      order_description: `Objednávka #${orderId.substring(0, 8)}`,
      items: [
        {
          type: 'ITEM',
          name: 'Objednávka vlasů - Múza Hair',
          amount: amountInCents,
          count: 1,
        },
      ],
      callback: {
        return_url: `${siteUrl}/pokladna/potvrzeni?orderId=${orderId}`,
        notification_url: `${siteUrl}/api/gopay/notify`,
      },
      lang: 'CS',
    };

    console.log(`Creating GoPay payment for order ${orderId}, amount: ${amount} CZK`);

    const gopayResponse = await fetch(`${baseUrl}/api/payments/payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(paymentPayload),
    });

    const gopayData = await gopayResponse.json();

    if (!gopayResponse.ok) {
      console.error(`GoPay API error for order ${orderId}:`, JSON.stringify(gopayData));
      const errorMsg = gopayData.errors
        ? gopayData.errors.map((e: any) => `${e.error_code}: ${e.message}`).join(', ')
        : 'Neznámá chyba';
      return NextResponse.json(
        { error: `Chyba platební brány: ${errorMsg}` },
        { status: gopayResponse.status }
      );
    }

    if (!gopayData.gw_url) {
      console.error(`No gw_url from GoPay for order ${orderId}:`, JSON.stringify(gopayData));
      return NextResponse.json(
        { error: 'Platební brána nevrátila odkaz na platbu' },
        { status: 500 }
      );
    }

    // 3. Store GoPay payment ID on order for later verification
    await prisma.order.update({
      where: { id: orderId },
      data: {
        gopayPaymentId: String(gopayData.id),
        paymentMethod: 'gopay',
      },
    });

    console.log(`GoPay payment created: id=${gopayData.id}, order=${orderId}`);

    return NextResponse.json({
      success: true,
      orderId,
      paymentUrl: gopayData.gw_url,
      message: 'Přesměrování na GoPay pro dokončení platby...',
    });
  } catch (error) {
    console.error('GoPay create-payment error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Chyba při zpracování platby',
      },
      { status: 500 }
    );
  }
}
