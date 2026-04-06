'use client';

import { useState } from 'react';
import Link from 'next/link';
import WholesaleRegistrationModal from '@/components/WholesaleRegistrationModal';

export default function VelkoobchodPage() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const isLoggedIn = false;
  const isApproved = false;

  const handleCTAClick = () => {
    if (!isLoggedIn) {
      setShowRegistrationModal(true);
    } else if (!isApproved) {
      document.getElementById('approval-status')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: 'var(--white)' }}>

      {/* Breadcrumb */}
      <div className="px-8 lg:px-20 pt-8 pb-0">
        <div
          className="text-[11px] tracking-[0.15em] uppercase font-light"
          style={{ color: 'var(--text-soft)' }}
        >
          <Link href="/" className="hover:underline" style={{ color: 'var(--text-soft)' }}>Domů</Link>
          {' / '}
          <span style={{ color: 'var(--text-dark)' }}>Velkoobchod</span>
        </div>
      </div>

      {/* Hero */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          B2B partneři
        </div>

        <h1
          className="font-cormorant text-[clamp(40px,5vw,60px)] font-light leading-[1.12] tracking-[-0.01em] mb-6 max-w-3xl"
          style={{ color: 'var(--text-dark)' }}
        >
          Velkoobchod pro salony a kadeřníky
        </h1>

        <p className="text-[15px] leading-[1.8] font-light max-w-xl mb-4" style={{ color: 'var(--text-soft)' }}>
          Získejte velkoobchodní ceny na nebarvené a barvené vlasy — Standard, LUXE, Platinum Edition.
        </p>

        <p className="text-[15px] leading-[1.8] font-light max-w-xl mb-12" style={{ color: 'var(--text-soft)' }}>
          Jsme český výrobce se svou barvírnou. Dodáváme nebarvené i barvené vlasy k prodloužení
          pro profesionály. Registrujte se a po schválení uvidíte velkoobchodní ceny.
        </p>

        <button
          onClick={handleCTAClick}
          className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
          style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
        >
          Přihlásit / Registrovat B2B
        </button>
      </section>

      {/* Benefits */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--beige)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Výhody
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-12"
          style={{ color: 'var(--text-dark)' }}
        >
          Výhody pro B2B partnery
        </h2>

        <div className="flex flex-col gap-0 max-w-2xl">
          {[
            {
              title: 'Vlastní barvírna v ČR',
              text: 'Kontrola kvality každého culíku přímo v naší výrobě',
            },
            {
              title: 'Široké spektrum produktů',
              text: 'Nebarvené i barvené vlasy ve třech kvalitách: Standard, LUXE, Platinum Edition',
            },
            {
              title: 'Konfigurace na míru',
              text: 'Délka, gramáž, zakončení (keratin, mikrokeratin, tape-in, vlasové tresy)',
            },
            {
              title: 'Rychlá logistika',
              text: 'Efektivní dodání po celé ČR a SR',
            },
            {
              title: 'Velkoobchodní ceny',
              text: 'Individuální slevové podmínky po schválení B2B účtu',
            },
            {
              title: 'Podpora a poradenství',
              text: 'Pomoc při výběru produktů, péče o vlasy, v budoucnu i školení',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-6 border-b"
              style={{ borderColor: 'var(--ivory-warm)' }}
            >
              <span
                className="block w-4 h-px mt-[13px] flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              <div>
                <p className="text-[15px] font-light mb-1" style={{ color: 'var(--text-dark)' }}>
                  {item.title}
                </p>
                <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory-warm)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Proces
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-12"
          style={{ color: 'var(--text-dark)' }}
        >
          Jak to funguje
        </h2>

        <div className="flex flex-col gap-0 max-w-2xl">
          {[
            { num: '01', title: 'Registrace', text: 'Vyplňte B2B registrační formulář s údaji o vaší firmě' },
            { num: '02', title: 'Schválení', text: 'Vaši registraci schválíme do 24–48 hodin' },
            { num: '03', title: 'Nákup za B2B ceny', text: 'Po přihlášení vidíte velkoobchodní ceny' },
            { num: '04', title: 'Výroba a dodání', text: 'Standardní doba dodání podle kategorie produktu' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-8 py-6 border-b"
              style={{ borderColor: 'var(--beige)' }}
            >
              <span
                className="text-[11px] tracking-[0.15em] uppercase font-light w-8 flex-shrink-0 pt-px"
                style={{ color: 'var(--accent)' }}
              >
                {item.num}
              </span>
              <div>
                <p className="text-[15px] font-light mb-1" style={{ color: 'var(--text-dark)' }}>
                  {item.title}
                </p>
                <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Sortiment
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-4"
          style={{ color: 'var(--text-dark)' }}
        >
          B2B kategorie produktů
        </h2>

        <p className="text-[15px] leading-[1.8] font-light mb-12" style={{ color: 'var(--text-soft)' }}>
          {!isLoggedIn || !isApproved
            ? 'Velkoobchodní ceny dostupné po přihlášení a schválení účtu.'
            : 'Vyberte kategorii pro zobrazení velkoobchodních cen.'}
        </p>

        <div className="w-16 h-px mb-10" style={{ background: 'var(--accent)' }} />

        <div className="flex flex-col gap-0 max-w-2xl mb-8">
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske"
            className="flex items-start gap-4 py-6 border-b transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--beige)' }}
          >
            <span
              className="block w-4 h-px mt-[11px] flex-shrink-0"
              style={{ background: 'var(--accent)' }}
            />
            <div>
              <p className="text-[15px] font-light mb-1" style={{ color: 'var(--text-dark)' }}>
                Nebarvené panenské vlasy
              </p>
              <p className="text-[15px] font-light" style={{ color: 'var(--text-soft)' }}>
                Tři úrovně kvality: Standard / LUXE / Platinum Edition
              </p>
            </div>
            <span
              className="ml-auto text-[12px] tracking-[0.1em] uppercase font-light flex-shrink-0 pt-px"
              style={{ color: 'var(--text-mid)' }}
            >
              Zobrazit →
            </span>
          </Link>

          <Link
            href="/vlasy-k-prodlouzeni/barvene-vlasy"
            className="flex items-start gap-4 py-6 border-b transition-opacity hover:opacity-70"
            style={{ borderColor: 'var(--beige)' }}
          >
            <span
              className="block w-4 h-px mt-[11px] flex-shrink-0"
              style={{ background: 'var(--accent)' }}
            />
            <div>
              <p className="text-[15px] font-light mb-1" style={{ color: 'var(--text-dark)' }}>
                Barvené a Blond vlasy
              </p>
              <p className="text-[15px] font-light" style={{ color: 'var(--text-soft)' }}>
                Standard / LUXE / Platinum Edition (individuální ceny)
              </p>
            </div>
            <span
              className="ml-auto text-[12px] tracking-[0.1em] uppercase font-light flex-shrink-0 pt-px"
              style={{ color: 'var(--text-mid)' }}
            >
              Zobrazit →
            </span>
          </Link>
        </div>

        <p className="text-[13px] font-light" style={{ color: 'var(--text-soft)' }}>
          Platinum Edition může mít individuální ceny — kontaktujte nás pro detaily.
        </p>
      </section>

      {/* FAQ */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--beige)' }}>
        <div
          className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3"
          style={{ color: 'var(--accent)' }}
        >
          <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          Časté dotazy
        </div>

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-12"
          style={{ color: 'var(--text-dark)' }}
        >
          Dotazy B2B partnerů
        </h2>

        <div className="flex flex-col gap-0 max-w-2xl">
          {[
            {
              q: 'Kdo může požádat o B2B účet?',
              a: 'B2B účet je určen pro kadeřnické salony, profesionální kadeřníky na OSVČ, e-shopy se zaměřením na vlasy a další podnikatelské subjekty v beauty odvětví.',
            },
            {
              q: 'Za jak dlouho schvalujete registrace?',
              a: 'Standardně do 24–48 hodin od odeslání kompletního registračního formuláře. O schválení vás budeme informovat e-mailem.',
            },
            {
              q: 'Jaká je výše slevy pro schválené B2B účty?',
              a: 'Výše slevy je individuální a závisí na objemu odběru a podmínkách spolupráce. Kontaktujte nás pro konkrétní nabídku.',
            },
            {
              q: 'Jsou minimální objednávky (MOQ)?',
              a: 'Standardně nemáme nastavené MOQ. U velkých zakázek řešíme podmínky individuálně — kontaktujte nás pro detaily.',
            },
            {
              q: 'Jak řešíte dostupnost produktů?',
              a: 'Část produktů máme na skladě, část vyrábíme na objednávku. Doba dodání se liší podle typu produktu a je vždy uvedena u každé položky. Pro B2B partnery zajišťujeme přednostní výrobu.',
            },
            {
              q: 'Jak funguje individuální cena u Platinum Edition?',
              a: 'Platinum Edition má často specifické požadavky. Přidejte produkt do košíku a odešlete poptávku, nebo nás kontaktujte přímo na muzahaircz@gmail.com s detaily vašich požadavků.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 py-6 border-b"
              style={{ borderColor: 'var(--ivory-warm)' }}
            >
              <span
                className="block w-4 h-px mt-[13px] flex-shrink-0"
                style={{ background: 'var(--accent)' }}
              />
              <div>
                <p className="text-[15px] font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                  {item.q}
                </p>
                <p className="text-[15px] leading-[1.8] font-light" style={{ color: 'var(--text-soft)' }}>
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-8 lg:px-20 py-20" style={{ background: 'var(--ivory)' }}>
        <div className="w-16 h-px mb-8" style={{ background: 'var(--accent)' }} />

        <h2
          className="font-cormorant text-[clamp(28px,3vw,40px)] font-light mb-4"
          style={{ color: 'var(--text-dark)' }}
        >
          Potřebujete poradit?
        </h2>

        <p className="text-[15px] leading-[1.8] font-light max-w-md mb-10" style={{ color: 'var(--text-soft)' }}>
          Náš tým je připraven odpovědět na vaše dotazy a pomoci vám s výběrem produktů.
        </p>

        <div className="flex flex-col gap-0 max-w-sm mb-12">
          <div
            className="flex items-center gap-8 py-5 border-b"
            style={{ borderColor: 'var(--beige)' }}
          >
            <span
              className="text-[11px] tracking-[0.15em] uppercase font-light w-16 flex-shrink-0"
              style={{ color: 'var(--text-soft)' }}
            >
              E-mail
            </span>
            <a
              href="mailto:muzahaircz@gmail.com"
              className="text-[15px] font-light transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-dark)' }}
            >
              muzahaircz@gmail.com
            </a>
          </div>
          <div
            className="flex items-center gap-8 py-5 border-b"
            style={{ borderColor: 'var(--beige)' }}
          >
            <span
              className="text-[11px] tracking-[0.15em] uppercase font-light w-16 flex-shrink-0"
              style={{ color: 'var(--text-soft)' }}
            >
              Telefon
            </span>
            <a
              href="tel:+420728722880"
              className="text-[15px] font-light transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-dark)' }}
            >
              +420 728 722 880
            </a>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <button
            onClick={handleCTAClick}
            className="text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 rounded-sm font-normal transition-all hover:-translate-y-px"
            style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
          >
            Registrovat B2B účet
          </button>
          <Link
            href="/kontakt"
            className="text-[12px] tracking-[0.1em] uppercase font-light flex items-center gap-2"
            style={{ color: 'var(--text-mid)' }}
          >
            Napsat nám →
          </Link>
        </div>
      </section>

      <WholesaleRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />

    </div>
  );
}
