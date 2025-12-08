# Detailní Frontend Checklist - Co je OPRAVDU hotovo

## 1. ORDERS LIST PAGE - `/app/admin/objednavky/page.tsx`

### Co je hotovo ✅
- Tabulka se 7 sloupci (ID, Email, Items, Price, Status, Date, Actions)
- Načítání dat z Prisma
- Display stats (revenue, pending, paid, shipped)
- Navigační linky na detail a edit
- Tailwind styling

**Kód:**
```typescript
// EXISTUJE: Tabulka s daty
{orders.map((order) => (
  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
    <td className="px-6 py-4 text-sm text-gray-900 font-mono">{order.id.substring(0, 8)}...</td>
    <td className="px-6 py-4 text-sm text-gray-900">{order.email}</td>
    <td className="px-6 py-4 text-sm text-gray-600">{order.items.length}</td>
    {/* ... */}
  </tr>
))}
```

### Co CHYBÍ ❌
- Filtry komponenta
- Pagination (Next/Prev, page selector)
- Sorting (clickable headers)
- Checkboxes pro výběr
- Bulk actions toolbar

**Stav: 25% hotovo**

---

## 2. API: GET /api/admin/orders

### Co je hotovo ✅
```typescript
// EXISTUJE: Filtrování
const where: any = {};
if (orderStatus) where.orderStatus = orderStatus;
if (paymentStatus) where.paymentStatus = paymentStatus;
if (channel) where.channel = channel;
if (emailSearch) where.email = { contains: emailSearch, mode: 'insensitive' };

// EXISTUJE: Pagination
const orders = await prisma.order.findMany({
  where,
  take: limit,  // max 100
  skip: offset,
});

// EXISTUJE: Sorting
orderBy: { [validSortField]: isDescending ? 'desc' : 'asc' }
```

**Stav: 100% ✅ Hotovo**

---

## 3. API: PUT /api/admin/orders/[id]

### Co je hotovo ✅
```typescript
// EXISTUJE: Aktualizace všech polí
if (orderStatus) updateData.orderStatus = orderStatus;
if (paymentStatus) updateData.paymentStatus = paymentStatus;
if (deliveryStatus) updateData.deliveryStatus = deliveryStatus;
if (tags !== undefined) updateData.tags = JSON.stringify(tags);
if (notesInternal !== undefined) updateData.notesInternal = notesInternal;
if (notesCustomer !== undefined) updateData.notesCustomer = notesCustomer;
if (riskScore !== undefined) updateData.riskScore = riskScore;
```

**Stav: 100% ✅ Hotovo**

---

## 4. ORDER DETAIL PAGE - `/app/admin/objednavky/[id]/page.tsx`

### Co je hotovo ✅
- Načítá objednávku z API
- Zobrazuje základní info (email, Items table, total)
- Link na edit stránku
- Základní error handling

**Kód:**
```typescript
const fetchOrder = async () => {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}`);
    const data = await response.json();
    setOrder(data);
  } catch (err) {
    setError('Chyba při načítání');
  }
};

// Zobrazuje items tabulku:
{order.items.map((item) => (
  <tr key={item.id}>
    <td>{item.productId}</td>
    <td>{item.quantity}</td>
    <td>{(item.price * item.quantity).toLocaleString('cs-CZ')} Kč</td>
  </tr>
))}
```

### Co CHYBÍ ❌
- Tabs refactoring (Customer/Items/Payment sections)
- OrderHeader komponenta s akčními tlačítky
- Capture Payment button + modal
- Create Shipment button + modal
- Shipment history display
- Quick action buttons

**Stav: 40% hotovo**

---

## 5. ORDER EDIT PAGE - `/app/admin/objednavky/[id]/edit/page.tsx`

### Co je hotovo ✅
```typescript
// EXISTUJE: Status select
<select
  value={formData.status}
  onChange={handleStatusChange}
  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
>
  <option value="pending">Čeká na platbu</option>
  <option value="paid">Zaplaceno</option>
  <option value="shipped">Odesláno</option>
  <option value="delivered">Doručeno</option>
</select>

// EXISTUJE: Save handler
const handleSave = async (e) => {
  const response = await fetch(`/api/admin/orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
  });
  // ...
};
```

### Co CHYBÍ ❌
```typescript
// CHYBÍ: paymentStatus select
<select>
  <option value="unpaid">Nezaplaceno</option>
  <option value="partial">Částečně</option>
  <option value="paid">Zaplaceno</option>
  <option value="refunded">Vráceno</option>
</select>

// CHYBÍ: deliveryStatus select
// CHYBÍ: Tags input (multi-select?)
// CHYBÍ: notesInternal textarea
// CHYBÍ: notesCustomer textarea
// CHYBÍ: riskScore number input
```

**Stav: 20% hotovo (jen 1 z 7 polí)**

---

## 6. FILTERS COMPONENT - ❌ NEEXISTUJE

**Soubor:** `/components/admin/Filters.tsx` - NEEXISTUJE!

Mělo by obsahovat:
```typescript
// CHYBÍ: Celá komponenta
export function Filters({ onFilter }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <select onChange={(e) => handleChange('orderStatus', e.target.value)}>
        <option value="">Stav objednávky</option>
        <option value="pending">Čekající</option>
      </select>
      
      <select onChange={(e) => handleChange('paymentStatus', e.target.value)}>
        <option value="">Stav platby</option>
        <option value="unpaid">Nezaplaceno</option>
      </select>
      
      <select onChange={(e) => handleChange('channel', e.target.value)}>
        <option value="">Kanál</option>
        <option value="web">Web</option>
        <option value="pos">POS</option>
      </select>
      
      <input
        type="email"
        placeholder="Hledat email"
        onChange={(e) => handleChange('email', e.target.value)}
      />
      
      <button onClick={resetFilters}>Resetovat</button>
    </div>
  );
}
```

**Stav: 0% ❌**

---

## 7. PAGINATION COMPONENT - ❌ NEEXISTUJE

**Soubor:** `/components/ui/PaginationControls.tsx` - NEEXISTUJE!

Mělo by obsahovat:
```typescript
// CHYBÍ: Celá komponenta
interface PaginationProps {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PaginationControls({
  total,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  
  return (
    <div className="flex items-center justify-between p-4">
      <button onClick={() => onPageChange(currentPage - 1)}>← Předchozí</button>
      
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={currentPage === i + 1 ? 'bg-blue-500' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
      <button onClick={() => onPageChange(currentPage + 1)}>Další →</button>
      
      <select onChange={(e) => onPageSizeChange(parseInt(e.target.value))}>
        <option value="10">10 / strana</option>
        <option value="25">25 / strana</option>
        <option value="50">50 / strana</option>
      </select>
    </div>
  );
}
```

**Stav: 0% ❌**

---

## 8. CAPTURE PAYMENT MODAL - ❌ NEEXISTUJE

**Soubor:** `/components/admin/CapturePaymentModal.tsx` - NEEXISTUJE!

Mělo by obsahovat:
```typescript
// CHYBÍ: Celá komponenta
interface CapturePaymentModalProps {
  orderId: string;
  orderTotal: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function CapturePaymentModal({
  orderId,
  orderTotal,
  onClose,
  onSuccess,
}: CapturePaymentModalProps) {
  const [amount, setAmount] = useState(orderTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCapture = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/capture-payment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        }
      );
      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError('Chyba při zpracování platby');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Zaznamenat platbu</h2>
        
        <div className="mb-4">
          <label>Částka (Kč)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            max={orderTotal}
            className="w-full border rounded px-3 py-2"
          />
          <small>Max: {orderTotal}</small>
        </div>
        
        {error && <div className="text-red-600 mb-4">{error}</div>}
        
        <div className="flex gap-2">
          <button
            onClick={handleCapture}
            disabled={loading}
            className="flex-1 bg-green-600 text-white rounded py-2"
          >
            {loading ? 'Zpracuji...' : 'Zaznamenat'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border rounded py-2"
          >
            Zrušit
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Stav: 0% ❌**

---

## 9. CREATE SHIPMENT MODAL - ❌ NEEXISTUJE

**Soubor:** `/components/admin/CreateShipmentModal.tsx` - NEEXISTUJE!

Mělo by obsahovat:
```typescript
// CHYBÍ: Celá komponenta
export function CreateShipmentModal({
  orderId,
  orderItems,
  onClose,
  onSuccess,
}: Props) {
  const [carrier, setCarrier] = useState('dpd');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>(
    orderItems.map(i => i.id)
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/orders/${orderId}/shipments`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            carrier,
            trackingNumber,
            items: selectedItems,
            notes,
          }),
        }
      );
      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <select value={carrier} onChange={(e) => setCarrier(e.target.value)}>
        <option value="dpd">DPD</option>
        <option value="zasilkovna">Zásilkovna</option>
        <option value="fedex">FedEx</option>
        <option value="gls">GLS</option>
        <option value="ups">UPS</option>
      </select>

      <input
        type="text"
        placeholder="Tracking number"
        value={trackingNumber}
        onChange={(e) => setTrackingNumber(e.target.value)}
      />

      <div>
        {orderItems.map((item) => (
          <label key={item.id}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems([...selectedItems, item.id]);
                } else {
                  setSelectedItems(selectedItems.filter(id => id !== item.id));
                }
              }}
            />
            {item.nameSnapshot}
          </label>
        ))}
      </div>

      <textarea
        placeholder="Poznámky"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={handleCreate} disabled={loading}>
        {loading ? 'Vytvářím...' : 'Vytvořit zásilku'}
      </button>
    </div>
  );
}
```

**Stav: 0% ❌**

---

## 10. BULK ACTIONS TOOLBAR - ❌ NEEXISTUJE

**Soubor:** `/components/admin/BulkActionsBar.tsx` - NEEXISTUJE!

Mělo by obsahovat:
```typescript
// CHYBÍ: Celá komponenta
interface BulkActionsBarProps {
  selectedIds: string[];
  onMarkPaid: () => void;
  onMarkShipped: () => void;
  onClearSelection: () => void;
}

export function BulkActionsBar({
  selectedIds,
  onMarkPaid,
  onMarkShipped,
  onClearSelection,
}: BulkActionsBarProps) {
  if (selectedIds.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
      <span>{selectedIds.length} objednávek vybráno</span>
      
      <div className="flex gap-2">
        <button onClick={onMarkPaid} className="px-4 py-2 bg-green-600 text-white rounded">
          Označit zaplaceno
        </button>
        
        <button onClick={onMarkShipped} className="px-4 py-2 bg-blue-600 text-white rounded">
          Označit odesláno
        </button>
        
        <button onClick={onClearSelection} className="px-4 py-2 border rounded">
          Zrušit výběr
        </button>
      </div>
    </div>
  );
}
```

**Stav: 0% ❌**

---

## SOUHRNNÁ TABULKA

| Součást | Soubor | % Hotovo | Poznámka |
|---------|--------|----------|----------|
| List page | `page.tsx` | 25% | Jen tabulka |
| Detail page | `[id]/page.tsx` | 40% | Bez modale |
| Edit page | `[id]/edit/page.tsx` | 20% | Jen orderStatus |
| **Filters** | `components/admin/Filters.tsx` | **0%** | NEEXISTUJE |
| **Pagination** | `components/ui/PaginationControls.tsx` | **0%** | NEEXISTUJE |
| **Sorting** | N/A | **0%** | NEIMPLEMENTOVÁNO |
| **Payment Modal** | `components/admin/CapturePaymentModal.tsx` | **0%** | NEEXISTUJE |
| **Shipment Modal** | `components/admin/CreateShipmentModal.tsx` | **0%** | NEEXISTUJE |
| **Bulk Actions** | `components/admin/BulkActionsBar.tsx` | **0%** | NEEXISTUJE |
| **StatusBadge** | `components/ui/StatusBadge.tsx` | **0%** | NEEXISTUJE |
| **Checkbox logic** | N/A | **0%** | NEIMPLEMENTOVÁNO |
| **API integration** | Multiple | 50% | API je hotov, pero UI chybí |
| **Types** | `types/admin/orders.ts` | **0%** | NEEXISTUJE |
| **API utilities** | `lib/api/orders.ts` | **0%** | NEEXISTUJE |

---

**CELKEM FRONTEND: 25-30% ❌**

