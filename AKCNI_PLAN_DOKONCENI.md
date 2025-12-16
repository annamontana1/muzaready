# 🎯 Akční plán dokončení e-shopu

**Vytvořeno:** 16. prosince 2025
**Cíl:** Plně funkční e-shop připravený pro zákazníky

---

## 📊 SOUČASNÝ STAV

### ✅ CO FUNGUJE (80-90%)
- **Admin panel:** Objednávky, sklad, skladová správa, SKU management
- **Platby:** GoPay integrace, payment webhooks, automatické odečítání zásob při GoPay platbě
- **Email:** Shipping notification, admin notification
- **Sklady:** Automatické odečítání při platbě (GoPay + ruční označení jako zaplaceno) ✅
- **Faktury:** API hotovo, automatické generování při zaplacení ✅

### ❌ CO BLOKUJE PRODEJ
1. **Chybí customer order tracking** - zákazníci nevidí stav objednávky
2. **Chybí kompletní email workflow** - zákazníci neví, co se děje
3. **Chybí low stock email alerts** - můžeš prodávat vyprodané zboží

---

## 🔴 KRITICKÉ (BLOKUJE PRODEJ)

### 1. Customer Order Tracking Page ⚠️ NEJVYŠŠÍ PRIORITA
**Proč:** Zákazníci nemají způsob, jak sledovat své objednávky po nákupu. To vytváří zákaznickou podporu zátěž a špatnou zkušenost.

**Kde:**
- Vytvořit: `/app/sledovani-objednavky/page.tsx`
- Vytvořit: `/app/api/orders/lookup/route.ts` (už existuje, zkontrolovat)

**Čas:** 3-4 hodiny

**Kroky:**
1. **Frontend stránka** (`/app/sledovani-objednavky/page.tsx`):
   - Form s emailem + ID objednávky (nebo odkaz z emailu)
   - Zobrazení statusu objednávky (orderStatus, paymentStatus, deliveryStatus)
   - Tracking číslo + odkaz na tracking (pokud je odesláno)
   - Timeline změn statusu
   - Seznam objednaných položek

2. **API endpoint** (`/api/orders/lookup/route.ts` - už existuje):
   - Ověřit, že umožňuje lookup podle ID + email
   - Vrátit kompletní informace o objednávce

3. **Security:**
   - Vyžadovat email + orderID pro zobrazení (prevence guess attacks)
   - Rate limiting (max 5 pokusů za minutu)

4. **Email odkazy:**
   - Přidat odkazy do všech emailů: `https://muzahair.cz/sledovani-objednavky?id={orderId}&email={email}`

**Testování:**
- Vytvořit testovací objednávku
- Zkontrolovat lookup přes email
- Zkontrolovat zobrazení všech statusů

---

### 2. Email Workflow - Order Confirmation
**Proč:** Zákazníci nedostávají potvrzení o vytvoření objednávky. Funkce `sendOrderConfirmationEmail` už existuje a je volána, ale potřebujeme ověřit, že funguje správně.

**Kde:**
- `/lib/email.ts` - funkce `sendOrderConfirmationEmail` (už implementována ✅)
- `/app/api/orders/route.ts` - volá se na řádku 201 ✅

**Čas:** 1 hodina (testování + úpravy)

**Kroky:**
1. **Ověření:**
   - Zkontrolovat, že `RESEND_API_KEY` je v `.env`
   - Otestovat vytvoření objednávky a zkontrolovat, zda email přijde

2. **Vylepšení emailu:**
   - Přidat odkaz na sledování objednávky
   - Přidat platební instrukce (pro bankovní převod)

3. **Testování:**
   - Vytvořit testovací objednávku
   - Zkontrolovat, že email přijde do 1 minuty

---

### 3. Low Stock Email Alerts
**Proč:** Nemáš upozornění, když se zásoby blížíte k nule. To může vést k prodeji vyprodaného zboží.

**Kde:**
- Nový soubor: `/lib/low-stock-checker.ts`
- Nový API endpoint: `/api/cron/check-low-stock/route.ts` (pro cron job)
- Existující: `/lib/email.ts` (přidat novou funkci `sendLowStockAlertEmail`)

**Čas:** 2-3 hodiny

**Kroky:**
1. **Email funkce** (`/lib/email.ts`):
   ```typescript
   export const sendLowStockAlertEmail = async (
     lowStockSkus: Array<{sku: string, name: string, availableGrams: number}>
   ) => {
     // Email adminovi s low stock SKUs
   }
   ```

2. **Cron endpoint** (`/api/cron/check-low-stock/route.ts`):
   - Načíst všechny SKU s `availableGrams < 100` nebo `inStock = false`
   - Pokud existují low stock SKU, poslat email adminovi
   - Rate limit: max 1 email za hodinu (prevence spam)

3. **Vercel cron job:**
   - Spustit každé 4 hodiny
   - `vercel.json`:
     ```json
     {
       "crons": [{
         "path": "/api/cron/check-low-stock",
         "schedule": "0 */4 * * *"
       }]
     }
     ```

4. **Dashboard už zobrazuje low stock** ✅:
   - `/app/admin/page.tsx` už má low stock alert widget (řádky 179-219)
   - Stačí přidat email notifikace

**Testování:**
- Ručně spustit `/api/cron/check-low-stock`
- Zkontrolovat, že email přijde s low stock SKU

---

## 🟡 DŮLEŽITÉ (VYLEPŠENÍ ZKUŠENOSTI)

### 4. Payment Reminder Emails (Auto-retry)
**Proč:** Zvýší conversion rate - připomene zákazníkům, kteří nezaplatili.

**Kde:**
- Nový endpoint: `/api/cron/payment-reminders/route.ts`
- Funkce už existuje: `/lib/email.ts` - `sendPaymentReminderEmail` (řádky 499-570) ✅

**Čas:** 2 hodiny

**Kroky:**
1. **Cron endpoint**:
   - Najít objednávky `paymentStatus = 'unpaid'` AND `createdAt < 3 days ago`
   - Poslat payment reminder email
   - Mark order jako "reminded" (přidat field `reminderSentAt`)

2. **Vercel cron**:
   - Spustit 1x denně v 10:00
   - `vercel.json`:
     ```json
     {
       "crons": [{
         "path": "/api/cron/payment-reminders",
         "schedule": "0 10 * * *"
       }]
     }
     ```

3. **Email odkaz:**
   - Přidat odkaz na sledování objednávky
   - Přidat platební instrukce

**Testování:**
- Vytvořit testovací objednávku (nezaplacenou)
- Změnit `createdAt` na 3 dny zpět
- Spustit cron a zkontrolovat email

---

### 5. Auto-cancel Unpaid Orders (Cleanup)
**Proč:** Automaticky zruší nezaplacené objednávky po 7 dnech, aby se vyčistila databáze.

**Kde:**
- Nový endpoint: `/api/cron/cancel-unpaid/route.ts`

**Čas:** 1.5 hodiny

**Kroky:**
1. **Cron endpoint**:
   - Najít objednávky `paymentStatus = 'unpaid'` AND `createdAt < 7 days ago`
   - Změnit status na `orderStatus = 'cancelled'`
   - Poslat cancellation email (funkce už existuje ✅)

2. **Vercel cron**:
   - Spustit 1x denně v 02:00
   - `vercel.json`:
     ```json
     {
       "crons": [{
         "path": "/api/cron/cancel-unpaid",
         "schedule": "0 2 * * *"
       }]
     }
     ```

**Testování:**
- Vytvořit testovací objednávku
- Změnit `createdAt` na 8 dní zpět
- Spustit cron a zkontrolovat, že se zrušila

---

### 6. Shipping Integration (DPD/Česká pošta)
**Proč:** Automatizace tvorby zásilek a získání tracking čísel.

**Kde:**
- Nový modul: `/lib/shipping/dpd.ts`
- Nový modul: `/lib/shipping/ceska-posta.ts`
- Upravit: `/app/api/admin/orders/[id]/shipments/route.ts`

**Čas:** 8-10 hodin (komplexní integrace)

**Kroky:**
1. **DPD API integrace**:
   - Vytvořit zásilku přes DPD API
   - Získat tracking číslo
   - Stáhnout štítky (PDF)

2. **Česká pošta API**:
   - Vytvořit zásilku přes API
   - Získat tracking číslo

3. **Admin panel**:
   - Tlačítko "Vytvořit zásilku u dopravce"
   - Automatické vyplnění adresy
   - Stažení štítků

4. **Webhook tracking**:
   - Poslouchat DPD webhooks pro změny statusu
   - Auto-update deliveryStatus when delivered

**Poznámka:** Toto je nice-to-have, můžeš to odložit až po spuštění.

---

## 🟢 VOLITELNÉ (MŮŽEŠ POČKAT)

### 7. Advanced Analytics Dashboard
**Čas:** 6-8 hodin

**Co:**
- Grafy tržeb v čase (Chart.js / Recharts)
- Top produkty podle tržeb
- Conversion rate tracking
- Export do Excel

**Priority:** LOW - můžeš to dělat po spuštění.

---

### 8. Dark Mode
**Čas:** 2-3 hodiny

**Co:**
- Tailwind dark mode
- Toggle v admin panelu
- Uložení preference do localStorage

**Priority:** LOW

---

### 9. Bulk Operations Enhancements
**Čas:** 3-4 hodiny

**Co:**
- Bulk změna delivery method
- Bulk print labels
- Bulk export invoices

**Priority:** LOW

---

## 📊 CELKOVÝ ODHAD

### Kritické (musí být hotovo před spuštěním):
1. Customer Order Tracking: **4 hodiny**
2. Email Order Confirmation (testování): **1 hodina**
3. Low Stock Email Alerts: **3 hodiny**

**Kritické celkem: 8 hodin (1 pracovní den)**

---

### Důležité (doporučujeme před spuštěním):
4. Payment Reminder Emails: **2 hodiny**
5. Auto-cancel Unpaid Orders: **1.5 hodiny**

**Důležité celkem: 3.5 hodiny**

---

### Nice-to-have (po spuštění):
6. Shipping Integration: **10 hodin**
7. Advanced Analytics: **8 hodin**
8. Dark Mode: **3 hodiny**
9. Bulk Operations: **4 hodiny**

**Nice-to-have celkem: 25 hodin**

---

## 🚀 DOPORUČENÉ POŘADÍ

### DEN 1 (8 hodin) - KRITICKÉ
**Ráno (4h):**
1. ✅ **Customer Order Tracking Page** (4h)
   - Frontend stránka `/sledovani-objednavky`
   - API endpoint `/api/orders/lookup` (ověřit)
   - Přidat odkazy do všech emailů

**Odpoledne (4h):**
2. ✅ **Email Order Confirmation Testing** (1h)
   - Otestovat, že funguje
   - Přidat odkaz na tracking

3. ✅ **Low Stock Email Alerts** (3h)
   - Email funkce
   - Cron endpoint
   - Vercel cron setup

**Po DNI 1: E-shop je PLNĚ FUNKČNÍ pro zákazníky** ✅

---

### DEN 2 (3.5 hodin) - DŮLEŽITÉ
**Ráno (3.5h):**
4. ✅ **Payment Reminder Emails** (2h)
   - Cron endpoint
   - Vercel cron setup

5. ✅ **Auto-cancel Unpaid Orders** (1.5h)
   - Cron endpoint
   - Vercel cron setup

**Po DNI 2: E-shop je PROFESIONÁLNÍ** ✅

---

### TÝDEN 2+ - NICE-TO-HAVE
- Shipping integration (10h)
- Advanced analytics (8h)
- Dark mode (3h)
- Bulk operations (4h)

---

## ✅ CHECKLIST PŘED SPUŠTĚNÍM

### Musí fungovat:
- [ ] Customer order tracking stránka
- [ ] Order confirmation email (otestovat)
- [ ] Payment confirmation email (otestovat)
- [ ] Shipping notification email (otestovat)
- [ ] Delivery confirmation email (otestovat)
- [ ] Cancellation email (otestovat)
- [ ] Low stock alerts (email adminovi)
- [ ] Automatické odečítání zásob při platbě (GoPay + ruční) ✅
- [ ] Stock validation při checkoutu ✅
- [ ] Automatické generování faktur ✅
- [ ] Refund handling (vrácení zásob) ✅

### Nice-to-have (můžeš dokončit později):
- [ ] Payment reminder emails (auto)
- [ ] Auto-cancel unpaid orders (auto)
- [ ] Shipping integration (DPD/Česká pošta)
- [ ] Advanced analytics dashboard

---

## 🎯 ZÁVĚR

**Minimální viable completion: 8 hodin (1 den)**

Po dokončení KRITICKÝCH úkolů (8 hodin) budeš mít **plně funkční e-shop** připravený pro zákazníky:
- ✅ Zákazníci mohou sledovat objednávky
- ✅ Dostávají email po každé změně statusu
- ✅ Admin dostává upozornění na low stock
- ✅ Zásoby se automaticky odečítají
- ✅ Faktury se automaticky generují

**Doporučujeme dokončit i DŮLEŽITÉ úkoly (+3.5h) pro lepší zákaznickou zkušenost.**

**NICE-TO-HAVE (25h) můžeš dělat postupně po spuštění.**

---

**Další kroky:**
1. Začni s **Customer Order Tracking** (nejvyšší priorita)
2. Pak **Email testing** (rychlé)
3. Pak **Low Stock Alerts** (prevence problémů)
4. Otestuj celý workflow end-to-end
5. **SPUSŤ E-SHOP!** 🚀

---

**Poznámky k implementaci:**
- Všechny email funkce už existují v `/lib/email.ts` ✅
- Stock management už funguje (auto-deduct při platbě) ✅
- Invoice generation už funguje ✅
- Stačí doprogramovat customer-facing features a cron jobs

**Hodně štěstí! 💪**
