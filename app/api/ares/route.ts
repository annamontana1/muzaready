import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/ares?ico=12345678
 *
 * Proxy na ARES (Administrativní registr ekonomických subjektů).
 * Vrací základní údaje o firmě: název, adresa, DIČ.
 */
export async function GET(request: NextRequest) {
  const ico = request.nextUrl.searchParams.get('ico')?.trim().replace(/\s/g, '');

  if (!ico || !/^\d{8}$/.test(ico)) {
    return NextResponse.json(
      { error: 'IČO musí mít přesně 8 číslic' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      {
        headers: { Accept: 'application/json' },
        // timeout přes AbortController
        signal: AbortSignal.timeout(5000),
      }
    );

    if (res.status === 404) {
      return NextResponse.json(
        { error: 'Subjekt s tímto IČO nebyl nalezen v ARES' },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `ARES vrátil chybu: ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Sestavení adresy ze sidlo objektu
    const sidlo = data.sidlo || {};
    const ulice = sidlo.nazevUlice || sidlo.nazevCastiObce || '';
    const cisloPop = sidlo.cisloDomovni ? String(sidlo.cisloDomovni) : '';
    const cisloOr = sidlo.cisloOrientacni ? `/${sidlo.cisloOrientacni}` : '';
    const street = ulice ? `${ulice} ${cisloPop}${cisloOr}`.trim() : cisloPop;

    return NextResponse.json({
      ico: data.ico || ico,
      dic: data.dic || '',
      companyName: data.obchodniJmeno || '',
      street: street,
      city: sidlo.nazevObce || '',
      zipCode: sidlo.psc ? String(sidlo.psc) : '',
      country: 'CZ',
      legalForm: data.pravniForma || '',
    });
  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'ARES neodpovídá — zkuste to znovu' },
        { status: 504 }
      );
    }
    console.error('ARES proxy error:', err);
    return NextResponse.json(
      { error: 'Chyba při dotazu na ARES' },
      { status: 500 }
    );
  }
}
