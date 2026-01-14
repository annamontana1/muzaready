import { cache } from 'react';
import prisma from './prisma';

export type SiteSettings = {
  // Kontakty
  phone: string | null;
  phoneWhatsapp: string | null;
  email: string | null;
  emailSupport: string | null;

  // Showroom
  addressStreet: string | null;
  addressCity: string | null;
  addressZip: string | null;
  addressMapUrl: string | null;
  openingHours: string | null;

  // Sociální sítě
  instagramUrl: string | null;
  instagramHandle: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  pinterestUrl: string | null;

  // Promo banner
  promoBannerEnabled: boolean;
  promoBannerText: string | null;
  promoBannerLink: string | null;

  // Newsletter
  newsletterEnabled: boolean;
  newsletterTitle: string | null;
  newsletterSubtitle: string | null;

  // Firma
  companyName: string | null;

  // Vzhled
  logoUrl: string | null;
  logoAlt: string | null;
  faviconUrl: string | null;
  copyrightText: string | null;

  // Doprava
  freeShippingThreshold: number | null;
  shippingCostCzk: number | null;
  shippingCostEur: number | null;
};

const DEFAULT_SETTINGS: SiteSettings = {
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
 * Get site settings from database (cached per request)
 * Use this in Server Components
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'main' },
    });

    if (!settings) {
      return DEFAULT_SETTINGS;
    }

    return {
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
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_SETTINGS;
  }
});

/**
 * Format copyright text with current year
 */
export function formatCopyrightText(text: string | null): string {
  if (!text) return `© ${new Date().getFullYear()} Mùza Hair`;
  return text.replace('{year}', new Date().getFullYear().toString());
}

/**
 * Get WhatsApp URL from phone number
 */
export function getWhatsAppUrl(phoneWhatsapp: string | null): string {
  if (!phoneWhatsapp) return 'https://wa.me/420728722880';
  return `https://wa.me/${phoneWhatsapp}`;
}
