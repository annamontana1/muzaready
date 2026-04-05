import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platba a vrácení | Múza Hair Praha',
  description: 'Způsoby platby, doprava a podmínky vrácení zboží. Zásilkovna 89 Kč, DPD 68 Kč, osobní odběr Praha zdarma.',
  alternates: { canonical: 'https://muzahair.cz/informace/platba-a-vraceni' },
};

export default function PlatbaAVraceniPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex gap-2">
          <Link href="/" className="hover:text-burgundy transition">Domů</Link>
          <span>/</span>
          <Link href="/informace" className="hover:text-burgundy transition">Informace</Link>
          <span>/</span>
          <span className="text-gray-600">Platba a vrácení</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-playfair text-burgundy mb-6">
          Platba a vrácení
        </h1>

        <div className="bg-ivory border-l-4 border-burgundy p-6 rounded-xl mb-12">
          <p className="text-gray-800 leading-relaxed">
            Přijímáme platbu kartou online a bankovním převodem. Dobírka není dostupná. Zásilky expedujeme přes Zásilkovnu (89 Kč) a DPD (68 Kč). Osobní odběr v showroomu Praha je zdarma. Nerozbalené vlasy lze vrátit do 14 dní.
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">

          {/* Způsoby platby */}
          <h2 className="text-3xl font-playfair text-burgundy mb-6">Způsoby platby</h2>

          <div className="not-prose space-y-3 mb-4">
            {[
              {
                name: 'Platba kartou online',
                desc: 'Visa, Mastercard, Maestro — přes zabezpečenou bránu GoPay. Platba je zpracována okamžitě.',
                badge: 'Doporučeno',
              },
              {
                name: 'Bankovní převod',
                desc: 'Převod na náš bankovní účet. Objednávka se expeduje po připsání platby — zpravidla 1–2 pracovní dny.',
                badge: null,
              },
              {
                name: 'Hotovost v showroomu',
                desc: 'Platba v hotovosti při osobním odběru v showroomu Praha. Bez příplatků.',
                badge: null,
              },
            ].map((m) => (
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

          <div className="not-prose p-5 bg-red-50 border border-red-100 rounded-xl mb-10">
            <p className="font-semibold text-red-800 mb-1">Dobírka není dostupná</p>
            <p className="text-sm text-red-700">Vlasy jsou prémiové zboží — z hygienických a bezpečnostních důvodů nezasíláme na dobírku.</p>
          </div>

          {/* Doprava */}
          <h2 className="text-3xl font-playfair text-burgundy mb-6">Doprava a doručení</h2>

          <div className="not-prose grid md:grid-cols-2 gap-4 mb-10">
            {[
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
                name: 'Osobní odběr — showroom Praha',
                price: 'Zdarma',
                time: 'Po domluvě',
                desc: 'Revoluční 8, Praha. Po–So 10:00–18:00.',
                available: true,
              },
              {
                name: 'Balikovná',
                price: '—',
                time: '—',
                desc: 'Připravujeme. Brzy dostupné.',
                available: false,
              },
            ].map((m) => (
              <div
                key={m.name}
                className={`p-5 border rounded-xl ${m.available ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{m.name}</span>
                  {!m.available && (
                    <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Připravujeme</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-3">{m.desc}</p>
                {m.available && (
                  <div className="flex gap-6 text-sm pt-3 border-t border-gray-100">
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">Cena</span>
                      <span className="font-semibold text-gray-900">{m.price}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide block mb-0.5">Doba doručení</span>
                      <span className="font-semibold text-gray-900">{m.time}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vrácení */}
          <h2 className="text-3xl font-playfair text-burgundy mb-6">Vrácení zboží</h2>

          <div className="not-prose bg-ivory border-l-4 border-amber-400 p-6 rounded-xl mb-6">
            <p className="font-semibold text-gray-900 mb-2">Specifika vlasových produktů</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Vlasy lze vrátit pouze v <strong>nerozbaléném originálním balení</strong>. Rozbalené, použité, aplikované nebo chemicky upravené vlasy nelze z hygienických důvodů vrátit ani vyměnit.
            </p>
          </div>

          <div className="not-prose grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Podmínky vrácení</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  { ok: true, text: 'Lhůta 14 dní od převzetí zboží' },
                  { ok: true, text: 'Nerozbalené v originálním obalu s etiketami' },
                  { ok: true, text: 'Poplatek za naskladnění 100 Kč / položka' },
                  { ok: true, text: 'Peníze vrátíme do 14 dní od přijetí zboží' },
                  { ok: false, text: 'Zakázková výroba (pásky, weft, keratin)' },
                  { ok: false, text: 'Rozbalené nebo použité zboží' },
                  { ok: false, text: 'Chemicky nebo mechanicky upravené vlasy' },
                ].map((i, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className={`font-bold mt-0.5 ${i.ok ? 'text-green-500' : 'text-red-400'}`}>{i.ok ? '✓' : '✗'}</span>
                    <span className={i.ok ? '' : 'text-gray-400'}>{i.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Jak vrátit zboží</h3>
              <ol className="space-y-4 text-sm text-gray-700">
                {[
                  'Napište na muzahaircz@gmail.com — uveďte číslo objednávky a důvod vrácení.',
                  'Vyplňte formulář pro odstoupení od smlouvy (zašleme e-mailem).',
                  'Zboží zašlete doporučeně na adresu: Šrámkova 430/12, 638 00 Brno. Nezasílejte na dobírku.',
                  'Po obdržení zboží vrátíme peníze na bankovní účet do 14 dnů.',
                ].map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-ivory border border-burgundy/20 text-burgundy rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-5">
                <a
                  href="mailto:muzahaircz@gmail.com?subject=Vrácení zboží"
                  className="inline-block px-5 py-2.5 bg-burgundy text-white text-sm font-medium rounded-lg hover:opacity-90 transition"
                >
                  Napsat o vrácení →
                </a>
              </div>
            </div>
          </div>

          {/* Reklamace */}
          <h2 className="text-3xl font-playfair text-burgundy mb-6">Reklamace</h2>

          <div className="not-prose grid md:grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Záruční doba', value: '24 měsíců', note: 'na výrobní vady nepoužitého zboží' },
              { label: 'Vyřízení', value: 'do 30 dní', note: 'od uplatnění reklamace' },
              { label: 'Kontakt', value: 'muzahaircz@gmail.com', note: 'foto + číslo objednávky' },
            ].map((i) => (
              <div key={i.label} className="p-5 bg-ivory border border-burgundy/10 rounded-xl">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{i.label}</p>
                <p className="font-semibold text-burgundy mb-1 text-sm">{i.value}</p>
                <p className="text-xs text-gray-500">{i.note}</p>
              </div>
            ))}
          </div>

          <div className="not-prose p-5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 mb-12">
            <p className="font-medium text-gray-800 mb-3">Co není vadou zboží:</p>
            <ul className="space-y-1.5 text-gray-500">
              <li>— Přirozená odchylka v odstínu barvy oproti zobrazení na monitoru</li>
              <li>— Mírná přirozená vlnitost slovanských vlasů</li>
              <li>— Změna struktury vlivem nesprávné péče nebo chemické úpravy kupujícím</li>
              <li>— Opotřebení způsobené obvyklým používáním</li>
            </ul>
          </div>

        </div>

        {/* Související */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-4">Související stránky</p>
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
