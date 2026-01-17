import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { createPacket, getPacketStatus, getPacketLabel } from '@/lib/zasilkovna';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Params {
  id: string;
}

/**
 * POST /api/admin/orders/[id]/zasilkovna
 * Create a Zásilkovna shipment for an order
 *
 * The customer will automatically receive email/SMS notifications from Zásilkovna
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();
    const { weight, cod, note } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with customer details
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order has Zásilkovna pickup point
    const packetaPointId = (order as any).packetaPointId;
    if (!packetaPointId) {
      return NextResponse.json(
        { error: 'Tato objednávka nemá vybrané výdejní místo Zásilkovny' },
        { status: 400 }
      );
    }

    // Check if already shipped
    if ((order as any).deliveryStatus === 'shipped' && (order as any).trackingNumber) {
      return NextResponse.json(
        { error: 'Tato objednávka již byla odeslána' },
        { status: 400 }
      );
    }

    // Create packet in Zásilkovna
    const result = await createPacket(
      order.id.substring(0, 12), // Use first 12 chars of order ID
      {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone || '',
      },
      parseInt(packetaPointId, 10),
      order.total,
      weight || 0.5, // Default 0.5 kg
      cod || 0, // Default no COD (prepaid)
      note
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Nepodařilo se vytvořit zásilku v Zásilkovně' },
        { status: 400 }
      );
    }

    // Update order with tracking info
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        deliveryStatus: 'shipped',
        trackingNumber: result.barcode,
        carrier: 'zasilkovna',
        shippedAt: new Date(),
        lastStatusChangeAt: new Date(),
      },
    });

    // Send shipping notification email
    try {
      const { sendShippingNotificationEmail } = await import('@/lib/email');
      await sendShippingNotificationEmail(
        order.email,
        id,
        result.barcode!,
        `https://tracking.packeta.com/cs/?id=${result.barcode}`
      );
    } catch (emailError) {
      console.error('Failed to send shipping email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Zásilka vytvořena v Zásilkovně',
        packetId: result.packetId,
        barcode: result.barcode,
        trackingUrl: `https://tracking.packeta.com/cs/?id=${result.barcode}`,
        note: 'Zákazník obdrží automaticky email a SMS od Zásilkovny',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating Zásilkovna shipment:', error);
    return NextResponse.json(
      {
        error: 'Chyba při vytváření zásilky',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/orders/[id]/zasilkovna
 * Get Zásilkovna packet status
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  // Check admin authentication
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const trackingNumber = (order as any).trackingNumber;
    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Objednávka nemá tracking číslo' },
        { status: 400 }
      );
    }

    // Try to get status (we'd need packetId stored, for now just return tracking URL)
    return NextResponse.json({
      orderId: id,
      barcode: trackingNumber,
      trackingUrl: `https://tracking.packeta.com/cs/?id=${trackingNumber}`,
      carrier: (order as any).carrier || 'zasilkovna',
    });
  } catch (error) {
    console.error('Error getting Zásilkovna status:', error);
    return NextResponse.json(
      { error: 'Chyba při získávání stavu zásilky' },
      { status: 500 }
    );
  }
}
