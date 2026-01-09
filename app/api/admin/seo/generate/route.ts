import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://muzahair.cz';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

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
 * Generate SEO for a specific page based on its content
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

    // Get template for this page
    const template = seoTemplates[targetSlug] || defaultTemplate;
    const pageName = seoEntry?.pageName || targetSlug.split('/').pop()?.replace(/-/g, ' ') || 'Stránka';

    // Generate SEO content
    const generatedTitle = template.titleTemplate.replace('{pageName}', pageName);
    const generatedDescription = template.descriptionTemplate.replace('{pageName}', pageName);
    const generatedKeywords = template.keywords.join(', ');

    // Auto-generate canonical URL
    const canonicalUrl = `${SITE_URL}${targetSlug}`;

    // Auto-generate structured data
    const structuredData = generateStructuredData(template.pageType, {
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
