import { NextResponse } from 'next/server';
import { assignMissingShortCodes } from '@/lib/short-code';

export const runtime = 'nodejs';

/**
 * Assigns short codes to all SKUs that don't have one
 * POST /api/admin/skus/assign-codes
 */
export async function POST() {
  try {
    const count = await assignMissingShortCodes();

    return NextResponse.json({
      success: true,
      message: `Assigned short codes to ${count} SKUs`,
      count,
    });
  } catch (error: any) {
    console.error('Error assigning short codes:', error);
    return NextResponse.json(
      { error: 'Failed to assign short codes', details: error.message },
      { status: 500 }
    );
  }
}
