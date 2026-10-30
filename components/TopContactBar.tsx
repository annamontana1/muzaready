'use client';

import { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { usePreferences } from '@/lib/preferences-context';

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
  addressCity: 'Praha 1',
  promoBannerEnabled: true,
  promoBannerText: null,
  promoBannerLink: null,
};

export default function TopContactBar() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const { currency, setCurrency } = usePreferences();

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const phone = settings.phone || DEFAULT_SETTINGS.phone;
  const phoneWhatsapp = settings.phoneWhatsapp || DEFAULT_SETTINGS.phoneWhatsapp;
  const addressStreet = settings.addressStreet || DEFAULT_SETTINGS.addressStreet;
  const addressCity = settings.addressCity || DEFAULT_SETTINGS.addressCity;

  return (
    <div
      style={{ background: '#330D0D', color: 'rgba(248,244,239,0.9)', borderBottom: '1px solid rgba(246,238,230,0.12)' }}
      className="relative text-center text-[13px] tracking-[0.12em] py-[10px] px-5 font-light"
    >
      <div className="hidden md:flex items-center justify-center gap-6">
        <a
          href={`https://wa.me/${phoneWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 transition"
        >
          {phone}
        </a>
        <span style={{ color: 'rgba(248,244,239,0.3)' }}>·</span>
        <a href="/showroom" className="hover:opacity-80 transition">
          Showroom: {addressStreet}, {addressCity}
        </a>
      </div>
      {/* Jazyk a měna – v hlavičce by se nevešly vedle košíku */}
      <div className="hidden xl:flex items-center gap-3 absolute right-6 top-1/2 -translate-y-1/2">
        <LanguageSwitcher compact className="bg-transparent border-0 text-[13px] tracking-[0.08em] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ivory/70 rounded-sm [&>option]:text-text-dark" />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as 'CZK' | 'EUR')}
          aria-label="Měna"
          className="bg-transparent border-0 text-[13px] tracking-[0.08em] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ivory/70 rounded-sm [&>option]:text-text-dark"
        >
          <option value="CZK">Kč</option>
          <option value="EUR">€</option>
        </select>
      </div>
      <div className="md:hidden">
        <a href="/showroom" className="hover:opacity-80 transition">
          Showroom: {addressStreet}, {addressCity}
        </a>
      </div>
    </div>
  );
}
