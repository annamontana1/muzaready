# 📦 Průvodce: Logika objednávky a workflow v admin panelu

## 🎯 Přehled: Co je to objednávka?

Objednávka má **3 nezávislé statusy**, které se mění nezávisle na sobě:

1. **`orderStatus`** - Celkový stav objednávky
2. **`paymentStatus`** - Stav platby
3. **`deliveryStatus`** - Stav dopravy

---

## 📋 Workflow objednávky (od začátku do konce)

### 1️⃣ **Vytvoření objednávky** (Zákazník)

**Co se stane:**
- Zákazník vyplní formulář a odešle objednávku
- Objednávka se vytvoří v databázi s výchozími hodnotami:
  - `orderStatus`: `pending` (čeká na zpracování)
  - `paymentStatus`: `unpaid` (nezaplaceno)
  - `deliveryStatus`: `pending` (čeká na odeslání)

**Co vidíš v admin panelu:**
- ✅ Nová objednávka se objeví v seznamu objednávek
- ✅ Status: **Čeká na zpracování** (oranžová)
- ✅ Platba: **Nezaplaceno** (červená)
- ✅ Doprava: **Čeká** (oranžová)

---

### 2️⃣ **Označit jako zaplaceno** (Admin akce)

**Kdy to udělat:**
- Když zákazník zaplatil (bankovní převod, GoPay, hotově)

**Jak na to:**
1. Otevři detail objednávky (`/admin/objednavky/[id]`)
2. Klikni na tlačítko **"Označit jako zaplaceno"** (modré tlačítko)
3. Nebo použij **"Zaznamenat platbu"** (zelené tlačítko) pro detailní zadání částky

**Co se změní:**
- `paymentStatus`: `unpaid` → `paid`
- `orderStatus`: `pending` → `processing` (pokud bylo pending)
- `paidAt`: nastaví se aktuální datum a čas

**Co vidíš v admin panelu:**
- ✅ Status: **Zpracovává se** (žlutá)
- ✅ Platba: **Zaplaceno** (zelená)
- ✅ Doprava: **Čeká** (oranžová) - stále čeká na odeslání

---

### 3️⃣ **Označit jako odesláno** (Admin akce)

**Kdy to udělat:**
- Když jsi zabalil/a zboží a předal/a kuriérovi
- Když máš tracking číslo

**Jak na to:**
1. Otevři detail objednávky
2. Klikni na tlačítko **"Označit jako odesláno"** (modré tlačítko)
3. Nebo použij **"Vytvořit zásilku"** (fialové tlačítko) pro zadání tracking čísla

**Co se změní:**
- `deliveryStatus`: `pending` → `shipped`
- `orderStatus`: `processing` → `shipped` (pokud bylo processing)
- `shippedAt`: nastaví se aktuální datum a čas
- `trackingNumber`: můžeš zadat tracking číslo

**Co vidíš v admin panelu:**
- ✅ Status: **Odesláno** (fialová)
- ✅ Platba: **Zaplaceno** (zelená)
- ✅ Doprava: **Odesláno** (modrá)

---

### 4️⃣ **Doručeno** (Automaticky nebo ručně)

**Kdy to nastane:**
- Automaticky: když kuriér potvrdí doručení
- Ručně: když zákazník potvrdí, že obdržel zboží

**Co se změní:**
- `deliveryStatus`: `shipped` → `delivered`
- `orderStatus`: `shipped` → `completed`

**Co vidíš v admin panelu:**
- ✅ Status: **Dokončeno** (zelená)
- ✅ Platba: **Zaplaceno** (zelená)
- ✅ Doprava: **Doručeno** (zelená)

---

## 🎨 Co vidíš v admin panelu

### 📊 **Hlavní stránka objednávek** (`/admin/objednavky`)

**Statistiky nahoře:**
- 📈 **Celkový obrat** - součet všech objednávek na aktuální stránce
- ⏳ **Čekající** - počet objednávek s `pending` nebo `draft` statusem
- 💰 **Zaplaceno** - počet objednávek s `paid` statusem
- 📦 **Odesláno** - počet objednávek s `shipped` nebo `delivered` statusem

**Tabulka objednávek:**
- **ID objednávky** (zkrácené na 8 znaků)
- **Zákazník** (jméno, email)
- **Datum vytvoření**
- **Celková částka**
- **Statusy** (3 barevné badge):
  - 🟠 **Order Status** (pending/processing/shipped/completed)
  - 🔴/🟢 **Payment Status** (unpaid/paid)
  - 🟠/🔵/🟢 **Delivery Status** (pending/shipped/delivered)

**Filtry:**
- Filtrovat podle statusu (order/payment/delivery)
- Filtrovat podle kanálu (web/POS/Instagram DM)
- Hledat podle emailu zákazníka

**Bulk akce:**
- Vybrat více objednávek (checkboxy)
- Označit více objednávek jako zaplaceno
- Označit více objednávek jako odesláno
- Exportovat do CSV

---

### 📄 **Detail objednávky** (`/admin/objednavky/[id]`)

**Hlavička objednávky:**
- **ID objednávky** a **celková částka** (velké, modré)
- **3 status badge** (order/payment/delivery)
- **4 tlačítka:**
  1. 🔵 **Označit jako zaplaceno** - rychlé označení
  2. 🔵 **Označit jako odesláno** - rychlé označení
  3. 🟢 **Zaznamenat platbu** - detailní zadání částky (modal)
  4. 🟣 **Vytvořit zásilku** - zadání tracking čísla (modal)

**Taby:**
1. **Zákazník** - kontaktní údaje, adresa doručení
2. **Položky** - seznam zboží v objednávce (SKU, množství, cena)
3. **Platba** - platební metoda, status, historie plateb
4. **Zásilky** - tracking čísla, historie zásilek
5. **Metadata** - tagy, poznámky, risk score, kanál

---

## 🔄 Typické scénáře

### Scénář 1: Online objednávka s GoPay platbou

1. **Zákazník vytvoří objednávku** → `pending/unpaid/pending`
2. **GoPay automaticky zaplatí** → `processing/paid/pending` (automaticky)
3. **Ty zabalíš zboží** → Klikneš "Označit jako odesláno" → `shipped/paid/shipped`
4. **Kuriér doručí** → `completed/paid/delivered` (automaticky nebo ručně)

---

### Scénář 2: Objednávka přes Instagram DM

1. **Zákazník napíše na Instagram** → Ty vytvoříš objednávku ručně
2. **Zákazník zaplatí bankovním převodem** → Ty klikneš "Označit jako zaplaceno"
3. **Zabalíš a pošleš** → Klikneš "Označit jako odesláno" + zadáš tracking číslo
4. **Zákazník potvrdí doručení** → Ty označíš jako "Doručeno"

---

### Scénář 3: Objednávka v kamenné prodejně (POS)

1. **Zákazník přijde do obchodu** → Ty vytvoříš objednávku s `channel: 'pos'`
2. **Zákazník zaplatí hotově** → Hned klikneš "Označit jako zaplaceno"
3. **Zákazník si zboží vezme s sebou** → Klikneš "Označit jako odesláno" → `deliveryStatus: 'delivered'`

---

## ⚠️ Důležité poznámky

### Statusy jsou nezávislé

- Můžeš mít `paid/unpaid` i když je `shipped` (např. na dobírku)
- Můžeš mít `unpaid` i když je `delivered` (např. když zákazník nezaplatil)
- Statusy se mění nezávisle na sobě

### Automatické změny

- Když označíš jako `paid`, `orderStatus` se automaticky změní z `pending` na `processing`
- Když označíš jako `shipped`, `orderStatus` se automaticky změní z `processing` na `shipped`
- Když označíš jako `delivered`, `orderStatus` se automaticky změní na `completed`

### Tlačítka jsou disabled

- **"Označit jako zaplaceno"** je šedé, když už je `paymentStatus: 'paid'`
- **"Označit jako odesláno"** je šedé, když už je `deliveryStatus: 'shipped'` nebo `'delivered'`
- To je správné chování - nemůžeš označit něco, co už je označené

---

## 🎯 Doporučený workflow pro tebe

### Ráno (kontrola nových objednávek)

1. Otevři `/admin/objednavky`
2. Filtruj podle `orderStatus: pending` nebo `paymentStatus: unpaid`
3. Projdi všechny nové objednávky
4. Zkontroluj, jestli jsou zaplacené (bankovní převod, GoPay)
5. Označ zaplacené objednávky jako `paid`

### Během dne (zpracování objednávek)

1. Pro zaplacené objednávky:
   - Zabal zboží
   - Klikni "Označit jako odesláno"
   - Zadej tracking číslo (pokud máš)
   - Pošli zákazníkovi tracking číslo

2. Pro nezaplacené objednávky:
   - Pošli reminder email (pokud je to starší než 3 dny)
   - Nebo zruš objednávku, pokud zákazník neodpovídá

### Večer (kontrola dokončených)

1. Zkontroluj objednávky s `deliveryStatus: shipped`
2. Pokud kuriér potvrdil doručení, označ jako `delivered`
3. Zkontroluj, jestli všechny zaplacené objednávky jsou odeslané

---

## 📱 Rychlé tipy

### Keyboard shortcut
- **Cmd/Ctrl + K** - rychlé vyhledávání podle emailu

### Bulk akce
- Vyber více objednávek (checkboxy)
- Klikni "Označit zaplaceno" nebo "Označit odesláno"
- Všechny vybrané objednávky se aktualizují najednou

### Filtry
- Používej filtry pro rychlé nalezení konkrétních objednávek
- Např.: `paymentStatus: unpaid` + `orderStatus: pending` = všechny nezaplacené objednávky

---

## ❓ Časté otázky

**Q: Co když zákazník zaplatil, ale já to ještě nevidím?**
A: Počkej na potvrzení z banky/GoPay, pak označ jako zaplaceno.

**Q: Co když zákazník chce změnit adresu?**
A: V detailu objednávky můžeš editovat adresu (tlačítko "Upravit metadata").

**Q: Co když zákazník chce zrušit objednávku?**
A: Označ `orderStatus: cancelled` a `paymentStatus: refunded` (pokud už zaplatil).

**Q: Co když zákazník nezaplatil a objednávka je stará?**
A: Můžeš zrušit objednávku (`cancelled`) nebo poslat reminder email.

---

**TL;DR:**
1. Nová objednávka → `pending/unpaid/pending`
2. Zákazník zaplatil → Klikni "Označit jako zaplaceno" → `processing/paid/pending`
3. Zabalil/a jsi zboží → Klikni "Označit jako odesláno" → `shipped/paid/shipped`
4. Kuriér doručil → Označ jako "Doručeno" → `completed/paid/delivered`

**Všechno vidíš v `/admin/objednavky` a můžeš to spravovat!** 🚀

