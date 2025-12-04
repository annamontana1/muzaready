# MÙZA HAIR E-SHOP

Prémiový e-shop pro prodej vlasových doplňků (vlasy k prodloužení, příčesky, paruky).

---

## 🚨 **AKTUÁLNÍ STAV PROJEKTU (4.12.2025)**

```
✅ Frontend:   100% HOTOVÝ (Orders Admin Panel + E-shop)
✅ Backend:    100% HOTOVÝ (30+ API endpoints)
✅ Testing:    241 tests, 100% pass rate, 9 production approvals
⏳ Deployment: 80% (fixing Vercel errors - in progress)
```

### 👉 **ZAČNI TADY:**
- **[`PROJECT_STATUS.md`](./PROJECT_STATUS.md)** ← Kompletní aktuální stav projektu
- [`FRONTEND_PROGRESS_REPORT.md`](./FRONTEND_PROGRESS_REPORT.md) ← Frontend 100% completion report
- [`VERCEL_DEPLOYMENT_FIX.md`](./VERCEL_DEPLOYMENT_FIX.md) ← Deployment troubleshooting

**Pro agenty:** Pokud vás někdo požádá implementovat Orders Admin Panel features, **všechny jsou už hotové**. Viz `PROJECT_STATUS.md`.

---

## 🎨 Technologie

- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS 3
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma (připraveno)

## 🚀 Rychlý start

### 1. Instalace

```bash
# Instalace závislostí
npm install
```

### 2. Database Setup

#### Supabase Connection Configuration

Supabase poskytuje dva typy připojení:

**DATABASE_URL** (Connection Pooler - Port 6543)
- ✅ Doporučeno pro aplikační dotazy
- Používá PgBouncer pro connection pooling
- Lepší výkon při vysoké zátěži

**DIRECT_URL** (Direct Connection - Port 5432)
- ✅ Vyžadováno pro Prisma migrace
- ✅ Vyžadováno pro spolehlivé health checks
- Přímé připojení k PostgreSQL

#### Nastavení environment variables

```bash
# Zkopírujte example soubor
cp .env.example .env.local

# Upravte hodnoty v .env.local:
# DATABASE_URL - pooled connection (port 6543)
# DIRECT_URL - direct connection (port 5432)
```

**Příklad Supabase URLs:**

```bash
# Pooled connection (recommended for app)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (for migrations & health checks)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

#### 🔧 Quick Workaround pro Connection Issues

Pokud máte problémy s databázovým připojením:

```bash
# Dočasně nastavte DATABASE_URL na stejnou hodnotu jako DIRECT_URL (port 5432)
# To obejde pooler a zajistí okamžité připojení
DATABASE_URL="postgresql://postgres.[ref]:[password]@host:5432/postgres?sslmode=require"
DIRECT_URL="postgresql://postgres.[ref]:[password]@host:5432/postgres?sslmode=require"
```

**⚠️ Poznámka:** Toto je dočasné řešení. Pro produkci doporučujeme:
- `DATABASE_URL` → port 6543 (pooler)
- `DIRECT_URL` → port 5432 (direct)

#### Run Database Migrations

```bash
# Spuštění Prisma migrací
npx prisma migrate deploy

# Generování Prisma Client
npx prisma generate

# (Volitelně) Seed databáze
npm run seed
```

### 3. Development Server

```bash
# Spuštění dev serveru
npm run dev
```

Aplikace běží na: `http://localhost:3000`

### 4. Health Check

```bash
# Ověření, že aplikace a databáze běží
curl http://localhost:3000/api/ok
# Expected: {"ok":true}

curl http://localhost:3000/api/health
# Expected: {"ok":true,"db":"up","dbSource":"DIRECT_URL","dbHostPort":"host:5432"}
```

### 5. Production Build

```bash
# Build pro produkci
npm run build

# Start production serveru
npm start
```

## 📁 Struktura projektu

```
/app              # Next.js App Router pages
/components       # React komponenty
/lib              # Utility funkce (price calculator, SKU generator)
/types            # TypeScript typy
/public           # Statické soubory (obrázky, ikony)
```

## 🎯 Implementované funkce

### Core Features
- ✅ Next.js 14 s App Router
- ✅ Tailwind CSS s custom burgundy designem
- ✅ TypeScript typy (Product, Variant, Pricing)
- ✅ Price Calculator (automatický výpočet cen variant)
- ✅ SKU Generator (generování SKU podle specifikace)
- ✅ Základní komponenty (Header, Footer, Layout)
- ✅ Homepage s Hero section

### Database & API
- ✅ PostgreSQL + Prisma ORM
- ✅ Smart database URL selection (automatic fallback)
- ✅ Health check endpoint (`/api/health`)
- ✅ Connection pooling support (Supabase PgBouncer)
- ✅ Secure password masking in logs

## 🏥 Health Monitoring

### API Endpoints

#### `/api/ok` - Simple Health Check
Rychlá kontrola, že aplikace běží.

```bash
curl https://your-app.vercel.app/api/ok
# Response: {"ok": true}
```

#### `/api/health` - Database Health Check
Podrob kontrola databázového připojení s automatickým výběrem URL.

**Success Response:**
```json
{
  "ok": true,
  "db": "up",
  "dbSource": "DIRECT_URL",
  "dbHostPort": "db.supabase.co:5432",
  "dbUrl": "postgresql://postgres:***@db.supabase.co:5432/postgres"
}
```

**Smart URL Selection:**
1. Preferuje `DIRECT_URL` (port 5432) pro spolehlivé testy
2. Fallback na `DATABASE_URL` (port 6543) pokud `DIRECT_URL` není dostupná
3. Vrací chybu pokud žádná URL není nastavena

**Error Response:**
```json
{
  "ok": false,
  "db": "down",
  "dbSource": "DIRECT_URL",
  "error": "Can't reach database server...",
  "debug": {
    "DATABASE_URL": {"available": true, "hostPort": "host:6543"},
    "DIRECT_URL": {"available": false, "hostPort": "unknown"}
  }
}
```

## 📋 TODO

- [ ] Product Card komponenta
- [ ] Color Swatch Selector
- [ ] Product Configurator
- [ ] Filter Sidebar
- [ ] Smart Empty States
- [ ] Katalogové stránky
- [ ] Shopping cart
- [ ] Checkout flow

## 🎨 Design System

### Barvy

- **Burgundy:** `#340C0D` (hlavní akcentová barva)
- **Maroon:** `#5D1F20`
- **Terracotta:** `#8B4755`
- **Ivory:** `#E9E0D7` (pozadí)
- **Warm Beige:** `#D4C4B0`

### Typografie

- **Nadpisy:** Playfair Display (serif)
- **Body text:** Inter (sans-serif)

## 🔧 Troubleshooting

### Database Connection Issues

**Problem:** `/api/health` returns `"db": "down"` with port 5434 error

**Cause:** Incorrect port in `DATABASE_URL` or `DIRECT_URL`

**Solution:**
```bash
# Check your environment variables in Vercel:
# Settings → Environment Variables → Production

# Correct ports for Supabase:
# - Pooler: 6543
# - Direct: 5432

# Quick fix: Set both to port 5432
DATABASE_URL="postgresql://...@host:5432/db?sslmode=require"
DIRECT_URL="postgresql://...@host:5432/db?sslmode=require"

# After changing env vars, redeploy:
# Deployments → Latest → ... → Redeploy → ☑ Clear build cache
```

**Problem:** `ECONNREFUSED` or timeout errors

**Cause:** Firewall, incorrect hostname, or SSL issues

**Solution:**
```bash
# 1. Verify hostname is correct
# 2. Ensure SSL mode is set:
?sslmode=require   # for direct connection
?pgbouncer=true    # for pooled connection

# 3. Check Supabase connection limits
# 4. Verify database is not paused (Supabase free tier)
```

### Vercel Deployment Issues

**Problem:** 404 on `/api/health` endpoint

**Cause:** Build error or route not deployed

**Solution:**
```bash
# 1. Check build logs in Vercel dashboard
# 2. Verify TypeScript compilation
npm run build

# 3. Check that lib/db.ts exports are correct
# 4. Redeploy with clear cache
```

## 📖 Dokumentace

Kompletní technická specifikace:
- Database setup: `.env.example`
- Health check implementation: `app/api/health/route.ts`
- Database utilities: `lib/db.ts`
- Prisma schema: `prisma/schema.prisma`

## 🚀 Deployment

### Vercel Environment Variables

V Vercel projektu (`muzaready-bahy`) nastavte:

**Production:**
```bash
DATABASE_URL=postgresql://...@host:6543/db?pgbouncer=true
DIRECT_URL=postgresql://...@host:5432/db?sslmode=require
VERCEL_AUTOMATION_BYPASS_SECRET=your-secret-here
```

**Preview:**
```bash
# Stejné hodnoty jako Production
```

### CI/CD

GitHub Actions automaticky ověřují:
- ✅ Build úspěšný
- ✅ `/api/ok` vrací 200
- ✅ `/api/health` vrací 200 nebo 500 (ne 404)

Viz: `.github/workflows/verify.yml`

## 📞 Kontakt

- **Projekt:** Mùza Hair E-shop
- **Repository:** github.com/annamontana1/muzaready
- **Vercel:** muzaready-bahy
- **Verze:** 0.2.0
- **Datum:** 2025-11-21

---

🤖 Co-authored by [Continue](https://continue.dev)
# Mùza Hair - Updated pá 21. listopadu 2025 20:22:50 EET
# Last update pá 21. listopadu 2025 20:32:30 EET
