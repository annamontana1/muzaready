import { z } from 'zod';

/**
 * Validation schemas for order-related API endpoints
 */

// Customer category enum
export const CustomerCategorySchema = z.enum(['STANDARD', 'LUXE', 'PLATINUM_EDITION']);

// Sale mode enum
export const SaleModeSchema = z.enum(['PIECE_BY_WEIGHT', 'BULK_G']);

// Ending type enum
export const EndingSchema = z.enum(['NONE', 'KERATIN']);

// Assembly fee type enum
export const AssemblyFeeTypeSchema = z.enum(['FLAT', 'PER_GRAM']);

// Cart item schema
export const CartItemSchema = z.object({
  skuId: z.string().min(1, 'SKU ID is required'),
  skuName: z.string().min(1, 'Product name is required'),
  customerCategory: CustomerCategorySchema,
  shade: z.string(),
  saleMode: SaleModeSchema,
  grams: z.number().positive('Grams must be positive'),
  pricePerGram: z.number().nonnegative('Price per gram cannot be negative'),
  lineTotal: z.number().nonnegative('Line total cannot be negative'),
  ending: EndingSchema,
  assemblyFeeType: AssemblyFeeTypeSchema,
  assemblyFeeCzk: z.number().nonnegative('Assembly fee cannot be negative'),
  assemblyFeeTotal: z.number().nonnegative('Assembly fee total cannot be negative'),
  lineGrandTotal: z.number().nonnegative('Line grand total cannot be negative'),
  quantity: z.number().int().positive('Quantity must be a positive integer').optional(),
});

// Shipping info schema
export const ShippingInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  phone: z.string().regex(/^\+?[0-9\s\-()]+$/, 'Invalid phone number format').optional(),
  streetAddress: z.string().max(200).optional(), // Optional for Zásilkovna
  city: z.string().max(100).optional(), // Optional for Zásilkovna
  zipCode: z.string().regex(/^[0-9\s]{5,10}$/, 'Invalid ZIP code format').optional(), // Optional for Zásilkovna
  country: z.string().length(2, 'Country code must be 2 characters (e.g., CZ)'),
  deliveryMethod: z.enum(['standard', 'zasilkovna', 'express', 'pickup', 'dpd', 'ppl', 'showroom']).optional(),
});

// Packeta pickup point schema
export const PacketaPointSchema = z.object({
  id: z.string().min(1, 'Pickup point ID is required'),
  name: z.string().min(1, 'Pickup point name is required'),
  street: z.string(),
  city: z.string(),
  zip: z.string(),
  country: z.string(),
});

// Cart line schema (simplified input — prices are recalculated server-side via quoteCartLines)
export const CartLineSchema = z.object({
  skuId: z.string().min(1, 'SKU ID is required'),
  wantedGrams: z.number().positive('Grams must be positive').optional(),
  ending: z.string().optional(),
});

// Create order request schema
export const CreateOrderSchema = z.object({
  email: z.string().email('Invalid email address'),
  cartLines: z.array(CartLineSchema).min(1, 'At least one item is required'),
  shippingInfo: ShippingInfoSchema,
  packetaPoint: PacketaPointSchema.optional(), // Optional Zásilkovna pickup point
  couponCode: z.string().optional(), // Optional coupon code
});

// Update order status schema
export const UpdateOrderStatusSchema = z.object({
  orderStatus: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  paymentStatus: z.enum(['unpaid', 'paid', 'refunded', 'failed']).optional(),
  deliveryStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'failed']).optional(),
}).refine(
  (data) => data.orderStatus || data.paymentStatus || data.deliveryStatus,
  'At least one status field must be provided'
);

// GoPay payment status response schema (from GET /api/payments/payment/{id})
export const GoPayPaymentStatusSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  state: z.enum(['CREATED', 'PAYMENT_METHOD_CHOSEN', 'PAID', 'AUTHORIZED', 'CANCELED', 'TIMEOUTED', 'REFUNDED', 'PARTIALLY_REFUNDED']),
  amount: z.number(),
  currency: z.string(),
});
