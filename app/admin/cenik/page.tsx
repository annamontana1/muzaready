'use client';

import Link from 'next/link';
import PriceMatrixTab from '../konfigurator-sku/tabs/PriceMatrixTab';

// Don't pre-render this page during build
export const dynamic = 'force-dynamic';

export default function CenikPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ceníková matice</h1>
          <p className="text-gray-600">Spravuj ceny za 1 g pro všechny kombinace kategorií, linek a délek.</p>
        </div>
        <Link
          href="/admin/konfigurator-sku"
          className="text-sm font-medium text-burgundy hover:text-maroon"
        >
          ← Zpět do konfigurátoru
        </Link>
      </div>

      <PriceMatrixTab />
    </div>
  );
}
