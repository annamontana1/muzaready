# Stav: CHUNK-01 - E-commerce Foundation

**Status:** ⏳ PENDING
**Progress:** 0%
**Started:** (nezačato)
**Expected Completion:** 2-3 týdny (4-6 sessions)

---

## ✅ Hotovo

(Zatím nic)

---

## 🔄 Teď dělám

(Zatím nezačato)

---

## ⏭ Příští kroky

1. **Session 1:** Shopping Cart (Košík)
   - Nainstalovat Zustand
   - Vytvořit cartStore.ts
   - CartDrawer komponenty
   - Add to cart button na PDP

2. **Session 2-3:** Checkout Process
   - Multi-step form (3 kroky)
   - React Hook Form + Zod validation
   - Delivery & payment method selection

3. **Session 3:** Payment Gateway
   - GoPay registrace & integrace
   - Payment API endpoints
   - Webhook handler

4. **Session 4:** Order Management
   - Prisma setup
   - Database schema (Order model)
   - API endpoints (CRUD)

5. **Session 5:** Email Notifications
   - Resend setup
   - Email templates (React Email)
   - Order confirmation emails

6. **Session 6:** Admin Panel
   - Admin routes
   - Orders list & detail
   - Status management

---

## 📊 Progress Tracker

### **1. Shopping Cart** (0%)
- [ ] Zustand installed
- [ ] cartStore.ts created
- [ ] CartDrawer component
- [ ] CartItem component
- [ ] CartSummary component
- [ ] Mini cart badge
- [ ] Add to cart button
- [ ] localStorage persistence
- [ ] Animations (Framer Motion)

### **2. Checkout Process** (0%)
- [ ] /app/checkout/page.tsx created
- [ ] Step 1: Delivery info form
- [ ] Step 2: Payment method
- [ ] Step 3: Order summary
- [ ] React Hook Form setup
- [ ] Zod validation schema
- [ ] Error messages (CZ)
- [ ] Progress indicator
- [ ] Back button
- [ ] Order summary sidebar

### **3. Payment Gateway** (0%)
- [ ] GoPay account (sandbox)
- [ ] GoPay SDK installed
- [ ] POST /api/payment/gopay endpoint
- [ ] Payment session creation
- [ ] Redirect to GoPay
- [ ] POST /api/payment/gopay/webhook
- [ ] Payment success handler
- [ ] Payment failure handler

### **4. Order Management** (0%)
- [ ] Prisma installed
- [ ] prisma/schema.prisma created
- [ ] Order model defined
- [ ] Migrations run
- [ ] POST /api/orders endpoint
- [ ] GET /api/orders/:id endpoint
- [ ] PATCH /api/orders/:id endpoint
- [ ] Order number generator

### **5. Email Notifications** (0%)
- [ ] Resend account & API key
- [ ] Resend installed
- [ ] /lib/email/templates/ created
- [ ] orderConfirmation.tsx template
- [ ] orderShipped.tsx template
- [ ] Email styling (burgundy theme)
- [ ] Send email on payment success
- [ ] Error handling & retry logic

### **6. Admin Panel** (0%)
- [ ] /app/admin/layout.tsx
- [ ] /app/admin/orders/page.tsx
- [ ] /app/admin/orders/[id]/page.tsx
- [ ] Orders table component
- [ ] Filters (status, date)
- [ ] Status update dropdown
- [ ] Export to CSV
- [ ] Password protection

---

## 🐛 Blockers / Issues

(Žádné blockers zatím)

---

## 💡 Notes

- **GoPay vs Stripe:** Začneme s GoPay (preferováno pro CZ market), fallback na Stripe pokud GoPay nebude fungovat
- **Database:** Doporučuji Vercel Postgres (free tier, snadná integrace)
- **Email Testing:** Použít Resend sandbox mode pro testing
- **Admin Auth:** Zatím jen simple password protection, později NextAuth.js

---

## 📈 Session Log

### Session 1: (nezačato)
- Čas: TBD
- Dokončeno: TBD
- Blocker: N/A

### Session 2: (nezačato)
- Čas: TBD
- Dokončeno: TBD
- Blocker: N/A

---

## 🎯 Definition of Done

**CHUNK-01 bude hotový když:**

1. ✅ Uživatel může přidat produkt do košíku
2. ✅ Uživatel vidí košík s produkty a celkovou cenou
3. ✅ Uživatel může projít checkout procesem (3 kroky)
4. ✅ Uživatel může zaplatit přes GoPay (sandbox)
5. ✅ Po úspěšné platbě:
   - ✅ Objednávka se uloží do DB
   - ✅ Uživatel dostane confirmation email
   - ✅ Uživatel vidí "Thank you" stránku
6. ✅ Admin může zobrazit všechny objednávky
7. ✅ Admin může změnit status objednávky
8. ✅ Všechny komponenty mají error handling
9. ✅ Kód je TypeScript type-safe
10. ✅ Responsive design (mobile + desktop)

---

**🌍 Multilingual Processing:** Claude používá EN pro web searches a reasoning, output v CZ

**Last Updated:** 9. listopadu 2025
**Next Update:** Po dokončení Session 1
