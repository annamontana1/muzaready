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
  },
  {
    nazev: 'Luxe Nebarvené',
    tag: 'Zlatá střední cesta',
    popis:
      'Luxusní evropské vlasy z Ukrajiny, Polska a Běloruska. Jemnější než Standard, ale pevnější než Platinum — ideální střed. Nadýchaný objem, husté konce, přirozené odstíny 1–4. Každý culík z jedné hlavy.',
    pro: 'Ženy se středně hustými vlasy, které chtějí objem bez těžkého pocitu a plánují barvit.',
  },
  {
    nazev: 'Platinum Edition Nebarvené',
    tag: 'Nejvzácnější culíky z ČR a SR',
    popis:
      'Panenské vlasy výhradně z přímého výkupu v České republice a Slovensku. Mimořádná hebkost, lesk a hustota konců. Nejjemnější textura — od extra jemných rovných po přirozenou strukturu. Každý culík prochází individuální kontrolou.',
    pro: 'Ženy s jemnými vlasy, které vyžadují maximální kvalitu a plánují zesvětlovat.',
  },
  {
    nazev: 'Standard Barvené',
    tag: 'Dobrý poměr cena / výkon · barvené',
    popis:
      'Vlasy z Indie, Kambodže a Kazachstánu šetrně odbarvené a tónované v naší vlastní pražské barvírně. Ruční třídění a kontrola kvality. Pevnější struktura, přirozený lesk, skvěle drží tvar.',
    pro: 'Ženy s hustšími vlasy, které chtějí obměňovat look a držet rozumný rozpočet.',
  },
  {
    nazev: 'Luxe Barvené',
    tag: 'Lehké, lesklé, luxusní',
    popis:
      'Evropské vlasy z Ukrajiny a Polska ručně zesvětlené tak, aby si zachovaly pružnost a hebkost. Střední jemnost, husté konce, přirozený objem. Barveny postupně pod dohledem specialistů v naší pražské barvírně.',
    pro: 'Ženy se středně hustými nebo jemnějšími vlasy, které chtějí lesklé blond nebo hnědé pásky.',
  },
  {
    nazev: 'Platinum Edition Barvené',
    tag: 'Nejvyšší kvalita · ručně zpracované',
    popis:
      'Nejluxusnější odbarvované panenské vlasy z přímého výkupu v ČR. Každý culík zpracován individuálně pod dohledem odborníků v naší pražské barvírně — maximální lesk, hebkost a pružnost. Dlouhá životnost i po opakovaném přelepení.',
    pro: 'Ženy s jemnými až velmi jemnými vlasy, které hledají dokonalý blond vzhled s nejvyšší životností.',
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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kolik stojí tape-in (nanotapes) prodloužení vlasů Praha?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Aplikace nanotapes (tape-in) v Praze stojí 55–65 Kč za spoj. Průměrná aplikace 60–80 spojů = 3 300–5 200 Kč. Cena vlasových pásek se účtuje zvlášť.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jak dlouho vydrží nanotapes prodloužení?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nanotapes vydrží 1,5–2 měsíce do korekce. Výhoda je, že pásky lze znovu použít — ekonomičtější při pravidelných korekcích.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jsou nanotapes vhodné pro jemné vlasy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano — nanotapes/tape-in jsou sendvičová metoda bez tepla a lepidla, vhodná i pro jemnější vlastní vlasy. Doporučujeme konzultaci pro výběr správné gramáže.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero sekce */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm mb-8 flex gap-2" style={{ color: 'var(--text-soft)' }}>
            <Link href="/" className="hover:opacity-70 transition">Domů</Link>
            <span>/</span>
            <Link href="/metody-zakonceni" className="hover:opacity-70 transition">Metody zakončení</Link>
            <span>/</span>
            <span style={{ color: 'var(--burgundy)' }}>Vlasové pásky Tape-In</span>
          </nav>

          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Metody zakončení</span>
          </div>

          <h1 className="font-cormorant text-[clamp(28px,4vw,52px)] font-light leading-tight mb-6" style={{ color: 'var(--text-dark)' }}>
            Vlasové pásky Tape-In Praha: pravé vlasy v 6 kolekcích, včetně kudrnatých
          </h1>

          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }}>
            <p className="text-[11px] tracking-[0.2em] uppercase mb-3 font-normal" style={{ color: 'var(--accent)' }}>
              Stručně
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-dark)' }}>
              Múza Hair Praha nabízí vlasové pásky tape-in z pravých slovanských vlasů — Standard, Luxe a Platinum, nebarvené i barvené v naší vlastní pražské barvírně. Pásky jsou dostupné v délkách 30–95 cm ve čtyřech strukturách: rovné, mírně vlnité, vlnité a <strong>kudrnaté</strong> — unikát na českém trhu. Výroba na zakázku trvá 14 dní, skladové varianty odesíláme ihned. Osobní výběr v showroomu Praha zdarma.
            </p>
          </div>
        </div>
      </section>

      {/* Jak fungují */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Princip</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-6" style={{ color: 'var(--text-dark)' }}>
            Jak fungují vlasové pásky tape-in?
          </h2>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Vlasové pásky tape-in jsou jednou z nejšetrnějších metod prodloužení vlasů. Princip je jednoduchý: dva tenké prameny opatřené speciální lepicí páskou šířky <strong style={{ color: 'var(--text-dark)' }}>2,8 cm</strong> se přiloží nad a pod přirozený vlas zákaznice a spojí do tzv. <strong style={{ color: 'var(--text-dark)' }}>sendvičového spoje</strong>. Pásky drží pevně, jsou neviditelné i při rozepnutých vlasech a nevyžadují žádné tepelné ani chemické zpracování při aplikaci.
          </p>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Jedno balení obsahuje <strong style={{ color: 'var(--text-dark)' }}>20 pásků = 10 sendvičových spojů</strong>. Aplikace celé sady trvá zhruba 1–2 hodiny a pásky vydrží 6–10 týdnů, poté je nutné přelepení (repositioning). Při správné péči lze pásky používat opakovaně — kvalitní pásky z kolekcí Luxe a Platinum zvládnou 3–5 přelepení.
          </p>

          <div className="grid sm:grid-cols-3 gap-0 border-t" style={{ borderColor: 'var(--text-dark)', borderTopWidth: '1px' }}>
            {[
              { title: 'Sendvičový spoj', text: '2 pásky + přirozený vlas = neviditelné spojení' },
              { title: 'Rychlá aplikace', text: '1–2 hodiny, bez tepla ani chemie' },
              { title: 'Opakované použití', text: '3–5 přelepení při správné péči' },
            ].map((i, idx) => (
              <div key={i.title} className={`py-6 ${idx > 0 ? 'sm:pl-8 sm:border-l' : ''}`} style={{ borderColor: 'var(--text-soft)' }}>
                <div className="text-[11px] tracking-[0.2em] uppercase mb-2 font-normal" style={{ color: 'var(--accent)' }}>{i.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{i.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Struktury */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Textury</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-6" style={{ color: 'var(--text-dark)' }}>
            Čtyři struktury — včetně kudrnatých jako unikát na CZ trhu
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Všechny naše vlasové pásky tape-in jsou dostupné ve čtyřech strukturách. Zatímco rovné a mírně vlnité pásky nabízí většina dodavatelů, <strong style={{ color: 'var(--text-dark)' }}>kudrnaté vlasové pásky tape-in jsou v České republice dostupné jen ojediněle</strong> — a u nás je najdete ve všech délkách i kolekcích.
          </p>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              { struktura: 'Rovné', popis: 'Klasická hladká textura, snadno splývá s přirozeně rovnými vlasy.', highlight: false },
              { struktura: 'Mírně vlnité', popis: 'Přirozený pohyb vlasů, ideální pro každodenní styling.', highlight: false },
              { struktura: 'Vlnité', popis: 'Výraznější vlna, bohatý objem, romantický look.', highlight: false },
              {
                struktura: 'Kudrnaté',
                popis: 'Jedinečná struktura dostupná u mála výrobců v ČR. Vlasové pásky pro kudrnaté vlasy — splývají přirozeně s vaší texturou bez nutnosti rovnání.',
                highlight: true,
              },
            ].map((s) => (
              <div
                key={s.struktura}
                className="flex items-start justify-between gap-6 py-5 border-b"
                style={{ borderColor: 'var(--beige)' }}
              >
                <div className="flex-1">
                  <div
                    className="font-cormorant text-lg font-light mb-1"
                    style={{ color: s.highlight ? 'var(--burgundy)' : 'var(--text-dark)' }}
                  >
                    {s.struktura}
                    {s.highlight && <span className="ml-2 text-[11px] tracking-[0.15em] uppercase font-normal" style={{ color: 'var(--accent)' }}>Unikát</span>}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{s.popis}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm italic" style={{ color: 'var(--text-soft)' }}>
            Kudrnaté tape-in vlasy hledáte dlouho bez úspěchu? Napište nám — pomůžeme vám vybrat správnou strukturu a kolekci.
          </p>
        </div>
      </section>

      {/* Kolekce */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Kolekce</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-3" style={{ color: 'var(--text-dark)' }}>
            6 kolekcí vlasových pásek — nebarvené i barvené
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Zákaznice si nejprve vybere kolekci vlasů, poté zakončení — vlasové pásky tape-in. Každý culík pochází od jednoho dárce a je ručně tříděn naším týmem v Praze. Vlasy od různých dárkyň nikdy nemícháme.
          </p>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {KOLEKCE.map((k) => (
              <div key={k.nazev} className="py-6 border-b" style={{ borderColor: 'var(--ivory)' }}>
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <h3 className="font-cormorant text-xl font-light" style={{ color: 'var(--text-dark)' }}>{k.nazev}</h3>
                  <span className="text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--accent)' }}>{k.tag}</span>
                </div>
                <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-soft)' }}>{k.popis}</p>
                <p className="text-xs" style={{ color: 'var(--text-soft)' }}><strong style={{ color: 'var(--text-dark)' }}>Pro koho:</strong> {k.pro}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm italic" style={{ color: 'var(--text-soft)' }}>Baby Shades kolekce — popis bude doplněn. Dostupná ve vybraných délkách a strukturách.</p>
        </div>
      </section>

      {/* Gramáže */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Gramáže</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            Gramáže vlasových pásek dle délky
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Každé balení obsahuje <strong style={{ color: 'var(--text-dark)' }}>20 pásků (10 sendvičových spojů)</strong>. Níže najdete přesné gramáže pro délky 30–95 cm.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--text-dark)' }}>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Délka</th>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Gramáž / balení (20 ks)</th>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Sendvičových spojů</th>
                </tr>
              </thead>
              <tbody>
                {GRAMAZE.map((r) => (
                  <tr key={r.delka} className="border-b" style={{ borderColor: 'var(--beige)' }}>
                    <td className="py-3" style={{ color: 'var(--text-dark)' }}>{r.delka} cm</td>
                    <td className="py-3" style={{ color: 'var(--text-soft)' }}>{r.gramaz} g</td>
                    <td className="py-3" style={{ color: 'var(--text-soft)' }}>10</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-soft)' }}>Gramáže jsou přibližné. Přesná gramáž může mírně kolísat v závislosti na kolekci a struktuře vlasů.</p>
        </div>
      </section>

      {/* Kolik balení */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Kalkulace</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            Kolik balení potřebuji?
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-soft)' }}>Počet balení závisí na hustotě vašich přirozených vlasů a požadované délce.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--text-dark)' }}>
                  <th className="text-left py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Typ vlasů</th>
                  <th className="text-center py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Krátké (30–45 cm)</th>
                  <th className="text-center py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Střední (50–65 cm)</th>
                  <th className="text-center py-3 font-normal text-[11px] tracking-[0.15em] uppercase" style={{ color: 'var(--text-soft)' }}>Dlouhé (70–95 cm)</th>
                </tr>
              </thead>
              <tbody>
                {BALENI.map((r) => (
                  <tr key={r.typ} className="border-b" style={{ borderColor: 'var(--ivory)' }}>
                    <td className="py-3" style={{ color: 'var(--text-dark)' }}>{r.typ}</td>
                    <td className="py-3 text-center" style={{ color: 'var(--text-soft)' }}>{r.kratke} bal.</td>
                    <td className="py-3 text-center" style={{ color: 'var(--text-soft)' }}>{r.stredni} bal.</td>
                    <td className="py-3 text-center" style={{ color: 'var(--text-soft)' }}>{r.dlouhe} bal.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-soft)' }}>Orientační hodnoty. Přesný počet doporučíme při osobní konzultaci v showroomu Praha.</p>
        </div>
      </section>

      {/* Výroba na zakázku + Jak objednat */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Výroba na míru</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            Výroba vlasových pásek ze zákazničina vlastního copu
          </h2>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Máte vlastní culík pravých vlasů a chcete ho proměnit ve vlasové pásky tape-in na míru? Tato služba je u nás velmi oblíbená. Váš culík zpracujeme do pásků přesně odpovídajících vaší délce, gramáži a textuře — výroba trvá <strong style={{ color: 'var(--text-dark)' }}>14 dní</strong> od převzetí materiálu.
          </p>
          <p className="mb-10 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Skladové varianty pásků v dostupných délkách a strukturách odesíláme <strong style={{ color: 'var(--text-dark)' }}>ihned</strong>. Výroba pásků na zakázku (z culíku nebo ve specifické délce/barvě) trvá 14 pracovních dní.
          </p>

          <div className="flex items-center gap-3 mb-6" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Jak objednat</span>
          </div>

          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {[
              {
                title: 'Online e-shop',
                text: 'Vyberte kolekci vlasů, zvolte zakončení Vlasové pásky, délku a strukturu. Skladové varianty ihned, zakázka 14 dní.',
              },
              {
                title: 'Showroom Praha',
                text: 'Přijďte si vlasy osobně prohlédnout, osahat a vybrat přesný odstín a strukturu. Konzultace zdarma, termín předem.',
              },
              {
                title: 'B2B — salony',
                text: 'Spolupracujeme se salony a extension technicians po celé ČR. Velkoobchodní ceny, komisní prodej, osobní odběr v Praze.',
              },
            ].map((o) => (
              <div key={o.title} className="py-5 border-b" style={{ borderColor: 'var(--beige)' }}>
                <div className="font-cormorant text-lg font-light mb-1" style={{ color: 'var(--text-dark)' }}>{o.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{o.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: 'var(--beige)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Časté otázky</span>
          </div>
          <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
            Vlasové pásky tape-in — co se nejčastěji ptáte
          </h2>
          <div className="border-t" style={{ borderColor: 'var(--text-dark)' }}>
            {faqs.map((faq) => (
              <div key={faq.q} className="py-6 border-b" style={{ borderColor: 'var(--ivory)' }}>
                <h3 className="font-cormorant text-lg font-light mb-2" style={{ color: 'var(--text-dark)' }}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ceny aplikace + města */}
      <section style={{ background: 'var(--ivory)' }} className="px-8 lg:px-20 py-16">
        <div className="max-w-4xl mx-auto">
          <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.5rem' }} className="mb-10">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-4 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              Ceny aplikace
            </div>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-soft)' }}>
              Ceny přelepení a repositioningu vlasových pásek tape-in se liší podle salonu a množství pásků. Přehled orientačních sazeb najdete na stránce cen aplikací.
            </p>
            <Link
              href="/ceny-aplikaci"
              className="text-sm font-medium hover:opacity-75 transition"
              style={{ color: 'var(--accent)' }}
            >
              Přehled cen aplikace →
            </Link>
          </div>

          <div className="mb-8">
            <Link
              href="/ceny-aplikaci#nanotapes"
              className="inline-block px-6 py-3 text-sm font-medium rounded-sm transition hover:opacity-80"
              style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
            >
              Ceník aplikace nanotapes →
            </Link>
          </div>

          <p className="text-sm mb-4" style={{ color: 'var(--text-soft)' }}>Vlasové pásky nanotapes dodáváme do celé ČR:</p>
          <div className="flex flex-wrap gap-2">
            {['brno','ostrava','plzen','olomouc','hradec-kralove','pardubice','ceske-budejovice','liberec'].map((slug) => (
              <Link
                key={slug}
                href={`/vlasy/${slug}`}
                className="px-3 py-1.5 border text-xs transition capitalize hover:opacity-70"
                style={{ borderColor: 'var(--text-soft)', color: 'var(--text-soft)' }}
              >
                {slug.replace(/-/g,' ')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--burgundy)' }} className="px-8 lg:px-20 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span className="block w-8 h-px" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <span className="text-[11px] tracking-[0.2em] uppercase font-normal">Showroom Praha</span>
            <span className="block w-8 h-px" style={{ background: 'rgba(255,255,255,0.4)' }} />
          </div>
          <h2 className="font-cormorant text-[clamp(24px,3vw,40px)] font-light mb-4" style={{ color: 'var(--ivory)' }}>
            Přijďte si vybrat vlasové pásky osobně
          </h2>
          <p className="mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            V pražském showroomu si pásky prohlédnete, osaháte a vyberete přesnou strukturu a odstín. Poradíme vám s kolekci, gramáží i počtem balení — konzultace je zdarma a nezávazná.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/kontakt"
              className="inline-block px-6 py-3 text-sm font-medium rounded-sm transition hover:opacity-90"
              style={{ background: 'var(--ivory)', color: 'var(--burgundy)' }}
            >
              Sjednat konzultaci v showroomu
            </Link>
            <Link
              href="/vlasy-k-prodlouzeni"
              className="inline-block border px-6 py-3 text-sm font-medium rounded-sm transition hover:opacity-90"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'var(--ivory)' }}
            >
              Prohlédnout kolekce vlasů
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
