'use client';

import Link from 'next/link';

export default function CenikPage() {
  const categories = [
    {
      name: 'Standard',
      description: 'Základní kvalita pro každodenní nošení',
      badge: null,
      prices: [
        { length: '40 cm', pricePerGram: '18 Kč', example100g: '1 800 Kč' },
        { length: '50 cm', pricePerGram: '20 Kč', example100g: '2 000 Kč' },
        { length: '60 cm', pricePerGram: '22 Kč', example100g: '2 200 Kč' },
        { length: '70 cm', pricePerGram: '25 Kč', example100g: '2 500 Kč' },
        { length: '80 cm', pricePerGram: '28 Kč', example100g: '2 800 Kč' },
      ],
    },
    {
      name: 'LUXE',
      description: 'Prémiová kvalita s extra hebkostí',
      badge: 'Nejoblíbenější',
      prices: [
        { length: '40 cm', pricePerGram: '22 Kč', example100g: '2 200 Kč' },
        { length: '50 cm', pricePerGram: '25 Kč', example100g: '2 500 Kč' },
        { length: '60 cm', pricePerGram: '28 Kč', example100g: '2 800 Kč' },
        { length: '70 cm', pricePerGram: '32 Kč', example100g: '3 200 Kč' },
        { length: '80 cm', pricePerGram: '35 Kč', example100g: '3 500 Kč' },
      ],
    },
    {
      name: 'Platinum Edition',
      description: 'Nejvyšší kvalita, ready-to-wear kusy',
      badge: 'Premium',
      prices: [
        { length: '40 cm', pricePerGram: '28 Kč', example100g: '2 800 Kč' },
        { length: '50 cm', pricePerGram: '32 Kč', example100g: '3 200 Kč' },
        { length: '60 cm', pricePerGram: '35 Kč', example100g: '3 500 Kč' },
        { length: '70 cm', pricePerGram: '40 Kč', example100g: '4 000 Kč' },
        { length: '80 cm', pricePerGram: '45 Kč', example100g: '4 500 Kč' },
      ],
    },
  ];

  const additionalServices = [
    {
      name: 'Keratinové zakončení',
      price: '5 Kč/g',
      description: 'Profesionální keratinové bondy pro trvalé prodloužení',
    },
    {
      name: 'Barvení na zakázku',
      price: 'od 500 Kč',
      description: 'Individuální barvení podle vašeho přání',
    },
    {
      name: 'Express zpracování',
      price: '+20%',
      description: 'Přednostní zpracování do 48 hodin',
    },
  ];

  const gramGuide = [
    { grams: '50-80g', use: 'Lehké zhušťění, clip-in doplnění', ideal: 'Jemné vlasy' },
    { grams: '100-120g', use: 'Střední prodloužení, přirozený look', ideal: 'Běžná hustota' },
    { grams: '150-180g', use: 'Plné prodloužení, výrazný objem', ideal: 'Hustší vlasy' },
    { grams: '200g+', use: 'Maximální objem, dramatický efekt', ideal: 'Velmi husté vlasy' },
  ];

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Hero */}
      <div className="bg-gradient-to-b from-amber-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">
            Ceník vlasů k prodloužení
          </h1>
          <p className="text-xl text-text-mid max-w-2xl mx-auto">
            Transparentní ceny bez skrytých poplatků. Platíte pouze za gramy, které si objednáte.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Price Tables */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden ${
                  index === 1 ? 'border-pink-300 ring-2 ring-pink-100' : 'border-warm-beige'
                }`}
              >
                {/* Header */}
                <div className={`p-6 ${index === 1 ? 'bg-pink-50' : 'bg-soft-cream'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-text-dark">{category.name}</h2>
                    {category.badge && (
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        category.badge === 'Premium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {category.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-text-mid text-sm">{category.description}</p>
                </div>

                {/* Prices */}
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-text-soft uppercase">
                        <th className="text-left pb-3">Délka</th>
                        <th className="text-right pb-3">Kč/gram</th>
                        <th className="text-right pb-3">100g</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {category.prices.map((price) => (
                        <tr key={price.length}>
                          <td className="py-3 font-medium text-text-dark">{price.length}</td>
                          <td className="py-3 text-right text-text-mid">{price.pricePerGram}</td>
                          <td className="py-3 text-right font-semibold text-text-dark">{price.example100g}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Link
                    href="/katalog"
                    className={`block w-full text-center py-3 rounded-full font-semibold transition ${
                      index === 1
                        ? 'bg-pink-500 text-white hover:bg-pink-600'
                        : 'bg-soft-cream text-text-mid hover:bg-gray-200'
                    }`}
                  >
                    Zobrazit produkty
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Note about shades */}
        <section className="mb-16">
          <div className="bg-blue-50 rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              ℹ️ Poznámka k odstínům
            </h3>
            <p className="text-blue-800">
              <strong>Nebarvené panenské vlasy</strong> (odstíny 1-4) jsou za základní cenu.
              <br />
              <strong>Barvené vlasy</strong> (odstíny 5-10, blond) mohou mít příplatek +10-15% za barvení.
              Přesnou cenu uvidíte vždy u konkrétního produktu.
            </p>
          </div>
        </section>

        {/* Additional Services */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-6">Doplňkové služby</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {additionalServices.map((service) => (
              <div
                key={service.name}
                className="bg-white rounded-xl p-6 border border-warm-beige shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-text-dark">{service.name}</h3>
                  <span className="text-pink-600 font-semibold">{service.price}</span>
                </div>
                <p className="text-text-mid text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gram Guide */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-6">Kolik gramů potřebuji?</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-warm-beige overflow-hidden">
            <table className="w-full">
              <thead className="bg-soft-cream">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Gramáž</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Použití</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-dark">Ideální pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gramGuide.map((row) => (
                  <tr key={row.grams} className="hover:bg-soft-cream">
                    <td className="px-6 py-4">
                      <span className="font-bold text-pink-600">{row.grams}</span>
                    </td>
                    <td className="px-6 py-4 text-text-mid">{row.use}</td>
                    <td className="px-6 py-4 text-text-mid">{row.ideal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-text-soft text-center">
            Nejste si jisti? <Link href="/kontakt" className="text-pink-600 hover:underline">Kontaktujte nás</Link> a rádi poradíme.
          </p>
        </section>

        {/* Shipping */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-6">Doprava</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 border border-warm-beige shadow-sm text-center">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-bold text-text-dark">Zásilkovna</h3>
              <p className="text-2xl font-bold text-text-dark my-2">65 Kč</p>
              <p className="text-sm text-text-soft">Zdarma od 3 000 Kč</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-warm-beige shadow-sm text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-bold text-text-dark">PPL kurýr</h3>
              <p className="text-2xl font-bold text-text-dark my-2">150 Kč</p>
              <p className="text-sm text-text-soft">Zdarma od 3 000 Kč</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-warm-beige shadow-sm text-center">
              <div className="text-3xl mb-3">🏪</div>
              <h3 className="font-bold text-text-dark">Osobní odběr</h3>
              <p className="text-2xl font-bold text-green-600 my-2">Zdarma</p>
              <p className="text-sm text-text-soft">Showroom Praha</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Připraveni objednat?</h2>
          <p className="mb-6 text-pink-100 max-w-lg mx-auto">
            Prohlédněte si náš katalog a najděte ideální vlasy pro vás
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/katalog"
              className="px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition"
            >
              Procházet katalog
            </Link>
            <Link
              href="/informace/jak-nakupovat"
              className="px-8 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition border border-pink-400"
            >
              Jak nakupovat
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
