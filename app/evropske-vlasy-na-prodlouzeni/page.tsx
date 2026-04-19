import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Evropské Vlasy na Prodloužení Praha | Remy & Panenské | Múza Hair',
  description: 'Pravé evropské vlasy na prodloužení Praha — remy, panenské i slovanské. Nejlepší volba pro české a evropské ženy. Showroom Praha, dodání 48 h po ČR. Od 3 900 Kč.',
  keywords: [
    'evropské vlasy na prodloužení Praha',
    'evropské vlasy prodej',
    'pravé evropské vlasy na prodloužení',
    'remy vlasy Praha',
    'remy vlasy prodej ČR',
    'evropské remy vlasy',
    'panenské evropské vlasy',
    'slovanské evropské vlasy',
  ],
  openGraph: {
    title: 'Evropské Vlasy na Prodloužení Praha | Remy & Panenské | Múza Hair',
    description: 'Prémiové evropské vlasy na prodloužení — remy, panenské a slovanské. Praha showroom + dodání po celé ČR.',
    url: 'https://muzahair.cz/evropske-vlasy-na-prodlouzeni',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function EvropskevlasyPage() {
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
        name: 'Vlasy k prodloužení',
        item: 'https://muzahair.cz/vlasy-k-prodlouzeni',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Evropské vlasy na prodloužení',
        item: 'https://muzahair.cz/evropske-vlasy-na-prodlouzeni',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Co jsou evropské vlasy na prodloužení a čím se liší od asijských?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Evropské vlasy na prodloužení pocházejí od dárkyň z Evropy — nejčastěji z Ukrajiny, Polska a Rumunska. Mají přirozeně jemnější strukturu, tenčí průměr vlákna a přirozenou vlnitost odpovídající evropskému typu vlasů. Asijské vlasy (zejm. čínské) jsou hrubší, tmavší a mají jiný průměr, takže se hůře mísí s evropskými vlasy. Pro české ženy jsou proto evropské vlasy přirozenější a přesvědčivější volbou.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi remy a panenскými evropskými vlasy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Remy vlasy jsou sbírány tak, aby všechny vlasy směřovaly stejným směrem — kutikula je zachována a vlasy se nespletou. Jsou kvalitní a vydrží 6–12 měsíců. Panenské vlasy jsou podmnožina remy vlasů — navíc nikdy nebyly chemicky ošetřeny (nebarveny, neodbariovány). Zachovávají originální strukturu a přirozený lesk. Vydrží 12–24 měsíců a lze je barvit na libovolný odstín.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jsou slovanské vlasy totéž co evropské vlasy na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Slovanské vlasy jsou podkategorií evropských vlasů. Pocházejí konkrétně ze slovanských zemí — Ukrajiny, Polska, Ruska a Rumunska. Jsou považovány za nejkvalitnější evropské vlasy díky přirozené jemnosti, hustotě a minimálnímu poškození. Evropské vlasy mohou pocházet i z jiných evropských zemí a mohou mít mírně odlišné vlastnosti.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kde v ČR mohu koupit pravé evropské vlasy na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair prodává pravé evropské vlasy na prodloužení v pražském showroomu i online v e-shopu. Showroom je otevřen po–ne 9:00–19:00. Online objednávka přes e-shop s dodáním do 48 h po celé České republice. Certifikovaný původ vlasů, transparentní informace o zdroji.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-burgundy transition-colors">Domů</Link>
            <span className="mx-2">/</span>
            <Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy transition-colors">Vlasy k prodloužení</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Evropské vlasy na prodloužení</span>
          </nav>

          {/* Hero */}
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Evropské vlasy na prodloužení Praha
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl">
            Pravé remy a panenské evropské vlasy — nejlepší volba pro české a středoevropské ženy. Showroom Praha, dodání do 48 hodin po celé ČR.
          </p>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Evropské vlasy na prodloužení jsou přirozenou volbou pro ženy v České republice. Textura, tloušťka i přirozená vlnitost odpovídají evropskému typu vlasů — výsledek vypadá přirozeně a nerozeznáte prodloužení od vlastních vlasů. Múza Hair je česká firma specializující se na evropské a slovanské vlasy od roku 2016.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href="/vlasy-k-prodlouzeni"
              className="px-8 py-4 bg-burgundy text-white rounded-lg font-medium hover:bg-burgundy/90 transition-colors"
            >
              Prohlédnout evropské vlasy →
            </Link>
            <Link
              href="/kontakt"
              className="px-8 py-4 border border-burgundy text-burgundy rounded-lg font-medium hover:bg-burgundy/5 transition-colors"
            >
              Konzultace zdarma
            </Link>
          </div>

          {/* What are European hair extensions */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Co jsou evropské vlasy na prodloužení?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Evropské vlasy na prodloužení jsou pravé lidské vlasy pocházející od dárkyň z evropských zemí — nejčastěji z Ukrajiny, Polska, Rumunska a dalších slovanských zemí. Vyznačují se přirozenou jemností, střední tloušťkou vlákna a typicky evropskou texturou — od rovných přes lehce vlnité až po přirozeně kudrnaté.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Klíčový rozdíl oproti asijským vlasům spočívá v průměru vlasového vlákna a pigmentaci. Evropské vlasy mají přirozeně tenčí průměr, jsou méně pigmentované a mají jemnější texturu. To je činí snadno prolínatelné s vlastními vlasy středoevropských žen — výsledek vypadá zcela přirozeně.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  U Múza Hair se specializujeme výhradně na vlasy evropského a slovanského původu. Každá šarže vlasů je ověřena co do původu a prochází vstupní kontrolou kvality v naší provozovně v Praze.
                </p>
              </div>
              <div className="bg-ivory rounded-xl p-6 border border-burgundy/10">
                <h3 className="font-semibold text-gray-900 mb-4">Proč evropské vlasy?</h3>
                <ul className="space-y-3">
                  {[
                    'Textura odpovídající českým a slovenským vlasům',
                    'Přirozená tloušťka vlákna — neviditelné přechody',
                    'Lze barvit a ošetřovat jako vlastní vlasy',
                    'Přirozený lesk bez silikonového povrchového ošetření',
                    'Snadno se zapojí do přirozeného stylingového rituálu',
                    'Zachovaná kutikula u remy varianty = menší lámavost',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-burgundy font-bold mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Subtypes */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-3">
              Typy evropských vlasů na prodloužení
            </h2>
            <p className="text-gray-500 mb-8">
              Evropské vlasy se dělí do tří podkategorií — každá má jiné vlastnosti, trvanlivost a cenu.
            </p>
            <div className="space-y-6">

              {/* Remy European */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">💫</span>
                  <div>
                    <h3 className="text-2xl font-playfair text-burgundy mb-1">Remy evropské vlasy</h3>
                    <p className="text-sm text-gray-500 font-medium">Standard kvalita · od 3 900 Kč · trvanlivost 6–12 měsíců</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Remy vlasy jsou sbírány metodou, při níž všechny vlasy směřují stejným přirozeným směrem — od kořínku ke špičce. Díky tomu je zachovaná kutikula v plném rozsahu a vlasy se po aplikaci nezamotávají a nelámou. Jsou ošetřeny barvením nebo odbarvením v naší barvírně v Praze.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Trvanlivost</p>
                    <p className="font-semibold text-gray-900">6–12 měsíců</p>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Původ</p>
                    <p className="font-semibold text-gray-900">Ukraina, Polsko, Rumunsko</p>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Cena od</p>
                    <p className="font-semibold text-burgundy">3 900 Kč / sada</p>
                  </div>
                </div>
              </div>

              {/* Virgin European */}
              <div className="bg-white border-2 border-burgundy/30 rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">💎</span>
                  <div>
                    <h3 className="text-2xl font-playfair text-burgundy mb-1">Panenské evropské vlasy (Virgin)</h3>
                    <p className="text-sm text-gray-500 font-medium">LUXE kvalita · od 6 900 Kč · trvanlivost 12–18 měsíců</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Panenské (virgin) vlasy jsou nejvyšší forma remy vlasů — nikdy nebyly chemicky ošetřeny. Nebyly barveny, odbariovány ani jinak chemicky upraveny. Zachovávají originální přirozený pigment a strukturu, jak je dárkyně nosila. Lze je barvit přesně na požadovaný odstín — vlasy reagují jako vlastní zdravé vlasy.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Trvanlivost</p>
                    <p className="font-semibold text-gray-900">12–18 měsíců</p>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Chemické ošetření</p>
                    <p className="font-semibold text-gray-900">Žádné — 100% přírodní</p>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Cena od</p>
                    <p className="font-semibold text-burgundy">6 900 Kč / sada</p>
                  </div>
                </div>
              </div>

              {/* Slavic European */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">👑</span>
                  <div>
                    <h3 className="text-2xl font-playfair text-burgundy mb-1">Slovanské evropské vlasy</h3>
                    <p className="text-sm text-gray-500 font-medium">Platinum kvalita · od 10 900 Kč · trvanlivost 18–24 měsíců</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Slovanské vlasy jsou prémiovou podkategorií evropských vlasů. Pocházejí výhradně z Ukrajiny, Polska a Rumunska — zemí s geneticky nejbližší vlasovou strukturou k české populaci. Jsou vždy panenské (chemicky neošetřené), sbírány od jednoho dárce a vyznačují se mimořádnou hustotou, přirozenou vlnitostí a maximální trvanlivostí.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Trvanlivost</p>
                    <p className="font-semibold text-gray-900">18–24 měsíců</p>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Původ</p>
                    <p className="font-semibold text-gray-900">Ukraina, Polsko, Rumunsko</p>
                  </div>
                  <div className="bg-ivory rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Cena od</p>
                    <p className="font-semibold text-burgundy">10 900 Kč / sada</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href="/slovanske-vlasy-na-prodlouzeni" className="text-burgundy text-sm font-medium hover:underline">
                    Více o slovanských vlasech →
                  </Link>
                </div>
              </div>

            </div>
          </section>

          {/* Why European hair for Czech women */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Proč jsou evropské vlasy nejlepší volbou pro české ženy?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Vlasová textura a tloušťka vlákna se liší napříč světadíly. České a středoevropské ženy mají přirozeně jemné až střední vlasy s evropskou texturou. Pokud k nim přidáte vlasy asijského původu, je okamžitě znát rozdíl — odlišná tloušťka, odlišný lesk, odlišná reakce na styling.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Evropské vlasy se naproti tomu přirozeně prolínají s vlastními vlasy. Mají srovnatelnou tloušťku vlákna, reagují stejně na tepelný styling (žehlička, kulma) a absorbují barvu stejným způsobem. Výsledek je přirozený — nikdo nepozná, že vlasy máte prodloužené.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Dalším faktorem je péče. Evropské vlasy reagují na běžné kadeřnické produkty dostupné na českém trhu — kondicionéry, masky a šampony pro evropský typ vlasů fungují bez úprav.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: 'Přirozená textura',
                    desc: 'Evropské vlasy mají stejnou strukturu jako české vlasy — splývají bez viditelného přechodu.',
                  },
                  {
                    title: 'Stejná reakce na styling',
                    desc: 'Vlny a rovnání fungují stejně jako na vlastních vlasech — žádné kompromisy.',
                  },
                  {
                    title: 'Kompatibilita s barvou',
                    desc: 'Evropské vlasy přijímají barvu stejně jako vlastní — snadné barevné sjednocení.',
                  },
                  {
                    title: 'Přirozený lesk bez silikonů',
                    desc: 'Základ je zdravá struktura, ne silikonový povrch zakrývající poškození.',
                  },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Origin section */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Odkud pocházejí evropské vlasy u Múza Hair?
            </h2>
            <p className="text-gray-600 mb-8 max-w-3xl leading-relaxed">
              Múza Hair spolupracuje výhradně s prověřenými dodavateli ze tří klíčových zemí. Každý zdroj má specifické vlastnosti vlasů — společně pokrývají celé spektrum evropské vlasové textury.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  flag: '🇺🇦',
                  country: 'Ukraina',
                  title: 'Slovanské vlasy',
                  desc: 'Nejžádanější zdroj prémiových vlasů v Evropě. Přirozeně jemné, husté, s krásným přirozeným leskem. Základ Platinum edice.',
                  quality: 'Platinum',
                },
                {
                  flag: '🇵🇱',
                  country: 'Polsko',
                  title: 'Středoevropské vlasy',
                  desc: 'Geneticky nejbližší vlasy k českým. Střední tloušťka vlákna, rovná až lehce vlnitá textura. Ideální pro nenápadné prodloužení.',
                  quality: 'LUXE & Standard',
                },
                {
                  flag: '🇷🇴',
                  country: 'Rumunsko',
                  title: 'Jihoslovanské vlasy',
                  desc: 'Výrazně přirozená textura, přirozené barevné tóny. Výborná pro tmavší zákaznice nebo přirozené hnědé a kaštanové odstíny.',
                  quality: 'LUXE & Standard',
                },
              ].map((item) => (
                <div key={item.country} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="text-4xl mb-3">{item.flag}</div>
                  <p className="text-xs font-medium text-burgundy uppercase tracking-wide mb-1">{item.quality}</p>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.country} — {item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison table */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-3">
              Srovnání: evropské vs. asijské vlasy na prodloužení
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              Proč jsou evropské vlasy pro české ženy vhodnější než asijské? Přehledná tabulka.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-burgundy text-white">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Vlastnost</th>
                    <th className="text-left py-3 px-4 font-semibold">Evropské vlasy</th>
                    <th className="text-left py-3 px-4 font-semibold">Asijské vlasy (čínské)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-gray-800">Průměr vlákna</td>
                    <td className="py-3 px-4 text-gray-600">Jemný až střední (50–70 μm)</td>
                    <td className="py-3 px-4 text-gray-500">Hrubý (80–100 μm)</td>
                  </tr>
                  <tr className="bg-ivory">
                    <td className="py-3 px-4 font-medium text-gray-800">Textura</td>
                    <td className="py-3 px-4 text-gray-600">Rovná až přirozeně vlnitá</td>
                    <td className="py-3 px-4 text-gray-500">Rovná, tuhá</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-gray-800">Přirozená barva</td>
                    <td className="py-3 px-4 text-gray-600">Světle hnědá až tmavě hnědá</td>
                    <td className="py-3 px-4 text-gray-500">Téměř výhradně černá</td>
                  </tr>
                  <tr className="bg-ivory">
                    <td className="py-3 px-4 font-medium text-gray-800">Zesvětlení na blond</td>
                    <td className="py-3 px-4 text-gray-600">Snadno, přirozený výsledek</td>
                    <td className="py-3 px-4 text-gray-500">Obtížné, hrozí poškození</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-gray-800">Prolnutí s českými vlasy</td>
                    <td className="py-3 px-4 font-semibold text-green-700">Vynikající</td>
                    <td className="py-3 px-4 text-gray-500">Viditelný rozdíl</td>
                  </tr>
                  <tr className="bg-ivory">
                    <td className="py-3 px-4 font-medium text-gray-800">Tepelný styling</td>
                    <td className="py-3 px-4 text-gray-600">Snadný, stejné chování jako vlastní vlasy</td>
                    <td className="py-3 px-4 text-gray-500">Vyžaduje jiný přístup</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-gray-800">Trvanlivost (panenské)</td>
                    <td className="py-3 px-4 text-gray-600">12–24 měsíců</td>
                    <td className="py-3 px-4 text-gray-500">6–12 měsíců</td>
                  </tr>
                  <tr className="bg-ivory">
                    <td className="py-3 px-4 font-medium text-gray-800">Cena za kvalitu</td>
                    <td className="py-3 px-4 text-gray-600">Vyšší vstupní cena, delší životnost</td>
                    <td className="py-3 px-4 text-gray-500">Nižší cena, kratší životnost</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Quality tiers at Muza */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-3xl font-playfair text-burgundy mb-2">
              Evropské vlasy u Múza Hair — ceník 2026
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Orientační ceny za celou sadu (délka 45–65 cm, 100 g). Přesná cena závisí na délce a gramáži.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-burgundy/20">
                    <th className="text-left py-3 font-semibold text-gray-800">Kvalita</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Typ evropských vlasů</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Původ</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Trvanlivost</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Cena od</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 font-medium">Standard</td>
                    <td className="py-3 text-gray-600">Remy evropské vlasy</td>
                    <td className="py-3 text-gray-600">Rumunsko, Polsko</td>
                    <td className="py-3 text-gray-600">6–9 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">3 900 Kč</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 font-medium">LUXE</td>
                    <td className="py-3 text-gray-600">Panenské evropské vlasy</td>
                    <td className="py-3 text-gray-600">Ukraina, Polsko</td>
                    <td className="py-3 text-gray-600">12–18 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">6 900 Kč</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Platinum</td>
                    <td className="py-3 text-gray-600">Slovanské panenské vlasy</td>
                    <td className="py-3 text-gray-600">Ukraina (Karpaty)</td>
                    <td className="py-3 text-gray-600">18–24 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">10 900 Kč</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              * Orientační ceny. Přesné ceny dle délky a gramáže viz{' '}
              <Link href="/cenik" className="underline hover:text-burgundy">ceník</Link>.
            </p>
          </section>

          {/* Internal links */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Prozkoumejte podkategorie evropských vlasů
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  href: '/slovanske-vlasy-na-prodlouzeni',
                  icon: '👑',
                  title: 'Slovanské vlasy',
                  desc: 'Nejkvalitnější podkategorie evropských vlasů — z Ukrajiny, Polska a Rumunska. Platinum edice.',
                  highlight: true,
                },
                {
                  href: '/vlasy-k-prodlouzeni/nebarvene-panenske',
                  icon: '💎',
                  title: 'Panenské nebarvené vlasy',
                  desc: 'Chemicky neošetřené evropské vlasy — barvíte si je přesně na požadovaný odstín.',
                  highlight: false,
                },
                {
                  href: '/luxusni-vlasy-na-prodlouzeni',
                  icon: '✨',
                  title: 'Luxusní vlasy',
                  desc: 'Prémiová edice pro nejnáročnější zákaznice. Výběrové slovanské panenské vlasy.',
                  highlight: false,
                },
                {
                  href: '/ceske-vlasy-na-prodlouzeni',
                  icon: '🇨🇿',
                  title: 'České vlasy na prodloužení',
                  desc: 'Vlasy s texturou odpovídající českým vlasům. Přirozený výsledek.',
                  highlight: false,
                },
                {
                  href: '/vlasy-k-prodlouzeni/barvene-blond',
                  icon: '💛',
                  title: 'Barvené blond vlasy',
                  desc: 'Evropské vlasy profesionálně odbarvené v naší pražské barvírně. Odstíny 5–10.',
                  highlight: false,
                },
                {
                  href: '/vlasy-k-prodlouzeni-praha',
                  icon: '🏙️',
                  title: 'Vlasy k prodloužení Praha',
                  desc: 'Informace o pražském showroomu — kde nás navštívit, otevírací doba, konzultace.',
                  highlight: false,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group block rounded-xl p-5 transition-all ${
                    item.highlight
                      ? 'bg-burgundy text-white hover:bg-burgundy/90'
                      : 'bg-white border border-gray-200 hover:border-burgundy hover:shadow-sm'
                  }`}
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className={`font-semibold mb-2 ${item.highlight ? 'text-white' : 'text-gray-900 group-hover:text-burgundy transition-colors'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${item.highlight ? 'text-white/80' : 'text-gray-600'}`}>
                    {item.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Časté otázky — evropské vlasy na prodloužení
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Co jsou evropské vlasy na prodloužení a čím se liší od asijských?',
                  a: 'Evropské vlasy pocházejí od dárkyň z Evropy — Ukrainy, Polska, Rumunska. Mají přirozeně jemnější strukturu, tenčí průměr vlákna a texturu odpovídající středoevropskému typu vlasů. Asijské vlasy (zejm. čínské nebo indické) jsou hrubší, tmavší a při prolnutí s českými vlasy působí odlišně. Pro české zákaznice jsou evropské vlasy vždy přirozenější volbou.',
                },
                {
                  q: 'Jaký je rozdíl mezi remy a panenскými evropskými vlasy?',
                  a: 'Remy vlasy jsou sbírány tak, aby všechny vlasy směřovaly stejným směrem — kutikula je zachována a vlasy se nespletou. Jsou kvalitní a vydrží 6–12 měsíců. Panenské vlasy jsou podmnožinou remy vlasů — navíc nikdy nebyly chemicky ošetřeny. Zachovávají originální strukturu a přirozený lesk. Vydrží 12–24 měsíců a lze je barvit na libovolný odstín.',
                },
                {
                  q: 'Jsou slovanské vlasy totéž co evropské vlasy?',
                  a: 'Slovanské vlasy jsou podkategorií evropských vlasů. Pocházejí konkrétně ze slovanských zemí — Ukrainy, Polska a Rumunska. Jsou považovány za nejkvalitnější evropské vlasy díky přirozené jemnosti a maximální trvanlivosti. Evropské vlasy mohou pocházet i z jiných částí Evropy s mírně odlišnými vlastnostmi.',
                },
                {
                  q: 'Kde v ČR mohu koupit pravé evropské vlasy na prodloužení?',
                  a: 'Múza Hair prodává pravé evropské vlasy na prodloužení v pražském showroomu i online v e-shopu. Showroom je otevřen Po–Ne 9:00–19:00 po předchozí domluvě. Online objednávka s dodáním do 48 h po celé České republice. Garantujeme certifikovaný původ vlasů z Ukrainy, Polska a Rumunska.',
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

          {/* CTA Section */}
          <section className="bg-burgundy text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-playfair mb-3">
              Prohlédněte si naše evropské vlasy
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Prémiové remy, panenské a slovanské vlasy na prodloužení — v pražském showroomu nebo s dodáním do 48 hodin po celé ČR.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/slovanske-vlasy-na-prodlouzeni"
                className="px-6 py-3 bg-white text-burgundy rounded-lg font-medium hover:bg-ivory transition-colors"
              >
                Slovanské vlasy
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Panenské vlasy
              </Link>
              <Link
                href="/kontakt"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Konzultace zdarma
              </Link>
              <Link
                href="/cenik"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Ceník 2026
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
