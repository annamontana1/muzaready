import { MetadataRoute } from 'next';
import { getCatalogProducts } from '@/lib/catalog-adapter';
import { blogArticles } from '@/lib/blog-articles';
import { MESTA } from '@/lib/mesta';

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
    { url: `${baseUrl}/vlasy-k-prodlouzeni/baby-shades`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },

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
    { url: `${baseUrl}/ceny-aplikaci`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-praha`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/cenik-prodlouzeni-vlasu-praha`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/dodavatel-vlasu-pro-salony`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/vlasy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
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
    { url: `${baseUrl}/informace/odstoupeni-od-smlouvy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/informace/nas-pribeh`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },

    // Showroom, recenze, panenské vlasy stránky
    { url: `${baseUrl}/showroom`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/recenze`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/panenenske-vlasy-praha`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/ceske-vlasy-na-prodlouzeni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/evropske-vlasy-na-prodlouzeni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/slovanske-vlasy-na-prodlouzeni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/luxusni-vlasy-na-prodlouzeni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/koupit-vlasy-na-prodlouzeni-praha`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/cenik-vlasu-na-prodlouzeni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni-praha`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/katalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },

    // Nebarvené vlasy subpages
    { url: `${baseUrl}/vlasy-k-prodlouzeni/nebarvene-panenske`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/nebarvene-panenske/standard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/nebarvene-panenske/luxe`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },

    // Barvené vlasy
    { url: `${baseUrl}/vlasy-k-prodlouzeni/barvene-vlasy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/barvene-vlasy/standard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/barvene-vlasy/luxe`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },

    // Příčesky subpages
    { url: `${baseUrl}/pricesky-a-paruky/clip-in-vlasy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricesky-a-paruky/clip-in-ofiny`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricesky-a-paruky/clip-in-culiky`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricesky-a-paruky/vlasove-tresy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pricesky-a-paruky/prave-paruky`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

    // Příslušenství
    { url: `${baseUrl}/prislusenstvi`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/prislusenstvi/keratin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/prislusenstvi/hrebeny`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/prislusenstvi/kosmetika`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/prislusenstvi/pomykadlo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/prislusenstvi/ostatni`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },

    // Geo stránky prodloužení vlasů
    { url: `${baseUrl}/prodlouzeni-vlasu-brno`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/prodlouzeni-vlasu-ostrava`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/prodlouzeni-vlasu-plzen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-karlovy-vary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-usti-nad-labem`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-liberec`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-hradec-kralove`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-pardubice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-jihlava`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-ceske-budejovice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-olomouc`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-zlin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-most`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-opava`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-frydek-mistek`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-teplice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-decin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-chomutov`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-prerov`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-karvina`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-znojmo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-mlada-boleslav`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-prostejov`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-havirov`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-kladno`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-pribram`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-kolin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/prodlouzeni-vlasu-melnik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-beroun`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-rakovnik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-benesov`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-nymburk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-kutna-hora`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-dobris`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-ricany`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-brandys-nad-labem`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-neratovice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-kralupy-nad-vltavou`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-slany`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/prodlouzeni-vlasu-celakovice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },

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

  // City product pages
  const cityPages: MetadataRoute.Sitemap = MESTA.map((m) => ({
    url: `${baseUrl}/vlasy/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Blog articles
  const blogPages = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...cityPages, ...blogPages];
}
