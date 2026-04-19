import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Koupit Vlasy na Prodloužení Praha | Prémiový Showroom | Múza Hair',
  description: 'Kde koupit pravé vlasy na prodloužení v Praze? Múza Hair — showroom Praha, panenské a slovanské vlasy, keratin i pásky. Osobně nebo online. Ceny od 3 900 Kč.',
  keywords: [
    'kde koupit vlasy na prodloužení Praha',
    'koupit pravé vlasy Praha',
    'vlasy k prodloužení koupit Praha',
    'obchod vlasy na prodloužení Praha',
    'prodej vlasů Praha',
    'koupit panenské vlasy Praha',
    'vlasy na prodloužení Praha e-shop',
  ],
  openGraph: {
    title: 'Koupit Vlasy na Prodloužení Praha | Múza Hair Showroom',
    description: 'Prémiový showroom s pravými vlasy na prodloužení v Praze. Panenské, slovanské a evropské vlasy. Keratin, pásky, tresy.',
    url: 'https://muzahair.cz/koupit-vlasy-na-prodlouzeni-praha',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function KoupitVlasyPrahaPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Múza Hair Praha',
    description: 'Prémiový showroom s pravými vlasy na prodloužení v Praze. Panenské a slovanské vlasy.',
    url: 'https://muzahair.cz',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Praha',
      addressCountry: 'CZ',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '19:00',
    },
    hasMap: 'https://maps.google.com/?q=Praha',
    priceRange: '3900 Kč - 12 000 Kč',
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kde koupit pravé vlasy na prodloužení v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair provozuje prémiový showroom v Praze, kde si můžete pravé vlasy na prodloužení prohlédnout osobně. Vlasy jsou dostupné také v online e-shopu s dodáním do 48 hodin po celé ČR.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí pravé vlasy na prodloužení v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ceny pravých vlasů na prodloužení u Múza Hair začínají od 3 900 Kč za sadu Standard. LUXE kvalita se pohybuje od 6 900 Kč a Platinum edition od 10 900 Kč. Cena závisí na délce a gramáži.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi panenскými a běžnými vlasy na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Panenské vlasy nikdy nebyly chemicky ošetřeny — nebarveny ani odbarvovány. Jsou odebírány od jednoho dárce, mají zachovanou přirozenou strukturu a kutikulu. Vydrží 2–4× déle než standardní vlasy.',
        },
      },
      {
        '@type': 'Question',
        name: 'Lze si vlasy na prodloužení vybrat osobně v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano, v showroomu Múza Hair v Praze si můžete vlasy prohlédnout, ohmatat a porovnat různé délky, odstíny a kvality. Konzultace je zdarma, po domluvě.',
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
            <span className="text-gray-800">Koupit vlasy na prodloužení Praha</span>
          </nav>

          {/* Hero */}
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Kde koupit pravé vlasy na prodloužení v Praze
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl">
            Múza Hair — prémiový showroom i e-shop s panenскými a slovanskými vlasy. Osobní konzultace v Praze nebo dodání do 48 h po celé ČR.
          </p>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Hledáte kde koupit kvalitní vlasy na prodloužení v Praze? Nejste sami — ale pozor: ne každý e-shop je skutečný prodejce vlasů. Múza Hair je český výrobce s vlastní barvírnou a showroomem v Praze od roku 2016.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              href="/vlasy-k-prodlouzeni"
              className="px-8 py-4 bg-burgundy text-white rounded-lg font-medium hover:bg-burgundy/90 transition-colors"
            >
              Prohlédnout vlasy →
            </Link>
            <Link
              href="/kontakt"
              className="px-8 py-4 border border-burgundy text-burgundy rounded-lg font-medium hover:bg-burgundy/5 transition-colors"
            >
              Konzultace zdarma
            </Link>
          </div>

          {/* Why Muza */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Proč koupit vlasy na prodloužení u Múza Hair Praha?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '💎',
                  title: 'Panenské vlasy',
                  desc: 'Chemicky neošetřené vlasy od jednoho dárce. Nikdo jiný v Praze se na ně nespecializuje.',
                },
                {
                  icon: '🏙️',
                  title: 'Showroom v Praze',
                  desc: 'Přijďte osobně — vlasy si prohlédněte, ohmatejte a porovnejte různé délky a odstíny.',
                },
                {
                  icon: '🌍',
                  title: 'Slovanský původ',
                  desc: 'Vlasy z Ukrajiny, Polska a Rumunska. Certifikovaný původ, přirozená struktura.',
                },
                {
                  icon: '🎨',
                  title: 'Vlastní barvírna',
                  desc: 'Odbarvujeme vlasy sami v naší barvírně v Praze. Víme co v nich je — žádné neznámé chemikálie.',
                },
                {
                  icon: '⚡',
                  title: 'Dodání do 48 h',
                  desc: 'Objednáte online, vlasy máte do 2 dnů kdekoliv v ČR.',
                },
                {
                  icon: '✅',
                  title: '10 let zkušeností',
                  desc: 'Na trhu od roku 2016. Tisíce spokojených zákaznic v Praze i po celé ČR.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-ivory p-6 rounded-xl border border-gray-100">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Products section */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Co si můžete koupit — typy vlasů na prodloužení
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">💎</div>
                <h3 className="text-xl font-playfair text-burgundy mb-2">Panenské vlasy (nebarvené)</h3>
                <p className="text-gray-600 text-sm mb-3">
                  100% přírodní, chemicky neošetřené vlasy. Nejvyšší trvanlivost — 12–24 měsíců. Standard, LUXE, Platinum.
                </p>
                <p className="text-burgundy text-sm font-medium">od 3 900 Kč · Zobrazit →</p>
              </Link>

              <Link
                href="/vlasy-k-prodlouzeni/barvene-blond"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">✨</div>
                <h3 className="text-xl font-playfair text-burgundy mb-2">Barvené blond vlasy</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Profesionálně odbarvené v naší vlastní barvírně. Odstíny 5–10. Trvanlivost 6–12 měsíců.
                </p>
                <p className="text-burgundy text-sm font-medium">od 3 900 Kč · Zobrazit →</p>
              </Link>

              <Link
                href="/metody-zakonceni/vlasy-na-keratin"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="text-xl font-playfair text-burgundy mb-2">Vlasy na keratin</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Připevnění keratinovými spojeními. Nejpřirozenější výsledek, trvanlivost 3–6 měsíců.
                </p>
                <p className="text-burgundy text-sm font-medium">Zobrazit metodu →</p>
              </Link>

              <Link
                href="/metody-zakonceni/pasky-nano-tapes"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">📎</div>
                <h3 className="text-xl font-playfair text-burgundy mb-2">Vlasy na pásky (Tape-in)</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Nejrychlejší metoda — aplikace 30–60 minut. Šetrné k vlastním vlasům.
                </p>
                <p className="text-burgundy text-sm font-medium">Zobrazit metodu →</p>
              </Link>
            </div>
          </section>

          {/* Price overview */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-3xl font-playfair text-burgundy mb-2">
              Orientační ceny vlasů na prodloužení Praha 2026
            </h2>
            <p className="text-gray-500 text-sm mb-6">Ceny za celou sadu (délka 45–65 cm, 100 g). Přesná cena závisí na délce a gramáži.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-burgundy/20">
                    <th className="text-left py-3 font-semibold text-gray-800">Kvalita</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Typ vlasů</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Trvanlivost</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Cena od</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 font-medium">Standard</td>
                    <td className="py-3 text-gray-600">Remy vlasy</td>
                    <td className="py-3 text-gray-600">6–9 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">3 900 Kč</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 font-medium">LUXE</td>
                    <td className="py-3 text-gray-600">Panenské vlasy</td>
                    <td className="py-3 text-gray-600">12–18 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">6 900 Kč</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Platinum</td>
                    <td className="py-3 text-gray-600">Slovanské panenské</td>
                    <td className="py-3 text-gray-600">18–24 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">10 900 Kč</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-4">* Ceny jsou orientační a závisí na délce, gramáži a aktuální ceníkové sadě. Přesné ceny viz produktové stránky.</p>
          </section>

          {/* How to buy */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Jak koupit vlasy na prodloužení u Múza Hair
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Vyberte typ', desc: 'Panenské, barvené nebo slovanské vlasy. Dle metody: keratin, pásky nebo tresy.' },
                { step: '2', title: 'Zvolte délku a gramáž', desc: 'Délka 35–75 cm. Gramáž dle hustoty vlastních vlasů (typicky 80–150 g).' },
                { step: '3', title: 'Objednejte online nebo osobně', desc: 'E-shop s dopravou do 48 h, nebo showroom Praha — po domluvě.' },
                { step: '4', title: 'Aplikace u stylistky', desc: 'Doporučujeme aplikaci u certifikované stylistky. Poradíme kde v Praze.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-burgundy text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Časté otázky — koupit vlasy na prodloužení Praha
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Kde v Praze si mohu vlasy na prodloužení osobně prohlédnout?',
                  a: 'Múza Hair provozuje showroom v Praze. Přijďte po předchozí domluvě — vlasy si ohmatáte, porovnáte délky a odstíny a dostanete bezplatnou konzultaci.',
                },
                {
                  q: 'Je lepší koupit vlasy online nebo v showroomu?',
                  a: 'Pokud jste začátečnice, doporučujeme showroom — poradíme vám s výběrem gramáže, délky a metody. Zkušené zákaznice nakupují pohodlně online s dodáním do 48 h.',
                },
                {
                  q: 'Jak dlouho vydrží pravé vlasy na prodloužení?',
                  a: 'Standard vlasy vydrží 6–9 měsíců, LUXE panenské vlasy 12–18 měsíců, Platinum slovanské vlasy 18–24 měsíců při správné péči.',
                },
                {
                  q: 'Mohu vrátit vlasy na prodloužení, pokud mi nevyhovují?',
                  a: 'Ano, nepoužité vlasy v původním obalu lze vrátit do 14 dnů od nákupu. Podmínky viz stránka platba a vrácení.',
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
            <h2 className="text-3xl font-playfair mb-3">Prohlédněte si naše vlasy</h2>
            <p className="text-white/80 mb-6">Prémiové panenské a slovanské vlasy — dostupné online i osobně v Praze.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="px-6 py-3 bg-white text-burgundy rounded-lg font-medium hover:bg-ivory transition-colors"
              >
                Panenské vlasy
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni/barvene-blond"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Barvené blond
              </Link>
              <Link
                href="/cenik"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Ceník
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
