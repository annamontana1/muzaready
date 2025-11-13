# PR: Audit Fixes & Catalog Sklad Integration

## ✅ Dokončené úkoly

### 1. Diagnostika a opravy chyb
- ✅ Opravena hydration chyba v `/pokladna/potvrzeni` - přidán Suspense boundary pro useSearchParams
- ✅ Opraven ProductCard - button přesunut mimo Link pro správnou hydrataci
- ✅ Build prochází bez chyb (`npm run build`)

### 2. Catalog Adapter
- ✅ Vytvořen `lib/catalog-adapter.ts` - adapter pro převod SKU ze skladu na Product Card View Model
- ✅ Implementována logika pro VlasyX (Standard/LUXE) - BULK_G s výpočtem zásoby po délkách
- ✅ Implementována logika pro VlasyY (Platinum) - PIECE_BY_WEIGHT s inStock kontrolou
- ✅ Fallback délky pro rychlé "Do košíku" (100g): 45 → 40 → 50 → 55 → 60 → 65 → 70 → 75 → 80

## 📝 Změněné soubory

### Kritické opravy
- `app/pokladna/potvrzeni/page.tsx` - Suspense boundary
- `components/ProductCard.tsx` - button mimo Link

### Nové soubory
- `lib/catalog-adapter.ts` - catalog adapter pro sklad

### Ostatní změny
- `app/admin/*` - vylepšení admin panelu
- `app/api/admin/*` - nové API endpointy
- `lib/admin-auth.ts` - autentizace
- `prisma/seed-admin.ts` - seed script pro admin uživatele

## 🚀 Jak pokračovat

### 1. Push větve
```bash
git push -u origin feature/audit-fixes-catalog-sklad
```

### 2. Vytvořit PR na GitHubu
- Base: `main`
- Compare: `feature/audit-fixes-catalog-sklad`
- Title: "fix: Audit fixes & Catalog Sklad integration"
- Description: Vložit obsah tohoto souboru

### 3. Checklist pro PR
- [ ] Build prochází (npm run build) bez chyb ✅
- [ ] /vlasy-k-prodlouzeni (a Nebarvené/Barvené) vypadají jako původní web; filtry fungují (Délka jen pro čisté Platinum) - ⚠️ ČÁSTEČNĚ (adapter vytvořen, ale stránky ještě nejsou napojené)
- [ ] Karta je klikací; CTA funguje; žádný <button> uvnitř <Link> ✅
- [ ] VlasyX z karty přidají 100 g s fallback délkou; při nedostupnosti „Dočasně vyprodáno“ + „Zadat poptávku“ - ⚠️ ČÁSTEČNĚ (adapter má logiku, ale UI ještě není napojené)
- [ ] PDP VlasyX (Délka+Gramáž+Zakončení) a PDP VlasyY (jen Zakončení) fungují - ⚠️ ČÁSTEČNĚ
- [ ] Košík u VlasyX bez +/- a zobrazuje parametry řádku správně - ⚠️ ČÁSTEČNĚ
- [ ] Badge oblíbených/košíku se aktualizují bez refresh - ⚠️ ČÁSTEČNĚ

## ⚠️ Poznámka

Tato PR obsahuje základní opravy a vytvoření adapteru. Pro plnou funkcionalitu je potřeba:
1. Vytvořit API endpoint `/api/catalog` který použije `getCatalogProducts()`
2. Napojit stránky `/vlasy-k-prodlouzeni/*` na tento endpoint místo `mockProducts`
3. Upravit filtry - Délka jen pro Platinum
4. Upravit košík pro VlasyX (bez +/-, správné zobrazení parametrů)
5. Upravit ProductCard pro rychlé "Do košíku" s fallback délkou

## 📊 Build výsledek

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (82/82)
```

Build prochází bez chyb!

