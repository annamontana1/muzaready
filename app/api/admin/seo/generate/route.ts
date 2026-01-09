import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://muzahair.cz';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Fetch and extract text content from a page
async function fetchPageContent(slug: string): Promise<{
  title: string;
  headings: string[];
  text: string;
  products: string[];
}> {
  try {
    const url = `${SITE_URL}${slug}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MuzaHair-SEO-Generator/1.0',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract headings (h1, h2)
    const h1Matches = html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
    const h2Matches = html.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi);
    const headings: string[] = [];
    for (const match of h1Matches) headings.push(match[1].trim());
    for (const match of h2Matches) headings.push(match[1].trim());

    // Extract paragraph text
    const pMatches = html.matchAll(/<p[^>]*>([^<]+)<\/p>/gi);
    const paragraphs: string[] = [];
    for (const match of pMatches) {
      const text = match[1].trim();
      if (text.length > 20) paragraphs.push(text);
    }
    const text = paragraphs.slice(0, 5).join(' ');

    // Extract product names if present
    const productMatches = html.matchAll(/data-product-name="([^"]+)"/gi);
    const products: string[] = [];
    for (const match of productMatches) products.push(match[1]);

    return { title, headings, text, products };
  } catch (error) {
    console.error('Error fetching page content:', error);
    return { title: '', headings: [], text: '', products: [] };
  }
}

// Generate smart SEO based on page content
function generateSmartSeo(slug: string, content: {
  title: string;
  headings: string[];
  text: string;
  products: string[];
}, pageName: string): {
  titleCs: string;
  descriptionCs: string;
  keywordsCs: string;
  pageType: PageType;
} {
  // Determine page type from slug
  let pageType: PageType = 'article';
  if (slug === '/') pageType = 'homepage';
  else if (slug === '/o-nas' || slug.includes('pribeh')) pageType = 'about';
  else if (slug === '/kontakt' || slug.includes('showroom')) pageType = 'contact';
  else if (slug.includes('vlasy-k-prodlouzeni') || slug.includes('pricesky') || slug.includes('katalog')) pageType = 'category';
  else if (slug.includes('faq')) pageType = 'faq';
  else if (slug.includes('podminky') || slug.includes('ochrana') || slug.includes('reklamace')) pageType = 'legal';

  // Build title
  let titleCs = '';
  if (content.headings.length > 0) {
    titleCs = content.headings[0];
    if (!titleCs.includes('Mùza') && !titleCs.includes('Hair')) {
      titleCs += ' | Mùza Hair';
    }
  } else if (pageName) {
    titleCs = `${pageName} | Mùza Hair Praha`;
  } else {
    titleCs = 'Mùza Hair Praha | Pravé vlasy k prodloužení';
  }

  // Build description from content
  let descriptionCs = '';
  if (content.text && content.text.length > 50) {
    // Use actual page text, truncate to ~150 chars
    descriptionCs = content.text.substring(0, 150).trim();
    if (descriptionCs.length === 150) {
      descriptionCs = descriptionCs.substring(0, descriptionCs.lastIndexOf(' ')) + '...';
    }
  } else if (content.headings.length > 1) {
    descriptionCs = content.headings.slice(0, 3).join('. ') + '. Mùza Hair Praha.';
  } else {
    descriptionCs = `${pageName || 'Informace'} - Mùza Hair, český výrobce pravých vlasů k prodloužení. Showroom Praha.`;
  }

  // Build keywords from headings, products and slug
  const keywordSet = new Set<string>();

  // Add from slug
  const slugParts = slug.split('/').filter(Boolean);
  slugParts.forEach(part => {
    const keyword = part.replace(/-/g, ' ');
    if (keyword.length > 2) keywordSet.add(keyword);
  });

  // Add from headings
  content.headings.slice(0, 3).forEach(h => {
    const words = h.toLowerCase().split(' ').filter(w => w.length > 3);
    words.forEach(w => keywordSet.add(w));
  });

  // Add product names
  content.products.slice(0, 5).forEach(p => keywordSet.add(p.toLowerCase()));

  // Add base keywords
  keywordSet.add('Mùza Hair');
  keywordSet.add('vlasy k prodloužení');
  if (slug.includes('keratin')) keywordSet.add('keratinové vlasy');
  if (slug.includes('tape')) keywordSet.add('tape-in vlasy');
  if (slug.includes('paruky') || slug.includes('pricesky')) keywordSet.add('paruky pravé vlasy');

  const keywordsCs = Array.from(keywordSet).slice(0, 10).join(', ');

  return { titleCs, descriptionCs, keywordsCs, pageType };
}

// Page types for structured data
type PageType = 'homepage' | 'about' | 'contact' | 'category' | 'product' | 'article' | 'faq' | 'legal';

// Generate structured data based on page type
function generateStructuredData(pageType: PageType, data: {
  title: string;
  description: string;
  url: string;
  pageName: string;
}): string {
  const baseOrg = {
    "@type": "Organization",
    "name": "Mùza Hair",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Revoluční 8",
      "addressLocality": "Praha",
      "postalCode": "110 00",
      "addressCountry": "CZ"
    },
    "telephone": "+420728722880",
    "email": "info@muzahair.cz"
  };

  switch (pageType) {
    case 'homepage':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Mùza Hair",
        "url": SITE_URL,
        "description": data.description,
        "publisher": baseOrg,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${SITE_URL}/katalog?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }, null, 2);

    case 'about':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": data.title,
        "description": data.description,
        "url": data.url,
        "mainEntity": baseOrg
      }, null, 2);

    case 'contact':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": data.title,
        "description": data.description,
        "url": data.url,
        "mainEntity": {
          ...baseOrg,
          "@type": "LocalBusiness",
          "priceRange": "$$",
          "openingHours": "Mo-Fr 09:00-18:00"
        }
      }, null, 2);

    case 'category':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": data.title,
        "description": data.description,
        "url": data.url,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Mùza Hair",
          "url": SITE_URL
        }
      }, null, 2);

    case 'faq':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "name": data.title,
        "description": data.description,
        "url": data.url,
        "mainEntity": []
      }, null, 2);

    case 'article':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "description": data.description,
        "url": data.url,
        "author": baseOrg,
        "publisher": baseOrg
      }, null, 2);

    case 'legal':
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": data.title,
        "description": data.description,
        "url": data.url
      }, null, 2);

    default:
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": data.title,
        "description": data.description,
        "url": data.url
      }, null, 2);
  }
}

// SEO templates based on page type and content
const seoTemplates: Record<string, {
  titleTemplate: string;
  descriptionTemplate: string;
  keywords: string[];
  pageType: PageType;
}> = {
  '/': {
    titleTemplate: 'Mùza Hair Praha | Pravé vlasy k prodloužení | Český výrobce',
    descriptionTemplate: 'Český výrobce pravých lidských vlasů od roku 2016. Keratin, tape-in, nano tapes, paruky. Showroom Praha. Prémiová kvalita, vlastní barvírna. Dodání do 48h.',
    keywords: ['vlasy k prodloužení', 'pravé vlasy', 'prodloužení vlasů Praha', 'keratin vlasy', 'tape-in vlasy', 'český výrobce vlasů'],
    pageType: 'homepage',
  },
  '/o-nas': {
    titleTemplate: 'O nás | Mùza Hair - Český výrobce vlasů od 2016',
    descriptionTemplate: 'Jsme český výrobce pravých lidských vlasů k prodloužení. Od roku 2016 vyrábíme prémiové vlasy v naší barvírně v Praze. Kvalita a tradice.',
    keywords: ['Mùza Hair', 'český výrobce vlasů', 'vlastní barvírna Praha', 'výroba vlasů'],
    pageType: 'about',
  },
  '/kontakt': {
    titleTemplate: 'Kontakt | Mùza Hair Praha',
    descriptionTemplate: 'Kontaktujte nás - showroom Revoluční 8, Praha 1. Tel: +420 728 722 880. Osobní konzultace, výběr vlasů na míru.',
    keywords: ['kontakt Mùza Hair', 'showroom Praha', 'prodloužení vlasů Praha'],
    pageType: 'contact',
  },
  '/showroom': {
    titleTemplate: 'Showroom Praha | Mùza Hair - Revoluční 8',
    descriptionTemplate: 'Navštivte náš showroom v centru Prahy. Revoluční 8, Praha 1. Osobní konzultace, výběr vlasů, ukázka metod prodloužení. Otevřeno Po-Pá.',
    keywords: ['showroom vlasy Praha', 'prodloužení vlasů showroom', 'Mùza Hair Praha'],
    pageType: 'contact',
  },
  '/velkoobchod': {
    titleTemplate: 'Velkoobchod | Mùza Hair - B2B prodej vlasů',
    descriptionTemplate: 'Velkoobchodní prodej pravých vlasů pro salony a kadeřníky. Speciální B2B ceny, rychlé dodání, technická podpora. Staňte se partnerem.',
    keywords: ['velkoobchod vlasy', 'B2B vlasy', 'vlasy pro salony', 'dodavatel vlasů'],
    pageType: 'about',
  },
  '/vlasy-k-prodlouzeni': {
    titleTemplate: 'Vlasy k prodloužení | Mùza Hair - Pravé lidské vlasy',
    descriptionTemplate: 'Široký výběr pravých vlasů k prodloužení. Nebarvené panenské, barvené blond, keratin, tape-in, nano tapes. Standard, LUXE, Platinum kvalita.',
    keywords: ['vlasy k prodloužení', 'pravé vlasy', 'lidské vlasy', 'prodloužení vlasů'],
    pageType: 'category',
  },
  '/vlasy-k-prodlouzeni/nebarvene-panenske': {
    titleTemplate: 'Nebarvené panenské vlasy | Mùza Hair',
    descriptionTemplate: 'Prémiové nebarvené panenské vlasy k prodloužení. 100% přírodní, nechemicky ošetřené. Standard, LUXE a Platinum Edition kvalita.',
    keywords: ['nebarvené vlasy', 'panenské vlasy', 'virgin hair', 'přírodní vlasy'],
    pageType: 'category',
  },
  '/vlasy-k-prodlouzeni/nebarvene-panenske/standard': {
    titleTemplate: 'Standard nebarvené vlasy | Mùza Hair',
    descriptionTemplate: 'Nebarvené panenské vlasy Standard kvality. Přírodní lidské vlasy za dostupnou cenu. Ideální pro první prodloužení.',
    keywords: ['standard vlasy', 'nebarvené vlasy', 'levné prodloužení vlasů'],
    pageType: 'category',
  },
  '/vlasy-k-prodlouzeni/nebarvene-panenske/luxe': {
    titleTemplate: 'LUXE nebarvené vlasy | Mùza Hair',
    descriptionTemplate: 'Prémiové nebarvené vlasy LUXE kvality. Vybraná surovina, hebkost, lesk. Pro náročné zákaznice.',
    keywords: ['LUXE vlasy', 'prémiové vlasy', 'kvalitní prodloužení'],
    pageType: 'category',
  },
  '/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition': {
    titleTemplate: 'Platinum Edition nebarvené vlasy | Mùza Hair',
    descriptionTemplate: 'Nejkvalitnější nebarvené vlasy Platinum Edition. Exkluzivní surovina, maximální hebkost a lesk. Top of the line.',
    keywords: ['Platinum vlasy', 'nejlepší vlasy', 'exkluzivní prodloužení'],
    pageType: 'category',
  },
  '/vlasy-k-prodlouzeni/barvene-vlasy': {
    titleTemplate: 'Barvené vlasy k prodloužení | Mùza Hair',
    descriptionTemplate: 'Profesionálně barvené vlasy k prodloužení. Blond odstíny, ombre, baleyage. Barveno v naší pražské barvírně. Dlouhá životnost barvy.',
    keywords: ['barvené vlasy', 'blond vlasy', 'ombre vlasy', 'prodloužení vlasů'],
    pageType: 'category',
  },
  '/vlasy-k-prodlouzeni/barvene-vlasy/standard': {
    titleTemplate: 'Standard barvené vlasy | Mùza Hair',
    descriptionTemplate: 'Barvené vlasy Standard kvality. Krásné blond odstíny za dostupnou cenu.',
    keywords: ['standard blond vlasy', 'barvené vlasy levně'],
    pageType: 'category',
  },
  '/vlasy-k-prodlouzeni/barvene-vlasy/luxe': {
    titleTemplate: 'LUXE barvené vlasy | Mùza Hair',
    descriptionTemplate: 'Prémiové barvené vlasy LUXE kvality. Profesionální barvení, sytá barva, dlouhá výdrž.',
    keywords: ['LUXE barvené vlasy', 'prémiové blond vlasy'],
    pageType: 'category',
  },
  '/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition': {
    titleTemplate: 'Platinum Edition barvené vlasy | Mùza Hair',
    descriptionTemplate: 'Nejkvalitnější barvené vlasy Platinum Edition. Exkluzivní barvení, perfektní odstín.',
    keywords: ['Platinum barvené vlasy', 'nejlepší blond vlasy'],
    pageType: 'category',
  },
  '/pricesky-a-paruky': {
    titleTemplate: 'Příčesky a paruky z pravých vlasů | Mùza Hair',
    descriptionTemplate: 'Paruky a příčesky z pravých lidských vlasů. Ruční práce, přirozený vzhled. Paruky na míru, příčesky na temeno, toupee.',
    keywords: ['paruky pravé vlasy', 'příčesky', 'toupee', 'paruka na míru'],
    pageType: 'category',
  },
  '/pricesky-a-paruky/paruky-na-miru': {
    titleTemplate: 'Paruky na míru | Mùza Hair',
    descriptionTemplate: 'Individuálně vyráběné paruky na míru z pravých vlasů. Konzultace, měření, výroba. Přirozený vzhled.',
    keywords: ['paruka na míru', 'individuální paruka', 'paruka pravé vlasy'],
    pageType: 'category',
  },
  '/pricesky-a-paruky/pricesek-na-temeno': {
    titleTemplate: 'Příčesek na temeno | Mùza Hair',
    descriptionTemplate: 'Příčesky na temeno pro řídké vlasy. Diskrétní řešení, přirozený vzhled, snadná aplikace.',
    keywords: ['příčesek temeno', 'řídké vlasy řešení', 'příčesek'],
    pageType: 'category',
  },
  '/pricesky-a-paruky/toupee': {
    titleTemplate: 'Toupee z pravých vlasů | Mùza Hair',
    descriptionTemplate: 'Kvalitní toupee z pravých lidských vlasů. Pro muže i ženy. Přirozené krytí, pohodlné nošení.',
    keywords: ['toupee', 'pánské toupee', 'příčesek muži'],
    pageType: 'category',
  },
  '/metody-zakonceni': {
    titleTemplate: 'Metody prodloužení vlasů | Mùza Hair',
    descriptionTemplate: 'Přehled metod prodloužení vlasů - keratin, tape-in, nano tapes, tresy. Porovnání, výhody, péče. Vyberte si ideální metodu.',
    keywords: ['metody prodloužení vlasů', 'keratin', 'tape-in', 'nano tapes'],
    pageType: 'article',
  },
  '/metody-zakonceni/vlasy-na-keratin': {
    titleTemplate: 'Keratinové prodloužení vlasů | Mùza Hair',
    descriptionTemplate: 'Vše o keratinové metodě prodloužení vlasů. Trvalé, přirozené, diskrétní. Postup aplikace, péče, výdrž 3-6 měsíců.',
    keywords: ['keratin vlasy', 'keratinové prodloužení', 'keratin metoda'],
    pageType: 'article',
  },
  '/metody-zakonceni/pasky-nano-tapes': {
    titleTemplate: 'Nano Tape prodloužení vlasů | Mùza Hair',
    descriptionTemplate: 'Inovativní nano tape pásky pro šetrné prodloužení vlasů. Ultra tenké, neviditelné, rychlá aplikace. Ideální pro jemné vlasy.',
    keywords: ['nano tapes', 'tape-in vlasy', 'páskové prodloužení'],
    pageType: 'article',
  },
  '/metody-zakonceni/vlasove-tresy': {
    titleTemplate: 'Vlasové tresy | Mùza Hair',
    descriptionTemplate: 'Vlasové tresy pro rychlé prodloužení a objem. Clip-in, weft, genius weft. Snadná aplikace doma.',
    keywords: ['vlasové tresy', 'clip-in vlasy', 'weft'],
    pageType: 'article',
  },
  '/informace/faq': {
    titleTemplate: 'Časté dotazy (FAQ) | Mùza Hair',
    descriptionTemplate: 'Odpovědi na nejčastější otázky o prodloužení vlasů, péči, objednávkách a dopravě. Vše co potřebujete vědět.',
    keywords: ['FAQ vlasy', 'otázky prodloužení vlasů', 'péče o prodloužené vlasy'],
    pageType: 'faq',
  },
  '/informace/jak-nakupovat': {
    titleTemplate: 'Jak nakupovat | Mùza Hair',
    descriptionTemplate: 'Průvodce nákupem na Mùza Hair. Jak vybrat správné vlasy, délku, množství. Postup objednávky, platba, dodání.',
    keywords: ['jak nakupovat vlasy', 'výběr vlasů', 'objednávka vlasů'],
    pageType: 'article',
  },
  '/informace/platba-a-vraceni': {
    titleTemplate: 'Platba a vrácení | Mùza Hair',
    descriptionTemplate: 'Informace o platebních metodách a podmínkách vrácení zboží. GoPay, bankovní převod, dobírka.',
    keywords: ['platba vlasy', 'vrácení zboží', 'reklamace'],
    pageType: 'legal',
  },
  '/informace/odeslani-a-stav-objednavky': {
    titleTemplate: 'Odeslání a stav objednávky | Mùza Hair',
    descriptionTemplate: 'Informace o dopravě a sledování objednávky. Zásilkovna, PPL, osobní odběr. Dodání do 48 hodin.',
    keywords: ['doprava vlasy', 'sledování objednávky', 'zásilkovna'],
    pageType: 'article',
  },
  '/informace/obchodni-podminky': {
    titleTemplate: 'Obchodní podmínky | Mùza Hair',
    descriptionTemplate: 'Obchodní podmínky e-shopu Mùza Hair. Nákup, platba, dodání, reklamace, vrácení zboží.',
    keywords: ['obchodní podmínky', 'Mùza Hair podmínky'],
    pageType: 'legal',
  },
  '/informace/ochrana-osobnich-udaju': {
    titleTemplate: 'Ochrana osobních údajů | Mùza Hair',
    descriptionTemplate: 'Zásady ochrany osobních údajů. GDPR, zpracování dat, cookies. Vaše soukromí je pro nás prioritou.',
    keywords: ['ochrana údajů', 'GDPR', 'soukromí'],
    pageType: 'legal',
  },
  '/informace/nas-pribeh': {
    titleTemplate: 'Náš příběh | Mùza Hair',
    descriptionTemplate: 'Příběh značky Mùza Hair. Jak jsme začínali, naše hodnoty a vize do budoucna.',
    keywords: ['příběh Mùza Hair', 'historie', 'o značce'],
    pageType: 'about',
  },
  '/recenze': {
    titleTemplate: 'Recenze zákazníků | Mùza Hair',
    descriptionTemplate: 'Přečtěte si recenze spokojených zákazníků Mùza Hair. Skutečné zkušenosti s našimi vlasy a službami.',
    keywords: ['recenze Mùza Hair', 'hodnocení vlasů', 'zkušenosti zákazníků'],
    pageType: 'article',
  },
  '/katalog': {
    titleTemplate: 'Katalog vlasů | Mùza Hair',
    descriptionTemplate: 'Kompletní katalog vlasů k prodloužení. Prohlédněte si všechny produkty, barvy, délky a typy vlasů.',
    keywords: ['katalog vlasů', 'nabídka vlasů', 'produkty Mùza Hair'],
    pageType: 'category',
  },
  '/cenik': {
    titleTemplate: 'Ceník vlasů | Mùza Hair',
    descriptionTemplate: 'Přehledný ceník vlasů k prodloužení. Ceny podle délky, kvality a metody. Transparentní ceny bez skrytých poplatků.',
    keywords: ['ceník vlasů', 'ceny prodloužení vlasů', 'kolik stojí vlasy'],
    pageType: 'article',
  },
  '/blog': {
    titleTemplate: 'Blog o vlasech | Mùza Hair',
    descriptionTemplate: 'Tipy, návody a novinky ze světa vlasů. Péče o prodloužené vlasy, trendy, styling. Blog Mùza Hair.',
    keywords: ['blog vlasy', 'péče o vlasy', 'tipy prodloužení vlasů'],
    pageType: 'article',
  },
  '/obchodni-podminky': {
    titleTemplate: 'Obchodní podmínky | Mùza Hair',
    descriptionTemplate: 'Obchodní podmínky e-shopu Mùza Hair. Nákup, platba, dodání, reklamace.',
    keywords: ['obchodní podmínky'],
    pageType: 'legal',
  },
  '/ochrana-osobnich-udaju': {
    titleTemplate: 'Ochrana osobních údajů | Mùza Hair',
    descriptionTemplate: 'Zásady ochrany osobních údajů a GDPR.',
    keywords: ['GDPR', 'ochrana údajů'],
    pageType: 'legal',
  },
  '/reklamace': {
    titleTemplate: 'Reklamace | Mùza Hair',
    descriptionTemplate: 'Reklamační řád a postup reklamace zboží na Mùza Hair.',
    keywords: ['reklamace', 'vrácení zboží'],
    pageType: 'legal',
  },
  '/vykup-vlasu-pro-nemocne': {
    titleTemplate: 'Výkup vlasů pro nemocné | Mùza Hair',
    descriptionTemplate: 'Program výkupu vlasů pro výrobu paruk pro onkologické pacienty. Pomáháme potřebným.',
    keywords: ['výkup vlasů', 'paruky pro nemocné', 'charita vlasy'],
    pageType: 'about',
  },
};

// Default template for pages without specific template
const defaultTemplate = {
  titleTemplate: '{pageName} | Mùza Hair Praha',
  descriptionTemplate: '{pageName} - informace na Mùza Hair. Český výrobce pravých vlasů k prodloužení.',
  keywords: ['Mùza Hair', 'vlasy k prodloužení'],
  pageType: 'article' as PageType,
};

/**
 * POST /api/admin/seo/generate
 * Generate SEO for a specific page based on its ACTUAL content
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { slug, pageId } = body;

    if (!slug && !pageId) {
      return NextResponse.json(
        { error: 'Musíte zadat slug nebo pageId' },
        { status: 400 }
      );
    }

    // Find or create SEO entry
    let seoEntry = pageId
      ? await prisma.pageSeo.findUnique({ where: { id: pageId } })
      : await prisma.pageSeo.findUnique({ where: { slug } });

    const targetSlug = slug || seoEntry?.slug;

    if (!targetSlug) {
      return NextResponse.json(
        { error: 'Stránka nenalezena' },
        { status: 404 }
      );
    }

    const pageName = seoEntry?.pageName || targetSlug.split('/').pop()?.replace(/-/g, ' ') || 'Stránka';

    // FETCH ACTUAL PAGE CONTENT
    const pageContent = await fetchPageContent(targetSlug);

    // Check if we have a hardcoded template (for key pages)
    const template = seoTemplates[targetSlug];

    let generatedTitle: string;
    let generatedDescription: string;
    let generatedKeywords: string;
    let pageType: PageType;

    if (template) {
      // Use curated template for key pages
      generatedTitle = template.titleTemplate;
      generatedDescription = template.descriptionTemplate;
      generatedKeywords = template.keywords.join(', ');
      pageType = template.pageType;
    } else {
      // Generate smart SEO from actual page content
      const smartSeo = generateSmartSeo(targetSlug, pageContent, pageName);
      generatedTitle = smartSeo.titleCs;
      generatedDescription = smartSeo.descriptionCs;
      generatedKeywords = smartSeo.keywordsCs;
      pageType = smartSeo.pageType;
    }

    // Auto-generate canonical URL
    const canonicalUrl = `${SITE_URL}${targetSlug}`;

    // Auto-generate structured data
    const structuredData = generateStructuredData(pageType, {
      title: generatedTitle,
      description: generatedDescription,
      url: canonicalUrl,
      pageName,
    });

    // Update or create SEO entry
    const seoData = {
      titleCs: generatedTitle,
      descriptionCs: generatedDescription,
      keywordsCs: generatedKeywords,
      canonicalUrl,
      ogImageUrl: DEFAULT_OG_IMAGE,
      ogType: 'website',
      structuredData,
      updatedAt: new Date(),
    };

    if (seoEntry) {
      seoEntry = await prisma.pageSeo.update({
        where: { id: seoEntry.id },
        data: seoData,
      });
    } else {
      seoEntry = await prisma.pageSeo.create({
        data: {
          slug: targetSlug,
          pageName,
          ...seoData,
        },
      });
    }

    return NextResponse.json({
      success: true,
      seo: seoEntry,
      generated: {
        title: generatedTitle,
        description: generatedDescription,
        keywords: generatedKeywords,
        canonicalUrl,
        structuredData: JSON.parse(structuredData),
      },
      source: template ? 'template' : 'content-analysis',
      analyzedContent: template ? null : {
        headingsFound: pageContent.headings.length,
        textLength: pageContent.text.length,
        productsFound: pageContent.products.length,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating SEO:', error);
    return NextResponse.json(
      { error: 'Chyba při generování SEO' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/seo/generate
 * Generate SEO for all pages at once
 */
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const results = {
      generated: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const [slug, template] of Object.entries(seoTemplates)) {
      try {
        const existing = await prisma.pageSeo.findUnique({ where: { slug } });
        const pageName = slug.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') || 'Stránka';
        const canonicalUrl = `${SITE_URL}${slug}`;

        const structuredData = generateStructuredData(template.pageType, {
          title: template.titleTemplate,
          description: template.descriptionTemplate,
          url: canonicalUrl,
          pageName,
        });

        const data = {
          titleCs: template.titleTemplate,
          descriptionCs: template.descriptionTemplate,
          keywordsCs: template.keywords.join(', '),
          canonicalUrl,
          ogImageUrl: DEFAULT_OG_IMAGE,
          ogType: 'website',
          structuredData,
          updatedAt: new Date(),
        };

        if (existing) {
          await prisma.pageSeo.update({
            where: { id: existing.id },
            data,
          });
          results.updated++;
        } else {
          await prisma.pageSeo.create({
            data: {
              slug,
              pageName: pageName.charAt(0).toUpperCase() + pageName.slice(1),
              ...data,
            },
          });
          results.generated++;
        }
      } catch (err) {
        results.errors.push(`${slug}: ${err}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Vygenerováno ${results.generated} nových, aktualizováno ${results.updated}`,
      results,
    }, { status: 200 });
  } catch (error) {
    console.error('Error generating all SEO:', error);
    return NextResponse.json(
      { error: 'Chyba při generování SEO' },
      { status: 500 }
    );
  }
}
