import Link from 'next/link';
import { Metadata } from 'next';
import WeftInfoBanner from '@/components/WeftInfoBanner';

export const metadata: Metadata = {
  title: 'Vlasové tresy (Weft) Praha | Ručně šité | Múza Hair',
  description:
    'Ručně šité vlasové tresy (hand-tied weft) z pravých vlasů — Standard, Luxe, Platinum, Baby Shades. Hollywood weft pro maximální objem. Výroba na zakázku 14 dní. Showroom Praha.',
  alternates: {
    canonical: 'https://muzahair.cz/pricesky-a-paruky/vlasove-tresy',
  },
  openGraph: {
    title: 'Vlasové tresy (Weft) Praha | Ručně šité | Múza Hair',
    description:
      'Ručně šité vlasové tresy z pravých vlasů — Standard, Luxe, Platinum, Baby Shades. Hollywood weft pro maximální objem. Výroba na zakázku 14 dní.',
    url: 'https://muzahair.cz/pricesky-a-paruky/vlasove-tresy',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Co jsou vlasové tresy (weft) a jak se liší od jiných metod prodloužení?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vlasové tresy (weft) jsou vlasy přišité na tenkou tkanou základnu — tzv. trám. Výsledkem je plynulý pás vlasů, který se připevňuje metodou sewing-in (přišití na copánkový základ), clip-in sponkami nebo speciálním lepidlem. Oproti pramenovým metodám (keratin, nano) poskytují tresy rovnoměrnější pokrytí hlavy a přirozený přechod. Hollywood weft je ručně vázaná varianta s nejtenčím možným tramem — leží na hlavě ploše a je zcela neviditelný.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaký je rozdíl mezi ručně šitými a strojově šitými tresy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ručně šité tresy (hand-tied weft) jsou vázány ručně — tram je extrémně tenký (0,5–1 mm), flexibilní a přilne k hlavě bez hrubých přechodů. Lze je stříhat bez rizika rozpadnutí. Strojově šité tresy mají silnější tram a jsou vhodné pro sewing-in nebo clip-in, ale méně se hodí pro velmi jemné vlasy. V Múza Hair Praha nabízíme výhradně ručně šité vlasové tresy nejvyšší kvality.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaký je rozdíl mezi kolekcemi Standard, Luxe a Platinum weft?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard jsou východoevropské vlasy z Indie, Kambodže a Uzbekistánu — pevnější struktura, skvělý poměr cena/výkon. Luxe jsou evropské vlasy z Ukrajiny a Polska — jemnější, nadýchaný objem, husté konce. Platinum jsou nejprémiovější culíky výhradně z výkupu v ČR a SR — mimořádná hebkost, přirozený lesk a hustota. Baby Shades jsou vzácné světlé vlasy v odstínech 7–10 pro blondýny a melíry.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kolik gramů weft potřebuji pro plné prodloužení?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Jedno balení vlasových tresů Múza Hair obsahuje 100 g vlasů. Pro plné prodloužení středně hustých vlasů počítejte s 1–2 balením (100–200 g). Jemné vlasy obvykle vystačí se 100 g, husté vlasy vyžadují 200–300 g. Záleží také na požadovaném objemu a délce — delší tresy jsou těžší a hustší. Přesné doporučení získáte na bezplatné konzultaci v našem pražském showroomu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak dlouho trvá výroba vlasových tresů na zakázku?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Výroba ručně šitých vlasových tresů na zakázku trvá 14 pracovních dní od potvrzení objednávky a přijetí zálohy. Tresy vyrábíme ze zásoby vlasů z naší kolekce nebo z vašeho vlastního culíku. Při výrobě z vlastního culíku závisí výsledná gramáž na délce a hustotě dodaného materiálu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Mohu si nechat vyrobit vlasové tresy z vlastního copu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ano — výroba tresů z vlastního culíku je u nás velmi oblíbená služba. Přinesete nebo zašlete svůj culík pravých vlasů, my ho ručně zašijeme do tresů přesně podle vašich požadavků. Výsledné tresy mají barvu, strukturu a délku přesně odpovídající vašim vlastním vlasům. Výroba trvá 14 dní.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jak se starám o ručně šité vlasové tresy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vlasové tresy vyžadují stejnou péči jako přírodní vlasy. Doporučujeme sulfátprosté šampony a kondicionéry pro prodloužené vlasy, pravidelné hydratační masky, rozčesávání od konečků ke kořínkům měkkým kartáčem. Před spaním tresy splétejte nebo stáčejte do volného drdolu. Vyhýbejte se nadměrnému tepelnému stylingu bez ochranného přípravku.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jaké délky vlasových tresů jsou dostupné?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vlasové tresy Múza Hair jsou dostupné v délkách 45–80 cm. Délka se měří od vrcholu tramu k nejdelšímu vlasu. Pro přirozený výsledek doporučujeme vybrat délku o 5–10 cm kratší než požadovaná výsledná délka — vlasy se po aplikaci "usadí". Přesnou délku doporučíme na konzultaci podle délky a hustoty vašich vlastních vlasů.',
      },
    },
  ],
};

const KOLEKCE = [
  {
    nazev: 'Standard',
    tag: 'Nejlepší poměr cena / výkon',
    popis:
      'Východoevropské panenské vlasy z Indie, Kambodže a Uzbekistánu. Pevnější struktura, přirozený lesk, drží tvar. Každý culík pochází z jedné hlavy — originální barva, nikdy nemíchané.',
    pro: 'Ženy s hustšími vlasy, které hledají spolehlivou kvalitu za rozumnou cenu.',
    odstiny: 'Nebarvené 1–4, barvené 5–10',
    barva: 'bg-stone-50 border-stone-200',
    badge: 'bg-stone-200 text-stone-800',
  },
  {
    nazev: 'LUXE',
    tag: 'Evropská kvalita',
    popis:
      'Evropské vlasy z Ukrajiny a Polska. Jemnější struktura, nadýchaný objem a husté konce. Zlatá střední cesta mezi cenou a prémiovostí — ideální pro klientky kadeřnických salónů.',
    pro: 'Ženy s jemnými až středně hustými vlasy, které chtějí maximální přirozenost.',
    odstiny: 'Nebarvené 1–4, barvené 5–10',
    barva: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-200 text-amber-900',
  },
  {
    nazev: 'Platinum Edition',
    tag: 'Nejvzácnější culíky',
    popis:
      'Nejprémiovější vlasy výhradně z výkupu v ČR a SR. Mimořádná hebkost, přirozený lesk a hustota po celé délce. Každý culík pečlivě tříděn ručně — žádné příměsi.',
    pro: 'Náročné zákaznice s velmi jemnými vlasy, které netolerují kompromis.',
    odstiny: 'Nebarvené 1–4, nebarvené 5–7, barvené 5–10',
    barva: 'bg-purple-50 border-purple-200',
    badge: 'bg-purple-200 text-purple-900',
  },
  {
    nazev: '✨ Baby Shades',
    tag: 'Exkluzivně pro blondýny',
    popis:
      'Vzácné přirozeně světlé vlasy v odstínech 7–10. Ideální pro blondýny, melíry a balayage — bez nutnosti odbarvování, vlákno je chemicky nedotčené.',
    pro: 'Světlovlasé ženy hledající přirozeně světlé tresy bez poškození odbarvováním.',
    odstiny: 'Nebarvené 7–10',
    barva: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-200 text-yellow-900',
  },
];

const GRAMAZE = [
  { delka: 45, gramaz: 100 },
  { delka: 50, gramaz: 100 },
  { delka: 55, gramaz: 100 },
  { delka: 60, gramaz: 100 },
  { delka: 65, gramaz: 100 },
  { delka: 70, gramaz: 100 },
  { delka: 75, gramaz: 100 },
  { delka: 80, gramaz: 100 },
];

const faqs = jsonLd.mainEntity.map((item) => ({
  q: item.name,
  a: item.acceptedAnswer.text,
}));

export default function VlasoveTresyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <WeftInfoBanner />
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex gap-2 flex-wrap">
          <Link href="/" className="hover:text-burgundy">Domů</Link>
          <span>/</span>
          <Link href="/pricesky-a-paruky" className="hover:text-burgundy">Příčesky a paruky</Link>
          <span>/</span>
          <span className="text-gray-800">Vlasové tresy</span>
        </nav>

        {/* H1 */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Vlasové tresy (Weft)
        </h1>
        <p className="text-xl text-gray-500 mb-8">
          Ručně šité — Praha · 4 kolekce · 45–80 cm · výroba z vlastního culíku
        </p>

        {/* TL;DR */}
        <div className="bg-burgundy/5 border border-burgundy/20 rounded-2xl p-6 mb-12">
          <p className="text-sm font-semibold text-burgundy uppercase tracking-wide mb-3">TL;DR — rychlý přehled</p>
          <ul className="space-y-2 text-gray-700">
            <li>✂️ <strong>Ručně šité vlasové tresy</strong> (hand-tied weft) z pravých lidských vlasů</li>
            <li>📦 Balení: <strong>100 g</strong> / tram délky cca 60–70 cm · dostupné v délkách 45–80 cm</li>
            <li>🎨 4 kolekce: <strong>Standard, Luxe, Platinum, Baby Shades</strong> · nebarvené i barvené</li>
            <li>⏱️ Výroba na zakázku: <strong>14 pracovních dní</strong> · možnost výroby z vlastního culíku</li>
            <li>🏙️ <strong>Showroom Praha</strong> · konzultace zdarma · ceník na muzahair.cz</li>
          </ul>
        </div>

        {/* Co jsou weft tresy */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Co jsou vlasové tresy a jak fungují?</h2>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
            <p>
              <strong>Vlasové tresy</strong> (anglicky <em>weft</em>) jsou prameny pravých lidských vlasů přišité na tenkou tkanou základnu — tram. Vzniká tak plynulý pás vlasů, který lze připevnit několika metodami:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sewing-in (přišití)</strong> — tram se přišije na copánkový základ vytvořený z vlastních vlasů. Trvalé nošení 6–8 týdnů.</li>
              <li><strong>Clip-in sponky</strong> — sponky přišité na tram umožňují každodenní nasazování a sundávání bez kadeřníka.</li>
              <li><strong>Speciální lepidlo / páska</strong> — rychlá varianta pro přechodné nošení.</li>
            </ul>
            <p>
              <strong>Hollywood weft</strong> je speciální varianta s velmi tenkým tramem, ručně vázaným (hand-tied). Tram leží na hlavě zcela ploše, je neviditelný i při rozepnutých vlasech a lze ho stříhat bez rizika rozpadnutí. Právě tento typ nabízí Múza Hair Praha.
            </p>
          </div>
        </section>

        {/* Ručně vs strojově */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ručně šité vs. strojově šité tresy</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-900 mb-3">✋ Ručně šité (Hand-tied weft)</h3>
              <ul className="space-y-2 text-green-800 text-sm">
                <li>✅ Tram tloušťky 0,5–1 mm — zcela neviditelný</li>
                <li>✅ Lze stříhat — bez rizika rozpadnutí</li>
                <li>✅ Flexibilní, přilne k hlavě bez hrbolů</li>
                <li>✅ Vhodné i pro velmi jemné vlasy</li>
                <li>✅ Přirozenější pohyb vlasů</li>
              </ul>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-700 mb-3">🔧 Strojově šité (Machine weft)</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>⚠️ Silnější tram — viditelnější profil</li>
                <li>⚠️ Nelze stříhat (vlasy vypadnou)</li>
                <li>✅ Nižší cena</li>
                <li>✅ Odolnější tram</li>
                <li>⚠️ Méně přirozené na jemných vlasech</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-gray-600 text-sm">
            <strong>Múza Hair Praha nabízí výhradně ručně šité vlasové tresy</strong> — všechny kolekce (Standard, Luxe, Platinum, Baby Shades).
          </p>
        </section>

        {/* Kolekce */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">4 kolekce vlasových tresů</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {KOLEKCE.map((k) => (
              <div key={k.nazev} className={`border rounded-2xl p-6 ${k.barva}`}>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{k.nazev}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${k.badge}`}>{k.tag}</span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{k.popis}</p>
                <p className="text-xs text-gray-500 mb-1"><strong>Vhodné pro:</strong> {k.pro}</p>
                <p className="text-xs text-gray-500"><strong>Odstíny:</strong> {k.odstiny}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Gramáže tabulka */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Gramáže vlasových tresů</h2>
          <p className="text-gray-600 mb-6">
            Jedno balení vlasových tresů obsahuje <strong>100 g vlasů</strong>. Tram má délku přibližně 60–70 cm a lze ho dle potřeby stříhat.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Délka vlasů</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Gramáž / balení</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Doporučený počet balení</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {GRAMAZE.map((r) => (
                  <tr key={r.delka} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{r.delka} cm</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{r.gramaz} g</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {r.delka <= 55 ? '1 balení (jemné) / 1–2 balení (husté)' :
                       r.delka <= 70 ? '1–2 balení' : '2 balení'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2">* Uvedená cena je za 100 g. Přesné doporučení závisí na hustotě vlastních vlasů — doporučujeme konzultaci v showroomu.</p>
        </section>

        {/* Výroba z culíku */}
        <section className="mb-14 bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Výroba tresů z vlastního culíku</h2>
          <p className="text-gray-700 mb-4">
            Máte vlastní culík pravých vlasů? Ručně ho zpracujeme do vlasových tresů přesně na míru.
            Výsledné tresy budou mít barvu, strukturu a délku odpovídající vašim vlastním vlasům.
          </p>
          <ul className="space-y-2 text-gray-700 text-sm mb-4">
            <li>✂️ Culík přinesete osobně do showroomu nebo zašlete poštou</li>
            <li>⏱️ Výroba trvá <strong>14 pracovních dní</strong></li>
            <li>📏 Minimální délka culíku: 30 cm</li>
            <li>💰 Záloha 50 % před zahájením výroby</li>
          </ul>
          <Link
            href="/kontakt"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition"
          >
            Domluvit konzultaci →
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Časté otázky o vlasových tresech</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 list-none">
                  <span>{faq.q}</span>
                  <span className="ml-4 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Vyberte si vlasové tresy na míru</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Konzultace v showroomu Praha je zdarma a nezávazná. Pomůžeme vám vybrat správnou kolekci, délku a gramáž.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/vlasy-k-prodlouzeni"
              className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Prohlédnout kolekce
            </Link>
            <Link
              href="/kontakt"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              Rezervovat konzultaci
            </Link>
          </div>
        </section>

        {/* Interní prolinkování */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Další metody zakončení vlasů</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/metody-zakonceni/vlasove-pasky-tape-in" className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
              Vlasové pásky Tape-In
            </Link>
            <Link href="/metody-zakonceni/vlasy-na-keratin" className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
              Keratin prameny
            </Link>
            <Link href="/metody-zakonceni" className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">
              Všechny metody →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
