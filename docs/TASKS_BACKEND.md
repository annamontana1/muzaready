# Backend Tasks - Orders Admin Panel

**Owner:** Backend Guy (Kamarád)
**Branch:** `feature/orders-api`
**Timeline:** 2-3 days
**Dependencies:** Phase 0 (schema) must be merged first

---

## Phase 0: Database Schema (FIRST!)
**Branch:** `feature/orders-schema` → Merge to main before starting Phase 1

### Task: Update Prisma Schema
**File:** `/prisma/schema.prisma`

Add to `Order` model:
```prisma
model Order {
  // ... existing fields (id, email, firstName, etc.)

  // NEW: Order state machine
  orderStatus    String @default("draft")       // draft, pending, paid, processing, shipped, completed, cancelled
  paymentStatus  String @default("unpaid")      // unpaid, partial, paid, refunded
  deliveryStatus String @default("pending")     // pending, shipped, delivered, returned

  // NEW: Metadata
  channel        String @default("web")         // web, pos, ig_dm
  tags           String?                        // JSON array: ["tag1", "tag2"]
  riskScore      Int    @default(0)            // 0-100

  // NEW: Assignment & Notes
  assignedToUserId String?
  salonId        String?                        // B2B partner reference
  notesInternal  String?
  notesCustomer  String?

  // Updated timestamps
  updatedAt      DateTime @updatedAt
  lastStatusChangeAt DateTime?
}
```

**Steps:**
1. Update schema.prisma with above fields
2. Run: `npx prisma migrate dev --name add_order_fields`
3. Create PR: `feature/orders-schema`
4. Wait for approval & merge to main

---

## Phase 1: API Endpoints

### Task 1: List Orders with Filtering
**Endpoint:** `GET /api/admin/orders`
**File:** `/app/api/admin/orders/route.ts`

**Parameters (query string):**
```
?orderStatus=paid&paymentStatus=unpaid&channel=web&limit=50&offset=0&sort=-createdAt
```

**Response:**
```json
{
  "data": [
    {
      "id": "order123",
      "email": "customer@example.com",
      "firstName": "Jan",
      "lastName": "Novák",
      "total": 5000,
      "orderStatus": "paid",
      "paymentStatus": "unpaid",
      "deliveryStatus": "pending",
      "channel": "web",
      "tags": ["expedovat-dnes"],
      "createdAt": "2025-01-15T10:30:00Z",
      "itemCount": 3
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

**Implementation:**
```typescript
// /app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filters
    const orderStatus = searchParams.get('orderStatus');
    const paymentStatus = searchParams.get('paymentStatus');
    const channel = searchParams.get('channel');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || '-createdAt'; // -createdAt or createdAt

    // Build where clause
    const where: any = {};
    if (orderStatus) where.orderStatus = orderStatus;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (channel) where.channel = channel;

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
      orderBy: sort.startsWith('-')
        ? { [sort.slice(1)]: 'desc' }
        : { [sort]: 'asc' },
      take: limit,
      skip: offset,
    });

    // Get total count
    const total = await prisma.order.count({ where });

    return NextResponse.json({
      data: orders.map(order => ({
        ...order,
        itemCount: order.items.length,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
```

---

### Task 2: Order Detail
**Endpoint:** `GET /api/admin/orders/[id]`
**File:** `/app/api/admin/orders/[id]/route.ts`

**Response:**
```json
{
  "id": "order123",
  "email": "customer@example.com",
  "firstName": "Jan",
  "lastName": "Novák",
  "phone": "+420732123456",
  "streetAddress": "Ulice 123",
  "city": "Praha",
  "zipCode": "11000",
  "country": "CZ",
  "total": 5000,
  "subtotal": 4500,
  "shippingCost": 500,
  "discountAmount": 0,
  "orderStatus": "paid",
  "paymentStatus": "unpaid",
  "deliveryStatus": "pending",
  "paymentMethod": "bank_transfer",
  "deliveryMethod": "standard",
  "channel": "web",
  "tags": ["expedovat-dnes"],
  "riskScore": 0,
  "notesInternal": "Prepare for next day shipping",
  "notesCustomer": "Please hurry",
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z",
  "items": [
    {
      "id": "item1",
      "nameSnapshot": "Platinum Hair 60cm",
      "grams": 150,
      "pricePerGram": 20,
      "lineTotal": 3000,
      "saleMode": "PIECE_BY_WEIGHT",
      "skuId": "sku123"
    }
  ]
}
```

**Implementation:**
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Transform items to include price field (from pricePerGram)
    return NextResponse.json({
      ...order,
      items: order.items.map(item => ({
        ...item,
        price: item.pricePerGram,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching order' }, { status: 500 });
  }
}
```

---

### Task 3: Update Order Status
**Endpoint:** `PUT /api/admin/orders/[id]`

**Request Body:**
```json
{
  "orderStatus": "paid",
  "paymentStatus": "paid",
  "deliveryStatus": "shipped",
  "tags": ["expedovano"],
  "notesInternal": "Updated by admin"
}
```

**Implementation:**
```typescript
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...body,
        lastStatusChangeAt: new Date(),
      },
      include: { items: true },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating order' }, { status: 500 });
  }
}
```

---

### Task 4: Bulk Actions
**Endpoint:** `POST /api/admin/orders/bulk`

**Request Body:**
```json
{
  "ids": ["order1", "order2", "order3"],
  "action": "mark-shipped",
  "data": {
    "deliveryStatus": "shipped",
    "tags": "expedovano"
  }
}
```

**Implementation:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const { ids, action, data } = await request.json();

    if (action === 'mark-shipped' || action === 'mark-paid') {
      await prisma.order.updateMany({
        where: { id: { in: ids } },
        data: {
          ...data,
          lastStatusChangeAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      updated: ids.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Bulk action failed' }, { status: 500 });
  }
}
```

---

### Task 5: Payment Capture
**Endpoint:** `POST /api/admin/orders/[id]/capture-payment`

**Request:**
```json
{
  "amount": 5000
}
```

**Implementation:**
```typescript
// Mark as paid, update timestamps
await prisma.order.update({
  where: { id },
  data: {
    paymentStatus: 'paid',
    paidAt: new Date(),
  },
});
```

---

### Task 6: Create Shipment
**Endpoint:** `POST /api/admin/orders/[id]/shipments`

**Request:**
```json
{
  "carrier": "zasilkovna",
  "trackingNumber": "ABC123456",
  "items": ["item1", "item2"]
}
```

---

## Testing Checklist

```
☐ Can list orders without filter
☐ Can filter by orderStatus=paid
☐ Can filter by paymentStatus=unpaid
☐ Can filter by channel=web
☐ Pagination works (limit + offset)
☐ Sorting works (-createdAt)
☐ Get order detail works
☐ Update order status works
☐ Update returns fresh data
☐ Bulk mark-shipped works
☐ All errors return proper status codes
```

## Testing with Curl

```bash
# List all orders
curl http://localhost:3007/api/admin/orders

# List paid orders
curl "http://localhost:3007/api/admin/orders?orderStatus=paid"

# Get detail
curl http://localhost:3007/api/admin/orders/[order-id]

# Update status
curl -X PUT http://localhost:3007/api/admin/orders/[order-id] \
  -H "Content-Type: application/json" \
  -d '{"orderStatus":"paid","paymentStatus":"paid"}'

# Bulk mark as shipped
curl -X POST http://localhost:3007/api/admin/orders/bulk \
  -H "Content-Type: application/json" \
  -d '{"ids":["id1","id2"],"action":"mark-shipped","data":{"deliveryStatus":"shipped"}}'
```

---

## Files to Create/Modify

```
✅ /prisma/schema.prisma (Phase 0)
✅ /app/api/admin/orders/route.ts (new)
✅ /app/api/admin/orders/[id]/route.ts (new)
✅ /app/api/admin/orders/bulk/route.ts (new)
✅ /app/api/admin/orders/[id]/capture-payment/route.ts (new)
✅ /app/api/admin/orders/[id]/shipments/route.ts (new)
```

---

## Dependencies

- ✅ Prisma updated
- ✅ adminAuth (already have `requireAdmin`)
- ⚠️ None for basic implementation

---

## Estimated Time

- Phase 0 (schema): 10 min
- Task 1 (list): 20 min
- Task 2 (detail): 15 min
- Task 3 (update): 15 min
- Task 4 (bulk): 20 min
- Task 5-6 (payments/shipments): 30 min
- Testing: 20 min

**Total:** ~2-3 hours
