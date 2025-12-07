// Shared type definitions for Orders module

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  sku?: {
    id: string;
    sku: string;
    name: string;
    shadeName: string;
    lengthCm: number;
  };
}

export interface Order {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  total: number;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  channel: string;
  tags: string[];
  riskScore: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  lastStatusChangeAt: string | null;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
