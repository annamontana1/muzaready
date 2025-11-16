# Múza Hair E-Shop - Cart System Refactor & Project Status

## ✅ COMPLETED (Foundation Phase)

### Cart System Architecture Rebuilt
1. **Created new SKU-based cart types** (`/types/cart.ts`)
   - Unified interface: `SkuCartItem` for all cart operations
   - Proper TypeScript types for inventory, assembly fees, pricing

2. **Implemented new SkuCartContext** (`/contexts/SkuCartContext.tsx`)
   - Modern React Context with localStorage persistence
   - Methods: `addToCart`, `removeFromCart`, `updateQuantity`, `updateGrams`, `clearCart`
   - Price calculations: `getTotalPrice`, `getTotalWithShipping`
   - Version control for storage migration

3. **Updated App Infrastructure**
   - `/app/layout.tsx`: Switched from `CartProvider` → `SkuCartProvider`
   - `/hooks/useCart.ts`: Now exports from new SkuCartContext with backward compatibility
   - All hooks and components will use new unified cart system

## 🔨 REMAINING CRITICAL WORK (Estimated 35-40 hours)

### Priority 1: Cart Pages Migration (6-8 hours)
**Files to update:**
- `/app/kosik/page.tsx` - Shopping cart display
- `/app/pokladna/page.tsx` - Checkout form
- `/components/Header.tsx` - Cart icon logic

**Changes needed:**
- Remove Product/ProductVariant references
- Update to use `SkuCartItem` structure
- Fix item display (skuName, grams, pricePerGram)
- Ensure assembly fee display works correctly
- Test shipping threshold logic

### Priority 2: Payment Gateway Integration (12-16 hours)
**Current state:** GoPay integration is TODO placeholder
**Must implement:**
- [ ] GoPay API integration (`/api/gopay/create-payment`)
- [ ] Payment redirect flow
- [ ] Webhook handling for payment confirmation
- [ ] Order status update after payment
- [ ] Error handling and retry logic
- [ ] Test with sandbox/production GoPay account

**Alternative:** Stripe integration (slightly easier but different API)

### Priority 3: CatalogCard Direct Add-to-Cart (4-6 hours)
**File:** `/components/CatalogCard.tsx`
**Current:** Button redirects to detail page
**Must implement:**
- Direct add-to-cart for BULK items (default 100g)
- Modal/drawer for quantity selection
- Assembly fee calculation before add
- Stock validation
- Success/error feedback

### Priority 4: Order Fulfillment Workflow (8-10 hours)
**Implement:**
- [ ] Order status pipeline (pending → paid → processing → shipped → delivered)
- [ ] Admin order management page improvements
- [ ] Customer order tracking page (`/app/orders/[orderId]`)
- [ ] Email notifications at each stage
- [ ] Shipping label generation integration
- [ ] Inventory deduction on payment confirmation

### Priority 5: Modern Design & UI (6-8 hours)
**Updates needed:**
- Review Tailwind colors/spacing consistency
- Improve form styling (checkout, product config)
- Mobile responsiveness audit
- Dark mode support (optional but nice)
- Loading states and animations

### Priority 6: Error Handling & Validation (4-5 hours)
**Add throughout:**
- Form validation (email, phone, address)
- API error handling with user-friendly messages
- Try-catch blocks with proper logging
- Cart data validation before checkout
- Stock availability validation at checkout time

## 📋 TESTING CHECKLIST (8-10 hours)

### Functional Tests
- [ ] Add SKU to cart → verify items list
- [ ] Update quantities → check price recalculation
- [ ] Remove item → verify list updates
- [ ] Clear cart → empty state displays
- [ ] Cart persists on page refresh
- [ ] Checkout flow end-to-end
- [ ] Payment success/failure handling

### Edge Cases
- [ ] Add expired/unavailable SKU
- [ ] Exceed stock availability
- [ ] Decimal prices (CZK vs EUR)
- [ ] Assembly fee calculations (all types)
- [ ] Very large orders (performance)
- [ ] Cart data corruption (recovery)

### Browser & Device
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (iOS Safari, Android Chrome)
- [ ] Slow network conditions
- [ ] Offline behavior

## 🎯 ESTIMATED TIMELINE

**Phase 1 (Days 1-2):** Cart pages migration + payments setup
**Phase 2 (Days 3-4):** CatalogCard + order workflow
**Phase 3 (Days 5-6):** Design polish + error handling
**Phase 4 (Days 7-8):** Comprehensive testing + bug fixes

**Total:** 8-10 working days to production-ready

## 🔑 KEY DECISIONS MADE

1. **SKU-First Approach:** All cart operations now use SKU IDs, eliminating Product/Variant confusion
2. **localStorage Persistence:** Modern approach, no server-side session needed yet
3. **Backward Compatibility:** Old hooks still work but point to new implementation
4. **Assembly Fee Handling:** Calculated at add-time, not checkout (fixes rounding issues)

## 📝 MIGRATION NOTES

### Breaking Changes (None for users)
- Cart structure changed internally but users' carts auto-migrate via version control

### For Developers
- Don't use `useContext(CartContext)` directly - use `useCart()` hook instead
- Always pass `Omit<SkuCartItem, 'addedAt'>` to `addToCart()`
- Access `item.grams` for BULK items, not `item.quantity`

## ⚠️ KNOWN RISKS

1. **Payment Integration Complexity:** GoPay has Czech-specific quirks, may need support docs
2. **Assembly Fee Edge Cases:** PER_GRAM fees with very small quantities may round strangely
3. **Inventory Sync:** Current system doesn't prevent overselling (add to cart step)
4. **Email Delivery:** Resend API integration working but untested at scale

## 🚀 POST-LAUNCH IMPROVEMENTS (Phase 2)

- [ ] Analytics integration (Mixpanel/Plausible)
- [ ] Abandoned cart recovery
- [ ] Wishlist/save for later
- [ ] Gift cards
- [ ] Subscription orders
- [ ] API for wholesale partners
- [ ] Admin dashboard redesign
- [ ] Performance optimization (Lighthouse 90+)

---

**Status:** Foundation complete ✅
**Next Action:** Migrate `/app/kosik/page.tsx` to new cart structure
**Owner:** [Development team]
**Last Updated:** November 16, 2024
