import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panenské Vlasy Praha | Neošetřené Virgin Hair na Prodloužení | Múza Hair',
  description: 'Panenské vlasy na prodloužení Praha — chemicky neošetřené, od jednoho dárce, se zachovanou kutikulou. LUXE a Platinum edition. Showroom Praha, dodání do 48 h. Od 6 900 Kč.',
  keywords: [
    'panenské vlasy Praha',
    'panenské vlasy na prodloužení',
    'koupit panenské vlasy Praha',
    'virgin hair Praha',
    'neošetřené vlasy na prodloužení',
    'neošetřené panenské vlasy',
    'virgin hair na prodloužení',
    'panenské vlasy cena',
  ],
  openGraph: {
    title: 'Panenské Vlasy na Prodloužení Praha | Múza Hair',
    description: 'Chemicky neošetřené panenské vlasy od jednoho dárce se zachovanou kutikulou. LUXE a Platinum edition. Showroom Praha.',
    url: 'https://muzahair.cz/panenenske-vlasy-praha',
    locale: 'cs_CZ',
    type: 'website',
  },
};

export default function PanenskéVlasyPrahaPage() {
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Panenské vlasy na prodloužení — Múza Hair Praha',
    description:
      'Chemicky neošetřené panenské vlasy (virgin hair) od jednoho dárce se zachovanou přirozenou kutikulou. Dostupné ve variantách LUXE a Platinum. Trvanlivost 12–24 měsíců.',
    brand: {
      '@type': 'Brand',
      name: 'Múza Hair',
    },
    url: 'https://muzahair.cz/panenenske-vlasy-praha',
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'CZK',
        price: '6900',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
        url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/luxe',
        name: 'Panenské vlasy LUXE',
      },
      {
        '@type': 'Offer',
        priceCurrency: 'CZK',
        price: '10900',
        priceValidUntil: '2026-12-31',
        availability: 'https://schema.org/InStock',
        url: 'https://muzahair.cz/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition',
        name: 'Panenské vlasy Platinum (slovanské)',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Co jsou panenské vlasy na prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Panenské vlasy (virgin hair) jsou 100% přírodní vlasy, které nikdy nebyly chemicky ošetřeny — nebyly barveny, odbarvovány ani trvaleny. Jsou odebírány od jednoho dárce, díky čemuž mají jednotnou strukturu a zachovanou přirozenou kutikulu orientovanou ve správném směru. Výsledkem je přirozený lesk, hebkost a trvanlivost 12–24 měsíců.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaký je rozdíl mezi panenským vlasem a remy vlasem?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Remy vlasy mají kutikuly orientovány jedním směrem, ale mohou být chemicky ošetřeny (barveny, potaženy silikonem). Panenské vlasy jsou přísněji definovány — musí být chemicky zcela neošetřeny od odběru. To znamená, že panenské vlasy jsou vždy remy, ale ne každý remy vlas je panenský. Panenské vlasy proto vydrží déle a lépe reagují na opětovné barvení.',
        },
      },
      {
        '@type': 'Question',
        name: 'Lze panenské vlasy na prodloužení barvit?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano — a to je jedna z hlavních výhod panenských vlasů. Protože nebyly předtím chemicky ošetřeny, reagují na barvení a zesvětlování přirozeně, stejně jako vaše vlastní vlasy. Lze je barvit, melírovat i tónovat. Doporučujeme barvení svěřit zkušené kadeřnici a používat vlasové barvy bez amoniaku pro zachování maximální kvality.',
        },
      },
      {
        '@type': 'Question',
        name: 'Kde mohu koupit panenské vlasy v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair prodává panenské vlasy ve svém pražském showroomu, kde si sady můžete osobně prohlédnout a porovnat odstíny. Dostupné jsou také v online e-shopu s dodáním po celé ČR do 48 hodin. Nabízíme varianty LUXE (panenské evropské) a Platinum (slovanské panenské z Ukrajiny, Polska a Rumunska).',
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
        name: 'Vlasy k prodloužení',
        item: 'https://muzahair.cz/vlasy-k-prodlouzeni',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Panenské vlasy Praha',
        item: 'https://muzahair.cz/panenenske-vlasy-praha',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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
            <Link href="/vlasy-k-prodlouzeni" className="hover:text-burgundy">Vlasy k prodloužení</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">Panenské vlasy Praha</span>
          </nav>

          {/* Hero */}
          <div className="mb-12">
            <span className="inline-block bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              100% Virgin Hair — neošetřené
            </span>
            <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-4">
              Panenské vlasy na prodloužení Praha
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl">
              Chemicky neošetřené vlasy od jednoho dárce se zachovanou přirozenou kutikulou. Nejvyšší standard prodloužení vlasů — dostupný v Praze od roku 2016.
            </p>
            <p className="text-gray-500 max-w-2xl leading-relaxed">
              Panenské vlasy (virgin hair) jsou tou nejčistší formou vlasů na prodloužení. Múza Hair je nabízí ve dvou prémiových kolekcích — LUXE a Platinum — s garantovaným evropským původem a certifikátem kvality.
            </p>
          </div>

          {/* What is virgin hair */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-3xl font-playfair text-burgundy mb-4">
              Co jsou panenské vlasy (virgin hair)?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl leading-relaxed">
              Termín <strong>panenské vlasy</strong> označuje vlasy, které od okamžiku odběru neprošly žádným chemickým procesem. Jsou to vlasy v jejich přirozené, nepozměněné podobě — tak, jak rostly na hlavě dárce.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-5 border border-burgundy/10">
                <div className="text-2xl mb-2">🧬</div>
                <h3 className="font-semibold text-gray-900 mb-2">Chemicky neošetřené</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Nikdy nebyly barveny, odbarvovány, trvale onduleny ani jinak chemicky upravovány. Přirozená struktura je zcela zachována.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-burgundy/10">
                <div className="text-2xl mb-2">👤</div>
                <h3 className="font-semibold text-gray-900 mb-2">Od jednoho dárce</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Každá sada pochází od jediného dárce, což zaručuje jednotnou strukturu, tloušťku a přirozený splývavý pohyb vlasů.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-burgundy/10">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-semibold text-gray-900 mb-2">Zachovaná kutikula</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Kutikuly jsou zachovány a orientovány ve správném směru od kořínku ke špičce. Výsledkem je přirozený lesk a minimální třepení.
                </p>
              </div>
            </div>
          </section>

          {/* Product tiers */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-2">
              Panenské vlasy Praha — naše kolekce
            </h2>
            <p className="text-gray-500 mb-6">
              Nabízíme dva stupně panenských vlasů i standardní remy kolekci — vyberte podle svých potřeb a rozpočtu.
            </p>
            <div className="grid md:grid-cols-3 gap-5">

              {/* Standard */}
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-400 hover:shadow-md transition-all"
              >
                <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Standard</span>
                <h3 className="text-xl font-playfair text-gray-800 mb-3">Remy vlasy</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-5">
                  <li>✓ Kutikuly ve správném směru</li>
                  <li>✓ Přírodní vlasy</li>
                  <li>✓ Trvanlivost 3–6 měsíců</li>
                  <li>✓ Asijský i evropský původ</li>
                </ul>
                <p className="text-gray-700 font-semibold text-sm">od 3 900 Kč · Zobrazit →</p>
              </Link>

              {/* LUXE */}
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
                className="group block bg-gradient-to-br from-ivory to-white border-2 border-burgundy/20 rounded-2xl p-6 hover:border-burgundy hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block bg-burgundy/10 text-burgundy text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">LUXE</span>
                  <span className="text-burgundy text-xs font-medium">Nejprodávanější</span>
                </div>
                <h3 className="text-xl font-playfair text-burgundy mb-3">Panenské vlasy LUXE</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-5">
                  <li>✓ 100% chemicky neošetřené</li>
                  <li>✓ Od jednoho dárce</li>
                  <li>✓ Trvanlivost 12–18 měsíců</li>
                  <li>✓ Evropský původ, certifikát</li>
                </ul>
                <p className="text-burgundy font-semibold text-sm">od 6 900 Kč · Zobrazit →</p>
              </Link>

              {/* Platinum */}
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
                className="group block bg-gradient-to-br from-gray-50 to-white border-2 border-gray-300 rounded-2xl p-6 hover:border-gray-600 hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-xl">
                  Prémiové
                </div>
                <span className="inline-block bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">PLATINUM</span>
                <h3 className="text-xl font-playfair text-gray-800 mb-3">Slovanské panenské vlasy</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-5">
                  <li>✓ Slovanský původ (UA, PL, RO)</li>
                  <li>✓ Přirozeně světlý odstín</li>
                  <li>✓ Trvanlivost 18–24 měsíců</li>
                  <li>✓ Nejvyšší hustota a hebkost</li>
                </ul>
                <p className="text-gray-800 font-semibold text-sm">od 10 900 Kč · Zobrazit →</p>
              </Link>

            </div>
          </section>

          {/* Price table */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-2xl font-playfair text-burgundy mb-6">
              Srovnání kvality vlasů na prodloužení 2026
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-burgundy/20">
                    <th className="text-left py-3 font-semibold text-gray-800">Vlastnost</th>
                    <th className="text-center py-3 font-semibold text-gray-500">Standard (Remy)</th>
                    <th className="text-center py-3 font-semibold text-burgundy">LUXE (Panenské)</th>
                    <th className="text-center py-3 font-semibold text-gray-700">Platinum (Slovanské)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Původ', 'Asie / Evropa', 'Evropa', 'Slovanský (UA/PL/RO)'],
                    ['Chemické ošetření', 'Možné', 'Nikdy', 'Nikdy'],
                    ['Kutikula', 'Zachována', 'Zachována', 'Zachována'],
                    ['Dárci', '1–3', '1', '1'],
                    ['Lze barvit / zesvětlovat', 'Omezeně', 'Ano', 'Ano'],
                    ['Přirozený lesk', 'Středně', 'Vysoký', 'Nejvyšší'],
                    ['Trvanlivost', '3–6 měs.', '12–18 měs.', '18–24 měs.'],
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

          {/* Why virgin hair */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-4">
              Proč jsou panenské vlasy nejlepší volbou?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl leading-relaxed">
              Panenské vlasy nejsou jen marketingový termín. Jsou chemicky nedotčenou surovinou, která se chová jako vaše vlastní vlasy — protože vlastně jsou vlasy v jejich přirozené podobě.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-lg">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Mimořádná trvanlivost</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Panenské vlasy LUXE vydrží 12–18 měsíců, Platinum 18–24 měsíců. Oproti standardním vlasům, které se po 3–6 měsících třepí a matní, je to 3–4násobná životnost.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-lg">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Lze opakovaně barvit</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Protože panenské vlasy nebyly předtím chemicky ošetřeny, reagují na barvení přirozeně. Lze je zesvětlit, tónovat nebo melírovat — tak jako vaše vlastní vlasy.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-lg">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Přirozený vzhled a pohyb</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Zachovaná kutikula a jednotná struktura od jednoho dárce zajišťují, že vlasy splývají přirozeně, neelectrizují se a vizuálně splývají s vašimi vlastními vlasy.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-lg">4</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Bez umělého lesku</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Standardní vlasy jsou potaženy silikonem pro dočasný lesk — ten po prvním mytí mizí. Panenské vlasy mají lesk přirozený, který se zachovává po celou dobu jejich životnosti.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-lg">5</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Tepelné tvarování bez omezení</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Panenské vlasy snáší foukaní, žehlení i kulmu stejně dobře jako vaše vlastní vlasy. Nevyžadují speciální přípravu ani zvláštní ochranné přípravky.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-burgundy/10 text-burgundy rounded-full flex items-center justify-center font-bold text-lg">6</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Ekonomičtější v dlouhodobém horizontu</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      I přes vyšší pořizovací cenu jsou panenské vlasy ekonomičtější — díky 3–4násobné trvanlivosti vychází cena na měsíc používání srovnatelně nebo nižší než u levnějších variant.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to recognize real virgin hair */}
          <section className="mb-14 border border-burgundy/20 rounded-2xl p-8">
            <h2 className="text-3xl font-playfair text-burgundy mb-4">
              Jak poznat pravé panenské vlasy — 4 kritéria
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl leading-relaxed">
              Na trhu se bohužel prodávají vlasy označované jako "panenské", které jimi ve skutečnosti nejsou. Zde jsou čtyři spolehlivá kritéria, podle nichž pravé virgin hair poznáte.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-ivory rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <h3 className="font-semibold text-gray-900">Původ a certifikát</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pravé panenské vlasy přicházejí s certifikátem původu — konkrétní zemí, regionem nebo dokumentací odběru. Pokud dodavatel původ vlasů nedokáže prokázat, jde o varovný signál. Múza Hair garantuje certifikovaný evropský původ.
                </p>
              </div>
              <div className="bg-ivory rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <h3 className="font-semibold text-gray-900">Přirozená, ne uniformní barva</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pravé panenské vlasy mají mírné přirozené barevné odchylky — vlasy od kořínku ke špičce nejsou dokonale uniformní. Příliš dokonalá, plasticky stejnoměrná barva naznačuje chemické ošetření nebo barvení.
                </p>
              </div>
              <div className="bg-ivory rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <h3 className="font-semibold text-gray-900">Hebkost bez silikonového pocitu</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Panenské vlasy jsou hebké přirozeně — ne klouzavým, umělým dojmem. Silikonem potažené vlasy se po prvním umytí stanou hrubšími a nastartuje jejich degradace. Panenské vlasy si hebkost zachovají po celou dobu životnosti.
                </p>
              </div>
              <div className="bg-ivory rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <h3 className="font-semibold text-gray-900">Reakce na barvení</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Pravé panenské vlasy přijmou barvu rovnoměrně a přirozeně — podobně jako vaše vlastní neošetřené vlasy. Vlasy, které prošly chemickým ošetřením, barvu přijímají nerovnoměrně nebo neprediktabilně, zejména při zesvětlování.
                </p>
              </div>
            </div>
          </section>

          {/* Virgin hair vs remy comparison */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-4">
              Panenské vlasy vs. remy vlasy — jaký je skutečný rozdíl?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl leading-relaxed">
              Termíny "remy" a "panenské" se v komunikaci dodavatelů vlasů často zaměňují. Pojďme si je přesně vysvětlit.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">Remy vlasy</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-green-600 font-bold mt-0.5">✓</span> Kutikuly orientovány jedním směrem</li>
                  <li className="flex gap-2"><span className="text-green-600 font-bold mt-0.5">✓</span> Minimální zamotávání</li>
                  <li className="flex gap-2"><span className="text-yellow-500 font-bold mt-0.5">~</span> Mohou, ale nemusí být chemicky ošetřeny</li>
                  <li className="flex gap-2"><span className="text-yellow-500 font-bold mt-0.5">~</span> Mohou pocházet od více dárců</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold mt-0.5">✗</span> Nejsou zárukou nepoškozenosti vlasu</li>
                  <li className="flex gap-2"><span className="text-gray-400 font-bold mt-0.5">→</span> Trvanlivost 3–6 měsíců (standard)</li>
                </ul>
              </div>
              <div className="bg-ivory border-2 border-burgundy/20 rounded-xl p-6">
                <h3 className="font-semibold text-burgundy mb-4 text-lg">Panenské vlasy (virgin hair)</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-green-600 font-bold mt-0.5">✓</span> Kutikuly zachovány ve správném směru</li>
                  <li className="flex gap-2"><span className="text-green-600 font-bold mt-0.5">✓</span> Vždy od jednoho dárce</li>
                  <li className="flex gap-2"><span className="text-green-600 font-bold mt-0.5">✓</span> Nikdy chemicky neošetřeny</li>
                  <li className="flex gap-2"><span className="text-green-600 font-bold mt-0.5">✓</span> Přirozený, trvalý lesk</li>
                  <li className="flex gap-2"><span className="text-green-600 font-bold mt-0.5">✓</span> Lze opakovaně barvit a zesvětlovat</li>
                  <li className="flex gap-2"><span className="text-burgundy font-bold mt-0.5">→</span> Trvanlivost 12–24 měsíců</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500 italic">
              Panenské vlasy jsou vždy remy, ale ne každý remy vlas je panenský. Při výběru preferujte označení "virgin" nebo "panenské" nad pouhým "remy".
            </p>
          </section>

          {/* Slavic virgin hair */}
          <section className="mb-14 bg-ivory rounded-2xl p-8">
            <h2 className="text-3xl font-playfair text-burgundy mb-4">
              Slovanské panenské vlasy Praha — Platinum edition
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl leading-relaxed">
              Slovanské panenské vlasy jsou absolutní špičkou sortimentu vlasů na prodloužení. Pocházejí z Ukrajiny, Polska a Rumunska — regionů s přirozeně světlými a jemnými vlasy, které jsou díky svému genetickému základu nejbližší evropskému standardu.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Proč jsou slovanské vlasy výjimečné?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-burgundy">✓</span> Přirozeně světlejší odstín — minimální potřeba zesvětlení</li>
                  <li className="flex gap-2"><span className="text-burgundy">✓</span> Jemnější a tenčí struktura vlákna — splývavost</li>
                  <li className="flex gap-2"><span className="text-burgundy">✓</span> Nejvyšší genetická podobnost s vlasy středoevropských žen</li>
                  <li className="flex gap-2"><span className="text-burgundy">✓</span> Přirozená hustota — vlasy nevypadají uměle</li>
                  <li className="flex gap-2"><span className="text-burgundy">✓</span> Trvanlivost 18–24 měsíců při správné péči</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pro koho jsou Platinum vlasy ideální?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2"><span className="text-burgundy">→</span> Blondýny a světlé brunetky hledající přirozené splývání</li>
                  <li className="flex gap-2"><span className="text-burgundy">→</span> Zákaznice plánující zesvětlení nebo ombré efekt</li>
                  <li className="flex gap-2"><span className="text-burgundy">→</span> Ženy s jemnými vlastními vlasy vyžadující subtilní vlákno</li>
                  <li className="flex gap-2"><span className="text-burgundy">→</span> Ty, kdo hledají dlouhodobé řešení s minimální údržbou</li>
                  <li className="flex gap-2"><span className="text-burgundy">→</span> Zákaznice preferující absolutně nejvyšší dostupnou kvalitu</li>
                </ul>
              </div>
            </div>
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
              className="inline-block px-6 py-3 bg-burgundy text-white rounded-lg font-medium hover:bg-burgundy/90 transition-colors"
            >
              Zobrazit Platinum kolekci →
            </Link>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="text-3xl font-playfair text-burgundy mb-6">
              Časté otázky o panenských vlasech
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Co jsou panenské vlasy na prodloužení?',
                  a: 'Panenské vlasy (virgin hair) jsou 100% přírodní vlasy, které nikdy nebyly chemicky ošetřeny — nebyly barveny, odbarvovány ani trvaleny. Jsou odebírány od jednoho dárce, díky čemuž mají jednotnou strukturu a zachovanou přirozenou kutikulu orientovanou ve správném směru. Výsledkem je přirozený lesk, hebkost a trvanlivost 12–24 měsíců.',
                },
                {
                  q: 'Jaký je rozdíl mezi panenským vlasem a remy vlasem?',
                  a: 'Remy vlasy mají kutikuly orientovány jedním směrem, ale mohou být chemicky ošetřeny. Panenské vlasy jsou přísněji definovány — musí být chemicky zcela neošetřeny. Panenské vlasy jsou vždy remy, ale ne každý remy vlas je panenský. Proto vydrží déle a lépe reagují na opětovné barvení.',
                },
                {
                  q: 'Lze panenské vlasy na prodloužení barvit a zesvětlovat?',
                  a: 'Ano — to je jedna z hlavních výhod panenských vlasů. Protože nebyly předtím chemicky ošetřeny, reagují na barvení a zesvětlování přirozeně, stejně jako vaše vlastní vlasy. Lze je barvit, melírovat i tónovat. Doporučujeme barvení svěřit zkušené kadeřnici a používat vlasové barvy bez amoniaku pro zachování kvality.',
                },
                {
                  q: 'Kde mohu koupit panenské vlasy v Praze?',
                  a: 'Múza Hair prodává panenské vlasy ve svém pražském showroomu, kde si sady můžete osobně prohlédnout a porovnat odstíny. Dostupné jsou také v online e-shopu s dodáním po celé ČR do 48 hodin. Nabízíme varianty LUXE (panenské evropské) a Platinum (slovanské panenské z Ukrajiny, Polska a Rumunska).',
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
          <section className="mb-14">
            <h2 className="text-2xl font-playfair text-burgundy mb-5">
              Prozkoumejte naši kolekci panenských vlasů
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-burgundy hover:shadow-sm transition-all group"
              >
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-burgundy transition-colors">Neošetřené panenské vlasy</p>
                  <p className="text-sm text-gray-500">Celá kolekce — remy i panenské</p>
                </div>
                <span className="text-burgundy text-lg">→</span>
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
                className="flex items-center justify-between bg-ivory border border-burgundy/20 rounded-xl px-5 py-4 hover:border-burgundy hover:shadow-sm transition-all group"
              >
                <div>
                  <p className="font-semibold text-burgundy">Panenské vlasy LUXE</p>
                  <p className="text-sm text-gray-500">Evropské, chemicky neošetřené — od 6 900 Kč</p>
                </div>
                <span className="text-burgundy text-lg">→</span>
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-gray-600 hover:shadow-sm transition-all group"
              >
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-gray-600 transition-colors">Platinum — slovanské panenské vlasy</p>
                  <p className="text-sm text-gray-500">Nejvyšší kvalita — od 10 900 Kč</p>
                </div>
                <span className="text-gray-600 text-lg">→</span>
              </Link>
              <Link
                href="/kontakt"
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-burgundy hover:shadow-sm transition-all group"
              >
                <div>
                  <p className="font-semibold text-gray-800 group-hover:text-burgundy transition-colors">Kontakt a konzultace</p>
                  <p className="text-sm text-gray-500">Showroom Praha — konzultace zdarma</p>
                </div>
                <span className="text-burgundy text-lg">→</span>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-burgundy text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-playfair mb-3">
              Pořiďte si panenské vlasy v Praze
            </h2>
            <p className="text-white/80 mb-2 max-w-lg mx-auto">
              Múza Hair — prémiové vlasové prodloužení od roku 2016. Showroom Praha, online objednávky, poradenství zdarma.
            </p>
            <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
              Chemicky neošetřené panenské vlasy LUXE a Platinum — s certifikátem původu a garancí kvality.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/luxe"
                className="px-6 py-3 bg-white text-burgundy rounded-lg font-medium hover:bg-ivory transition-colors"
              >
                LUXE panenské vlasy
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske/platinum-edition"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Platinum slovanské vlasy
              </Link>
              <Link
                href="/kontakt"
                className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium hover:bg-white/20 transition-colors"
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
