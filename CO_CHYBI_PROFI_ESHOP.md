# 🎯 Co chybí k profesionálnímu e-shopu - Kompletní analýza

**Datum:** 8. ledna 2025  
**Cíl:** Plně funkční e-shop se skladem a objednávkami

---

## ✅ CO JE HOTOVO (80-90%)

### 📦 Admin Panel - Objednávky (95% ✅)
- ✅ Seznam objednávek s filtry, paginací, sortingem
- ✅ Detail objednávky (Customer, Items, Payment, Shipments, Metadata)
- ✅ Editace objednávky
- ✅ Bulk akce (označit více jako zaplaceno/odesláno)
- ✅ CSV export
- ✅ Status management (paid, shipped, delivered)
- ✅ Payment capture modal
- ✅ Shipment creation modal
- ✅ Tlačítka pro rychlé akce (zaplaceno, odesláno, doručeno, nezaplaceno)

### 🏭 Skladová správa (85% ✅)
- ✅ SKU management (`/admin/sklad`)
- ✅ Warehouse Scanner (`/admin/warehouse-scanner`)
- ✅ Stock movements tracking (IN/OUT/ADJUST)
- ✅ Price Matrix (`/admin/price-matrix`)
- ✅ SKU Konfigurátor (`/admin/konfigurator-sku`)
- ✅ Automatické odečítání zásob při GoPay platbě
- ✅ Automatické odečítání zásob při scan order

### 💰 Platební systém (90% ✅)
- ✅ GoPay integrace
- ✅ Payment webhook handling
- ✅ Payment capture v admin panelu
- ✅ Bankovní převod podpora
- ✅ Hotovost podpora (POS)

### 📧 Email notifikace (60% ⚠️)
- ✅ Shipping notification (když se pošle)
- ✅ Admin notification (nová objednávka)
- ⚠️ Částečně: Order confirmation (možná chybí)
- ❌ Payment confirmation email
- ❌ Delivery confirmation email
- ❌ Order cancellation email

---

## ❌ CO CHYBÍ (Kritické funkce)

### 🔴 KRITICKÉ (Musí být hotovo)

#### 1. Automatické odečítání zásob při ručním označení jako zaplaceno
**Status:** ❌ CHYBÍ  
**Problém:** Když admin ručně označí objednávku jako zaplaceno, zásoby se neodečtou  
**Kde:** `/api/admin/orders/[id]/route.ts` - PUT metoda  
**Co chybí:**
```typescript
// Po změně paymentStatus na 'paid':
// 1. Odečíst zásoby z každého OrderItem
// 2. Vytvořit StockMovement záznamy
// 3. Aktualizovat SKU availableGrams
// 4. Aktualizovat SKU inStock flag
```

**Dopad:** Můžeš prodávat zboží, které už není na skladě

---

#### 2. Low Stock Alerts / Varování
**Status:** ❌ CHYBÍ  
**Co chybí:**
- Dashboard varování když `availableGrams < threshold`
- Email notifikace adminovi při low stock
- Automatické skrytí produktů když `inStock = false`
- Bulk operace pro low stock SKU

**Dopad:** Můžeš prodávat zboží, které už není na skladě

---

#### 3. Stock Validation při Checkout
**Status:** ⚠️ ČÁSTEČNĚ  
**Co chybí:**
- Validace dostupnosti zásob před vytvořením objednávky
- Rezervace zásob při přidání do košíku (volitelné)
- Kontrola při checkoutu - zda je ještě zboží dostupné
- Informování zákazníka, pokud zboží není dostupné

**Dopad:** Zákazník může vytvořit objednávku na zboží, které není na skladě

---

#### 4. Email Notifikace - Kompletní workflow
**Status:** ⚠️ ČÁSTEČNĚ (60%)  
**Co chybí:**
- ❌ Order confirmation email (po vytvoření objednávky)
- ❌ Payment confirmation email (po zaplacení)
- ✅ Shipping notification (funguje)
- ❌ Delivery confirmation email (po doručení)
- ❌ Order cancellation email (po zrušení)
- ❌ Payment reminder email (pro nezaplacené objednávky)

**Dopad:** Zákazníci nevědí, co se děje s jejich objednávkou

---

#### 5. Customer Order Tracking Page
**Status:** ❌ CHYBÍ  
**Co chybí:**
- Stránka `/app/orders/[orderId]` pro zákazníky
- Zobrazení statusu objednávky
- Tracking číslo a odkaz na tracking
- Historie změn statusu
- Možnost stornovat objednávku (pokud ještě není odeslána)

**Dopad:** Zákazníci nemohou sledovat své objednávky

---

#### 6. Refund / Vrácení peněz
**Status:** ❌ CHYBÍ  
**Co chybí:**
- Možnost označit objednávku jako refunded
- Vrácení zásob na sklad při refundu
- Email notifikace o refundu
- Tracking refundu v admin panelu

**Dopad:** Nemůžeš správně zpracovat vrácení peněz

---

### 🟡 DŮLEŽITÉ (Mělo by být hotovo)

#### 7. Fakturace
**Status:** ⚠️ ČÁSTEČNĚ  
**Co je hotovo:**
- ✅ Invoice generation API (`/api/invoices/generate`)
- ✅ Invoice download (`/api/invoices/[id]/download`)

**Co chybí:**
- ❌ Automatické vytvoření faktury při zaplacení
- ❌ Faktura v emailu zákazníkovi
- ❌ Faktura v admin panelu (zobrazení, stáhnutí)
- ❌ Číslování faktur
- ❌ Export faktur do účetního systému

---

#### 8. Integrace s dopravci
**Status:** ❌ CHYBÍ  
**Co chybí:**
- Automatické vytvoření zásilky u dopravce (DPD, Česká pošta)
- Automatické získání tracking čísla
- Sledování zásilky (tracking status)
- Tisk štítků

**Dopad:** Musíš ručně vytvářet zásilky u dopravce

---

#### 9. Audit Log / Historie změn
**Status:** ❌ CHYBÍ  
**Co chybí:**
- Záznam všech změn objednávky (kdo, kdy, co změnil)
- Timeline změn v detailu objednávky
- Historie platebních změn
- Historie změn zásob

**Dopad:** Nemůžeš zjistit, kdo a kdy změnil objednávku

---

#### 10. Pokročilé statistiky a reporty
**Status:** ⚠️ ZÁKLADNÍ  
**Co je hotovo:**
- ✅ Základní dashboard statistiky

**Co chybí:**
- ❌ Grafy (tržby v čase, nejprodávanější produkty)
- ❌ Reporty (měsíční, roční)
- ❌ Export statistik do Excel/PDF
- ❌ Analýza zákazníků (nejlepší zákazníci, opakované nákupy)

---

#### 11. Automatické workflow
**Status:** ❌ CHYBÍ  
**Co chybí:**
- Automatické označení jako "processing" po zaplacení
- Automatické označení jako "completed" po doručení
- Automatické poslání reminder emailu pro nezaplacené objednávky (po 3 dnech)
- Automatické zrušení nezaplacených objednávek (po 7 dnech)

---

### 🟢 NICE-TO-HAVE (Vylepšení)

#### 12. Pokročilé funkce
- ❌ Dark mode
- ❌ Ukládání filtrů do URL
- ❌ Ukládání preferencí uživatele
- ❌ Drag & drop pro změnu pořadí
- ❌ Keyboard shortcuts (více)
- ❌ Bulk edit více objednávek najednou

#### 13. Export a tisk
- ✅ CSV export (hotovo)
- ❌ Excel export
- ❌ PDF export objednávky
- ❌ Tisk objednávky
- ❌ Tisk packing slip

#### 14. Integrace
- ❌ Webhook notifikace pro externí systémy
- ❌ API dokumentace (Swagger/OpenAPI)
- ❌ Integrace s účetním systémem (MoneyS3, Pohoda)

---

## 📊 PRIORITIZACE

### 🔴 KRITICKÉ (Musí být hotovo hned)
1. **Automatické odečítání zásob při ručním označení jako zaplaceno** (2-3h)
2. **Stock validation při checkoutu** (2-3h)
3. **Low stock alerts** (2-3h)
4. **Email notifikace - kompletní workflow** (4-5h)
5. **Customer order tracking page** (3-4h)

**Celkem:** ~13-18 hodin práce

---

### 🟡 DŮLEŽITÉ (Mělo by být hotovo brzy)
6. **Refund handling** (3-4h)
7. **Fakturace - automatické vytvoření** (2-3h)
8. **Audit log** (3-4h)
9. **Automatické workflow** (2-3h)

**Celkem:** ~10-14 hodin práce

---

### 🟢 NICE-TO-HAVE (Může počkat)
10. Integrace s dopravci (8-10h)
11. Pokročilé statistiky (6-8h)
12. Export a tisk (4-6h)
13. Pokročilé funkce (4-6h)

**Celkem:** ~22-30 hodin práce

---

## 🎯 DOPORUČENÝ PLÁN

### Fáze 1: Kritické opravy (1-2 týdny)
1. ✅ Automatické odečítání zásob při ručním označení jako zaplaceno
2. ✅ Stock validation při checkoutu
3. ✅ Low stock alerts
4. ✅ Email notifikace - kompletní workflow
5. ✅ Customer order tracking page

**Výsledek:** E-shop je funkční a bezpečný

---

### Fáze 2: Důležité funkce (1-2 týdny)
6. ✅ Refund handling
7. ✅ Fakturace - automatické vytvoření
8. ✅ Audit log
9. ✅ Automatické workflow

**Výsledek:** E-shop je profesionální a kompletní

---

### Fáze 3: Vylepšení (podle potřeby)
10. Integrace s dopravci
11. Pokročilé statistiky
12. Export a tisk
13. Pokročilé funkce

**Výsledek:** E-shop je prémiový

---

## 📋 DETAILNÍ CHECKLIST

### Sklad a zásoby
- [ ] Automatické odečítání zásob při ručním označení jako zaplaceno
- [ ] Stock validation při checkoutu
- [ ] Rezervace zásob při přidání do košíku (volitelné)
- [ ] Low stock alerts (dashboard + email)
- [ ] Automatické skrytí produktů když není na skladě
- [ ] Vrácení zásob na sklad při refundu
- [ ] Vrácení zásob na sklad při zrušení objednávky

### Objednávky
- [ ] Customer order tracking page (`/app/orders/[orderId]`)
- [ ] Refund handling (označit jako refunded, vrátit zásoby)
- [ ] Automatické workflow (pending → paid → processing → shipped → completed)
- [ ] Audit log (historie změn)
- [ ] Bulk edit více objednávek najednou

### Email notifikace
- [ ] Order confirmation email (po vytvoření)
- [ ] Payment confirmation email (po zaplacení)
- [ ] Delivery confirmation email (po doručení)
- [ ] Order cancellation email (po zrušení)
- [ ] Payment reminder email (pro nezaplacené po 3 dnech)

### Fakturace
- [ ] Automatické vytvoření faktury při zaplacení
- [ ] Faktura v emailu zákazníkovi
- [ ] Faktura v admin panelu (zobrazení, stáhnutí)
- [ ] Číslování faktur
- [ ] Export faktur do účetního systému

### Integrace
- [ ] Integrace s dopravci (DPD, Česká pošta)
- [ ] Automatické vytvoření zásilky
- [ ] Automatické získání tracking čísla
- [ ] Webhook notifikace

### Reporty a statistiky
- [ ] Grafy (tržby v čase)
- [ ] Reporty (měsíční, roční)
- [ ] Export statistik do Excel/PDF
- [ ] Analýza zákazníků

---

## 🚀 RYCHLÝ START - Co udělat hned

### 1. Automatické odečítání zásob (NEJVYŠŠÍ PRIORITA)
**Soubor:** `app/api/admin/orders/[id]/route.ts`  
**Co udělat:**
- Po změně `paymentStatus` na `paid` odečíst zásoby
- Vytvořit `StockMovement` záznamy
- Aktualizovat `SKU.availableGrams` a `SKU.inStock`

### 2. Stock Validation při Checkoutu
**Soubor:** `app/api/orders/route.ts`  
**Co udělat:**
- Před vytvořením objednávky zkontrolovat dostupnost zásob
- Vrátit chybu, pokud zboží není dostupné

### 3. Low Stock Alerts
**Soubor:** `app/admin/page.tsx` (dashboard)  
**Co udělat:**
- Zobrazit varování když `availableGrams < threshold`
- Email notifikace adminovi

---

**TL;DR:**  
**Kritické:** Automatické odečítání zásob, stock validation, low stock alerts, email notifikace, customer tracking  
**Důležité:** Refund, fakturace, audit log, automatické workflow  
**Nice-to-have:** Integrace s dopravci, pokročilé statistiky, export

**Odhadovaný čas:** 13-18h pro kritické, 10-14h pro důležité, 22-30h pro nice-to-have

