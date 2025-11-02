'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-medium">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-playfair text-burgundy font-bold">
            MÙZA HAIR SHOP
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <div className="relative group">
              <button className="text-burgundy font-medium hover:text-maroon transition">
                Vlasy k prodloužení ▼
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-heavy rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link
                  href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                  className="block px-6 py-3 hover:bg-ivory transition"
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
                  className="block px-6 py-3 hover:bg-ivory transition"
                >
                  Vlasové tresy (ručně šité)
                </Link>
              </div>
            </div>

            <Link href="/o-nas" className="text-burgundy font-medium hover:text-maroon transition">
              O nás
            </Link>
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
        <div className="md:hidden flex items-center justify-between py-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-burgundy"
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
          <div className="md:hidden border-t border-warm-beige py-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/vlasy-k-prodlouzeni/nebarvene-panenske"
                className="text-burgundy font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nebarvené panenské vlasy
              </Link>
              <Link
                href="/vlasy-k-prodlouzeni/barvene-blond"
                className="text-burgundy font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Barvené blond vlasy
              </Link>
              <Link
                href="/o-nas"
                className="text-burgundy font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                O nás
              </Link>
              <Link
                href="/kontakt"
                className="text-burgundy font-medium"
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
