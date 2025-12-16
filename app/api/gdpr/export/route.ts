import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * POST /api/gdpr/export
 * Export all user data (GDPR Article 15 - Right to access)
 *
 * Request body:
 * {
 *   email: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email je povinný' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatná e-mailová adresa' },
        { status: 400 }
      );
    }

    // Find user account
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        sessions: {
          select: {
            id: true,
            createdAt: true,
            expiresAt: true,
          },
        },
      },
    });

    // Find all orders
    const orders = await prisma.order.findMany({
      where: { email },
      include: {
        items: {
          include: {
            sku: {
              select: {
                sku: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      email,
      userData: user ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        companyName: user.companyName,
        businessType: user.businessType,
        website: user.website,
        instagram: user.instagram,
        country: user.country,
        city: user.city,
        zipCode: user.zipCode,
        streetAddress: user.streetAddress,
        taxId: user.taxId,
        isWholesale: user.isWholesale,
        wholesaleRequested: user.wholesaleRequested,
        wholesaleRequestedAt: user.wholesaleRequestedAt,
        wholesaleApprovedAt: user.wholesaleApprovedAt,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        sessions: user.sessions,
      } : null,
      orders: orders.map((order) => ({
        id: order.id,
        firstName: order.firstName,
        lastName: order.lastName,
        phone: order.phone,
        companyName: order.companyName,
        ico: order.ico,
        dic: order.dic,
        streetAddress: order.streetAddress,
        city: order.city,
        zipCode: order.zipCode,
        country: order.country,
        billingStreet: order.billingStreet,
        billingCity: order.billingCity,
        billingZipCode: order.billingZipCode,
        billingCountry: order.billingCountry,
        deliveryMethod: order.deliveryMethod,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        discountAmount: order.discountAmount,
        total: order.total,
        couponCode: order.couponCode,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        shippedAt: order.shippedAt,
        items: order.items.map((item) => ({
          skuId: item.skuId,
          skuName: item.nameSnapshot || item.sku?.name,
          grams: item.grams,
          pricePerGram: item.pricePerGram,
          lineTotal: item.lineTotal,
          ending: item.ending,
          assemblyFeeCzk: item.assemblyFeeCzk,
          assemblyFeeTotal: item.assemblyFeeTotal,
        })),
      })),
      dataCategories: {
        personalInfo: user !== null,
        orderHistory: orders.length > 0,
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, o) => sum + o.total, 0),
      },
      gdprInfo: {
        controller: 'Múza Hair s.r.o.',
        controllerContact: 'info@muzahair.cz',
        dataRetentionPeriod: '7 let (daňové účely)',
        rights: [
          'Právo na přístup k údajům (tento export)',
          'Právo na opravu údajů (kontaktujte info@muzahair.cz)',
          'Právo na výmaz údajů (použijte /api/gdpr/delete)',
          'Právo na omezení zpracování',
          'Právo na přenositelnost údajů',
          'Právo vznést námitku',
          'Právo podat stížnost u ÚOOÚ',
        ],
      },
    };

    // Return as JSON for download
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="gdpr-export-${email}-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting GDPR data:', error);
    return NextResponse.json(
      {
        error: 'Chyba při exportu dat',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
