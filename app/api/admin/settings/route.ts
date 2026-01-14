import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SETTINGS_ID = 'main';

/**
 * GET /api/admin/settings
 * Fetch site settings
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: SETTINGS_ID,
          // Default values
          phone: '+420 728 722 880',
          phoneWhatsapp: '420728722880',
          email: 'info@muzahair.cz',
          addressStreet: 'Revoluční 8',
          addressCity: 'Praha',
          addressZip: '110 00',
          instagramUrl: 'https://www.instagram.com/muzahair.cz/',
          instagramHandle: '@muzahair.cz',
          facebookUrl: 'https://www.facebook.com/muzahair',
          promoBannerEnabled: true,
          promoBannerText: 'Sledujte nás na Instagramu a získejte voucher 500 Kč',
          promoBannerLink: 'https://www.instagram.com/muzahair.cz/',
          newsletterEnabled: true,
          newsletterTitle: 'Newsletter',
          newsletterSubtitle: 'Získejte slevu 10% na první nákup',
          companyName: 'Mùza Hair s.r.o.',
          logoUrl: '/images/logo/muza-logo.png',
          logoAlt: 'Mùza Hair Shop',
          copyrightText: '© {year} Mùza Hair. Všechna práva vyhrazena.',
          freeShippingThreshold: 2500,
          shippingCostCzk: 99,
          shippingCostEur: 4.99,
        },
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání nastavení' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Update site settings (partial update)
 */
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // Remove id from body if present (shouldn't be changed)
    delete body.id;

    // Ensure settings exist
    const existing = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
    });

    let settings;
    if (existing) {
      settings = await prisma.siteSettings.update({
        where: { id: SETTINGS_ID },
        data: {
          ...body,
          updatedBy: 'admin', // TODO: get from session
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          id: SETTINGS_ID,
          ...body,
          updatedBy: 'admin',
        },
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Chyba při ukládání nastavení' },
      { status: 500 }
    );
  }
}
