import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'České Vlasy na Prodloužení | Výrobce Praha od 2016 | Múza Hair',
  description: 'Múza Hair — český výrobce vlasů na prodloužení od roku 2016. Vlastní barvírna v Praze, panenské a slovanské vlasy, keratin i pásky. Showroom Praha, dodání do 48 h.',
  keywords: [
    'české vlasy na prodloužení',
    'český výrobce vlasů',
    'vlasy na prodloužení Praha výrobce',
    'vlastní barvírna vlasy Praha',
    'české panenské vlasy',
    'vlasy na prodloužení made in Czech',
    'česky výrobce panenských vlasů',
  ],
  openGraph: {
    title: 'České Vlasy na Prodloužení | Múza Hair Praha',
    description: 'Český výrobce vlasů na prodloužení od roku 2016. Vlastní barvírna Praha, panenské a slovanské vlasy.',
    url: 'https://muzahair.cz/ceske-vlasy-na-prodlouzeni',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function CeskeVlasyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Múza Hair Praha',
    description: 'Český výrobce pravých vlasů na prodloužení od roku 2016. Vlastní barvírna v Praze.',
    url: 'https://muzahair.cz',
    foundingDate: '2016',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Praha',
      addressCountry: 'CZ',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Vlasy na prodloužení',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Existuje český výrobce vlasů na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano — Múza Hair Praha je český výrobce vlasů na prodloužení od roku 2016 s vlastní barvírnou v Praze. Vlasy jsou zpracovány v České republice, původ vlasů je ze slovanských zemí (Ukrajina, Polsko, Rumunsko).',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi českým výrobcem a dovozcem vlasů?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Český výrobce jako Múza Hair zpracovává vlasy v ČR — vlastní barvírna, vlastní kontrola kvality, přímý kontakt se zákaznicí. Dovozci prodávají vlasy zpracované v Asii bez kontroly nad procesem. U výrobce víte přesně co dostanete.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kde sídlí Múza Hair Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair má showroom a barvírnu v Praze. Návštěvu je třeba domluvit předem — kontaktujte nás přes web nebo Instagram @muzahairpraha.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-burgundy">Domů</Link>
            <span className="mx-2">/</span>
            <Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy">Vlasy k prodloužení</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">České vlasy na prodloužení</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <span className="inline-block bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              🇨🇿 Český výrobce od roku 2016
            </span>
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              České vlasy na prodloužení — přímý výrobce
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl">
              Múza Hair je jediný český výrobce prémiových vlasů na prodloužení s vlastní barvírnou v Praze. Žádní zprostředkovatelé — přímá cesta od zpracování k vám.
            </p>
            <p className="text-gray-500 max-w-2xl leading-relaxed">
              Nakupovat od českého výrobce znamená: víte co dostanete, komunikujete přímo, máte záruku původu a kvality. Od roku 2016 jsme zpracovali tisíce sad vlasů pro zákaznice po celé ČR.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-14">
            <Link href="/vlasy-k-prodlouzeni"
              className="px-8 py-4 bg-burgundy text-white rounded-lg font-medium hover:bg-burgundy/90 transition-colors">
              Prohlédnout vlasy →
            </Link>
            <Link href="/o-nas"
              className="px-8 py-4 border border-burgundy text-burgundy rounded-lg font-medium hover:bg-burgundy/5 transition-colors">
              Náš příběh
            </Link>
          </div>

          {/* Why Czech manufacturer */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Proč kupovat vlasy od českého výrobce?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🏭',
                  title: 'Vlastní barvírna Praha',
                  desc: 'Vlasy odbarvujeme a zpracováváme v naší vlastní barvírně v Praze. Víme přesně jaké chemikálie používáme — žádná asijská továrna s neznámými procesy.',
                },
                {
                  icon: '🔍',
                  title: 'Kontrola kvality',
                  desc: 'Každá sada prochází ruční kontrolou přímo u nás. Vadné vlasy se k zákaznicím nedostanou — to dovozci nemohou zaručit.',
                },
                {
                  icon: '📞',
                  title: 'Přímá komunikace',
                  desc: 'Mluvíte přímo s výrobcem, ne s překupníkem. Poradíme s výběrem, odpovíme na dotazy, řešíme reklamace bez komplikací.',
                },
                {
                  icon: '🚀',
                  title: 'Dodání do 48 h',
                  desc: 'Sklad máme v Praze — objednáte ráno, vlasy máte druhý den. Žádné čekání 3 týdny na zásilku z Asie.',
                },
                {
                  icon: '📋',
                  title: 'Certifikát původu',
                  desc: 'Každá sada LUXE a Platinum má certifikát o původu vlasů. Slovanský původ (UA, PL, RO) — ověřitelný, transparentní.',
                },
                {
                  icon: '💬',
                  title: 'Showroom v Praze',
                  desc: 'Přijďte osobně — prohlédněte vlasy, porovnejte délky a odstíny, poraďte se přímo s odborníkem. Konzultace zdarma.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-ivory rounded-xl p-6 border border-gray-100">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">Múza Hair — český výrobce od 2016</h2>
            <div className="space-y-4">
              {[
                { year: '2016', text: 'Founded — zahájení výroby vlasů v Praze, první kolekce panenských vlasů.' },
                { year: '2018', text: 'Vlastní barvírna — otevření vlastní barvírny v Praze. Plná kontrola nad procesem odbarvování.' },
                { year: '2020', text: 'LUXE & Platinum — zavedení prémiových kategorií. Slovanské vlasy z UA, PL, RO.' },
                { year: '2022', text: 'E-shop — spuštění online obchodu s dodáním do 48 h po celé ČR.' },
                { year: '2026', text: 'Dnes — tisíce spokojených zákaznic, prémiový showroom, certifikované vlasy.' },
              ].map((item) => (
                <div key={item.year} className="flex gap-4 items-start">
                  <div className="w-12 text-right flex-shrink-0">
                    <span className="text-burgundy font-bold text-sm">{item.year}</span>
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-200 last:border-0">
                    <p className="text-gray-700 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Products */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Naše kolekce vlasů na prodloužení
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              <Link href="/vlasy-k-prodlouzeni/nebarvene-panenske/standard"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all">
                <div className="text-3xl mb-3">⭐</div>
                <h3 className="text-lg font-playfair text-burgundy mb-2">Standard</h3>
                <p className="text-gray-600 text-sm mb-3">Remy vlasy, trvanlivost 6–9 měsíců. Skvělý poměr cena/výkon.</p>
                <p className="text-burgundy text-sm font-medium">od 3 900 Kč →</p>
              </Link>
              <Link href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
                className="group block bg-white border-2 border-burgundy/30 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all">
                <div className="text-3xl mb-3">💎</div>
                <h3 className="text-lg font-playfair text-burgundy mb-2">LUXE</h3>
                <p className="text-gray-600 text-sm mb-3">Panenské vlasy, trvanlivost 12–18 měsíců. Nejoblíbenější kategorie.</p>
                <p className="text-burgundy text-sm font-medium">od 6 900 Kč →</p>
              </Link>
              <Link href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-600 hover:shadow-md transition-all">
                <div className="text-3xl mb-3">👑</div>
                <h3 className="text-lg font-playfair text-gray-800 mb-2">Platinum</h3>
                <p className="text-gray-600 text-sm mb-3">Slovanské panenské vlasy, trvanlivost 18–24 měsíců. Absolutní top.</p>
                <p className="text-gray-800 text-sm font-medium">od 10 900 Kč →</p>
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">Časté otázky</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Jsou vlasy Múza Hair opravdu vyrobeny v České republice?',
                  a: 'Zpracování a barvení probíhá v naší vlastní barvírně v Praze. Vlasy pocházejí ze slovanských zemí (Ukrajina, Polsko, Rumunsko) — původ certifikujeme. Finální produkt — barvené a zpracované vlasy — je připraven v ČR.',
                },
                {
                  q: 'Mohu navštívit výrobnu nebo showroom v Praze?',
                  a: 'Showroom v Praze je dostupný po domluvě. Přijďte si vlasy prohlédnout osobně, porovnat délky, odstíny a konzultovat výběr zdarma.',
                },
                {
                  q: 'Jak dlouho trvá výroba zakázkové sady?',
                  a: 'Standardní sady jsou skladem — dodání do 48 h. Zakázkové sady (nestandardní délky, speciální gramáže nebo kombinace odstínů) vyřídíme do 7–14 pracovních dní.',
                },
              ].map((item, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-xl p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {item.q}
                    <span className="text-burgundy ml-4 text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-burgundy text-white rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">🇨🇿</div>
            <h2 className="text-3xl font-playfair mb-3">Nakupujte od českého výrobce</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">Přímý výrobce bez zprostředkovatelů. Showroom Praha, dodání do 48 h po celé ČR.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/vlasy-k-prodlouzeni"
                className="px-6 py-3 bg-white text-burgundy rounded-lg font-medium hover:bg-ivory transition-colors">
                Prohlédnout kolekci →
              </Link>
              <Link href="/kontakt"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors">
                Konzultace zdarma
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
