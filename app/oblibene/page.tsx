'use client';

import { useFavorites } from '@/hooks/useFavorites';
import Link from 'next/link';

export default function OblibeneePage() {
  const { favorites, favoriteCount, removeFromFavorites } = useFavorites();

  return (
    <div className="py-12 bg-ivory min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Oblíbené produkty
          </h1>
          <p className="text-gray-600">
            {favoriteCount === 0
              ? 'Nemáte žádné oblíbené produkty'
              : `Máte ${favoriteCount} ${favoriteCount === 1 ? 'oblíbený produkt' : favoriteCount < 5 ? 'oblíbené produkty' : 'oblíbených produktů'}`
            }
          </p>
        </div>

        {/* Empty State */}
        {favoriteCount === 0 && (
          <div className="bg-white rounded-xl p-12 text-center shadow-medium">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-playfair text-burgundy mb-4">
              Zatím nemáte žádné oblíbené
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Začněte procházet naše produkty a přidávejte si je do oblíbených kliknutím na ikonu srdce.
            </p>
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske"
              className="btn-primary inline-block"
            >
              Prohlédnout vlasy →
            </Link>
          </div>
        )}

        {/* Favorites List - Placeholder for product integration */}
        {favoriteCount > 0 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-8 shadow-medium">
              <h2 className="text-xl font-playfair text-burgundy mb-4">
                Oblíbené produkty (ID)
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Toto je dočasné zobrazení. Po integraci produktového katalogu zde budou zobrazeny karty produktů.
              </p>
              <div className="space-y-3">
                {favorites.map((productId) => (
                  <div
                    key={productId}
                    className="flex items-center justify-between p-4 bg-ivory rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-burgundy">Produkt ID: {productId}</p>
                      <p className="text-sm text-gray-500">
                        Detail produktu bude zobrazen po integraci katalogu
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromFavorites(productId)}
                      className="text-burgundy hover:text-maroon transition p-2"
                      aria-label="Odebrat z oblíbených"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration TODO */}
            <div className="bg-burgundy/5 rounded-xl p-6 border border-burgundy/20">
              <h3 className="font-semibold text-burgundy mb-2">
                💡 Pro vývojáře
              </h3>
              <p className="text-sm text-gray-700">
                Po integraci produktového katalogu nahraďte seznam ID produktů za plnohodnotné produktové karty
                s obrázky, cenami a odkazy na detail produktu.
              </p>
            </div>

            <div className="text-center pt-6">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="btn-secondary inline-block"
              >
                Pokračovat v nákupu
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
