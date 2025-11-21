import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
export const runtime = 'nodejs';


/**
 * GoPay Payment Creation Endpoint
 *
 * Creates a payment session with GoPay and returns the redirect URL
 * The customer is then sent to GoPay to complete payment
 * After payment, GoPay will send a webhook to /api/gopay/notify
 *
 * Environment variables required:
 * - GOPAY_CLIENT_ID: GoPay OAuth client ID
 * - GOPAY_CLIENT_SECRET: GoPay OAuth client secret
 * - GOPAY_GATEWAY_ID: GoPay gateway ID (merchant ID)
 * - GOPAY_ENV: 'test' or 'production'
 * - SITE_URL: Domain for callbacks (e.g., https://muzaready.com)
 */

interface GoPayPaymentRequest {
  orderId: string;
  amount: number; // in CZK
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface GoPayResponse {
  hasErrors: boolean;
  errors?: Array<{ message: string }>;
  result?: {
    redirectUrl: string;
    paymentSessionId?: string;
  };
}

// Get GoPay API endpoint based on environment
function getGoPayEndpoint(): string {
  const env = process.env.GOPAY_ENV || 'test';
  return env === 'production'
    ? 'https://gate.gopay.cz'
    : 'https://gw.sandbox.gopay.cz';
}

// Create signature for GoPay API request (used for authentication)
function createSignature(payload: Record<string, any>, clientSecret: string): string {
  const json = JSON.stringify(payload);
  return crypto.createHash('sha256').update(json + clientSecret).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GoPayPaymentRequest;
    const { orderId, amount, email, firstName, lastName, phone } = body;

    // Validate required fields
    if (!orderId || !amount || !email) {
      return NextResponse.json(
        { error: 'Chybějící povinná pole: orderId, amount, email' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const clientId = process.env.GOPAY_CLIENT_ID;
    const clientSecret = process.env.GOPAY_CLIENT_SECRET;
    const gatewayId = process.env.GOPAY_GATEWAY_ID;
    const siteUrl = process.env.SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    if (!clientId || !clientSecret || !gatewayId) {
      console.error('❌ GoPay environment variables not configured');
      return NextResponse.json(
        {
          error:
            'GoPay není nakonfigurován. Prosím kontaktujte podporu. (Payment gateway not configured)',
        },
        { status: 500 }
      );
    }

    const endpoint = getGoPayEndpoint();
    const successUrl = `${siteUrl}/pokladna/potvrzeni?orderId=${orderId}`;
    const failureUrl = `${siteUrl}/pokladna?paymentFailed=true`;
    const notificationUrl = `${siteUrl}/api/gopay/notify`;

    // Create payment request payload
    const paymentPayload = {
      payer: {
        email,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
      },
      target: {
        type: 'ACCOUNT',
        gid: gatewayId, // Gateway ID
      },
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'CZK',
      orderNumber: orderId,
      orderDescription: `Objednávka #${orderId.substring(0, 8)}`,
      items: [
        {
          name: 'Objednávka vlasů',
          amount: Math.round(amount * 100),
          count: 1,
        },
      ],
      successUrl,
      failureUrl,
      notificationUrl,
      lang: 'CS',
      additionalParams: [
        {
          name: 'invoiceId',
          value: orderId,
        },
      ],
    };

    // Create signature (without payer personal data for security)
    const signaturePayload = {
      ...paymentPayload,
      payer: {
        email: paymentPayload.payer.email,
        // Don't include firstName/lastName/phone in signature for privacy
      },
    };
    const signature = createSignature(signaturePayload, clientSecret);

    console.log(`📤 Creating GoPay payment for order ${orderId}, amount: ${amount} CZK`);

    // Call GoPay API
    const createPaymentUrl = `${endpoint}/api/payments/payment`;

    const gopayResponse = await fetch(createPaymentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: JSON.stringify(paymentPayload),
    });

    const gopayData = (await gopayResponse.json()) as GoPayResponse;

    if (!gopayResponse.ok || gopayData.hasErrors) {
      const errorMessage = gopayData.errors?.[0]?.message || 'Neznámá chyba';
      console.error(`❌ GoPay API error for order ${orderId}:`, errorMessage);

      return NextResponse.json(
        {
          error: `Chyba při vytváření platby: ${errorMessage}`,
          gopayError: gopayData.errors,
        },
        { status: gopayResponse.status || 400 }
      );
    }

    if (!gopayData.result?.redirectUrl) {
      console.error(`❌ No redirect URL from GoPay for order ${orderId}`);
      return NextResponse.json(
        { error: 'Chyba: GoPay nevrátil odkaz na platbu' },
        { status: 500 }
      );
    }

    console.log(`✅ GoPay payment created for order ${orderId}`);
    console.log(`   Redirect: ${gopayData.result.redirectUrl}`);

    return NextResponse.json(
      {
        success: true,
        orderId,
        paymentUrl: gopayData.result.redirectUrl,
        message: 'Přesměrování na GoPay pro dokončení platby...',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ GoPay create-payment error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Neznámá chyba při zpracování platby',
      },
      { status: 500 }
    );
  }
}