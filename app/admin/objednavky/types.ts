/**
 * Order Admin - Type Definitions
 * Comprehensive TypeScript types for Order management interface
 */

export enum OrderStatus {
  AWAITING_PAYMENT = 'awaiting_payment',
  PAID = 'paid',
  PROCESSING = 'processing',
  ASSEMBLY_IN_PROGRESS = 'assembly_in_progress',
  SHIPPED = 'shipped',
  CANCELLED_UNPAID = 'cancelled_unpaid',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum DeliveryMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PICKUP = 'pickup',
}

export enum PaymentMethod {
  GOPAY = 'gopay',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

export enum SaleMode {
  PIECE_BY_WEIGHT = 'PIECE_BY_WEIGHT',
  BULK_G = 'BULK_G',
}

export enum EndingOption {
  KERATIN = 'KERATIN',
  PASKY = 'PASKY',
  TRESSY = 'TRESSY',
  NONE = 'NONE',
}

/**
 * Order Item - Product in an order
 */
export interface OrderItem {
  id: string;
  orderId: string;
  skuId: string;
  quantity?: number;
  grams: number;
  pricePerGram: number;
  lineTotal: number;
  saleMode: SaleMode;
  ending: EndingOption;
  nameSnapshot?: string | null;
  assemblyFeeCzk?: number | null;
  assemblyFeeTotal?: number | null;
  assemblyFeeType?: string | null;
  createdAt: Date | string;
}

/**
 * Order - Complete order object
 */
export interface Order {
  // Identifiers
  id: string;

  // Customer Information
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;

  // Delivery Address
  streetAddress: string;
  city: string;
  zipCode: string;
  country: string;

  // Delivery & Payment
  deliveryMethod: string;
  paymentMethod?: string | null;

  // Status Fields
  status: string; // OrderStatus enum value
  paymentStatus: string; // PaymentStatus enum value

  // Financial Details
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;

  // Tracking
  trackingNumber?: string | null;

  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
  paidAt?: Date | string | null;
  shippedAt?: Date | string | null;

  // Relations
  items: OrderItem[];
}

/**
 * Order Filter Params
 */
export interface OrderFilters {
  status?: string;
  paymentStatus?: string;
  deliveryMethod?: string;
  searchTerm?: string; // Search by email, name, or order ID
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Order Sort Options
 */
export type OrderSortBy = 'createdAt' | 'total' | 'status' | 'paymentStatus';
export type OrderSortOrder = 'asc' | 'desc';

/**
 * Pagination Info
 */
export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Orders List Response
 */
export interface OrdersListResponse {
  orders: Order[];
  pagination: PaginationInfo;
}

/**
 * Bulk Action Payload
 */
export interface BulkActionPayload {
  orderIds: string[];
  action: 'updateStatus' | 'updatePaymentStatus' | 'delete';
  value?: string; // New status value for update actions
}

/**
 * Status Update Payload
 */
export interface StatusUpdatePayload {
  status?: string;
  paymentStatus?: string;
  deliveryMethod?: string;
  paymentMethod?: string;
  trackingNumber?: string;
}

/**
 * Payment Capture Payload
 */
export interface PaymentCapturePayload {
  orderId: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

/**
 * Shipment Payload
 */
export interface ShipmentPayload {
  orderId: string;
  trackingNumber: string;
  deliveryMethod: string;
  estimatedDeliveryDate?: string;
}

/**
 * Order Statistics
 */
export interface OrderStatistics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  statusBreakdown: Record<string, number>;
  paymentStatusBreakdown: Record<string, number>;
  deliveryMethodBreakdown: Record<string, number>;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginationInfo;
}
