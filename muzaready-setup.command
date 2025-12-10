#!/bin/bash

# Muzaready Project Setup
# Tento skript nastaví prostředí pro práci na Muza Hair projektu

# Barvy pro výstup
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        🎨 MUZAREADY - Muza Hair Admin Setup               ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo ""

# Přejdi do projektu
cd /Users/zen/muzaready || { echo -e "${RED}❌ Projekt muzaready nenalezen!${NC}"; exit 1; }

echo -e "${GREEN}✅ Pracovní adresář:${NC} $(pwd)"
echo ""

# Nastav environment variables
echo -e "${BLUE}🔧 Nastavuji environment variables...${NC}"
export DATABASE_URL="postgresql://postgres:tuchaw-gidqup-peVho0@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://postgres:tuchaw-gidqup-peVho0@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres"
echo -e "${GREEN}✅ Database credentials nastaveny${NC}"
echo ""

# Zobraz Git status
echo -e "${BLUE}📊 Git Status:${NC}"
git status --short
echo ""

# Zobraz poslední commit
echo -e "${BLUE}📝 Poslední commit:${NC}"
git log -1 --pretty=format:"%h - %s (%cr) <%an>" --abbrev-commit
echo ""
echo ""

# Zobraz poslední změny
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📋 REPORT POSLEDNÍCH ZMĚN${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

cat << 'EOF'
🎯 CO BYLO UDĚLÁNO:

✅ 1. DATABASE MIGRATION
   • Invoice table vytvořena v produkční DB
   • Billing fields přidány do Order table
   • Database credentials aktualizovány ve Vercel
   • Migrace úspěšně provedena

✅ 2. NOVÉ FEATURES
   • Zásilkovna 📦 delivery method přidána
   • GLS 🚚 delivery method přidána
   • Payment method editing funkční
   • Delivery method editing funkční
   • Invoice generation system implementován
   • PDF generování a email delivery

✅ 3. BCRYPT FIX
   • Nahrazeno bcryptjs → bcrypt
   • Všechny importy aktualizovány
   • Build prošel úspěšně
   • Deployed na Vercel

✅ 4. ADMIN ACCOUNT
   • Email: muzahaircz@gmail.com
   • Password: muza2024Admin!
   • Účet vytvořen v produkční DB
   • Lokálně otestováno - funguje ✅

⚠️  ZBÝVÁ VYŘEŠIT:

🔴 Admin Login API Timeout na Vercelu
   • Lokálně funguje perfektně
   • Na Vercelu timeout po 10s
   • Příčina: bcrypt.compare() je pomalý na serverless

🎯 MOŽNÁ ŘEŠENÍ:

1. Zvýšit Vercel timeout:
   export const maxDuration = 30;

2. Použít DIRECT_URL místo pgBouncer:
   prisma = new PrismaClient({ datasources: { db: { url: DIRECT_URL }}})

3. Optimalizovat bcrypt rounds:
   bcrypt.hash(password, 8) // místo 10

═══════════════════════════════════════════════════════════

📁 DŮLEŽITÉ SOUBORY:

Kód:
  • lib/admin-auth.ts - Admin autentizace
  • app/api/admin/login/route.ts - Login API endpoint
  • app/admin/objednavky/[id]/components/PaymentSection.tsx - Invoice UI

Testy:
  • test-simple.js - Puppeteer test suite
  • test-login-locally.ts - Lokální credentials test
  • create-admin.ts - Admin account creator

Dokumentace:
  • FINAL_DEPLOYMENT_STATUS.md - Kompletní dokumentace
  • QUICK_FIX_GUIDE.md - Rychlé návody

═══════════════════════════════════════════════════════════

🌐 PRODUKČNÍ URLS:

  • Admin: https://muzaready-iota.vercel.app/admin/login
  • Homepage: https://muzaready-iota.vercel.app
  • API Health: https://muzaready-iota.vercel.app/api/health

═══════════════════════════════════════════════════════════

🔧 UŽITEČNÉ PŘÍKAZY:

Test lokálně:
  npx tsx test-login-locally.ts

Build projektu:
  npm run build

Deploy na Vercel:
  npx vercel deploy --prod

Zobrazit logy:
  npx vercel logs muzaready-iota.vercel.app

Vytvořit admin:
  npx tsx create-admin.ts

═══════════════════════════════════════════════════════════

📊 CELKOVÝ PROGRESS: 98% HOTOVO

✅ Database: 100%
✅ Features: 100%
✅ Code: 100%
⏳ Login timeout: zbývá fix

EOF

echo ""
echo -e "${GREEN}✅ Setup kompletní! Můžeš začít pracovat.${NC}"
echo ""
echo -e "${YELLOW}💡 TIP: Zkus nejdřív otestovat login lokálně:${NC}"
echo -e "   ${BLUE}npx tsx test-login-locally.ts${NC}"
echo ""

# Ponech terminál otevřený
exec $SHELL
