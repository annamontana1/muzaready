'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-medium">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-playfair text-burgundy font-bold">
            MÙZA
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/o-nas" className="text-burgundy font-medium hover:text-maroon transition">
              O nás
            </Link>

            <div className="relative group">
              <button className="text-burgundy font-medium hover:text-maroon transition">
                Vlasy k prodloužení ▼
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-heavy rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-t-lg"
                >
                  Nebarvené panenské vlasy
                </Link>
                <Link
                  href="/vlasy-k-prodlouzeni/barvene-blond"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Barvené blond vlasy
                </Link>
                <Link
                  href="/vlasy-k-prodlouzeni/vlasy-na-keratin"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Vlasy na keratin
                </Link>
                <Link
                  href="/vlasy-k-prodlouzeni/pasky-nano-tapes"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Pásky (nano tapes)
                </Link>
                <Link
                  href="/vlasy-k-prodlouzeni/vlasove-tresy"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-b-lg"
                >
                  Vlasové tresy (ručně šité)
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="text-burgundy font-medium hover:text-maroon transition">
                Příčesky a paruky ▼
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-heavy rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link
                  href="/pricesky-a-paruky/clip-in-ofiny"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-t-lg"
                >
                  Clip-in ofiny
                </Link>
                <Link
                  href="/pricesky-a-paruky/clip-in-culiky"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Clip-in culíky
                </Link>
                <Link
                  href="/pricesky-a-paruky/pricesek-na-temeno"
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Příčešek na temeno (toupee)
                </Link>
                <Link
                  href="/pricesky-a-paruky/paruky-na-miru"
                  className="block px-6 py-3 hover:bg-ivory transition rounded-b-lg"
                >
                  Paruky na míru
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className="text-burgundy font-medium hover:text-maroon transition">
                Příslušenství ▼
              </button>
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

            <Link href="/cenik" className="text-burgundy font-medium hover:text-maroon transition">
              Ceník
            </Link>

            <Link href="/velkoobchod" className="text-burgundy font-medium hover:text-maroon transition">
              Velkoobchod
            </Link>

            <Link href="/vykup-vlasu-pro-nemocne" className="text-burgundy font-medium hover:text-maroon transition">
              Výkup vlasů
            </Link>

            <div className="relative group">
              <button className="text-burgundy font-medium hover:text-maroon transition">
                Informace ▼
              </button>
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
          <div className="flex items-center gap-4">
            <button className="text-burgundy hover:text-maroon transition" aria-label="Hledat">
              🔍
            </button>
            <button className="text-burgundy hover:text-maroon transition" aria-label="Oblíbené">
              ❤️ <span className="text-xs">(0)</span>
            </button>
            <button className="text-burgundy hover:text-maroon transition" aria-label="Košík">
              🛒 <span className="text-xs">(0)</span>
            </button>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between py-4">
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

          <button className="text-burgundy" aria-label="Košík">
            🛒
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-warm-beige py-4 max-h-[70vh] overflow-y-auto">
            <nav className="flex flex-col gap-3 text-sm">
              <Link
                href="/o-nas"
                className="text-burgundy font-medium py-2 border-b border-warm-beige/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                O nás
              </Link>

              <div className="border-b border-warm-beige/50 pb-2">
                <div className="font-semibold text-burgundy mb-2">Vlasy k prodloužení</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Nebarvené panenské
                  </Link>
                  <Link
                    href="/vlasy-k-prodlouzeni/barvene-blond"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Barvené blond
                  </Link>
                  <Link
                    href="/vlasy-k-prodlouzeni/vlasy-na-keratin"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Vlasy na keratin
                  </Link>
                  <Link
                    href="/vlasy-k-prodlouzeni/pasky-nano-tapes"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pásky (nano tapes)
                  </Link>
                  <Link
                    href="/vlasy-k-prodlouzeni/vlasove-tresy"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Vlasové tresy
                  </Link>
                </div>
              </div>

              <div className="border-b border-warm-beige/50 pb-2">
                <div className="font-semibold text-burgundy mb-2">Příčesky a paruky</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/pricesky-a-paruky/clip-in-ofiny"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Clip-in ofiny
                  </Link>
                  <Link
                    href="/pricesky-a-paruky/clip-in-culiky"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Clip-in culíky
                  </Link>
                  <Link
                    href="/pricesky-a-paruky/pricesek-na-temeno"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Příčešek na temeno
                  </Link>
                  <Link
                    href="/pricesky-a-paruky/paruky-na-miru"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Paruky na míru
                  </Link>
                </div>
              </div>

              <div className="border-b border-warm-beige/50 pb-2">
                <div className="font-semibold text-burgundy mb-2">Příslušenství</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/prislusenstvi/tavici-kleste"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tavicí kleště
                  </Link>
                  <Link
                    href="/prislusenstvi/keratin"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Keratin
                  </Link>
                  <Link
                    href="/prislusenstvi/kosmetika"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Kosmetika
                  </Link>
                </div>
              </div>

              <Link
                href="/cenik"
                className="text-burgundy font-medium py-2 border-b border-warm-beige/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ceník
              </Link>

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
                <div className="font-semibold text-burgundy mb-2">Informace</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/informace/jak-nakupovat"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Jak nakupovat
                  </Link>
                  <Link
                    href="/informace/platba-a-vraceni"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Platba a vrácení
                  </Link>
                  <Link
                    href="/informace/faq"
                    className="block text-burgundy"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </div>
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
  );
}
