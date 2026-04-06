import { Metadata } from 'next';
import Link from 'next/link';
import PrintButton from '@/components/PrintButton';

export const metadata: Metadata = {
  title: 'Formulář pro odstoupení od smlouvy | Múza Hair',
  description: 'Formulář pro odstoupení od kupní smlouvy do 14 dnů od převzetí zboží. Vytiskněte, vyplňte a zašlete e-mailem nebo poštou.',
  alternates: { canonical: 'https://muzahair.cz/informace/odstoupeni-od-smlouvy' },
  robots: { index: true, follow: true },
};

export default function OdstoupeniOdSmlouvyPage() {
  return (
    <div className="py-12 bg-soft-cream min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Breadcrumb */}
        <div className="text-sm text-text-mid mb-6">
          <Link href="/" className="hover:text-burgundy">Domů</Link>
          {' / '}
          <Link href="/informace" className="hover:text-burgundy">Informace</Link>
          {' / '}
          <span className="text-burgundy">Odstoupení od smlouvy</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-playfair text-burgundy mb-3">
            Formulář pro odstoupení od smlouvy
          </h1>
          <p className="text-text-mid text-sm leading-relaxed">
            Jako spotřebitel máte právo odstoupit od kupní smlouvy bez udání důvodu do{' '}
            <strong>14 dnů od převzetí zboží</strong> (§ 1829 občanského zákoníku).
            Formulář vytiskněte, vyplňte a zašlete e-mailem nebo poštou.
          </p>
        </div>

        {/* Jak postupovat */}
        <div className="bg-ivory border-l-4 border-burgundy rounded-xl p-5 mb-8 text-sm text-text-mid">
          <p className="font-semibold text-text-dark mb-2">Jak postupovat</p>
          <ol className="space-y-1.5 list-decimal list-inside">
            <li>Vytiskněte formulář níže</li>
            <li>Vyplňte všechna povinná pole</li>
            <li>Zboží zabalte a přiložte vyplněný formulář uvnitř balíku</li>
            <li>Zašlete e-mailem na <a href="mailto:muzahaircz@gmail.com" className="text-burgundy underline">muzahaircz@gmail.com</a> nebo poštou na adresu Revoluční 8, Praha 1, 110 00</li>
            <li>Peníze vrátíme do 14 dní od obdržení zboží na váš bankovní účet</li>
          </ol>
        </div>

        {/* Upozornění */}
        <div className="bg-white border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
          <p className="font-semibold mb-1">⚠️ Pozor — výjimky z práva na odstoupení</p>
          <p>
            Právo na odstoupení se <strong>nevztahuje</strong> na zboží vyrobené na zakázku dle přání zákazníka
            (např. vlasové tresy šité na míru, keratinové pramínky s konkrétní gramáží a délkou na objednávku).
            Podrobnosti viz{' '}
            <Link href="/informace/obchodni-podminky" className="underline hover:text-amber-900">Obchodní podmínky</Link>.
          </p>
        </div>

        {/* FORMULÁŘ — printable */}
        <div
          id="formular-odstoupeni"
          className="bg-white border-2 border-warm-beige rounded-xl p-8 mb-8 print:border print:rounded-none print:shadow-none"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Hlavička formuláře */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wide text-text-dark">
              Formulář pro odstoupení od kupní smlouvy
            </h2>
            <p className="text-xs text-text-soft mt-1">dle § 1829 zákona č. 89/2012 Sb., občanského zákoníku</p>
          </div>

          {/* Prodávající */}
          <div className="mb-6 p-4 bg-soft-cream rounded text-sm">
            <p className="font-bold text-text-dark mb-1">Prodávající (adresát):</p>
            <p className="text-text-mid">
              Múza Hair s.r.o.<br />
              Revoluční 8, Praha 1, 110 00<br />
              IČO: 17989230<br />
              E-mail: muzahaircz@gmail.com
            </p>
          </div>

          {/* Kupující */}
          <div className="mb-6">
            <p className="font-bold text-text-dark mb-3 text-sm">Kupující (spotřebitel):</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-soft mb-1">Jméno a příjmení *</label>
                <div className="border-b-2 border-warm-beige min-h-[28px] print:min-h-[24px]" />
              </div>
              <div>
                <label className="block text-xs text-text-soft mb-1">Adresa (ulice, č.p., město, PSČ) *</label>
                <div className="border-b-2 border-warm-beige min-h-[28px]" />
                <div className="border-b-2 border-warm-beige min-h-[28px] mt-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-soft mb-1">Telefon</label>
                  <div className="border-b-2 border-warm-beige min-h-[28px]" />
                </div>
                <div>
                  <label className="block text-xs text-text-soft mb-1">E-mail *</label>
                  <div className="border-b-2 border-warm-beige min-h-[28px]" />
                </div>
              </div>
            </div>
          </div>

          {/* Objednávka */}
          <div className="mb-6">
            <p className="font-bold text-text-dark mb-3 text-sm">Informace o objednávce:</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-soft mb-1">Číslo objednávky *</label>
                  <div className="border-b-2 border-warm-beige min-h-[28px]" />
                </div>
                <div>
                  <label className="block text-xs text-text-soft mb-1">Datum objednávky *</label>
                  <div className="border-b-2 border-warm-beige min-h-[28px]" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-text-soft mb-1">Datum převzetí zboží *</label>
                <div className="border-b-2 border-warm-beige min-h-[28px]" />
              </div>
              <div>
                <label className="block text-xs text-text-soft mb-1">Označení zboží (název produktu, délka, gramáž, odstín) *</label>
                <div className="border-b-2 border-warm-beige min-h-[28px]" />
                <div className="border-b-2 border-warm-beige min-h-[28px] mt-2" />
                <div className="border-b-2 border-warm-beige min-h-[28px] mt-2" />
              </div>
            </div>
          </div>

          {/* Vrácení peněz */}
          <div className="mb-6">
            <p className="font-bold text-text-dark mb-3 text-sm">Vrácení kupní ceny — bankovní spojení:</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-soft mb-1">Číslo bankovního účtu (včetně kódu banky) *</label>
                <div className="border-b-2 border-warm-beige min-h-[28px]" />
              </div>
              <div>
                <label className="block text-xs text-text-soft mb-1">IBAN (pokud požadujete platbu do zahraničí)</label>
                <div className="border-b-2 border-warm-beige min-h-[28px]" />
              </div>
            </div>
          </div>

          {/* Prohlášení */}
          <div className="mb-8 p-4 border border-warm-beige rounded text-sm text-text-mid bg-soft-cream">
            <p>
              Tímto prohlašuji, že odstupuji od kupní smlouvy na výše uvedené zboží a žádám
              o vrácení uhrazené kupní ceny na shora uvedený bankovní účet.
              Zboží zasílám / zaslal(a) jsem zpět v původním nebo porovnatelném stavu.
            </p>
          </div>

          {/* Podpis */}
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <label className="block text-xs text-text-soft mb-1">Místo</label>
              <div className="border-b-2 border-warm-beige min-h-[28px]" />
            </div>
            <div>
              <label className="block text-xs text-text-soft mb-1">Datum *</label>
              <div className="border-b-2 border-warm-beige min-h-[28px]" />
            </div>
          </div>
          <div className="mt-8">
            <label className="block text-xs text-text-soft mb-1">Podpis spotřebitele *</label>
            <div className="border-b-2 border-warm-beige min-h-[48px]" />
          </div>

          {/* Footer formuláře */}
          <div className="mt-8 pt-4 border-t border-warm-beige text-xs text-text-soft text-center">
            Múza Hair s.r.o. · Revoluční 8, Praha 1 · muzahaircz@gmail.com · +420 728 722 880
          </div>
        </div>

        {/* Tlačítko tisk */}
        <PrintButton />

        {/* Lhůty */}
        <div className="bg-white border border-warm-beige rounded-xl p-6 mb-8 text-sm">
          <h2 className="font-playfair text-lg text-burgundy mb-4">Důležité lhůty</h2>
          <div className="space-y-3">
            {[
              { label: 'Lhůta pro odstoupení', value: '14 dní od převzetí zboží' },
              { label: 'Vrácení zboží', value: 'Do 14 dní od odeslání odstoupení' },
              { label: 'Vrácení peněz', value: 'Do 14 dní od obdržení vráceného zboží' },
              { label: 'Způsob vrácení', value: 'Bankovním převodem na účet uvedený ve formuláři' },
              { label: 'Náklady na vrácení', value: 'Hradí kupující (pokud nebylo zboží vadné)' },
            ].map((item) => (
              <div key={item.label} className="flex gap-4">
                <span className="text-text-soft min-w-[180px] flex-shrink-0">{item.label}</span>
                <span className="font-medium text-text-dark">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Kontakt */}
        <div className="bg-ivory border border-burgundy/10 rounded-xl p-6 text-center text-sm">
          <p className="font-semibold text-text-dark mb-1">Máte dotaz k vrácení?</p>
          <p className="text-text-soft mb-4">Kontaktujte nás e-mailem nebo telefonicky — rádi pomůžeme.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="mailto:muzahaircz@gmail.com" className="px-5 py-2 bg-burgundy text-white rounded-lg hover:opacity-90 transition text-xs font-medium">
              muzahaircz@gmail.com
            </a>
            <a href="tel:+420728722880" className="px-5 py-2 border border-burgundy text-burgundy rounded-lg hover:bg-white transition text-xs font-medium">
              +420 728 722 880
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
