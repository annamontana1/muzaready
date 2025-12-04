# 🔧 Vercel Deployment - Troubleshooting Guide

**Datum**: 2025-12-04
**Status**: Failed preview deployments (2x)
**Deployments**: hvsbrbvra, d7c2mxr8f
**Branch**: feature/orders-api

---

## ✅ Co je v pořádku

- ✅ **Local build ÚSPĚŠNÝ** (npm run build prošel bez chyb)
- ✅ **105/105 pages** vygenerováno
- ✅ **0 TypeScript errors**
- ✅ **GitHub push úspěšný** (main branch + feature/orders-api)
- ✅ Všechny soubory commitnuty

**Závěr**: Problém **NENÍ** v kódu, ale v **Vercel konfiguraci** (environment variables nebo database connection).

---

## 🔍 Co zkontrolovat ve Vercel Dashboard

### 1. Environment Variables (Nejpravděpodobnější problém) 🔴

Projekt potřebuje tyto environment variables:

#### **DATABASE_URL** (KRITICKÉ!)
```bash
DATABASE_URL="file:./prisma/dev.db"
```
nebo
```bash
DATABASE_URL="libsql://your-turso-db.turso.io"
TURSO_AUTH_TOKEN="your-token-here"
```

**Kde nastavit**:
1. Jdi na https://vercel.com/annamontana1's-projects/muzaready
2. Settings → Environment Variables
3. Přidej všechny proměnné níže

#### **Všechny potřebné environment variables**:

```bash
# Database (Turso nebo SQLite)
DATABASE_URL="libsql://lg-jevgone.aws-ap-south-1.turso.io"
TURSO_AUTH_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."

# Session Secret
SESSION_SECRET="your-random-secret-here-min-32-chars"

# GoPay (pokud používáte)
GOPAY_GATEWAY_URL="https://gw.sandbox.gopay.com"
GOPAY_CLIENT_ID="your-gopay-client-id"
GOPAY_CLIENT_SECRET="your-gopay-secret"

# Admin credentials (pokud v .env)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="$2a$..."

# Next.js
NEXT_PUBLIC_APP_URL="https://muzaready.vercel.app"
```

**Pro všechny proměnné nastav**:
- ✅ Production
- ✅ Preview
- ✅ Development

---

### 2. Build Settings

**Zkontroluj**:
- Root Directory: `.` (tečka, nebo prázdné)
- Framework Preset: `Next.js`
- Build Command: `npm run build` (nebo `next build`)
- Output Directory: `.next` (default)
- Install Command: `npm install`
- Node.js Version: `20.x` (nebo `18.x`)

---

### 3. Prisma Database Setup

Vercel potřebuje **Turso database** (ne local SQLite!).

**Postup**:

1. **Vytvoř Turso databázi** (pokud ještě nemáš):
   ```bash
   turso db create muzaready-prod
   turso db show muzaready-prod
   turso db tokens create muzaready-prod
   ```

2. **Zkopíruj connection details**:
   - Database URL: `libsql://muzaready-prod-xxxxx.turso.io`
   - Auth Token: `eyJhbGciOiJFZERTQSI6IkpXVCJ9...`

3. **Nastav ve Vercel**:
   - DATABASE_URL = Turso database URL
   - TURSO_AUTH_TOKEN = Turso token

4. **Push schema do Turso**:
   ```bash
   DATABASE_URL="libsql://muzaready-prod-xxxxx.turso.io" \
   TURSO_AUTH_TOKEN="your-token" \
   npx prisma db push
   ```

---

### 4. Deployment Logs (Kde najít chybu)

**Postup**:
1. Jdi na https://vercel.com/annamontana1's-projects/muzaready
2. Klikni na **Deployments** tab
3. Najdi failed deployment (hvsbrbvra nebo d7c2mxr8f)
4. Klikni na deployment → **View Build Logs**
5. Hledej červený text s chybou

**Časté chyby a řešení**:

| Chybová zpráva | Problém | Řešení |
|----------------|---------|--------|
| `DATABASE_URL is not defined` | Chybí env variable | Přidej DATABASE_URL ve Vercel Settings |
| `PrismaClient could not connect` | Špatná database URL | Zkontroluj Turso URL a token |
| `Session secret is required` | Chybí SESSION_SECRET | Přidej SESSION_SECRET (min 32 chars) |
| `Build exceeded maximum duration` | Build timeout | Optimalizuj build nebo zvedni limit |
| `Cannot find module` | Chybí npm package | npm install a commit package-lock.json |

---

### 5. Rychlá oprava: Re-deploy

**Pokud jsi nastavil environment variables**:

1. Jdi na Deployments tab
2. Najdi poslední successful deployment (nebo jakýkoliv)
3. Klikni "..." menu → **Redeploy**
4. Zaškrtni "Use existing Build Cache" (rychlejší)
5. Klikni **Redeploy**

---

## 📝 Checklist pro kolegu

Projdi tento checklist:

- [ ] 1. Zkontroloval jsem **Environment Variables** ve Vercel Settings
- [ ] 2. Přidal jsem **DATABASE_URL** (Turso)
- [ ] 3. Přidal jsem **TURSO_AUTH_TOKEN**
- [ ] 4. Přidal jsem **SESSION_SECRET**
- [ ] 5. Všechny env variables jsou nastaveny pro **Production + Preview**
- [ ] 6. Zkontroloval jsem **Build Logs** ve failed deployment
- [ ] 7. Build Settings mají správný **Node.js version** (20.x)
- [ ] 8. Turso databáze je vytvořená a obsahuje schema (npx prisma db push)
- [ ] 9. Zkusil jsem **Re-deploy** po nastavení env variables
- [ ] 10. Re-deploy byl **úspěšný** ✅

---

## 🎯 Nejpravděpodobnější problém

**90% pravděpodobnost**: **Chybí DATABASE_URL nebo TURSO_AUTH_TOKEN**.

**Řešení**:
1. Vytvoř Turso databázi (nebo použij existující)
2. Přidej DATABASE_URL a TURSO_AUTH_TOKEN ve Vercel
3. Re-deploy

---

## 🚀 Alternativa: Deploy na jinou platformu

Pokud Vercel nefunguje, můžeš zkusit:

### **Netlify** (jednodušší pro Next.js)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### **Railway** (automatická Postgres databáze)
- https://railway.app
- Connect GitHub repo
- Automaticky detekuje Next.js
- Poskytuje Postgres zdarma

### **Cloudflare Pages** (rychlé)
- https://pages.cloudflare.com
- Connect GitHub
- Funguje s Turso databází

---

## 📞 Kontakt na řešení

Pokud problém přetrvává:

1. **Screenshot Build Logs**: Pošli screenshot červených chyb
2. **Vercel URL**: Pošli odkaz na failed deployment
3. **Environment Variables**: Zkontroluj, že všechny jsou nastaveny

---

## ✅ Po opravě

Až deployment projde:

1. Otevři https://muzaready.vercel.app
2. Zkontroluj základní funkce:
   - [ ] Homepage načte
   - [ ] Admin login funguje
   - [ ] Orders list načte
   - [ ] Detail objednávky funguje
3. Smoke test hlavních features ✅

---

**Vytvořeno**: 2025-12-04
**Status**: Awaiting Vercel config fix by teammate
**Local build**: ✅ SUCCESSFUL
**Waiting for**: Environment variables setup in Vercel
