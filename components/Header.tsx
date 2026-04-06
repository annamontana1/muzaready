'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import TopContactBar from './TopContactBar';
import SearchOverlay from './SearchOverlay';
import Badge from './Badge';
import LanguageSwitcher from './LanguageSwitcher';
import { useFavorites } from '@/hooks/useFavorites';
import { useSkuCart } from '@/contexts/SkuCartContext';
import { usePreferences } from '@/lib/preferences-context';
import { useTranslation } from '@/contexts/LanguageContext';

const chevronDown = (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
);

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vlasySubmenuOpen, setVlasySubmenuOpen] = useState(false);
  const [priceskySubmenuOpen, setPriceskySubmenuOpen] = useState(false);
  const [prislusenstviSubmenuOpen, setPrislusenstviSubmenuOpen] = useState(false);
  const [metodySubmenuOpen, setMetodySubmenuOpen] = useState(false);
  const [informaceSubmenuOpen, setInformaceSubmenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);

  const { favorites } = useFavorites();
  const { items } = useSkuCart();
  const { currency, setCurrency } = usePreferences();
  const { t } = useTranslation();

  const favoriteCount = favorites.length;
  const cartCount = items.reduce((total, item) => {
    if (item.saleMode === 'BULK_G') return total + 1;
    return total + item.quantity;
  }, 0);

  useEffect(() => { setMounted(true); }, []);

  const handleSearchOverlayClose = useCallback(() => {
    setSearchOverlayOpen(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen, mounted]);

  const navLinkClass = "text-[12px] tracking-[0.1em] uppercase font-light transition-colors duration-200 hover:text-burgundy";
  const dropdownClass = "hidden group-hover:block absolute left-0 w-56 bg-white shadow-medium border border-beige z-50 rounded-sm";

  const dropdownItem = (href: string, label: string) => (
    <Link
      key={href}
      href={href}
      className="block px-5 py-2.5 text-[12px] tracking-[0.05em] font-light transition-colors hover:bg-ivory"
      style={{ color: 'var(--text-mid)' }}
    >
      {label}
    </Link>
  );

  return (
    <>
      <TopContactBar />
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderColor: 'var(--beige)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-[68px] gap-8">

            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0" aria-label="Domů">
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
            <nav className="flex items-center gap-9" style={{ color: 'var(--text-mid)' }}>

              {/* Vlasy k prodloužení */}
              <div className="relative group">
                <Link href="/vlasy-k-prodlouzeni" className={`${navLinkClass} flex items-center gap-1`} style={{ color: 'var(--text-mid)' }}>
                  Vlasy k prodloužení {chevronDown}
                </Link>
                <div className={dropdownClass} style={{ top: '100%', paddingTop: '4px' }}>
                  {dropdownItem('/vlasy-k-prodlouzeni/nebarvene-panenske', 'Nebarvené panenské')}
                  {dropdownItem('/vlasy-k-prodlouzeni/barvene-vlasy', 'Barvené blond vlasy')}
                  {dropdownItem('/katalog', 'Celý katalog')}
                </div>
              </div>

              {/* Příčesky & paruky */}
              <div className="relative group">
                <button className={`${navLinkClass} flex items-center gap-1`} style={{ color: 'var(--text-mid)' }}>
                  Příčesky & paruky {chevronDown}
                </button>
                <div className={dropdownClass} style={{ top: '100%', paddingTop: '4px' }}>
                  {dropdownItem('/pricesky-a-paruky/ofiny-z-pravych-vlasu', 'Ofiny z pravých vlasů')}
                  {dropdownItem('/pricesky-a-paruky/toupee', 'Toupee / tupé')}
                  {dropdownItem('/pricesky-a-paruky/prave-paruky', 'Pravé paruky')}
                  {dropdownItem('/pricesky-a-paruky/clip-in-vlasy', 'Clip-in vlasy')}
                  {dropdownItem('/pricesky-a-paruky/clip-in-culik', 'Clip-in culík')}
                </div>
              </div>

              {/* Příslušenství */}
              <div className="relative group">
                <button className={`${navLinkClass} flex items-center gap-1`} style={{ color: 'var(--text-mid)' }}>
                  Příslušenství {chevronDown}
                </button>
                <div className={dropdownClass} style={{ top: '100%', paddingTop: '4px' }}>
                  {dropdownItem('/prislusenstvi/tavici-kleste', 'Tavicí kleště')}
                  {dropdownItem('/prislusenstvi/keratin', 'Keratin')}
                  {dropdownItem('/prislusenstvi/pomykadlo', 'Pomykadlo')}
                  {dropdownItem('/prislusenstvi/hrebeny', 'Hřebeny')}
                  {dropdownItem('/prislusenstvi/kosmetika', 'Kosmetika')}
                  {dropdownItem('/prislusenstvi/ostatni', 'Ostatní')}
                </div>
              </div>

              {/* Metody zakončení */}
              <div className="relative group">
                <Link href="/metody-zakonceni" className={`${navLinkClass} flex items-center gap-1`} style={{ color: 'var(--text-mid)' }}>
                  Metody {chevronDown}
                </Link>
                <div className={dropdownClass} style={{ top: '100%', paddingTop: '4px' }}>
                  {dropdownItem('/metody-zakonceni/vlasy-na-keratin', 'Keratin / Mikrokeratin')}
                  {dropdownItem('/metody-zakonceni/vlasove-pasky-tape-in', 'Vlasové pásky Tape-In')}
                  {dropdownItem('/metody-zakonceni/vlasove-tresy', 'Vlasové tresy')}
                  {dropdownItem('/ceny-aplikaci', 'Ceny aplikace')}
                  {dropdownItem('/prodlouzeni-vlasu-praha', 'Prodloužení vlasů Praha')}
                </div>
              </div>

              {/* Informace */}
              <div className="relative group">
                <button className={`${navLinkClass} flex items-center gap-1`} style={{ color: 'var(--text-mid)' }}>
                  Informace {chevronDown}
                </button>
                <div className={dropdownClass} style={{ top: '100%', paddingTop: '4px' }}>
                  {dropdownItem('/o-nas', 'O nás')}
                  {dropdownItem('/informace/jak-nakupovat', 'Jak objednat')}
                  {dropdownItem('/informace/odeslani-a-stav-objednavky', 'Doprava')}
                  {dropdownItem('/informace/platba-a-vraceni', 'Výměna a vrácení')}
                  {dropdownItem('/informace/faq', 'FAQ')}
                  {dropdownItem('/informace/obchodni-podminky', 'Obchodní podmínky')}
                  {dropdownItem('/showroom', 'Showroom Praha')}
                </div>
              </div>

              {/* Velkoobchod */}
              <Link href="/velkoobchod" className={navLinkClass} style={{ color: 'var(--text-mid)' }}>
                Velkoobchod
              </Link>

              {/* Showroom CTA */}
              <Link
                href="/showroom"
                className="text-[11px] tracking-[0.14em] uppercase font-normal px-5 py-[9px] rounded-sm transition-colors duration-200"
                style={{ background: 'var(--burgundy)', color: 'var(--ivory)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--burgundy-light)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--burgundy)')}
              >
                Showroom
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-xs">
                <LanguageSwitcher />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'CZK' | 'EUR')}
                  className="border border-beige rounded px-2 py-1 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-burgundy"
                  style={{ color: 'var(--text-mid)' }}
                >
                  <option value="CZK">Kč</option>
                  <option value="EUR">€</option>
                </select>
              </div>
              <button
                onClick={() => setSearchOverlayOpen(true)}
                className="w-5 h-5 transition-colors hover:text-burgundy"
                style={{ color: 'var(--text-mid)' }}
                aria-label="Hledat"
              >
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <Link
                href="/ucet"
                className="w-5 h-5 transition-colors hover:text-burgundy"
                style={{ color: 'var(--text-mid)' }}
                aria-label="Můj účet"
              >
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
              <Link
                href="/oblibene"
                className="w-5 h-5 transition-colors hover:text-burgundy relative"
                style={{ color: 'var(--text-mid)' }}
                aria-label="Oblíbené"
              >
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <Badge count={favoriteCount} />
              </Link>
              <Link
                href="/kosik"
                className="w-5 h-5 transition-colors hover:text-burgundy relative"
                style={{ color: 'var(--text-mid)' }}
                aria-label="Košík"
              >
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <Badge count={cartCount} />
              </Link>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between h-16">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 transition-colors hover:text-burgundy"
              style={{ color: 'var(--text-mid)' }}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOverlayOpen(true)}
                className="w-5 h-5 transition-colors"
                style={{ color: 'var(--text-mid)' }}
                aria-label="Hledat"
              >
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <Link href="/oblibene" className="w-5 h-5 relative" style={{ color: 'var(--text-mid)' }} aria-label="Oblíbené">
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <Badge count={favoriteCount} variant="small" />
              </Link>
              <Link href="/kosik" className="w-5 h-5 relative" style={{ color: 'var(--text-mid)' }} aria-label="Košík">
                <svg fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <Badge count={cartCount} variant="small" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed left-0 top-0 w-[85%] max-w-sm bg-white z-[70] lg:hidden shadow-2xl"
            style={{ height: '100dvh' }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobilní navigace"
          >
            <div className="h-full overflow-y-auto" style={{ overscrollBehavior: 'contain', paddingBottom: 'env(safe-area-inset-bottom)' }}>

              {/* Panel header */}
              <div className="sticky top-0 bg-white px-5 py-4 flex items-center justify-between border-b border-beige z-10">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
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
                  className="p-2 hover:bg-ivory rounded transition"
                  style={{ color: 'var(--text-soft)' }}
                  aria-label="Zavřít"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav items */}
              <nav className="px-5 py-4 text-sm" style={{ color: 'var(--text-mid)' }}>
                {[
                  {
                    label: 'Vlasy k prodloužení',
                    open: vlasySubmenuOpen,
                    toggle: () => setVlasySubmenuOpen(!vlasySubmenuOpen),
                    items: [
                      { href: '/vlasy-k-prodlouzeni/nebarvene-panenske', label: 'Nebarvené panenské' },
                      { href: '/vlasy-k-prodlouzeni/barvene-vlasy', label: 'Barvené blond vlasy' },
                    ],
                  },
                  {
                    label: 'Příčesky & paruky',
                    open: priceskySubmenuOpen,
                    toggle: () => setPriceskySubmenuOpen(!priceskySubmenuOpen),
                    items: [
                      { href: '/pricesky-a-paruky/ofiny-z-pravych-vlasu', label: 'Ofiny' },
                      { href: '/pricesky-a-paruky/toupee', label: 'Toupee / tupé' },
                      { href: '/pricesky-a-paruky/prave-paruky', label: 'Pravé paruky' },
                      { href: '/pricesky-a-paruky/clip-in-vlasy', label: 'Clip-in vlasy' },
                      { href: '/pricesky-a-paruky/clip-in-culik', label: 'Clip-in culík' },
                    ],
                  },
                  {
                    label: 'Příslušenství',
                    open: prislusenstviSubmenuOpen,
                    toggle: () => setPrislusenstviSubmenuOpen(!prislusenstviSubmenuOpen),
                    items: [
                      { href: '/prislusenstvi/tavici-kleste', label: 'Tavicí kleště' },
                      { href: '/prislusenstvi/keratin', label: 'Keratin' },
                      { href: '/prislusenstvi/kosmetika', label: 'Kosmetika' },
                    ],
                  },
                  {
                    label: 'Metody zakončení',
                    href: '/metody-zakonceni',
                    open: metodySubmenuOpen,
                    toggle: () => setMetodySubmenuOpen(!metodySubmenuOpen),
                    items: [
                      { href: '/metody-zakonceni/vlasy-na-keratin', label: 'Keratin / Mikrokeratin' },
                      { href: '/metody-zakonceni/vlasove-pasky-tape-in', label: 'Vlasové pásky Tape-In' },
                      { href: '/metody-zakonceni/vlasove-tresy', label: 'Ručně šité tresy' },
                      { href: '/ceny-aplikaci', label: 'Ceny aplikace' },
                      { href: '/prodlouzeni-vlasu-praha', label: 'Prodloužení vlasů Praha' },
                    ],
                  },
                  {
                    label: 'Informace',
                    open: informaceSubmenuOpen,
                    toggle: () => setInformaceSubmenuOpen(!informaceSubmenuOpen),
                    items: [
                      { href: '/o-nas', label: 'O nás' },
                      { href: '/informace/jak-nakupovat', label: 'Jak objednat' },
                      { href: '/informace/odeslani-a-stav-objednavky', label: 'Doprava' },
                      { href: '/informace/platba-a-vraceni', label: 'Výměna a vrácení' },
                      { href: '/informace/faq', label: 'FAQ' },
                    ],
                  },
                ].map(({ label, href: sectionHref, open, toggle, items }) => (
                  <div key={label} className="border-b border-beige/50">
                    <div className="flex items-center justify-between py-3">
                      {sectionHref ? (
                        <Link
                          href={sectionHref}
                          className="text-[13px] font-light flex-1"
                          style={{ color: 'var(--text-mid)' }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {label}
                        </Link>
                      ) : (
                        <span className="text-[13px] font-light flex-1" style={{ color: 'var(--text-mid)' }}>{label}</span>
                      )}
                      <button
                        onClick={toggle}
                        className="p-1"
                        style={{ color: 'var(--text-mid)' }}
                      >
                        <svg
                          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    {open && (
                      <div className="pb-3 pl-4 space-y-2">
                        {items.map(({ href, label: l }) => (
                          <Link
                            key={href}
                            href={href}
                            className="block py-1 text-[13px] font-light transition-colors hover:text-burgundy"
                            style={{ color: 'var(--text-soft)' }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {l}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Link
                  href="/velkoobchod"
                  className="block py-3 text-[13px] font-light border-b border-beige/50"
                  style={{ color: 'var(--text-mid)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Velkoobchod
                </Link>
                <Link
                  href="/showroom"
                  className="block py-3 text-[13px] font-light"
                  style={{ color: 'var(--text-mid)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Showroom Praha
                </Link>

                {/* Currency */}
                <div className="mt-4 flex items-center gap-3">
                  <LanguageSwitcher />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'CZK' | 'EUR')}
                    className="border border-beige rounded px-2 py-1 bg-white text-xs focus:outline-none"
                    style={{ color: 'var(--text-mid)' }}
                  >
                    <option value="CZK">Kč</option>
                    <option value="EUR">€</option>
                  </select>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      <SearchOverlay isOpen={searchOverlayOpen} onClose={handleSearchOverlayClose} />
    </>
  );
}
