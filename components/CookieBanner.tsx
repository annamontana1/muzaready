'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    timestamp: '',
  });

  useEffect(() => {
    // Check if consent was already given
    const savedConsent = localStorage.getItem('cookie-consent');
    if (!savedConsent) {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consentWithTimestamp));
    setIsVisible(false);

    // Here you would initialize analytics/marketing scripts based on consent
    if (newConsent.analytics) {
      // Initialize Google Analytics, etc.
      console.log('Analytics cookies accepted');
    }
    if (newConsent.marketing) {
      // Initialize Facebook Pixel, etc.
      console.log('Marketing cookies accepted');
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: '',
    });
  };

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: '',
    });
  };

  const saveSettings = () => {
    saveConsent(consent);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={() => {}} />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {!showSettings ? (
            // Main Banner
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🍪</div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">
                    Používáme cookies
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Na našich stránkách používáme cookies pro zajištění správné funkčnosti,
                    analýzu návštěvnosti a personalizaci obsahu. Kliknutím na "Přijmout vše"
                    souhlasíte s jejich používáním.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={acceptAll}
                      className="px-6 py-2.5 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition text-sm"
                    >
                      Přijmout vše
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition text-sm"
                    >
                      Pouze nezbytné
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-2.5 text-gray-600 hover:text-gray-900 transition text-sm font-medium"
                    >
                      Nastavení
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  href="/ochrana-osobnich-udaju"
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Více o zpracování osobních údajů →
                </Link>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Nastavení cookies</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Necessary */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h3 className="font-semibold text-gray-900">Nezbytné cookies</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Tyto cookies jsou nutné pro fungování webu. Nelze je vypnout.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Vždy aktivní</span>
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h3 className="font-semibold text-gray-900">Analytické cookies</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Pomáhají nám pochopit, jak návštěvníci používají web. Anonymní statistiky.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.analytics}
                      onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>

                {/* Marketing */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1 mr-4">
                    <h3 className="font-semibold text-gray-900">Marketingové cookies</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Slouží k zobrazování personalizované reklamy na základě vašich zájmů.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveSettings}
                  className="flex-1 px-6 py-2.5 bg-pink-500 text-white rounded-full font-semibold hover:bg-pink-600 transition text-sm"
                >
                  Uložit nastavení
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition text-sm"
                >
                  Přijmout vše
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
