# 📊 STATE MANAGEMENT - ANALYST REPORT

**Feature:** State Management (React Query Caching)
**Priority:** LOW
**Date:** 2025-12-04
**Analyst:** AI Orchestration System

---

## 🔍 SOUČASNÝ STAV

### Fetch Calls Inventory (11 total):

**GET Requests (čtení dat):**
1. `GET /api/admin/orders` - Orders list with filters/pagination/sorting
   - File: `app/admin/objednavky/page.tsx:82`
   - Trigger: useEffect na mount + filter/page/sort změny
   - Cache: ❌ None

2. `GET /api/admin/orders/{id}` - Single order detail
   - File: `app/admin/objednavky/[id]/page.tsx:80`
   - Trigger: useEffect na mount + po každé mutaci
   - Cache: ❌ None

3. `GET /api/orders/{id}` - Order detail (edit page)
   - File: `app/admin/objednavky/[id]/edit/page.tsx:38`
   - Trigger: useEffect na mount
   - Cache: ❌ None

**PUT/POST Requests (mutace):**
4. `PUT /api/admin/orders/{id}` - Update order status (Mark Paid)
   - File: `app/admin/objednavky/[id]/components/OrderHeader.tsx:178`
   - Re-fetch: ✅ Manual (`onStatusChange()` callback)

5. `PUT /api/admin/orders/{id}` - Update order status (Mark Shipped)
   - File: `app/admin/objednavky/[id]/components/OrderHeader.tsx:207`
   - Re-fetch: ✅ Manual (`onStatusChange()` callback)

6. `POST /api/admin/orders/{id}/shipments` - Create shipment
   - File: `app/admin/objednavky/[id]/components/CreateShipmentModal.tsx:164`
   - Re-fetch: ✅ Manual (`onSuccess()` callback)

7. `POST /api/admin/orders/{id}/capture-payment` - Capture payment
   - File: `app/admin/objednavky/[id]/components/CapturePaymentModal.tsx:79`
   - Re-fetch: ✅ Manual (`onSuccess()` callback)

8. `PUT /api/admin/orders/{id}` - Update metadata (tags, notes, risk score)
   - File: `app/admin/objednavky/[id]/components/EditOrderMetadataModal.tsx:139`
   - Re-fetch: ✅ Manual (`onUpdate()` callback)

9. `PUT /api/orders/{id}` - Update order (edit page)
   - File: `app/admin/objednavky/[id]/edit/page.tsx:76`
   - Re-fetch: ❌ None (just navigates back)

10. `POST /api/admin/orders/bulk` - Bulk actions (mark shipped/paid)
    - File: `app/admin/objednavky/page.tsx:256`
    - Re-fetch: ✅ Manual (`fetchOrders()` called)

11. Manual re-fetch after bulk action
    - File: `app/admin/objednavky/page.tsx:265`
    - Trigger: After bulk action success

---

## ❌ PROBLÉMY SOUČASNÉHO ŘEŠENÍ

### 1. Žádné Caching
**Problém:**
- Každý GET request fetchuje data ze serveru znovu
- Návrat z detail page na list → celý list se fetchuje znovu
- Refresh detail page → znovu fetchování, i když data jsou stejná

**Impact:**
- ⚠️ Zbytečná zátěž API serveru
- ⚠️ Pomalé UX (waiting spinners)
- ⚠️ Vyšší bandwidth consumption

**Example:**
```typescript
// Current: Každý mount fetchuje znovu
useEffect(() => {
  fetchOrder(); // Always hits server
}, [orderId]);
```

---

### 2. Ruční Re-fetching Po Mutacích
**Problém:**
- Po každé mutaci musíme manuálně volat `fetchOrder()` nebo `fetchOrders()`
- Není automatická invalidace cache (protože není cache)
- Musíme předávat callbacks (`onStatusChange`, `onUpdate`, `onSuccess`)

**Impact:**
- ⚠️ Boilerplate code (callback chains)
- ⚠️ Easy to forget re-fetch → stale data
- ⚠️ Tight coupling (child components must know about parent's fetch function)

**Example:**
```typescript
// Current: Manual callback chain
<OrderHeader order={order} onStatusChange={fetchOrder} />
<MetadataSection order={order} onUpdate={fetchOrder} />

// Inside modal:
onSuccess={() => {
  props.onUpdate(); // Must manually call parent's fetch
}}
```

---

### 3. Žádné Optimistic Updates
**Problém:**
- UI čeká na server response před zobrazením změn
- User vidí loading spinner i pro jednoduché updates

**Impact:**
- ⚠️ Pomalé UX feeling
- ⚠️ No immediate feedback

**Example:**
```typescript
// Current: Must wait for server
const handleMarkPaid = async () => {
  setLoading(true); // User sees spinner
  await fetch('/api/admin/orders/123', { method: 'PUT', ... });
  // Only now UI updates
  await fetchOrder(); // Another server round-trip
  setLoading(false);
};
```

---

### 4. Žádná Retry Logika
**Problém:**
- Pokud request failne (network timeout, 500 error), user musí manuálně refresh
- Není automatický retry

**Impact:**
- ⚠️ Poor error resilience
- ⚠️ Frustrating UX on temporary network issues

---

### 5. Duplicitní Loading States
**Problém:**
- Každý component má vlastní `useState(loading)`
- Stejná data můžou být "loading" na více místech současně

**Impact:**
- ⚠️ Code duplication
- ⚠️ Inconsistent loading states

**Example:**
```typescript
// Duplicated in every component:
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [data, setData] = useState(null);
```

---

### 6. Žádná Deduplication
**Problém:**
- Pokud 2 komponenty mountují současně a obě fetchují stejná data, oba requesty jdou na server
- Např. orders list + stats card obě potřebují order data

**Impact:**
- ⚠️ Duplicate API calls
- ⚠️ Race conditions možné

---

## ✅ ŘEŠENÍ: React Query (@tanstack/react-query)

### Proč React Query?

**1. Industry Standard:**
- 40M+ npm downloads/month
- Used by Vercel, Netflix, Microsoft
- Excellent TypeScript support

**2. Features:**
- ✅ Automatic caching with configurable TTL
- ✅ Auto re-fetching (on focus, reconnect, interval)
- ✅ Optimistic updates with rollback
- ✅ Automatic retry (3 attempts default)
- ✅ Request deduplication
- ✅ Query invalidation patterns
- ✅ Loading/error states built-in
- ✅ DevTools for debugging

**3. Bundle Size:**
- ~14KB gzipped (acceptable for LOW priority feature)

---

## 📋 IMPLEMENTATION PLAN

### Phase 1: Setup (10 minut)

**1.1. Install React Query:**
```bash
npm install @tanstack/react-query
```

**1.2. Create QueryClient:**
```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});
```

**1.3. Add QueryClientProvider:**
```typescript
// app/admin/layout.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

export default function AdminLayout({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

### Phase 2: Query Hooks (40 minut)

**2.1. Create `lib/queries/orders.ts`:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { Order, OrdersResponse } from '@/app/admin/objednavky/types';

// Query keys factory
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: any) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Hook: Fetch orders list
export function useOrders(params: {
  limit: number;
  offset: number;
  orderStatus?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  channel?: string;
  email?: string;
  sort?: string;
}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async () => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) query.append(key, String(value));
      });

      const response = await fetch(`/api/admin/orders?${query}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json() as Promise<OrdersResponse>;
    },
  });
}

// Hook: Fetch single order
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json() as Promise<Order>;
    },
    enabled: !!orderId, // Only run if orderId exists
  });
}
```

---

### Phase 3: Mutation Hooks (60 minut)

**3.1. Add mutations to `lib/queries/orders.ts`:**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Mutation: Update order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      updates
    }: {
      orderId: string;
      updates: Partial<Order>
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update order');
      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate order detail
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId)
      });
      // Invalidate orders list
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      });
    },
  });
}

// Mutation: Capture payment
export function useCapturePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      amount
    }: {
      orderId: string;
      amount: number
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}/capture-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error('Failed to capture payment');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId)
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      });
    },
  });
}

// Mutation: Create shipment
export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      shipment
    }: {
      orderId: string;
      shipment: any
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shipment),
      });
      if (!response.ok) throw new Error('Failed to create shipment');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId)
      });
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      });
    },
  });
}

// Mutation: Update metadata
export function useUpdateMetadata() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      metadata
    }: {
      orderId: string;
      metadata: Partial<Order>
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      });
      if (!response.ok) throw new Error('Failed to update metadata');
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId)
      });
    },
  });
}

// Mutation: Bulk actions
export function useBulkAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      orderIds
    }: {
      action: string;
      orderIds: string[]
    }) => {
      const response = await fetch('/api/admin/orders/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, orderIds }),
      });
      if (!response.ok) throw new Error('Bulk action failed');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all orders lists
      queryClient.invalidateQueries({
        queryKey: orderKeys.lists()
      });
    },
  });
}
```

---

### Phase 4: Refactor Pages (30 minut)

**4.1. Refactor Orders List Page:**

```typescript
// app/admin/objednavky/page.tsx
// BEFORE: 60 lines of useState + useEffect + fetchOrders
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const fetchOrders = useCallback(async () => { /* ... */ }, []);
useEffect(() => { fetchOrders(); }, []);

// AFTER: 5 lines
const { data, isLoading, error } = useOrders({
  limit: itemsPerPage,
  offset: (currentPage - 1) * itemsPerPage,
  ...filters,
  sort: sortField ? `${sortDirection === 'desc' ? '-' : ''}${sortField}` : undefined,
});
const orders = data?.orders ?? [];
const totalItems = data?.total ?? 0;
```

**4.2. Refactor Order Detail Page:**

```typescript
// app/admin/objednavky/[id]/page.tsx
// BEFORE: 40 lines
const [order, setOrder] = useState(null);
const [loading, setLoading] = useState(true);
const fetchOrder = async () => { /* ... */ };
useEffect(() => { fetchOrder(); }, [orderId]);

// AFTER: 3 lines
const { data: order, isLoading, error } = useOrder(orderId);
```

**4.3. Update Components to Use Mutations:**

```typescript
// OrderHeader.tsx
const updateStatus = useUpdateOrderStatus();

const handleMarkPaid = () => {
  updateStatus.mutate({
    orderId: order.id,
    updates: { paymentStatus: 'paid' },
  });
};
```

---

### Phase 5: Optimistic Updates (OPTIONAL, +20 minut)

**Example for status changes:**

```typescript
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: /* ... */,
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: orderKeys.detail(variables.orderId)
      });

      // Snapshot previous value
      const previousOrder = queryClient.getQueryData(
        orderKeys.detail(variables.orderId)
      );

      // Optimistically update UI
      queryClient.setQueryData(
        orderKeys.detail(variables.orderId),
        (old: Order) => ({ ...old, ...variables.updates })
      );

      // Return context with snapshot
      return { previousOrder };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousOrder) {
        queryClient.setQueryData(
          orderKeys.detail(variables.orderId),
          context.previousOrder
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId)
      });
    },
  });
}
```

---

## 📊 BENEFITS SUMMARY

| Feature | Before | After | Improvement |
|---------|--------|-------|-------------|
| **Caching** | ❌ None | ✅ 30s stale time | 🚀 Reduced API calls |
| **Auto re-fetch** | ❌ Manual | ✅ On focus/reconnect | 🚀 Always fresh data |
| **Optimistic UI** | ❌ None | ✅ Instant feedback | 🚀 Faster UX feeling |
| **Retry logic** | ❌ None | ✅ 3 auto retries | 🚀 Better resilience |
| **Loading states** | ⚠️ Duplicated | ✅ Centralized | 🚀 Less boilerplate |
| **Invalidation** | ⚠️ Manual callbacks | ✅ Automatic | 🚀 Simpler code |
| **Deduplication** | ❌ None | ✅ Built-in | 🚀 Fewer requests |
| **DevTools** | ❌ None | ✅ React Query DevTools | 🚀 Easier debugging |

---

## 📈 CODE REDUCTION ESTIMATE

**Orders List Page:**
- Before: ~115 lines of state management
- After: ~30 lines
- **Reduction: -85 lines (-74%)**

**Order Detail Page:**
- Before: ~95 lines of state management
- After: ~20 lines
- **Reduction: -75 lines (-79%)**

**Components (5 modals):**
- Before: ~50 lines each for fetch + callbacks
- After: ~10 lines each (just mutation hooks)
- **Reduction: -40 lines per component × 5 = -200 lines**

**Total Code Reduction: ~360 lines (-60%)**

---

## ⏱️ TIME ESTIMATE

| Phase | Task | Time |
|-------|------|------|
| 1 | Install + QueryClient setup | 10 min |
| 2 | Query hooks (useOrders, useOrder) | 40 min |
| 3 | Mutation hooks (5 hooks) | 60 min |
| 4 | Refactor pages (2 pages + 5 components) | 30 min |
| 5 | Testing (manual + automated) | 30 min |
| **TOTAL** | | **170 min (~3h)** |

---

## 🎯 SUCCESS CRITERIA

1. ✅ All fetch calls replaced with React Query hooks
2. ✅ Automatic cache invalidation after mutations
3. ✅ No manual `fetchOrders()` or `fetchOrder()` calls
4. ✅ Loading/error states from `isLoading`/`error` instead of useState
5. ✅ 3x auto retry on failed requests
6. ✅ Zero TypeScript errors
7. ✅ All existing features still work (no regressions)
8. ✅ (Optional) Optimistic updates for status changes

---

## 🚨 RISKS & MITIGATION

**Risk 1: Breaking existing functionality**
- Mitigation: Comprehensive testing after each component refactor
- Mitigation: Keep old code in comments for rollback

**Risk 2: Cache staleness issues**
- Mitigation: Conservative 30s stale time
- Mitigation: Manual invalidation after mutations
- Mitigation: refetchOnWindowFocus enabled

**Risk 3: Bundle size increase**
- Mitigation: React Query is only ~14KB gzipped
- Mitigation: This is LOW priority feature, acceptable tradeoff

**Risk 4: Learning curve for future developers**
- Mitigation: React Query is industry standard
- Mitigation: Excellent documentation
- Mitigation: Will add code comments

---

## 📝 ANALYST RECOMMENDATION

**✅ PROCEED WITH IMPLEMENTATION**

**Confidence Level: 90%**

**Reasoning:**
1. React Query solves all 6 identified problems
2. Reduces code by ~360 lines (-60%)
3. Industry-proven solution (40M+ downloads/month)
4. Improves UX (caching, optimistic updates, auto-retry)
5. Time estimate is reasonable (3h)
6. LOW priority → acceptable risk for nice-to-have feature

**Priority Order:**
1. HIGH: Setup + Query hooks (mandatory for caching)
2. HIGH: Basic mutation hooks (mandatory for invalidation)
3. MEDIUM: Refactor all pages/components
4. LOW: Optimistic updates (optional, nice-to-have)
5. LOW: React Query DevTools (optional, debugging)

---

**Report Generated:** 2025-12-04
**Analyst:** AI Orchestration System
**Next Step:** Proceed to DEVELOPER phase
