# 🔧 Návod: Jak opravit login na muzaready-iota.vercel.app

## ✅ DŮLEŽITÉ: Lokální build funguje perfektně!

Právě jsem otestoval login lokálně a **funguje na 100%**:
- Status: 200 OK
- Email: admin@muzahair.cz
- Heslo: admin123
- Odpověď: `{"success": true, "message": "Přihlášení bylo úspěšné"}`

## ❌ Problém: Vercel nasazuje starou verzi

**Produkční stav:**
- `muzaready-iota.vercel.app/api/admin/login` → 405 Method Not Allowed
- `muzaready-bahy.vercel.app/api/admin/login` → 405 Method Not Allowed

## 🎯 Řešení: Manuální redeploy na Vercelu

### Krok 1: Najdi správný Vercel projekt

1. Přihlas se na https://vercel.com
2. V projektech hledej projekt s těmito parametry:
   - **Project Name**: `muzaready` (ne "muzaready-iota" nebo "muzaready-bahy")
   - **Project ID**: `prj_Ei7ELoHKFaNvrooaiAbcyjhPsLb9`
   - **Production URL**: `muzaready-iota.vercel.app`

### Krok 2: Zkontroluj Git připojení

1. Jdi na **Settings** → **Git**
2. Ověř, že je projekt připojený k:
   - Repository: `annamontana1/muzaready`
   - Branch: `main`

### Krok 3: Zkontroluj environment variables

Jdi na **Settings** → **Environment Variables** a ověř:

#### Production Variables:
```
DATABASE_URL=postgresql://postgres:tuchaw-gidqup-peVho0@db.bcbqrhkoosopmtrryrcy.supabase.co:6543/postgres?sslmode=require

DIRECT_URL=postgresql://postgres:tuchaw-gidqup-peVho0@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

**DŮLEŽITÉ**: Heslo musí být `tuchaw-gidqup-peVho0` (ne staré heslo!)

### Krok 4: Spusť manuální redeploy

1. Jdi na **Deployments**
2. Najdi nejnovější deployment
3. Klikni na tři tečky (⋯) → **Redeploy**
4. **KRITICKÉ**: Zaškrtni **"Redeploy without cache"**
   - Tím se vymaže build cache, který může obsahovat staré bcryptjs
5. Klikni **Redeploy**

### Krok 5: Sleduj deployment log

V logu zkontroluj, že:
- ✅ Build dokončí bez chyb
- ✅ `bcrypt` se nainstaluje (ne `bcryptjs`)
- ✅ Prisma se připojí k databázi
- ✅ Vygeneruje se `routes-manifest.json`

## 🔍 Co bylo opraveno v main branch

### Commit 5c1a2a5: Fixed bcrypt imports
```typescript
// Opraveno v těchto souborech:
// - lib/admin-auth.ts
// - app/api/admin/debug-login/route.ts
// - app/api/admin/login-test/route.ts

// BEFORE:
import bcryptjs from 'bcryptjs';

// AFTER:
import bcrypt from 'bcrypt';
```

### Commit 1361a8d: Added standalone output
```javascript
// next.config.mjs
const nextConfig = {
  output: 'standalone',  // ← Přidáno
  eslint: { ignoreDuringBuilds: true },
  // ...
}
```

### Commit b4da537: Force redeploy trigger
- Přidán soubor `force-redeploy.txt` pro trigger

## 🧪 Testování po nasazení

Po úspěšném deploy otestuj:

```bash
curl -X POST https://muzaready-iota.vercel.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@muzahair.cz","password":"admin123"}'
```

**Očekávaná odpověď:**
```json
{
  "success": true,
  "message": "Přihlášení bylo úspěšné",
  "admin": {
    "name": "Administrator",
    "email": "admin@muzahair.cz",
    "role": "admin"
  }
}
```

## 🆘 Pokud stále nefunguje

### Možnost A: Auto-deployment je vypnutý

1. **Settings** → **Git** → zkontroluj **"Auto-deploy"**
2. Pokud je vypnutý, zapni ho

### Možnost B: Webhook je rozbitý

1. **Settings** → **Git** → **Deploy Hooks**
2. Vytvoř nový Deploy Hook
3. Spusť webhook manuálně:
   ```bash
   curl -X POST https://api.vercel.com/v1/integrations/deploy/...
   ```

### Možnost C: Špatný projekt

Pokud najdeš pouze projekty `muzaready-iota` nebo `muzaready-bahy` (ne `muzaready`):
1. Kontroluj, který projekt má správné **Project ID**: `prj_Ei7ELoHKFaNvrooaiAbcyjhPsLb9`
2. Ten projekt je ten správný, i když má jiné jméno

## 📦 Co je implementováno a čeká na deployment

Jakmile se podaří nasadit, budou živé tyto funkce:
1. ✅ Admin login (opravený)
2. ✅ SKU filtering v admin/sklad (6 filtrů)
3. ✅ Pagination (25/50/100 items)
4. ✅ URL state management (bookmarkable filters)

---

**Vytvořeno:** 2025-12-15 20:10 CET
**Poslední test:** Login funguje lokálně na 100% ✅
