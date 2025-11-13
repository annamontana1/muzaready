# Admin Panel - Vylepšení a Opravy

## ✅ Co bylo opraveno a vylepšeno

### 1. **Autentizace**
- ✅ Nahrazena hardcoded autentizace Prisma AdminUser modelem
- ✅ Přidána podpora pro bcrypt hashování hesel
- ✅ Vytvořeny helper funkce pro admin autentizaci (`lib/admin-auth.ts`)
- ✅ Vylepšen middleware pro lepší validaci session

### 2. **API Endpointy**
- ✅ Vytvořen `/api/admin/products` - GET, POST s autentizací
- ✅ Vytvořen `/api/admin/orders` - GET, PATCH s autentizací a paginací
- ✅ Vytvořen `/api/admin/skus/[id]` - GET, PATCH, DELETE s autentizací
- ✅ Přidána autentizace do `/api/admin/skus` endpointu

### 3. **Opravené chyby**
- ✅ Opravena chyba v `app/sku-detail/[id]/page.tsx` - nyní používá správný endpoint `/api/admin/skus/${skuId}` místo `/api/admin/skus`
- ✅ Opraven admin dashboard - správně zpracovává nový formát odpovědí z API
- ✅ Vylepšena error handling v admin komponentách

### 4. **Seed Script**
- ✅ Vytvořen `prisma/seed-admin.ts` pro vytvoření admin uživatelů
- ✅ Přidán npm script `seed:admin` do package.json

## 🚀 Jak začít

### 1. Nainstalovat závislosti
```bash
npm install
```

### 2. Vytvořit admin uživatele
```bash
npm run seed:admin
```

Tím se vytvoří dva admin uživatele:
- **Admin**: `admin@muzahair.cz` / `admin123`
- **Manager**: `manager@muzahair.cz` / `manager123`

⚠️ **DŮLEŽITÉ**: V produkci změňte hesla!

### 3. Spustit vývojový server
```bash
npm run dev
```

### 4. Přihlásit se do admin panelu
1. Jděte na `http://localhost:3000/admin/login`
2. Použijte přihlašovací údaje z seed scriptu

## 📋 Nové funkce

### Admin Dashboard (`/admin`)
- Zobrazuje statistiky: produkty, objednávky, příjmy, čekající objednávky
- Zobrazuje poslední objednávky s detaily

### Správa produktů (`/admin/produkty`)
- Seznam všech produktů
- Vytváření nových produktů
- Zobrazení statistik (oblíbené, košíky)

### Správa objednávek (`/admin/objednavky`)
- Seznam všech objednávek s filtrováním
- Změna statusu objednávky přes API
- Statistiky podle statusu

### Správa skladu (`/admin/sklad`)
- Seznam všech SKU
- Vytváření nových SKU
- Detailní informace o každém SKU

### API Endpointy

#### GET `/api/admin/products`
Vrací seznam všech produktů s variantami a statistikami.

#### GET `/api/admin/orders`
Vrací seznam objednávek s paginací:
- Query parametry: `status`, `limit`, `offset`
- Formát odpovědi: `{ orders: [...], total: number, limit: number, offset: number }`

#### GET `/api/admin/skus/[id]`
Vrací detail konkrétního SKU včetně historie pohybů.

#### PATCH `/api/admin/orders`
Aktualizuje status objednávky:
```json
{
  "orderId": "order-id",
  "status": "paid" | "shipped" | "delivered" | "cancelled"
}
```

#### PATCH `/api/admin/skus/[id]`
Aktualizuje SKU (cena, sklad, viditelnost, atd.)

#### DELETE `/api/admin/skus/[id]`
Smaže SKU (pouze pokud nemá žádné objednávky)

## 🔒 Bezpečnost

- Všechny admin endpointy vyžadují autentizaci
- Hesla jsou hashována pomocí bcrypt
- Session cookies jsou validovány v middleware
- Admin uživatelé mají role (admin, manager, editor)

## 📝 Poznámky

- Admin panel je nyní plně funkční a profesionální
- Všechny chyby byly opraveny
- API endpointy jsou správně zabezpečené
- Kód je čistý a bez linter chyb

## 🔄 Další vylepšení (volitelné)

- [ ] Přidat export objednávek do CSV/Excel
- [ ] Přidat graf statistik v dashboardu
- [ ] Přidat fulltextové vyhledávání v objednávkách
- [ ] Přidat email notifikace při změně statusu objednávky
- [ ] Přidat audit log pro admin akce

