# 🏠 Lokální vývoj vs Produkce - Praktický průvodce

## ❓ Je problém, když localhost nefunguje?

**Krátká odpověď: NE, pokud produkce funguje! ✅**

---

## ✅ Co funguje (a stačí to)

### 1. Produkce na Vercel
- ✅ **URL:** https://muzaready-iota.vercel.app
- ✅ **Databáze:** Funguje perfektně
- ✅ **Admin panel:** Plně funkční
- ✅ **API:** Všechny endpointy fungují

### 2. Supabase MCP (Cursor integrace)
- ✅ **Přímý přístup k databázi** přes Cursor
- ✅ **Můžeš vytvářet/mazat data** přes MCP
- ✅ **SQL dotazy** fungují perfektně

---

## ❌ Co nefunguje (ale není to problém)

### Lokální vývoj (localhost:3000)
- ❌ **Databáze není dostupná** z lokálního počítače
- ❌ **API endpointy** vracejí 500 errors
- ❌ **Nemůžeš testovat změny** před deployem

---

## 💡 Jak se obejít bez lokálního vývoje

### Možnost 1: Testovat na produkci (Doporučeno)

**Výhody:**
- ✅ Funguje hned teď
- ✅ Reálné prostředí
- ✅ Můžeš testovat vše

**Nevýhody:**
- ⚠️ Změny jdou rovnou do produkce
- ⚠️ Můžeš rozbít produkci (ale Vercel má rollback)

**Jak na to:**
1. **Udělej změny v kódu**
2. **Commit a push:**
   ```bash
   git add .
   git commit -m "Moje změna"
   git push origin main
   ```
3. **Vercel automaticky deployuje** (1-2 minuty)
4. **Otestuj na:** https://muzaready-iota.vercel.app

---

### Možnost 2: Použij Supabase MCP pro databázové operace

**Místo lokálního Prisma:**
- ✅ Použij Supabase MCP pro čtení/zápis dat
- ✅ Můžeš vytvářet test objednávky přes MCP
- ✅ Můžeš spouštět SQL dotazy

**Příklad:**
```typescript
// Místo lokálního prisma.order.create()
// Použij Supabase MCP execute_sql
```

---

### Možnost 3: Použij Preview Deployments (Nejlepší)

**Vercel automaticky vytváří preview pro každý PR:**
- ✅ **Každý PR** dostane vlastní URL
- ✅ **Můžeš testovat** bez ovlivnění produkce
- ✅ **Automaticky** se vytvoří při pushi

**Jak na to:**
1. **Vytvoř feature branch:**
   ```bash
   git checkout -b feature/moje-zmena
   ```
2. **Udělej změny a push:**
   ```bash
   git add .
   git commit -m "Moje změna"
   git push origin feature/moje-zmena
   ```
3. **Vercel vytvoří preview URL** (např.: `muzaready-iota-git-feature-moje-zmena.vercel.app`)
4. **Otestuj na preview URL**

---

## 📊 Srovnání přístupů

| Přístup | Výhody | Nevýhody | Kdy použít |
|---------|--------|----------|------------|
| **Produkce** | ✅ Funguje hned | ⚠️ Riziko rozbití | Malé změny, rychlé testy |
| **Preview Deploy** | ✅ Bezpečné | ⚠️ Trvá 1-2 min | Větší změny, PR workflow |
| **Lokální vývoj** | ✅ Rychlé iterace | ❌ Ne funguje | Když by fungovalo |

---

## 🚀 Doporučený workflow (bez lokálního vývoje)

### Pro malé změny:
1. **Udělej změnu v kódu**
2. **Commit a push do `main`**
3. **Počkej na Vercel deploy** (1-2 min)
4. **Otestuj na produkci**

### Pro větší změny:
1. **Vytvoř feature branch**
2. **Udělej změny**
3. **Push do branch**
4. **Vercel vytvoří preview URL**
5. **Otestuj na preview**
6. **Merge do `main`** když je to OK

### Pro databázové operace:
1. **Použij Supabase MCP** (přes Cursor)
2. **Nebo použij Supabase Dashboard** → SQL Editor
3. **Nebo použij API endpointy** na produkci

---

## ✅ Závěr

**Můžeš se obejít bez lokálního vývoje, pokud:**
- ✅ Produkce funguje (funguje!)
- ✅ Můžeš používat Preview Deployments (můžeš!)
- ✅ Můžeš používat Supabase MCP (můžeš!)

**Lokální vývoj je užitečný, ale NENÍ nutný:**
- ⚠️ Rychlejší iterace (ale produkce je dost rychlá)
- ⚠️ Testování bez deploye (ale preview to řeší)
- ⚠️ Offline práce (ale většinou máš internet)

---

## 🎯 Praktický tip

**Pro tebe teď nejlepší workflow:**
1. **Udělej změny v kódu**
2. **Commit a push:**
   ```bash
   git add .
   git commit -m "Popis změny"
   git push origin main
   ```
3. **Počkej 1-2 minuty** na Vercel deploy
4. **Otestuj na:** https://muzaready-iota.vercel.app
5. **Hotovo! ✅**

**Pokud potřebuješ testovat databázové operace:**
- Použij Supabase MCP přes Cursor
- Nebo použij Supabase Dashboard → SQL Editor
- Nebo použij API endpointy na produkci

---

**TL;DR:** Lokální vývoj není problém, pokud produkce funguje. Můžeš pokračovat v práci normálně! 🚀

