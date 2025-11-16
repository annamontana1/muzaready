'use client';

import Link from 'next/link';

// Don't pre-render this page during build - it's a dynamic 404 page
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm-beige flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-burgundy mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Stránka nenalezena</h2>
        <p className="text-gray-600 mb-8">
          Omlouváme se, hledaná stránka neexistuje nebo byla přesunuta.
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full bg-burgundy text-white px-6 py-3 rounded-lg hover:bg-maroon transition font-medium"
          >
            Zpět na domů
          </Link>
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske"
            className="inline-block w-full border-2 border-burgundy text-burgundy px-6 py-3 rounded-lg hover:bg-burgundy hover:text-white transition font-medium"
          >
            Jít na katolog
          </Link>
        </div>
      </div>
    </div>
  );
}
