# GoPay Integration Setup Guide

This document explains how to configure GoPay payment gateway for Múza Hair e-shop.

## Overview

The payment flow is implemented as follows:

```
1. Customer fills checkout form
2. /api/orders creates order (status: pending) - NO stock deduction yet
3. /api/gopay/create-payment creates GoPay payment session
4. Customer redirected to GoPay payment gateway
5. After payment, GoPay calls /api/gopay/notify webhook
6. Webhook confirms payment, deducts stock, updates order status to 'paid'
7. Customer redirected to confirmation page (/pokladna/potvrzeni)
```

## Prerequisites

You'll need a **GoPay merchant account**. GoPay is the Czech payment gateway used for CZK payments.

- **Website**: https://www.gopay.cz/
- **Support**: https://help.gopay.cz/

## Step 1: Get GoPay Credentials

1. Log in to your GoPay merchant account at https://dashboard.gopay.cz/
2. Navigate to **Settings → API Keys** (or similar, depending on their current UI)
3. You'll need:
   - **Client ID** (OAuth identifier)
   - **Client Secret** (OAuth secret key)
   - **Gateway ID** (Merchant/Gateway identifier, aka `gid`)

4. Also configure:
   - **Sandbox mode** initially for testing
   - **Webhook URL**: `https://your-domain.com/api/gopay/notify`
   - **Success redirect**: `https://your-domain.com/pokladna/potvrzeni?orderId={orderId}`
   - **Failure redirect**: `https://your-domain.com/pokladna?paymentFailed=true`

## Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# GoPay Configuration
GOPAY_CLIENT_ID=your_client_id_here
GOPAY_CLIENT_SECRET=your_client_secret_here
GOPAY_GATEWAY_ID=your_gateway_id_here
GOPAY_ENV=test                          # Use 'test' for sandbox, 'production' for live
SITE_URL=http://localhost:3000          # For local dev; use https://your-domain.com for production
```

### For Production

When deploying to production:

```env
GOPAY_ENV=production
SITE_URL=https://muzaready.com          # Your actual domain
```

On Vercel, these can be set in **Settings → Environment Variables**.

## Step 3: Test Payment Flow (Sandbox)

With `GOPAY_ENV=test`, the system uses GoPay's sandbox environment:

1. Start dev server: `npm run dev`
2. Add items to cart and go to checkout (`/pokladna`)
3. Fill form and click "Pokračovat k platbě" (Continue to payment)
4. You should be redirected to GoPay sandbox
5. Use test card credentials:
   - **Card number**: 4111111111111111 (or other test numbers provided by GoPay)
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits
6. Complete payment
7. GoPay will redirect back to confirmation page with `orderId` in URL
8. The webhook (`/api/gopay/notify`) will be called to confirm payment
9. Stock will be deducted, order status set to 'paid'

## Step 4: Verify Webhook Configuration

For the payment confirmation to work:

1. GoPay must be configured to call your webhook endpoint
2. The webhook is at: `https://your-domain.com/api/gopay/notify`
3. In development, use a tool like **ngrok** to expose localhost:
   ```bash
   ngrok http 3000
   # Then use https://xxxx-xx-xxx-xxx-xx.ngrok.io/api/gopay/notify as webhook
   ```

## Step 5: Deploy to Production

1. Set `GOPAY_ENV=production` and actual credentials in Vercel environment variables
2. Configure webhook URL in GoPay dashboard to point to your production domain
3. Test with real payments (small amounts recommended)

## Troubleshooting

### "GoPay není nakonfigurován" (GoPay not configured)

**Problem**: Environment variables are missing.

**Solution**: Check that `.env.local` has all required variables:
```bash
grep -E "GOPAY_|SITE_URL" .env.local
```

### Webhook Not Being Called

**Problem**: Payment succeeds but stock isn't deducted.

**Possible causes**:
1. Webhook URL isn't configured in GoPay dashboard
2. GoPay can't reach your webhook URL (check firewall/routing)
3. Webhook signature verification failing

**Debug**:
- Check server logs: `npm run dev` and look for GoPay webhook messages
- Verify GoPay can reach your URL via ping/curl
- Make sure webhook URL in GoPay settings is exactly correct

### Test Card Declined

**Problem**: Test payment fails.

**Solution**: Use GoPay's test cards. Contact GoPay support for complete list. Common ones:
- Visa: 4111111111111111
- Mastercard: 5555555555554444

## API Endpoints

### POST /api/orders
Creates an order (status: pending)

**Request**:
```json
{
  "email": "customer@example.com",
  "cartLines": [
    {"skuId": "sku-123", "wantedGrams": 100, "ending": "keratin"}
  ],
  "shippingInfo": {
    "firstName": "Jan",
    "lastName": "Novák",
    "phone": "+420123456789",
    "address": "Ulice 123",
    "city": "Praha",
    "postalCode": "11000",
    "country": "CZ"
  }
}
```

**Response**:
```json
{
  "orderId": "ord_abc123xyz",
  "total": 2500,
  "status": "pending",
  "items": [...]
}
```

### POST /api/gopay/create-payment
Creates a GoPay payment session and returns redirect URL

**Request**:
```json
{
  "orderId": "ord_abc123xyz",
  "amount": 2500,
  "email": "customer@example.com",
  "firstName": "Jan",
  "lastName": "Novák",
  "phone": "+420123456789"
}
```

**Response**:
```json
{
  "success": true,
  "orderId": "ord_abc123xyz",
  "paymentUrl": "https://gw.sandbox.gopay.cz/..."
}
```

### POST /api/gopay/notify (Webhook)
Called by GoPay after payment is completed

**Automatic flow**:
1. GoPay sends payment confirmation
2. Order status updated to 'paid'
3. Stock deducted based on sale mode
4. Stock movements recorded

## Price Calculations

The system recalculates all prices from the database at checkout time:

- **BULK_G items**: Price per gram × grams ordered
- **PIECE_BY_WEIGHT items**: Fixed piece price
- **Assembly fees**: Based on configuration (FLAT or PER_GRAM)
- **Shipping**: Free if subtotal ≥ 3000 CZK, otherwise 150 CZK

This prevents price discrepancies from stale cart data.

## Security Notes

1. **Client Secret** is never exposed to frontend (stays on backend only)
2. **Signature verification** should be added to webhook (optional but recommended)
3. **Idempotent webhook handling** prevents double-charging if webhook is called multiple times
4. **Stock deduction on payment** (not on cart add) prevents overselling

## Testing Checklist

- [ ] GoPay credentials obtained from dashboard
- [ ] Environment variables added to `.env.local`
- [ ] Sandbox mode working with test cards
- [ ] Order creation working (`/api/orders`)
- [ ] Payment session creation working (`/api/gopay/create-payment`)
- [ ] Webhook being called after payment (check logs)
- [ ] Stock deducted after successful payment
- [ ] Order status changed to 'paid'
- [ ] Confirmation page shows after redirect
- [ ] Production credentials added to Vercel
- [ ] Production webhook URL configured in GoPay
- [ ] Real payment tested (if ready)

## Support Resources

- **GoPay API Docs**: https://help.gopay.cz/hc/en-us/
- **Payment Status Codes**: https://help.gopay.cz/hc/en-us/articles/...
- **Webhook Documentation**: https://help.gopay.cz/hc/en-us/articles/...

---

**Last Updated**: November 16, 2024
**Status**: Implementation complete, waiting for GoPay credentials
