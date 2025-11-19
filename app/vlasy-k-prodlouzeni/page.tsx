'use client';

import Link from 'next/link';

export default function VlasyKProdlouzenLanding() {
  return (
    <div className="min-h-screen bg-soft-cream py-16" data-testid="vlasy-k-prodlouzeni-page-v1.9">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-burgundy transition">
                Domů
              </Link>
            </li>
            <li>/</li>
            <li className="text-burgundy font-medium">Vlasy k prodloužení</li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-playfair text-burgundy mb-6">
            Vlasy k prodloužení
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Vyberte si kategorii panenských vlasů a prohlédněte si naši kompletní nabídku s možností filtrování
          </p>
        </div>

        {/* Category Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Nebarvené */}
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske"
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-light hover:shadow-card-hover transition-all p-12 text-center h-full flex flex-col justify-center items-center border border-gray-200 hover:border-burgundy">
              <div className="mb-6">
                <div className="w-24 h-32 mx-auto rounded-lg bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-burgundy/20 flex items-center justify-center group-hover:border-burgundy transition">
                  <span className="text-4xl">👱‍♀️</span>
                </div>
              </div>
              <h2 className="text-3xl font-playfair font-bold text-burgundy mb-3 group-hover:text-maroon transition">
                Nebarvené panenské vlasy
              </h2>
              <p className="text-gray-600 mb-6">
                100% přírodní nebarvené vlasy. Odstíny 1-5 s možností profesionálního barvení.
              </p>
              <span className="text-burgundy font-semibold group-hover:text-maroon transition">
                Prohlédnout katalog →
              </span>
            </div>
          </Link>

          {/* Barvené */}
          <Link
            href="/vlasy-k-prodlouzeni/barvene-vlasy"
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-light hover:shadow-card-hover transition-all p-12 text-center h-full flex flex-col justify-center items-center border border-gray-200 hover:border-burgundy">
              <div className="mb-6">
                <div className="w-24 h-32 mx-auto rounded-lg bg-gradient-to-b from-yellow-100 to-yellow-200 border-4 border-burgundy/20 flex items-center justify-center group-hover:border-burgundy transition">
                  <span className="text-4xl">👱‍♀️</span>
                </div>
              </div>
              <h2 className="text-3xl font-playfair font-bold text-burgundy mb-3 group-hover:text-maroon transition">
                Barvené blond vlasy
              </h2>
              <p className="text-gray-600 mb-6">
                Profesionálně barvené vlasy v různých odstínech. Odstíny 1-10 v různých tónech blonda.
              </p>
              <span className="text-burgundy font-semibold group-hover:text-maroon transition">
                Prohlédnout katalog →
              </span>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-xl shadow-light p-8 text-center border border-gray-200">
          <h3 className="text-2xl font-semibold text-burgundy mb-4">
            Jak funguje filtrování?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="font-semibold text-burgundy mb-2">Odstín</div>
              <p className="text-gray-600 text-sm">
                Vyberte si z dostupných odstínů. Nebarvené (1-5), Barvené (1-10)
              </p>
            </div>
            <div>
              <div className="font-semibold text-burgundy mb-2">Struktura</div>
              <p className="text-gray-600 text-sm">
                Filtrujte podle typu: rovné, mírně vlnité, vlnité, kudrnaté
              </p>
            </div>
            <div>
              <div className="font-semibold text-burgundy mb-2">Délka (Platinum)</div>
              <p className="text-gray-600 text-sm">
                Délka je k dispozici jen u Platinum Edition produktů
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
