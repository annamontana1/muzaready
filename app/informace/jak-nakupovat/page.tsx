import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Jak nakupovat | Múza Hair Praha',
  description: 'Průvodce nákupem vlasů k prodloužení v 5 krocích. Výběr kvality, odstínu, délky, gramáže a zakončení. Doprava Zásilkovna a DPD, platba kartou nebo převodem.',
  alternates: { canonical: 'https://muzahair.cz/informace/jak-nakupovat' },
};

const steps = [
  {
    number: '1',
    title: 'Vyberte typ vlasů',
    description: 'Vyberte kvalitu a barvu podle svých potřeb.',
    details: [
      'Standard — pravé vlasy za dostupnou cenu, ideální pro začátečníky',
      'LUXE — prémiová kvalita, delší životnost, sytější barvy',
      'Platinum Edition — nejkvalitnější, pro náročné klientky',
      'Nebarvené panenské — pro maximální přirozenost a snadné dobarvení',
      'Barvené blond — barevné variace z vlastní barvírny Múza Hair',
    ],
  },
  {
    number: '2',
    title: 'Zvolte délku a odstín',
    description: 'Délka se měří od temene k zakončení pramínku.',
    details: [
      'Délky od 35 cm do 80 cm po 5 cm krocích (35 / 40 / 45 / 50 / 55 / 60 / 65 / 70 / 75 / 80 cm)',
      'Odstíny 1–10 (1 = černá, 10 = světlá blond)',
      'Nejste si jistá? Pošlete fotku na WhatsApp nebo navštivte showroom',
    ],
  },
  {
    number: '3',
    title: 'Nastavte gramáž',
    description: 'Gramáž lze nastavit po 10 g krocích. Orientační doporučení podle délky:',
    details: [
      '40–50 cm — zahušt. min. 80 g / prodloužení min. 120 g',
      '55–60 cm — zahušt. min. 90 g / prodloužení min. 140 g',
      '65–70 cm — zahušt. min. 100 g / prodloužení min. 150 g',
      '75–80 cm — zahušt. min. 120 g / prodloužení min. 200 g',
      'Přesnou gramáž nastavíte v konfigurátoru při výběru produktu',
    ],
  },
  {
    number: '4',
    title: 'Vyberte zakončení',
    description: 'Vyrábíme vlasy na všechny níže uvedené metody. Cena výroby se počítá podle gramáže a nakonfiguruje se přímo v košíku.',
    details: [
      'Bez zakončení — surové vlasy, vhodné pro clip-in nebo vlastní úpravu',
      'Mikrokeratin — klasické keratinové bondy, cena dle gramáže',
      'Standart keratin — standardní keratinové bondy, cena dle gramáže',
      'Pásky keratinu — tenké ploché pramínky, cena dle gramáže',
      'Weft (vlasové tresy) — šitý pás vlasů pro hollywoodské prodloužení, cena dle gramáže',
      'Tapes / Nano tapes — oboustranná lepicí páska, rychlá aplikace, cena dle gramáže',
    ],
    link: { href: '/metody-zakonceni', text: 'Přehled metod zakončení →' },
  },
  {
    number: '5',
    title: 'Dokončete objednávku',
    description: 'Zadejte doručovací údaje a zaplaťte.',
    details: [
      'Platba kartou online přes GoPay (Visa, Mastercard)',
      'Bankovní převod — objednávka expeduje po připsání platby',
      'Zásilkovna — výdejní místo dle výběru, 89 Kč',
      'DPD — doručení kurýrem na adresu, 68 Kč',
      'Osobní odběr — showroom Revoluční 8, Praha 1, zdarma',
    ],
  },
];

const tips = [
  {
    title: 'Nejste si jistá odstínem?',
    content: 'Navštivte náš showroom v Praze nebo nám pošlete fotku na WhatsApp — rádi poradíme.',
    href: '/kontakt',
    linkText: 'Kontaktujte nás',
  },
  {
    title: 'Kolik gramů potřebuji?',
    content: 'Záleží na délce: 40–50 cm → 80/120 g, 55–60 cm → 90/140 g, 65–70 cm → 100/150 g, 75–80 cm → 120/200 g (zahušt. / prodlouž.).',
    href: '/informace/faq',
    linkText: 'Více v FAQ',
  },
  {
    title: 'Jakou metodu zvolit?',
    content: 'Keratin je nejtrvanlivější (3–6 měsíců), tapes jsou nejšetrnější k vlastním vlasům, weft je nejrychlejší na aplikaci.',
    href: '/metody-zakonceni',
    linkText: 'Přehled metod',
  },
];

export default function JakNakupovatPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>

      {/* Breadcrumb + header intro */}
      <div className="px-8 lg:px-20 pt-12 pb-10" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-sm text-text-mid mb-8">
            <Link href="/" className="hover:text-burgundy">Domů</Link>
            {' / '}
            <Link href="/informace" className="hover:text-burgundy">Informace</Link>
            {' / '}
            <span className="text-burgundy">Jak nakupovat</span>
          </div>

          <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            PRŮVODCE NÁKUPEM
          </div>

          <h1 className="font-cormorant text-[clamp(36px,4vw,56px)] font-light leading-tight text-text-dark mb-4">
            Jak nakupovat
          </h1>
          <p className="text-text-mid leading-relaxed max-w-xl">
            Průvodce nákupem vlasů k prodloužení v 5 krocích — od výběru kvality až po doručení domů.
          </p>
        </div>
      </div>

      {/* WhatsApp banner — flat bar with green left border */}
      <div className="px-8 lg:px-20 pb-10" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-4xl mx-auto">
          <a
            href="https://wa.me/420728722880"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-5 hover:opacity-90 transition group"
            style={{ borderLeft: '3px solid #22c55e', background: '#f0fdf4' }}
          >
            <div className="flex-shrink-0 w-10 h-10 bg-green-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-dark group-hover:text-green-700 transition">Nejste si jistá? Napište nám na WhatsApp</p>
              <p className="text-xs text-text-soft">+420 728 722 880 — poradíme s výběrem délky, odstínu i gramáže</p>
            </div>
            <svg className="w-4 h-4 text-text-soft group-hover:text-green-500 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Steps — alternating backgrounds */}
      {steps.map((step, idx) => (
        <div
          key={step.number}
          className="px-8 lg:px-20 py-12"
          style={{ background: idx % 2 === 0 ? 'var(--beige)' : 'var(--ivory)' }}
        >
          <div className="max-w-4xl mx-auto grid lg:grid-cols-[120px_1fr] gap-8 items-start">
            <div>
              <span
                className="font-cormorant text-[clamp(48px,4vw,60px)] font-light leading-none"
                style={{ color: 'var(--accent)' }}
              >
                {step.number}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-dark mb-2">{step.title}</h2>
              <p className="text-sm text-text-soft mb-4">{step.description}</p>
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-mid">
                    <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>—</span>
                    {detail}
                  </li>
                ))}
              </ul>
              {'link' in step && step.link && (
                <Link
                  href={step.link.href}
                  className="inline-block mt-4 text-sm font-medium hover:opacity-70 transition"
                  style={{ color: 'var(--accent)' }}
                >
                  {step.link.text}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Warning — flat with left burgundy border */}
      <div className="px-8 lg:px-20 py-10" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-4xl mx-auto">
          <div
            className="p-6 text-sm"
            style={{ borderLeft: '3px solid var(--burgundy)', background: '#fdf8f8' }}
          >
            <p className="font-semibold text-text-dark mb-2">Důležité — vlasy zpracované na metodu nelze vrátit</p>
            <p className="leading-relaxed text-text-mid">
              Vlasy objednané <strong>s konkrétním zakončením</strong> (mikrokeratin, keratin, pásky, weft, tapes) jsou vyráběny na zakázku podle vašich parametrů.
              Na toto zboží se <strong>nevztahuje právo na odstoupení od smlouvy</strong> do 14 dní dle § 1837 písm. d) občanského zákoníku.
              Vrátit lze pouze vlasy <strong>bez zakončení</strong> v původním, neporušeném stavu.{' '}
              <Link href="/informace/obchodni-podminky" className="underline hover:opacity-75" style={{ color: 'var(--burgundy)' }}>
                Více v obchodních podmínkách
              </Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Tips — flat 3-column layout */}
      <div className="px-8 lg:px-20 py-12" style={{ background: 'var(--beige)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            UŽITEČNÉ RADY
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {tips.map((tip) => (
              <div key={tip.title}>
                <h3 className="font-semibold text-text-dark text-sm mb-2">{tip.title}</h3>
                <p className="text-text-soft text-sm mb-3 leading-relaxed">{tip.content}</p>
                <Link href={tip.href} className="text-sm font-medium hover:opacity-80 transition" style={{ color: 'var(--accent)' }}>
                  {tip.linkText} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA — flat full-width burgundy section */}
      <div className="px-8 lg:px-20 py-16 text-white text-center" style={{ background: 'var(--burgundy)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-4">Připraveni začít?</h2>
          <p className="text-white/80 text-sm mb-8">
            Prohlédněte si náš katalog a najděte své ideální vlasy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vlasy-k-prodlouzeni"
              className="px-8 py-3 bg-white text-sm font-medium transition hover:opacity-90"
              style={{ color: 'var(--burgundy)' }}
            >
              Procházet vlasy
            </Link>
            <Link
              href="/kontakt"
              className="px-8 py-3 border border-white/40 text-white text-sm font-medium transition hover:bg-white/10"
            >
              Potřebuji poradit
            </Link>
          </div>
        </div>
      </div>

      {/* Quick links — flat text links with — separator */}
      <div className="px-8 lg:px-20 py-10" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-text-soft uppercase tracking-[0.15em] mb-4">Může se vám také hodit</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-mid">
            {[
              { href: '/informace/platba-a-vraceni', label: 'Platba a vrácení' },
              { href: '/informace/faq', label: 'Časté dotazy' },
              { href: '/ceny-aplikaci', label: 'Ceny aplikace' },
              { href: '/informace/obchodni-podminky', label: 'Obchodní podmínky' },
              { href: '/sledovani-objednavky', label: 'Sledování objednávky' },
            ].map((l, i) => (
              <span key={l.href} className="flex items-center gap-4">
                {i > 0 && <span className="text-text-soft select-none">—</span>}
                <Link href={l.href} className="hover:text-burgundy transition">
                  {l.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
