import { NextResponse } from 'next/server';

/**
 * Starý komisní modul B2B (/admin/b2b) je od listopadu 2026 jen archiv.
 * Všechny jeho zápisové endpointy (včetně těch, které posílaly e-maily)
 * vracejí 410 – stará data se nemažou ani nepřepisují.
 * Nové várky a platby se vedou v /admin/odberatele.
 */
export function archivJenKeCteni(): NextResponse | null {
  return NextResponse.json(
    { error: 'Starý B2B modul je archiv jen ke čtení. Nové várky zapisujte v sekci Odběratelé.' },
    { status: 410 }
  );
}
