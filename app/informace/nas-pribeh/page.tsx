'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NasPribehPage() {
  const timeline = [
    {
      year: '2016',
      title: 'Začátek příběhu',
      description: 'Anna založila Mùza Hair s vizí přinést na český trh kvalitní vlasy k prodloužení za férové ceny.',
    },
    {
      year: '2018',
      title: 'Vlastní barvírna',
      description: 'Otevřeli jsme vlastní barvírnu v Praze, abychom měli plnou kontrolu nad kvalitou barvených vlasů.',
    },
    {
      year: '2020',
      title: 'Showroom Praha',
      description: 'Otevřeli jsme první showroom v centru Prahy, kde si zákaznice mohou prohlédnout vlasy naživo.',
    },
    {
      year: '2022',
      title: 'Platinum Edition',
      description: 'Uvedli jsme prémiovou řadu Platinum Edition - ready-to-wear kusy nejvyšší kvality.',
    },
    {
      year: '2024',
      title: 'Nový e-shop',
      description: 'Spustili jsme moderní e-shop s konfigurátorem vlasů a online poradenstvím.',
    },
  ];

  const values = [
    {
      icon: '💎',
      title: 'Kvalita na prvním místě',
      description: 'Používáme pouze 100% pravé lidské vlasy nejvyšší kvality. Každý kus prochází důkladnou kontrolou.',
    },
    {
      icon: '🤝',
      title: 'Férovost a transparentnost',
      description: 'Jasné ceny bez skrytých poplatků. Upřímně poradíme, i když to znamená doporučit levnější variantu.',
    },
    {
      icon: '💬',
      title: 'Osobní přístup',
      description: 'Každá zákaznice je pro nás jedinečná. Rádi poradíme s výběrem odstínu i gramáže.',
    },
    {
      icon: '🌿',
      title: 'Etický původ',
      description: 'Naše vlasy pocházejí z etických zdrojů. Spolupracujeme pouze s ověřenými dodavateli.',
    },
  ];

  return (
    <div className="min-h-screen bg-soft-cream">
      {/* Hero */}
      <div className="bg-gradient-to-b from-rose-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
            Náš příběh
          </h1>
          <p className="text-xl text-text-mid max-w-2xl mx-auto leading-relaxed">
            Již více než 8 let pomáháme ženám cítit se krásně a sebevědomě.
            Jsme česká rodinná firma s vášní pro kvalitní vlasy.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Story Section */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-warm-beige">
            <div className="prose prose-lg max-w-none text-text-mid">
              <p className="text-xl leading-relaxed">
                <strong className="text-text-dark">Mùza Hair</strong> vznikla z jednoduché myšlenky:
                každá žena si zaslouží mít vlasy svých snů, aniž by musela utratit celé jmění.
              </p>
              <p>
                Když Anna v roce 2016 hledala kvalitní vlasy k prodloužení, narazila na dva extrémy -
                buď nekvalitní syntetické vlasy za pár stovek, nebo luxusní salony s cenami v desítkách tisíc.
                Rozhodla se to změnit.
              </p>
              <p>
                Začala navazovat kontakty s dodavateli po celém světě, testovat desítky vzorků a hledat
                tu správnou rovnováhu mezi kvalitou a cenou. Po měsících práce se zrodila Mùza Hair.
              </p>
              <p>
                Dnes máme <strong>vlastní barvírnu v Praze</strong>, kde pečlivě barvíme panenské vlasy
                do všech odstínů blond. Máme <strong>showroom v centru Prahy</strong>, kde si můžete
                prohlédnout vlasy naživo. A máme <strong>tisíce spokojených zákaznic</strong> po celé České republice.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">
            Naše cesta
          </h2>
          <div className="relative">
            {/* Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-pink-200 transform md:-translate-x-1/2" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-pink-500 rounded-full transform -translate-x-1/2 z-10" />

                  {/* Content */}
                  <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-warm-beige">
                      <span className="text-pink-600 font-bold text-lg">{item.year}</span>
                      <h3 className="font-bold text-text-dark mt-1">{item.title}</h3>
                      <p className="text-text-mid text-sm mt-2">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">
            Naše hodnoty
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-warm-beige"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-text-dark mb-2">{value.title}</h3>
                <p className="text-text-mid">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">
            Kdo za Mùza Hair stojí
          </h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-warm-beige text-center">
            <div className="w-24 h-24 bg-pink-100 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl">
              👩‍💼
            </div>
            <h3 className="text-xl font-bold text-text-dark mb-2">Anna</h3>
            <p className="text-pink-600 font-medium mb-4">Zakladatelka & CEO</p>
            <p className="text-text-mid max-w-lg mx-auto">
              "Věřím, že krásné vlasy nejsou luxus jen pro vyvolené. Každá žena si zaslouží cítit se
              výjimečně, a my jsme tu od toho, abychom jí v tom pomohli."
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Staňte se součástí našeho příběhu</h2>
          <p className="mb-6 text-pink-100 max-w-lg mx-auto">
            Navštivte náš showroom v Praze nebo si prohlédněte náš katalog online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/katalog"
              className="px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-pink-50 transition"
            >
              Prohlédnout katalog
            </Link>
            <Link
              href="/kontakt"
              className="px-8 py-3 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition border border-pink-400"
            >
              Navštívit showroom
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12 pt-8 border-t border-warm-beige">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-semibold text-text-dark">Showroom Praha</h3>
              <p className="text-text-mid text-sm">Centrum Prahy (přesná adresa po domluvě)</p>
            </div>
            <div>
              <div className="text-2xl mb-2">📞</div>
              <h3 className="font-semibold text-text-dark">Telefon</h3>
              <p className="text-text-mid text-sm">+420 728 722 880</p>
            </div>
            <div>
              <div className="text-2xl mb-2">✉️</div>
              <h3 className="font-semibold text-text-dark">Email</h3>
              <p className="text-text-mid text-sm">info@muzahair.cz</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
