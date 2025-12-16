import { NextRequest, NextResponse } from 'next/server';
import { validateCouponPreview } from '@/lib/coupon-utils';

export const runtime = 'nodejs';

/**
 * POST /api/coupons/validate
 * Validate a coupon code and return discount information
 * This is a PREVIEW only - does not actually apply the coupon
 *
 * Request body:
 * {
 *   code: string,
 *   orderAmount: number,
 *   userEmail?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { code, orderAmount, userEmail } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Kód kupónu je povinný' },
        { status: 400 }
      );
    }

    if (typeof orderAmount !== 'number' || orderAmount <= 0) {
      return NextResponse.json(
        { error: 'Neplatná částka objednávky' },
        { status: 400 }
      );
    }

    // Use helper function for validation preview
    const result = await validateCouponPreview(code, orderAmount, userEmail);

    if (!result.valid) {
      return NextResponse.json(
        { error: result.error, valid: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      discount: {
        amount: result.discount,
        originalAmount: orderAmount,
        finalAmount: result.finalAmount,
      },
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json(
      {
        error: 'Chyba při validaci kupónu',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
