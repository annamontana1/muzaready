# 🗺️ Professional Sitemap Documentation

Kompletní sitemap implementace pro Mùza Hair Shop s optimalizací pro Google SEO.

---

## 📊 Statistiky

| Kategorie | Počet URL | Priority | Change Frequency |
|-----------|-----------|----------|------------------|
| Homepage | 1 | 1.0 | daily |
| Main Categories | 2 | 0.9 | daily |
| Sub-Categories | 5 | 0.8 | daily/weekly |
| Tier Pages | 6 | 0.7 | weekly |
| Metody Zakončení | 3 | 0.7 | monthly |
| Příčesky a Paruky | 10 | 0.6 | monthly |
| Příslušenství | 6 | 0.5 | monthly |
| **Dynamic Products** | **~20+** | **0.7** | **weekly** |
| Marketing | 4 | 0.6 | monthly/weekly |
| Info Pages | 8 | 0.5 | monthly |
| Legal Pages | 4 | 0.4 | yearly |
| **CELKEM** | **~69+** | - | - |

---

## 🎯 Priority Struktura

### Priority 1.0 - Homepage
```typescript
/ - Homepage (daily updates)
```

### Priority 0.9 - Main Category Pages
```typescript
/vlasy-k-prodlouzeni - Hlavní kategorie (daily)
/katalog            - Katalog produktů (daily)
```

### Priority 0.8 - Sub-Category Pages
```typescript
/vlasy-k-prodlouzeni/nebarvene-panenske - Nebarvené (daily)
/vlasy-k-prodlouzeni/barvene-vlasy      - Barvené (daily)
/pricesky-a-paruky                       - Příčesky (weekly)
/metody-zakonceni                        - Metody (weekly)
/prislusenstvi                           - Příslušenství (weekly)
```

### Priority 0.7 - Tier Pages & Products
```typescript
// Nebarvené tier pages
/vlasy-k-prodlouzeni/nebarvene-panenske/standard
/vlasy-k-prodlouzeni/nebarvene-panenske/luxe
/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition

// Barvené tier pages
/vlasy-k-prodlouzeni/barvene-vlasy/standard
/vlasy-k-prodlouzeni/barvene-vlasy/luxe
/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition

// Dynamic products (from database)
/produkt/{slug} - ~20+ products (weekly)
```

### Priority 0.6 - Marketing & Příčesky
```typescript
// Marketing
/velkoobchod                   - B2B program (monthly)
/vykup-vlasu-pro-nemocne      - Charity (monthly)
/cenik                        - Ceník (monthly)
/recenze                      - Recenze (weekly)

// Příčesky categories (10 pages)
/pricesky-a-paruky/ofiny-z-pravych-vlasu
/pricesky-a-paruky/toupee
/pricesky-a-paruky/prave-paruky
... +7 more
```

### Priority 0.5 - Info & Příslušenství
```typescript
// Info pages
/o-nas                        - O nás
/kontakt                      - Kontakt
/informace/faq               - FAQ
/informace/jak-nakupovat     - Jak nakupovat
... +4 more

// Příslušenství (6 pages)
/prislusenstvi/keratin
/prislusenstvi/tavici-kleste
... +4 more
```

### Priority 0.4 - Legal Pages
```typescript
/obchodni-podminky           - Obchodní podmínky (yearly)
/ochrana-osobnich-udaju      - GDPR (yearly)
/cookies                     - Cookies (yearly)
/reklamace                   - Reklamace (yearly)
```

---

## 📈 Change Frequency Strategie

### Daily (denní změny)
- **Homepage** - fresh content, new products
- **Main categories** - stock updates
- **Top sub-categories** - product availability

### Weekly (týdenní změny)
- **Products** - stock, prices
- **Tier pages** - new arrivals
- **Recenze** - new reviews

### Monthly (měsíční změny)
- **Metody zakončení** - static content
- **Příčesky** - seasonal updates
- **Marketing** - promotions
- **Info pages** - policy updates

### Yearly (roční změny)
- **Legal pages** - terms, privacy policy

---

## 🔧 Technická Implementace

### Next.js Sitemap Generation
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static pages
  const staticPages = [...];

  // 2. Dynamic products from database
  const products = await getCatalogProducts({
    isListed: true,
    inStock: true,
  });

  const productPages = products.map(product => ({
    url: `${baseUrl}/produkt/${product.slug}`,
    lastModified: product.updated_at,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 3. Combine all
  return [...staticPages, ...productPages];
}
```

### Automatická Generace
- ✅ Build time generation
- ✅ Server-side rendering
- ✅ Dynamic product inclusion
- ✅ Real-time lastModified dates
- ✅ Proper XML formatting

---

## 🚀 SEO Benefits

### 1. Complete Coverage
✅ **Všechny public stránky** jsou v sitemap
✅ **Dynamické produkty** automaticky přidány
✅ **Žádné duplicity** nebo broken links

### 2. Priority Signaling
✅ **Homepage = 1.0** - nejvyšší priorita
✅ **Kategorie = 0.9** - druhá nejvyšší
✅ **Produkty = 0.7** - důležité pro e-commerce
✅ **Legal = 0.4** - nejnižší priorita

### 3. Crawl Efficiency
✅ **Change frequency** pomáhá Google optimalizovat crawling
✅ **lastModified** indikuje fresh content
✅ **Structured hierarchy** pro lepší indexaci

### 4. Excluded Pages
❌ **Admin panel** - není v sitemap (noindex)
❌ **Auth pages** - /auth/, /kosik, /pokladna
❌ **Personalized** - /ucet, /oblibene

---

## 📝 XML Output Format

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://muza-hair-shop.vercel.app/</loc>
    <lastmod>2026-01-13T12:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://muza-hair-shop.vercel.app/vlasy-k-prodlouzeni</loc>
    <lastmod>2026-01-13T12:00:00.000Z</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- ... more URLs -->
</urlset>
```

---

## 🧪 Testing & Verification

### 1. Local Testing
```bash
npm run build
# Check output for sitemap.xml
# Visit: http://localhost:3000/sitemap.xml
```

### 2. Production Testing
```
URL: https://muza-hair-shop.vercel.app/sitemap.xml
```

### 3. Google Search Console
1. Přihlásit se do GSC
2. Sitemaps → Add a new sitemap
3. Submit: `https://muza-hair-shop.vercel.app/sitemap.xml`
4. Počkat 1-2 týdny na indexaci

### 4. Validation Tools
- https://www.xml-sitemaps.com/validate-xml-sitemap.html
- https://search.google.com/search-console/sitemaps
- https://validator.w3.org/

---

## 📌 robots.txt Integration

```txt
# public/robots.txt
User-agent: *
Allow: /

# Disallow admin/internal pages
Disallow: /api/
Disallow: /admin/
Disallow: /auth/
Disallow: /kosik
Disallow: /pokladna
Disallow: /ucet
Disallow: /oblibene

# Sitemap location
Sitemap: https://muza-hair-shop.vercel.app/sitemap.xml
```

---

## 🔄 Update Strategy

### Automatic Updates
- ✅ **Build time** - sitemap regenerated on every deployment
- ✅ **Product changes** - automatically reflected
- ✅ **New pages** - manually add to sitemap.ts

### Manual Updates Needed When:
- 🔧 Adding new category pages
- 🔧 Adding new info pages
- 🔧 Changing URL structure
- 🔧 Major site reorganization

---

## ✅ Checklist

- [x] Homepage (priority 1.0)
- [x] Main categories (priority 0.9)
- [x] Sub-categories (priority 0.8)
- [x] Tier pages (priority 0.7)
- [x] Dynamic products from database
- [x] Metody zakončení (3 pages)
- [x] Příčesky a paruky (10 pages)
- [x] Příslušenství (6 pages)
- [x] Marketing pages (4 pages)
- [x] Info pages (8 pages)
- [x] Legal pages (4 pages)
- [x] Change frequency optimization
- [x] Priority hierarchy
- [x] lastModified dates
- [x] Excluded admin/auth pages
- [x] robots.txt integration

---

## 📚 Resources

- [Google Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Next.js Sitemap Generation](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Sitemap XML Protocol](https://www.sitemaps.org/protocol.html)

---

**Created:** 2026-01-13
**Author:** Claude Code Implementation
**Status:** ✅ Production Ready
**URL:** https://muza-hair-shop.vercel.app/sitemap.xml
