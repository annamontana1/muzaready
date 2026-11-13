import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/admin/orders/bulk
 * Handles bulk operations on orders (status update, payment status update, delete)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderIds, action, value } = body;

    // Validate input
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: 'Neplatné ID objednávek' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Neplatná akce' },
        { status: 400 }
      );
    }

    let result;

    // Handle different actions
    if (action === 'updateStatus') {
      if (!value) {
        return NextResponse.json(
          { error: 'Nový stav je vyžadován' },
          { status: 400 }
        );
      }

      result = await prisma.order.updateMany({
        where: {
          id: { in: orderIds },
        },
        data: {
          status: value,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: `Byl aktualizován stav ${result.count} objednávek`,
          count: result.count,
        },
        { status: 200 }
      );
    }

    if (action === 'updatePaymentStatus') {
      if (!value) {
        return NextResponse.json(
          { error: 'Nový stav platby je vyžadován' },
          { status: 400 }
        );
      }

      // Které objednávky se právě teď stávají zaplacenými (kvůli faktuře a potvrzení)
      const newlyPaid = value === 'paid'
        ? await prisma.order.findMany({
            where: { id: { in: orderIds }, paymentStatus: { not: 'paid' } },
            select: { id: true, orderStatus: true },
          })
        : [];

      result = await prisma.order.updateMany({
        where: {
          id: { in: orderIds },
        },
        data: {
          paymentStatus: value,
          updatedAt: new Date(),
        },
      });

      if (newlyPaid.length > 0) {
        const { settleOrderPaid } = await import('@/lib/order-invoice');
        for (const o of newlyPaid) {
          try {
            await prisma.order.update({
              where: { id: o.id },
              data: {
                paidAt: new Date(),
                ...(o.orderStatus === 'pending' ? { orderStatus: 'processing' } : {}),
                lastStatusChangeAt: new Date(),
              },
            });
            await settleOrderPaid(o.id, 'admin');
          } catch (settleError) {
            console.error(`Failed to settle paid order ${o.id}:`, settleError);
          }
        }
      }

      return NextResponse.json(
        {
          success: true,
          message: `Byl aktualizován stav platby ${result.count} objednávek`,
          count: result.count,
        },
        { status: 200 }
      );
    }

    if (action === 'delete') {
      // Soft delete - mark as cancelled if not using soft deletes,
      // or perform actual deletion if that's the policy
      // For now, we'll use status-based marking instead of actual deletion to preserve data
      result = await prisma.order.updateMany({
        where: {
          id: { in: orderIds },
        },
        data: {
          status: 'cancelled_unpaid', // Mark as cancelled instead of true deletion
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: `Bylo označeno jako zrušeno ${result.count} objednávek`,
          count: result.count,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Neznámá akce' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Chyba při hromadné akci:', error);
    return NextResponse.json(
      { error: 'Chyba při zpracování hromadné akce' },
      { status: 500 }
    );
  }
}
