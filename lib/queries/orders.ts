import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Order, OrdersResponse } from '@/app/admin/objednavky/types';

/**
 * Query Keys Factory
 *
 * Hierarchical structure for cache invalidation:
 * - ['orders'] - all order-related queries
 * - ['orders', 'list'] - all list queries
 * - ['orders', 'list', { filters }] - specific list with filters
 * - ['orders', 'detail'] - all detail queries
 * - ['orders', 'detail', id] - specific order detail
 */
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params: OrderListParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/**
 * Parameters for orders list query
 */
export interface OrderListParams {
  limit: number;
  offset: number;
  orderStatus?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  channel?: string;
  email?: string;
  sort?: string;
}

/**
 * Hook: Fetch orders list with filters, pagination, and sorting
 *
 * Features:
 * - Automatic caching (30s stale time)
 * - Auto refetch on window focus
 * - 3 retry attempts on failure
 * - Deduplicated requests
 *
 * @example
 * const { data, isLoading, error } = useOrders({
 *   limit: 25,
 *   offset: 0,
 *   orderStatus: 'pending',
 *   sort: '-createdAt'
 * });
 */
export function useOrders(params: OrderListParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async (): Promise<OrdersResponse> => {
      const query = new URLSearchParams();

      // Add all non-undefined params to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, String(value));
        }
      });

      const response = await fetch(`/api/admin/orders?${query.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      return response.json();
    },
    // Keep previous data while fetching new data (no "flashing" empty states)
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook: Fetch single order detail
 *
 * Features:
 * - Automatic caching (30s stale time)
 * - Only runs if orderId is provided (enabled: !!orderId)
 * - Auto refetch on window focus
 * - 3 retry attempts on failure
 *
 * @example
 * const { data: order, isLoading, error } = useOrder(orderId);
 */
export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(orderId!),
    queryFn: async (): Promise<Order> => {
      const response = await fetch(`/api/admin/orders/${orderId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch order: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!orderId, // Only run query if orderId exists
  });
}

/**
 * Mutation: Update order status (Mark Paid, Mark Shipped, etc.)
 *
 * Features:
 * - Automatic cache invalidation after success
 * - Retry once on failure
 * - Invalidates both order detail and orders list
 *
 * @example
 * const updateStatus = useUpdateOrderStatus();
 *
 * updateStatus.mutate({
 *   orderId: '123',
 *   updates: { paymentStatus: 'paid' }
 * }, {
 *   onSuccess: () => showToast({ message: 'Order updated!' })
 * });
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      updates,
    }: {
      orderId: string;
      updates: Partial<Order>;
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update order: ${error}`);
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific order detail
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });

      // Invalidate all orders lists (to update stats, pagination, etc.)
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
    },
  });
}

/**
 * Mutation: Capture payment
 *
 * @example
 * const capturePayment = useCapturePayment();
 *
 * capturePayment.mutate({
 *   orderId: '123',
 *   amount: 1500
 * });
 */
export function useCapturePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      amount,
    }: {
      orderId: string;
      amount: number;
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}/capture-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to capture payment: ${error}`);
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
    },
  });
}

/**
 * Mutation: Create shipment
 *
 * @example
 * const createShipment = useCreateShipment();
 *
 * createShipment.mutate({
 *   orderId: '123',
 *   shipment: {
 *     carrier: 'DPD',
 *     trackingNumber: 'ABC123',
 *     items: ['item1', 'item2']
 *   }
 * });
 */
export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      shipment,
    }: {
      orderId: string;
      shipment: {
        carrier: string;
        trackingNumber: string;
        items: string[];
        notes?: string;
      };
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipment),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create shipment: ${error}`);
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });
    },
  });
}

/**
 * Mutation: Update metadata (tags, notes, risk score)
 *
 * @example
 * const updateMetadata = useUpdateMetadata();
 *
 * updateMetadata.mutate({
 *   orderId: '123',
 *   metadata: {
 *     tags: 'vip,urgent',
 *     notesInternal: 'Customer called...',
 *     riskScore: 85
 *   }
 * });
 */
export function useUpdateMetadata() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      metadata,
    }: {
      orderId: string;
      metadata: Record<string, any>; // Allow any metadata fields
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update metadata: ${error}`);
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
      // Note: Metadata changes don't affect list view, so we don't invalidate lists
    },
  });
}

/**
 * Mutation: Bulk actions (mark shipped, mark paid, etc.)
 *
 * @example
 * const bulkAction = useBulkAction();
 *
 * bulkAction.mutate({
 *   action: 'mark-shipped',
 *   orderIds: ['123', '456', '789']
 * });
 */
export function useBulkAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      orderIds,
    }: {
      action: string;
      orderIds: string[];
    }) => {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, orderIds }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Bulk action failed: ${error}`);
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate all orders lists (affected orders could be anywhere)
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists(),
      });

      // Invalidate all order details (we don't know which specific orders were affected)
      queryClient.invalidateQueries({
        queryKey: orderKeys.details(),
      });
    },
  });
}
