import prisma from '@/lib/prisma';
import { Metadata } from 'next';

export type Language = 'cs' | 'en';

/**
 * Get SEO metadata for a page from database
 * Returns null if not found (fallback to hardcoded)
 */
export async function getPageSeo(slug: string, lang: Language = 'cs'): Promise<Metadata | null> {
  try {
    const seo = await prisma.pageSeo.findUnique({
      where: { slug },
    });

    if (!seo) {
      return null;
    }

    const title = lang === 'cs' ? seo.titleCs : seo.titleEn;
    const description = lang === 'cs' ? seo.descriptionCs : seo.descriptionEn;
    const keywords = lang === 'cs' ? seo.keywordsCs : seo.keywordsEn;

    // Build metadata object
    const metadata: Metadata = {};

    if (title) {
      metadata.title = title;
    }

    if (description) {
      metadata.description = description;
    }

    if (keywords) {
      metadata.keywords = keywords.split(',').map(k => k.trim());
    }

    // OpenGraph
    metadata.openGraph = {
      type: (seo.ogType as 'website' | 'article') || 'website',
      locale: lang === 'cs' ? 'cs_CZ' : 'en_US',
    };

    if (title) {
      metadata.openGraph.title = title;
    }

    if (description) {
      metadata.openGraph.description = description;
    }

    if (seo.ogImageUrl) {
      metadata.openGraph.images = [seo.ogImageUrl];
    }

    // Robots
    if (seo.noIndex || seo.noFollow) {
      metadata.robots = {
        index: !seo.noIndex,
        follow: !seo.noFollow,
      };
    }

    // Canonical
    if (seo.canonicalUrl) {
      metadata.alternates = {
        canonical: seo.canonicalUrl,
      };
    }

    return metadata;
  } catch (error) {
    console.error(`[SEO] Error fetching SEO for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get structured data (JSON-LD) for a page
 */
export async function getPageStructuredData(slug: string): Promise<object | null> {
  try {
    const seo = await prisma.pageSeo.findUnique({
      where: { slug },
      select: { structuredData: true },
    });

    if (!seo?.structuredData) {
      return null;
    }

    return JSON.parse(seo.structuredData);
  } catch (error) {
    console.error(`[SEO] Error fetching structured data for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get raw SEO data for a page (for admin)
 */
export async function getPageSeoRaw(slug: string) {
  try {
    return await prisma.pageSeo.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error(`[SEO] Error fetching raw SEO for slug ${slug}:`, error);
    return null;
  }
}

/**
 * List of all pages that should have SEO configuration
 * Used to seed initial SEO entries
 */
export const ALL_SEO_PAGES = [
  { slug: '/', pageName: 'Domovská stránka (Homepage)' },
  { slug: '/o-nas', pageName: 'O nás' },
  { slug: '/kontakt', pageName: 'Kontakt' },
  { slug: '/velkoobchod', pageName: 'Velkoobchod' },
  { slug: '/vlasy-k-prodlouzeni', pageName: 'Vlasy k prodloužení' },
  { slug: '/vlasy-k-prodlouzeni/nebarvene-panenske', pageName: 'Nebarvené panenské vlasy' },
  { slug: '/vlasy-k-prodlouzeni/barvene-vlasy', pageName: 'Barvené vlasy' },
  { slug: '/pricesky-a-paruky', pageName: 'Příčesky a paruky' },
  { slug: '/prislusenstvi', pageName: 'Příslušenství' },
  { slug: '/metody-zakonceni', pageName: 'Metody zakončení' },
  { slug: '/metody-zakonceni/vlasy-na-keratin', pageName: 'Vlasy na keratin' },
  { slug: '/metody-zakonceni/pasky-nano-tapes', pageName: 'Pásky (nano tapes)' },
  { slug: '/metody-zakonceni/vlasove-tresy', pageName: 'Vlasové tresy' },
  { slug: '/informace/faq', pageName: 'FAQ - Časté otázky' },
  { slug: '/informace/jak-nakupovat', pageName: 'Jak nakupovat' },
  { slug: '/informace/obchodni-podminky', pageName: 'Obchodní podmínky' },
  { slug: '/informace/platba-a-vraceni', pageName: 'Platba a vrácení' },
  { slug: '/informace/ochrana-osobnich-udaju', pageName: 'Ochrana osobních údajů' },
  { slug: '/katalog', pageName: 'Katalog produktů' },
  { slug: '/blog', pageName: 'Blog' },
  { slug: '/recenze', pageName: 'Recenze' },
];

/**
 * Seed initial SEO entries for all pages
 */
export async function seedInitialSeoPages() {
  for (const page of ALL_SEO_PAGES) {
    const existing = await prisma.pageSeo.findUnique({
      where: { slug: page.slug },
    });

    if (!existing) {
      await prisma.pageSeo.create({
        data: {
          slug: page.slug,
          pageName: page.pageName,
        },
      });
      console.log(`[SEO] Created SEO entry for: ${page.slug}`);
    }
  }
}
