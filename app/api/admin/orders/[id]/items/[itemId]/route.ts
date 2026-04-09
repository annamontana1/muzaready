import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/orders/[id]/items/[itemId]
 * Update an order item (grams, pricePerGram, nameSnapshot).
 * Recalculates lineTotal and order total automatically.
 * Owner role only.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  const session = await verifyAdminSession(request);
  if (!session.valid || !session.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.admin.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden - pouze majitel' }, { status: 403 });
  }

  const { id: orderId, itemId } = params;
  const body = await request.json();

  // Validate fields
  const updates: {
    grams?: number;
    pricePerGram?: number;
    nameSnapshot?: string;
    lineTotal?: number;
  } = {};

  if (body.grams !== undefined) {
    const g = parseFloat(body.grams);
    if (isNaN(g) || g <= 0) return NextResponse.json({ error: 'Neplatná gramáž' }, { status: 400 });
    updates.grams = g;
  }
  if (body.pricePerGram !== undefined) {
    const p = parseFloat(body.pricePerGram);
    if (isNaN(p) || p < 0) return NextResponse.json({ error: 'Neplatná cena/g' }, { status: 400 });
    updates.pricePerGram = p;
  }
  if (body.nameSnapshot !== undefined) {
    updates.nameSnapshot = String(body.nameSnapshot).trim();
  }

  try {
    // Get current item
    const item = await prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!item || item.orderId !== orderId) {
      return NextResponse.json({ error: 'Položka nenalezena' }, { status: 404 });
    }

    // Recalculate lineTotal if grams or pricePerGram changed
    const newGrams = updates.grams ?? item.grams;
    const newPricePerGram = updates.pricePerGram ?? item.pricePerGram;
    updates.lineTotal = newGrams * newPricePerGram;

    // Update item
    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: updates,
    });

    // Recalculate order total from all items
    const allItems = await prisma.orderItem.findMany({ where: { orderId } });
    const itemsTotal = allItems.reduce((sum, i) => sum + i.lineTotal, 0);

    // Get current order for shipping/discount
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { shippingCost: true, discountAmount: true },
    });

    const newTotal = itemsTotal + (order?.shippingCost ?? 0) - (order?.discountAmount ?? 0);
    const newSubtotal = itemsTotal;

    await prisma.order.update({
      where: { id: orderId },
      data: { total: newTotal, subtotal: newSubtotal },
    });

    // Log change
    try {
      await prisma.orderHistory.create({
        data: {
          orderId,
          changedBy: session.admin.email,
          field: 'orderItem',
          oldValue: `grams:${item.grams}, ppg:${item.pricePerGram}`,
          newValue: `grams:${newGrams}, ppg:${newPricePerGram}, total:${updates.lineTotal}`,
          changeType: 'field_update',
          note: `Položka upravena majitelem`,
        },
      });
    } catch {}

    return NextResponse.json({ success: true, item: updatedItem, newOrderTotal: newTotal });
  } catch (error) {
    console.error('Error updating order item:', error);
    return NextResponse.json({ error: 'Chyba při ukládání' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/orders/[id]/items/[itemId]
 * Remove an order item. Recalculates order total.
 * Owner role only.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  const session = await verifyAdminSession(request);
  if (!session.valid || !session.admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.admin.role !== 'owner') {
    return NextResponse.json({ error: 'Forbidden - pouze majitel' }, { status: 403 });
  }

  const { id: orderId, itemId } = params;

  try {
    const item = await prisma.orderItem.findUnique({ where: { id: itemId } });
    if (!item || item.orderId !== orderId) {
      return NextResponse.json({ error: 'Položka nenalezena' }, { status: 404 });
    }

    await prisma.orderItem.delete({ where: { id: itemId } });

    // Recalculate order total
    const remainingItems = await prisma.orderItem.findMany({ where: { orderId } });
    const itemsTotal = remainingItems.reduce((sum, i) => sum + i.lineTotal, 0);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { shippingCost: true, discountAmount: true },
    });

    const newTotal = itemsTotal + (order?.shippingCost ?? 0) - (order?.discountAmount ?? 0);

    await prisma.order.update({
      where: { id: orderId },
      data: { total: newTotal, subtotal: itemsTotal },
    });

    try {
      await prisma.orderHistory.create({
        data: {
          orderId,
          changedBy: session.admin.email,
          field: 'orderItem',
          oldValue: item.nameSnapshot || item.skuId,
          newValue: null,
          changeType: 'field_update',
          note: `Položka smazána majitelem`,
        },
      });
    } catch {}

    return NextResponse.json({ success: true, newOrderTotal: newTotal });
  } catch (error) {
    console.error('Error deleting order item:', error);
    return NextResponse.json({ error: 'Chyba při mazání' }, { status: 500 });
  }
}
