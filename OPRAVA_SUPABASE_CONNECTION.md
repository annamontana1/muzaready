# 🔧 Oprava Supabase Connection String

## 📊 Aktuální nastavení

Z tvého screenshotu vidím:
- **Project URL:** `https://bcbqrhkoosopmtrryrcy.supabase.co` ✅
- **Data API:** Zapnutá ✅
- **Exposed schemas:** `public`, `graphql_public` ✅

## ⚠️ Problém v `.env.local`

Aktuálně máš:
```bash
DATABASE_URL=postgresql://...@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres
DIRECT_URL=postgresql://...@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres
```

**Oba používají port 5432 (direct connection).**

## ✅ Správné nastavení

Podle dokumentace by mělo být:

```bash
# DATABASE_URL - pooled connection (port 6543) - pro aplikaci
DATABASE_URL=postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?pgbouncer=true

# DIRECT_URL - direct connection (port 5432) - pro migrace
DIRECT_URL=postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

---

## 🔍 Jak získat správné connection stringy z Supabase

### 1. Jdi na Settings → Database

### 2. Najdi "Connection string"

Měly by tam být 2 možnosti:

**A) Connection pooling (port 6543):**
```
postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**B) Direct connection (port 5432):**
```
postgresql://postgres.[ref]:[password]@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

### 3. Zkopíruj a uprav

- **DATABASE_URL** → použij **Connection pooling** (port 6543)
- **DIRECT_URL** → použij **Direct connection** (port 5432)

---

## 🚀 Rychlá oprava

### Krok 1: Zkontroluj Supabase Dashboard

1. Jdi na: **Settings → Database**
2. Najdi **"Connection string"**
3. Zkopíruj **Connection pooling** (port 6543)
4. Zkopíruj **Direct connection** (port 5432)

### Krok 2: Uprav `.env.local`

```bash
# Vytvoř zálohu
cp .env.local .env.local.backup

# Uprav .env.local:
# DATABASE_URL → použij pooled (6543)
# DIRECT_URL → použij direct (5432)
```

### Krok 3: Restartuj server

```bash
# Zastav server (Ctrl+C)
npm run dev
```

### Krok 4: Otestuj

```bash
curl http://localhost:3000/api/health
# Mělo by vrátit: {"ok":true,"db":"up",...}
```

---

## 💡 Alternativa: Použij oba na port 5432 (dočasně)

Pokud pooled connection nefunguje, můžeš dočasně použít oba na port 5432:

```bash
DATABASE_URL=postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:muzaisthebest@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

**⚠️ Poznámka:** Toto je dočasné řešení. Pro produkci doporučujeme použít pooled (6543).

---

## 🔍 Co zkontrolovat v Supabase Dashboard

### 1. Database Status
- ✅ Projekt není **paused**
- ✅ Database je **running**
- ✅ Status je **active**

### 2. Connection Info
- ✅ **Host:** `db.bcbqrhkoosopmtrryrcy.supabase.co`
- ✅ **Port 5432:** Direct connection (pro migrace)
- ✅ **Port 6543:** Pooled connection (pro aplikaci)

### 3. SQL Editor
- Otevři **SQL Editor**
- Zkus: `SELECT 1;`
- Pokud funguje, databáze je OK ✅

---

## ✅ Kontrolní seznam

- [ ] Projekt není paused v Supabase Dashboard
- [ ] Connection pooling (6543) je dostupný
- [ ] Direct connection (5432) je dostupný
- [ ] `.env.local` má správné connection stringy
- [ ] Server je restartovaný
- [ ] Health check vrací `{"ok":true,"db":"up"}`

---

**Pokud stále nefunguje:** Použij produkci (https://muzaready-iota.vercel.app), tam databáze funguje ✅

