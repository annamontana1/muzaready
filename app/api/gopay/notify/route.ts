import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getGoPayBaseUrl, getGoPayAccessToken } from '@/lib/gopay';

export const runtime = 'nodejs';

/**
 * GoPay Webhook (Notification) Endpoint
 *
 * GoPay sends GET or POST with payment ID when payment status changes.
 * We verify by calling GoPay status API — never trust the webhook payload alone.
 *
 * GET:  /api/gopay/notify?id=<paymentId>&parent_id=<parentId>
 * POST: application/x-www-form-urlencoded body with `id` parameter
 *
 * GoPay REQUIRES HTTP 200 response — on any internal error we still return 200
 * and log the error so GoPay doesn't keep retrying with a broken request.
 */

async function handleNotification(gopayPaymentId: string | null): Promise<NextResponse> {
  if (!gopayPaymentId) {
    console.error('GoPay webhook: missing payment id');
    // Return 200 so GoPay stops retrying — this is a misconfigured notification URL
    return NextResponse.json({ success: true, message: 'No payment id' }, { status: 200 });
  }

  console.log(`GoPay webhook received for payment ${gopayPaymentId}`);

  try {
    // Verify payment status by calling GoPay API directly
    const accessToken = await getGoPayAccessToken('payment-all');
    const baseUrl = getGoPayBaseUrl();

    const statusResponse = await fetch(`${baseUrl}/api/payments/payment/${gopayPaymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error(`GoPay status API error (${statusResponse.status}): ${errorText}`);
      // Return 200 anyway so GoPay doesn't flood with retries
      return NextResponse.json({ success: true, message: 'Notification received' }, { status: 200 });
    }

    const paymentData = await statusResponse.json();
    const { state, order_number: orderId } = paymentData;

    console.log(`GoPay payment ${gopayPaymentId}: state=${state}, order=${orderId}`);

    // Only process PAID state — for all other states just acknowledge
    if (state !== 'PAID') {
      console.log(`GoPay payment ${gopayPaymentId} state=${state} (not PAID, skipping)`);
      return NextResponse.json({ success: true, message: `Notification received, state=${state}` });
    }

    // Process payment confirmation in a transaction
    let justPaid = false as boolean; // true jen když tato notifikace objednávku přepnula na „zaplaceno“
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          OR: [
            { gopayPaymentId: String(gopayPaymentId) },
            { id: orderId },
          ],
        },
        include: { items: { include: { sku: true } } },
      });

      if (!order) {
        throw new Error(`Order not found for GoPay payment ${gopayPaymentId} / order ${orderId}`);
      }

      // Idempotence: skip if already paid
      if (order.paymentStatus === 'paid') {
        console.log(`Order ${order.id} already paid (idempotent)`);
        return order;
      }

      const updatedOrder = await tx.order.update({
        where: { id: order.id },
        data: {
          orderStatus:
            order.orderStatus === 'pending' || order.orderStatus === 'draft'
              ? 'processing'
              : order.orderStatus,
          paymentStatus: 'paid',
          paidAt: new Date(),
          gopayPaymentId: String(gopayPaymentId),
          updatedAt: new Date(),
        },
        include: { items: { include: { sku: true } } },
      });

      // Update stock movements from "Rezervace" to "Prodáno"
      for (const item of updatedOrder.items) {
        await tx.stockMovement.updateMany({
          where: {
            refOrderId: order.id,
            skuId: item.skuId,
            note: { contains: 'Rezervace' },
          },
          data: {
            note:
              item.sku.saleMode === 'PIECE_BY_WEIGHT'
                ? `Prodáno (objednávka ${order.id.substring(0, 8)})`
                : `Prodáno ${item.grams}g (objednávka ${order.id.substring(0, 8)})`,
          },
        });
      }

      justPaid = true;
      return updatedOrder;
    });

    console.log(`Order ${result.id} payment confirmed`);

    // ── Non-critical side effects (failures don't affect HTTP 200 response) ──

    // Meta Ads conversion tracking
    try {
      const { trackServerSidePurchase } = await import('@/lib/marketing/meta-conversions');
      await trackServerSidePurchase({
        orderId: result.id,
        email: result.email,
        phone: result.phone || undefined,
        firstName: result.firstName || undefined,
        lastName: result.lastName || undefined,
        city: result.city || undefined,
        zipCode: result.zipCode || undefined,
        country: result.country || undefined,
        value: result.total,
        currency: 'CZK',
        numItems: result.items.length,
        productIds: result.items.map((item: any) => item.skuId),
      });
    } catch (e) {
      console.error('Meta conversion tracking failed (non-critical):', e);
    }

    // Faktura — jediným zdrojem dokladů je Fakturoid (prodávající je neplátce DPH,
    // interní PDF s DPH se nevystavuje). Když Fakturoid není nakonfigurovaný nebo
    // selže, jen logujeme; fakturu pak lze vystavit ručně v detailu objednávky.
    let invoiceUrl: string | undefined = result.fakturoidInvoiceUrl || undefined;
    let invoiceNumber: string | undefined = result.fakturoidInvoiceNum || undefined;
    try {
      if (!result.fakturoidInvoiceId) {
        // E-mail z Fakturoidu neposíláme — odkaz na fakturu jde v potvrzení platby níže.
        const { createFakturoidInvoiceForOrder } = await import('@/lib/order-invoice');
        const invoice = await createFakturoidInvoiceForOrder(result.id, { sendEmail: false });
        if (invoice.success) {
          invoiceUrl = invoice.invoiceUrl;
          invoiceNumber = invoice.invoiceNumber;
          console.log(`Fakturoid invoice ${invoice.invoiceNumber} created for order ${result.id}`);
        } else {
          console.error(`Fakturoid invoice not created for order ${result.id}:`, invoice.error);
        }
      } else if (justPaid) {
        // Objednávka už doklad má (vystavený dřív v adminu) → zapsat k němu úhradu
        if (result.fakturoidIsProforma) {
          console.error(
            `Order ${result.id} paid via GoPay but has a proforma ${invoiceNumber || result.fakturoidInvoiceId} — settle it manually in Fakturoid`
          );
        } else {
          const { markInvoicePaid } = await import('@/lib/fakturoid');
          const paid = await markInvoicePaid(Number(result.fakturoidInvoiceId), result.paidAt ?? undefined);
          if (!paid.success) {
            console.error(`Fakturoid invoice ${invoiceNumber} not marked as paid:`, paid.error);
          }
        }
      }
    } catch (e) {
      console.error('Fakturoid integration failed (non-critical):', e);
    }

    // Payment confirmation email (jedno potvrzení s odkazem na uhrazenou fakturu).
    // Jen při přechodu na „zaplaceno“ — opakovaná notifikace e-mail neposílá znovu.
    if (justPaid) {
      try {
        const { sendPaymentConfirmationEmail } = await import('@/lib/email');
        const { customerEmailOf } = await import('@/lib/order-invoice');
        const email = customerEmailOf(result);
        if (email) {
          await sendPaymentConfirmationEmail(email, result.id, result.total, result.orderNumber, {
            invoiceUrl,
            invoiceNumber,
          });
        }
      } catch (e) {
        console.error('Payment confirmation email failed (non-critical):', e);
      }
    }

    // Auto-create Zásilkovna shipment
    const packetaPointId = (result as any).packetaPointId;
    if (packetaPointId && (result as any).deliveryMethod === 'zasilkovna') {
      try {
        const { createPacket } = await import('@/lib/zasilkovna');
        const shipmentResult = await createPacket(
          result.id.substring(0, 12),
          {
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            phone: result.phone || '',
          },
          parseInt(packetaPointId, 10),
          result.total,
          0.5,
          0
        );
        if (shipmentResult.success && shipmentResult.barcode) {
          await prisma.order.update({
            where: { id: result.id },
            data: {
              deliveryStatus: 'shipped',
              trackingNumber: shipmentResult.barcode,
              carrier: 'zasilkovna',
              shippedAt: new Date(),
            },
          });
          try {
            const { sendShippingNotificationEmail } = await import('@/lib/email');
            await sendShippingNotificationEmail(result.email, result.id, shipmentResult.barcode, 'zasilkovna');
          } catch (e) {
            console.error('Shipping notification email failed:', e);
          }
          console.log(`Zásilkovna shipment auto-created: ${shipmentResult.barcode}`);
        }
      } catch (e) {
        console.error('Zásilkovna auto-shipment failed (non-critical):', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment confirmed',
      orderId: result.id,
      orderStatus: result.orderStatus,
      paymentStatus: result.paymentStatus,
    });
  } catch (error) {
    console.error('GoPay webhook error:', error);
    // Return 200 so GoPay doesn't keep retrying — internal error is logged
    return NextResponse.json({ success: true, message: 'Notification received' }, { status: 200 });
  }
}

/** GoPay sends GET: /api/gopay/notify?id=<paymentId>&parent_id=<parentId> */
export async function GET(request: NextRequest) {
  const gopayPaymentId = request.nextUrl.searchParams.get('id');
  return handleNotification(gopayPaymentId);
}

/** GoPay may also send POST with application/x-www-form-urlencoded body */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const gopayPaymentId =
    params.get('id') || request.nextUrl.searchParams.get('id');
  return handleNotification(gopayPaymentId);
}
