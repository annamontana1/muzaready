# Frontend Tasks - Orders Admin Panel

Zde je seznam všech frontend úkolů pro implementaci Orders Admin Panelu. Backend API je hotovo, zbývá implementovat frontend.

## Status: ✅ Backend API hotovo, ⏳ Frontend v práci

---

## API Dokumentace

Backend běží na: `http://localhost:3000`

Všechny requesty vyžadují admin session cookie:
```
Cookie: admin-session=<base64-encoded-json>
```

### Dostupné API Endpoints

#### 1. GET /api/admin/orders
Získání seznamu objednávek s filtrováním, stránkováním a třídením

**Query Parameters:**
- `orderStatus` - draft, pending, paid, processing, shipped, completed, cancelled
- `paymentStatus` - unpaid, partial, paid, refunded
- `deliveryStatus` - pending, shipped, delivered, returned
- `channel` - web, pos, ig_dm
- `email` - hledání podle emailu (částečná shoda)
- `limit` - počet položek na stránku (1-100, výchozí 50)
- `offset` - offset pro stránkování (výchozí 0)
- `sort` - pole pro třídění (createdAt, updatedAt, total, id, email) - prefix - pro descending

**Response:**
```json
{
  "orders": [
    {
      "id": "order-id",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "total": 5000,
      "subtotal": 4500,
      "shippingCost": 500,
      "discountAmount": 0,
      "orderStatus": "pending",
      "paymentStatus": "unpaid",
      "deliveryStatus": "pending",
      "channel": "web",
      "tags": ["expedovano"],
      "riskScore": 0,
      "itemCount": 2,
      "createdAt": "2025-12-03T...",
      "updatedAt": "2025-12-03T...",
      "lastStatusChangeAt": "2025-12-03T..."
    }
  ],
  "total": 100,
  "limit": 50,
  "offset": 0,
  "hasMore": true
}
```

#### 2. GET /api/admin/orders/[id]
Získání jedné objednávky s detailem

**Response:**
```json
{
  "id": "order-id",
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "123456789",
  "address": "123 Main St",
  "city": "Prague",
  "postalCode": "11000",
  "country": "Czech Republic",
  "total": 5000,
  "subtotal": 4500,
  "shippingCost": 500,
  "discountAmount": 0,
  "orderStatus": "pending",
  "paymentStatus": "unpaid",
  "deliveryStatus": "pending",
  "channel": "web",
  "tags": [],
  "riskScore": 0,
  "notesInternal": "Test note",
  "notesCustomer": null,
  "paymentMethod": "stripe",
  "deliveryMethod": "standard",
  "items": [
    {
      "id": "item-id",
      "nameSnapshot": "Product Name",
      "grams": 100,
      "pricePerGram": 50,
      "lineTotal": 5000,
      "saleMode": "grams",
      "skuId": "sku-id",
      "sku": {
        "id": "sku-id",
        "sku": "SKU123",
        "name": "Product Name",
        "shadeName": "Gold",
        "lengthCm": 50
      }
    }
  ],
  "createdAt": "2025-12-03T...",
  "updatedAt": "2025-12-03T...",
  "lastStatusChangeAt": "2025-12-03T..."
}
```

#### 3. PUT /api/admin/orders/[id]
Aktualizace objednávky

**Request Body:**
```json
{
  "orderStatus": "processing",
  "paymentStatus": "paid",
  "deliveryStatus": "shipped",
  "tags": ["expedovano"],
  "notesInternal": "Processed and ready to ship",
  "notesCustomer": null,
  "riskScore": 10
}
```

#### 4. POST /api/admin/orders/[id]/capture-payment
Zaznamenání platby

**Request Body:**
```json
{
  "amount": 5000
}
```

**Response:** Aktualizovaná objednávka (stejný formát jako GET /api/admin/orders/[id])

#### 5. POST /api/admin/orders/[id]/shipments
Vytvoření zásilky

**Request Body:**
```json
{
  "carrier": "dpd",
  "trackingNumber": "DPD123456789",
  "items": ["item-id-1", "item-id-2"],
  "notes": "Special handling required"
}
```

Platné carriers: zasilkovna, dpd, fedex, gls, ups, other

#### 6. POST /api/admin/orders/bulk
Hromadné operace na objednávkách

**Request Body:**
```json
{
  "ids": ["order-id-1", "order-id-2"],
  "action": "mark-paid",
  "data": {
    "orderStatus": "processing",
    "paymentStatus": "paid",
    "deliveryStatus": "pending",
    "tags": ["expedovano"],
    "notesInternal": "Bulk processed"
  }
}
```

Platné actions: mark-shipped, mark-paid, update-status

---

## Frontend Tasks - Checklist

### 1. Autentizace / Přihlášení
- [ ] Vytvořit přihlašovací formulář pro admin
- [ ] Implementovat funkcionalitu pro získání admin session
- [ ] Uložit session cookie
- [ ] Implementovat ochranené trasy (Protected Routes)
- [ ] Logout funkcionalita

**Soubory:**
- `app/auth/login/page.tsx` - přihlašovací stránka
- `lib/auth.ts` - auth utilities
- `middleware.ts` - middleware pro ochranu tras

---

### 2. Admin Orders Dashboard - Hlavní list objednávek
- [ ] Vytvořit tabulku/seznam objednávek
- [ ] Implementovat fetchování dat z `GET /api/admin/orders`
- [ ] Zobrazit sloupce: ID, Email, Name, Total, Status (Order/Payment/Delivery), Created, Actions
- [ ] Implementovat pagination
- [ ] Implementovat sorting (kliknutí na sloupec)
- [ ] Implementovat filtrování:
  - [ ] Filtr podle orderStatus
  - [ ] Filtr podle paymentStatus
  - [ ] Filtr podle deliveryStatus
  - [ ] Filtr podle channel
  - [ ] Vyhledávání podle emailu
- [ ] Přidat akční tlačítka (View, Edit, Delete)
- [ ] Stylovat dle designu aplikace

**Soubory:**
- `app/admin/orders/page.tsx` - hlavní stránka
- `components/admin/OrdersTable.tsx` - komponenta tabulky
- `components/admin/OrdersFilters.tsx` - komponenta filtrů

---

### 3. Detail objednávky - View/Edit
- [ ] Vytvořit detail stránku objednávky
- [ ] Fetchovat objednávku z `GET /api/admin/orders/[id]`
- [ ] Zobrazit všechny detaily:
  - [ ] Kontaktní informace (email, phone, address)
  - [ ] Doručovací adresa
  - [ ] Objednané položky (tabulka s produkty, gram, cena)
  - [ ] Shrnutí ceny (subtotal, shipping, discount, total)
  - [ ] Statusy (orderStatus, paymentStatus, deliveryStatus)
  - [ ] Poznámky (notesInternal, notesCustomer)
  - [ ] Tagi
  - [ ] Risk score
- [ ] Implementovat editační formulář pro:
  - [ ] orderStatus
  - [ ] paymentStatus
  - [ ] deliveryStatus
  - [ ] tags
  - [ ] notesInternal
  - [ ] notesCustomer
  - [ ] riskScore
- [ ] Implementovat SAVE pomocí `PUT /api/admin/orders/[id]`
- [ ] Implementovat BACK tlačítko
- [ ] Přidat error handling a validaci

**Soubory:**
- `app/admin/orders/[id]/page.tsx` - detail stránka
- `components/admin/OrderDetail.tsx` - komponenta detailu
- `components/admin/OrderEditForm.tsx` - komponenta editačního formuláře

---

### 4. Capture Payment
- [ ] Přidat tlačítko "Capture Payment" na detail objednávky
- [ ] Vytvořit modal/dialog pro zadání částky
- [ ] Validovat vstup (musí být číslo > 0, max = order total)
- [ ] Implementovat `POST /api/admin/orders/[id]/capture-payment`
- [ ] Aktualizovat paymentStatus po úspěchu
- [ ] Přidat loading state a error handling

**Komponenty:**
- `components/admin/CapturePaymentModal.tsx` - modal pro platbu

---

### 5. Shipments
- [ ] Přidat tlačítko "Create Shipment" na detail objednávky
- [ ] Vytvořit modal/dialog s formulářem:
  - [ ] Výběr carrier (dropdown: dpd, zasilkovna, fedex, etc.)
  - [ ] Tracking number (input)
  - [ ] Select items (checkboxes - vybrat které položky se odesílají)
  - [ ] Notes (textarea)
- [ ] Implementovat `POST /api/admin/orders/[id]/shipments`
- [ ] Aktualizovat deliveryStatus na "shipped"
- [ ] Zobrazit historii shipments
- [ ] Přidat error handling

**Komponenty:**
- `components/admin/CreateShipmentModal.tsx` - modal pro zásilku
- `components/admin/ShipmentHistory.tsx` - historie zásilek

---

### 6. Bulk Operations
- [ ] Přidat checkboxes do orders tabulky
- [ ] Implementovat "Select All" checkbox
- [ ] Přidat actions menu pro vybrané objednávky:
  - [ ] Mark as Paid
  - [ ] Mark as Shipped
  - [ ] Update Status (modal s custom updatem)
- [ ] Implementovat `POST /api/admin/orders/bulk`
- [ ] Přidat confirmation dialog
- [ ] Refresh tabulky po operaci

**Komponenty:**
- `components/admin/BulkActionsBar.tsx` - akční lišta

---

### 7. UI Components
- [ ] Vytvořit reusable komponenty:
  - [ ] StatusBadge - pro zobrazení statusů s barvami
  - [ ] PaginationControls - pro stránkování
  - [ ] FilterDropdown - pro filtrování
  - [ ] ConfirmDialog - potvrzovací dialog
  - [ ] LoadingSpinner - loading indikátor
  - [ ] ErrorAlert - chybové hlášky

**Soubory:**
- `components/ui/StatusBadge.tsx`
- `components/ui/PaginationControls.tsx`
- `components/ui/ConfirmDialog.tsx`
- `components/ui/LoadingSpinner.tsx`
- `components/ui/ErrorAlert.tsx`

---

### 8. Styling & UX
- [ ] Stylovat všechny komponenty (Tailwind/CSS)
- [ ] Přidat responsive design (mobile, tablet, desktop)
- [ ] Implementovat dark mode (pokud je v designu)
- [ ] Přidat loading states
- [ ] Přidat success/error notifications
- [ ] Přidat keyboard shortcuts (Enter to save, Escape to cancel)
- [ ] Accessibility (ARIA labels, semantic HTML)

---

### 9. State Management & API
- [ ] Implementovat proper error handling pro API
- [ ] Přidat retry logiku pro failované requesty
- [ ] Implementovat caching (React Query / SWR)
- [ ] Přidat TypeScript types pro všechny API responses
- [ ] Implementovat optimistic updates (UI updates před API response)

**Soubory:**
- `lib/api/orders.ts` - API utilities
- `types/orders.ts` - TypeScript types

---

### 10. Testing (Optional)
- [ ] Unit testy pro utility functions
- [ ] Integration testy pro componenty
- [ ] E2E testy pro workflows

---

## Developer Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Server bude na http://localhost:3000
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Užitečné Linky

- **API Routes:** `/app/api/admin/orders/*`
- **Type Definitions:** Jsou dostupné v `types/`
- **Sample Data:** Lze generovat přes scripts v `scripts/`

---

## Kontakt & Otázky

Pokud máš jakékoliv otázky ohledně API nebo designu, otevři Issue nebo kontaktuj týmový lead.

---

**Last Updated:** 2025-12-03
**Backend Status:** ✅ HOTOVO
**Frontend Status:** 🚀 READY TO START
