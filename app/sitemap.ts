import { MetadataRoute } from 'next';
import { getCatalogProducts } from '@/lib/catalog-adapter';

/**
 * Professional Sitemap for Mùza Hair Shop
 *
 * Structure:
 * - Priority 1.0: Homepage
 * - Priority 0.9: Main category pages
 * - Priority 0.8: Sub-category pages & catalog
 * - Priority 0.7: Products, tier pages
 * - Priority 0.6: Marketing pages (velkoobchod, blog)
 * - Priority 0.5: Info pages (FAQ, kontakt)
 * - Priority 0.4: Legal pages
 *
 * Change Frequency:
 * - daily: Homepage, main categories, catalog
 * - weekly: Products, sub-categories
 * - monthly: Info pages, marketing
 * - yearly: Legal pages
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://muza-hair-shop.vercel.app';
  const currentDate = new Date();

  // ========================================
  // 1. HOMEPAGE (Priority 1.0)
  // ========================================
  const homepage: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // ========================================
  // 2. MAIN CATEGORIES (Priority 0.9)
  // ========================================
  const mainCategories: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/katalog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // ========================================
  // 3. SUB-CATEGORIES (Priority 0.8)
  // ========================================
  const subCategories: MetadataRoute.Sitemap = [
    // Nebarvené panenské vlasy
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni/nebarvene-panenske`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Barvené blond vlasy
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni/barvene-vlasy`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Příčesky a paruky
    {
      url: `${baseUrl}/pricesky-a-paruky`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Metody zakončení
    {
      url: `${baseUrl}/metody-zakonceni`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Příslušenství
    {
      url: `${baseUrl}/prislusenstvi`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // ========================================
  // 4. TIER PAGES (Priority 0.7)
  // ========================================
  const tierPages: MetadataRoute.Sitemap = [
    // Nebarvené - Standard
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni/nebarvene-panenske/standard`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Nebarvené - LUXE
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni/nebarvene-panenske/luxe`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Nebarvené - Platinum Edition
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Barvené - Standard
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni/barvene-vlasy/standard`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Barvené - LUXE
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni/barvene-vlasy/luxe`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Barvené - Platinum Edition
    {
      url: `${baseUrl}/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // ========================================
  // 5. METODY ZAKONČENÍ (Priority 0.7)
  // ========================================
  const metodyZakonceni: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/metody-zakonceni/vlasy-na-keratin`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/metody-zakonceni/pasky-nano-tapes`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/metody-zakonceni/vlasove-tresy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // ========================================
  // 6. PŘÍČESKY A PARUKY (Priority 0.6)
  // ========================================
  const pricesky: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pricesky-a-paruky/ofiny-z-pravych-vlasu`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/toupee`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/prave-paruky`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/paruky-na-miru`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/pricesek-na-temeno`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/vlasove-tresy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/clip-in-vlasy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/clip-in-culik`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/clip-in-culiky`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/pricesky-a-paruky/clip-in-ofiny`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // ========================================
  // 7. PŘÍSLUŠENSTVÍ (Priority 0.5)
  // ========================================
  const prislusenstvi: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/prislusenstvi/keratin`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/prislusenstvi/tavici-kleste`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/prislusenstvi/pomykadlo`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/prislusenstvi/hrebeny`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/prislusenstvi/kosmetika`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/prislusenstvi/ostatni`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // ========================================
  // 8. DYNAMIC PRODUCTS (Priority 0.7)
  // ========================================
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getCatalogProducts({
      isListed: true,
      inStock: true,
    });

    productPages = products.map((product) => ({
      url: `${baseUrl}/produkt/${product.slug}`,
      lastModified: product.updated_at || currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    console.log(`[Sitemap] Added ${productPages.length} products`);
  } catch (error) {
    console.warn('[Sitemap] Failed to fetch products (build time is OK):', error);
  }

  // ========================================
  // 9. MARKETING PAGES (Priority 0.6)
  // ========================================
  const marketing: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/velkoobchod`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/vykup-vlasu-pro-nemocne`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/cenik`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/recenze`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // ========================================
  // 10. INFO PAGES (Priority 0.5)
  // ========================================
  const infoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/o-nas`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/informace`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/informace/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/informace/jak-nakupovat`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/informace/nas-pribeh`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/informace/platba-a-vraceni`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/informace/odeslani-a-stav-objednavky`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // ========================================
  // 11. LEGAL PAGES (Priority 0.4)
  // ========================================
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/obchodni-podminky`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/ochrana-osobnich-udaju`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/reklamace`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // ========================================
  // COMBINE ALL
  // ========================================
  return [
    ...homepage,          // 1 page
    ...mainCategories,    // 2 pages
    ...subCategories,     // 5 pages
    ...tierPages,         // 6 pages
    ...metodyZakonceni,   // 3 pages
    ...pricesky,          // 10 pages
    ...prislusenstvi,     // 6 pages
    ...productPages,      // ~20+ dynamic products
    ...marketing,         // 4 pages
    ...infoPages,         // 8 pages
    ...legalPages,        // 4 pages
  ];
}
