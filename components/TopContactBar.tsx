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

  if (!settings.promoBannerEnabled) {
    return null;
  }

  return (
    <div className="w-full bg-[#e8e1d7] border-b border-black/5">
      {/* Desktop verze */}
      <div className="hidden lg:flex items-center justify-between px-6 h-9 text-sm">
        {/* Levá strana: Telefon */}
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

        {/* Střed: Instagram výzva */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#3a2020] font-semibold hover:opacity-70 transition"
          aria-label="Sledujte nás na Instagramu"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <span>{instagramText}</span>
        </a>

        {/* Pravá strana: Adresa */}
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
        {/* Levá strana: Telefon (pouze ikona) */}
        <a
          href={phoneHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-[#3a2020] hover:opacity-70 transition"
          aria-label="Napsat na WhatsApp"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>

        {/* Střed: Instagram výzva */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[#3a2020] font-semibold hover:opacity-70 transition text-center flex-1 justify-center px-2"
          aria-label="Sledujte nás na Instagramu"
        >
          <span className="whitespace-nowrap">Sledujte nás na</span>
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          <span className="whitespace-nowrap">a voucher 500 Kč</span>
        </a>

        {/* Pravá strana: Adresa (pouze ikona) */}
        <a
          href="/kontakt"
          className="flex items-center text-[#3a2020] hover:opacity-70 transition"
          aria-label="Showroom adresa"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
