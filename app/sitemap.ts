import { MetadataRoute } from 'next';
import { getCatalogProducts } from '@/lib/catalog-adapter';
import { blogArticles } from '@/lib/blog-articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://muzahair.cz';

  // Static pages — pouze existující URL bez redirectů
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },

    // Vlasy k prodloužení
    { url: `${baseUrl}/vlasy-k-prodlouzeni`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/standard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/luxe`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/platinum-edition`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

    // Metody zakončení
    { url: `${baseUrl}/metody-zakonceni`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/metody-zakonceni/vlasy-na-keratin`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/metody-zakonceni/vlasove-tresy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/metody-zakonceni/vlasove-pasky-tape-in`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

    // Příčesky
    { url: `${baseUrl}/pricesky-a-paruky`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/pricesky-a-paruky/pricesek-na-temeno`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricesky-a-paruky/toupee`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricesky-a-paruky/paruky-na-miru`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

    // Informační stránky
    { url: `${baseUrl}/o-nas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/kontakt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/cenik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/velkoobchod`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/vykup-vlasu-pro-nemocne`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/obchodni-podminky`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sledovani-objednavky`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },

    // Informace sekce
    { url: `${baseUrl}/informace`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/informace/jak-nakupovat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/informace/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/informace/platba-a-vraceni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/informace/nas-pribeh`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },

    // Blog
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  // Dynamic product pages from database
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getCatalogProducts();
    productPages = products.map((product) => ({
      url: `${baseUrl}/produkt/${product.slug}`,
      lastModified: product.updated_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Sitemap: Failed to fetch products from DB:', error);
  }

  // Blog articles
  const blogPages = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
