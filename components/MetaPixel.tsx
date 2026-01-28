'use client';

import Script from 'next/script';
import { useEffect } from 'react';

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * Meta Pixel Component
 *
 * Tracks:
 * - PageView (automatic)
 * - ViewContent (product pages)
 * - AddToCart (cart actions)
 * - InitiateCheckout (checkout start)
 * - Purchase (order completion with is_new_customer flag)
 */
export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    if (!pixelId || typeof window === 'undefined') return;

    // Initialize fbq if not already present
    if (!window.fbq) {
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
      })(window, document, 'script');
    }

    // Track PageView on mount
    window.fbq('track', 'PageView');
  }, [pixelId]);

  if (!pixelId) {
    console.warn('Meta Pixel ID not configured');
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/**
 * Helper function to track purchase event
 * Call this from client-side after successful order
 */
export function trackPurchase(orderData: {
  orderId: string;
  value: number; // in CZK
  currency: string;
  isNewCustomer: boolean;
  numItems?: number;
  contentIds?: string[];
}) {
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('track', 'Purchase', {
    value: orderData.value,
    currency: orderData.currency,
    content_ids: orderData.contentIds || [],
    content_type: 'product',
    num_items: orderData.numItems || 1,
    // CRITICAL: This flag ensures only first purchases count toward ROAS
    is_new_customer: orderData.isNewCustomer,
  });

  console.log('📊 Meta Pixel: Purchase tracked', {
    orderId: orderData.orderId,
    value: orderData.value,
    isNewCustomer: orderData.isNewCustomer,
  });
}

/**
 * Track AddToCart event
 */
export function trackAddToCart(productData: {
  contentId: string;
  contentName: string;
  value: number;
  currency: string;
}) {
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('track', 'AddToCart', {
    content_ids: [productData.contentId],
    content_name: productData.contentName,
    content_type: 'product',
    value: productData.value,
    currency: productData.currency,
  });
}

/**
 * Track InitiateCheckout event
 */
export function trackInitiateCheckout(cartData: {
  value: number;
  currency: string;
  numItems: number;
  contentIds: string[];
}) {
  if (typeof window === 'undefined' || !window.fbq) return;

  window.fbq('track', 'InitiateCheckout', {
    content_ids: cartData.contentIds,
    content_type: 'product',
    num_items: cartData.numItems,
    value: cartData.value,
    currency: cartData.currency,
  });
}
