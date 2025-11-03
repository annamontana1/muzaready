'use client';

import Link from 'next/link';
import { useState } from 'react';
import TopContactBar from './TopContactBar';
import SearchOverlay from './SearchOverlay';
import Badge from './Badge';
import { useFavorites } from '@/hooks/useFavorites';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vlasySubmenuOpen, setVlasySubmenuOpen] = useState(false);
  const [priceskySubmenuOpen, setPriceskySubmenuOpen] = useState(false);
  const [prislusenstviSubmenuOpen, setPrislusenstviSubmenuOpen] = useState(false);
  const [metodySubmenuOpen, setMetodySubmenuOpen] = useState(false);
  const [informaceSubmenuOpen, setInformaceSubmenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  const { favoriteCount } = useFavorites();
  const cartCount = 0; // TODO: Replace with actual cart count from cart context

  return (
    <>
      <TopContactBar />
      <header className="sticky top-0 z-50 bg-white shadow-medium" style={{ top: 'env(safe-area-inset-top)' }}>
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-playfair text-burgundy font-bold">
            MÙZA
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-burgundy font-medium hover:text-maroon transition">
              Domů
            </Link>

            <div className="relative group">
              <Link href="/vlasy-k-prodlouzeni" className="text-burgundy font-medium hover:text-maroon transition flex items-center gap-1">
                Vlasy k prodloužení
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-heavy rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-t-lg"
                >
                  Nebarvené panenské vlasy
                </Link>
                <Link
                  href="/vlasy-k-prodlouzeni/barvene-blond"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-b-lg"
                >
                  Barvené blond vlasy
                </Link>
              </div>
            </div>

            <div className="relative group">
              <Link href="/pricesky-a-paruky" className="text-burgundy font-medium hover:text-maroon transition flex items-center gap-1">
                Příčesky a paruky
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-heavy rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/pricesky-a-paruky/ofiny-z-pravych-vlasu"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-t-lg"
                >
                  Ofiny
                </Link>
                <Link
                  href="/pricesky-a-paruky/toupee"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Toupee/tupé
                </Link>
                <Link
                  href="/pricesky-a-paruky/vlasove-tresy"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Vlasové tresy
                </Link>
                <Link
                  href="/pricesky-a-paruky/prave-paruky"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Pravé paruky
                </Link>
                <Link
                  href="/pricesky-a-paruky/clip-in-vlasy"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Clip in vlasy
                </Link>
                <Link
                  href="/pricesky-a-paruky/clip-in-culik"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-b-lg"
                >
                  Clip in culík
                </Link>
              </div>
            </div>

            <div className="relative group">
              <Link href="/prislusenstvi" className="text-burgundy font-medium hover:text-maroon transition flex items-center gap-1">
                Příslušenství
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-heavy rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/prislusenstvi/tavici-kleste"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-t-lg"
                >
                  Tavicí kleště
                </Link>
                <Link
                  href="/prislusenstvi/keratin"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Keratin
                </Link>
                <Link
                  href="/prislusenstvi/pomykadlo"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Pomykadlo
                </Link>
                <Link
                  href="/prislusenstvi/hrebeny"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Hřebeny
                </Link>
                <Link
                  href="/prislusenstvi/kosmetika"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Kosmetika
                </Link>
                <Link
                  href="/prislusenstvi/ostatni"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-b-lg"
                >
                  Ostatní
                </Link>
              </div>
            </div>

            <div className="relative group">
              <span className="text-burgundy font-medium hover:text-maroon transition flex items-center gap-1 cursor-pointer">
                Metody zakončení
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-heavy rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/metody-zakonceni/keratin"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-t-lg"
                >
                  Keratin / Mikrokeratin
                </Link>
                <Link
                  href="/metody-zakonceni/tape-in"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Tape-in (nano tapes)
                </Link>
                <Link
                  href="/metody-zakonceni/vlasove-tresy"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-b-lg"
                >
                  Ručně šité vlasové tresy
                </Link>
              </div>
            </div>

            <Link href="/velkoobchod" className="text-burgundy font-medium hover:text-maroon transition">
              Velkoobchod
            </Link>

            <Link href="/vykup-vlasu-pro-nemocne" className="text-burgundy font-medium hover:text-maroon transition">
              Výkup vlasů
            </Link>

            <Link href="/blog" className="text-burgundy font-medium hover:text-maroon transition">
              Blog
            </Link>

            <div className="relative group">
              <Link href="/informace" className="text-burgundy font-medium hover:text-maroon transition flex items-center gap-1">
                Informace
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-heavy rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/informace/jak-nakupovat"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-t-lg"
                >
                  Jak nakupovat
                </Link>
                <Link
                  href="/informace/odeslani-a-stav-objednavky"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Odeslání a stav objednávky
                </Link>
                <Link
                  href="/informace/platba-a-vraceni"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Platba a vrácení
                </Link>
                <Link
                  href="/informace/obchodni-podminky"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Obchodní podmínky
                </Link>
                <Link
                  href="/informace/faq"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  FAQ
                </Link>
                <Link
                  href="/informace/nas-pribeh"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-b-lg"
                >
                  Náš příběh
                </Link>
              </div>
            </div>

            <Link href="/kontakt" className="text-burgundy font-medium hover:text-maroon transition">
              Kontakt
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSearchOverlayOpen(true)}
              className="text-burgundy hover:text-maroon transition p-2"
              aria-label="Hledat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link
              href="/oblibene"
              className="text-burgundy hover:text-maroon transition p-2 relative"
              aria-label="Oblíbené"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <Badge count={favoriteCount} />
            </Link>
            <button className="text-burgundy hover:text-maroon transition p-2 relative" aria-label="Košík">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <Badge count={cartCount} />
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-burgundy text-xl"
              aria-label="Menu"
            >
              ☰
            </button>

            <Link href="/" className="text-xl font-playfair text-burgundy font-bold">
              MÙZA
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOverlayOpen(true)}
                className="text-burgundy p-2"
                aria-label="Hledat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <Link
                href="/oblibene"
                className="text-burgundy p-2 relative"
                aria-label="Oblíbené"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <Badge count={favoriteCount} variant="small" />
              </Link>
              <button className="text-burgundy p-2 relative" aria-label="Košík">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <Badge count={cartCount} variant="small" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-warm-beige py-4 max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col gap-3 text-sm">
              <Link
                href="/"
                className="text-burgundy font-medium py-2 border-b border-warm-beige/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Domů
              </Link>

              <div className="border-b border-warm-beige/50 pb-2">
                <button
                  onClick={() => setVlasySubmenuOpen(!vlasySubmenuOpen)}
                  className="w-full flex items-center justify-between font-semibold text-burgundy py-2"
                >
                  <span>Vlasy k prodloužení</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${vlasySubmenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {vlasySubmenuOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link
                      href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Nebarvené panenské
                    </Link>
                    <Link
                      href="/vlasy-k-prodlouzeni/barvene-blond"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Barvené blond
                    </Link>
                  </div>
                )}
              </div>

              <div className="border-b border-warm-beige/50 pb-2">
                <button
                  onClick={() => setPriceskySubmenuOpen(!priceskySubmenuOpen)}
                  className="w-full flex items-center justify-between font-semibold text-burgundy py-2"
                >
                  <span>Příčesky a paruky</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${priceskySubmenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {priceskySubmenuOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link
                      href="/pricesky-a-paruky/ofiny-z-pravych-vlasu"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Ofiny
                    </Link>
                    <Link
                      href="/pricesky-a-paruky/toupee"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Toupee/tupé
                    </Link>
                    <Link
                      href="/pricesky-a-paruky/vlasove-tresy"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Vlasové tresy
                    </Link>
                    <Link
                      href="/pricesky-a-paruky/prave-paruky"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pravé paruky
                    </Link>
                    <Link
                      href="/pricesky-a-paruky/clip-in-vlasy"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Clip in vlasy
                    </Link>
                    <Link
                      href="/pricesky-a-paruky/clip-in-culik"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Clip in culík
                    </Link>
                  </div>
                )}
              </div>

              <div className="border-b border-warm-beige/50 pb-2">
                <button
                  onClick={() => setPrislusenstviSubmenuOpen(!prislusenstviSubmenuOpen)}
                  className="w-full flex items-center justify-between font-semibold text-burgundy py-2"
                >
                  <span>Příslušenství</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${prislusenstviSubmenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {prislusenstviSubmenuOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link
                      href="/prislusenstvi/tavici-kleste"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tavicí kleště
                    </Link>
                    <Link
                      href="/prislusenstvi/keratin"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Keratin
                    </Link>
                    <Link
                      href="/prislusenstvi/kosmetika"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Kosmetika
                    </Link>
                  </div>
                )}
              </div>

              <div className="border-b border-warm-beige/50 pb-2">
                <button
                  onClick={() => setMetodySubmenuOpen(!metodySubmenuOpen)}
                  className="w-full flex items-center justify-between font-semibold text-burgundy py-2"
                >
                  <span>Metody zakončení</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${metodySubmenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {metodySubmenuOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link
                      href="/metody-zakonceni/keratin"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Keratin / Mikrokeratin
                    </Link>
                    <Link
                      href="/metody-zakonceni/tape-in"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Tape-in (nano tapes)
                    </Link>
                    <Link
                      href="/metody-zakonceni/vlasove-tresy"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Ručně šité vlasové tresy
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/velkoobchod"
                className="text-burgundy font-medium py-2 border-b border-warm-beige/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Velkoobchod
              </Link>

              <Link
                href="/vykup-vlasu-pro-nemocne"
                className="text-burgundy font-medium py-2 border-b border-warm-beige/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Výkup vlasů pro nemocné
              </Link>

              <div className="border-b border-warm-beige/50 pb-2">
                <button
                  onClick={() => setInformaceSubmenuOpen(!informaceSubmenuOpen)}
                  className="w-full flex items-center justify-between font-semibold text-burgundy py-2"
                >
                  <span>Informace</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${informaceSubmenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {informaceSubmenuOpen && (
                  <div className="pl-4 space-y-2 mt-2">
                    <Link
                      href="/informace/jak-nakupovat"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Jak nakupovat
                    </Link>
                    <Link
                      href="/informace/platba-a-vraceni"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Platba a vrácení
                    </Link>
                    <Link
                      href="/informace/faq"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/kontakt"
                className="text-burgundy font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kontakt
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
    <SearchOverlay isOpen={searchOverlayOpen} onClose={() => setSearchOverlayOpen(false)} />
    </>
  );
}
