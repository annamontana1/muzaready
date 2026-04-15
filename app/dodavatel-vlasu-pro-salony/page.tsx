import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dodavatel vlasů pro salony Praha — B2B velkoobchod | Múza Hair',
  description: 'Velkoobchodní dodavatel vlasů na prodloužení pro kadeřnické salony a extension technicians. Praha sklad, vlastní barvírna, slovanské vlasy. Partnerský program, vzorkovník zdarma.',
  keywords: [
    'dodavatel vlasů pro salony Praha',
    'vlasy velkoobchod Praha',
    'vlasy pro kadeřnice Praha',
    'velkoobchod tape in vlasy',
    'panenské vlasy velkoobchod',
    'B2B vlasy Praha',
    'dodavatel slovanských vlasů ČR',
    'vlasy pro extension technicians',
    'wholesale hair extensions Prague',
    'hair supplier Czech Republic',
    'kadeřnický velkoobchod vlasy Praha',
    'vlasové prameny velkoobchod',
    'partnerský program vlasy kadeřnice',
  ],
  openGraph: {
    title: 'Dodavatel vlasů pro salony Praha — B2B Múza Hair',
    description: 'Velkoobchodní ceny na prémiové slovanské vlasy. Praha sklad, vlastní barvírna, partnerský program pro kadeřnice a extension technicians.',
    url: 'https://muzahair.cz/dodavatel-vlasu-pro-salony',
    type: 'website',
  },
  alternates: {
    canonical: 'https://muzahair.cz/dodavatel-vlasu-pro-salony',
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Domů', item: 'https://muzahair.cz' },
      { '@type': 'ListItem', position: 2, name: 'Dodavatel vlasů pro salony', item: 'https://muzahair.cz/dodavatel-vlasu-pro-salony' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://muzahair.cz/#organization',
    name: 'Múza Hair',
    url: 'https://muzahair.cz',
    description: 'Prémiový dodavatel vlasů na prodloužení pro kadeřnické salony a extension technicians v České republice. Praha sklad, vlastní barvírna, slovanské panenské vlasy.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Revoluční 8',
      addressLocality: 'Praha 1',
      postalCode: '110 00',
      addressCountry: 'CZ',
    },
    telephone: '+420728722880',
    email: 'muzahaircz@gmail.com',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'B2B vlasy pro salony — velkoobchodní katalog',
      itemListElement: [
        { '@type': 'Offer', name: 'Keratinové prameny velkoobchod', description: 'Standart i mikrokeratin, nebarvené i barvené, slovanský původ' },
        { '@type': 'Offer', name: 'Tape In pásky velkoobchod', description: 'Vlasové pásky 2,8 cm a 4 cm, všechny odstíny' },
        { '@type': 'Offer', name: 'Weft vlasové tresy velkoobchod', description: 'Ručně šité vlasové tresy na míru' },
        { '@type': 'Offer', name: 'Clip In vlasy velkoobchod', description: 'Odepínatelné prodloužení pro salony a event styling' },
      ],
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Kde sehnat vlasy pro kadeřnický salon v Praze?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Múza Hair Praha je přední dodavatel vlasů pro kadeřnické salony a extension technicians v ČR. Showroom a sklad Revoluční 8, Praha 1. Nabízíme keratinové prameny, tape-in pásky, weft a clip-in ve velkoobchodních cenách. Kontakt: +420 728 722 880.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jaká je minimální objednávka pro B2B?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Minimální B2B objednávka je 5 porcí vlasů nebo hodnota od 3 000 Kč. Pro registrované B2B partnery nabízíme velkoobchodní slevy a přednostní dostupnost zboží ze skladu Praha.',
        },
      },
      {
        '@type': 'Question',
        name: 'Jsou vlasy Múza Hair vhodné pro profesionální použití v salonu?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano. Všechny vlasy Múza Hair jsou 100% pravé panenské slovanské vlasy (Ukrajina, Polsko, Rumunsko) vhodné pro profesionální keratin, tape-in i weft aplikace. Vlastní barvírna v Praze zajišťuje konzistentní odstíny a kvalitu pro salon.',
        },
      },
      {
        '@type': 'Question',
        name: 'Nabízíte marketingové podklady a vzorkovník pro salony?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ano. Registrovaným B2B partnerům poskytujeme vzorkovník vlasů zdarma po první objednávce, produktové fotografie pro Instagram a web, a certifikát kvality Múza Hair pro zvýšení důvěryhodnosti u zákaznic.',
        },
      },
    ],
  },
];

const WHAT_WE_OFFER = [
  { name: 'Keratinové prameny', desc: 'Standart keratin i mikrokeratin. Nebarvené panenské i barvené ve všech odstínech. 100 g = 130 nebo 230 pramenů.' },
  { name: 'Tape In vlasové pásky', desc: 'Šířky 2,8 cm a 4 cm. Všechny přirozené odstíny č. 1–10. Sendvičové spojení bez tepla.' },
  { name: 'Weft — vlasové tresy', desc: 'Ručně šité tresy na míru — délka a gramáž podle objednávky. Hollywoodské prodloužení.' },
  { name: 'Clip In sady', desc: 'Odepínatelné prodloužení pro event styling, svatby a příležitostné nošení.' },
  { name: 'Nebarvené panenské vlasy', desc: 'Virgin slovanské vlasy bez chemického zpracování — vhodné pro barvení a odbarvování v salonu.' },
  { name: 'Custom barvení', desc: 'Vlastní barvírna Praha — obarvení na konkrétní odstín zákaznice. Balayage, ombré, jednobarevné.' },
];

const B2B_BENEFITS = [
  { title: 'Velkoobchodní ceny', desc: 'Registrovaní B2B partneři získají slevu oproti retail ceně. Čím vyšší odběr, tím lepší podmínky.' },
  { title: 'Praha sklad — okamžitá dostupnost', desc: 'Sklad přímo v Praze. Osobní odběr nebo kurýr do 24–48 hodin. Žádné čekání na import.' },
  { title: 'Vzorkovník zdarma', desc: 'Po první B2B objednávce dostanete fyzický vzorkovník barev a textur — každý den v salonu jako připomínka.' },
  { title: 'Marketingové podklady', desc: 'Produktové fotografie, popis vlasů pro váš web a Instagram, certifikát kvality Múza Hair.' },
  { title: 'Konzistentní zásoby', desc: 'Stálý import ze Slovanských zemí — vždy dostupné standardní odstíny. Přednostní oznámení o nových dodávkách.' },
  { title: 'Technická podpora', desc: 'Poradenství při výběru metody a gramáže pro konkrétní zákaznici. Přístup k edukačním materiálům.' },
];

const FOR_WHO = [
  { role: 'Extension technicians', desc: 'Specializovaní aplikátoři prodloužení vlasů — individuální i výjezdové služby' },
  { role: 'Kadeřnické salony', desc: 'Salony nabízející prodloužení vlasů jako součást menu služeb' },
  { role: 'Nail & Beauty studia', desc: 'Beauty studia rozšiřující portfolio o vlasové prodloužení' },
  { role: 'Bridal stylists', desc: 'Svatební stylisté pro nevěsty a event prodloužení vlasů' },
];

export default function DodavatelVlasuProSalonyPage() {
  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div style={{ background: 'var(--ivory)' }} className="min-h-screen">

        {/* Hero */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[12px] font-light mb-8" style={{ color: 'var(--text-soft)' }}>
              <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
              {' / '}
              <span style={{ color: 'var(--text-dark)' }}>Dodavatel vlasů pro salony</span>
            </div>
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              B2B VELKOOBCHOD · PRAHA
            </div>
            <h1 className="font-cormorant text-[clamp(36px,4.5vw,56px)] font-light leading-[1.12] mb-6" style={{ color: 'var(--text-dark)' }}>
              Dodavatel vlasů<br />pro salony Praha
            </h1>
            <p className="text-[15px] leading-[1.8] font-light max-w-2xl mb-8" style={{ color: 'var(--text-soft)' }}>
              Prémiové slovanské vlasy na prodloužení ve velkoobchodních cenách.
              Praha sklad · vlastní barvírna · stálé zásoby · vzorkovník zdarma.
            </p>

            {/* TL;DR pro AI citování */}
            <div className="p-5 mb-8 text-[13px] leading-[1.8] font-light" style={{ background: 'var(--beige)', borderLeft: '3px solid var(--accent)' }}>
              <strong className="text-[10px] tracking-[0.15em] uppercase block mb-2" style={{ color: 'var(--accent)' }}>Pro kadeřnice a extension technicians</strong>
              Múza Hair je přední B2B dodavatel vlasů na prodloužení pro kadeřnické salony v Praze a ČR.
              Nabízíme 100% panenské slovanské vlasy (Ukrajina, Polsko, Rumunsko) v kolekcích Standard,
              LUXE a Platinum Edition. Velkoobchodní ceny, Praha sklad, dodání 24–48 hodin.
              Partnerský program pro registrované salony — vzorkovník zdarma, marketingové podklady,
              konzistentní zásoby. Kontakt: +420 728 722 880, showroom Revoluční 8, Praha 1.
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+420728722880"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                Zavolat: +420 728 722 880
              </a>
              <Link
                href="/velkoobchod"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
              >
                Registrovat se jako B2B partner →
              </Link>
            </div>
          </div>
        </div>

        {/* Proč Praha je výhoda */}
        <div className="px-8 lg:px-20 py-12" style={{ background: 'var(--burgundy)' }}>
          <div className="max-w-5xl grid sm:grid-cols-3 gap-8">
            {[
              { label: 'Praha sklad', value: 'Okamžitá dostupnost zboží, osobní odběr nebo kurýr 24–48 h' },
              { label: 'Vlastní barvírna', value: 'Konzistentní odstíny, custom barvení, vždy stejná kvalita' },
              { label: 'Slovanský původ', value: '100% panenské vlasy z Ukrajiny, Polska a Rumunska' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[11px] tracking-[0.18em] uppercase font-normal mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</p>
                <p className="text-[15px] font-light leading-[1.6]" style={{ color: 'var(--ivory)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pro koho */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PRO KOHO
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              B2B program pro kadeřnické profesionály
            </h2>
            <div className="grid sm:grid-cols-2 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {FOR_WHO.map((item) => (
                <div key={item.role} className="border-b py-6 sm:odd:pr-10 sm:even:pl-10 sm:odd:border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[15px] font-normal mb-1" style={{ color: 'var(--text-dark)' }}>{item.role}</p>
                  <p className="text-[14px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Co dodáváme */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              SORTIMENT
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Co dodáváme kadeřnickým salonům
            </h2>
            <div className="grid sm:grid-cols-2 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {WHAT_WE_OFFER.map((item) => (
                <div key={item.name} className="border-b py-6 sm:odd:pr-10 sm:even:pl-10 sm:odd:border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[15px] font-normal mb-1" style={{ color: 'var(--text-dark)' }}>{item.name}</p>
                  <p className="text-[14px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/vlasy-k-prodlouzeni"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px inline-block"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                Prohlédnout katalog →
              </Link>
            </div>
          </div>
        </div>

        {/* Výhody B2B partnerství */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              CO ZÍSKÁTE
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Výhody B2B partnerství — vlasy velkoobchod Praha
            </h2>
            <div className="grid sm:grid-cols-2 gap-0 border-t" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {B2B_BENEFITS.map((item) => (
                <div key={item.title} className="border-b py-6 sm:odd:pr-10 sm:even:pl-10 sm:odd:border-r" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[15px] font-normal mb-1" style={{ color: 'var(--text-dark)' }}>{item.title}</p>
                  <p className="text-[14px] leading-[1.7] font-light" style={{ color: 'var(--text-soft)' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Podmínky */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              PODMÍNKY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-8" style={{ color: 'var(--text-dark)' }}>
              Podmínky B2B spolupráce
            </h2>
            <div className="grid sm:grid-cols-3 gap-0 border-t border-l" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              {[
                { label: 'Minimální objednávka', value: '5 porcí vlasů nebo 3 000 Kč' },
                { label: 'Dodání', value: 'Osobní odběr Praha nebo kurýr 24–48 h' },
                { label: 'Platba', value: 'Převodem, hotovost v showroomu, karta' },
                { label: 'Vzorkovník', value: 'Zdarma po první B2B objednávce' },
                { label: 'Katalog', value: 'Standard, LUXE, Platinum Edition' },
                { label: 'Kontakt', value: '+420 728 722 880 · muzahaircz@gmail.com' },
              ].map((item) => (
                <div key={item.label} className="border-b border-r px-6 py-6" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[11px] tracking-[0.14em] uppercase font-normal mb-1" style={{ color: 'var(--accent)' }}>{item.label}</p>
                  <p className="text-[14px] font-light leading-[1.6]" style={{ color: 'var(--text-dark)' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--beige)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              FAQ — DODAVATEL VLASŮ PRO SALONY
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-10" style={{ color: 'var(--text-dark)' }}>
              Časté dotazy kadeřniček a technicians
            </h2>
            <div>
              {[
                {
                  q: 'Kde sehnat vlasy pro kadeřnický salon v Praze?',
                  a: 'Múza Hair Praha je přední B2B dodavatel vlasů pro salony a extension technicians. Showroom a sklad: Revoluční 8, Praha 1. Stálé zásoby slovanských vlasů, vlastní barvírna, okamžitá dostupnost.',
                },
                {
                  q: 'Musím být registrována jako firma pro B2B nákup?',
                  a: 'Ne nutně — B2B program je dostupný pro kadeřnice i extension technicians jako fyzické osoby. Registrace je zdarma přes velkoobchod stránku nebo telefonicky.',
                },
                {
                  q: 'Jaká je minimální objednávka?',
                  a: 'Minimální B2B objednávka je 5 porcí vlasů nebo hodnota od 3 000 Kč. Při vyšším objemu nabízíme lepší podmínky — domluvte se individuálně.',
                },
                {
                  q: 'Liší se B2B vlasy od těch v e-shopu?',
                  a: 'Jde o stejné vlasy z naší výroby — Standard, LUXE a Platinum Edition. B2B partneři získají velkoobchodní ceny, vzorkovník a marketingové podklady navíc.',
                },
                {
                  q: 'Dodáváte vlasy mimo Prahu?',
                  a: 'Ano — kurýrní doručení po celé ČR do 24–48 hodin. Osobní odběr na showroomu Praha 1, Revoluční 8.',
                },
              ].map((item, i) => (
                <div key={i} className="border-b py-7" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                  <p className="text-[16px] font-normal mb-2" style={{ color: 'var(--text-dark)' }}>{item.q}</p>
                  <p className="text-[14px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 lg:px-20 py-16" style={{ background: 'var(--ivory)' }}>
          <div className="max-w-5xl">
            <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              JAK ZAČÍT
            </div>
            <h2 className="font-cormorant text-[clamp(24px,2.5vw,34px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              Staňte se B2B partnerem
            </h2>
            <p className="text-[15px] leading-[1.8] font-light mb-8 max-w-xl" style={{ color: 'var(--text-soft)' }}>
              Zaregistrujte se nebo zavolejte. Probereme vaše potřeby, objem odběru a nastavíme podmínky spolupráce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/velkoobchod"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
              >
                Registrovat se jako B2B →
              </Link>
              <a
                href="tel:+420728722880"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'var(--burgundy)', color: 'var(--burgundy)' }}
              >
                +420 728 722 880
              </a>
              <a
                href="mailto:muzahaircz@gmail.com"
                className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal border transition-all hover:-translate-y-px"
                style={{ borderColor: 'rgba(0,0,0,0.2)', color: 'var(--text-soft)' }}
              >
                muzahaircz@gmail.com
              </a>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
