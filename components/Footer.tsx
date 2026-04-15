'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface SiteSettings {
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  copyrightText: string | null;
  companyName: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
  instagramUrl: 'https://www.instagram.com/muzahair.cz',
  facebookUrl: 'https://www.facebook.com/muzahair',
  tiktokUrl: null,
  youtubeUrl: null,
  copyrightText: '© {year} Mùza Hair. Všechna práva vyhrazena.',
  companyName: 'Mùza Hair s.r.o.',
};

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const copyrightText = (settings.copyrightText || DEFAULT_SETTINGS.copyrightText || '')
    .replace('{year}', new Date().getFullYear().toString());

  return (
    <footer style={{ background: 'var(--text-dark)', color: 'rgba(248,244,239,0.7)' }} className="pt-[72px] pb-10 px-6 md:px-12">

      {/* Top grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-16 pb-16 border-b border-white/10">

        {/* Brand column */}
        <div>
          <Link href="/" className="block mb-4">
            <span
              className="font-playfair text-2xl font-bold tracking-wider"
              style={{ color: 'var(--ivory)' }}
            >
              MÙZA
            </span>
            <span
              className="text-[10px] tracking-[0.3em] uppercase ml-2 font-light"
              style={{ color: 'rgba(248,244,239,0.5)' }}
            >
              HAIR SHOP
            </span>
          </Link>
          <p className="text-[13px] leading-relaxed max-w-[260px] font-light" style={{ color: 'rgba(248,244,239,0.6)' }}>
            Český výrobce pravých vlasů od roku 2016. Vlastní barvírna v Praze, ruční výroba, 3 úrovně kvality.
          </p>
          <div className="mt-6 text-[13px] space-y-1.5">
            <a
              href="https://wa.me/420728722880"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition hover:opacity-90"
              style={{ color: 'rgba(248,244,239,0.6)' }}
            >
              +420 728 722 880
            </a>
            <Link href="/showroom" className="block transition hover:opacity-90" style={{ color: 'rgba(248,244,239,0.6)' }}>
              Revoluční 8, Praha 1
            </Link>
          </div>
          {/* Social links */}
          <div className="flex gap-4 mt-6">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-90"
                style={{ color: 'rgba(248,244,239,0.5)' }}
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            )}
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:opacity-90"
                style={{ color: 'rgba(248,244,239,0.5)' }}
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* O nás */}
        <div>
          <h3
            className="text-[11px] tracking-[0.16em] uppercase mb-5 font-normal"
            style={{ color: 'var(--ivory)' }}
          >
            O nás
          </h3>
          <ul className="space-y-2.5">
            {[
              { href: '/o-nas', label: 'Náš příběh' },
              { href: '/recenze', label: 'Recenze' },
              { href: '/dodavatel-vlasu-pro-salony', label: 'Pro salony & kadeřníky' },
              { href: '/velkoobchod', label: 'Velkoobchod — registrace' },
              { href: '/vykup-vlasu-pro-nemocne', label: 'Výkup vlasů' },
              { href: '/kontakt', label: 'Kontakt' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[13px] font-light transition hover:opacity-90"
                  style={{ color: 'rgba(248,244,239,0.55)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Informace */}
        <div>
          <h3
            className="text-[11px] tracking-[0.16em] uppercase mb-5 font-normal"
            style={{ color: 'var(--ivory)' }}
          >
            Informace
          </h3>
          <ul className="space-y-2.5">
            {[
              { href: '/informace/jak-nakupovat', label: 'Jak nakupovat' },
              { href: '/informace/odeslani-a-stav-objednavky', label: 'Doprava a platba' },
              { href: '/informace/platba-a-vraceni', label: 'Vracení a výměna' },
              { href: '/informace/odstoupeni-od-smlouvy', label: 'Odstoupení od smlouvy' },
              { href: '/informace/faq', label: 'FAQ' },
              { href: '/informace/obchodni-podminky', label: 'Obchodní podmínky' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[13px] font-light transition hover:opacity-90"
                  style={{ color: 'rgba(248,244,239,0.55)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Produkty */}
        <div>
          <h3
            className="text-[11px] tracking-[0.16em] uppercase mb-5 font-normal"
            style={{ color: 'var(--ivory)' }}
          >
            Produkty
          </h3>
          <ul className="space-y-2.5">
            {[
              { href: '/vlasy-k-prodlouzeni/standard', label: 'Standard vlasy' },
              { href: '/vlasy-k-prodlouzeni/luxe', label: 'Luxe vlasy' },
              { href: '/vlasy-k-prodlouzeni/platinum-edition', label: 'Platinum Edition' },
              { href: '/vlasy-k-prodlouzeni/baby-shades', label: 'Baby Shades — světlé vlasy' },
              { href: '/metody-zakonceni/vlasy-na-keratin', label: 'Vlasy na keratin' },
              { href: '/metody-zakonceni/vlasove-pasky-tape-in', label: 'Vlasové pásky Tape-In' },
              { href: '/ceny-aplikaci', label: 'Ceny aplikace' },
              { href: '/prodlouzeni-vlasu-praha', label: 'Prodloužení vlasů Praha' },
              { href: '/prislusenstvi', label: 'Příslušenství' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-[13px] font-light transition hover:opacity-90"
                  style={{ color: 'rgba(248,244,239,0.55)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px]"
        style={{ color: 'rgba(248,244,239,0.35)' }}
      >
        <p>{copyrightText}</p>
        <div className="flex gap-5">
          <Link href="/informace/obchodni-podminky" className="hover:opacity-70 transition">
            Obchodní podmínky
          </Link>
          <span>·</span>
          <Link href="/informace/ochrana-soukromi" className="hover:opacity-70 transition">
            Ochrana soukromí
          </Link>
          <span>·</span>
          <Link href="/cookies" className="hover:opacity-70 transition">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
