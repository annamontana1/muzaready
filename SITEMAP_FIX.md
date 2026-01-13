# 🔧 Sitemap Fix - Vercel Cache Clear

## 🚨 Problém

Google Search Console hlásí chyby v sitemap:
```
Adresa URL není povolena
58 výskytů
https://muza-hair-shop.vercel.app (stará doména)
```

**Root Cause:** Vercel build cache používal starou verzi `sitemap.ts`

---

## ✅ Řešení

### 1. Force Rebuild (HOTOVO ✅)

```bash
git commit --allow-empty -m "chore: Force Vercel rebuild"
git push origin main
```

**Co se stalo:**
- ✅ Empty commit vytvořen
- ✅ Push do main triggernul Vercel deployment
- ✅ Nový build invaliduje cache
- ✅ Sitemap se vygeneruje s novými URLs

---

## 🧪 Ověření (Po ~5 minutách)

### Krok 1: Zkontroluj živou sitemap

**Otevři v browseru:**
```
https://www.muzahair.cz/sitemap.xml
```

**Co hledat:**
```xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.muzahair.cz/</loc>  <!-- ✅ SPRÁVNĚ -->
    <lastmod>...</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.muzahair.cz/vlasy-k-prodlouzeni</loc>  <!-- ✅ SPRÁVNĚ -->
    ...
  </url>
</urlset>
```

**❌ Pokud stále vidíš:**
```xml
<loc>https://muza-hair-shop.vercel.app/</loc>  <!-- ❌ ŠPATNĚ -->
```

**→ Počkej dalších 5 minut na dokončení buildu**

---

### Krok 2: Vercel Dashboard

**URL:** https://vercel.com/dashboard

**Zkontroluj:**
1. Poslední deployment má status: **"Ready"** ✅
2. Deployment time: měl by být **po 13.01.2026 cca teď**
3. Commit message: `"chore: Force Vercel rebuild - clear sitemap cache"`

**Pokud deployment selhává:**
```bash
# Zkontroluj build logy na Vercelu
# Měl by být "Build Completed" bez erroru
```

---

### Krok 3: Google Search Console (Po 24 hodinách)

**URL:** https://search.google.com/search-console

**Postup:**
1. Sitemaps → Klikni na: `https://www.muzahair.cz/sitemap.xml`
2. Klikni: **"TEST SITEMAP"** (vpravo nahoře)
3. Počkej ~1 minutu na test
4. Zkontroluj výsledky:
   - ✅ **Objevené stránky: 69**
   - ✅ **Chyby: 0**
   - ❌ Pokud stále chyby → Re-submit sitemap (viz níže)

---

## 🔄 Re-submit Sitemap v GSC

**Pokud po 24h stále vidíš chyby:**

### Krok 1: Odeber starou sitemap
```
1. GSC → Sitemaps
2. Najdi: https://www.muzahair.cz/sitemap.xml
3. Klikni na tři tečky (⋮) → "Remove sitemap"
4. Potvrď
```

### Krok 2: Přidej novou sitemap
```
1. GSC → Sitemaps → "Add a new sitemap"
2. Zadej: sitemap.xml
3. Klikni: "Submit"
4. Počkej 1-2 dny na re-crawl
```

---

## 🎯 Timeline

| Čas | Co se děje |
|-----|------------|
| **0 min** | Push force rebuild commit ✅ |
| **~3 min** | Vercel začne build |
| **~5 min** | Build dokončen, nová sitemap live |
| **+10 min** | Zkontroluj www.muzahair.cz/sitemap.xml |
| **+24 hod** | GSC re-crawl, měly by zmizet chyby |
| **+1 týden** | Všech 69 stránek indexováno |

---

## 📊 Očekávané výsledky

### Před fixem:
```
❌ Adresa URL není povolena: 58 výskytů
❌ https://muza-hair-shop.vercel.app (stará doména)
```

### Po fixu:
```
✅ Objevené stránky: 69
✅ Objevená videa: 0
✅ Chyby: 0
✅ Všechny URLs: https://www.muzahair.cz/*
```

---

## 🔍 Debug Commands

### Zkontroluj lokální kód:
```bash
grep "baseUrl" app/sitemap.ts
# Mělo by vrátit: const baseUrl = 'https://www.muzahair.cz';
```

### Zkontroluj živou sitemap:
```bash
curl https://www.muzahair.cz/sitemap.xml | grep "<loc>" | head -5
# Mělo by obsahovat: www.muzahair.cz (ne muza-hair-shop.vercel.app)
```

### Zkontroluj robots.txt:
```bash
curl https://www.muzahair.cz/robots.txt | grep Sitemap
# Mělo by vrátit: Sitemap: https://www.muzahair.cz/sitemap.xml
```

---

## ⚠️ Možné problémy

### Problem 1: Deployment stuck
**Symptom:** Vercel deployment běží > 10 minut
**Fix:** Cancel deployment a re-deploy manuálně

### Problem 2: Sitemap stále stará
**Symptom:** Po 10 minutách stále staré URLs
**Fix:**
```bash
# Hard cache clear na Vercelu
vercel --prod --force
```

### Problem 3: GSC nevidí změny
**Symptom:** Po 48 hodinách stále chyby
**Fix:** Re-submit sitemap (viz výše)

---

## ✅ Checklist

- [x] Force rebuild commit vytvořen
- [x] Push do GitHub
- [ ] **Počkat 5 minut**
- [ ] **Zkontrolovat www.muzahair.cz/sitemap.xml**
- [ ] **Ověřit Vercel deployment status**
- [ ] **Za 24h: Test sitemap v GSC**
- [ ] **Za 1 týden: Všech 69 stránek indexováno**

---

## 📌 Poznámky

**Proč se to stalo?**
- Vercel cachuje build output včetně dynamicky generovaných souborů
- `sitemap.ts` se spouští během buildu
- Změna v kódu neznamená automaticky invalidaci cache
- Empty commit force triggernul plný rebuild

**Prevence do budoucna:**
- Environment variable `NEXT_PUBLIC_SITE_URL` pro baseUrl
- Nebo: Force rebuild po každé změně domény

---

**Status:** 🟡 Waiting for Vercel deployment
**ETA:** ~5 minut
**Created:** 2026-01-13
