# Úkol: CHUNK-01 - E-commerce Foundation

**Datum vytvoření:** 9. listopadu 2025
**Předpokládaná doba:** 4-6 sessions (2-3 týdny)
**Priorita:** 🔴 CRITICAL

---

## Co dělat

Implementovat kompletní e-commerce funkcionalitu pro Mùza Hair e-shop. Projekt má perfektní SEO a design, ale chybí mu kritické funkce pro prodej - košík, checkout, platby. Tento chunk přidá všechny základní funkce potřebné pro začátek prodeje.

---

## Konkrétní kroky

### **1. Shopping Cart (Košík)** [Session 1]

#### **State Management:**
- [ ] Nainstalovat Zustand (`npm install zustand`)
- [ ] Vytvořit `/lib/store/cartStore.ts`
  - Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`
  - State: `items[]`, `total`, `itemCount`
- [ ] Persist do localStorage
- [ ] Cart animations (Framer Motion)

#### **UI Components:**
- [ ] `components/cart/CartDrawer.tsx` (slide-in drawer)
- [ ] `components/cart/CartItem.tsx` (product row)
- [ ] `components/cart/CartSummary.tsx` (total, shipping)
- [ ] Mini cart badge v Header (počet items)

#### **Features:**
- [ ] Add to cart button na PDP
- [ ] Quantity selector (+/-)
- [ ] Remove item button
- [ ] Upsells: "Zákazníci také kupují"
- [ ] Free shipping threshold progress bar

---

### **2. Checkout Process** [Session 2-3]

#### **Multi-step Form:**
- [ ] Vytvořit `/app/checkout/page.tsx`
- [ ] Step 1: Delivery information
  - Jméno, příjmení, email, telefon
  - Adresa (ulice, město, PSČ, země)
  - Delivery method (Česká pošta, Zásilkovna, PPL)
- [ ] Step 2: Payment method
  - GoPay (karta, bankovní převod)
  - Dobírka (cash on delivery)
- [ ] Step 3: Order summary & confirmation

#### **Form Validation:**
- [ ] Nainstalovat `react-hook-form` + `zod`
- [ ] Validace všech polí (email, telefon, PSČ)
- [ ] Error messages v češtině

#### **UI:**
- [ ] Progress indicator (1/3, 2/3, 3/3)
- [ ] Back button (návrat k předchozímu kroku)
- [ ] Trust badges (SSL, secure payment)
- [ ] Order summary sidebar (sticky)

---

### **3. Payment Gateway Integration** [Session 3]

#### **GoPay Setup:**
- [ ] Registrace GoPay účtu (sandbox)
- [ ] Nainstalovat GoPay SDK (`@gopay/gopay-js-sdk`)
- [ ] Vytvořit `/app/api/payment/gopay/route.ts`
  - Endpoint: `POST /api/payment/gopay`
  - Create payment session
  - Return payment URL
- [ ] Redirect na GoPay payment page
- [ ] Webhook: `POST /api/payment/gopay/webhook`
  - Handle payment success/failure
  - Update order status

#### **Alternative: Stripe:**
- [ ] (Pokud GoPay nefunguje) Nainstalovat Stripe
- [ ] Checkout session
- [ ] Webhook handler

---

### **4. Order Management System** [Session 4]

#### **Database Schema (Prisma):**
- [ ] Nainstalovat Prisma (`npm install prisma @prisma/client`)
- [ ] `npx prisma init`
- [ ] Vytvořit schema v `prisma/schema.prisma`:
  ```prisma
  model Order {
    id            String   @id @default(uuid())
    orderNumber   String   @unique
    customerEmail String
    customerName  String
    customerPhone String
    shippingAddress Json
    items         Json
    subtotal      Float
    shipping      Float
    total         Float
    status        OrderStatus @default(PENDING)
    paymentMethod String
    paymentStatus PaymentStatus @default(UNPAID)
    createdAt     DateTime @default(now())
    updatedAt     DateTime @updatedAt
  }

  enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
  }

  enum PaymentStatus {
    UNPAID
    PAID
    REFUNDED
  }
  ```
- [ ] `npx prisma migrate dev --name init`
- [ ] `npx prisma generate`

#### **API Endpoints:**
- [ ] `POST /api/orders` - Create new order
- [ ] `GET /api/orders/:id` - Get order details
- [ ] `PATCH /api/orders/:id` - Update order status

---

### **5. Email Notifications** [Session 5]

#### **Setup Resend:**
- [ ] Registrace Resend účtu
- [ ] Nainstalovat `npm install resend`
- [ ] Vytvořit `/lib/email/templates/`
  - `orderConfirmation.tsx` (React Email)
  - `orderShipped.tsx`
  - `orderDelivered.tsx`

#### **Email Templates (React Email):**
- [ ] Order confirmation email:
  - Číslo objednávky
  - Seznam produktů
  - Celková cena
  - Doručovací adresa
  - Tracking link (later)
- [ ] Email styling (burgundy theme)

#### **Triggers:**
- [ ] Send email po úspěšné platbě
- [ ] Send email při změně statusu
- [ ] Error handling (retry logic)

---

### **6. Admin Panel (Basic)** [Session 6]

#### **Admin Routes:**
- [ ] `/app/admin/layout.tsx` (admin layout)
- [ ] `/app/admin/orders/page.tsx` (seznam objednávek)
- [ ] `/app/admin/orders/[id]/page.tsx` (detail objednávky)

#### **Features:**
- [ ] Tabulka objednávek:
  - Číslo objednávky
  - Zákazník
  - Celková cena
  - Status
  - Datum
- [ ] Filtry (status, datum)
- [ ] Update order status dropdown
- [ ] Export to CSV

#### **Auth (Basic):**
- [ ] Simple password protection (env variable)
- [ ] Middleware pro admin routes

---

## Závislosti

### **Před začátkem:**
- [ ] Projekt funguje (`npm run dev`)
- [ ] Znáš strukturu produktů (product types)
- [ ] Máš testovací GoPay/Stripe účet

### **Externí služby:**
- [ ] GoPay sandbox account
- [ ] Resend API key
- [ ] Database (Vercel Postgres / Railway)

---

## Akceptační kritéria

### **Košík:**
- [ ] ✅ Lze přidat produkt do košíku
- [ ] ✅ Lze změnit množství
- [ ] ✅ Lze odstranit item
- [ ] ✅ Košík přežije refresh (localStorage)
- [ ] ✅ Mini cart badge zobrazuje správný počet

### **Checkout:**
- [ ] ✅ Multi-step form funguje
- [ ] ✅ Všechna pole jsou validovaná
- [ ] ✅ Error messages jsou v češtině
- [ ] ✅ Lze se vrátit zpět k předchozímu kroku
- [ ] ✅ Order summary je správně vypočítaný

### **Platby:**
- [ ] ✅ GoPay platba funguje (sandbox)
- [ ] ✅ Webhook správně zpracovává platby
- [ ] ✅ Úspěšná platba vytvoří objednávku
- [ ] ✅ Neúspěšná platba zobrazí error

### **Objednávky:**
- [ ] ✅ Objednávka se uloží do DB
- [ ] ✅ Má jedinečné číslo objednávky
- [ ] ✅ API endpoints fungují
- [ ] ✅ Order status lze změnit

### **Emaily:**
- [ ] ✅ Confirmation email se odešle
- [ ] ✅ Email obsahuje správné údaje
- [ ] ✅ Styling odpovídá brand identitě
- [ ] ✅ Funguje na všech email klientech

### **Admin:**
- [ ] ✅ Admin může zobrazit všechny objednávky
- [ ] ✅ Admin může změnit status
- [ ] ✅ Admin může exportovat do CSV
- [ ] ✅ Admin panel je chráněný heslem

---

## Tech Stack

- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Database:** Prisma + PostgreSQL
- **Payments:** GoPay (nebo Stripe)
- **Emails:** Resend + React Email
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion

---

## Resources

### **Dokumentace:**
- Zustand: https://zustand.docs.pmnd.rs/
- GoPay API: https://doc.gopay.com/
- Stripe Checkout: https://stripe.com/docs/payments/checkout
- Prisma: https://www.prisma.io/docs
- Resend: https://resend.com/docs
- React Email: https://react.email/

### **Inspirace:**
- Goldhair.cz (checkout process)
- ILoveSlavicHair.com (cart UX)

---

## 🌍 Multilingual Processing Reminder

**Pro Claude Code:**
- Web searches VŽDY v angličtině (např. "Next.js shopping cart best practices 2025", "GoPay integration tutorial", "Prisma PostgreSQL deployment")
- Internal reasoning v EN (15-20% lepší kvalita)
- Output pro uživatele v češtině

**Example search queries:**
- "Next.js 14 shopping cart Zustand"
- "GoPay payment gateway integration Node.js"
- "Prisma schema design e-commerce orders"
- "React Email templates transactional"
- "Multi-step checkout form React Hook Form"

---

**Last Updated:** 9. listopadu 2025
**Status:** ⏳ PENDING (nezačato)
