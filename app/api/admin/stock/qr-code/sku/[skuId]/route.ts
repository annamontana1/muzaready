import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import QRCode from 'qrcode';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Params {
  skuId: string;
}

/**
 * GET /api/admin/stock/qr-code/sku/[skuId]
 * Generate QR code PNG for a SKU (not stock movement)
 * Used for product identification, stocking, etc.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { skuId } = params;

    // Verify SKU exists
    const sku = await prisma.sku.findUnique({
      where: { id: skuId },
      select: {
        id: true,
        sku: true,
        shortCode: true,
        name: true,
        shadeName: true,
        lengthCm: true,
      },
    });

    if (!sku) {
      return NextResponse.json(
        { error: 'SKU not found' },
        { status: 404 }
      );
    }

    // Generate QR code content
    // Format: shortCode or SKU-{skuId} if no shortCode
    const qrContent = sku.shortCode || `SKU-${skuId}`;

    // Generate QR code as PNG buffer
    const qrCodeBuffer = await QRCode.toBuffer(qrContent, {
      type: 'png',
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H', // High error correction for better scanning
    });

    // Return PNG image
    const filename = sku.shortCode
      ? `QR-${sku.shortCode}.png`
      : `QR-${sku.sku}.png`;

    return new NextResponse(qrCodeBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error generating QR code for SKU:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
