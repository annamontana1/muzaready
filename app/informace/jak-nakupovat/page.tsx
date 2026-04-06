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
    <div className="py-12 bg-soft-cream min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-burgundy">Domů</Link>
          {' / '}
          <Link href="/informace" className="hover:text-burgundy">Informace</Link>
          {' / '}
          <span className="text-burgundy">Jak nakupovat</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-3">
            Jak nakupovat
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Průvodce nákupem vlasů k prodloužení v 5 krocích — od výběru kvality až po doručení domů.
          </p>
        </div>

        {/* WhatsApp banner */}
        <a
          href="https://wa.me/420728722880"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white border border-green-200 rounded-xl p-4 mb-10 hover:border-green-400 transition group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 transition">Nejste si jistá? Napište nám na WhatsApp</p>
            <p className="text-xs text-gray-500">+420 728 722 880 — poradíme s výběrem délky, odstínu i gramáže</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>

        {/* Steps */}
        <div className="space-y-6 mb-12">
          {steps.map((step) => (
            <div key={step.number} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-10 h-10 bg-burgundy text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h2>
                  <p className="text-sm text-gray-500 mb-3">{step.description}</p>
                  <ul className="space-y-1.5">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-burgundy mt-0.5 flex-shrink-0">—</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  {'link' in step && step.link && (
                    <Link href={step.link.href} className="inline-block mt-3 text-sm text-burgundy font-medium hover:opacity-70 transition">
                      {step.link.text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upozornění — zpracované vlasy nelze vrátit */}
        <div className="bg-white border border-amber-200 rounded-xl p-5 mb-10 text-sm text-amber-800">
          <p className="font-semibold text-gray-900 mb-1">Důležité — vlasy zpracované na metodu nelze vrátit</p>
          <p className="leading-relaxed">
            Vlasy objednané <strong>s konkrétním zakončením</strong> (mikrokeratin, keratin, pásky, weft, tapes) jsou vyráběny na zakázku podle vašich parametrů.
            Na toto zboží se <strong>nevztahuje právo na odstoupení od smlouvy</strong> do 14 dní dle § 1837 písm. d) občanského zákoníku.
            Vrátit lze pouze vlasy <strong>bez zakončení</strong> v původním, neporušeném stavu.{' '}
            <Link href="/informace/obchodni-podminky" className="underline hover:text-amber-900">
              Více v obchodních podmínkách
            </Link>.
          </p>
        </div>

        {/* Tips */}
        <div className="mb-12">
          <h2 className="font-playfair text-2xl text-burgundy mb-6">Užitečné rady</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {tips.map((tip) => (
              <div key={tip.title} className="bg-ivory border border-burgundy/10 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{tip.title}</h3>
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">{tip.content}</p>
                <Link href={tip.href} className="text-burgundy text-sm font-medium hover:opacity-80">
                  {tip.linkText} →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-burgundy rounded-xl p-8 text-white text-center mb-10">
          <h2 className="font-playfair text-2xl mb-3">Připraveni začít?</h2>
          <p className="text-white/80 text-sm mb-6">
            Prohlédněte si náš katalog a najděte své ideální vlasy
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/vlasy-k-prodlouzeni"
              className="px-6 py-2.5 bg-white text-burgundy rounded-lg text-sm font-medium hover:bg-ivory transition"
            >
              Procházet vlasy
            </Link>
            <Link
              href="/kontakt"
              className="px-6 py-2.5 border border-white/40 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition"
            >
              Potřebuji poradit
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-4">Může se vám také hodit</p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/informace/platba-a-vraceni', label: 'Platba a vrácení' },
              { href: '/informace/faq', label: 'Časté dotazy' },
              { href: '/ceny-aplikaci', label: 'Ceny aplikace' },
              { href: '/informace/obchodni-podminky', label: 'Obchodní podmínky' },
              { href: '/sledovani-objednavky', label: 'Sledování objednávky' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-burgundy hover:text-burgundy transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
