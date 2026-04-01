import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vlasové pásky Tape-In Praha | Múza Hair',
  description:
    'Prémiové vlasové pásky tape-in z pravých vlasů — Standard, Luxe, Platinum. Kudrnaté pásky jako unikát na CZ trhu. Výroba na zakázku za 14 dní. Showroom Praha.',
  openGraph: {
    title: 'Vlasové pásky Tape-In Praha | Múza Hair',
    description:
      'Prémiové vlasové pásky tape-in z pravých vlasů — Standard, Luxe, Platinum. Kudrnaté pásky jako unikát na CZ trhu. Výroba na zakázku za 14 dní. Showroom Praha.',
    url: 'https://muzahair.cz/metody-zakonceni/vlasove-pasky-tape-in',
  },
};

const faqs = [
  {
    q: 'Co jsou vlasové pásky tape-in a jak fungují?',
    a: 'Vlasové pásky tape-in jsou metoda prodloužení vlasů pomocí tenkých pramenů uchycených speciální lepicí páskou šířky 2,8 cm. Dva prameny se přiloží nad a pod přirozený vlas a spojí do tzv. sendvičového spoje. Aplikace je rychlá, šetrná ke kořínkům a pásky jsou neviditelné i při rozepnutých vlasech. Výsledek vypadá přirozeně a nevyžaduje tepelné zpracování.',
  },
  {
    q: 'Jaký je rozdíl mezi kolekcemi Standard, Luxe a Platinum?',
    a: 'Standard jsou východoevropské vlasy z Indie, Kambodže a Uzbekistánu — pevná, odolná struktura, skvělý poměr cena/výkon, ideální pro ženy s hustšími vlasy. Luxe jsou evropské vlasy z Ukrajiny a Polska — jemnější, nadýchaný objem, husté konce, zlatá střední cesta. Platinum jsou nejvzácnější culíky výhradně z výkupu v ČR a SR — mimořádná hebkost, lesk a hustota, určené pro nejnáročnější zákaznice s jemnými vlasy.',
  },
  {
    q: 'Jsou dostupné kudrnaté vlasové pásky tape-in?',
    a: 'Ano — kudrnaté vlasové pásky tape-in jsou jedním z našich unikátů. Zatímco většina dodavatelů nabízí pouze rovné nebo mírně vlnité pásky, v Múza Hair Praha máme k dispozici čtyři struktury: rovné, mírně vlnité, vlnité a kudrnaté. Kudrnaté pásky pro kudrnaté vlasy jsou v ČR dostupné jen ojediněle — u nás je najdete ve všech délkách a kolekcích.',
  },
  {
    q: 'Kolik gramů má jedno balení vlasových pásek Múza Hair?',
    a: 'Balení obsahuje 20 pásků (10 sendvičových spojů). Gramáž závisí na délce: 30 cm = 18 g, 40 cm = 22 g, 50 cm = 27 g, 60 cm = 31 g, 70 cm = 38 g, 80 cm = 44 g, 90 cm = 51 g, 95 cm = 54 g. Pro plné prodloužení středně hustých vlasů počítejte s 5–7 balením podle délky a požadovaného objemu.',
  },
  {
    q: 'Jak dlouho vydrží vlasové pásky tape-in?',
    a: 'Pásky tape-in vydrží obvykle 6–10 týdnů, poté je nutné je přelepit (repositioning). Samotné vlasy lze při správné péči používat opakovaně — kvalitní pásky z kolekcí Luxe a Platinum vydrží 3–5 přelepení. Životnost závisí na péči: doporučujeme sulfátprosté šampony, vyhýbat se olejům u kořínků a spát se zapletením.',
  },
  {
    q: 'Mohu si nechat vyrobit pásky ze svého vlastního copu?',
    a: 'Ano, tato služba je u nás velmi oblíbená. Pokud máte vlastní culík pravých vlasů, zpracujeme ho do vlasových pásek tape-in přesně na míru — délka, gramáž a struktura odpovídají vašemu vlastnímu materiálu. Výroba trvá 14 dní od převzetí culíku. Termín a podmínky dohodněte přes showroom Praha nebo kontaktní formulář.',
  },
  {
    q: 'Jak se liší nebarvené a barvené vlasové pásky?',
    a: 'Nebarvené (panenské) pásky jsou chemicky nedotčené — zachovávají přirozenou strukturu vlasu, jsou ideální pro zesvětlování nebo tónování na míru. Barvené pásky jsou zpracované přímo v naší pražské barvírně pod dohledem pěti specialistů — každý culík odbarvován individuálně, výsledkem jsou hebké, lesklé pásky bez poškození vlákna. Obě kategorie nabízíme ve všech kolekcích.',
  },
  {
    q: 'Nabízíte aplikaci vlasových pásek v Praze?',
    a: 'Vlasové pásky tape-in přímo neaplikujeme — jsme výrobce a dodavatel vlasů. V našem pražském showroomu vám však pomůžeme vybrat správnou kolekci, délku, gramáž a strukturu. Doporučíme vám také osvědčené extension technicians v Praze, kteří s našimi pásky pracují. Konzultace v showroomu je zdarma a nezávazná.',
  },
];

const GRAMAZE = [
  { delka: 30, gramaz: 18 },
  { delka: 35, gramaz: 20 },
  { delka: 40, gramaz: 22 },
  { delka: 45, gramaz: 24 },
  { delka: 50, gramaz: 27 },
  { delka: 55, gramaz: 29 },
  { delka: 60, gramaz: 31 },
  { delka: 65, gramaz: 35 },
  { delka: 70, gramaz: 38 },
  { delka: 75, gramaz: 41 },
  { delka: 80, gramaz: 44 },
  { delka: 85, gramaz: 47 },
  { delka: 90, gramaz: 51 },
  { delka: 95, gramaz: 54 },
];

const BALENI = [
  { typ: 'Jemné / řídké vlasy', kratke: '3–4', stredni: '4–5', dlouhe: '5–6' },
  { typ: 'Středně husté vlasy', kratke: '4–5', stredni: '5–7', dlouhe: '6–8' },
  { typ: 'Husté vlasy', kratke: '5–6', stredni: '6–8', dlouhe: '8–10' },
];

const KOLEKCE = [
  {
    nazev: 'Standard Nebarvené',
    tag: 'Dobrý poměr cena / výkon',
    popis:
      'Východoevropské panenské vlasy z Indie, Kambodže a Uzbekistánu. Pevnější struktura, přirozený lesk, drží tvar. Každý culík pochází z jedné hlavy — originální barva, nikdy nemíchané. Ideální pro tónování i odbarvování.',
    pro: 'Ženy s hustšími vlasy, které hledají spolehlivou kvalitu za rozumnou cenu.',
    color: 'bg-stone-50 border-stone-200',
  },
  {
    nazev: 'Luxe Nebarvené',
    tag: 'Zlatá střední cesta',
    popis:
      'Luxusní evropské vlasy z Ukrajiny, Polska a Běloruska. Jemnější než Standard, ale pevnější než Platinum — ideální střed. Nadýchaný objem, husté konce, přirozené odstíny 1–4. Každý culík z jedné hlavy.',
    pro: 'Ženy se středně hustými vlasy, které chtějí objem bez těžkého pocitu a plánují barvit.',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    nazev: 'Platinum Edition Nebarvené',
    tag: 'Nejvzácnější culíky z ČR a SR',
    popis:
      'Panenské vlasy výhradně z přímého výkupu v České republice a Slovensku. Mimořádná hebkost, lesk a hustota konců. Nejjemnější textura — od extra jemných rovných po přirozenou strukturu. Každý culík prochází individuální kontrolou.',
    pro: 'Ženy s jemnými vlasy, které vyžadují maximální kvalitu a plánují zesvětlovat.',
    color: 'bg-purple-50 border-purple-200',
  },
  {
    nazev: 'Standard Barvené',
    tag: 'Dobrý poměr cena / výkon · barvené',
    popis:
      'Vlasy z Indie, Kambodže a Kazachstánu šetrně odbarvené a tónované v naší vlastní pražské barvírně. Ruční třídění a kontrola kvality. Pevnější struktura, přirozený lesk, skvěle drží tvar.',
    pro: 'Ženy s hustšími vlasy, které chtějí obměňovat look a držet rozumný rozpočet.',
    color: 'bg-stone-50 border-stone-200',
  },
  {
    nazev: 'Luxe Barvené',
    tag: 'Lehké, lesklé, luxusní',
    popis:
      'Evropské vlasy z Ukrajiny a Polska ručně zesvětlené tak, aby si zachovaly pružnost a hebkost. Střední jemnost, husté konce, přirozený objem. Barveny postupně pod dohledem specialistů v naší pražské barvírně.',
    pro: 'Ženy se středně hustými nebo jemnějšími vlasy, které chtějí lesklé blond nebo hnědé pásky.',
    color: 'bg-amber-50 border-amber-200',
  },
  {
    nazev: 'Platinum Edition Barvené',
    tag: 'Nejvyšší kvalita · ručně zpracované',
    popis:
      'Nejluxusnější odbarvované panenské vlasy z přímého výkupu v ČR. Každý culík zpracován individuálně pod dohledem odborníků v naší pražské barvírně — maximální lesk, hebkost a pružnost. Dlouhá životnost i po opakovaném přelepení.',
    pro: 'Ženy s jemnými až velmi jemnými vlasy, které hledají dokonalý blond vzhled s nejvyšší životností.',
    color: 'bg-purple-50 border-purple-200',
  },
];

export default function TapeInPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="py-12 bg-soft-cream min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-burgundy">Domů</Link>
            {' / '}
            <Link href="/metody-zakonceni" className="hover:text-burgundy">Metody zakončení</Link>
            {' / '}
            <span className="text-burgundy">Vlasové pásky Tape-In</span>
          </div>

          {/* H1 */}
          <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6 leading-tight">
            Vlasové pásky Tape-In Praha: pravé vlasy v 6 kolekcích, včetně kudrnatých
          </h1>

          {/* TL;DR blok */}
          <div className="bg-white border-l-4 border-burgundy rounded-xl p-6 mb-10 shadow-sm">
            <p className="text-sm font-semibold text-burgundy uppercase tracking-wide mb-2">Stručně</p>
            <p className="text-gray-800 leading-relaxed">
              Múza Hair Praha nabízí vlasové pásky tape-in z pravých slovanských vlasů — Standard, Luxe a Platinum, nebarvené i barvené v naší vlastní pražské barvírně. Pásky jsou dostupné v délkách 30–95 cm ve čtyřech strukturách: rovné, mírně vlnité, vlnité a <strong>kudrnaté</strong> — unikát na českém trhu. Výroba na zakázku trvá 14 dní, skladové varianty odesíláme ihned. Osobní výběr v showroomu Praha zdarma.
            </p>
          </div>

          <div className="space-y-12 text-gray-700">

            {/* Jak to funguje */}
            <section>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Jak fungují vlasové pásky tape-in?</h2>
              <p className="mb-4">
                Vlasové pásky tape-in jsou jednou z nejšetrnějších metod prodloužení vlasů. Princip je jednoduchý: dva tenké prameny opatřené speciální lepicí páskou šířky <strong>2,8 cm</strong> se přiloží nad a pod přirozený vlas zákaznice a spojí do tzv. <strong>sendvičového spoje</strong>. Pásky drží pevně, jsou neviditelné i při rozepnutých vlasech a nevyžadují žádné tepelné ani chemické zpracování při aplikaci.
              </p>
              <p className="mb-4">
                Jedno balení obsahuje <strong>20 pásků = 10 sendvičových spojů</strong>. Aplikace celé sady trvá zhruba 1–2 hodiny a pásky vydrží 6–10 týdnů, poté je nutné přelepení (repositioning). Při správné péči lze pásky používat opakovaně — kvalitní pásky z kolekcí Luxe a Platinum zvládnou 3–5 přelepení.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                {[
                  { icon: '🤝', title: 'Sendvičový spoj', text: '2 pásky + přirozený vlas = neviditelné spojení' },
                  { icon: '⚡', title: 'Rychlá aplikace', text: '1–2 hodiny, bez tepla ani chemie' },
                  { icon: '🔄', title: 'Opakované použití', text: '3–5 přelepení při správné péči' },
                ].map((i) => (
                  <div key={i.title} className="bg-white rounded-xl p-5 text-center shadow-sm">
                    <div className="text-3xl mb-2">{i.icon}</div>
                    <div className="font-semibold text-burgundy mb-1">{i.title}</div>
                    <div className="text-sm text-gray-600">{i.text}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Struktury — kudrnaté unikát */}
            <section>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Čtyři struktury — včetně kudrnatých jako unikát na CZ trhu</h2>
              <p className="mb-4">
                Všechny naše vlasové pásky tape-in jsou dostupné ve čtyřech strukturách. Zatímco rovné a mírně vlnité pásky nabízí většina dodavatelů, <strong>kudrnaté vlasové pásky tape-in jsou v České republice dostupné jen ojediněle</strong> — a u nás je najdete ve všech délkách i kolekcích.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { struktura: 'Rovné', popis: 'Klasická hladká textura, snadno splývá s přirozeně rovnými vlasy.' },
                  { struktura: 'Mírně vlnité', popis: 'Přirozený pohyb vlasů, ideální pro každodenní styling.' },
                  { struktura: 'Vlnité', popis: 'Výraznější vlna, bohatý objem, romantický look.' },
                  {
                    struktura: '✨ Kudrnaté',
                    popis: 'Jedinečná struktura dostupná u mála výrobců v ČR. Vlasové pásky pro kudrnaté vlasy — splývají přirozeně s vaší texturou bez nutnosti rovnání.',
                    highlight: true,
                  },
                ].map((s) => (
                  <div
                    key={s.struktura}
                    className={`rounded-xl p-5 border ${s.highlight ? 'bg-burgundy/5 border-burgundy' : 'bg-white border-gray-200'} shadow-sm`}
                  >
                    <div className={`font-semibold mb-1 ${s.highlight ? 'text-burgundy' : 'text-gray-900'}`}>{s.struktura}</div>
                    <div className="text-sm text-gray-700">{s.popis}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-600 italic">
                Kudrnaté tape-in vlasy hledáte dlouho bez úspěchu? Napište nám — pomůžeme vám vybrat správnou strukturu a kolekci.
              </p>
            </section>

            {/* Kolekce */}
            <section>
              <h2 className="text-3xl font-playfair text-burgundy mb-2">6 kolekcí vlasových pásek — nebarvené i barvené</h2>
              <p className="mb-6 text-gray-600">
                Zákaznice si nejprve vybere kolekci vlasů, poté zakončení — vlasové pásky tape-in. Každý culík pochází od jednoho dárce a je ručně tříděn naším týmem v Praze. Vlasy od různých dárkyň nikdy nemícháme.
              </p>
              <div className="space-y-4">
                {KOLEKCE.map((k) => (
                  <div key={k.nazev} className={`rounded-xl p-6 border ${k.color}`}>
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{k.nazev}</h3>
                      <span className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200 text-gray-600">{k.tag}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{k.popis}</p>
                    <p className="text-xs text-gray-500"><strong>Pro koho:</strong> {k.pro}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">Baby Shades kolekce — popis bude doplněn. Dostupná ve vybraných délkách a strukturách.</p>
            </section>

            {/* Gramáže */}
            <section>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Gramáže vlasových pásek dle délky</h2>
              <p className="mb-4">
                Každé balení obsahuje <strong>20 pásků (10 sendvičových spojů)</strong>. Níže najdete přesné gramáže pro délky 30–95 cm.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-burgundy text-white">
                      <th className="px-4 py-3 text-left font-semibold">Délka</th>
                      <th className="px-4 py-3 text-left font-semibold">Gramáž / balení (20 ks)</th>
                      <th className="px-4 py-3 text-left font-semibold">Sendvičových spojů</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GRAMAZE.map((r, i) => (
                      <tr key={r.delka} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium">{r.delka} cm</td>
                        <td className="px-4 py-3">{r.gramaz} g</td>
                        <td className="px-4 py-3 text-gray-500">10</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">Gramáže jsou přibližné. Přesná gramáž může mírně kolísat v závislosti na kolekci a struktuře vlasů.</p>
            </section>

            {/* Kolik balení */}
            <section>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Kolik balení potřebuji?</h2>
              <p className="mb-4">Počet balení závisí na hustotě vašich přirozených vlasů a požadované délce.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-burgundy text-white">
                      <th className="px-4 py-3 text-left font-semibold">Typ vlasů</th>
                      <th className="px-4 py-3 text-center font-semibold">Krátké (30–45 cm)</th>
                      <th className="px-4 py-3 text-center font-semibold">Střední (50–65 cm)</th>
                      <th className="px-4 py-3 text-center font-semibold">Dlouhé (70–95 cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BALENI.map((r, i) => (
                      <tr key={r.typ} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-medium">{r.typ}</td>
                        <td className="px-4 py-3 text-center">{r.kratke} bal.</td>
                        <td className="px-4 py-3 text-center">{r.stredni} bal.</td>
                        <td className="px-4 py-3 text-center">{r.dlouhe} bal.</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500 mt-2">Orientační hodnoty. Přesný počet doporučíme při osobní konzultaci v showroomu Praha.</p>
            </section>

            {/* Výroba na zakázku */}
            <section>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Výroba vlasových pásek ze zákazničina vlastního copu</h2>
              <p className="mb-4">
                Máte vlastní culík pravých vlasů a chcete ho proměnit ve vlasové pásky tape-in na míru? Tato služba je u nás velmi oblíbená. Váš culík zpracujeme do pásků přesně odpovídajících vaší délce, gramáži a textuře — výroba trvá <strong>14 dní</strong> od převzetí materiálu.
              </p>
              <p>
                Skladové varianty pásků v dostupných délkách a strukturách odesíláme <strong>ihned</strong>. Výroba pásků na zakázku (z culíku nebo ve specifické délce/barvě) trvá 14 pracovních dní.
              </p>
            </section>

            {/* Jak objednat */}
            <section>
              <h2 className="text-3xl font-playfair text-burgundy mb-4">Jak objednat vlasové pásky tape-in Praha</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: '🛍️',
                    title: 'Online e-shop',
                    text: 'Vyberte kolekci vlasů, zvolte zakončení Vlasové pásky, délku a strukturu. Skladové varianty ihned, zakázka 14 dní.',
                  },
                  {
                    icon: '🏡',
                    title: 'Showroom Praha',
                    text: 'Přijďte si vlasy osobně prohlédnout, osahat a vybrat přesný odstín a strukturu. Konzultace zdarma, termín předem.',
                  },
                  {
                    icon: '💼',
                    title: 'B2B — salony',
                    text: 'Spolupracujeme se salony a extension technicians po celé ČR. Velkoobchodní ceny, komisní prodej, osobní odběr v Praze.',
                  },
                ].map((o) => (
                  <div key={o.title} className="bg-white rounded-xl p-5 shadow-sm text-center">
                    <div className="text-3xl mb-3">{o.icon}</div>
                    <div className="font-semibold text-burgundy mb-2">{o.title}</div>
                    <div className="text-sm text-gray-600">{o.text}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-3xl font-playfair text-burgundy mb-6">Časté otázky — vlasové pásky tape-in</h2>
              <div className="space-y-5">
                {faqs.map((faq) => (
                  <div key={faq.q} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* CTA */}
          <div className="bg-burgundy text-white rounded-2xl p-8 mt-12 text-center">
            <h2 className="text-2xl font-playfair mb-3">Přijďte si vybrat vlasové pásky osobně</h2>
            <p className="mb-6 opacity-90 leading-relaxed">
              V pražském showroomu si pásky prohlédnete, osaháte a vyberete přesnou strukturu a odstín. Poradíme vám s kolekci, gramáží i počtem balení — konzultace je zdarma a nezávazná.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/kontakt"
                className="inline-block bg-white text-burgundy font-semibold px-6 py-3 rounded-full hover:bg-ivory transition-colors"
              >
                Sjednat konzultaci v showroomu
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni"
                className="inline-block border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Prohlédnout kolekce vlasů
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
