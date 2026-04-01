'use client';

import { useState, useEffect } from 'react';

interface SiteSettings {
  phone: string | null;
  phoneWhatsapp: string | null;
  addressStreet: string | null;
  addressCity: string | null;
  promoBannerEnabled: boolean;
  promoBannerText: string | null;
  promoBannerLink: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
  phone: '+420 728 722 880',
  phoneWhatsapp: '420728722880',
  addressStreet: 'Revoluční 8',
  addressCity: 'Praha',
  promoBannerEnabled: true,
  promoBannerText: 'Sledujte nás na Instagramu a získejte voucher v hodnotě 500 Kč',
  promoBannerLink: 'https://www.instagram.com/muzahair.cz/',
};

export default function TopContactBar() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const phone = settings.phone || DEFAULT_SETTINGS.phone;
  const phoneHref = `https://wa.me/${settings.phoneWhatsapp || DEFAULT_SETTINGS.phoneWhatsapp}`;
  const address = `${settings.addressStreet || DEFAULT_SETTINGS.addressStreet}, ${settings.addressCity || DEFAULT_SETTINGS.addressCity}`;
  const instagramUrl = settings.promoBannerLink || DEFAULT_SETTINGS.promoBannerLink;
  const instagramText = settings.promoBannerText || DEFAULT_SETTINGS.promoBannerText;

  return (
    <div className="w-full bg-[#e8e1d7] border-b border-black/5">
      {/* Desktop verze */}
      <div className="hidden lg:flex items-center justify-between px-6 h-9 text-sm">
        <a
          href={phoneHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#3a2020] hover:opacity-70 transition"
          aria-label="Napsat na WhatsApp"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{phone}</span>
        </a>

        <a
          href="/kontakt"
          className="flex items-center gap-2 text-[#3a2020] hover:opacity-70 transition"
          aria-label="Showroom adresa"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{address}</span>
        </a>
      </div>

      {/* Mobilní verze */}
      <div className="lg:hidden flex items-center justify-between px-3 h-11 text-[11px]">
        <a
          href={phoneHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[#3a2020] hover:opacity-70 transition"
          aria-label="Napsat na WhatsApp"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>{phone}</span>
        </a>

        <a
          href="/kontakt"
          className="flex items-center gap-1.5 text-[#3a2020] hover:opacity-70 transition"
          aria-label="Showroom adresa"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{address}</span>
        </a>
      </div>
    </div>
  );
}
