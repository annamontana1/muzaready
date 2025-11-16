import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeExistingSlug } from '@/lib/slug-normalizer';

/**
 * Middleware for handling:
 * 1. Admin route protection (authentication check)
 * 2. 301 redirects from old product URLs (with length) to new URLs (without length)
 *
 * Admin authentication:
 * - Protects all /admin/* routes (except /admin/login)
 * - Checks for admin-session cookie
 * - Redirects to /admin/login if not authenticated
 *
 * URL redirects:
 * Old format: /produkt/nebarvene-standard-odstin-1-45cm
 * New format: /produkt/nebarvene-standard-odstin-1?len=45
 *
 * Platinum Edition keeps length in URL (no redirect needed)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminSession = request.cookies.get('admin-session');

    if (!adminSession) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Basic validation of session structure
    try {
      const sessionData = JSON.parse(adminSession.value);
      if (!sessionData.email || !sessionData.token) {
        // Invalid session structure, redirect to login
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    } catch (error) {
      // Invalid JSON in session, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Product URL redirects
  if (pathname.startsWith('/produkt/')) {
    const slugPart = pathname.replace('/produkt/', '');
    
    // 1. Redirect ze starých URL s diakritikou na nové ASCII
    // Pokud slug obsahuje diakritiku (á, é, í, ó, ú, ů, ý, č, ď, ě, ň, ř, š, ť, ž)
    // nebo jiné ne-ASCII znaky, normalizujeme ho
    const hasDiacritics = /[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽäöüßàèìòùâêîôûãõñæœ]/i.test(slugPart);
    
    if (hasDiacritics) {
      const normalizedSlug = normalizeExistingSlug(slugPart);
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/produkt/${normalizedSlug}`;
      
      // 301 Permanent Redirect
      return NextResponse.redirect(newUrl, { status: 301 });
    }

    // 2. Redirect pro Standard/LUXE produkty s délkou v URL (starý formát)
    // Pattern: /produkt/{category}-{tier}-odstin-{shade}-{length}cm
    // Examples:
    // - /produkt/nebarvene-standard-odstin-1-45cm
    // - /produkt/nebarvene-luxe-odstin-2-60cm
    // - /produkt/barvene-luxe-odstin-6-65cm

    const standardLuxePattern = /^\/produkt\/(nebarvene|barvene)-(standard|luxe)-odstin-(\d+)-(\d+)cm$/;
    const match = pathname.match(standardLuxePattern);

    if (match) {
      const [, category, tier, shade, length] = match;

      // Build new URL without length in slug, but with length as query param
      const newSlug = `${category}-${tier}-odstin-${shade}`;
      const newUrl = request.nextUrl.clone();
      newUrl.pathname = `/produkt/${newSlug}`;
      newUrl.searchParams.set('len', length);

      // 301 Permanent Redirect
      return NextResponse.redirect(newUrl, { status: 301 });
    }

    // Platinum Edition URLs remain unchanged (they keep length in slug)
    // e.g., /produkt/nebarvene-platinum-edition-odstin-1-60cm
  }
  
  // Redirect from old /barvene-blond to new /barvene-vlasy
  if (pathname.startsWith('/vlasy-k-prodlouzeni/barvene-blond')) {
    const newPath = pathname.replace('/vlasy-k-prodlouzeni/barvene-blond', '/vlasy-k-prodlouzeni/barvene-vlasy');
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = newPath;
    return NextResponse.redirect(newUrl, { status: 301 });
  }

  // SKU detail redirects (pokud by někdo použil starý slug místo ID)
  if (pathname.startsWith('/sku-detail/')) {
    const idPart = pathname.replace('/sku-detail/', '');
    
    // Pokud ID obsahuje diakritiku nebo ne-ASCII znaky, může to být starý slug
    // V takovém případě zkusíme najít produkt podle slug a přesměrovat na správné ID
    // (Toto je volitelné, protože teď používáme ID, ne slug)
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/admin/:path*',
    '/produkt/:path*',
    '/vlasy-k-prodlouzeni/:path*',
  ],
};
