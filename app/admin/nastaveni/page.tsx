'use client';

import { useState, useEffect } from 'react';

interface SiteSettings {
  id: string;
  // Kontakty
  phone: string | null;
  phoneWhatsapp: string | null;
  email: string | null;
  emailSupport: string | null;
  // Showroom
  addressStreet: string | null;
  addressCity: string | null;
  addressZip: string | null;
  addressMapUrl: string | null;
  openingHours: string | null;
  // Sociální sítě
  instagramUrl: string | null;
  instagramHandle: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
  pinterestUrl: string | null;
  // Promo banner
  promoBannerEnabled: boolean;
  promoBannerText: string | null;
  promoBannerLink: string | null;
  // Newsletter
  newsletterEnabled: boolean;
  newsletterTitle: string | null;
  newsletterSubtitle: string | null;
  // Firma
  companyName: string | null;
  companyIco: string | null;
  companyDic: string | null;
  companyStreet: string | null;
  companyCity: string | null;
  companyZip: string | null;
  bankName: string | null;
  bankAccount: string | null;
  bankIban: string | null;
  bankSwift: string | null;
  // Vzhled
  logoUrl: string | null;
  logoAlt: string | null;
  faviconUrl: string | null;
  copyrightText: string | null;
  // Doprava
  freeShippingThreshold: number | null;
  shippingCostCzk: number | null;
  shippingCostEur: number | null;
  // Analytika
  gaTrackingId: string | null;
  fbPixelId: string | null;
  hotjarId: string | null;
  // Meta
  updatedAt: string;
}

type PanelType = 'contacts' | 'social' | 'banner' | 'newsletter' | 'company' | 'shipping' | 'analytics' | null;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) throw new Error('Chyba při načítání');
      const data = await response.json();
      setSettings(data);
      setFormData(data);
    } catch (err) {
      setError('Nepodařilo se načíst nastavení');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (data: Partial<SiteSettings>) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Chyba při ukládání');
      const updated = await response.json();
      setSettings(updated);
      setFormData(updated);
      setSuccess('Uloženo');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Nepodařilo se uložit');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (field: 'promoBannerEnabled' | 'newsletterEnabled') => {
    const newValue = !settings?.[field];
    await saveSettings({ [field]: newValue });
  };

  const handleSavePanel = async () => {
    await saveSettings(formData);
    setActivePanel(null);
  };

  const updateFormField = (field: keyof SiteSettings, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nastavení webu</h1>
          <p className="text-gray-500 mt-1">Spravujte globální nastavení e-shopu</p>
        </div>
        <div className="flex items-center gap-3">
          {success && (
            <span className="text-green-600 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </span>
          )}
          {error && <span className="text-red-600 text-sm">{error}</span>}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Kontakty */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Kontakty</h3>
          <div className="space-y-1 text-sm text-gray-600 mb-4">
            <p>{settings?.phone || '—'}</p>
            <p>{settings?.email || '—'}</p>
            <p>{settings?.addressCity ? `${settings.addressStreet}, ${settings.addressCity}` : '—'}</p>
          </div>
          <button
            onClick={() => { setActivePanel('contacts'); setFormData(settings || {}); }}
            className="text-sm text-burgundy font-medium hover:underline"
          >
            Upravit
          </button>
        </div>

        {/* Sociální sítě */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-pink-50 rounded-lg">
              <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Sociální sítě</h3>
          <div className="flex gap-3 mb-4">
            {settings?.instagramUrl && <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs">IG</div>}
            {settings?.facebookUrl && <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">FB</div>}
            {settings?.tiktokUrl && <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">TT</div>}
            {settings?.youtubeUrl && <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs">YT</div>}
            {!settings?.instagramUrl && !settings?.facebookUrl && <span className="text-gray-400 text-sm">Žádné sítě</span>}
          </div>
          <button
            onClick={() => { setActivePanel('social'); setFormData(settings || {}); }}
            className="text-sm text-burgundy font-medium hover:underline"
          >
            Upravit
          </button>
        </div>

        {/* Promo Banner - Full width */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <button
              onClick={() => handleToggle('promoBannerEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.promoBannerEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.promoBannerEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Promo Banner</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{settings?.promoBannerText || '—'}</p>
          {settings?.promoBannerEnabled && settings?.promoBannerText && (
            <div className="bg-[#e8e1d7] rounded-lg p-2 mb-4 text-xs text-center text-[#3a2020]">
              {settings.promoBannerText}
            </div>
          )}
          <button
            onClick={() => { setActivePanel('banner'); setFormData(settings || {}); }}
            className="text-sm text-burgundy font-medium hover:underline"
          >
            Upravit
          </button>
        </div>

        {/* Firemní údaje */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Firemní údaje</h3>
          <div className="space-y-1 text-sm text-gray-600 mb-4">
            <p className="font-medium">{settings?.companyName || '—'}</p>
            <p>IČO: {settings?.companyIco || '—'}</p>
            <p>DIČ: {settings?.companyDic || '—'}</p>
          </div>
          <button
            onClick={() => { setActivePanel('company'); setFormData(settings || {}); }}
            className="text-sm text-burgundy font-medium hover:underline"
          >
            Upravit
          </button>
        </div>

        {/* Doprava */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Doprava</h3>
          <div className="space-y-1 text-sm text-gray-600 mb-4">
            <p>Doprava zdarma od: <span className="font-medium">{settings?.freeShippingThreshold?.toLocaleString()} Kč</span></p>
            <p>Standardní: <span className="font-medium">{settings?.shippingCostCzk} Kč</span></p>
          </div>
          <button
            onClick={() => { setActivePanel('shipping'); setFormData(settings || {}); }}
            className="text-sm text-burgundy font-medium hover:underline"
          >
            Upravit
          </button>
        </div>

        {/* Newsletter */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <button
              onClick={() => handleToggle('newsletterEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.newsletterEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.newsletterEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Newsletter</h3>
          <p className="text-sm text-gray-600 mb-4">{settings?.newsletterSubtitle || '—'}</p>
          <button
            onClick={() => { setActivePanel('newsletter'); setFormData(settings || {}); }}
            className="text-sm text-burgundy font-medium hover:underline"
          >
            Upravit
          </button>
        </div>

        {/* Analytika */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Analytika</h3>
          <div className="space-y-1 text-sm text-gray-600 mb-4">
            <p className="flex items-center gap-2">
              GA: {settings?.gaTrackingId ? <span className="text-green-600">Aktivní</span> : <span className="text-gray-400">—</span>}
            </p>
            <p className="flex items-center gap-2">
              FB Pixel: {settings?.fbPixelId ? <span className="text-green-600">Aktivní</span> : <span className="text-gray-400">—</span>}
            </p>
          </div>
          <button
            onClick={() => { setActivePanel('analytics'); setFormData(settings || {}); }}
            className="text-sm text-burgundy font-medium hover:underline"
          >
            Upravit
          </button>
        </div>
      </div>

      {/* Slide-over Panel */}
      {activePanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setActivePanel(null)}
          />
          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setActivePanel(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Zpět
              </button>
              <h2 className="font-semibold text-gray-900">
                {activePanel === 'contacts' && 'Kontakty'}
                {activePanel === 'social' && 'Sociální sítě'}
                {activePanel === 'banner' && 'Promo Banner'}
                {activePanel === 'newsletter' && 'Newsletter'}
                {activePanel === 'company' && 'Firemní údaje'}
                {activePanel === 'shipping' && 'Doprava'}
                {activePanel === 'analytics' && 'Analytika'}
              </h2>
              <div className="w-16"></div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contacts Form */}
              {activePanel === 'contacts' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => updateFormField('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      placeholder="+420 728 722 880"
                    />
                    <p className="text-xs text-gray-500 mt-1">Zobrazí se v horní liště</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={formData.phoneWhatsapp || ''}
                      onChange={(e) => updateFormField('phoneWhatsapp', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      placeholder="420728722880"
                    />
                    <p className="text-xs text-gray-500 mt-1">Číslo bez "+" pro wa.me odkaz</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => updateFormField('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email podpora</label>
                      <input
                        type="email"
                        value={formData.emailSupport || ''}
                        onChange={(e) => updateFormField('emailSupport', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                  </div>
                  <hr />
                  <h3 className="font-medium text-gray-900">Showroom</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ulice</label>
                    <input
                      type="text"
                      value={formData.addressStreet || ''}
                      onChange={(e) => updateFormField('addressStreet', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Město</label>
                      <input
                        type="text"
                        value={formData.addressCity || ''}
                        onChange={(e) => updateFormField('addressCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PSČ</label>
                      <input
                        type="text"
                        value={formData.addressZip || ''}
                        onChange={(e) => updateFormField('addressZip', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                    <input
                      type="text"
                      value={formData.addressMapUrl || ''}
                      onChange={(e) => updateFormField('addressMapUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Otevírací doba</label>
                    <textarea
                      value={formData.openingHours || ''}
                      onChange={(e) => updateFormField('openingHours', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      placeholder="Po-Pá: 10:00 - 18:00&#10;So: 10:00 - 14:00&#10;Ne: Zavřeno"
                    />
                  </div>
                </>
              )}

              {/* Social Form */}
              {activePanel === 'social' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={formData.instagramUrl || ''}
                      onChange={(e) => updateFormField('instagramUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Handle</label>
                    <input
                      type="text"
                      value={formData.instagramHandle || ''}
                      onChange={(e) => updateFormField('instagramHandle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      placeholder="@muzahair.cz"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                    <input
                      type="url"
                      value={formData.facebookUrl || ''}
                      onChange={(e) => updateFormField('facebookUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
                    <input
                      type="url"
                      value={formData.tiktokUrl || ''}
                      onChange={(e) => updateFormField('tiktokUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                    <input
                      type="url"
                      value={formData.youtubeUrl || ''}
                      onChange={(e) => updateFormField('youtubeUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pinterest URL</label>
                    <input
                      type="url"
                      value={formData.pinterestUrl || ''}
                      onChange={(e) => updateFormField('pinterestUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                </>
              )}

              {/* Banner Form */}
              {activePanel === 'banner' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text banneru</label>
                    <input
                      type="text"
                      value={formData.promoBannerText || ''}
                      onChange={(e) => updateFormField('promoBannerText', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Odkaz (URL)</label>
                    <input
                      type="url"
                      value={formData.promoBannerLink || ''}
                      onChange={(e) => updateFormField('promoBannerLink', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  {formData.promoBannerText && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Náhled</label>
                      <div className="bg-[#e8e1d7] rounded-lg p-3 text-center text-[#3a2020] text-sm">
                        {formData.promoBannerText}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Newsletter Form */}
              {activePanel === 'newsletter' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titulek</label>
                    <input
                      type="text"
                      value={formData.newsletterTitle || ''}
                      onChange={(e) => updateFormField('newsletterTitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Popis</label>
                    <input
                      type="text"
                      value={formData.newsletterSubtitle || ''}
                      onChange={(e) => updateFormField('newsletterSubtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                </>
              )}

              {/* Company Form */}
              {activePanel === 'company' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Název společnosti</label>
                    <input
                      type="text"
                      value={formData.companyName || ''}
                      onChange={(e) => updateFormField('companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IČO</label>
                      <input
                        type="text"
                        value={formData.companyIco || ''}
                        onChange={(e) => updateFormField('companyIco', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DIČ</label>
                      <input
                        type="text"
                        value={formData.companyDic || ''}
                        onChange={(e) => updateFormField('companyDic', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                  </div>
                  <hr />
                  <h3 className="font-medium text-gray-900">Sídlo firmy</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ulice</label>
                    <input
                      type="text"
                      value={formData.companyStreet || ''}
                      onChange={(e) => updateFormField('companyStreet', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Město</label>
                      <input
                        type="text"
                        value={formData.companyCity || ''}
                        onChange={(e) => updateFormField('companyCity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PSČ</label>
                      <input
                        type="text"
                        value={formData.companyZip || ''}
                        onChange={(e) => updateFormField('companyZip', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                  </div>
                  <hr />
                  <h3 className="font-medium text-gray-900">Bankovní spojení</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Název banky</label>
                      <input
                        type="text"
                        value={formData.bankName || ''}
                        onChange={(e) => updateFormField('bankName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Číslo účtu</label>
                      <input
                        type="text"
                        value={formData.bankAccount || ''}
                        onChange={(e) => updateFormField('bankAccount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                      <input
                        type="text"
                        value={formData.bankIban || ''}
                        onChange={(e) => updateFormField('bankIban', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT</label>
                      <input
                        type="text"
                        value={formData.bankSwift || ''}
                        onChange={(e) => updateFormField('bankSwift', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                    Tyto údaje se automaticky vyplní na fakturách
                  </div>
                </>
              )}

              {/* Shipping Form */}
              {activePanel === 'shipping' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doprava zdarma od (Kč)</label>
                    <input
                      type="number"
                      value={formData.freeShippingThreshold || ''}
                      onChange={(e) => updateFormField('freeShippingThreshold', parseInt(e.target.value) || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cena dopravy (Kč)</label>
                      <input
                        type="number"
                        value={formData.shippingCostCzk || ''}
                        onChange={(e) => updateFormField('shippingCostCzk', parseInt(e.target.value) || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cena dopravy (EUR)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.shippingCostEur || ''}
                        onChange={(e) => updateFormField('shippingCostEur', parseFloat(e.target.value) || null)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                    Zobrazí se v košíku a na stránce dopravy
                  </div>
                </>
              )}

              {/* Analytics Form */}
              {activePanel === 'analytics' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                    <input
                      type="text"
                      value={formData.gaTrackingId || ''}
                      onChange={(e) => updateFormField('gaTrackingId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                    <input
                      type="text"
                      value={formData.fbPixelId || ''}
                      onChange={(e) => updateFormField('fbPixelId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotjar ID</label>
                    <input
                      type="text"
                      value={formData.hotjarId || ''}
                      onChange={(e) => updateFormField('hotjarId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy focus:border-burgundy"
                    />
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 text-sm text-yellow-700">
                    Změny se projeví po obnovení stránky
                  </div>
                </>
              )}

              {/* Save Button */}
              <div className="pt-4">
                <button
                  onClick={handleSavePanel}
                  disabled={saving}
                  className="w-full bg-burgundy text-white py-3 rounded-lg font-medium hover:bg-maroon transition disabled:opacity-50"
                >
                  {saving ? 'Ukládám...' : 'Uložit změny'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
