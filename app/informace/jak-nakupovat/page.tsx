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
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-3">
            Jak nakupovat
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Průvodce nákupem vlasů k prodloužení v 5 krocích — od výběru kvality až po doručení domů.
          </p>
        </div>

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
