import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ceník Vlasů na Prodloužení Praha 2026 | Panenské vlasy od 3 900 Kč | Múza Hair',
  description: 'Ceník pravých vlasů na prodloužení Praha 2026. Standard od 3 900 Kč, LUXE od 6 900 Kč, Platinum od 10 900 Kč. Ceny závisí na délce (35–75 cm) a gramáži. Múza Hair — výrobce vlasů Praha od 2016.',
  keywords: [
    'cena vlasů na prodloužení Praha',
    'kolik stojí pravé vlasy na prodloužení',
    'ceník vlasů na prodloužení 2026',
    'vlasy na prodloužení cena Praha',
    'cena panenských vlasů',
    'cena vlasů na prodloužení keratin',
    'vlasy na prodloužení kolik stojí',
    'cena prodloužení vlasů Praha 2026',
  ],
  openGraph: {
    title: 'Ceník Vlasů na Prodloužení Praha 2026 | Múza Hair',
    description: 'Přehledný ceník pravých vlasů na prodloužení. Standard od 3 900 Kč, LUXE od 6 900 Kč, Platinum od 10 900 Kč. Výrobce vlasů Praha od roku 2016.',
    url: 'https://muzahair.cz/cenik-vlasu-na-prodlouzeni',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function CenikVlasuPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kolik stojí pravé vlasy na prodloužení v Praze v roce 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ceny pravých vlasů na prodloužení u Múza Hair v Praze začínají od 3 900 Kč za Standard sadu (45 cm, 100 g). LUXE panenské vlasy jsou od 6 900 Kč a Platinum slovanské vlasy od 10 900 Kč. Konečná cena závisí na délce (35–75 cm) a gramáži (80–150 g). Pozor: tato cena je za samotné vlasy (produkt) — nikoliv za salon a aplikaci.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi cenou vlasů a cenou za prodloužení v salonu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Existují dvě různé ceny: 1) Cena za vlasy (produkt) — koupíte vlasy a dostanete je domů nebo je odnesete do salonu. To je Múza Hair. 2) Cena salonu za prodloužení vlasů zahrnuje práci stylistky a může zahrnovat nebo nezahrnovat vlasy. U Múza Hair kupujete pouze vlasy od 3 900 Kč. Aplikaci pak řešíte se svou stylistkou.',
        },
      },
      {
        '@type': 'Question',
        name: 'Co ovlivňuje cenu vlasů na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cenu pravých vlasů na prodloužení ovlivňují čtyři hlavní faktory: 1) Délka vlasů — čím delší, tím dražší (35 cm vs. 75 cm je výrazný rozdíl). 2) Gramáž — větší hustota vlasů = více materiálu = vyšší cena. 3) Kvalita — Standard (Remy), LUXE (panenské) nebo Platinum (slovanské panenské). 4) Původ vlasů — slovanské evropské vlasy jsou dražší než asijské.',
        },
      },
      {
        '@type': 'Question',
        name: 'Je levnější koupit vlasy u výrobce nebo platit salonu za vše?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Koupit vlasy přímo u výrobce jako Múza Hair je výrazně levnější než platit salonu, který vlasy nakoupí a přidá svou marži. Při koupi vlasů za 6 900 Kč + práce stylistky cca 2 000–4 000 Kč zaplatíte celkem 9 000–11 000 Kč. V salonu za kompletní prodloužení s LUXE kvalitou vlasů zaplatíte 15 000–25 000 Kč.',
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Domů',
        item: 'https://muzahair.cz',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Ceník vlasů na prodloužení',
        item: 'https://muzahair.cz/cenik-vlasu-na-prodlouzeni',
      },
    ],
  };

  const pricingTiers = [
    {
      tier: 'Standard',
      icon: '✦',
      tagline: 'Remy vlasy — ideální úvod',
      color: 'border-gray-200',
      headerBg: 'bg-gray-50',
      badgeBg: 'bg-gray-100 text-gray-700',
      priceBadge: 'text-gray-800',
      priceFrom: '3 900 Kč',
      duration: '6–9 měsíců',
      origin: 'Asie / mix',
      features: [
        'Remy vlasy — kutikuly jedním směrem',
        'Vhodné pro první prodloužení',
        'Keratin, pásky, tresy',
        'Lze barvit (omezeně)',
      ],
      link: '/vlasy-k-prodlouzeni/nebarvene-panenske/standard',
      prices: [
        { length: '35 cm', g80: '3 100 Kč', g100: '3 900 Kč', g120: '4 700 Kč', g150: '5 800 Kč' },
        { length: '45 cm', g80: '3 900 Kč', g100: '4 900 Kč', g120: '5 900 Kč', g150: '7 000 Kč' },
        { length: '55 cm', g80: '4 800 Kč', g100: '5 900 Kč', g120: '7 100 Kč', g150: '8 900 Kč' },
        { length: '65 cm', g80: '5 500 Kč', g100: '6 800 Kč', g120: '8 200 Kč', g150: '10 200 Kč' },
        { length: '75 cm', g80: '6 400 Kč', g100: '8 000 Kč', g120: '9 600 Kč', g150: '12 000 Kč' },
      ],
    },
    {
      tier: 'LUXE',
      icon: '💎',
      tagline: 'Panenské vlasy — nejprodávanější',
      color: 'border-burgundy/40',
      headerBg: 'bg-burgundy/5',
      badgeBg: 'bg-burgundy/10 text-burgundy',
      priceBadge: 'text-burgundy',
      priceFrom: '6 900 Kč',
      duration: '12–18 měsíců',
      origin: 'Evropa',
      popular: true,
      features: [
        '100% panenské — chemicky neošetřené',
        'Zachovaná přirozená kutikula',
        'Od jednoho dárce',
        'Lze barvit a opakovaně tvarovat',
      ],
      link: '/vlasy-k-prodlouzeni/nebarvene-panenske/luxe',
      prices: [
        { length: '35 cm', g80: '5 500 Kč', g100: '6 900 Kč', g120: '8 300 Kč', g150: '10 400 Kč' },
        { length: '45 cm', g80: '6 900 Kč', g100: '8 600 Kč', g120: '10 400 Kč', g150: '13 000 Kč' },
        { length: '55 cm', g80: '8 400 Kč', g100: '10 500 Kč', g120: '12 600 Kč', g150: '15 800 Kč' },
        { length: '65 cm', g80: '9 700 Kč', g100: '12 100 Kč', g120: '14 600 Kč', g150: '18 200 Kč' },
        { length: '75 cm', g80: '11 200 Kč', g100: '14 000 Kč', g120: '16 800 Kč', g150: '21 000 Kč' },
      ],
    },
    {
      tier: 'Platinum',
      icon: '👑',
      tagline: 'Slovanské panenské — nejvyšší kvalita',
      color: 'border-gray-400',
      headerBg: 'bg-gray-800',
      badgeBg: 'bg-gray-700 text-white',
      priceBadge: 'text-gray-800',
      priceFrom: '10 900 Kč',
      duration: '18–24 měsíců',
      origin: 'Slovanský (UA/PL/RO)',
      features: [
        'Slovanský původ — Ukrajina, Polsko, Rumunsko',
        'Přirozeně světlý odstín',
        'Nejvyšší hustota a lesk',
        'Trvanlivost až 24 měsíců',
      ],
      link: '/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition',
      prices: [
        { length: '35 cm', g80: '8 700 Kč', g100: '10 900 Kč', g120: '13 100 Kč', g150: '16 400 Kč' },
        { length: '45 cm', g80: '10 900 Kč', g100: '13 600 Kč', g120: '16 400 Kč', g150: '20 400 Kč' },
        { length: '55 cm', g80: '13 200 Kč', g100: '16 500 Kč', g120: '19 800 Kč', g150: '24 800 Kč' },
        { length: '65 cm', g80: '15 200 Kč', g100: '19 000 Kč', g120: '22 800 Kč', g150: '28 500 Kč' },
        { length: '75 cm', g80: '17 500 Kč', g100: '21 900 Kč', g120: '26 200 Kč', g150: '32 800 Kč' },
      ],
    },
  ];

  const priceFactors = [
    {
      icon: '📏',
      title: 'Délka vlasů',
      desc: 'Nejsilnější faktor ceny. Vlasy 75 cm mohou stát 2–3× více než vlasy 35 cm. Důvod: na delší vlasy je potřeba více materiálu a zpracování je náročnější. Nejpopulárnější délka je 45–55 cm.',
      tip: 'Tip: Pro první prodloužení doporučujeme 45 cm — přirozený výsledek za rozumnou cenu.',
    },
    {
      icon: '⚖️',
      title: 'Gramáž (hustota)',
      desc: 'Standardní sada je 100 g — to je vhodné pro průměrnou hustotu vlastních vlasů. Pro husté vlasy doporučujeme 120–150 g. Více gramáže = více materiálu = vyšší cena. Cena roste přibližně lineárně s gramáží.',
      tip: 'Tip: Nevíte kolik gramů? Konzultujte se svou stylistkou nebo nás kontaktujte — rádi poradíme.',
    },
    {
      icon: '✨',
      title: 'Kvalita — Standard / LUXE / Platinum',
      desc: 'Tři různé třídy vlasů pro různé potřeby a rozpočty. Standard Remy vlasy jsou dostupné a vhodné pro kratší nošení. LUXE panenské vlasy vydrží 12–18 měsíců. Platinum slovanské vlasy jsou naše nejluxusnější kategorie s trvanlivostí 18–24 měsíců.',
      tip: 'Tip: LUXE vychází ekonomicky nejlépe — delší životnost kompenzuje vyšší pořizovací cenu.',
    },
    {
      icon: '🌍',
      title: 'Původ vlasů',
      desc: 'Slovanské vlasy z Ukrajiny, Polska a Rumunska jsou vzácnější a dražší než asijské vlasy. Mají přirozeně světlejší odstín a jemnější strukturu, která lépe splyne s evropskými vlasy. Certifikát původu je součástí každé Platinum sady.',
      tip: 'Tip: Slovanské vlasy se s vašimi vlastními vlasy slijí nejpřirozeněji — pro Středoevropanky ideální volba.',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-burgundy">Domů</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Ceník vlasů na prodloužení</span>
          </nav>

          {/* Hero */}
          <div className="mb-10">
            <span className="inline-block bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Aktuální ceník 2026
            </span>
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              Ceník vlasů na prodloužení Praha 2026
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl">
              Transparentní ceny pravých vlasů na prodloužení přímo od výrobce. Panenské vlasy od 3 900 Kč — bez zprostředkovatelů, bez skrytých poplatků.
            </p>
            <p className="text-gray-500 max-w-2xl leading-relaxed">
              Múza Hair je český výrobce pravých vlasů na prodloužení se sídlem v Praze. Na trhu od roku 2016. Prodáváme vlasy jako produkt — ne salónní službu. Díky tomu jsou naše ceny výrazně nižší než u salónů.
            </p>
          </div>

          {/* IMPORTANT NOTICE: E-shop vs salon */}
          <section className="mb-12 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-6">
            <h2 className="text-lg font-semibold text-amber-900 mb-2">
              Důležité: kupujete vlasy — ne salónní službu
            </h2>
            <p className="text-amber-800 text-sm leading-relaxed mb-3">
              Hledáte-li <strong>„cena prodloužení vlasů Praha"</strong>, pravděpodobně narazíte na weby salónů, které nabízejí kompletní službu (vlasy + aplikace stylistkou). Múza Hair je e-shop a showroom — <strong>prodáváme vlasy jako produkt</strong>, které si pak necháte aplikovat u své stylistky.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-amber-900 mb-1">Salón za prodloužení vlasů</p>
                <ul className="text-amber-700 space-y-1">
                  <li>• Zahrnuje vlasy + práci stylistky</li>
                  <li>• Cena: 8 000–30 000 Kč dle kvality a délky</li>
                  <li>• Vlasy jsou obvykle v ceně (s marží salónu)</li>
                  <li>• Nevíte přesně jaké vlasy dostanete</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="font-semibold text-burgundy mb-1">Múza Hair — pouze vlasy</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Kupujete vlasy jako produkt</li>
                  <li>• Cena: 3 900–32 800 Kč dle délky a kvality</li>
                  <li>• Aplikaci si řešíte se svou stylistkou</li>
                  <li>• Přesně víte co kupujete — s certifikátem</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href="/vlasy-k-prodlouzeni"
              className="px-8 py-4 bg-burgundy text-white rounded-lg font-medium hover:bg-burgundy/90 transition-colors"
            >
              Prohlédnout produkty →
            </Link>
            <Link
              href="/kontakt"
              className="px-8 py-4 border border-burgundy text-burgundy rounded-lg font-medium hover:bg-burgundy/5 transition-colors"
            >
              Konzultace zdarma
            </Link>
          </div>

          {/* Quick price overview */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-2xl font-playfair text-burgundy mb-2">
              Orientační přehled cen vlasů na prodloužení 2026
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Ceny za sadu 45 cm / 100 g. Přesné ceny dle délky a gramáže jsou v tabulkách níže.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-burgundy/20">
                    <th className="text-left py-3 font-semibold text-gray-800">Kvalita</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Typ vlasů</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Trvanlivost</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Původ</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Cena (45 cm / 100 g)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 font-medium">Standard</td>
                    <td className="py-3 text-gray-600">Remy vlasy</td>
                    <td className="py-3 text-gray-600">6–9 měsíců</td>
                    <td className="py-3 text-gray-600">Asie / mix</td>
                    <td className="py-3 font-semibold text-gray-800">4 900 Kč</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 font-medium">LUXE 💎</td>
                    <td className="py-3 text-gray-600">Panenské vlasy</td>
                    <td className="py-3 text-gray-600">12–18 měsíců</td>
                    <td className="py-3 text-gray-600">Evropa</td>
                    <td className="py-3 font-semibold text-burgundy">8 600 Kč</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Platinum 👑</td>
                    <td className="py-3 text-gray-600">Slovanské panenské</td>
                    <td className="py-3 text-gray-600">18–24 měsíců</td>
                    <td className="py-3 text-gray-600">UA / PL / RO</td>
                    <td className="py-3 font-semibold text-gray-800">13 600 Kč</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              * Ceny jsou orientační pro délku 45 cm a gramáž 100 g. Přesné ceny závisí na vámi zvolené konfiguraci. Aktuální ceníky viz produktové stránky.
            </p>
          </section>

          {/* Detailed pricing by tier */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-3">
              Podrobný ceník dle délky a gramáže
            </h2>
            <p className="text-gray-500 mb-8 max-w-2xl">
              Ceny za celou sadu vlasů. Vyberte si kvalitu, délku a gramáž dle svých potřeb.
            </p>

            <div className="space-y-10">
              {pricingTiers.map((tier) => (
                <div key={tier.tier} className={`border-2 ${tier.color} rounded-2xl overflow-hidden`}>
                  {/* Tier header */}
                  <div className={`${tier.tier === 'Platinum' ? tier.headerBg + ' text-white' : tier.headerBg} p-6 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tier.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-xl font-playfair font-semibold ${tier.tier === 'Platinum' ? 'text-white' : 'text-gray-900'}`}>
                            {tier.tier} vlasy
                          </h3>
                          {tier.popular && (
                            <span className="bg-burgundy text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              Nejprodávanější
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${tier.tier === 'Platinum' ? 'text-gray-300' : 'text-gray-500'}`}>
                          {tier.tagline} · Původ: {tier.origin} · Trvanlivost: {tier.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`text-xs uppercase tracking-wider ${tier.tier === 'Platinum' ? 'text-gray-400' : 'text-gray-400'}`}>od</p>
                        <p className={`text-2xl font-playfair font-bold ${tier.tier === 'Platinum' ? 'text-white' : tier.priceBadge}`}>
                          {tier.priceFrom}
                        </p>
                      </div>
                      <Link
                        href={tier.link}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          tier.tier === 'Platinum'
                            ? 'bg-white text-gray-800 hover:bg-gray-100'
                            : 'bg-burgundy text-white hover:bg-burgundy/90'
                        }`}
                      >
                        Zobrazit produkty →
                      </Link>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="px-6 py-4 border-b border-gray-100 bg-white">
                    <ul className="flex flex-wrap gap-x-6 gap-y-1">
                      {tier.features.map((f) => (
                        <li key={f} className="text-sm text-gray-600 flex items-center gap-1.5">
                          <span className="text-burgundy text-xs">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price table */}
                  <div className="overflow-x-auto bg-white px-6 pb-6 pt-4">
                    <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">Ceník dle délky a gramáže</p>
                    <table className="w-full text-sm min-w-[500px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 font-semibold text-gray-700">Délka</th>
                          <th className="text-right py-2 font-semibold text-gray-500">80 g</th>
                          <th className="text-right py-2 font-semibold text-gray-700">100 g</th>
                          <th className="text-right py-2 font-semibold text-gray-500">120 g</th>
                          <th className="text-right py-2 font-semibold text-gray-500">150 g</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {tier.prices.map((row) => (
                          <tr key={row.length} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-2.5 font-medium text-gray-800">{row.length}</td>
                            <td className="py-2.5 text-right text-gray-500">{row.g80}</td>
                            <td className="py-2.5 text-right font-semibold text-gray-800">{row.g100}</td>
                            <td className="py-2.5 text-right text-gray-500">{row.g120}</td>
                            <td className="py-2.5 text-right text-gray-500">{row.g150}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-400 mt-3">
                      * Tučně označena nejpopulárnější konfigurace (100 g). Ceny jsou bez DPH. Aktuální ceny vždy na produktové stránce.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What affects the price */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-3">
              Co ovlivňuje cenu vlasů na prodloužení?
            </h2>
            <p className="text-gray-500 mb-8 max-w-2xl">
              Cena pravých vlasů na prodloužení se liší podle čtyř klíčových faktorů. Pochopte je a vyberte si správnou kombinaci pro váš rozpočet.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {priceFactors.map((factor) => (
                <div key={factor.title} className="bg-ivory rounded-xl p-6 border border-gray-100">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl mt-0.5">{factor.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">{factor.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{factor.desc}</p>
                      <p className="text-xs text-burgundy font-medium bg-burgundy/5 rounded-lg px-3 py-2">
                        {factor.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Buy vs salon section */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-3">
              Je levnější koupit vlasy nebo platit salónu?
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl">
              Tato otázka mate mnoho zákaznic. Vysvětlíme rozdíl a ukážeme, kde ušetříte.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Salon model */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🏪</span>
                  <h3 className="font-semibold text-gray-900 text-lg">Salón — kompletní prodloužení</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Platíte za vše najednou: vlasy + práci stylistky. Cena zahrnuje marži salónu na vlasech a cenu práce.
                </p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Keratin LUXE délka 45 cm</span>
                    <span className="font-semibold text-gray-800">15 000–20 000 Kč</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tape-in Standard délka 45 cm</span>
                    <span className="font-semibold text-gray-800">8 000–12 000 Kč</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platinum délka 55 cm</span>
                    <span className="font-semibold text-gray-800">25 000–35 000 Kč</span>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-gray-500">
                  <li>✓ Vše na jednom místě</li>
                  <li>✓ Nemusíte shánět stylistku</li>
                  <li>✗ Nevíte přesně jaké vlasy dostanete</li>
                  <li>✗ Marže salónu na vlasech 50–150 %</li>
                </ul>
              </div>

              {/* Muza + stylist model */}
              <div className="bg-burgundy/5 border-2 border-burgundy/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💎</span>
                  <h3 className="font-semibold text-burgundy text-lg">Múza Hair + vaše stylistka</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Koupíte vlasy u nás za výrobní cenu. Zaplatíte zvlášť stylistce za aplikaci. Celkově výrazně méně.
                </p>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">LUXE vlasy 45 cm / 100 g</span>
                    <span className="font-semibold text-burgundy">8 600 Kč</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aplikace stylistkou (keratin)</span>
                    <span className="font-semibold text-gray-700">2 000–4 000 Kč</span>
                  </div>
                  <div className="flex justify-between border-t border-burgundy/20 pt-2">
                    <span className="font-semibold text-gray-800">Celkem přibližně</span>
                    <span className="font-bold text-burgundy">10 600–12 600 Kč</span>
                  </div>
                </div>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>✓ Přesně víte co kupujete (certifikát)</li>
                  <li>✓ Ušetříte 3 000–10 000 Kč oproti salónu</li>
                  <li>✓ Vlasy si ponecháte po výměně</li>
                  <li>✗ Musíte si najít stylistku zvlášť</li>
                </ul>
              </div>
            </div>

            <div className="bg-ivory rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2">Závěr: Kdy se vyplatí koupit vlasy zvlášť?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Pokud již máte svou stylistku nebo salón, kde prodloužení vlasů nabízejí, vždy se vyplatí přinést vlastní vlasy od výrobce.
                Ušetříte na marži salónu — ta je typicky 50–150 % z ceny vlasů. Navíc máte jistotu původu a kvality vlasů,
                protože dostanete certifikát od Múza Hair. Pokud ještě stylistku nemáte, rádi vám s výběrem pomůžeme —
                kontaktujte nás nebo přijďte do showroomu v Praze.
              </p>
            </div>
          </section>

          {/* Pricing by length — visual guide */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-3">
              Cena vlasů na prodloužení podle délky
            </h2>
            <p className="text-gray-500 mb-6 max-w-2xl">
              Délka vlasů je nejdůležitější proměnná v ceníku. Zde vidíte, jak cena roste s délkou u každé kategorie (100 g).
            </p>
            <div className="overflow-x-auto bg-ivory rounded-xl p-6">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b-2 border-burgundy/20">
                    <th className="text-left py-3 font-semibold text-gray-800">Délka</th>
                    <th className="text-right py-3 font-semibold text-gray-600">Standard (100 g)</th>
                    <th className="text-right py-3 font-semibold text-burgundy">LUXE (100 g)</th>
                    <th className="text-right py-3 font-semibold text-gray-700">Platinum (100 g)</th>
                    <th className="text-right py-3 font-semibold text-gray-500">Délka na zádech</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { length: '35 cm', std: '3 900 Kč', luxe: '6 900 Kč', plat: '10 900 Kč', note: 'Ramenní délka' },
                    { length: '45 cm', std: '4 900 Kč', luxe: '8 600 Kč', plat: '13 600 Kč', note: 'Pod ramena — nejpopulárnější' },
                    { length: '55 cm', std: '5 900 Kč', luxe: '10 500 Kč', plat: '16 500 Kč', note: 'Polovina zad' },
                    { length: '65 cm', std: '6 800 Kč', luxe: '12 100 Kč', plat: '19 000 Kč', note: 'Tři čtvrtiny zad' },
                    { length: '75 cm', std: '8 000 Kč', luxe: '14 000 Kč', plat: '21 900 Kč', note: 'Dolní část zad' },
                  ].map((row) => (
                    <tr key={row.length} className="hover:bg-white/60 transition-colors">
                      <td className="py-3 font-semibold text-gray-800">{row.length}</td>
                      <td className="py-3 text-right text-gray-600">{row.std}</td>
                      <td className="py-3 text-right font-semibold text-burgundy">{row.luxe}</td>
                      <td className="py-3 text-right font-semibold text-gray-700">{row.plat}</td>
                      <td className="py-3 text-right text-xs text-gray-400">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Product links */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Vyberte svou kategorii vlasů
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/standard"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-400 hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-3">✦</div>
                <h3 className="text-lg font-playfair text-gray-800 mb-2">Standard vlasy</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Remy vlasy pro první prodloužení. Keratin, pásky nebo tresy. Trvanlivost 6–9 měsíců.
                </p>
                <p className="text-gray-800 text-sm font-semibold">od 3 900 Kč · Zobrazit →</p>
              </Link>

              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
                className="group block bg-burgundy/5 border-2 border-burgundy/20 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">💎</span>
                  <span className="bg-burgundy text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Popular</span>
                </div>
                <h3 className="text-lg font-playfair text-burgundy mb-2">LUXE Panenské vlasy</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  100% chemicky neošetřené panenské vlasy. Trvanlivost 12–18 měsíců.
                </p>
                <p className="text-burgundy text-sm font-semibold">od 6 900 Kč · Zobrazit →</p>
              </Link>

              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
                className="group block bg-gray-800 text-white rounded-xl p-6 hover:bg-gray-700 hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-3">👑</div>
                <h3 className="text-lg font-playfair text-white mb-2">Platinum Slovanské</h3>
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  Slovanské panenské vlasy — nejvyšší hustota a lesk. Trvanlivost 18–24 měsíců.
                </p>
                <p className="text-white text-sm font-semibold">od 10 900 Kč · Zobrazit →</p>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Link
                href="/vlasy-k-prodlouzeni/barvene-blond"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-3">✨</div>
                <h3 className="text-lg font-playfair text-burgundy mb-2">Barvené blond vlasy</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Profesionálně odbarvené vlasy v naší vlastní barvírně. Odstíny 5–10. Dostupné ve všech kvalitách.
                </p>
                <p className="text-burgundy text-sm font-semibold">od 3 900 Kč · Zobrazit →</p>
              </Link>

              <Link
                href="/metody-zakonceni"
                className="group block bg-ivory border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-3">🔗</div>
                <h3 className="text-lg font-playfair text-burgundy mb-2">Metody aplikace</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Keratin, Tape-in pásky, nano-pásky nebo vlasové tresy. Zjistěte, která metoda je pro vás.
                </p>
                <p className="text-burgundy text-sm font-semibold">Porovnat metody →</p>
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Nejčastější otázky o cenách vlasů na prodloužení
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Kolik stojí pravé vlasy na prodloužení v Praze v roce 2026?',
                  a: 'Ceny pravých vlasů na prodloužení u Múza Hair začínají od 3 900 Kč za sadu Standard (35 cm, 80 g). Nejpopulárnější konfigurace — LUXE vlasy 45 cm, 100 g — stojí 8 600 Kč. Platinum vlasy stejné konfigurace jsou za 13 600 Kč. Tato cena je za samotné vlasy jako produkt, nikoliv za salonní aplikaci.',
                },
                {
                  q: 'Proč jsou panenské vlasy dražší než běžné?',
                  a: 'Panenské vlasy nikdy nebyly chemicky ošetřeny — nebarveny ani odbarvovány. Jsou odebírány od jednoho dárce, zachovávají přirozenou kutikulu a strukturu. Díky tomu vydrží 12–18 měsíců oproti 6–9 měsícům u Standard vlasů. Přestože jsou pořizovací ceny 1,5–2× vyšší, při přepočtu na rok nošení vychází ekonomicky lépe.',
                },
                {
                  q: 'Jaká je cena vlasů na prodloužení metodou keratin?',
                  a: 'Cena vlasů na prodloužení keratinovou metodou závisí pouze na kvalitě, délce a gramáži vlasů — ne na metodě aplikace. Keratinové zakončení (kapsle) je součástí sady. Ceny začínají od 3 900 Kč (Standard) a LUXE od 6 900 Kč za sadu 35 cm / 80 g. Cena práce stylistky za aplikaci keratinu se pohybuje od 1 500 Kč výše — to si platíte zvlášť.',
                },
                {
                  q: 'Jsou ceny vlasů u Múza Hair vč. DPH?',
                  a: 'Ceny uvedené v ceníku jsou ceny bez DPH. Výsledná cena s DPH je zobrazena při přidání produktu do košíku. Orientační ceny v přehledových tabulkách jsou pro porovnání bez DPH.',
                },
                {
                  q: 'Mohu vlasy na prodloužení reklamovat?',
                  a: 'Ano. Na všechny vlasy se vztahuje zákonná záruční lhůta. Nepoužité vlasy v původním obalu lze vrátit do 14 dnů. Podmínky viz stránka Platba a vrácení. Garantujeme původ a kvalitu každé sady — v případě nesouladu s deklarovanými parametry vlasy vyměníme.',
                },
              ].map((item, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-xl p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {item.q}
                    <span className="text-burgundy ml-4 text-xl group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Trust signals */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">
              Proč kupovat vlasy na prodloužení u Múza Hair?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🏭',
                  title: 'Přímý výrobce od 2016',
                  desc: 'Žádní zprostředkovatelé. Kupujete přímo od výrobce — ceny jsou odpovídající a kvalita garantovaná.',
                },
                {
                  icon: '🔬',
                  title: 'Certifikovaný původ',
                  desc: 'Každá sada vlasů má certifikát původu. Přesně víte odkud vlasy pochází a jak byly zpracovány.',
                },
                {
                  icon: '🎨',
                  title: 'Vlastní barvírna v Praze',
                  desc: 'Barvené blond vlasy odbarvujeme sami v naší barvírně. Víme co je v nich — bez neznámých chemikálií.',
                },
                {
                  icon: '🏙️',
                  title: 'Showroom Praha',
                  desc: 'Přijďte vlasy prohlédnout osobně. Konzultace zdarma — pomůžeme vám s výběrem délky, gramáže i kvality.',
                },
                {
                  icon: '⚡',
                  title: 'Dodání do 48 hodin',
                  desc: 'Objednáte online, vlasy máte do 2 pracovních dnů kdekoliv v ČR. Expresní dodání po domluvě.',
                },
                {
                  icon: '↩️',
                  title: 'Vrácení do 14 dní',
                  desc: 'Nepoužité vlasy v původním obalu lze vrátit do 14 dnů bez udání důvodu.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal links section */}
          <section className="mb-14">
            <h2 className="text-2xl font-playfair text-burgundy mb-5">
              Další informace o vlasech na prodloužení
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { href: '/vlasy-k-prodlouzeni', label: 'Všechny vlasy na prodloužení', desc: 'Kompletní nabídka — panenské i barvené vlasy' },
                { href: '/metody-zakonceni/vlasy-na-keratin', label: 'Vlasy na keratin — metoda', desc: 'Keratinová metoda — nejpřirozenější výsledek' },
                { href: '/metody-zakonceni/pasky-nano-tapes', label: 'Vlasy na pásky Tape-in', desc: 'Tape-in pásky — nejrychlejší metoda aplikace' },
                { href: '/metody-zakonceni/vlasove-tresy', label: 'Vlasové tresy', desc: 'Tresy — bez chemie, pro snadnou aplikaci' },
                { href: '/slovanske-vlasy-na-prodlouzeni', label: 'Slovanské vlasy na prodloužení', desc: 'Slovanský původ — Platinum kategorie' },
                { href: '/luxusni-vlasy-na-prodlouzeni', label: 'Luxusní vlasy na prodloužení', desc: 'LUXE a Platinum kolekce v detailu' },
                { href: '/recenze', label: 'Recenze zákaznic', desc: 'Ověřené recenze na naše vlasy a ceník' },
                { href: '/kontakt', label: 'Konzultace zdarma', desc: 'Poradíme s výběrem vlasů a cenou' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-burgundy hover:shadow-sm transition-all group"
                >
                  <span className="text-burgundy mt-0.5 group-hover:translate-x-0.5 transition-transform">→</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{link.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-burgundy text-white rounded-2xl p-8 md:p-12 text-center">
            <div className="text-4xl mb-4">💎</div>
            <h2 className="text-3xl md:text-4xl font-playfair mb-3">
              Připraveni vybrat vlasy?
            </h2>
            <p className="text-white/80 mb-2 max-w-lg mx-auto">
              Přímý výrobce v Praze od roku 2016. Transparentní ceník, certifikovaný původ, dodání do 48 h.
            </p>
            <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
              Nejste si jisti jakou délku nebo gramáž vybrat? Konzultace je zdarma — napište nám nebo přijďte osobně do showroomu v Praze.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="px-7 py-3.5 bg-white text-burgundy rounded-lg font-medium hover:bg-ivory transition-colors"
              >
                Panenské vlasy →
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni/barvene-blond"
                className="px-7 py-3.5 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Barvené blond
              </Link>
              <Link
                href="/kontakt"
                className="px-7 py-3.5 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Konzultace zdarma
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
