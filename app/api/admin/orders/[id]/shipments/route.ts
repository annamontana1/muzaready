import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Params {
  id: string;
}

/**
 * POST /api/admin/orders/[id]/shipments
 * Create a shipment for an order
 *
 * Request Body:
 * {
 *   "carrier": "zasilkovna" | "dpd" | "fedex" | "other",
 *   "trackingNumber": "ABC123456",
 *   "items": ["item1", "item2"],  // (optional) specific item IDs to ship
 *   "notes": "Special handling required"  // (optional)
 * }
 *
 * Response: Updated order with shipment details and deliveryStatus = "shipped"
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
    const { carrier, trackingNumber, items, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    // trackingNumber is optional for Zásilkovna auto-mode (assigned automatically from API)
    if (!carrier) {
      return NextResponse.json(
        { error: 'carrier is required' },
        { status: 400 }
      );
    }
    if (!trackingNumber && carrier !== 'zasilkovna') {
      return NextResponse.json(
        { error: 'trackingNumber is required' },
        { status: 400 }
      );
    }

    // Validate carrier
    const validCarriers = [
      'zasilkovna',
      'dpd',
      'ppl',
      'fedex',
      'gls',
      'ups',
      'other',
    ];
    if (!validCarriers.includes(carrier)) {
      return NextResponse.json(
        { error: `Invalid carrier. Must be one of: ${validCarriers.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            sku: {
              select: {
                id: true,
                sku: true,
                name: true,
                shadeName: true,
                lengthCm: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate items if provided
    if (items && Array.isArray(items)) {
      const orderItemIds = order.items.map((item) => item.id);
      const invalidItems = items.filter((item) => !orderItemIds.includes(item));

      if (invalidItems.length > 0) {
        return NextResponse.json(
          { error: `Invalid item IDs: ${invalidItems.join(', ')}` },
          { status: 400 }
        );
      }
    }

    let finalTrackingNumber = trackingNumber;

    // ── Auto-create Zásilkovna packet if carrier is zasilkovna and no tracking number provided ──
    if (carrier === 'zasilkovna' && !trackingNumber) {
      const packetaPointId = (order as any).packetaPointId;
      if (!packetaPointId) {
        return NextResponse.json(
          { error: 'Objednávka nemá přiřazené výdejní místo Zásilkovny (packetaPointId). Zadejte tracking číslo ručně.' },
          { status: 400 }
        );
      }

      const { createPacket } = await import('@/lib/zasilkovna');
      const result = await createPacket(
        String((order as any).orderNumber),
        {
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email,
          phone: order.phone || '',
        },
        parseInt(packetaPointId, 10),
        order.total,
        0.5, // weight kg
        0,   // COD — prepaid
        notes || undefined
      );

      if (!result.success) {
        return NextResponse.json(
          { error: `Zásilkovna: ${result.error}` },
          { status: 502 }
        );
      }

      finalTrackingNumber = result.barcode!;
    }

    if (!finalTrackingNumber) {
      return NextResponse.json(
        { error: 'Sledovací číslo je povinné' },
        { status: 400 }
      );
    }

    // Build shipment data
    const shipmentData = {
      carrier,
      trackingNumber: finalTrackingNumber,
      shippedAt: new Date(),
      items: items || order.items.map((item) => item.id),
      notes,
    };

    // Update order status to shipped
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        deliveryStatus: 'shipped',
        lastStatusChangeAt: new Date(),
        trackingNumber: finalTrackingNumber,
        carrier: carrier,
        shippedAt: new Date(),
      },
      include: {
        items: {
          include: {
            sku: {
              select: {
                id: true,
                sku: true,
                name: true,
                shadeName: true,
                lengthCm: true,
              },
            },
          },
        },
      },
    });

    // Transform order response
    const transformedOrder = {
      ...updatedOrder,
      orderStatus: (updatedOrder as any).orderStatus || 'draft',
      paymentStatus: (updatedOrder as any).paymentStatus || 'unpaid',
      deliveryStatus: (updatedOrder as any).deliveryStatus || 'pending',
      channel: (updatedOrder as any).channel || 'web',
      tags: (updatedOrder as any).tags
        ? JSON.parse((updatedOrder as any).tags)
        : [],
      riskScore: (updatedOrder as any).riskScore || 0,
      notesInternal: (updatedOrder as any).notesInternal,
      notesCustomer: (updatedOrder as any).notesCustomer,
      lastStatusChangeAt: (updatedOrder as any).lastStatusChangeAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: `Shipment created with carrier ${carrier}. Tracking: ${finalTrackingNumber}`,
        shipment: shipmentData,
        order: transformedOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating shipment:', error);
    return NextResponse.json(
      {
        error: 'Failed to create shipment',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/orders/[id]/shipments
 * Fetch shipments for an order (placeholder - would need Shipment model)
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

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // In a full implementation, you would fetch from a Shipments table
    // For now, return an empty array or the order's delivery status
    return NextResponse.json(
      {
        orderId: id,
        deliveryStatus: (order as any).deliveryStatus || 'pending',
        shipments: [], // Would be populated from database
        message: 'To store shipment details persistently, add a Shipment model to your Prisma schema',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch shipments',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
