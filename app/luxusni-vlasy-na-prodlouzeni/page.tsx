import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxusní Vlasy na Prodloužení | Prémiové Panenské Vlasy | Múza Hair Praha',
  description: 'Luxusní vlasy na prodloužení — certifikované panenské a slovanské vlasy z Evropy. LUXE a Platinum edition. Showroom Praha, dodání do 48 h. Od 6 900 Kč.',
  keywords: [
    'luxusní vlasy na prodloužení',
    'prémiové vlasy na prodloužení Praha',
    'nejkvalitnější vlasy na prodloužení',
    'certifikované panenské vlasy Praha',
    'luxusní prodloužení vlasů Praha',
    'prémiové vlasy Praha',
    'high-end vlasy na prodloužení',
  ],
  openGraph: {
    title: 'Luxusní Vlasy na Prodloužení | Múza Hair Praha',
    description: 'Certifikované panenské a slovanské vlasy z Evropy. LUXE a Platinum edition. Showroom Praha.',
    url: 'https://muzahair.cz/luxusni-vlasy-na-prodlouzeni',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function LuxusniVlasyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Luxusní vlasy na prodloužení — Múza Hair Praha',
    description: 'Prémiové panenské a slovanské vlasy na prodloužení nejvyšší kvality.',
    url: 'https://muzahair.cz/luxusni-vlasy-na-prodlouzeni',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'LUXE Panenské vlasy',
        url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/luxe',
        description: 'Panenské vlasy LUXE kvality — chemicky neošetřené, od jednoho dárce.',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Platinum Slovanské vlasy',
        url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition',
        description: 'Nejvyšší kvalita — slovanské panenské vlasy z Ukrajiny, Polska a Rumunska.',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Co jsou luxusní vlasy na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Luxusní vlasy na prodloužení jsou vlasy nejvyšší kvality — typicky panenské (chemicky neošetřené) nebo slovanské vlasy z Evropy. Mají zachovanou přirozenou kutikulu, jsou od jednoho dárce a vydrží 12–24 měsíců.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi LUXE a Platinum vlasy na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LUXE vlasy jsou panenské — chemicky neošetřené vlasy s přirozenou strukturou. Platinum edition jsou slovanské panenské vlasy (původ Ukrajina, Polsko, Rumunsko) — nejvyšší hustota a přirozeně světlý odstín. Platinum je naše nejluxusnější kategorie.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak dlouho vydrží luxusní vlasy na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'LUXE panenské vlasy vydrží 12–18 měsíců, Platinum slovanské vlasy 18–24 měsíců při správném použití a péči. Oproti standardním vlasům vydržívají 2–3× déle.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kde si mohu koupit luxusní vlasy na prodloužení v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair má showroom v Praze kde si luxusní vlasy LUXE a Platinum můžete prohlédnout osobně. Dostupné také v online e-shopu s dodáním do 48 hodin po celé ČR.',
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
            <span className="text-gray-800">Luxusní vlasy na prodloužení</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <span className="inline-block bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Prémiová kolekce
            </span>
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              Luxusní vlasy na prodloužení
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl">
              Certifikované panenské a slovanské vlasy z Evropy. Nejvyšší kvalita na českém trhu — LUXE a Platinum edition.
            </p>
            <p className="text-gray-500 max-w-2xl leading-relaxed">
              Luxusní vlasy na prodloužení nejsou jen o délce — jsou o původu, zpracování a trvanlivosti. Múza Hair nabízí výhradně prémiové vlasy s certifikovaným evropským původem, které vydrží 12 až 24 měsíců.
            </p>
          </div>

          {/* Luxury tiers */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Naše luxusní kolekce
            </h2>
            <div className="grid md:grid-cols-2 gap-6">

              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
                className="group block bg-gradient-to-br from-ivory to-white border-2 border-burgundy/20 rounded-2xl p-8 hover:border-burgundy hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">💎</div>
                  <span className="bg-burgundy/10 text-burgundy text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">LUXE</span>
                </div>
                <h3 className="text-2xl font-playfair text-burgundy mb-3">LUXE Panenské vlasy</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>✓ Chemicky neošetřené — 100% panenské</li>
                  <li>✓ Zachovaná přirozená kutikula</li>
                  <li>✓ Trvanlivost 12–18 měsíců</li>
                  <li>✓ Evropský původ, certifikát</li>
                </ul>
                <p className="text-burgundy font-semibold">od 6 900 Kč · Zobrazit →</p>
              </Link>

              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
                className="group block bg-gradient-to-br from-gray-50 to-white border-2 border-gray-300 rounded-2xl p-8 hover:border-gray-600 hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-bl-xl">
                  Nejluxusnější
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">👑</div>
                  <span className="bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">PLATINUM</span>
                </div>
                <h3 className="text-2xl font-playfair text-gray-800 mb-3">Platinum Slovanské vlasy</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>✓ Slovanský původ (UA, PL, RO)</li>
                  <li>✓ Přirozeně světlý odstín</li>
                  <li>✓ Trvanlivost 18–24 měsíců</li>
                  <li>✓ Nejvyšší hustota a lesk</li>
                </ul>
                <p className="text-gray-800 font-semibold">od 10 900 Kč · Zobrazit →</p>
              </Link>
            </div>
          </section>

          {/* What makes luxury hair luxury */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-4">
              Co dělá vlasy na prodloužení luxusními?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl">
              Ne každé vlasy na prodloužení jsou stejné. Rozdíl mezi standardními a luxusními vlasy je zásadní — v původu, zpracování i trvanlivosti.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🔴 Standardní vlasy (nevybírejte)</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✗ Sbírány od více dárců — různá struktura</li>
                  <li>✗ Kutikuly nasměrovány různými směry</li>
                  <li>✗ Chemicky ošetřeny silikonem (dočasný lesk)</li>
                  <li>✗ Po 2–3 měsících se třepí a matní</li>
                  <li>✗ Nelze barvit ani tvarovat</li>
                  <li>✗ Asijský původ — odlišná struktura vlasu</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">✅ Luxusní panenské vlasy (Múza Hair)</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Od jednoho dárce — jednotná struktura</li>
                  <li>✓ Kutikuly zachovány ve správném směru</li>
                  <li>✓ Bez chemikálií — přirozený lesk</li>
                  <li>✓ 12–24 měsíců při správné péči</li>
                  <li>✓ Lze barvit, foukat, žehlit</li>
                  <li>✓ Evropský (slovanský) původ — přirozený vzhled</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">Srovnání kvalit vlasů na prodloužení 2026</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-burgundy/20">
                    <th className="text-left py-3 font-semibold text-gray-800">Vlastnost</th>
                    <th className="text-center py-3 font-semibold text-gray-500">Standard</th>
                    <th className="text-center py-3 font-semibold text-burgundy">LUXE 💎</th>
                    <th className="text-center py-3 font-semibold text-gray-700">Platinum 👑</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Původ', 'Asie', 'Evropa', 'Slovanský (UA/PL/RO)'],
                    ['Chemické ošetření', 'Ano', 'Ne', 'Ne'],
                    ['Trvanlivost', '3–6 měs.', '12–18 měs.', '18–24 měs.'],
                    ['Lze barvit', 'Omezeně', 'Ano', 'Ano'],
                    ['Kutikula', 'Odstraněna', 'Zachována', 'Zachována'],
                    ['Cena od', '3 900 Kč', '6 900 Kč', '10 900 Kč'],
                  ].map(([prop, std, luxe, plat]) => (
                    <tr key={prop}>
                      <td className="py-3 font-medium text-gray-700">{prop}</td>
                      <td className="py-3 text-center text-gray-500">{std}</td>
                      <td className="py-3 text-center text-burgundy font-medium">{luxe}</td>
                      <td className="py-3 text-center text-gray-700 font-medium">{plat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Časté otázky o luxusních vlasech na prodloužení
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Co jsou panenské vlasy a proč jsou luxusnější?',
                  a: 'Panenské vlasy jsou chemicky zcela neošetřeny — nikdy nebyly barveny ani odbarvovány. Jsou odebírány od jednoho dárce, mají zachovanou přirozenou kutikulu a strukturu. Vydrží 2–4× déle než standardní vlasy a lze je opakovaně barvit a tvarovat.',
                },
                {
                  q: 'Jsou slovanské vlasy opravdu lepší?',
                  a: 'Pro evropské zákaznice ano — slovanské vlasy z Ukrajiny, Polska a Rumunska mají přirozeně světlejší odstín, jemnější strukturu a lépe splývají s evropskými vlasy. Jejich přirozená barva je blíže evropskému standardu, takže výsledek prodloužení vypadá přirozeněji.',
                },
                {
                  q: 'Jak poznám luxusní vlasy na prodloužení?',
                  a: 'Luxusní vlasy mají přirozený lesk (ne plastický), jsou hebké na dotek a mají zachovanou kutikulu — vlasy se třepí méně, nesplétají a nezamotávají. Certifikát původu je samozřejmostí. U Múza Hair garantujeme původ každé sady.',
                },
                {
                  q: 'Je rozdíl v luxusních vlasech na keratin vs. pásky?',
                  a: 'Kvalita vlasů (LUXE, Platinum) je stejná bez ohledu na metodu aplikace. Keratin i pásky jsou dostupné v obou luxusních kvalitách. Metoda závisí na vašich vlastních vlasech a preferencích stylistky.',
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
            <div className="text-4xl mb-3">💎</div>
            <h2 className="text-3xl font-playfair mb-3">Vyberte si svou luxusní kolekci</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">Panenské LUXE a slovanské Platinum vlasy — dostupné online nebo osobně v Praze.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
                className="px-6 py-3 bg-white text-burgundy rounded-lg font-medium hover:bg-ivory transition-colors">
                LUXE vlasy
              </Link>
              <Link href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors">
                Platinum vlasy
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
