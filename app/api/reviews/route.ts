import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/reviews?skuId=xxx
 * Get all approved reviews for a SKU
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skuId = searchParams.get('skuId');

    if (!skuId) {
      return NextResponse.json(
        { error: 'skuId je povinný parametr' },
        { status: 400 }
      );
    }

    // Get approved reviews for this SKU
    const reviews = await prisma.review.findMany({
      where: {
        skuId,
        isApproved: true,
      },
      orderBy: [
        { isVerified: 'desc' }, // Verified first
        { createdAt: 'desc' }, // Then by date
      ],
      select: {
        id: true,
        rating: true,
        title: true,
        comment: true,
        customerName: true,
        isVerified: true,
        helpfulCount: true,
        createdAt: true,
      },
    });

    // Calculate rating summary
    const ratingCounts = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        skuId,
        isApproved: true,
      },
      _count: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingCounts.forEach((item) => {
      ratingDistribution[item.rating as keyof typeof ratingDistribution] =
        item._count.rating;
    });

    return NextResponse.json({
      reviews,
      summary: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání recenzí' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Create a new review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      skuId,
      rating,
      title,
      comment,
      customerName,
      customerEmail,
      orderId,
    } = body;

    // Validation
    if (!skuId || !rating || !comment || !customerName) {
      return NextResponse.json(
        { error: 'SKU ID, hodnocení, komentář a jméno jsou povinné' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Hodnocení musí být mezi 1-5' },
        { status: 400 }
      );
    }

    if (comment.length < 10) {
      return NextResponse.json(
        { error: 'Komentář musí mít alespoň 10 znaků' },
        { status: 400 }
      );
    }

    // Check if SKU exists
    const sku = await prisma.sku.findUnique({
      where: { id: skuId },
    });

    if (!sku) {
      return NextResponse.json(
        { error: 'Produkt nebyl nalezen' },
        { status: 404 }
      );
    }

    // Check for current user session
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;
    let userId: string | null = null;
    let isVerified = false;

    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { token: sessionToken },
        include: { user: true },
      });

      if (session && new Date(session.expiresAt) > new Date()) {
        userId = session.userId;

        // Check if this user has purchased this SKU
        if (orderId) {
          const order = await prisma.order.findFirst({
            where: {
              id: orderId,
              email: session.user.email,
              paymentStatus: 'paid',
              items: {
                some: {
                  skuId,
                },
              },
            },
          });

          if (order) {
            isVerified = true;
          }
        }
      }
    }

    // Check if user already reviewed this SKU
    if (userId) {
      const existingReview = await prisma.review.findFirst({
        where: {
          skuId,
          userId,
        },
      });

      if (existingReview) {
        return NextResponse.json(
          { error: 'Tento produkt jste již ohodnotili' },
          { status: 400 }
        );
      }
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        skuId,
        userId,
        orderId: orderId || null,
        rating: parseInt(rating),
        title: title || null,
        comment,
        customerName,
        customerEmail: customerEmail || null,
        isVerified,
        isApproved: false, // Requires admin approval
      },
    });

    return NextResponse.json({
      success: true,
      message:
        'Děkujeme za vaši recenzi! Bude zveřejněna po schválení administrátorem.',
      reviewId: review.id,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření recenze' },
      { status: 500 }
    );
  }
}
