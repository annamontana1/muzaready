# Soubory: CHUNK-01 - E-commerce Foundation

**Total New Files:** ~35
**Total Modified Files:** ~8

---

## 📝 Nové soubory k vytvoření

### **1. State Management (Zustand)**

```
lib/store/
├── cartStore.ts                    # Shopping cart state
└── types.ts                        # Store types
```

### **2. Cart Components**

```
components/cart/
├── CartDrawer.tsx                  # Slide-in košík drawer
├── CartItem.tsx                    # Individual cart item
├── CartSummary.tsx                 # Total, shipping, discount
├── CartEmptyState.tsx              # Prázdný košík state
├── MiniCart.tsx                    # Mini cart badge (header)
└── AddToCartButton.tsx             # Add to cart CTA
```

### **3. Checkout Pages & Components**

```
app/checkout/
├── page.tsx                        # Main checkout page (multi-step)
├── layout.tsx                      # Checkout layout
├── success/
│   └── page.tsx                    # Order success page
└── cancelled/
    └── page.tsx                    # Payment cancelled page

components/checkout/
├── CheckoutSteps.tsx               # Progress indicator (1/2/3)
├── DeliveryForm.tsx                # Step 1: Delivery info
├── PaymentMethodSelector.tsx      # Step 2: Payment method
├── OrderSummary.tsx                # Step 3: Order review
├── ShippingMethodSelector.tsx     # Shipping options
└── CheckoutSidebar.tsx             # Order summary sidebar
```

### **4. Payment Integration**

```
app/api/payment/
├── gopay/
│   ├── route.ts                    # POST: Create payment session
│   └── webhook/
│       └── route.ts                # POST: GoPay webhook handler
└── stripe/
    ├── route.ts                    # (Alternative) Stripe checkout
    └── webhook/
        └── route.ts                # Stripe webhook handler

lib/payment/
├── gopay.ts                        # GoPay client wrapper
├── stripe.ts                       # Stripe client wrapper
└── types.ts                        # Payment types
```

### **5. Order Management (API + DB)**

```
prisma/
├── schema.prisma                   # Prisma schema (Order model)
└── migrations/
    └── 20251109_init/
        └── migration.sql           # Initial migration

app/api/orders/
├── route.ts                        # GET, POST /api/orders
└── [id]/
    └── route.ts                    # GET, PATCH /api/orders/:id

lib/database/
├── prisma.ts                       # Prisma client singleton
└── queries/
    ├── orders.ts                   # Order queries
    └── types.ts                    # DB types
```

### **6. Email Templates (Resend + React Email)**

```
lib/email/
├── client.ts                       # Resend client
├── send.ts                         # Email sending functions
└── templates/
    ├── OrderConfirmation.tsx       # Confirmation email
    ├── OrderShipped.tsx            # Shipped notification
    ├── OrderDelivered.tsx          # Delivered notification
    ├── OrderCancelled.tsx          # Cancelled notification
    └── components/
        ├── EmailLayout.tsx         # Email layout wrapper
        ├── EmailHeader.tsx         # Header s logem
        ├── EmailFooter.tsx         # Footer s kontakty
        └── EmailButton.tsx         # CTA button component
```

### **7. Admin Panel**

```
app/admin/
├── layout.tsx                      # Admin layout (nav, auth)
├── page.tsx                        # Admin dashboard (přehled)
├── orders/
│   ├── page.tsx                    # Orders list
│   └── [id]/
│       └── page.tsx                # Order detail
└── middleware.ts                   # Admin auth middleware

components/admin/
├── AdminNav.tsx                    # Admin navigation
├── OrdersTable.tsx                 # Orders table component
├── OrderStatusBadge.tsx            # Status badge
├── OrderFilters.tsx                # Filters (status, date)
└── ExportButton.tsx                # Export to CSV button
```

### **8. Utility Functions**

```
lib/utils/
├── orderNumber.ts                  # Generate unique order numbers
├── pricing.ts                      # Price calculations
├── formatters.ts                   # Date, currency formatters
└── validation.ts                   # Validation helpers
```

### **9. TypeScript Types**

```
types/
├── cart.ts                         # Cart types
├── checkout.ts                     # Checkout types
├── order.ts                        # Order types
└── payment.ts                      # Payment types
```

### **10. Configuration**

```
.env.local                          # Environment variables (new)
```

Add:
```bash
# Database
DATABASE_URL="postgresql://..."

# GoPay
GOPAY_GOID="..."
GOPAY_CLIENT_ID="..."
GOPAY_CLIENT_SECRET="..."
GOPAY_WEBHOOK_SECRET="..."

# Resend
RESEND_API_KEY="..."
RESEND_FROM_EMAIL="objednavky@muzahair.cz"

# Admin
ADMIN_PASSWORD="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## ✏️ Existující soubory k úpravě

### **1. Product Detail Page**

```
app/produkty/[category]/[slug]/page.tsx

Changes:
- Přidat AddToCartButton komponentu
- Import cartStore
- Handle "add to cart" action
```

### **2. Header**

```
components/Header.tsx

Changes:
- Přidat MiniCart komponentu
- Zobrazit počet items v košíku
- Link na /checkout
```

### **3. Package.json**

```
package.json

New dependencies:
- zustand (state management)
- @gopay/gopay-js-sdk (payments)
- @prisma/client (database)
- prisma (dev dependency)
- react-hook-form (forms)
- @hookform/resolvers (validation)
- zod (schema validation)
- resend (emails)
- @react-email/components (email templates)
```

### **4. Next Config**

```
next.config.js

Changes:
- Add server actions config (pokud je potřeba)
- Add rewrites for webhooks (pokud je potřeba)
```

### **5. Tailwind Config**

```
tailwind.config.ts

Changes:
- Add animation for cart drawer
- Add custom colors (pokud jsou potřeba nové)
```

### **6. Middleware**

```
middleware.ts

Changes:
- Add admin route protection
- Add checkout route logic
```

### **7. TypeScript Config**

```
tsconfig.json

Changes:
- Add Prisma types path (pokud je potřeba)
```

### **8. Global Styles**

```
app/globals.css

Changes:
- Add cart drawer animations
- Add checkout form styles
```

---

## 📦 Dependencies (npm install)

### **Production:**
```bash
npm install zustand                      # State management
npm install @gopay/gopay-js-sdk          # GoPay payments
npm install @prisma/client               # Database ORM
npm install react-hook-form              # Form handling
npm install @hookform/resolvers          # Form validation
npm install zod                          # Schema validation
npm install resend                       # Email service
npm install @react-email/components      # Email templates
npm install date-fns                     # Date formatting
```

### **Development:**
```bash
npm install -D prisma                    # Prisma CLI
npm install -D @types/node               # Node types (pokud chybí)
```

---

## 🔗 Závislosti souborů

### **Read-only (pouze číst):**
```
lib/products.ts                     # Product data (pro cart items)
types/product.ts                    # Product types
components/Header.tsx               # Pro úpravu (MiniCart)
app/produkty/.../page.tsx           # Pro úpravu (AddToCart)
```

### **Will be imported:**
```
lib/store/cartStore.ts              # Used by all cart components
lib/payment/gopay.ts                # Used by payment API
lib/database/prisma.ts              # Used by all DB queries
lib/email/client.ts                 # Used by email sending
```

---

## 📂 Adresářová struktura (po CHUNK-01)

```
/Users/zen/Muza2.0/
├── app/
│   ├── admin/                      # ✨ NEW: Admin panel
│   ├── api/
│   │   ├── orders/                 # ✨ NEW: Orders API
│   │   └── payment/                # ✨ NEW: Payment API
│   ├── checkout/                   # ✨ NEW: Checkout pages
│   └── produkty/                   # ✏️  EDIT: Add cart button
├── components/
│   ├── admin/                      # ✨ NEW: Admin components
│   ├── cart/                       # ✨ NEW: Cart components
│   ├── checkout/                   # ✨ NEW: Checkout components
│   └── Header.tsx                  # ✏️  EDIT: Add MiniCart
├── lib/
│   ├── database/                   # ✨ NEW: DB queries
│   ├── email/                      # ✨ NEW: Email templates
│   ├── payment/                    # ✨ NEW: Payment clients
│   ├── store/                      # ✨ NEW: Zustand stores
│   └── utils/                      # ✨ NEW: Utilities
├── prisma/
│   ├── schema.prisma               # ✨ NEW: Database schema
│   └── migrations/                 # ✨ NEW: DB migrations
├── types/
│   ├── cart.ts                     # ✨ NEW: Cart types
│   ├── checkout.ts                 # ✨ NEW: Checkout types
│   ├── order.ts                    # ✨ NEW: Order types
│   └── payment.ts                  # ✨ NEW: Payment types
└── .env.local                      # ✏️  EDIT: Add new vars
```

**Legend:**
- ✨ NEW: Nové soubory/adresáře
- ✏️  EDIT: Existující soubory k úpravě

---

## 🚀 File Creation Order (doporučené pořadí)

### **Session 1: Shopping Cart**
1. `lib/store/cartStore.ts`
2. `types/cart.ts`
3. `components/cart/CartItem.tsx`
4. `components/cart/CartSummary.tsx`
5. `components/cart/CartDrawer.tsx`
6. `components/cart/MiniCart.tsx`
7. `components/cart/AddToCartButton.tsx`
8. Edit `components/Header.tsx`
9. Edit `app/produkty/.../page.tsx`

### **Session 2-3: Checkout**
10. `types/checkout.ts`
11. `app/checkout/layout.tsx`
12. `app/checkout/page.tsx`
13. `components/checkout/CheckoutSteps.tsx`
14. `components/checkout/DeliveryForm.tsx`
15. `components/checkout/PaymentMethodSelector.tsx`
16. `components/checkout/OrderSummary.tsx`
17. `app/checkout/success/page.tsx`
18. `app/checkout/cancelled/page.tsx`

### **Session 3: Payment**
19. `lib/payment/gopay.ts`
20. `types/payment.ts`
21. `app/api/payment/gopay/route.ts`
22. `app/api/payment/gopay/webhook/route.ts`

### **Session 4: Orders**
23. `prisma/schema.prisma`
24. Run migrations
25. `lib/database/prisma.ts`
26. `lib/database/queries/orders.ts`
27. `types/order.ts`
28. `app/api/orders/route.ts`
29. `app/api/orders/[id]/route.ts`

### **Session 5: Emails**
30. `lib/email/client.ts`
31. `lib/email/templates/EmailLayout.tsx`
32. `lib/email/templates/OrderConfirmation.tsx`
33. `lib/email/send.ts`

### **Session 6: Admin**
34. `app/admin/layout.tsx`
35. `app/admin/orders/page.tsx`
36. `app/admin/orders/[id]/page.tsx`
37. `components/admin/OrdersTable.tsx`
38. Edit `middleware.ts`

---

**🌍 Multilingual Processing:** Při práci na souborech Claude hledá dokumentaci v EN (lepší výsledky)

**Last Updated:** 9. listopadu 2025
