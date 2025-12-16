# 🚚 DOPRAVA - Kompletní přehled (Zásilkovna, GLS, DPD)

**Datum:** 2025-12-16  
**Status:** 75% hotovo

---

## ✅ CO UŽ FUNGUJE (DOST TOHO!)

### 1. **Základní infrastruktura** ✅
- Order model má `trackingNumber` pole
- Order má `deliveryStatus` (pending, shipped, delivered)
- Order má `deliveryMethod` (standard, express, pickup)

### 2. **Admin UI** ✅
- **CreateShipmentModal** - kompletní formulář pro vytvoření zásilky
- Můžeš vybrat dopravce:
  - ✅ Zásilkovna
  - ✅ GLS
  - ✅ DPD
  - ✅ FedEx
  - ✅ UPS
  - ✅ Jiný dopravce
- Můžeš zadat tracking číslo
- Můžeš vybrat položky k odeslání
- Validace formuláře funguje

### 3. **API endpoint** ✅
**`/api/admin/orders/[id]/shipments`**
- Přijímá: carrier, trackingNumber, items, notes
- Validuje: že carrier je validní
- Ukládá: tracking number do DB
- Aktualizuje: `deliveryStatus = 'shipped'`
- Nastavuje: `shippedAt = now()`

### 4. **Tracking stránka pro zákazníky** ✅
**`/app/sledovani-objednavky/page.tsx`**
- Zákazník zadá: email + order ID
- Zobrazí: status objednávky, tracking number

### 5. **Shipment history v admin** ✅
- Zobrazuje tracking číslo
- Datum odeslání
- Status doručení

---

## ❌ CO CHYBÍ (A JE TO PROBLÉM!)

### 🔴 PROBLÉM #1: Carrier se neukládá do DB!
**Co se děje:**
1. Admin vybere "GLS" v modalu ✅
2. API endpoint to přijme ✅
3. **Carrier se NEULOŽÍ do databáze!** ❌
4. Uloží se jen tracking číslo ✅

**Proč je to problém:**
- Když zákazník klikne na tracking link, nevíš který dopravce to je
- Všechny linky vedou na Českou poštu (hardcoded)
- Nemůžeš generovat správné tracking URL

**Kde je problém:**
```typescript
// schema.prisma - CHYBÍ carrier field!
model Order {
  trackingNumber String?  // ✅ existuje
  // carrier String?       // ❌ CHYBÍ!!!
}
```

---

### 🔴 PROBLÉM #2: Tracking linky jsou špatně!

**Aktuální stav:**
```typescript
// app/sledovani-objednavky/page.tsx (řádek ~150)
{order.trackingNumber && (
  <a href={`https://www.postaonline.cz/trackandtrace?parcelNumbers=${order.trackingNumber}`}>
    {order.trackingNumber}
  </a>
)}
```

**Problém:**
- VŠECHNY tracking linky jdou na Českou poštu
- I když je zásilka GLS, Zásilkovna, DPD...
- Link je nepoužitelný

**Co by mělo být:**
```typescript
// Správný link podle dopravce:
GLS: https://gls-group.eu/CZ/cs/sledovani-zasilek?match=${trackingNumber}
Zásilkovna: https://tracking.packeta.com/cs/?id=${trackingNumber}
DPD: https://tracking.dpd.de/parcelstatus?query=${trackingNumber}
```

---

### 🔴 PROBLÉM #3: Žádná automatizace

**Co NENÍ:**
- ❌ Automatické vytvoření zásilky u dopravce přes API
- ❌ Automatické získání tracking čísla
- ❌ Automatický tisk štítků
- ❌ Real-time tracking status
- ❌ Notifikace o změně statusu

**Co TO ZNAMENÁ:**
Admin musí:
1. Vytvořit zásilku ručně na webu GLS/Zásilkovna
2. Zkopírovat tracking číslo
3. Vložit ho do admin panelu
4. Manually poslat email zákazníkovi

---

## 🔧 ŘEŠENÍ - 2 VARIANTY

### ⚡ Varianta A: Rychlé řešení (3-4 hodiny)

**Co to opraví:**
- ✅ Carrier se uloží do DB
- ✅ Tracking linky budou fungovat správně
- ✅ Zákazník klikne a dostane se na správný tracking
- ❌ Stále musíš ručně vytvářet zásilky

**Implementace:**

#### 1. Přidej carrier do DB (30 min)
```prisma
// prisma/schema.prisma
model Order {
  // ...existující fieldy...
  trackingNumber String?
  carrier        String?  // NEW: "zasilkovna", "gls", "dpd", "ceska_posta", "other"
}
```

```bash
# Migrace
npx prisma migrate dev --name add_carrier_to_order
```

#### 2. Updatuj API endpoint (15 min)
```typescript
// app/api/admin/orders/[id]/shipments/route.ts
await prisma.order.update({
  where: { id: orderId },
  data: {
    trackingNumber,
    carrier,  // ← PŘIDEJ TOHLE
    deliveryStatus: 'shipped',
    shippedAt: new Date(),
  },
});
```

#### 3. Vytvoř tracking helper (1h)
```typescript
// lib/shipping.ts
export function getTrackingUrl(carrier: string, trackingNumber: string): string {
  const urls = {
    zasilkovna: `https://tracking.packeta.com/cs/?id=${trackingNumber}`,
    gls: `https://gls-group.eu/CZ/cs/sledovani-zasilek?match=${trackingNumber}`,
    dpd: `https://tracking.dpd.de/parcelstatus?query=${trackingNumber}`,
    ceska_posta: `https://www.postaonline.cz/trackandtrace?parcelNumbers=${trackingNumber}`,
    ups: `https://www.ups.com/track?trackingNumber=${trackingNumber}`,
    fedex: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
  };
  
  return urls[carrier] || urls.ceska_posta;
}
```

#### 4. Updatuj tracking stránku (30 min)
```typescript
// app/sledovani-objednavky/page.tsx
import { getTrackingUrl } from '@/lib/shipping';

// V JSX:
{order.trackingNumber && (
  <a href={getTrackingUrl(order.carrier || 'ceska_posta', order.trackingNumber)}>
    Sledovat zásilku
  </a>
)}
```

#### 5. Updatuj email template (30 min)
```typescript
// lib/email.ts - sendShippingNotificationEmail
const trackingUrl = order.carrier 
  ? getTrackingUrl(order.carrier, trackingInfo)
  : `https://www.postaonline.cz/trackandtrace?parcelNumbers=${trackingInfo}`;

// V HTML emailu:
<a href="${trackingUrl}">Sledovat zásilku</a>
```

**CELKEM: 3-4 hodiny**  
**NÁKLADY: 0 Kč/měsíc**  
**VÝSLEDEK: Tracking linky fungují správně!** ✅

---

### 🚀 Varianta B: Full API integrace (28-32 hodin)

**Co to přidá:**
- ✅ Automatické vytvoření zásilky (klikneš "Odeslat" → zásilka se vytvoří)
- ✅ Automatické tracking číslo (nemusíš kopírovat)
- ✅ Automatický tisk štítků (PDF ke stažení)
- ✅ Real-time tracking status
- ✅ Automatické notifikace zákazníka

**Jak to funguje:**
Použiješ **Balíkobot.cz** (multi-carrier agregátor)

**Balíkobot API:**
- Jeden API klíč pro všechny dopravce
- Podporuje: Zásilkovnu, GLS, DPD, PPL, Českou poštu, atd.
- Měsíční cena: 500-1500 Kč (podle objemu)

**Implementace:**
1. Registrace na Balíkobot (1h)
2. Nastavení dopravců (2h)
3. API integrace (10-12h)
4. Admin UI update (5-6h)
5. Testing (8-10h)

**CELKEM: 28-32 hodin**  
**NÁKLADY: 500-1500 Kč/měsíc**

---

### 🚀 Varianta C: Přímé API každého dopravce (70-80h)

**Nejvíc práce, žádné měsíční náklady.**

Musíš integrovat každého dopravce zvlášť:
- Zásilkovna API (15-20h)
- GLS API (15-20h)
- DPD API (15-20h)
- Česká pošta API (15-20h)

**CELKEM: 70-80 hodin**  
**NÁKLADY: 0 Kč/měsíc**

---

## 🎯 DOPORUČENÍ

### Pro START (1-50 objednávek/den):
→ **Varianta A** (3-4h práce, 0 Kč)
- Tracking linky budou fungovat
- Stále ruční vytváření zásilek
- Ale to je OK pro začátek

### Pro RŮST (50-200 objednávek/den):
→ **Varianta B** (28-32h, 500-1500 Kč/měsíc)
- Automatizace šetří čas
- Balíkobot je osvědčené řešení

### Pro MASIV (200+ objednávek/den):
→ **Varianta C** (70-80h, 0 Kč)
- Full control
- Žádné měsíční poplatky
- Ale hodně práce

---

## 📋 ACTION PLAN

### TEĎKA (3-4h):
1. [ ] Přidej `carrier` field do Order modelu (30 min)
2. [ ] Updatuj API endpoint (15 min)
3. [ ] Vytvoř `/lib/shipping.ts` helper (1h)
4. [ ] Updatuj tracking stránku (30 min)
5. [ ] Updatuj email template (30 min)
6. [ ] Test end-to-end (30 min)

### POZDĚJI (když budeš mít více objednávek):
- Zvaž Balíkobot integraci
- Nebo najmi vývojáře na přímé API integrace

---

## 💡 SHRNUTÍ

**MÁTE:**
- ✅ 75% hotovo (UI, API, tracking stránka)
- ✅ Základní funkcionalita funguje

**CHYBÍ:**
- ❌ Carrier field v DB (30 min fix)
- ❌ Správné tracking URL (2h fix)
- ❌ Automatizace (volitelné, 28-80h)

**DOPORUČENÍ:**
→ Začni s Variantou A (3-4h)
→ Až budeš mít 50+ objednávek/den, přejdi na Variantu B

**PO 4 HODINÁCH:**
Tracking linky budou fungovat správně! ✅

---

**Chceš, abych ti Variantu A implementoval TEĎKA?** 🚀
