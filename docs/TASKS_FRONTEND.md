# Frontend Tasks - Orders Admin Panel

**Owners:** You + Frontend Guy
**Branch:** `feature/orders-ui`
**Timeline:** 3-4 days
**Dependencies:** Phase 1 (backend API) must be deployed first

---

## Task 1: Orders List Page (Foundation)
**File:** `/app/admin/objednavky/page.tsx` (refactor existing)
**Time:** 2-3 hours

### Features:
- ✅ Table with all orders
- ✅ Columns: ID | Email | Items | Total | Status | Date | Actions
- ✅ Current stats summary (keep existing)
- ⚠️ DO NOT add filters yet (Task 2)

### Implementation:

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  email: string;
  firstName: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  itemCount: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders?limit=100');
      const data = await res.json();
      setOrders(data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      completed: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      draft: 'Návrh',
      pending: 'Čekající',
      paid: 'Zaplaceno',
      processing: 'Zpracování',
      shipped: 'Odesláno',
      completed: 'Dokončeno',
      cancelled: 'Zrušeno',
    };
    return labels[status] || status;
  };

  if (loading) return <div className="p-6">Načítání...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Správa Objednávek</h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Položky
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Cena
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-mono">{order.id.substring(0, 8)}...</td>
                <td className="px-6 py-4 text-sm">{order.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{order.itemCount}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {(order.total / 100).toLocaleString('cs-CZ')} Kč
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    {getStatusLabel(order.orderStatus)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString('cs-CZ')}
                </td>
                <td className="px-6 py-4 text-sm space-x-2 flex">
                  <Link
                    href={`/admin/objednavky/${order.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Detaily
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## Task 2: Filters Component
**File:** `/app/admin/objednavky/components/Filters.tsx` (new)
**Time:** 1.5-2 hours

### Features:
```
[Stav objednávky ▼] [Stav platby ▼] [Kanál ▼] [Datum od-do]
[Hledat email] [Resetovat] [Uložit pohled]
```

### Implementation:
```typescript
'use client';

import { useState } from 'react';

interface FiltersProps {
  onFilter: (filters: FilterState) => void;
}

export interface FilterState {
  orderStatus?: string;
  paymentStatus?: string;
  channel?: string;
  dateFrom?: string;
  dateTo?: string;
  email?: string;
}

export function Filters({ onFilter }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const resetFilters = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Order Status */}
        <select
          value={filters.orderStatus || ''}
          onChange={(e) => handleChange('orderStatus', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Stav objednávky</option>
          <option value="draft">Návrh</option>
          <option value="pending">Čekající</option>
          <option value="paid">Zaplaceno</option>
          <option value="processing">Zpracování</option>
          <option value="shipped">Odesláno</option>
        </select>

        {/* Payment Status */}
        <select
          value={filters.paymentStatus || ''}
          onChange={(e) => handleChange('paymentStatus', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Stav platby</option>
          <option value="unpaid">Nezaplaceno</option>
          <option value="partial">Částečně</option>
          <option value="paid">Zaplaceno</option>
          <option value="refunded">Vráceno</option>
        </select>

        {/* Channel */}
        <select
          value={filters.channel || ''}
          onChange={(e) => handleChange('channel', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">Kanál</option>
          <option value="web">Web</option>
          <option value="pos">POS</option>
          <option value="ig_dm">Instagram DM</option>
        </select>

        {/* Email Search */}
        <input
          type="email"
          placeholder="Hledat email"
          value={filters.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        />

        {/* Reset Button */}
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Resetovat
        </button>
      </div>
    </div>
  );
}
```

Update `page.tsx` to use filters:
```typescript
const [filters, setFilters] = useState<FilterState>({});

const fetchOrders = async () => {
  try {
    const params = new URLSearchParams();
    if (filters.orderStatus) params.append('orderStatus', filters.orderStatus);
    if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters.channel) params.append('channel', filters.channel);

    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.data);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

// In JSX:
<Filters onFilter={(f) => { setFilters(f); fetchOrders(); }} />
```

---

## Task 3: Order Detail Page (Refactor)
**Files:**
- `/app/admin/objednavky/[id]/page.tsx` (refactor existing)
- `/app/admin/objednavky/[id]/components/OrderHeader.tsx` (new)
- `/app/admin/objednavky/[id]/components/CustomerSection.tsx` (new)
- `/app/admin/objednavky/[id]/components/ItemsSection.tsx` (new)
- `/app/admin/objednavky/[id]/components/PaymentSection.tsx` (new)

**Time:** 3-4 hours

### Structure (Tabs):
```
┌─────────────────────────────────────────────┐
│ #OBJ-12345    💰 ZAPLACENO  📦 ODESLÁNO     │ (Header)
├─────────────────────────────────────────────┤
│ 👤 ZÁKAZNÍK  |  📦 POLOŽKY  |  💳 PLATBA   │ (Tabs)
├─────────────────────────────────────────────┤
│ Content of active tab                       │
└─────────────────────────────────────────────┘
```

### `page.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import OrderHeader from './components/OrderHeader';
import CustomerSection from './components/CustomerSection';
import ItemsSection from './components/ItemsSection';
import PaymentSection from './components/PaymentSection';

interface Order {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  country: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  orderStatus: string;
  paymentStatus: string;
  deliveryStatus: string;
  paymentMethod: string;
  deliveryMethod: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [tab, setTab] = useState<'customer' | 'items' | 'payment'>('customer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`);
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Načítání...</div>;
  if (!order) return <div className="p-6">Objednávka nenalezena</div>;

  return (
    <div className="p-6">
      <OrderHeader order={order} onStatusChange={fetchOrder} />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mt-6">
        <div className="border-b border-gray-200 flex">
          {(['customer', 'items', 'payment'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                tab === t
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t === 'customer' && '👤 Zákazník'}
              {t === 'items' && '📦 Položky'}
              {t === 'payment' && '💳 Platba'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'customer' && <CustomerSection order={order} />}
          {tab === 'items' && <ItemsSection order={order} />}
          {tab === 'payment' && <PaymentSection order={order} />}
        </div>
      </div>
    </div>
  );
}
```

### `components/OrderHeader.tsx`:
```typescript
import { useState } from 'react';

interface OrderHeaderProps {
  order: any;
  onStatusChange: () => void;
}

export default function OrderHeader({ order, onStatusChange }: OrderHeaderProps) {
  const [updating, setUpdating] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      onStatusChange();
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">#{order.id.substring(0, 8)}</h1>
          <p className="text-gray-600 text-sm">
            {new Date(order.createdAt).toLocaleDateString('cs-CZ')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">
            {(order.total / 100).toLocaleString('cs-CZ')} Kč
          </p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-3 mb-4">
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          {order.orderStatus}
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          {order.paymentStatus}
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          {order.deliveryStatus}
        </span>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => updateStatus('paid')}
          disabled={updating}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Označit zaplaceno
        </button>
        <button
          onClick={() => updateStatus('shipped')}
          disabled={updating}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Označit odesláno
        </button>
      </div>
    </div>
  );
}
```

### `components/ItemsSection.tsx`:
```typescript
export default function ItemsSection({ order }: { order: any }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">Produkt</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Gramáž</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Cena/g</th>
            <th className="px-4 py-3 text-right text-sm font-medium">Celkem</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item: any) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm">{item.nameSnapshot}</td>
              <td className="px-4 py-3 text-sm text-right">{item.grams}g</td>
              <td className="px-4 py-3 text-sm text-right">{item.price.toLocaleString('cs-CZ')} Kč</td>
              <td className="px-4 py-3 text-sm text-right font-medium">
                {(item.lineTotal / 100).toLocaleString('cs-CZ')} Kč
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### `components/CustomerSection.tsx`:
```typescript
export default function CustomerSection({ order }: { order: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Osobní údaje</h3>
        <dl className="space-y-2">
          <div>
            <dt className="text-gray-600 text-sm">Jméno</dt>
            <dd className="text-gray-900">{order.firstName} {order.lastName}</dd>
          </div>
          <div>
            <dt className="text-gray-600 text-sm">Email</dt>
            <dd className="text-gray-900">{order.email}</dd>
          </div>
          <div>
            <dt className="text-gray-600 text-sm">Telefon</dt>
            <dd className="text-gray-900">{order.phone || '–'}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Doručovací adresa</h3>
        <dl className="space-y-2">
          <div className="text-gray-900">
            {order.streetAddress}<br />
            {order.zipCode} {order.city}<br />
            {order.country}
          </div>
        </dl>
      </div>
    </div>
  );
}
```

### `components/PaymentSection.tsx`:
```typescript
export default function PaymentSection({ order }: { order: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Přehled platby</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt>Mezisoučet</dt>
            <dd>{(order.subtotal / 100).toLocaleString('cs-CZ')} Kč</dd>
          </div>
          <div className="flex justify-between">
            <dt>Doprava</dt>
            <dd>{(order.shippingCost / 100).toLocaleString('cs-CZ')} Kč</dd>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <dt>Celkem</dt>
            <dd>{(order.total / 100).toLocaleString('cs-CZ')} Kč</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Metody</h3>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt>Platba</dt>
            <dd className="capitalize">{order.paymentMethod || '–'}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Doprava</dt>
            <dd className="capitalize">{order.deliveryMethod || '–'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
```

---

## Task 4: Bulk Actions Toolbar
**File:** `/app/admin/objednavky/components/BulkActions.tsx` (new)
**Time:** 1-2 hours

### Features:
```
☐ ☐ ☐  [Mark Shipped ▼] [Export] [More Actions ▼]
```

---

## Testing Checklist

```
☐ List page loads
☐ Table shows all orders
☐ Filters work (status, payment, channel)
☐ Order detail page loads
☐ Tabs switch correctly
☐ Items show correct prices
☐ Can update order status
☐ Status badges update after change
☐ Responsive on mobile
☐ No console errors
```

---

## File Structure (When Done)

```
/app/admin/objednavky/
├── page.tsx (LIST - with filters)
├── [id]/
│   ├── page.tsx (DETAIL - with tabs)
│   └── components/
│       ├── OrderHeader.tsx
│       ├── CustomerSection.tsx
│       ├── ItemsSection.tsx
│       ├── PaymentSection.tsx
│       └── NotesSection.tsx (future)
└── components/
    ├── Filters.tsx
    ├── BulkActions.tsx (future)
    └── StatusBadge.tsx (future)
```

---

## Estimated Time

- Task 1 (List): 2-3h
- Task 2 (Filters): 1.5-2h
- Task 3 (Detail): 3-4h
- Task 4 (Bulk): 1-2h

**Total:** 7-11 hours (split between 2 people)

---

## Next Steps

1. Backend guy finishes Phase 0 + Phase 1 → PR
2. You review backend API
3. Merge to main
4. Start frontend tasks in parallel
5. Final merge when both done

**Ready to start?** 🚀
