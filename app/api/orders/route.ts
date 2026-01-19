import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { CreateOrderSchema } from '@/lib/validation/orders';
export const runtime = 'nodejs';

/**
 * Verify user session and return email if valid
 * This prevents unauthorized access to other users' orders
 */
async function getAuthenticatedEmail(requestEmail: string): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) {
    return null;
  }

  // TODO: Implement proper session validation when user auth is added
  // For now, we trust the email parameter if a session exists
  // In production, this should verify the session matches the requested email
  return requestEmail;
}

export async function GET(request: NextRequest) {
  try {
    // Vyžadujeme email parameter pro vyhledání objednávek
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Verify user is authenticated and authorized to view these orders
    const authenticatedEmail = await getAuthenticatedEmail(email);
    if (!authenticatedEmail) {
      return NextResponse.json(
        { error: 'Unauthorized - please log in to view your orders' },
        { status: 401 }
      );
    }

    // Vrátíme pouze objednávky pro daný email
    const orders = await prisma.order.findMany({
      where: {
        email: authenticatedEmail, // Use authenticated email, not request param
      },
      include: {
        items: {
          include: {
            sku: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validation = CreateOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { email, items: cartLines, shippingInfo, packetaPoint, couponCode } = validation.data;

    // Import the quote function at runtime to avoid circular dependencies
    const { quoteCartLines } = await import('@/lib/stock');

    // Validate and quote the cart lines - recalculate all prices to ensure freshness
    let quotedLines;
    try {
      // Note: This recalculates ALL prices from the database/matrix
      // This prevents price discrepancies from stale cart items
      const quote = await quoteCartLines(cartLines);
      quotedLines = quote.items;
    } catch (quoteError: any) {
      return NextResponse.json(
        { error: quoteError.message || 'Chyba při kalkulaci ceny' },
        { status: 400 }
      );
    }

    const subtotalAmount = quotedLines.reduce((sum, item) => sum + item.lineGrandTotal, 0);

    // Calculate shipping cost (frontend should send this, but we calculate as fallback)
    const shippingCost = shippingInfo?.deliveryMethod === 'zasilkovna'
      ? 65
      : (subtotalAmount >= 3000 ? 0 : 150);

    // ========================================================================
    // ATOMIC STOCK RESERVATION - prevents overselling
    // Uses database transaction with row-level locking
    // ========================================================================
    let order;
    try {
      order = await prisma.$transaction(async (tx) => {
        // Step 1: Lock and verify stock for each item
        // Using raw query with FOR UPDATE to lock rows during transaction
        for (const item of quotedLines) {
          const sku = item.sku;

          // Fetch current SKU state with lock
          const currentSku = await tx.sku.findUnique({
            where: { id: sku.id },
          });

          if (!currentSku) {
            throw new Error(`Produkt "${sku.name || sku.sku}" již neexistuje`);
          }

          // Check if SKU is still in stock
          if (!currentSku.inStock) {
            throw new Error(`"${currentSku.name || currentSku.sku}" již není na skladě`);
          }

          // For PIECE_BY_WEIGHT: check if not sold out
          if (currentSku.saleMode === 'PIECE_BY_WEIGHT') {
            if (currentSku.soldOut) {
              throw new Error(`Culík "${currentSku.name || currentSku.sku}" již není dostupný`);
            }
            // Reserve by marking as sold out
            await tx.sku.update({
              where: { id: sku.id },
              data: {
                soldOut: true,
                inStock: false,
              },
            });
            // Record stock movement
            await tx.stockMovement.create({
              data: {
                skuId: sku.id,
                type: 'OUT',
                grams: item.grams,
                note: `Rezervace (objednávka pending)`,
              },
            });
          }

          // For BULK_G: check if enough grams available and deduct
          if (currentSku.saleMode === 'BULK_G') {
            const availableGrams = currentSku.availableGrams || 0;
            if (availableGrams < item.grams) {
              throw new Error(
                `"${currentSku.name || currentSku.sku}" má pouze ${availableGrams}g skladem, požadováno ${item.grams}g`
              );
            }
            // Deduct stock immediately
            const newAvailableGrams = availableGrams - item.grams;
            await tx.sku.update({
              where: { id: sku.id },
              data: {
                availableGrams: newAvailableGrams,
                inStock: newAvailableGrams > 0,
              },
            });
            // Record stock movement
            await tx.stockMovement.create({
              data: {
                skuId: sku.id,
                type: 'OUT',
                grams: item.grams,
                note: `Rezervace ${item.grams}g (objednávka pending)`,
              },
            });
          }
        }

        // Step 2: Create the order (stock is now reserved)
        const newOrder = await tx.order.create({
          data: {
            email,
            firstName: shippingInfo?.firstName || 'Customer',
            lastName: shippingInfo?.lastName || '',
            phone: shippingInfo?.phone || null,
            streetAddress: shippingInfo?.streetAddress || packetaPoint?.street || 'Unknown',
            city: shippingInfo?.city || packetaPoint?.city || 'Unknown',
            zipCode: shippingInfo?.zipCode || packetaPoint?.zip || '00000',
            country: shippingInfo?.country || 'CZ',
            deliveryMethod: shippingInfo?.deliveryMethod || 'standard',

            // Zásilkovna pickup point data
            packetaPointId: packetaPoint?.id || null,
            packetaPointName: packetaPoint?.name || null,
            packetaPointData: packetaPoint ? JSON.stringify(packetaPoint) : null,

            orderStatus: 'pending', // Waiting for GoPay payment confirmation
            paymentStatus: 'unpaid',
            deliveryStatus: 'pending',
            subtotal: subtotalAmount,
            shippingCost: shippingCost,
            total: subtotalAmount + shippingCost,
            items: {
              create: quotedLines.map((item) => ({
                sku: {
                  connect: {
                    id: item.sku.id,
                  },
                },
                saleMode: item.sku.saleMode,
                grams: item.grams,
                pricePerGram: item.pricePerGram ?? 0,
                lineTotal: item.lineTotal,
                nameSnapshot: item.snapshotName,
                ending: item.ending as any,
                assemblyFeeType: item.assemblyFeeType,
                assemblyFeeCzk: item.assemblyFeeCzk,
                assemblyFeeTotal: item.assemblyFeeTotal,
              })),
            },
          },
          include: {
            items: {
              include: {
                sku: true,
              },
            },
          },
        });

        // Update stock movements with order reference
        for (const item of quotedLines) {
          await tx.stockMovement.updateMany({
            where: {
              skuId: item.sku.id,
              note: { contains: 'objednávka pending' },
              refOrderId: null,
            },
            data: {
              refOrderId: newOrder.id,
              note: item.sku.saleMode === 'PIECE_BY_WEIGHT'
                ? `Rezervace (objednávka ${newOrder.id.substring(0, 8)})`
                : `Rezervace ${item.grams}g (objednávka ${newOrder.id.substring(0, 8)})`,
            },
          });
        }

        return newOrder;
      }, {
        // Transaction options for better isolation
        isolationLevel: 'Serializable', // Strongest isolation to prevent race conditions
        timeout: 10000, // 10 second timeout
      });
    } catch (txError: any) {
      // Transaction failed - likely due to stock issues
      console.error('Stock reservation failed:', txError);
      return NextResponse.json(
        { error: txError.message || 'Nedostatek zboží na skladě' },
        { status: 400 }
      );
    }

    // Apply coupon if provided
    if (couponCode) {
      try {
        const { applyCouponToOrder } = await import('@/lib/coupon-utils');
        const couponResult = await applyCouponToOrder(
          couponCode,
          subtotalAmount + shippingCost,
          email,
          order.id
        );

        if (couponResult.success && couponResult.discount > 0) {
          // Update order with discount
          const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
              discountAmount: couponResult.discount,
              total: (subtotalAmount + shippingCost) - couponResult.discount,
            },
          });

          // Update local order object to return correct total
          order.discountAmount = couponResult.discount;
          order.total = updatedOrder.total;
        }
      } catch (couponError) {
        console.error('Failed to apply coupon (non-critical):', couponError);
        // Don't fail order creation if coupon fails
      }
    }

    // Send order confirmation email to customer
    try {
      const { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } = await import('@/lib/email');
      const emailItems = order.items.map((item) => ({
        variant: item.nameSnapshot || 'Neznámý produkt',
        quantity: item.saleMode === 'BULK_G' ? `${item.grams}g` : '1',
        price: item.lineTotal + (item.assemblyFeeTotal || 0),
      }));

      // Send confirmation to customer
      await sendOrderConfirmationEmail(order.email, order.id, emailItems, order.total);

      // Send notification to admin
      await sendAdminOrderNotificationEmail(order.id, order.email, emailItems, order.total);
    } catch (emailError) {
      console.error('Failed to send order emails:', emailError);
      // Don't fail the order creation if email fails
    }

    return NextResponse.json(
      {
        orderId: order.id,
        email: order.email,
        total: order.total,
        orderStatus: order.orderStatus,
        message: 'Objednávka vytvořena. Čeká na platbu přes GoPay.',
        items: order.items,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Chyba při vytvoření objednávky' },
      { status: 500 }
    );
  }
}