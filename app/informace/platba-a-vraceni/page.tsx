import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platba a vrácení | Múza Hair Praha',
  description: 'Způsoby platby, doprava a podmínky vrácení zboží. Zásilkovna 89 Kč, DPD 68 Kč, osobní odběr Praha zdarma.',
  alternates: { canonical: 'https://muzahair.cz/informace/platba-a-vraceni' },
};

const paymentMethods = [
  {
    name: 'Platba kartou online',
    desc: 'Visa, Mastercard, Maestro — přes zabezpečenou bránu GoPay. Okamžité zpracování platby.',
    badge: 'Doporučeno',
  },
  {
    name: 'Bankovní převod',
    desc: 'Platba převodem na náš bankovní účet. Objednávka se expeduje po připsání platby (1–2 pracovní dny).',
    badge: null,
  },
  {
    name: 'Hotovost v showroomu',
    desc: 'Platba v hotovosti při osobním odběru v showroomu Praha. Zdarma bez příplatků.',
    badge: null,
  },
];

const shippingMethods = [
  {
    name: 'Zásilkovna',
    price: '89 Kč',
    time: '2–3 pracovní dny',
    desc: 'Vyzvednutí na výdejním místě dle výběru. Více než 7 000 poboček v ČR.',
    available: true,
  },
  {
    name: 'DPD',
    price: '68 Kč',
    time: '1–2 pracovní dny',
    desc: 'Doručení kurýrem přímo na adresu v pracovní dny.',
    available: true,
  },
  {
    name: 'Balikovná',
    price: '—',
    time: '—',
    desc: 'Připravujeme. Balikovná bude brzy dostupná jako způsob doručení.',
    available: false,
  },
  {
    name: 'Osobní odběr — showroom Praha',
    price: 'Zdarma',
    time: 'Po domluvě',
    desc: 'Revoluční 8, Praha. Po–So 10:00–18:00. Termín domluvte předem.',
    available: true,
  },
];

export default function PlatbaAVraceniPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8 flex gap-2">
        <Link href="/" className="hover:text-gray-700 transition">Domů</Link>
        <span>/</span>
        <Link href="/informace" className="hover:text-gray-700 transition">Informace</Link>
        <span>/</span>
        <span className="text-gray-700">Platba a vrácení</span>
      </nav>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Platba a vrácení</h1>
      <p className="text-lg text-gray-500 mb-14">Způsoby platby, dopravní podmínky a postup při vrácení zboží.</p>

      {/* Způsoby platby */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Způsoby platby</h2>
        <div className="space-y-3">
          {paymentMethods.map((m) => (
            <div key={m.name} className="flex items-start justify-between gap-4 p-5 bg-white border border-gray-200 rounded-xl">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-gray-900">{m.name}</span>
                  {m.badge && (
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{m.badge}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-700 font-medium">Platba dobírkou není dostupná.</p>
          <p className="text-sm text-red-600 mt-1">Vlasy jsou prémiové zboží — z hygienických a bezpečnostních důvodů nezasíláme na dobírku.</p>
        </div>
      </section>

      {/* Doprava */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Doprava a doručení</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {shippingMethods.map((m) => (
            <div
              key={m.name}
              className={`p-5 border rounded-xl ${m.available ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${m.available ? 'text-gray-900' : 'text-gray-400'}`}>{m.name}</span>
                {!m.available && (
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Připravujeme</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">{m.desc}</p>
              {m.available && (
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Cena</span>
                    <span className="font-semibold text-gray-900">{m.price}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Doba doručení</span>
                    <span className="font-semibold text-gray-900">{m.time}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Vrácení zboží */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Vrácení zboží</h2>

        <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl mb-6">
          <p className="font-semibold text-amber-900 mb-2">Důležité — specifika vlasových produktů</p>
          <p className="text-sm text-amber-800 leading-relaxed">
            Vlasy lze vrátit pouze v <strong>nerozbaléném originálním balení</strong>. Rozbalené, použité, aplikované nebo chemicky upravené vlasy nelze z hygienických důvodů vrátit ani vyměnit. Toto opatření chrání všechny zákaznice před nákupem již použitého zboží.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Podmínky vrácení</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                Lhůta 14 dní od převzetí zboží
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                Nerozbalené v originálním obalu s etiketami
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                Peníze vrátíme do 14 dní od přijetí zboží
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                Poplatek 100 Kč/položka za opětovné naskladnění
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold mt-0.5">✗</span>
                <span className="text-gray-500">Zakázková výroba (pásky, weft, keratin)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold mt-0.5">✗</span>
                <span className="text-gray-500">Rozbalené nebo použité zboží</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 font-bold mt-0.5">✗</span>
                <span className="text-gray-500">Chemicky nebo mechanicky upravené vlasy</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Jak vrátit zboží</h3>
            <ol className="space-y-4 text-sm text-gray-700">
              {[
                { n: '1', text: 'Napište na muzahaircz@gmail.com — uveďte číslo objednávky a důvod vrácení.' },
                { n: '2', text: 'Vyplňte formulář pro odstoupení od smlouvy (ke stažení níže nebo zašleme e-mailem).' },
                { n: '3', text: 'Zboží zašlete doporučeně na adresu: Šrámkova 430/12, 638 00 Brno. Nezasílejte na dobírku — taková zásilka nebude převzata.' },
                { n: '4', text: 'Po obdržení zboží vrátíme peníze na bankovní účet do 14 dnů.' },
              ].map((s) => (
                <li key={s.n} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {s.n}
                  </span>
                  <span>{s.text}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5">
              <a
                href="mailto:muzahaircz@gmail.com?subject=Vrácení zboží"
                className="inline-block px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition"
              >
                Napsat o vrácení →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reklamace */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">Reklamace</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Záruční doba', value: '24 měsíců', note: 'na výrobní vady nepoužitého zboží' },
            { label: 'Vyřízení reklamace', value: 'do 30 dní', note: 'od uplatnění, obvykle rychleji' },
            { label: 'Kontakt', value: 'muzahaircz@gmail.com', note: 'foto + číslo objednávky' },
          ].map((i) => (
            <div key={i.label} className="p-5 bg-white border border-gray-200 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{i.label}</p>
              <p className="font-semibold text-gray-900 mb-1">{i.value}</p>
              <p className="text-xs text-gray-500">{i.note}</p>
            </div>
          ))}
        </div>

        <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 space-y-2">
          <p className="font-medium text-gray-800">Co není vadou zboží:</p>
          <ul className="space-y-1 text-gray-500">
            <li>— Přirozená odchylka v odstínu barvy oproti zobrazení na monitoru</li>
            <li>— Mírná přirozená vlnitost slovanských vlasů</li>
            <li>— Změna struktury vlivem nesprávné péče nebo chemické úpravy kupujícím</li>
            <li>— Opotřebení způsobené obvyklým používáním</li>
          </ul>
        </div>
      </section>

      {/* Související */}
      <div className="pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-4">Související stránky</p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/obchodni-podminky', label: 'Obchodní podmínky' },
            { href: '/reklamace', label: 'Reklamační řád' },
            { href: '/sledovani-objednavky', label: 'Sledování objednávky' },
            { href: '/kontakt', label: 'Kontakt' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-400 hover:text-gray-900 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

    </main>
  );
}
