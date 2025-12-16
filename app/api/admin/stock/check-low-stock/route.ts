import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { sendLowStockAlert } from '@/lib/email';

export const runtime = 'nodejs';

/**
 * GET /api/admin/stock/check-low-stock
 * Check for low stock items and optionally send alert email
 *
 * Query params:
 * - threshold: number (default 200) - gram threshold for low stock
 * - sendEmail: boolean (default false) - whether to send email alert
 * - email: string (optional) - admin email for alert
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const threshold = parseInt(searchParams.get('threshold') || '200', 10);
    const sendEmail = searchParams.get('sendEmail') === 'true';
    const adminEmail = searchParams.get('email') || 'info@muzahair.cz';

    // Find SKUs with low available grams
    const lowStockItems = await prisma.sku.findMany({
      where: {
        AND: [
          { inStock: true }, // Only check items that are supposed to be in stock
          { isListed: true }, // Only check items that are listed for sale
          {
            OR: [
              { availableGrams: { lte: threshold } }, // Less than or equal threshold
              { availableGrams: null }, // Or null (needs attention)
            ],
          },
        ],
      },
      select: {
        id: true,
        sku: true,
        name: true,
        availableGrams: true,
        shade: true,
        lengthCm: true,
        shadeName: true,
        inStock: true,
        soldOut: true,
      },
      orderBy: {
        availableGrams: 'asc', // Show lowest stock first
      },
    });

    // If no low stock items, return early
    if (lowStockItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No low stock items found',
        count: 0,
        items: [],
        threshold,
      });
    }

    // Send email if requested
    if (sendEmail) {
      try {
        await sendLowStockAlert(
          adminEmail,
          lowStockItems.map((item) => ({
            sku: item.sku,
            name: item.name,
            availableGrams: item.availableGrams || 0,
            shade: item.shadeName || item.shade,
            lengthCm: item.lengthCm,
          }))
        );
      } catch (emailError) {
        console.error('Failed to send low stock alert email:', emailError);
        // Don't fail the whole request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Found ${lowStockItems.length} low stock items`,
      count: lowStockItems.length,
      items: lowStockItems,
      threshold,
      emailSent: sendEmail,
    });
  } catch (error) {
    console.error('Error checking low stock:', error);
    return NextResponse.json(
      {
        error: 'Failed to check low stock',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
