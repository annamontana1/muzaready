import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vlasy k Prodloužení Praha | Prémiový Showroom & E-shop | Múza Hair',
  description: 'Vlasy k prodloužení Praha — jediný prémiový showroom v Praze. Keratin, tape-in, weft/tresy. Osobní konzultace, dodání 48 h po celé ČR. Ceny od 3 900 Kč.',
  keywords: [
    'vlasy k prodloužení Praha',
    'prodlužování vlasů Praha',
    'prodej vlasů Praha',
    'kde koupit vlasy k prodloužení Praha',
    'showroom vlasy Praha',
    'vlasy na prodloužení Praha',
    'pravé vlasy Praha showroom',
    'keratin vlasy Praha',
    'tape-in vlasy Praha',
  ],
  openGraph: {
    title: 'Vlasy k Prodloužení Praha | Showroom & E-shop | Múza Hair',
    description: 'Jediný prémiový showroom s pravými vlasy k prodloužení v Praze. Panenské, slovanské a evropské vlasy. Keratin, tape-in, weft/tresy.',
    url: 'https://muzahair.cz/vlasy-k-prodlouzeni-praha',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function VlasyKProdlouzeniPrahaPage() {
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Múza Hair Praha — Showroom vlasy k prodloužení',
    description: 'Prémiový showroom s pravými vlasy k prodloužení v Praze. Panenské, slovanské a evropské vlasy. Keratin, tape-in, weft/tresy. Na trhu od roku 2016.',
    url: 'https://muzahair.cz',
    telephone: '+420',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Praha',
      addressLocality: 'Praha',
      addressRegion: 'Praha',
      postalCode: '110 00',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.0755,
      longitude: 14.4378,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    hasMap: 'https://maps.google.com/?q=Praha',
    priceRange: '3 900 Kč – 12 000 Kč',
    image: 'https://muzahair.cz/og-image.jpg',
    sameAs: ['https://muzahair.cz'],
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
        name: 'Vlasy k prodloužení Praha',
        item: 'https://muzahair.cz/vlasy-k-prodlouzeni-praha',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kde v Praze si mohu koupit vlasy k prodloužení osobně?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair provozuje od roku 2016 prémiový showroom v Praze — jediné místo v hlavním městě, kde si pravé vlasy k prodloužení můžete osobně prohlédnout, ohmatat a porovnat různé délky, odstíny i kvality. Konzultace je zdarma, po předchozí domluvě.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaké typy vlasů k prodloužení jsou dostupné v pražském showroomu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'V pražském showroomu Múza Hair najdete vlasy na keratin (keratinová spojení), vlasy na pásky (tape-in), wefty/tresy pro zapletení i vplétání. Dostupné ve třech kvalitách: Standard (remy), LUXE (panenské) a Platinum (slovanské panenské). Délky od 35 do 75 cm.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak rychle dostanu vlasy k prodloužení objednané online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vlasy k prodloužení objednané v e-shopu Múza Hair jsou expedovány zpravidla do 24 hodin od přijetí objednávky. Standardní dodání po celé České republice trvá 1–2 pracovní dny, tedy maximálně 48 hodin.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kolik stojí vlasy k prodloužení v Praze u Múza Hair?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ceny vlasů k prodloužení u Múza Hair začínají od 3 900 Kč za sadu Standard (remy vlasy). LUXE panenské vlasy jsou od 6 900 Kč a Platinum slovanské panenské vlasy od 10 900 Kč. Cena vždy závisí na délce a gramáži sady.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
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
            <span className="text-gray-800">Vlasy k prodloužení Praha</span>
          </nav>

          {/* Hero */}
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
            Vlasy k prodloužení Praha — showroom i e-shop
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-3xl">
            Jediný prémiový showroom pro vlasy k prodloužení v Praze. Přijďte osobně nebo objednejte online — dodání do 48 hodin po celé ČR.
          </p>
          <p className="text-gray-500 mb-6 max-w-2xl">
            Hledáte kde koupit vlasy k prodloužení v Praze? Múza Hair je český výrobce s vlastní barvírnou a pražským showroomem od roku 2016. Nabízíme panenské, slovanské i evropské vlasy ve třech kvalitách — vždy s osobní konzultací a garancí původu.
          </p>

          {/* Opening hours badge */}
          <div className="inline-flex items-center gap-2 bg-ivory border border-burgundy/20 rounded-full px-5 py-2 mb-10">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-700">Showroom Praha: Po–Ne 9:00–19:00 · Konzultace po domluvě</span>
          </div>

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
              Domluvit konzultaci zdarma
            </Link>
          </div>

          {/* Why only Muza in Prague */}
          <section className="mb-14 bg-ivory rounded-2xl p-8 border border-burgundy/10">
            <h2 className="text-3xl font-playfair text-burgundy mb-3">
              Jediný prémiový showroom vlasů k prodloužení v Praze
            </h2>
            <p className="text-gray-600 mb-6 max-w-3xl">
              V Praze neexistuje druhé místo, kde byste si mohli panenské a slovanské vlasy k prodloužení osobně prohlédnout a vyzkoušet. Múza Hair showroom je unikátní — máme stálou zásobu vzorků ve všech délkách, gramážích a odstínech. Víte přesně, co kupujete.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🏙️',
                  title: 'Praha showroom',
                  desc: 'Fyzické místo v Praze. Prohlédněte vlasy na vlastní oči — různé délky, odstíny, typy. Konzultace zdarma.',
                },
                {
                  icon: '💬',
                  title: 'Osobní konzultace',
                  desc: 'Naše specialistky vám pomohou vybrat správnou gramáž, délku a metodu prodloužení podle vašich vlasů.',
                },
                {
                  icon: '⚡',
                  title: 'Dodání do 48 h po ČR',
                  desc: 'Nestíháte do Prahy? Objednejte online — expedujeme do 24 h, vlasy máte do 2 dnů kdekoliv v ČR.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white p-6 rounded-xl border border-gray-100">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Muza section */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Proč nakupovat vlasy k prodloužení u Múza Hair?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: '💎',
                  title: 'Panenské vlasy',
                  desc: 'Chemicky neošetřené vlasy od jednoho dárce. Zachovaná kutikula, přirozená struktura. Trvanlivost 12–24 měsíců.',
                },
                {
                  icon: '🌍',
                  title: 'Slovanský a evropský původ',
                  desc: 'Vlasy z Ukrajiny, Polska a Rumunska. Certifikovaný původ, přirozená textura shodná s českými vlasy.',
                },
                {
                  icon: '🎨',
                  title: 'Vlastní barvírna v Praze',
                  desc: 'Odbarvujeme a barvíme vlasy sami v naší barvírně v Praze. Transparentní složení, bez neznámých chemikálií.',
                },
                {
                  icon: '🔬',
                  title: 'Certifikovaná kvalita',
                  desc: 'Každá šarže vlasů prochází vstupní kontrolou. Garantujeme 100% pravé lidské vlasy bez příměsi syntetiky.',
                },
                {
                  icon: '🛡️',
                  title: 'Záruka a vrácení',
                  desc: 'Nepoužité vlasy lze vrátit do 14 dní. Transparentní podmínky, žádné skryté poplatky.',
                },
                {
                  icon: '✅',
                  title: 'Od roku 2016 v Praze',
                  desc: 'Téměř 10 let zkušeností. Tisíce spokojených zákaznic v Praze i po celé ČR. Recenze k nahlédnutí.',
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

          {/* 3 ways to buy */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-3">
              3 způsoby, jak získat vlasy k prodloužení od Múza Hair
            </h2>
            <p className="text-gray-500 mb-8">Vyberte si způsob, který vám nejlépe vyhovuje.</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-burgundy rounded-xl p-6">
                <div className="text-4xl mb-4">🏬</div>
                <h3 className="text-xl font-playfair text-burgundy mb-3">1. Showroom osobně</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Přijďte do pražského showroomu. Vlasy si fyzicky prohlédnete, porovnáte odstíny a délky, dostanete osobní konzultaci od naší specialistky. Ideální pro první nákup.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Fyzická ukázka všech vzorků</li>
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Konzultace gramáže a metody</li>
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Odnesete si vlasy hned</li>
                </ul>
                <Link href="/kontakt" className="text-burgundy text-sm font-medium hover:underline">
                  Domluvit návštěvu →
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-playfair text-burgundy mb-3">2. Online e-shop</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Pohodlný nákup z domova. Vyberte si vlasy podle délky, gramáže a odstínu v e-shopu. Dodání do 48 hodin po celé České republice. Platba kartou nebo převodem.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Dodání do 48 h po celé ČR</li>
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Platba kartou nebo převodem</li>
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Vrácení do 14 dní</li>
                </ul>
                <Link href="/vlasy-k-prodlouzeni" className="text-burgundy text-sm font-medium hover:underline">
                  Přejít do e-shopu →
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="text-4xl mb-4">📞</div>
                <h3 className="text-xl font-playfair text-burgundy mb-3">3. Konzultace + objednávka</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Nevíte si rady? Kontaktujte nás online nebo telefonicky. Poradíme vám s výběrem a připravíme objednávku na míru. Ideální pro zákaznice mimo Prahu.
                </p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Poradenství zdarma</li>
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Objednávka na míru</li>
                  <li className="flex items-start gap-2"><span className="text-burgundy mt-0.5">✓</span> Dodání kdekoli v ČR</li>
                </ul>
                <Link href="/kontakt" className="text-burgundy text-sm font-medium hover:underline">
                  Kontaktovat nás →
                </Link>
              </div>
            </div>
          </section>

          {/* Types of hair extensions */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Typy vlasů k prodloužení — co najdete v pražském showroomu
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/metody-zakonceni/vlasy-na-keratin"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="text-xl font-playfair text-burgundy mb-2">Vlasy na keratin</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Vlasy zakončené keratinovými spojeními — nejpřirozenější výsledek prodloužení. Aplikace trvá 2–4 hodiny, trvanlivost 3–6 měsíců. Vhodné pro všechny typy vlasů.
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mb-3">
                  <li>• Trvanlivost: 3–6 měsíců</li>
                  <li>• Aplikace: 2–4 hodiny</li>
                  <li>• Vhodné pro: střední a silnější vlasy</li>
                </ul>
                <p className="text-burgundy text-sm font-medium">Zobrazit vlasy na keratin →</p>
              </Link>

              <Link
                href="/metody-zakonceni/vlasove-pasky-tape-in"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">📎</div>
                <h3 className="text-xl font-playfair text-burgundy mb-2">Vlasy na pásky (Tape-in)</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Nejrychlejší metoda aplikace — 30–60 minut. Vlasy jsou připevněny lepicími páskami. Šetrné k vlastním vlasům, snadno přelepitelné. Trvanlivost 6–8 týdnů.
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mb-3">
                  <li>• Trvanlivost: 6–8 týdnů (přelepení)</li>
                  <li>• Aplikace: 30–60 minut</li>
                  <li>• Vhodné pro: jemné i normální vlasy</li>
                </ul>
                <p className="text-burgundy text-sm font-medium">Zobrazit vlasy na pásky →</p>
              </Link>

              <Link
                href="/vlasy-k-prodlouzeni"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">🧵</div>
                <h3 className="text-xl font-playfair text-burgundy mb-2">Wefty a tresy</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  Pásy vlasů sešité do weftu. Vhodné pro vplétání (zapletení, mikroringy) nebo šití. Flexibilní řešení pro salon i domácí použití. Dostupné v libovolné gramáži.
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mb-3">
                  <li>• Variabilní délka a gramáž</li>
                  <li>• Metody: vplétání, zapletení, šití</li>
                  <li>• Vhodné pro: normální a silnější vlasy</li>
                </ul>
                <p className="text-burgundy text-sm font-medium">Zobrazit wefty →</p>
              </Link>

              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-burgundy hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">💎</div>
                <h3 className="text-xl font-playfair text-burgundy mb-2">Panenské nebarvené vlasy</h3>
                <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                  100% přírodní vlasy, které nikdy nebyly chemicky ošetřeny. Lze je barvit, tónovat nebo zesvětlovat podle potřeby. Nejvyšší trvanlivost ze všech typů.
                </p>
                <ul className="text-xs text-gray-500 space-y-1 mb-3">
                  <li>• Trvanlivost: 12–24 měsíců</li>
                  <li>• Lze barvit na požadovaný odstín</li>
                  <li>• Dostupné ve všech metodách zakončení</li>
                </ul>
                <p className="text-burgundy text-sm font-medium">Zobrazit panenské vlasy →</p>
              </Link>
            </div>
          </section>

          {/* Price table */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-3xl font-playfair text-burgundy mb-2">
              Ceník vlasů k prodloužení Praha 2026
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Orientační ceny za celou sadu (délka 45–65 cm, 100 g). Přesná cena závisí na délce, gramáži a metodě zakončení.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-burgundy/20">
                    <th className="text-left py-3 font-semibold text-gray-800">Kvalita</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Typ vlasů</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Metody</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Trvanlivost</th>
                    <th className="text-left py-3 font-semibold text-gray-800">Cena od</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-3 font-medium">Standard</td>
                    <td className="py-3 text-gray-600">Remy vlasy</td>
                    <td className="py-3 text-gray-600">Keratin, pásky, weft</td>
                    <td className="py-3 text-gray-600">6–9 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">3 900 Kč</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 font-medium">LUXE</td>
                    <td className="py-3 text-gray-600">Panenské vlasy</td>
                    <td className="py-3 text-gray-600">Keratin, pásky, weft</td>
                    <td className="py-3 text-gray-600">12–18 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">6 900 Kč</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Platinum</td>
                    <td className="py-3 text-gray-600">Slovanské panenské</td>
                    <td className="py-3 text-gray-600">Keratin, pásky, weft</td>
                    <td className="py-3 text-gray-600">18–24 měsíců</td>
                    <td className="py-3 font-semibold text-burgundy">10 900 Kč</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              * Ceny jsou orientační. Přesné ceny dle délky, gramáže a zakončení viz{' '}
              <Link href="/cenik" className="underline hover:text-burgundy">ceník</Link>.
            </p>
          </section>

          {/* Location/showroom section */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Kde nás najdete — Praha showroom Múza Hair
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Múza Hair showroom se nachází v Praze a je dostupný po předchozí telefonické nebo e-mailové domluvě. Otevřeno každý den v týdnu od 9:00 do 19:00 — včetně víkendů a svátků.
                </p>
                <div className="bg-ivory rounded-xl p-6 border border-gray-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-burgundy text-lg mt-0.5">📍</span>
                    <div>
                      <p className="font-semibold text-gray-900">Adresa showroomu</p>
                      <p className="text-gray-600 text-sm">Praha, Česká republika</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-burgundy text-lg mt-0.5">🕐</span>
                    <div>
                      <p className="font-semibold text-gray-900">Otevírací doba</p>
                      <p className="text-gray-600 text-sm">Po–Ne: 9:00–19:00 (po předchozí domluvě)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-burgundy text-lg mt-0.5">📞</span>
                    <div>
                      <p className="font-semibold text-gray-900">Rezervace konzultace</p>
                      <Link href="/kontakt" className="text-burgundy text-sm hover:underline">
                        Kontaktovat Múza Hair →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <p className="text-4xl mb-3">🗺️</p>
                  <p className="text-gray-500 text-sm mb-3">Showroom Múza Hair, Praha</p>
                  <a
                    href="https://maps.google.com/?q=Praha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-burgundy text-sm font-medium hover:underline"
                  >
                    Otevřít v Google Maps →
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* How to proceed */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Jak postupovat při výběru vlasů k prodloužení
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  step: '1',
                  title: 'Vyberte metodu',
                  desc: 'Keratin pro nejpřirozenější výsledek, pásky pro rychlou aplikaci, weft pro flexibilitu.',
                },
                {
                  step: '2',
                  title: 'Zvolte délku a gramáž',
                  desc: 'Délka 35–75 cm, gramáž 80–150 g dle hustoty vašich vlastních vlasů. Poradíme.',
                },
                {
                  step: '3',
                  title: 'Vyberte kvalitu',
                  desc: 'Standard (remy) pro kratší noření, LUXE nebo Platinum pro maximální trvanlivost.',
                },
                {
                  step: '4',
                  title: 'Domluvte aplikaci',
                  desc: 'Doporučujeme certifikovanou stylistku. Poradíme vám s výběrem v Praze i ve vašem regionu.',
                },
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

          {/* Internal links */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Prozkoumejte naše kategorie vlasů
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  href: '/slovanske-vlasy-na-prodlouzeni',
                  title: 'Slovanské vlasy',
                  desc: 'Nejkvalitnější vlasy z Ukrajiny, Polska a Rumunska. Nejbližší původ k českým vlasům.',
                },
                {
                  href: '/evropske-vlasy-na-prodlouzeni',
                  title: 'Evropské vlasy',
                  desc: 'Remy a panenské evropské vlasy — přirozená textura, snadné prolínání s vlastními vlasy.',
                },
                {
                  href: '/luxusni-vlasy-na-prodlouzeni',
                  title: 'Luxusní vlasy',
                  desc: 'Prémiová výběrová edice pro nejnáročnější zákaznice. Trvanlivost až 24 měsíců.',
                },
                {
                  href: '/vlasy-k-prodlouzeni/nebarvene-panenske',
                  title: 'Panenské nebarvené vlasy',
                  desc: 'Chemicky neošetřené vlasy — barvíte si je sami na přesně požadovaný odstín.',
                },
                {
                  href: '/vlasy-k-prodlouzeni/barvene-blond',
                  title: 'Barvené blond vlasy',
                  desc: 'Profesionálně odbarvené v naší vlastní barvírně. Odstíny 5–10.',
                },
                {
                  href: '/ceske-vlasy-na-prodlouzeni',
                  title: 'České vlasy',
                  desc: 'Vlasy s texturou odpovídající českým vlasům — nejpřirozenější výsledek.',
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-burgundy hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-burgundy transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Časté otázky — vlasy k prodloužení Praha
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Kde v Praze si mohu koupit vlasy k prodloužení osobně?',
                  a: 'Múza Hair provozuje od roku 2016 prémiový showroom v Praze — jediné místo v hlavním městě, kde si pravé vlasy k prodloužení můžete osobně prohlédnout, ohmatat a porovnat různé délky, odstíny i kvality. Konzultace je zdarma, po předchozí domluvě. Kontakt a adresu najdete na stránce /kontakt.',
                },
                {
                  q: 'Jaké typy vlasů k prodloužení jsou k dispozici?',
                  a: 'U Múza Hair najdete vlasy na keratin (keratinová spojení), vlasy na pásky (tape-in) a wefty/tresy. Všechny typy jsou dostupné ve třech kvalitách: Standard (remy vlasy), LUXE (panenské vlasy) a Platinum (slovanské panenské vlasy). Délky od 35 do 75 cm.',
                },
                {
                  q: 'Jak rychle dostanu vlasy k prodloužení objednané online?',
                  a: 'Vlasy objednané v e-shopu Múza Hair jsou expedovány do 24 hodin od přijetí objednávky. Standardní dodání přes přepravní společnost trvá 1–2 pracovní dny, tedy maximálně 48 hodin po celé České republice.',
                },
                {
                  q: 'Kolik stojí vlasy k prodloužení u Múza Hair Praha?',
                  a: 'Ceny začínají od 3 900 Kč za sadu Standard (remy vlasy, délka cca 45–55 cm, 100 g). LUXE panenské vlasy jsou od 6 900 Kč a Platinum slovanské panenské vlasy od 10 900 Kč. Přesná cena vždy závisí na délce a gramáži sady.',
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
              Navštivte nás v Praze nebo objednejte online
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Prémiové vlasy k prodloužení — dostupné v jediném pražském showroomu nebo s dodáním do 48 hodin po celé ČR. Konzultace zdarma.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/vlasy-k-prodlouzeni"
                className="px-6 py-3 bg-white text-burgundy rounded-lg font-medium hover:bg-ivory transition-colors"
              >
                Prohlédnout vlasy
              </Link>
              <Link
                href="/kontakt"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Kontakt & showroom
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
