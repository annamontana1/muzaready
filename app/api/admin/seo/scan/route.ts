import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Definice všech veřejných stránek webu
const publicPages = [
  // Hlavní stránky
  { slug: '/', name: 'Domovská stránka', type: 'main' },
  { slug: '/o-nas', name: 'O nás', type: 'main' },
  { slug: '/kontakt', name: 'Kontakt', type: 'main' },
  { slug: '/showroom', name: 'Showroom', type: 'main' },
  { slug: '/velkoobchod', name: 'Velkoobchod', type: 'main' },
  { slug: '/recenze', name: 'Recenze', type: 'main' },
  { slug: '/katalog', name: 'Katalog', type: 'main' },
  { slug: '/cenik', name: 'Ceník', type: 'main' },

  // Vlasy k prodloužení
  { slug: '/vlasy-k-prodlouzeni', name: 'Vlasy k prodloužení', type: 'category' },
  { slug: '/vlasy-k-prodlouzeni/nebarvene-panenske', name: 'Nebarvené panenské vlasy', type: 'category' },
  { slug: '/vlasy-k-prodlouzeni/nebarvene-panenske/standard', name: 'Standard - Nebarvené', type: 'category' },
  { slug: '/vlasy-k-prodlouzeni/nebarvene-panenske/luxe', name: 'LUXE - Nebarvené', type: 'category' },
  { slug: '/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition', name: 'Platinum Edition - Nebarvené', type: 'category' },
  { slug: '/vlasy-k-prodlouzeni/barvene-vlasy', name: 'Barvené vlasy', type: 'category' },
  { slug: '/vlasy-k-prodlouzeni/barvene-vlasy/standard', name: 'Standard - Barvené', type: 'category' },
  { slug: '/vlasy-k-prodlouzeni/barvene-vlasy/luxe', name: 'LUXE - Barvené', type: 'category' },
  { slug: '/vlasy-k-prodlouzeni/barvene-vlasy/platinum-edition', name: 'Platinum Edition - Barvené', type: 'category' },

  // Příčesky a paruky
  { slug: '/pricesky-a-paruky', name: 'Příčesky a paruky', type: 'category' },
  { slug: '/pricesky-a-paruky/paruky-na-miru', name: 'Paruky na míru', type: 'category' },
  { slug: '/pricesky-a-paruky/pricesek-na-temeno', name: 'Příčesek na temeno', type: 'category' },
  { slug: '/pricesky-a-paruky/toupee', name: 'Toupee', type: 'category' },

  // Metody zakončení
  { slug: '/metody-zakonceni', name: 'Metody zakončení', type: 'info' },
  { slug: '/metody-zakonceni/vlasy-na-keratin', name: 'Vlasy na keratin', type: 'info' },
  { slug: '/metody-zakonceni/pasky-nano-tapes', name: 'Pásky Nano Tapes', type: 'info' },
  { slug: '/metody-zakonceni/vlasove-tresy', name: 'Vlasové tresy', type: 'info' },

  // Informace
  { slug: '/informace', name: 'Informace', type: 'info' },
  { slug: '/informace/faq', name: 'Časté dotazy (FAQ)', type: 'info' },
  { slug: '/informace/jak-nakupovat', name: 'Jak nakupovat', type: 'info' },
  { slug: '/informace/platba-a-vraceni', name: 'Platba a vrácení', type: 'info' },
  { slug: '/informace/odeslani-a-stav-objednavky', name: 'Odeslání a stav objednávky', type: 'info' },
  { slug: '/informace/obchodni-podminky', name: 'Obchodní podmínky', type: 'info' },
  { slug: '/informace/ochrana-osobnich-udaju', name: 'Ochrana osobních údajů', type: 'info' },
  { slug: '/informace/nas-pribeh', name: 'Náš příběh', type: 'info' },

  // Ostatní
  { slug: '/obchodni-podminky', name: 'Obchodní podmínky', type: 'legal' },
  { slug: '/ochrana-osobnich-udaju', name: 'Ochrana osobních údajů', type: 'legal' },
  { slug: '/reklamace', name: 'Reklamace', type: 'legal' },
  { slug: '/vykup-vlasu-pro-nemocne', name: 'Výkup vlasů pro nemocné', type: 'info' },
  { slug: '/blog', name: 'Blog', type: 'blog' },
];

/**
 * GET /api/admin/seo/scan
 * Scan website and return all pages with their SEO status
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    // Get existing SEO entries
    const existingSeo = await prisma.pageSeo.findMany();
    const existingSlugs = new Set(existingSeo.map(s => s.slug));

    // Map pages with their SEO status
    const pagesWithStatus = publicPages.map(page => {
      const seo = existingSeo.find(s => s.slug === page.slug);
      return {
        ...page,
        hasSeo: existingSlugs.has(page.slug),
        seoId: seo?.id || null,
        titleCs: seo?.titleCs || null,
        descriptionCs: seo?.descriptionCs || null,
        seoStatus: !seo ? 'missing' :
                   (!seo.titleCs || !seo.descriptionCs) ? 'incomplete' : 'complete',
      };
    });

    // Summary stats
    const stats = {
      total: publicPages.length,
      withSeo: pagesWithStatus.filter(p => p.hasSeo).length,
      complete: pagesWithStatus.filter(p => p.seoStatus === 'complete').length,
      incomplete: pagesWithStatus.filter(p => p.seoStatus === 'incomplete').length,
      missing: pagesWithStatus.filter(p => p.seoStatus === 'missing').length,
    };

    return NextResponse.json({
      pages: pagesWithStatus,
      stats,
    }, { status: 200 });
  } catch (error) {
    console.error('Error scanning pages:', error);
    return NextResponse.json(
      { error: 'Chyba při skenování stránek' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/seo/scan
 * Create SEO entries for all missing pages
 */
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const existingSeo = await prisma.pageSeo.findMany();
    const existingSlugs = new Set(existingSeo.map(s => s.slug));

    let created = 0;
    let skipped = 0;

    for (const page of publicPages) {
      if (existingSlugs.has(page.slug)) {
        skipped++;
        continue;
      }

      await prisma.pageSeo.create({
        data: {
          slug: page.slug,
          pageName: page.name,
          // Leave SEO fields empty - user will generate them
        },
      });
      created++;
    }

    return NextResponse.json({
      success: true,
      created,
      skipped,
      message: `Vytvořeno ${created} záznamů, ${skipped} přeskočeno`,
    }, { status: 200 });
  } catch (error) {
    console.error('Error creating SEO entries:', error);
    return NextResponse.json(
      { error: 'Chyba při vytváření SEO záznamů' },
      { status: 500 }
    );
  }
}
