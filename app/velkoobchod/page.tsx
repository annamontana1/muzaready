'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WholesaleRegistrationModal from '@/components/WholesaleRegistrationModal';

const BTN_PRIMARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity';
const BTN_SECONDARY =
  'inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-muza-ink text-muza-ink text-sm font-medium hover:opacity-90 transition-opacity';

const STEPS = [
  {
    title: 'Pošlete žádost',
    text: 'Vyplňte krátký formulář: jméno, e-mail, telefon, město a odkaz na Instagram, Facebook nebo web salonu.',
  },
  {
    title: 'Ověříme váš salon',
    text: 'Žádost projdeme obvykle do 24–48 hodin a o schválení vám dáme vědět e-mailem.',
  },
  {
    title: 'Nakupujete za velkoobchodní ceny',
    text: 'Po přihlášení se vám v katalogu zobrazí velkoobchodní ceny na culíky i zakončení.',
  },
];

const BENEFITS = [
  { label: 'Ceny', value: 'Velkoobchodní, po schválení účtu' },
  { label: 'Výroba', value: 'Vlastní barvírna v ČR' },
  { label: 'Kvality', value: 'Standard, LUXE, Platinum Edition' },
  { label: 'Zakončení', value: 'Keratin, mikrokeratin, tape-in, tresy' },
  { label: 'Platba', value: 'Předem převodem, QR kód' },
  { label: 'Doprava', value: 'Po celé ČR a SR' },
  { label: 'Minimální odběr', value: 'Není' },
];

const FAQ = [
  {
    q: 'Kdo může požádat o velkoobchodní ceny?',
    a: 'Kadeřnické salony, kadeřnice a specialistky na prodlužování vlasů, které s vlasy pracují profesionálně.',
  },
  {
    q: 'Co potřebuji k registraci?',
    a: 'Jméno, e-mail, telefon, město, heslo a odkaz alespoň na jedno z: Instagram, Facebook nebo web salonu. Název firmy je nepovinný.',
  },
  {
    q: 'Jak dlouho trvá schválení?',
    a: 'Obvykle 24–48 hodin. O schválení vás informujeme e-mailem, poté se po přihlášení zobrazí velkoobchodní ceny.',
  },
  {
    q: 'Jak se platí?',
    a: 'Vždy předem bankovním převodem, platební údaje i QR kód dostanete hned po odeslání objednávky. Na dobírku neposíláme.',
  },
  {
    q: 'Je minimální objednávka?',
    a: 'Ne. U větších zakázek se rádi domluvíme individuálně.',
  },
  {
    q: 'Jak je to s Platinum Edition?',
    a: 'Platinum Edition může mít individuální cenu. Napište nám na muzahaircz@gmail.com, co potřebujete, a pošleme nabídku.',
  },
];

export default function VelkoobchodPage() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Odkaz z pásu „Získat velkoobchodní slevu“ (?registrace=1) otevře formulář rovnou
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('registrace') === '1') setShowRegistrationModal(true);
  }, []);

  const openModal = () => setShowRegistrationModal(true);

  return (
    <div className="bg-muza-cream text-text-dark font-jost">
      {/* Hero */}
      <section className="px-4 lg:px-8 pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Drobečková navigace" className="text-sm text-[#45302F] mb-8 lg:mb-12">
            <Link href="/" className="hover:underline">Domů</Link>
            <span className="mx-2">/</span>
            <span className="text-text-dark">Velkoobchod</span>
          </nav>

          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-16 lg:items-center">
            <div className="max-w-[720px]">
              <h1 className="font-cormorant text-[40px] lg:text-[60px] leading-[1.05] font-light">
                Velkoobchod pro salony a kadeřnice
              </h1>
              <p className="mt-5 text-base leading-relaxed text-[#45302F]">
                Mùza je český výrobce pravých vlasů s vlastní barvírnou. Registrovaným a schváleným salonům
                nabízíme velkoobchodní ceny na nebarvené i barvené vlasy ve kvalitách Standard, LUXE
                a Platinum Edition.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={openModal} className={BTN_PRIMARY}>
                  Požádat o velkoobchodní ceny
                </button>
                <Link href="/katalog" className={BTN_SECONDARY}>
                  Prohlédnout katalog
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative aspect-[4/5] rounded-t-full overflow-hidden bg-muza-mocha">
                <Image
                  src="/images/atelier/atelier-07.webp"
                  alt="Dílna Mùza, kde vlasy ručně zpracováváme"
                  fill
                  sizes="380px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jak to funguje */}
      <section className="px-4 lg:px-8 py-16 lg:py-20 bg-muza-ivory">
        <div className="max-w-[720px] mx-auto">
          <h2 className="font-cormorant text-[34px] lg:text-[42px] leading-[1.1] font-light">Jak to funguje</h2>
          <ol className="mt-8">
            {STEPS.map((step) => (
              <li key={step.title} className="py-4 border-t border-muza-line">
                <p className="text-base font-medium">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#45302F]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Co získáte */}
      <section className="px-4 lg:px-8 py-16 lg:py-20">
        <div className="max-w-[720px] mx-auto">
          <h2 className="font-cormorant text-[34px] lg:text-[42px] leading-[1.1] font-light">Co získáte</h2>
          <dl className="mt-8">
            {BENEFITS.map((row) => (
              <div key={row.label} className="flex justify-between gap-6 py-3 border-t border-muza-line">
                <dt className="text-sm text-[#45302F]">{row.label}</dt>
                <dd className="text-sm font-medium text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-[#45302F]">
            Rádi poradíme s výběrem odstínu, délky, gramáže i zakončení.
          </p>
        </div>
      </section>

      {/* Sortiment */}
      <section className="px-4 lg:px-8 py-16 lg:py-20 bg-muza-ivory">
        <div className="max-w-[720px] mx-auto">
          <h2 className="font-cormorant text-[34px] lg:text-[42px] leading-[1.1] font-light">Sortiment</h2>
          <p className="mt-4 text-base leading-relaxed text-[#45302F]">
            V katalogu najdete celý sortiment. Velkoobchodní ceny se zobrazí po přihlášení schváleného účtu.
          </p>
          <div className="mt-8">
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske"
              className="flex justify-between items-center gap-6 py-4 border-t border-muza-line hover:opacity-80"
            >
              <span>
                <span className="block text-base font-medium">Nebarvené panenské vlasy</span>
                <span className="block text-sm text-[#45302F]">Standard, LUXE, Platinum Edition</span>
              </span>
              <span aria-hidden="true" className="text-muza-ink">→</span>
            </Link>
            <Link
              href="/vlasy-k-prodlouzeni/barvene-vlasy"
              className="flex justify-between items-center gap-6 py-4 border-t border-b border-muza-line hover:opacity-80"
            >
              <span>
                <span className="block text-base font-medium">Barvené a blond vlasy</span>
                <span className="block text-sm text-[#45302F]">Z naší barvírny, Standard, LUXE, Platinum Edition</span>
              </span>
              <span aria-hidden="true" className="text-muza-ink">→</span>
            </Link>
          </div>
          <div className="mt-8">
            <Link href="/katalog" className={BTN_SECONDARY}>
              Celý katalog
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 lg:px-8 py-16 lg:py-20">
        <div className="max-w-[720px] mx-auto">
          <h2 className="font-cormorant text-[34px] lg:text-[42px] leading-[1.1] font-light">Časté dotazy</h2>
          <div className="mt-8 border-b border-muza-line">
            {FAQ.map((item) => (
              <details key={item.q} className="group border-t border-muza-line">
                <summary className="flex justify-between items-center gap-6 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-base font-medium">{item.q}</span>
                  <span aria-hidden="true" className="text-muza-ink text-xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-[#45302F]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Závěrečná výzva */}
      <section className="px-4 lg:px-8 pb-20">
        <div className="max-w-[720px] mx-auto rounded-3xl bg-muza-ivory px-6 py-10 lg:px-12 text-center">
          <h2 className="font-cormorant text-[34px] lg:text-[42px] leading-[1.1] font-light">
            Začněte nakupovat za velkoobchodní ceny
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#45302F]">
            Registrace zabere pár minut. Dotazy rádi zodpovíme na{' '}
            <a href="mailto:muzahaircz@gmail.com" className="underline underline-offset-2">muzahaircz@gmail.com</a>
            {' '}nebo na{' '}
            <a href="tel:+420728722880" className="underline underline-offset-2 whitespace-nowrap">+420 728 722 880</a>.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={openModal} className={BTN_PRIMARY}>
              Požádat o velkoobchodní ceny
            </button>
            <Link href="/kontakt" className={BTN_SECONDARY}>
              Napsat nám
            </Link>
          </div>
        </div>
      </section>

      <WholesaleRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </div>
  );
}
