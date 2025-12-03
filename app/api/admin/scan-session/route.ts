import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * POST /api/admin/scan-session
 * Manage scan sessions:
 * - action: "create" - Create a new scan session
 * - action: "addItem" - Add item to session
 * - action: "updateStatus" - Update session status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, status, skuId, skuName, price, quantity } = body;

    if (action === 'create') {
      // Create new scan session
      const session = await prisma.scanSession.create({
        data: {
          status: 'scanning',
          totalPrice: 0,
          itemCount: 0,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Relace vytvořena',
          session: {
            id: session.id,
            status: session.status,
            totalPrice: session.totalPrice,
            itemCount: session.itemCount,
          },
        },
        { status: 201 }
      );
    }

    if (action === 'addItem') {
      // Validate required fields
      if (!sessionId || !skuId || !skuName || price === undefined || !quantity) {
        return NextResponse.json(
          { error: 'Chybí povinná pole (sessionId, skuId, skuName, price, quantity)' },
          { status: 400 }
        );
      }

      // Get the session
      const session = await prisma.scanSession.findUnique({
        where: { id: sessionId },
        include: { items: true },
      });

      if (!session) {
        return NextResponse.json(
          { error: `Relace nebyla nalezena: ${sessionId}` },
          { status: 404 }
        );
      }

      if (session.status !== 'scanning') {
        return NextResponse.json(
          { error: 'Relace musí být ve stavu "scanning" pro přidání položky' },
          { status: 400 }
        );
      }

      // Check if item already exists in session
      const existingItem = session.items.find((item) => item.skuId === skuId);

      let scanItem;
      if (existingItem) {
        // Update quantity of existing item
        scanItem = await prisma.scanItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
          },
        });
      } else {
        // Create new scan item
        scanItem = await prisma.scanItem.create({
          data: {
            sessionId,
            skuId,
            skuName,
            price,
            quantity,
          },
        });
      }

      // Recalculate session totals
      const allItems = await prisma.scanItem.findMany({
        where: { sessionId },
      });

      const totalPrice = allItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = allItems.reduce((sum, item) => sum + item.quantity, 0);

      // Update session
      const updatedSession = await prisma.scanSession.update({
        where: { id: sessionId },
        data: {
          totalPrice,
          itemCount,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Položka přidána do relace',
          scanItem: {
            id: scanItem.id,
            skuId: scanItem.skuId,
            skuName: scanItem.skuName,
            price: scanItem.price,
            quantity: scanItem.quantity,
          },
          session: {
            id: updatedSession.id,
            status: updatedSession.status,
            totalPrice: updatedSession.totalPrice,
            itemCount: updatedSession.itemCount,
          },
        },
        { status: 200 }
      );
    }

    if (action === 'updateStatus') {
      // Validate required fields
      if (!sessionId || !status) {
        return NextResponse.json(
          { error: 'Chybí povinná pole (sessionId, status)' },
          { status: 400 }
        );
      }

      // Update session status
      const session = await prisma.scanSession.update({
        where: { id: sessionId },
        data: { status },
        include: { items: true },
      });

      return NextResponse.json(
        {
          success: true,
          message: `Relace aktualizována na status: ${status}`,
          session: {
            id: session.id,
            status: session.status,
            totalPrice: session.totalPrice,
            itemCount: session.itemCount,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Neznámá akce. Použijte: create, addItem, nebo updateStatus' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Scan session error:', error);
    return NextResponse.json(
      {
        error: 'Chyba při práci s relací',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/scan-session?sessionId=xxx
 * Get scan session details
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId parameter is required' },
        { status: 400 }
      );
    }

    const session = await prisma.scanSession.findUnique({
      where: { id: sessionId },
      include: { items: true },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Relace nebyla nalezena' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        session: {
          id: session.id,
          status: session.status,
          totalPrice: session.totalPrice,
          itemCount: session.itemCount,
          items: session.items,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET scan session error:', error);
    return NextResponse.json(
      {
        error: 'Chyba při načítání relace',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
