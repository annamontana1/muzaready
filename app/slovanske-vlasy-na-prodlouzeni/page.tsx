import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slovanské Vlasy na Prodloužení Praha | Ukrajinské & Polské Vlasy | Múza Hair',
  description: 'Slovanské vlasy na prodloužení — certifikovaný původ z Ukrajiny, Polska a Rumunska. Přirozený evropský odstín. Showroom Praha, dodání do 48 h. Platinum edition od 10 900 Kč.',
  keywords: [
    'slovanské vlasy na prodloužení',
    'slovanské vlasy Praha',
    'slovanské vlasy prodej',
    'ukrajinské vlasy na prodloužení',
    'polské vlasy na prodloužení',
    'evropské vlasy na prodloužení Praha',
    'remy vlasy Praha',
    'pravé slovanské vlasy',
  ],
  openGraph: {
    title: 'Slovanské Vlasy na Prodloužení | Múza Hair Praha',
    description: 'Certifikovaný původ z Ukrajiny, Polska a Rumunska. Přirozený evropský odstín. Platinum edition.',
    url: 'https://muzahair.cz/slovanske-vlasy-na-prodlouzeni',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function SlovanskevlasyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Slovanské vlasy na prodloužení — Platinum edition',
    description: 'Prémiové slovanské panenské vlasy z Ukrajiny, Polska a Rumunska. Přirozený evropský odstín, zachovaná kutikula.',
    brand: {
      '@type': 'Brand',
      name: 'Múza Hair',
    },
    url: 'https://muzahair.cz/slovanske-vlasy-na-prodlouzeni',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'CZK',
      lowPrice: '10900',
      highPrice: '18000',
      availability: 'https://schema.org/InStock',
    },
    countryOfOrigin: [
      { '@type': 'Country', name: 'Ukraine' },
      { '@type': 'Country', name: 'Poland' },
      { '@type': 'Country', name: 'Romania' },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Co jsou slovanské vlasy na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Slovanské vlasy pocházejí ze zemí jako Ukrajina, Polsko a Rumunsko. Mají přirozeně světlejší, jemnější strukturu blízkou středoevropskému standardu. Jsou panenské — chemicky neošetřené — a díky přirozenému odstínu perfektně splývají s evropskými vlasy.',
        },
      },
      {
        '@type': 'Question',
        name: 'Proč jsou slovanské vlasy nejlepší pro prodloužení vlasů?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Slovanské vlasy mají přirozený průměr vlasového vlákna a odstín odpovídající středoevropanům. Výsledek prodloužení je přirozenější než u asijských vlasů. Navíc jsou panenské — bez chemie — což zaručuje dlouhou životnost 18–24 měsíců.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kde koupit slovanské vlasy na prodloužení v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair prodává slovanské vlasy v Platinum edici — dostupné v showroomu Praha nebo v online e-shopu. Certifikát původu (Ukrajina, Polsko, Rumunsko) je součástí každé sady.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi slovanskými a evropskými vlasy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Slovanské vlasy jsou podmnožinou evropských vlasů — pocházejí ze slovanských zemí střední a východní Evropy. Jsou oblíbené pro přirozený průměr vlákna a světlejší základní odstíny. Evropské vlasy mohou pocházet z širší geografické oblasti.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-burgundy">Domů</Link>
            <span className="mx-2">/</span>
            <Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy">Vlasy k prodloužení</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Slovanské vlasy na prodloužení</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <span className="inline-block bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Platinum Edition — Slovanský původ
            </span>
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              Slovanské vlasy na prodloužení Praha
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl">
              Certifikované vlasy z Ukrajiny, Polska a Rumunska. Přirozený evropský odstín, panenská kvalita, trvanlivost až 24 měsíců.
            </p>
            <p className="text-gray-500 max-w-2xl leading-relaxed">
              Slovanské vlasy jsou uznávány jako nejkvalitnější vlasy na světě pro prodloužení — a Múza Hair je přivází přímo z původu, bez zprostředkovatelů. Každá sada je certifikována.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-14">
            <Link href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
              className="px-8 py-4 bg-burgundy text-white rounded-lg font-medium hover:bg-burgundy/90 transition-colors">
              Platinum vlasy — slovanský původ →
            </Link>
            <Link href="/kontakt"
              className="px-8 py-4 border border-burgundy text-burgundy rounded-lg font-medium hover:bg-burgundy/5 transition-colors">
              Konzultace zdarma
            </Link>
          </div>

          {/* Origin map section */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Odkud pocházejí slovanské vlasy Múza Hair
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  flag: '🇺🇦',
                  country: 'Ukrajina',
                  desc: 'Nejžádanější slovanské vlasy. Přirozeně světle hnědý až blond odstín. Mimořádná hustota a hebkost.',
                  tag: 'Nejvíce žádané',
                },
                {
                  flag: '🇵🇱',
                  country: 'Polsko',
                  desc: 'Jemná struktura blízká středoevropskému standardu. Přirozeně světlé odstíny, snadná péče.',
                  tag: 'Střední Evropa',
                },
                {
                  flag: '🇷🇴',
                  country: 'Rumunsko',
                  desc: 'Silnější vlasové vlákno s přirozeným leskem. Tmavší základní odstíny. Ideální pro tmavé zákaznice.',
                  tag: 'Pro tmavé vlasy',
                },
              ].map((item) => (
                <div key={item.country} className="bg-ivory rounded-xl p-6 border border-gray-100">
                  <div className="text-5xl mb-3">{item.flag}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{item.country}</h3>
                    <span className="text-xs bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">{item.tag}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why slavic is best */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-4">
              Proč jsou slovanské vlasy nejlepší volbou?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl">
              Slovanské vlasy nejsou jen marketingový pojem — existuje vědecký důvod, proč jsou pro Evropanky nejlepší.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Přirozená kompatibilita s evropskými vlasy',
                  desc: 'Průměr vlasového vlákna slovanských vlasů je 60–75 µm — totožný s průměrem středoevropských vlasů. Výsledek prodloužení je proto naprosto přirozený.',
                  icon: '🔬',
                },
                {
                  title: 'Přirozený světlý odstín bez odbarvování',
                  desc: 'Slovanské vlasy mají přirozeně světlejší základní pigment. U barvených vlasů to znamená méně agresivní chemické zpracování a lepší výsledek.',
                  icon: '🌟',
                },
                {
                  title: 'Trvanlivost 18–24 měsíců',
                  desc: 'Zachovaná kutikula = vlasy se nesplétají, nematní a neztrácejí lesk. Při správné péči vydrží dvojnásobek standardních vlasů.',
                  icon: '⏳',
                },
                {
                  title: 'Certifikovaný původ',
                  desc: 'Každá sada Platinum vlasů u Múza Hair má certifikát o původu. Víte přesně odkud vlasy pocházejí — žádné pochybné asijské zpracování.',
                  icon: '📋',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-6">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Slavic vs Asian comparison */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">
              Slovanské vlasy vs. asijské vlasy — srovnání 2026
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-burgundy/20">
                    <th className="text-left py-3 font-semibold text-gray-800">Vlastnost</th>
                    <th className="text-center py-3 font-semibold text-burgundy">Slovanské vlasy ✓</th>
                    <th className="text-center py-3 font-semibold text-gray-500">Asijské vlasy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Průměr vlákna', '60–75 µm (jako EU vlasy)', '80–100 µm (silnější)'],
                    ['Základní odstín', 'Přirozeně světlý', 'Tmavý, nutno odbarvit'],
                    ['Struktura', 'Jemná, splývající', 'Drsnější, tužší'],
                    ['Kutikula', 'Zachována', 'Často odstraněna'],
                    ['Chemické ošetření', 'Minimální nebo žádné', 'Silikony a chemie'],
                    ['Trvanlivost', '18–24 měsíců', '3–9 měsíců'],
                    ['Výsledný vzhled', 'Přirozený, splývavý', 'Může působit uměle'],
                  ].map(([prop, slav, asian]) => (
                    <tr key={prop}>
                      <td className="py-3 font-medium text-gray-700">{prop}</td>
                      <td className="py-3 text-center text-burgundy font-medium">{slav}</td>
                      <td className="py-3 text-center text-gray-500">{asian}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Časté otázky o slovanských vlasech na prodloužení
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Co jsou slovanské vlasy na prodloužení?',
                  a: 'Slovanské vlasy pocházejí ze zemí jako Ukrajina, Polsko a Rumunsko. Mají přirozeně světlejší, jemnější strukturu blízkou středoevropskému standardu. Jsou panenské — chemicky neošetřené — a díky přirozenému odstínu perfektně splývají s evropskými vlasy.',
                },
                {
                  q: 'Jsou slovanské vlasy dražší než ostatní?',
                  a: 'Ano, slovanské panenské vlasy jsou dražší — ale investice se vyplatí. Vydrží 18–24 měsíců, zatímco levné asijské vlasy vydrží 3–6 měsíců. Celkové náklady za rok jsou tedy srovnatelné nebo nižší.',
                },
                {
                  q: 'Lze slovanské vlasy barvit?',
                  a: 'Ano — panenské slovanské vlasy lze barvit a přibarvovat, protože mají zachovanou přirozenou strukturu. Doporučujeme odbarvování u zkušeného coloristy. Na výrazné odbarvení (ze středně tmavé na platinovou blond) doporučujeme vždy konzultaci.',
                },
                {
                  q: 'Jak se pečuje o slovanské vlasy na prodloužení?',
                  a: 'Slovanské vlasy vyžadují stejnou péči jako vaše vlastní vlasy — šampon pro barvené vlasy, kondicionér, pravidelné hydratační masky. Vyhýbejte se agresivním šamponům s SLS. Podrobný návod na péči je přiložen ke každé sadě.',
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

          {/* Internal links */}
          <section className="bg-burgundy text-white rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">👑</div>
            <h2 className="text-3xl font-playfair mb-3">Slovanské vlasy Platinum edition</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">Certifikovaný původ UA / PL / RO. Dostupné v showroomu Praha nebo online.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
                className="px-6 py-3 bg-white text-burgundy rounded-lg font-medium hover:bg-ivory transition-colors">
                Platinum edition →
              </Link>
              <Link href="/luxusni-vlasy-na-prodlouzeni"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors">
                Luxusní vlasy — přehled
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
