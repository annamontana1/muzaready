/**
 * Meta Conversions API (Server-Side Tracking)
 *
 * This sends purchase events from server to Meta Ads.
 * More reliable than client-side Pixel (works with ad blockers, iOS privacy, etc.)
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import crypto from 'crypto';

type ConversionEvent = {
  eventName: 'Purchase' | 'Lead' | 'InitiateCheckout';
  eventTime: number; // Unix timestamp in seconds
  eventId?: string; // Deduplication ID (same as client-side event_id)
  userData: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
    fbp?: string; // Facebook browser ID cookie
    fbc?: string; // Facebook click ID cookie
  };
  customData: {
    currency: string;
    value: number;
    contentIds?: string[];
    contentType?: string;
    numItems?: number;
    orderId?: string;
  };
  actionSource: 'website' | 'email' | 'phone_call' | 'physical_store';
};

/**
 * Hash user data for privacy (Meta requires hashed PII)
 */
function hashData(data: string | undefined): string | undefined {
  if (!data) return undefined;
  const normalized = data.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Send conversion event to Meta Conversions API
 */
export async function sendMetaConversion(event: ConversionEvent): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn('Meta Conversions API not configured (missing PIXEL_ID or ACCESS_TOKEN)');
    return false;
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${pixelId}/events`;

    // Hash user data for privacy
    const hashedUserData: any = {
      em: hashData(event.userData.email),
      ph: hashData(event.userData.phone),
      fn: hashData(event.userData.firstName),
      ln: hashData(event.userData.lastName),
      ct: hashData(event.userData.city),
      zp: hashData(event.userData.zipCode),
      country: hashData(event.userData.country),
      client_ip_address: event.userData.clientIpAddress,
      client_user_agent: event.userData.clientUserAgent,
      fbp: event.userData.fbp,
      fbc: event.userData.fbc,
    };

    // Remove undefined values
    Object.keys(hashedUserData).forEach(
      (key) => hashedUserData[key] === undefined && delete hashedUserData[key]
    );

    const payload = {
      data: [
        {
          event_name: event.eventName,
          event_time: event.eventTime,
          event_id: event.eventId,
          user_data: hashedUserData,
          custom_data: event.customData,
          action_source: event.actionSource,
        },
      ],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        access_token: accessToken,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Meta Conversions API error:', error);
      return false;
    }

    const result = await response.json();
    console.log('✅ Meta Conversion sent:', {
      event: event.eventName,
      orderId: event.customData.orderId,
      value: event.customData.value,
      events_received: result.events_received,
    });

    return true;
  } catch (error) {
    console.error('Failed to send Meta conversion:', error);
    return false;
  }
}

/**
 * Track purchase conversion from server-side (GoPay webhook)
 */
export async function trackServerSidePurchase(orderData: {
  orderId: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  value: number; // Total in CZK
  currency: string;
  numItems: number;
  productIds?: string[];
}): Promise<boolean> {
  const eventTime = Math.floor(Date.now() / 1000);

  return await sendMetaConversion({
    eventName: 'Purchase',
    eventTime,
    eventId: `order_${orderData.orderId}_${eventTime}`, // Deduplication
    userData: {
      email: orderData.email,
      phone: orderData.phone,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      city: orderData.city,
      zipCode: orderData.zipCode,
      country: orderData.country,
    },
    customData: {
      currency: orderData.currency,
      value: orderData.value,
      contentIds: orderData.productIds,
      contentType: 'product',
      numItems: orderData.numItems,
      orderId: orderData.orderId,
    },
    actionSource: 'website',
  });
}
