import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/customers/[id]
 * Fetch single customer with order history
 * Supports both registered users (cuid) and guest customers (guest_base64email)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const isGuest = id.startsWith('guest_');

    let customer: any;
    let orders: any[];

    if (isGuest) {
      // Decode guest email from base64url
      const emailBase64 = id.replace('guest_', '');
      let email: string;
      try {
        email = Buffer.from(emailBase64, 'base64url').toString('utf-8');
      } catch {
        return NextResponse.json(
          { error: 'Neplatne ID zakaznika' },
          { status: 400 }
        );
      }

      // Get all orders for this email
      orders = await prisma.order.findMany({
        where: {
          email: { equals: email, mode: 'insensitive' },
          orderStatus: { notIn: ['cancelled', 'draft'] },
        },
        include: {
          items: {
            select: {
              id: true,
              nameSnapshot: true,
              grams: true,
              pricePerGram: true,
              lineTotal: true,
              saleMode: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (orders.length === 0) {
        return NextResponse.json(
          { error: 'Zakaznik nebyl nalezen' },
          { status: 404 }
        );
      }

      // Build guest customer from latest order info
      const latest = orders[0];
      const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

      customer = {
        id,
        source: 'guest',
        email: latest.email,
        firstName: latest.firstName,
        lastName: latest.lastName,
        phone: latest.phone,
        companyName: latest.companyName,
        taxId: latest.ico,
        streetAddress: latest.streetAddress,
        city: latest.city,
        zipCode: latest.zipCode,
        country: latest.country,
        isWholesale: false,
        type: 'B2C',
        status: null,
        createdAt: orders[orders.length - 1].createdAt,
        stats: {
          totalSpent,
          orderCount: orders.length,
          avgOrder: orders.length > 0 ? Math.round(totalSpent / orders.length) : 0,
          firstOrder: orders[orders.length - 1].createdAt,
          lastOrder: orders[0].createdAt,
        },
      };
    } else {
      // Registered user
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          companyName: true,
          businessType: true,
          taxId: true,
          streetAddress: true,
          city: true,
          zipCode: true,
          country: true,
          isWholesale: true,
          wholesaleRequested: true,
          website: true,
          instagram: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'Zakaznik nebyl nalezen' },
          { status: 404 }
        );
      }

      // Get all orders for this user's email
      orders = await prisma.order.findMany({
        where: {
          email: { equals: user.email, mode: 'insensitive' },
          orderStatus: { notIn: ['cancelled', 'draft'] },
        },
        include: {
          items: {
            select: {
              id: true,
              nameSnapshot: true,
              grams: true,
              pricePerGram: true,
              lineTotal: true,
              saleMode: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
      const isB2B = user.isWholesale || (!!user.companyName && user.companyName.trim() !== '');

      customer = {
        id: user.id,
        source: 'registered',
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        companyName: user.companyName,
        businessType: user.businessType,
        taxId: user.taxId,
        streetAddress: user.streetAddress,
        city: user.city,
        zipCode: user.zipCode,
        country: user.country,
        isWholesale: user.isWholesale,
        wholesaleRequested: user.wholesaleRequested,
        website: user.website,
        instagram: user.instagram,
        type: isB2B ? 'B2B' : 'B2C',
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        stats: {
          totalSpent,
          orderCount: orders.length,
          avgOrder: orders.length > 0 ? Math.round(totalSpent / orders.length) : 0,
          firstOrder: orders.length > 0 ? orders[orders.length - 1].createdAt : null,
          lastOrder: orders.length > 0 ? orders[0].createdAt : null,
        },
      };
    }

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      deliveryStatus: order.deliveryStatus,
      channel: order.channel,
      total: order.total,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      discountAmount: order.discountAmount,
      paymentMethod: order.paymentMethod,
      deliveryMethod: order.deliveryMethod,
      itemCount: order.items.length,
      items: order.items,
    }));

    return NextResponse.json({
      customer,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Error fetching customer detail:', error);
    return NextResponse.json(
      { error: 'Chyba pri nacitani zakaznika' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/customers/[id]
 * Update customer info (only for registered users)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    if (id.startsWith('guest_')) {
      return NextResponse.json(
        { error: 'Neregistrovane zakazniky nelze upravovat' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Zakaznik nebyl nalezen' },
        { status: 404 }
      );
    }

    // Whitelist allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'phone', 'companyName',
      'businessType', 'taxId', 'streetAddress', 'city',
      'zipCode', 'country', 'isWholesale', 'status',
    ];

    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        companyName: true,
        businessType: true,
        taxId: true,
        streetAddress: true,
        city: true,
        zipCode: true,
        country: true,
        isWholesale: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Chyba pri aktualizaci zakaznika' },
      { status: 500 }
    );
  }
}
