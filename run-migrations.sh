#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# SPUŠTĚNÍ PRISMA MIGRACÍ DO SUPABASE
# ═══════════════════════════════════════════════════════════════
#
# Tento script spustí Prisma migrace a vytvoří všechny tabulky
# v Supabase databázi.
#
# POUŽITÍ:
# --------
# chmod +x run-migrations.sh
# ./run-migrations.sh
#
# ═══════════════════════════════════════════════════════════════

echo "🔧 Spouštím Prisma migrace do Supabase..."
echo ""

# Nastavení environment variables
export DATABASE_URL="postgresql://postgres:amobenecanto8A@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?schema=public"
export DIRECT_URL="$DATABASE_URL"

echo "📊 Database: Supabase PostgreSQL"
echo "🔗 Host: db.bcbqrhkoosopmtrryrcy.supabase.co"
echo "🔌 Port: 5432 (Direct Connection)"
echo ""

# Spuštění migrací
echo "⏳ Spouštím npx prisma migrate deploy..."
echo ""

npx prisma migrate deploy

# Kontrola výsledku
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migrace úspěšně dokončeny!"
    echo ""
    echo "📋 Co bylo vytvořeno:"
    echo "   - AdminUser, User, Session (autentizace)"
    echo "   - Product, Variant, Sku (produkty)"
    echo "   - Order, OrderItem (objednávky)"
    echo "   - CartItem, Favorite (košík & oblíbené)"
    echo "   - StockMovement, PriceMatrix (sklad)"
    echo "   - ScanSession, ScanItem (POS skener)"
    echo "   - ExchangeRate (kurzy)"
    echo ""
    echo "🎉 Databáze je připravená pro deployment!"
    echo ""
else
    echo ""
    echo "❌ Migrace selhaly!"
    echo ""
    echo "🔍 Možné příčiny:"
    echo "   1. Database je pozastavená (zkontroluj Supabase Dashboard)"
    echo "   2. Špatné heslo v connection stringu"
    echo "   3. Firewall blokuje přístup"
    echo ""
    echo "💡 Řešení:"
    echo "   1. Otevři https://supabase.com/dashboard"
    echo "   2. Zkontroluj, že projekt 'muzaready' běží (není paused)"
    echo "   3. V Settings → Database zkontroluj connection string"
    echo "   4. Zkus spustit script znovu"
    echo ""
    exit 1
fi
