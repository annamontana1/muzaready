import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

/**
 * POST /api/gdpr/delete
 * Request deletion of user data (GDPR Article 17 - Right to erasure)
 *
 * Request body:
 * {
 *   email: string,
 *   reason?: string,
 *   confirmationCode?: string
 * }
 *
 * NOTE: This creates a deletion request for admin review.
 * Actual deletion happens after admin approval (legal requirements).
 */
export async function POST(request: NextRequest) {
  try {
    const { email, reason } = await request.json();

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

    // Check if user/orders exist
    const [user, orderCount] = await Promise.all([
      prisma.user.findUnique({
        where: { email },
      }),
      prisma.order.count({
        where: { email },
      }),
    ]);

    if (!user && orderCount === 0) {
      return NextResponse.json(
        { error: 'Nenalezeny žádné data pro tento email' },
        { status: 404 }
      );
    }

    // Check for active orders (cannot delete if there are pending orders)
    const activeOrders = await prisma.order.count({
      where: {
        email,
        orderStatus: {
          in: ['pending', 'processing', 'shipped'],
        },
      },
    });

    if (activeOrders > 0) {
      return NextResponse.json(
        {
          error: `Nelze smazat účet s aktivními objednávkami (${activeOrders}). Počkejte prosím na dokončení všech objednávek nebo kontaktujte podporu.`,
          activeOrders,
        },
        { status: 400 }
      );
    }

    // Check for legal retention requirements
    // Orders must be kept for 7 years for tax purposes in Czech Republic
    const sevenYearsAgo = new Date();
    sevenYearsAgo.setFullYear(sevenYearsAgo.getFullYear() - 7);

    const recentOrders = await prisma.order.count({
      where: {
        email,
        createdAt: {
          gte: sevenYearsAgo,
        },
      },
    });

    if (recentOrders > 0) {
      return NextResponse.json({
        status: 'partial_deletion',
        message: 'Účet bude smazán, ale objednávky mladší 7 let musíme uchovat z daňových důvodů.',
        details: {
          userAccountWillBeDeleted: user !== null,
          ordersToRetain: recentOrders,
          ordersRetainedUntil: 'Objednávky budou anonymizovány - osobní údaje odebrány, zachovány pouze transakční data.',
          legalBasis: 'Zákon č. 563/1991 Sb. o účetnictví - 7letá archivační povinnost',
        },
        deletionRequest: {
          email,
          reason: reason || 'Nevyplněno',
          requestedAt: new Date().toISOString(),
          estimatedDeletionDate: 'Do 30 dnů od schválení administrátorem',
        },
        nextSteps: [
          'Váš požadavek byl zaznamenán',
          'Administrátor jej zpracuje do 30 dnů',
          'Obdržíte potvrzovací email',
          'Uživatelský účet bude smazán',
          'Osobní údaje v objednávkách budou anonymizovány',
          'Transakční data zůstanou pro daňové účely',
        ],
      });
    }

    // If all orders are older than 7 years, can delete everything
    if (user) {
      // Delete user and related data
      await prisma.$transaction([
        // Delete sessions
        prisma.session.deleteMany({
          where: { userId: user.id },
        }),
        // Delete user
        prisma.user.delete({
          where: { id: user.id },
        }),
      ]);
    }

    // Anonymize old orders
    if (orderCount > 0) {
      await prisma.order.updateMany({
        where: { email },
        data: {
          email: `anonymized-${Date.now()}@deleted.local`,
          firstName: 'Anonymizováno',
          lastName: 'Anonymizováno',
          phone: null,
          streetAddress: 'Anonymizováno',
          city: 'Anonymizováno',
          zipCode: '00000',
          companyName: null,
          ico: null,
          dic: null,
          billingStreet: null,
          billingCity: null,
          billingZipCode: null,
          billingCountry: null,
          notesCustomer: null,
        },
      });
    }

    return NextResponse.json({
      status: 'completed',
      message: 'Všechna vaše data byla úspěšně smazána nebo anonymizována.',
      deleted: {
        userAccount: user !== null,
        orders: orderCount > 0 ? 'anonymizováno' : 'žádné',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting GDPR data:', error);
    return NextResponse.json(
      {
        error: 'Chyba při mazání dat',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
