# 🔐 Jak zkontrolovat a opravit heslo v Supabase

## ❌ Problém

V Supabase Dashboard se heslo **nezobrazuje** z bezpečnostních důvodů:
```
postgresql://postgres:[YOUR_PASSWORD]@...
```

Nemůžeš přímo porovnat heslo z `.env.local` s heslem v Supabase.

---

## ✅ Řešení: Resetuj heslo v Supabase

### Krok 1: Resetuj heslo v Supabase Dashboard

1. **Jdi na:** Settings → Database
2. **Najdi sekci:** "Database password" nebo "Reset database password"
3. **Klikni:** "Reset database password" nebo "Change password"
4. **Vytvoř nové heslo:**
   - Zapiš si ho (budeš ho potřebovat)
   - Např.: `novéHeslo123` (nebo jiné silné heslo)

### Krok 2: Zkopíruj nový connection string

Po resetu hesla:
1. **Jdi na:** Settings → Database → Connection string
2. **Zkopíruj:** Direct connection string
3. **Nahraď `[YOUR_PASSWORD]`** novým heslem, které jsi vytvořila

### Krok 3: Aktualizuj `.env.local`

```bash
# Použij nové heslo
DATABASE_URL=postgresql://postgres:NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:NOVE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

**Nahraď `NOVE_HESLO`** skutečným heslem, které jsi vytvořila.

---

## 🔍 Alternativa: Zkus připojení s různými hesly

Pokud nechceš resetovat heslo, můžeš zkusit:

### Test 1: Zkus aktuální heslo

```bash
# Zkus připojení s heslem z .env.local
psql "postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require" -c "SELECT 1;"
```

**Pokud funguje:** Heslo je správné ✅  
**Pokud nefunguje:** Heslo je špatné ❌

### Test 2: Zkus připojení přes Supabase SQL Editor

1. **Otevři:** SQL Editor v Supabase Dashboard
2. **Zkus:** `SELECT 1;`
3. **Pokud funguje:**
   - Databáze je OK ✅
   - Problém je v connection stringu nebo hesle

---

## 🚀 Rychlé řešení (Doporučeno)

### 1. Resetuj heslo v Supabase

1. **Settings → Database → Reset database password**
2. **Vytvoř nové heslo** (např.: `muza2024secure`)
3. **Zkopíruj si ho**

### 2. Aktualizuj `.env.local`

```bash
# Nahraď heslo novým
DATABASE_URL=postgresql://postgres:muza2024secure@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:muza2024secure@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

### 3. Restartuj server

```bash
npm run dev
```

### 4. Otestuj

```bash
curl http://localhost:3000/api/health
```

Mělo by vrátit: `{"ok":true,"db":"up",...}`

---

## ⚠️ Důležité

**Po resetu hesla musíš aktualizovat:**
- ✅ `.env.local` (lokální vývoj)
- ✅ Vercel Environment Variables (produkce)
  - Jdi na: Vercel Dashboard → Settings → Environment Variables
  - Aktualizuj `DATABASE_URL` a `DIRECT_URL` s novým heslem

---

## 💡 Tip

**Pokud nechceš resetovat heslo:**
- Zkus použít produkci (https://muzaready-iota.vercel.app)
- Tam databáze funguje s aktuálním nastavením ✅

---

**Nejjednodušší:** Resetuj heslo v Supabase a použij nové heslo v `.env.local` ⭐
