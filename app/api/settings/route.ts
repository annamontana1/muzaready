import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 60;

const SETTINGS_ID = 'main';

const DEFAULT_SETTINGS = {
  phone: '+420 728 722 880',
  phoneWhatsapp: '420728722880',
  email: 'info@muzahair.cz',
  emailSupport: null,
  addressStreet: 'Revoluční 8',
  addressCity: 'Praha',
  addressZip: '110 00',
  addressMapUrl: null,
  openingHours: null,
  instagramUrl: 'https://www.instagram.com/muzahair.cz/',
  instagramHandle: '@muzahair.cz',
  facebookUrl: 'https://www.facebook.com/muzahair',
  tiktokUrl: null,
  youtubeUrl: null,
  pinterestUrl: null,
  promoBannerEnabled: true,
  promoBannerText: 'Sledujte nás na Instagramu a získejte voucher 500 Kč',
  promoBannerLink: 'https://www.instagram.com/muzahair.cz/',
  newsletterEnabled: true,
  newsletterTitle: 'Newsletter',
  newsletterSubtitle: 'Získejte slevu 10% na první nákup',
  companyName: 'Mùza Hair s.r.o.',
  logoUrl: '/images/logo/muza-logo.png',
  logoAlt: 'Mùza Hair Shop',
  faviconUrl: null,
  copyrightText: '© {year} Mùza Hair. Všechna práva vyhrazena.',
  freeShippingThreshold: 2500,
  shippingCostCzk: 99,
  shippingCostEur: 4.99,
};

/**
 * GET /api/settings
 * Public endpoint - returns filtered settings (no sensitive data)
 */
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    if (!settings) {
      return NextResponse.json(DEFAULT_SETTINGS, { status: 200 });
    }

    const publicSettings = {
      phone: settings.phone,
      phoneWhatsapp: settings.phoneWhatsapp,
      email: settings.email,
      emailSupport: settings.emailSupport,
      addressStreet: settings.addressStreet,
      addressCity: settings.addressCity,
      addressZip: settings.addressZip,
      addressMapUrl: settings.addressMapUrl,
      openingHours: settings.openingHours,
      instagramUrl: settings.instagramUrl,
      instagramHandle: settings.instagramHandle,
      facebookUrl: settings.facebookUrl,
      tiktokUrl: settings.tiktokUrl,
      youtubeUrl: settings.youtubeUrl,
      pinterestUrl: settings.pinterestUrl,
      promoBannerEnabled: settings.promoBannerEnabled,
      promoBannerText: settings.promoBannerText,
      promoBannerLink: settings.promoBannerLink,
      newsletterEnabled: settings.newsletterEnabled,
      newsletterTitle: settings.newsletterTitle,
      newsletterSubtitle: settings.newsletterSubtitle,
      companyName: settings.companyName,
      logoUrl: settings.logoUrl,
      logoAlt: settings.logoAlt,
      faviconUrl: settings.faviconUrl,
      copyrightText: settings.copyrightText,
      freeShippingThreshold: settings.freeShippingThreshold,
      shippingCostCzk: settings.shippingCostCzk,
      shippingCostEur: settings.shippingCostEur,
    };

    return NextResponse.json(publicSettings, { status: 200 });
  } catch (error) {
    // If table doesn't exist or any DB error, return defaults
    console.error('Error fetching public settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS, { status: 200 });
  }
}
