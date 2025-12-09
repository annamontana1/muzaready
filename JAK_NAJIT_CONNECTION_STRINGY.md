# 🔍 Jak najít Connection Stringy v Supabase Dashboard

## 📍 Kde najít Connection Stringy

### Krok 1: Jdi na Settings → Database

V levém menu klikni na:
- **Settings** (⚙️ ikona)
- Pak **Database**

### Krok 2: Najdi "Connection string" sekci

Měly by tam být **2 možnosti**:

---

## 🔗 Možnost 1: Connection Pooling (Port 6543) ⭐

**Pro:** Aplikaci (Next.js, API dotazy)

**Kde najít:**
1. V sekci "Connection string"
2. Najdi **"Connection pooling"** nebo **"Session mode"**
3. Mělo by tam být:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

**Pokud nevidíš pooled connection:**
- Možná je v jiné sekci
- Zkus najít "Pooler" nebo "PgBouncer"
- Nebo použij dočasně Direct connection (5432)

---

## 🔗 Možnost 2: Direct Connection (Port 5432) ✅

**Pro:** Prisma migrace, health checks

**Kde najít:**
1. V sekci "Connection string"
2. Najdi **"Direct connection"** nebo **"Transaction mode"**
3. Mělo by tam být:
   ```
   postgresql://postgres:[YOUR_PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres
   ```

**To už máš!** ✅

---

## 📝 Jak upravit `.env.local`

### Pokud najdeš oba connection stringy:

```bash
# DATABASE_URL - pooled connection (6543) - pro aplikaci
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# DIRECT_URL - direct connection (5432) - pro migrace
DIRECT_URL=postgresql://postgres:[YOUR_PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

### Pokud najdeš jen Direct connection (5432):

```bash
# Použij oba na port 5432 (dočasně)
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:[YOUR_PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

**⚠️ Poznámka:** Toto je dočasné řešení. Pro produkci je lepší použít pooled (6543).

---

## 🔍 Kde hledat Connection Pooling

### Možnost A: V "Connection string" sekci
- Scrolluj dolů v "Connection string" sekci
- Mělo by tam být více možností (Direct, Pooled, Session, Transaction)

### Možnost B: V "Connection pooling" sekci
- Možná je samostatná sekce "Connection pooling"
- Nebo "PgBouncer settings"

### Možnost C: V "Database" → "Connection info"
- Zkus najít "Connection info" nebo "Connection settings"
- Tam by měly být všechny možnosti

---

## ✅ Co máš teď

Z tvého screenshotu vidím:
- ✅ **Direct connection (5432)** - máš ✅
- ❓ **Connection pooling (6543)** - potřebuješ najít

---

## 💡 Pokud nenajdeš Connection Pooling

**Můžeš použít oba na Direct connection (5432):**

1. **Zkopíruj Direct connection string** z dashboardu
2. **Uprav `.env.local`:**
   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
   DIRECT_URL=postgresql://postgres:[YOUR_PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
   ```
3. **Nahraď `[YOUR_PASSWORD]`** svým skutečným heslem
4. **Restartuj server:** `npm run dev`

---

## 🎯 Rychlé řešení (Teď)

**Pokud máš Direct connection string:**

1. **Zkopíruj connection string** z dashboardu:
   ```
   postgresql://postgres:[YOUR_PASSWORD]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres
   ```

2. **Uprav `.env.local`:**
   ```bash
   # Nahraď [YOUR_PASSWORD] svým heslem
   DATABASE_URL=postgresql://postgres:TVOJE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
   DIRECT_URL=postgresql://postgres:TVOJE_HESLO@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
   ```

3. **Restartuj server:**
   ```bash
   npm run dev
   ```

4. **Otestuj:**
   ```bash
   curl http://localhost:3000/api/health
   ```

---

**Poznámka:** Pokud máš heslo v `.env.local` jako `muzaisthebest`, použij ho místo `[YOUR_PASSWORD]`.

