# 🏭 Co je potřeba dodělat ve skladové správě

**Datum:** 8. ledna 2025  
**Aktuální stav:** 75% hotovo ⚠️

---

## ✅ CO JE HOTOVO (75%)

### Základní funkce ✅
- ✅ **SKU Management** (`/admin/sklad`) - vytváření, editace, zobrazení SKU
- ✅ **Warehouse Scanner** (`/admin/warehouse-scanner`) - skenování QR kódů
- ✅ **Stock Movements Tracking** - záznam všech pohybů zásob (IN/OUT/ADJUST)
- ✅ **Price Matrix** (`/admin/price-matrix`) - správa cen
- ✅ **SKU Konfigurátor** (`/admin/konfigurator-sku`) - vytváření SKU

### Automatické odečítání zásob ✅
- ✅ **GoPay platba** - automatické odečítání při GoPay webhooku (`/api/gopay/notify/route.ts`)
- ✅ **Scan order** - automatické odečítání při vytvoření objednávky ze scanneru (`/api/admin/scan-orders/route.ts`)

### Manuální správa ✅
- ✅ **Manuální stock movements** (`/api/admin/stock/route.ts`) - přidání/odebrání/korekce zásob

---

## ❌ CO CHYBÍ (25% - KRITICKÉ)

### 🔴 1. Automatické odečítání zásob při ručním označení jako zaplaceno

**Status:** ❌ CHYBÍ - KRITICKÉ  
**Kde:** `/app/api/admin/orders/[id]/route.ts` - PUT metoda  
**Problém:** Když admin ručně označí objednávku jako zaplaceno, zásoby se neodečtou

**Co se děje teď:**
```typescript
// app/api/admin/orders/[id]/route.ts - řádek 190
const order = await prisma.order.update({
  where: { id },
  data: updateData, // Jen aktualizuje paymentStatus, ale neodečte zásoby!
  include: { items: true },
});
```

**Co chybí:**
```typescript
// Po změně paymentStatus na 'paid':
// 1. Odečíst zásoby z každého OrderItem
// 2. Vytvořit StockMovement záznamy
// 3. Aktualizovat SKU availableGrams
// 4. Aktualizovat SKU inStock flag
```

**Dopad:** Můžeš prodávat zboží, které už není na skladě

**Řešení:** Přidat stejnou logiku jako v `/api/gopay/notify/route.ts` (řádky 130-176)

**Čas:** 2-3h

---

### 🔴 2. Stock Validation při Checkoutu

**Status:** ❌ CHYBÍ - KRITICKÉ  
**Kde:** `/app/api/orders/route.ts` - POST metoda  
**Problém:** Před vytvořením objednávky se nekontroluje dostupnost zásob

**Co se děje teď:**
```typescript
// app/api/orders/route.ts - řádek 104
const quote = await quoteCartLines(cartLines);
// quoteCartLines kontroluje jen ceny, ne dostupnost zásob!
```

**Co chybí:**
```typescript
// Před vytvořením objednávky:
// 1. Zkontrolovat, zda je každý SKU dostupný (inStock = true)
// 2. Zkontrolovat, zda je dostatek gramů (availableGrams >= požadované gramy)
// 3. Vrátit chybu, pokud zboží není dostupné
// 4. Informovat zákazníka, které zboží není dostupné
```

**Dopad:** Zákazník může vytvořit objednávku na zboží, které není na skladě

**Řešení:** Přidat validaci do `quoteCartLines` nebo před vytvořením objednávky

**Čas:** 2-3h

---

### 🔴 3. Low Stock Alerts / Varování

**Status:** ❌ CHYBÍ - KRITICKÉ  
**Kde:** `/app/admin/page.tsx` (dashboard)  
**Problém:** Chybí varování, když je málo zásob

**Co chybí:**
- ❌ Dashboard varování když `availableGrams < threshold` (např. < 100g)
- ❌ Email notifikace adminovi při low stock
- ❌ Seznam SKU s low stock na dashboardu
- ❌ Bulk operace pro low stock SKU (např. "Objednat více")

**Dopad:** Můžeš prodávat zboží, které už není na skladě

**Řešení:**
1. Přidat sekci "Low Stock" na dashboard (`/app/admin/page.tsx`)
2. Zobrazit SKU kde `availableGrams < threshold` nebo `inStock = false`
3. Přidat email notifikaci (volitelné)

**Čas:** 2-3h

---

### 🟡 4. Automatické skrytí produktů když není na skladě

**Status:** ❌ CHYBÍ  
**Kde:** Katalog (`/app/katalog/...`)  
**Problém:** Produkty se zobrazují i když není na skladě

**Co chybí:**
- ❌ Automatické skrytí produktů když `inStock = false`
- ❌ Nebo zobrazení "Vyprodáno" místo "Přidat do košíku"
- ❌ Filtrování podle dostupnosti v katalogu

**Dopad:** Zákazník vidí produkty, které nemůže koupit

**Řešení:** Přidat kontrolu `inStock` při zobrazování produktů v katalogu

**Čas:** 1-2h

---

### 🟡 5. Vrácení zásob při Refundu

**Status:** ❌ CHYBÍ  
**Kde:** `/app/api/admin/orders/[id]/route.ts` - PUT metoda  
**Problém:** Když se objednávka označí jako refunded, zásoby se nevrátí na sklad

**Co chybí:**
```typescript
// Po změně paymentStatus na 'refunded':
// 1. Vrátit zásoby na sklad (přidat gramy zpět)
// 2. Vytvořit StockMovement záznam typu 'IN'
// 3. Aktualizovat SKU availableGrams
// 4. Aktualizovat SKU inStock flag
```

**Dopad:** Při refundu se zásoby nezvyšují, i když zboží je zpět na skladě

**Řešení:** Přidat logiku pro vrácení zásob při refundu

**Čas:** 2-3h

---

### 🟡 6. Vrácení zásob při Zrušení objednávky

**Status:** ❌ CHYBÍ  
**Kde:** `/app/api/admin/orders/[id]/route.ts` - PUT metoda  
**Problém:** Když se objednávka zruší, zásoby se nevrátí (pokud už byly odečteny)

**Co chybí:**
```typescript
// Po změně orderStatus na 'cancelled':
// 1. Pokud byla objednávka zaplacena (zásoby už odečteny):
//    - Vrátit zásoby na sklad
//    - Vytvořit StockMovement záznam typu 'IN'
// 2. Pokud nebyla zaplacena (zásoby neodečteny):
//    - Nic nedělat
```

**Dopad:** Při zrušení zaplacené objednávky se zásoby nezvyšují

**Řešení:** Přidat logiku pro vrácení zásob při zrušení

**Čas:** 1-2h

---

### 🟢 7. Rezervace zásob při přidání do košíku (volitelné)

**Status:** ❌ CHYBÍ - VOLITELNÉ  
**Kde:** Košík (`/app/kosik/...`)  
**Problém:** Zboží může být přidáno do více košíků současně

**Co chybí:**
- ❌ Rezervace zásob při přidání do košíku
- ❌ Automatické uvolnění rezervace po X minutách
- ❌ Kontrola rezervovaných zásob při checkoutu

**Dopad:** Více zákazníků může mít stejné zboží v košíku

**Řešení:** Přidat `reservedUntil` pole do SKU a logiku rezervace

**Čas:** 4-5h (komplexní)

---

## 📋 PRIORITIZACE

### 🔴 KRITICKÉ (Musí být hotovo hned)
1. **Automatické odečítání zásob při ručním označení jako zaplaceno** (2-3h)
2. **Stock validation při checkoutu** (2-3h)
3. **Low stock alerts** (2-3h)

**Celkem:** 6-9h práce

---

### 🟡 DŮLEŽITÉ (Mělo by být hotovo brzy)
4. **Automatické skrytí produktů** (1-2h)
5. **Vrácení zásob při refundu** (2-3h)
6. **Vrácení zásob při zrušení** (1-2h)

**Celkem:** 4-7h práce

---

### 🟢 VOLITELNÉ (Může počkat)
7. **Rezervace zásob při přidání do košíku** (4-5h)

**Celkem:** 4-5h práce

---

## 🎯 DOPORUČENÝ PLÁN

### Fáze 1: Kritické opravy (1 týden)
1. ✅ Automatické odečítání zásob při ručním označení jako zaplaceno
2. ✅ Stock validation při checkoutu
3. ✅ Low stock alerts

**Výsledek:** Skladová správa je bezpečná a funkční

---

### Fáze 2: Důležité funkce (1 týden)
4. ✅ Automatické skrytí produktů
5. ✅ Vrácení zásob při refundu
6. ✅ Vrácení zásob při zrušení

**Výsledek:** Skladová správa je kompletní

---

### Fáze 3: Vylepšení (volitelné)
7. ✅ Rezervace zásob při přidání do košíku

**Výsledek:** Skladová správa je prémiová

---

## 📝 DETAILNÍ IMPLEMENTAČNÍ PLÁN

### 1. Automatické odečítání zásob při ručním označení jako zaplaceno

**Soubor:** `app/api/admin/orders/[id]/route.ts`  
**Metoda:** PUT  
**Řádky:** 127-235

**Co udělat:**
1. Po změně `paymentStatus` na `paid` zkontrolovat, zda už nejsou zásoby odečteny
2. Pokud nejsou odečteny, odečíst zásoby (stejná logika jako v GoPay webhooku)
3. Vytvořit StockMovement záznamy
4. Aktualizovat SKU

**Kód:**
```typescript
// Po řádku 190 (prisma.order.update)
if (body.paymentStatus === 'paid' && currentOrder.paymentStatus !== 'paid') {
  // Odečíst zásoby (stejná logika jako v /api/gopay/notify/route.ts)
  for (const item of order.items) {
    // ... logika odečtení zásob
  }
}
```

---

### 2. Stock Validation při Checkoutu

**Soubor:** `app/api/orders/route.ts`  
**Metoda:** POST  
**Řádky:** 75-176

**Co udělat:**
1. Po `quoteCartLines` zkontrolovat dostupnost každého SKU
2. Pokud není dostupné, vrátit chybu s detaily

**Kód:**
```typescript
// Po řádku 105 (quoteCartLines)
for (const item of quotedLines) {
  const sku = await prisma.sku.findUnique({ where: { id: item.sku.id } });
  if (!sku || !sku.inStock) {
    return NextResponse.json(
      { error: `SKU ${item.sku.sku} není na skladě` },
      { status: 400 }
    );
  }
  if (sku.saleMode === 'BULK_G' && (sku.availableGrams || 0) < item.grams) {
    return NextResponse.json(
      { error: `SKU ${item.sku.sku} má pouze ${sku.availableGrams}g, požadováno ${item.grams}g` },
      { status: 400 }
    );
  }
}
```

---

### 3. Low Stock Alerts

**Soubor:** `app/admin/page.tsx`  
**Řádky:** 1-279

**Co udělat:**
1. Přidat fetch pro low stock SKU
2. Zobrazit sekci "Low Stock" na dashboardu
3. Zobrazit seznam SKU s low stock

**Kód:**
```typescript
// Přidat do useEffect
const [lowStockSkus, setLowStockSkus] = useState([]);

// Fetch low stock SKUs
const fetchLowStock = async () => {
  const res = await fetch('/api/admin/skus?lowStock=true');
  const data = await res.json();
  setLowStockSkus(data);
};

// Zobrazit na dashboardu
{lowStockSkus.length > 0 && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <h3 className="font-bold text-yellow-800">⚠️ Low Stock Alert</h3>
    <ul>
      {lowStockSkus.map(sku => (
        <li key={sku.id}>{sku.sku}: {sku.availableGrams}g</li>
      ))}
    </ul>
  </div>
)}
```

---

## 🚀 RYCHLÝ START

### Co udělat hned (kritické):

1. **Automatické odečítání zásob** (2-3h)
   - Otevři `app/api/admin/orders/[id]/route.ts`
   - Přidej logiku odečtení zásob po změně paymentStatus na 'paid'
   - Zkopíruj logiku z `app/api/gopay/notify/route.ts` (řádky 130-176)

2. **Stock validation** (2-3h)
   - Otevři `app/api/orders/route.ts`
   - Přidej validaci dostupnosti zásob před vytvořením objednávky

3. **Low stock alerts** (2-3h)
   - Otevři `app/admin/page.tsx`
   - Přidej sekci "Low Stock" na dashboard

---

**TL;DR:**  
**Kritické:** Automatické odečítání zásob, stock validation, low stock alerts (6-9h)  
**Důležité:** Skrytí produktů, vrácení zásob při refundu/zrušení (4-7h)  
**Volitelné:** Rezervace zásob (4-5h)

**Celkem:** 14-21h práce pro kompletní skladovou správu

