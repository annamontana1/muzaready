import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendOrderConfirmationEmail, sendAdminOrderNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, items, total, shippingInfo } = body;

    // Validation
    if (!email || !items || items.length === 0 || !total || !shippingInfo) {
      return NextResponse.json(
        { message: 'Chybějící požadovaná pole' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        email,
        status: 'pending',
        total,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variant: item.variant,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log('Order created:', order.id);

    // Send order confirmation email to customer
    try {
      await sendOrderConfirmationEmail(email, order.id, order.items, total);
      console.log('Order confirmation email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the order creation if email fails
    }

    // Send admin notification email
    try {
      await sendAdminOrderNotificationEmail(order.id, email, order.items, total);
      console.log('Admin order notification email sent successfully');
    } catch (adminEmailError) {
      console.error('Error sending admin notification email:', adminEmailError);
      // Don't fail the order creation if email fails
    }

    // TODO: In GoPay integration: create payment session and return payment URL

    return NextResponse.json(
      {
        orderId: order.id,
        message: 'Objednávka byla vytvořena. Čeká na zaplacení.',
        // paymentUrl: 'https://gopay.com/...', // Will be added when integrating GoPay
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Chyba při zpracování objednávky' },
      { status: 500 }
    );
  }
}
