import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import QRCode from 'qrcode';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Params {
  movementId: string;
}

/**
 * GET /api/admin/stock/qr-code/[movementId]
 * Generate QR code PNG for a stock movement
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { movementId } = params;

    // Verify movement exists
    const movement = await prisma.stockMovement.findUnique({
      where: { id: movementId },
      include: {
        sku: {
          select: {
            sku: true,
            name: true,
            shadeName: true,
          },
        },
      },
    });

    if (!movement) {
      return NextResponse.json(
        { error: 'Stock movement not found' },
        { status: 404 }
      );
    }

    // Generate QR code content
    // Format: STOCK-{movementId}
    const qrContent = `STOCK-${movementId}`;

    // Generate QR code as PNG buffer
    const qrCodeBuffer = await QRCode.toBuffer(qrContent, {
      type: 'png',
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H', // High error correction for better scanning
    });

    // Return PNG image
    return new NextResponse(qrCodeBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="QR-${movement.sku.sku}-${movementId}.png"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
