'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback } from 'react';
import TopContactBar from './TopContactBar';
import SearchOverlay from './SearchOverlay';
import Badge from './Badge';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vlasySubmenuOpen, setVlasySubmenuOpen] = useState(false);
  const [priceskySubmenuOpen, setPriceskySubmenuOpen] = useState(false);
  const [prislusenstviSubmenuOpen, setPrislusenstviSubmenuOpen] = useState(false);
  const [metodySubmenuOpen, setMetodySubmenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  const { favorites } = useFavorites();
  const { items } = useCart();

  const favoriteCount = favorites.length;
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Memoize search overlay close handler - DEPENDENCY: []
  const handleSearchOverlayClose = useCallback(() => {
    setSearchOverlayOpen(false);
  }, []);

  // Body scroll lock pro mobilní menu - DEPENDENCY: [mobileMenuOpen]
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <TopContactBar />
      <header className="sticky top-0 z-50 bg-white shadow-medium" style={{ top: 'env(safe-area-inset-top)' }}>
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="Domů">
            <Image
              src="/images/logo/muza-logo.png"
              alt="Mùza Hair Shop"
              width={120}
              height={40}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-burgundy font-medium hover:text-maroon transition">
              Domů
            </Link>

            <Link href="/vlasy-k-prodlouzeni" className="text-burgundy font-medium hover:text-maroon transition">
              Vlasy k prodloužení
            </Link>

            <div className="relative group">
              <button className="text-burgundy font-medium hover:text-maroon transition flex items-center gap-1">
                Příčesky a paruky
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="hidden group-hover:block absolute left-0 w-64 bg-white shadow-heavy rounded-lg z-50" style={{ top: '100%', paddingTop: '8px' }}>
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
              <button className="text-burgundy font-medium hover:text-maroon transition flex items-center gap-1">
                Příslušenství
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="hidden group-hover:block absolute left-0 w-64 bg-white shadow-heavy rounded-lg z-50" style={{ top: '100%', paddingTop: '8px' }}>
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
              <button className="text-burgundy font-medium hover:text-maroon transition flex items-center gap-1 cursor-pointer">
                Metody zakončení
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="hidden group-hover:block absolute left-0 w-64 bg-white shadow-heavy rounded-lg z-50" style={{ top: '100%', paddingTop: '8px' }}>
                  <Link
                    href="/metody-zakonceni/vlasy-na-keratin"
                    className="block px-6 py-3 hover:bg-ivory transition rounded-t-lg"
                  >
                    Keratin / Mikrokeratin
                  </Link>
                  <Link
                    href="/metody-zakonceni/pasky-nano-tapes"
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

            <Link href="/kontakt" className="text-burgundy font-medium hover:text-maroon transition">
              Showroom
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
            <Link
              href="/kosik"
              className="text-burgundy hover:text-maroon transition p-2 relative"
              aria-label="Košík"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <Badge count={cartCount} />
            </Link>
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

            <Link href="/" className="flex items-center" aria-label="Domů">
              <Image
                src="/images/logo/muza-logo.png"
                alt="Mùza Hair Shop"
                width={100}
                height={33}
                priority
                className="h-8 w-auto"
              />
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
              <Link
                href="/kosik"
                className="text-burgundy p-2 relative"
                aria-label="Košík"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <Badge count={cartCount} variant="small" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </header>

    {/* Mobile Menu Overlay + Panel */}
    {mobileMenuOpen && (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
          style={{
            height: '100dvh',
            minHeight: '100dvh',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu Panel */}
        <div
          className="fixed left-0 top-0 w-[85%] bg-white z-[70] lg:hidden shadow-2xl"
          style={{
            height: '100dvh',
            minHeight: '100dvh',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobilní navigace"
        >
          {/* Panel Content with Scroll */}
          <div
            className="h-full overflow-y-auto -webkit-overflow-scrolling-touch"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom)',
              overscrollBehavior: 'contain',
            }}
          >
            {/* Header uvnitř panelu */}
            <div className="sticky top-0 bg-white border-b border-warm-beige px-4 py-4 flex items-center justify-between z-10">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Domů"
              >
                <Image
                  src="/images/logo/muza-logo.png"
                  alt="Mùza Hair Shop"
                  width={100}
                  height={33}
                  className="h-8 w-auto"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Zavřít menu"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-3 text-sm px-4 py-4">
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
                      Barvené
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
                      href="/metody-zakonceni/vlasy-na-keratin"
                      className="block text-burgundy py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Keratin / Mikrokeratin
                    </Link>
                    <Link
                      href="/metody-zakonceni/pasky-nano-tapes"
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
                href="/kontakt"
                className="text-burgundy font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Showroom
              </Link>
            </nav>
          </div>
        </div>
      </>
    )}

    <SearchOverlay isOpen={searchOverlayOpen} onClose={handleSearchOverlayClose} />
    </>
  );
}
