import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Definice všech stránek webu pro SEO
const defaultPages = [
  {
    slug: '/',
    pageName: 'Domovská stránka',
    titleCs: 'Mùza Hair | Pravé vlasy k prodloužení | Praha',
    titleEn: 'Mùza Hair | Real Human Hair Extensions | Prague',
    descriptionCs: 'Český výrobce pravých lidských vlasů k prodloužení. Prémiová kvalita, keratin, tape-in, clip-in. Showroom Praha.',
    descriptionEn: 'Czech manufacturer of real human hair extensions. Premium quality, keratin, tape-in, clip-in. Showroom in Prague.',
    keywordsCs: 'vlasy k prodloužení, pravé vlasy, keratin, tape-in, clip-in, Praha',
  },
  {
    slug: '/o-nas',
    pageName: 'O nás',
    titleCs: 'O nás | Mùza Hair - Český výrobce vlasů',
    titleEn: 'About Us | Mùza Hair - Czech Hair Manufacturer',
    descriptionCs: 'Jsme český výrobce pravých vlasů k prodloužení. Kvalita a tradice od roku 2016.',
    descriptionEn: 'We are a Czech manufacturer of real hair extensions. Quality and tradition since 2016.',
  },
  {
    slug: '/kontakt',
    pageName: 'Kontakt',
    titleCs: 'Kontakt | Mùza Hair',
    titleEn: 'Contact | Mùza Hair',
    descriptionCs: 'Kontaktujte nás - showroom Praha, telefon, email. Mùza Hair - pravé vlasy k prodloužení.',
    descriptionEn: 'Contact us - Prague showroom, phone, email. Mùza Hair - real hair extensions.',
  },
  {
    slug: '/showroom',
    pageName: 'Showroom',
    titleCs: 'Showroom Praha | Mùza Hair',
    titleEn: 'Showroom Prague | Mùza Hair',
    descriptionCs: 'Navštivte náš showroom v Praze. Revoluční 8, Praha 1. Osobní konzultace a výběr vlasů.',
    descriptionEn: 'Visit our showroom in Prague. Revoluční 8, Prague 1. Personal consultation and hair selection.',
  },
  {
    slug: '/velkoobchod',
    pageName: 'Velkoobchod',
    titleCs: 'Velkoobchod | Mùza Hair - B2B prodej vlasů',
    titleEn: 'Wholesale | Mùza Hair - B2B Hair Sales',
    descriptionCs: 'Velkoobchodní prodej pravých vlasů pro salony a kadeřníky. Speciální ceny, rychlé dodání.',
    descriptionEn: 'Wholesale real hair sales for salons and hairdressers. Special prices, fast delivery.',
  },
  // Kategorie vlasů
  {
    slug: '/vlasy-k-prodlouzeni',
    pageName: 'Vlasy k prodloužení',
    titleCs: 'Vlasy k prodloužení | Mùza Hair',
    titleEn: 'Hair Extensions | Mùza Hair',
    descriptionCs: 'Široký výběr pravých vlasů k prodloužení. Keratin, tape-in, clip-in a další metody.',
    descriptionEn: 'Wide selection of real hair extensions. Keratin, tape-in, clip-in and more methods.',
  },
  {
    slug: '/vlasy-k-prodlouzeni/vlasy-na-keratin',
    pageName: 'Vlasy na keratin',
    titleCs: 'Vlasy na keratin | Mùza Hair',
    titleEn: 'Keratin Hair Extensions | Mùza Hair',
    descriptionCs: 'Prémiové vlasy na keratin pro trvalé prodloužení. 100% pravé lidské vlasy.',
    descriptionEn: 'Premium keratin hair extensions for permanent lengthening. 100% real human hair.',
  },
  {
    slug: '/vlasy-k-prodlouzeni/pasky-nano-tapes',
    pageName: 'Pásky Nano Tapes',
    titleCs: 'Pásky Nano Tapes | Mùza Hair',
    titleEn: 'Nano Tape Extensions | Mùza Hair',
    descriptionCs: 'Inovativní nano tape pásky pro šetrné prodloužení vlasů. Neviditelné, pohodlné.',
    descriptionEn: 'Innovative nano tape strips for gentle hair extension. Invisible, comfortable.',
  },
  {
    slug: '/vlasy-k-prodlouzeni/vlasy-v-pasku',
    pageName: 'Vlasy v pásku',
    titleCs: 'Vlasy v pásku | Mùza Hair',
    titleEn: 'Tape-in Extensions | Mùza Hair',
    descriptionCs: 'Tape-in vlasy pro rychlou a šetrnou aplikaci. Ideální pro jemné vlasy.',
    descriptionEn: 'Tape-in hair for quick and gentle application. Ideal for fine hair.',
  },
  {
    slug: '/vlasy-k-prodlouzeni/genius-weft',
    pageName: 'Genius Weft',
    titleCs: 'Genius Weft | Mùza Hair',
    titleEn: 'Genius Weft | Mùza Hair',
    descriptionCs: 'Genius Weft - ultra tenké pásmo vlasů pro neviditelný efekt. Nejnovější technologie.',
    descriptionEn: 'Genius Weft - ultra thin hair weft for invisible effect. Latest technology.',
  },
  {
    slug: '/vlasy-k-prodlouzeni/mikro-pasky',
    pageName: 'Mikro pásky',
    titleCs: 'Mikro pásky | Mùza Hair',
    titleEn: 'Micro Tape Extensions | Mùza Hair',
    descriptionCs: 'Mikro pásky pro extra jemné a diskrétní prodloužení vlasů.',
    descriptionEn: 'Micro tape for extra fine and discreet hair extension.',
  },
  {
    slug: '/vlasy-k-prodlouzeni/rovne-vlasy',
    pageName: 'Rovné vlasy',
    titleCs: 'Rovné vlasy k prodloužení | Mùza Hair',
    titleEn: 'Straight Hair Extensions | Mùza Hair',
    descriptionCs: 'Rovné pravé vlasy k prodloužení ve všech délkách a odstínech.',
    descriptionEn: 'Straight real hair extensions in all lengths and shades.',
  },
  {
    slug: '/vlasy-k-prodlouzeni/vlnite-vlasy',
    pageName: 'Vlnité vlasy',
    titleCs: 'Vlnité vlasy k prodloužení | Mùza Hair',
    titleEn: 'Wavy Hair Extensions | Mùza Hair',
    descriptionCs: 'Přirozeně vlnité vlasy k prodloužení. Objem a elegance.',
    descriptionEn: 'Naturally wavy hair extensions. Volume and elegance.',
  },
  {
    slug: '/vlasy-k-prodlouzeni/kucerave-vlasy',
    pageName: 'Kudrnaté vlasy',
    titleCs: 'Kudrnaté vlasy k prodloužení | Mùza Hair',
    titleEn: 'Curly Hair Extensions | Mùza Hair',
    descriptionCs: 'Kudrnaté pravé vlasy pro dramatický efekt a objem.',
    descriptionEn: 'Curly real hair for dramatic effect and volume.',
  },
  // Účesy a paruky
  {
    slug: '/ucesy-a-paruky',
    pageName: 'Účesy a paruky',
    titleCs: 'Účesy a paruky | Mùza Hair',
    titleEn: 'Hairstyles and Wigs | Mùza Hair',
    descriptionCs: 'Paruky a příčesky z pravých vlasů. Přirozený vzhled, vysoká kvalita.',
    descriptionEn: 'Wigs and hairpieces from real hair. Natural look, high quality.',
  },
  {
    slug: '/ucesy-a-paruky/paruky',
    pageName: 'Paruky',
    titleCs: 'Paruky z pravých vlasů | Mùza Hair',
    titleEn: 'Real Hair Wigs | Mùza Hair',
    descriptionCs: 'Prémiové paruky z pravých lidských vlasů. Ruční práce, přirozený vzhled.',
    descriptionEn: 'Premium wigs from real human hair. Handmade, natural look.',
  },
  {
    slug: '/ucesy-a-paruky/pricesky',
    pageName: 'Příčesky',
    titleCs: 'Příčesky z pravých vlasů | Mùza Hair',
    titleEn: 'Real Hair Hairpieces | Mùza Hair',
    descriptionCs: 'Příčesky a doplňky z pravých vlasů pro extra objem a délku.',
    descriptionEn: 'Hairpieces and accessories from real hair for extra volume and length.',
  },
  // Příslušenství
  {
    slug: '/prislusenstvi',
    pageName: 'Příslušenství',
    titleCs: 'Příslušenství pro vlasy | Mùza Hair',
    titleEn: 'Hair Accessories | Mùza Hair',
    descriptionCs: 'Příslušenství pro péči o prodloužené vlasy. Kartáče, oleje, styling.',
    descriptionEn: 'Accessories for hair extension care. Brushes, oils, styling.',
  },
  // Metody zakončení
  {
    slug: '/metody-zakonceni',
    pageName: 'Metody zakončení',
    titleCs: 'Metody zakončení vlasů | Mùza Hair',
    titleEn: 'Hair Extension Methods | Mùza Hair',
    descriptionCs: 'Přehled metod prodloužení vlasů - keratin, tape-in, micro ring a další.',
    descriptionEn: 'Overview of hair extension methods - keratin, tape-in, micro ring and more.',
  },
  {
    slug: '/metody-zakonceni/vlasy-na-keratin',
    pageName: 'Metoda keratin',
    titleCs: 'Keratinové prodloužení vlasů | Mùza Hair',
    titleEn: 'Keratin Hair Extension | Mùza Hair',
    descriptionCs: 'Vše o keratinové metodě prodloužení vlasů. Postup, péče, výhody.',
    descriptionEn: 'Everything about keratin hair extension method. Process, care, benefits.',
  },
  {
    slug: '/metody-zakonceni/pasky-nano-tapes',
    pageName: 'Metoda nano tapes',
    titleCs: 'Nano Tape prodloužení vlasů | Mùza Hair',
    titleEn: 'Nano Tape Hair Extension | Mùza Hair',
    descriptionCs: 'Inovativní nano tape metoda prodloužení. Rychlá, šetrná, neviditelná.',
    descriptionEn: 'Innovative nano tape extension method. Quick, gentle, invisible.',
  },
  // Informace
  {
    slug: '/informace/obchodni-podminky',
    pageName: 'Obchodní podmínky',
    titleCs: 'Obchodní podmínky | Mùza Hair',
    titleEn: 'Terms and Conditions | Mùza Hair',
    descriptionCs: 'Obchodní podmínky e-shopu Mùza Hair. Nákup, reklamace, vrácení zboží.',
    descriptionEn: 'Terms and conditions of Mùza Hair e-shop. Purchase, complaints, returns.',
  },
  {
    slug: '/informace/ochrana-osobnich-udaju',
    pageName: 'Ochrana osobních údajů',
    titleCs: 'Ochrana osobních údajů | Mùza Hair',
    titleEn: 'Privacy Policy | Mùza Hair',
    descriptionCs: 'Zásady ochrany osobních údajů. GDPR, cookies, zpracování dat.',
    descriptionEn: 'Privacy policy. GDPR, cookies, data processing.',
  },
  {
    slug: '/informace/doprava-a-platba',
    pageName: 'Doprava a platba',
    titleCs: 'Doprava a platba | Mùza Hair',
    titleEn: 'Shipping and Payment | Mùza Hair',
    descriptionCs: 'Informace o dopravě a platebních metodách. Zásilkovna, PPL, GoPay.',
    descriptionEn: 'Information about shipping and payment methods. Packeta, PPL, GoPay.',
  },
  {
    slug: '/informace/faq',
    pageName: 'Časté dotazy (FAQ)',
    titleCs: 'Časté dotazy | Mùza Hair',
    titleEn: 'FAQ | Mùza Hair',
    descriptionCs: 'Odpovědi na časté dotazy o prodloužení vlasů, péči a objednávkách.',
    descriptionEn: 'Answers to frequently asked questions about hair extensions, care and orders.',
  },
];

/**
 * POST /api/admin/seo/seed
 * Seed the database with default SEO pages
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const results = {
      created: 0,
      skipped: 0,
      errors: [] as string[],
    };

    for (const page of defaultPages) {
      try {
        // Check if already exists
        const existing = await prisma.pageSeo.findUnique({
          where: { slug: page.slug },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        // Create new entry
        await prisma.pageSeo.create({
          data: {
            slug: page.slug,
            pageName: page.pageName,
            titleCs: page.titleCs,
            titleEn: page.titleEn || null,
            descriptionCs: page.descriptionCs,
            descriptionEn: page.descriptionEn || null,
            keywordsCs: page.keywordsCs || null,
            ogType: 'website',
            noIndex: false,
            noFollow: false,
          },
        });
        results.created++;
      } catch (err) {
        results.errors.push(`${page.slug}: ${err}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `SEO seed dokončen: ${results.created} vytvořeno, ${results.skipped} přeskočeno`,
      results,
    }, { status: 200 });
  } catch (error) {
    console.error('Error seeding SEO pages:', error);
    return NextResponse.json(
      { error: 'Chyba při seedování SEO stránek' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/seo/seed
 * Check seed status
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const count = await prisma.pageSeo.count();
    return NextResponse.json({
      existingPages: count,
      defaultPagesCount: defaultPages.length,
      needsSeed: count === 0,
    });
  } catch (error) {
    console.error('Error checking SEO seed status:', error);
    return NextResponse.json(
      { error: 'Chyba při kontrole SEO' },
      { status: 500 }
    );
  }
}
