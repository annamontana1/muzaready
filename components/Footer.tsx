'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';

interface SiteSettings {
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  newsletterEnabled: boolean;
  newsletterTitle: string | null;
  newsletterSubtitle: string | null;
  copyrightText: string | null;
  companyName: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
  instagramUrl: 'https://www.instagram.com/muzahair.cz',
  facebookUrl: 'https://www.facebook.com/muzahair',
  tiktokUrl: null,
  youtubeUrl: null,
  newsletterEnabled: true,
  newsletterTitle: 'Newsletter',
  newsletterSubtitle: 'Získejte slevu 10% na první nákup',
  copyrightText: '© {year} Mùza Hair. Všechna práva vyhrazena.',
  companyName: 'Mùza Hair s.r.o.',
};

export default function Footer() {
  const { t } = useTranslation();
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
    <footer className="bg-burgundy text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Column 1: O Mùza Hair */}
          <div>
            <h3 className="font-playfair text-xl mb-4">{t('footer.about.title')}</h3>
            <ul className="space-y-2 text-sm text-ivory">
              <li>
                <Link href="/o-nas" className="hover:text-white transition">
                  Náš příběh
                </Link>
              </li>
              <li>
                <Link href="/recenze" className="hover:text-white transition">
                  Recenze
                </Link>
              </li>
              <li>
                <Link href="/velkoobchod" className="hover:text-white transition">
                  Velkoobchod
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-white transition">
                  Kontaktujte nás
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Výkup vlasů pro nemocné */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Výkup vlasů pro nemocné</h3>
            <ul className="space-y-2 text-sm text-ivory">
              <li>
                <Link href="/vykup-vlasu-pro-nemocne" className="hover:text-white transition">
                  Výkup vlasů
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Informace */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Informace</h3>
            <ul className="space-y-2 text-sm text-ivory">
              <li>
                <Link href="/informace/jak-nakupovat" className="hover:text-white transition">
                  Jak nakupovat
                </Link>
              </li>
              <li>
                <Link href="/informace/obchodni-podminky" className="hover:text-white transition">
                  Obchodní podmínky
                </Link>
              </li>
              <li>
                <Link href="/informace/platba-a-vraceni" className="hover:text-white transition">
                  Vracení a výměna
                </Link>
              </li>
              <li>
                <Link href="/informace/odeslani-a-stav-objednavky" className="hover:text-white transition">
                  Doprava a platba
                </Link>
              </li>
              <li>
                <Link href="/informace/faq" className="hover:text-white transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Blog */}
          <div>
            <h3 className="font-playfair text-xl mb-4">Blog</h3>
            <ul className="space-y-2 text-sm text-ivory">
              <li>
                <Link href="/metody-zakonceni/vlasy-na-keratin" className="hover:text-white transition">
                  Vlasy na keratin
                </Link>
              </li>
              <li>
                <Link href="/metody-zakonceni/pasky-nano-tapes" className="hover:text-white transition">
                  Tape-in nano pásky
                </Link>
              </li>
              <li>
                <Link href="/metody-zakonceni/vlasove-tresy" className="hover:text-white transition">
                  Vlasové tresy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          {settings.newsletterEnabled && (
            <div>
              <h3 className="font-playfair text-xl mb-4">{settings.newsletterTitle || 'Newsletter'}</h3>
              <p className="text-sm text-ivory mb-4">
                {settings.newsletterSubtitle || 'Získejte slevu 10% na první nákup'}
              </p>
              <form className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Váš email"
                  className="px-4 py-2 rounded bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white"
                />
                <button className="btn-primary">
                  Odebírat
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-ivory">
          <p>{copyrightText}</p>
          <div className="flex gap-4">
            <Link href="/informace/obchodni-podminky" className="hover:text-white transition">
              {t('footer.customer.terms')}
            </Link>
            <span>|</span>
            <Link href="/informace/ochrana-soukromi" className="hover:text-white transition">
              {t('footer.customer.privacy')}
            </Link>
          </div>
          <div className="flex gap-4 text-xl">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                aria-label="Instagram"
              >
                📷
              </a>
            )}
            {settings.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                aria-label="Facebook"
              >
                📘
              </a>
            )}
            {settings.tiktokUrl && (
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                aria-label="TikTok"
              >
                🎵
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                aria-label="YouTube"
              >
                🎬
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
