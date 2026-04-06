'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import WholesaleRegistrationModal from '@/components/WholesaleRegistrationModal';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function VelkoobchodPage() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Placeholder pro auth stav - později nahradit skutečnou autentizací
  const isLoggedIn = false;
  const isApproved = false;

  const handleCTAClick = () => {
    if (!isLoggedIn) {
      setShowRegistrationModal(true);
    } else if (!isApproved) {
      // Scroll to info about pending approval
      document.getElementById('approval-status')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Scroll to categories/prices
      document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <nav className="container mx-auto px-4 py-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-text-mid">
          <li><Link href="/" className="hover:text-burgundy">Domů</Link></li>
          <li><span className="mx-2">›</span></li>
          <li className="text-burgundy font-medium">Velkoobchod</li>
        </ol>
      </nav>

      {/* Hero sekce */}
      <section className="bg-gradient-to-b from-ivory to-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-3xl md:text-5xl font-playfair text-burgundy mb-6"
              variants={fadeInUp}
            >
              Velkoobchod pro salony a kadeřníky
            </motion.h1>

            <motion.h2
              className="text-lg md:text-2xl text-text-mid mb-8"
              variants={fadeInUp}
            >
              Získejte velkoobchodní ceny na nebarvené a barvené vlasy – Standard, LUXE, Platinum Edition
            </motion.h2>

            <motion.p
              className="text-base md:text-lg text-text-mid mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Jsme český výrobce se svou barvírnou. Dodáváme nebarvené i barvené vlasy k prodloužení
              pro profesionály. Registrujte se a po schválení uvidíte velkoobchodní ceny.
            </motion.p>

            <motion.button
              onClick={handleCTAClick}
              className="btn-primary text-base md:text-lg px-8 py-3 md:py-4"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Přihlásit / Registrovat B2B
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Výhody B2B */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-playfair text-burgundy text-center mb-8 md:mb-12">
            Výhody pro B2B partnery
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="bg-ivory p-6 rounded-xl border border-warm-beige">
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">
                Vlastní barvírna v ČR
              </h3>
              <p className="text-sm md:text-base text-text-mid">
                Kontrola kvality každého culíku přímo v naší výrobě
              </p>
            </div>

            <div className="bg-ivory p-6 rounded-xl border border-warm-beige">
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">
                Široké spektrum produktů
              </h3>
              <p className="text-sm md:text-base text-text-mid">
                Nebarvené i barvené vlasy ve třech kvalitách: Standard, LUXE, Platinum Edition
              </p>
            </div>

            <div className="bg-ivory p-6 rounded-xl border border-warm-beige">
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">
                Konfigurace na míru
              </h3>
              <p className="text-sm md:text-base text-text-mid">
                Délka, gramáž, zakončení (keratin, mikrokeratin, tape-in, vlasové tresy)
              </p>
            </div>

            <div className="bg-ivory p-6 rounded-xl border border-warm-beige">
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">
                Rychlá logistika
              </h3>
              <p className="text-sm md:text-base text-text-mid">
                Efektivní dodání po celé ČR a SR
              </p>
            </div>

            <div className="bg-ivory p-6 rounded-xl border border-warm-beige">
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">
                Velkoobchodní ceny
              </h3>
              <p className="text-sm md:text-base text-text-mid">
                Individuální slevové podmínky po schválení B2B účtu
              </p>
            </div>

            <div className="bg-ivory p-6 rounded-xl border border-warm-beige">
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">
                Podpora a poradenství
              </h3>
              <p className="text-sm md:text-base text-text-mid">
                Pomoc při výběru produktů, péče o vlasy, v budoucnu i školení
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jak to funguje */}
      <section className="py-12 md:py-16 bg-ivory">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-playfair text-burgundy text-center mb-8 md:mb-12">
            Jak to funguje
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-burgundy text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">Registrace</h3>
              <p className="text-sm md:text-base text-text-mid">
                Vyplňte B2B registrační formulář s údaji o vaší firmě
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-burgundy text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">Schválení</h3>
              <p className="text-sm md:text-base text-text-mid">
                Vaši registraci schválíme do 24–48 hodin
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-burgundy text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">Nákup za B2B ceny</h3>
              <p className="text-sm md:text-base text-text-mid">
                Po přihlášení vidíte velkoobchodní ceny
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-burgundy text-white rounded-full flex items-center justify-center text-xl md:text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-burgundy mb-3">Výroba a dodání</h3>
              <p className="text-sm md:text-base text-text-mid">
                Standardní doba dodání podle kategorie produktu
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kategorie produktů */}
      <section id="categories" className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-playfair text-burgundy text-center mb-4">
            B2B kategorie produktů
          </h2>
          <p className="text-center text-sm md:text-base text-text-mid mb-8 md:mb-12 max-w-2xl mx-auto">
            {!isLoggedIn || !isApproved ? (
              <span className="text-burgundy font-medium">
                Velkoobchodní ceny dostupné po přihlášení a schválení účtu
              </span>
            ) : (
              'Vyberte kategorii pro zobrazení velkoobchodních cen'
            )}
          </p>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
            {/* Nebarvené panenské */}
            <Link
              href="/vlasy-k-prodlouzeni/nebarvene-panenske"
              className="group bg-ivory border-2 border-warm-beige hover:border-burgundy rounded-xl p-6 md:p-8 transition"
            >
              <h3 className="text-xl md:text-2xl font-playfair text-burgundy mb-3 md:mb-4 group-hover:text-maroon transition">
                Nebarvené panenské vlasy
              </h3>
              <p className="text-sm md:text-base text-text-mid mb-4">
                Tři úrovně kvality: Standard / LUXE / Platinum Edition
              </p>
              <div className="text-sm md:text-base text-burgundy font-medium">
                Zobrazit produkty →
              </div>
            </Link>

            {/* Barvené & Blond */}
            <Link
              href="/vlasy-k-prodlouzeni/barvene-vlasy"
              className="group bg-ivory border-2 border-warm-beige hover:border-burgundy rounded-xl p-6 md:p-8 transition"
            >
              <h3 className="text-xl md:text-2xl font-playfair text-burgundy mb-3 md:mb-4 group-hover:text-maroon transition">
                Barvené & Blond vlasy
              </h3>
              <p className="text-sm md:text-base text-text-mid mb-4">
                Standard / LUXE / Platinum Edition (individuální ceny)
              </p>
              <div className="text-sm md:text-base text-burgundy font-medium">
                Zobrazit produkty →
              </div>
            </Link>
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-xs md:text-sm text-text-mid italic">
              * Platinum Edition může mít individuální ceny – kontaktujte nás pro detaily
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16 bg-ivory">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-playfair text-burgundy text-center mb-8 md:mb-12">
            Časté dotazy
          </h2>

          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            <details className="bg-white rounded-xl border border-warm-beige p-4 md:p-6 group">
              <summary className="text-base md:text-lg font-semibold text-burgundy cursor-pointer list-none flex justify-between items-center">
                <span>Kdo může požádat o B2B účet?</span>
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-sm md:text-base text-text-mid leading-relaxed">
                B2B účet je určen pro kadeřnické salony, profesionální kadeřníky na OSVČ,
                e-shopy se zaměřením na vlasy a další podnikatelské subjekty v beauty odvětví.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-warm-beige p-4 md:p-6 group">
              <summary className="text-base md:text-lg font-semibold text-burgundy cursor-pointer list-none flex justify-between items-center">
                <span>Za jak dlouho schvalujete registrace?</span>
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-sm md:text-base text-text-mid leading-relaxed">
                Standardně do 24–48 hodin od odeslání kompletního registračního formuláře.
                O schválení vás budeme informovat e-mailem.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-warm-beige p-4 md:p-6 group">
              <summary className="text-base md:text-lg font-semibold text-burgundy cursor-pointer list-none flex justify-between items-center">
                <span>Jaká je výše slevy pro schválené B2B účty?</span>
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-sm md:text-base text-text-mid leading-relaxed">
                Výše slevy je individuální a závisí na objemu odběru a podmínkách spolupráce.
                Kontaktujte nás pro konkrétní nabídku.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-warm-beige p-4 md:p-6 group">
              <summary className="text-base md:text-lg font-semibold text-burgundy cursor-pointer list-none flex justify-between items-center">
                <span>Jsou minimální objednávky (MOQ)?</span>
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-sm md:text-base text-text-mid leading-relaxed">
                Standardně nemáme nastavené MOQ. U velkých zakázek řešíme podmínky individuálně
                – kontaktujte nás pro detaily.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-warm-beige p-4 md:p-6 group">
              <summary className="text-base md:text-lg font-semibold text-burgundy cursor-pointer list-none flex justify-between items-center">
                <span>Jak řešíte dostupnost produktů?</span>
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-sm md:text-base text-text-mid leading-relaxed">
                Část produktů máme na skladě, část vyrábíme na objednávku. Doba dodání se liší
                podle typu produktu a je vždy uvedena u každé položky. Pro B2B partnery zajišťujeme
                přednostní výrobu.
              </p>
            </details>

            <details className="bg-white rounded-xl border border-warm-beige p-4 md:p-6 group">
              <summary className="text-base md:text-lg font-semibold text-burgundy cursor-pointer list-none flex justify-between items-center">
                <span>Jak funguje individuální cena u Platinum Edition?</span>
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="mt-4 text-sm md:text-base text-text-mid leading-relaxed">
                Platinum Edition má často specifické požadavky. Přidejte produkt do košíku a odešlete
                poptávku, nebo nás kontaktujte přímo na muzahaircz@gmail.com s detaily vašich požadavků.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-burgundy to-maroon text-white rounded-2xl p-6 md:p-12">
            <h2 className="text-2xl md:text-3xl font-playfair mb-4 md:mb-6">Potřebujete poradit?</h2>
            <p className="text-base md:text-lg mb-6 md:mb-8 opacity-90">
              Náš tým je připraven odpovědět na vaše dotazy a pomoci vám s výběrem produktů.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <div className="text-xs md:text-sm opacity-75 mb-1">E-mail</div>
                <a href="mailto:muzahaircz@gmail.com" className="text-lg md:text-xl hover:underline">
                  muzahaircz@gmail.com
                </a>
              </div>

              <div>
                <div className="text-xs md:text-sm opacity-75 mb-1">Telefon</div>
                <a href="tel:+420728722880" className="text-lg md:text-xl hover:underline">
                  +420 728 722 880
                </a>
              </div>
            </div>

            <Link href="/kontakt" className="btn-primary bg-white text-burgundy hover:bg-ivory inline-block">
              Napsat nám
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Modal - placeholder */}
      {showRegistrationModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRegistrationModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl md:text-2xl font-playfair text-burgundy mb-4">
              B2B Registrace
            </h3>
          </div>
        </div>
      )}

      <WholesaleRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </div>
  );
}
