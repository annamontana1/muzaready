# 📋 Múza Hair E-Shop - Checklist Požadavků

> Před tím, než si začnu psát Priority 1-6, musím vědět přesně co si představuješ. Vyplň si prosím tyhle otázky a pak si budu moci stavět s jistotou, že to bude přesně tak jak chceš.

---

## 🛒 NÁKUPNÍ PROCES (Checkout Flow)

### Co se děje v `/app/pokladna/page.tsx`?

- [ ] **Jaké údaje sbíráš od zákazníka?**
  - Jméno (povinné?)
  - Email (povinné?)
  - Telefon (povinné?)
  - Adresa (povinné?)
  - Poznámka k objednávce (volitelné?)
  - Něco jiného?

- [ ] **Jak se zákazník identifikuje?**
  - Může nakupovat bez registrace (Guest Checkout)?
  - Nebo musí být přihlášen?
  - Registrace na místě během objednávky?

- [ ] **Které místa doručení podporuješ?**
  - Jen Česká republika?
  - EU?
  - Celosvět?

- [ ] **Jaké způsoby doručení?**
  - Česká pošta (zásilkovna)?
  - Osobní vyzvednutí v Praze?
  - Kuriér (DPD, GLS)?
  - Jenom online kalkulace ceny dopravy?

### Validace a Chyby

- [ ] **Co se stane, když zákazník zadá chybný email?**
  - Validuješ formát během psaní?
  - Potvrzovací email s kódem?
  - Jen check-online?

- [ ] **Co se stane, když nemá dostatek skladu?**
  - Varování při přidání do košíku?
  - Varování při checkout?
  - Zákaz nákupu (Out of Stock)?

---

## 💳 PLATBY (Payment Gateway)

### GoPay Integrace

- [ ] **Chceš opravdu GoPay, nebo jsem si to vymyslel?**
  - GoPay (pro CZ)?
  - Stripe (pro EU/Global)?
  - Oboje?
  - Něco jiného?

- [ ] **Co se stane, když se platba nezdaří?**
  - Automaticky retry?
  - Email s odkazy k opakování?
  - Zůstane v "pending" objednávka?

- [ ] **Kdy se zboží "prodává"?**
  - Ihned po přidání do košíku?
  - Až po úspěšné platbě?
  - Až po confirmation z GoPay (webhook)?

- [ ] **Co s objednávkami, které se neplatí?**
  - Smazat po X dnech?
  - Poslat reminder email?
  - Vytvořit nový kosík pro uživatele?

---

## 📦 STAVY OBJEDNÁVKY (Order Status Pipeline)

Co je to přesně status objednávky? Tady jsou možnosti - vyber které chceš:

```
1. pending      → Objednávka přijata, čeká na platbu
2. paid         → Platba potvrzena
3. processing   → Zboží se balí
4. shipped      → Zboží odesláno (máš tracking č.)
5. delivered    → Doručeno
6. cancelled    → Zrušeno
7. refunded     → Vráceno
```

- [ ] **Používáš všechny tyhle stavy, nebo jenom některé?**
  - Které stavy jsou kritické?
  - Chybí nějaký?

---

## 📧 NOTIFIKACE (Email Notifications)

Kdy se mají poslat emaily?

- [ ] **Potvrzovací email po objednávce**
  - Hned po submitu formuláře?
  - Nebo až po úspěšné platbě?
  - Obsahuje seznam zboží?
  - Obsahuje tracking číslo (pokud existuje)?

- [ ] **Email po zaplacení**
  - "Tvá objednávka byla zaplacena"?
  - Nebo je to stejný as potvrzovacím emailem?

- [ ] **Email když se zboží pošle**
  - Nový email?
  - Obsahuje tracking číslo (DPD, Česká pošta)?
  - Obsahuje odkaz na tracking?

- [ ] **Email když je doručeno**
  - Automaticky od kuriéra?
  - Nebo ruční potvrzení?

- [ ] **Email když se něco nezdaří**
  - Když je order cancelled?
  - Když se platba nezdaří?
  - Kontakt na podporu v emailu?

---

## 👥 ADMIN ROZHRANÍ (Order Management)

### Co potřebuješ vidět v adminu?

- [ ] **Dashboard s objednávkami**
  - Tabulka všech objednávek?
  - Filtry (datum, status, zákazník)?
  - Hledání?

- [ ] **Detail objednávky**
  - Jaké informace?
  - Lze změnit status ručně?
  - Lze editovat adresu?
  - Lze poslat manuální email?

- [ ] **Co s inventářem?**
  - Vidíš zboží která vypadla ze skladu?
  - Lze upravit stock ruční?
  - Máš hlášení o low stock?

---

## 👤 ZÁKAZNICKÝ ÚČET (Customer Account)

### `/app/orders/[orderId]` - Co tam je?

- [ ] **Může zákazník vidět své objednávky?**
  - Bez přihlášení (jen emailem)?
  - Nebo musí být přihlášen?

- [ ] **Co vidí v detailu objednávky?**
  - Seznam zboží?
  - Ceny?
  - Aktuální status?
  - Tracking číslo?
  - Historii statusů?

- [ ] **Může něco dělat?**
  - Stornovat objednávku?
  - Změnit adresu?
  - Vrátit zboží?
  - Jen číst?

---

## 📊 SKLÁD & INVENTÁŘ (Inventory Management)

### Kdy se odečítá ze skladu?

- [ ] **Timing:**
  - Ihned když se přidá do košíku? (RISK: zůstane tam, zákazník to nekoupí)
  - Když se checkout submitne? (RISK: může přidávat > sklad)
  - Když se platba potvrdí? (BEST PRACTICE)
  - Když se fyzicky pošle?

- [ ] **Přeprodej (Overselling):**
  - Co se stane, když 2 zákazníci kliknou "koupit" zboží kde je jen 1 kus?
  - Komu se to prodá? (FIFO - first come first served?)
  - Dostane druhý refund?

- [ ] **Low Stock Varování:**
  - Zobrazit zákazníkovi "poslední kus"?
  - Email na tebe když je stock < X?

---

## 💰 SLEVY & KUPÓNY (Discounts)

- [ ] **Chceš slévací kupóny?**
  - Procentuální sleva?
  - Absolutní částka?
  - Minimální nákup?
  - Jednoráz-use vs multi-use?
  - Platnost (datum od-do)?

- [ ] **Chceš volume discounts?**
  - Sleva když se koupí více kusů?
  - Sleva na celý nákup?
  - Sleva na konkrétní zboží?

- [ ] **Shipping discounts?**
  - Sleva na dopravu když nákup > CZK 1000?
  - Free shipping over X?

---

## 🎨 DESIGN & UI

- [ ] **Co se má změnit vizuálně?**
  - Sidenutí redesign?
  - Jen opravy konkrétních komponent?
  - Dark mode?
  - Mobile-first redesign?

- [ ] **Máš reference (linky na inspiraci)?**
  - Jaké eshopy se ti líbí?
  - Konkrétní komponenty které chceš?

---

## ⚙️ TECHNICKÉ ROZHODNUTÍ

### GitHub & Vercel

- [ ] **GitHub účet:**
  - Máš GitHub?
  - Jméno účtu?
  - Mohu vytvořit private repo?
  - Chceš být collaborator?

- [ ] **Vercel deploy:**
  - Máš Vercel linked s GitHub?
  - Chceš linked branch?
  - (Zjednodušuje to deploy - commits → live)

- [ ] **Database:**
  - Pokračujeme se Supabase?
  - Nějaké změny v schema?

- [ ] **Email (Resend):**
  - Máš Resend API key?
  - Je nakonfigurovaný?
  - Máš email template hotový?

- [ ] **GoPay:**
  - Máš GoPay account?
  - Sandbox či production klíče?
  - Chceš nejdřív testovat v sandboxu?

---

## 📅 TIMELINE & KOMUNIKACE

- [ ] **Jak se máme bavit?**
  - Táhle zprávou?
  - Email?
  - GitHub issues?

- [ ] **Jak často si chceš update?**
  - Denně?
  - Každé 2 dny?
  - Týdně?

- [ ] **Co znamená "Done"?**
  - Kód napsaný?
  - Testované?
  - Live na Vercel?

---

## 🎯 PRIORITA - KTERÝ FEATURE NEJDŘÍV?

Tady je pořadí co jsem navrhoval:

```
Priority 1: Migrate /app/kosik & /app/pokladna to new cart (6-8h)
Priority 2: Payment integration - GoPay (12-16h)
Priority 3: Direct "Do košíku" in CatalogCard (4-6h)
Priority 4: Order fulfillment workflow (8-10h)
Priority 5: Design refactor (6-8h)
Priority 6: Testing (8-10h)
```

- [ ] **Souhlasíš s tímhle pořadím?**
  - Změnit priority?
  - Něco vynechat?
  - Něco přidat?

---

## ✅ CHECKLIST VYPLNĚNÍ

Když si vyplníš tenhle form:

1. **Přesně vím co stavím** - nula nejistoty
2. **Vím kde se chyby mohou stát** - mohu je předejít
3. **Commits na GitHub budou smysluplné** - budeš vidět progress

**Jakmile mi to pošleš, udělám toto:**

1. Vytvořím GitHub repo (private, ty si budeš collaborator)
2. Linked Vercel na GitHub (každý commit = live preview)
3. Začnu Priority 1 se 100% jistotou
4. Po každém featurů commit na GitHub
5. Ty vidíš live na Vercel

**Posílej zpět vyplněný form (stačí checks + komentáře u nejasných bodů) a můžeme jít na to!**
