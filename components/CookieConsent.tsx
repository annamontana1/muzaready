'use client';

import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
      } catch (e) {
        console.error('Error loading cookie preferences:', e);
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const rejectOptional = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    setShowBanner(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
      {!showSettings ? (
        // Main banner
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🍪 Používáme cookies
              </h3>
              <p className="text-sm text-gray-600">
                Náš web používá cookies pro zajištění základní funkčnosti, zlepšení uživatelského zážitku
                a analytické účely. Přečtěte si více v našich{' '}
                <a href="/cookies" className="text-blue-600 hover:underline" target="_blank">
                  Zásadách cookies
                </a>{' '}
                a{' '}
                <a href="/ochrana-osobnich-udaju" className="text-blue-600 hover:underline" target="_blank">
                  Ochraně osobních údajů
                </a>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Nastavení
              </button>
              <button
                onClick={rejectOptional}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Pouze nezbytné
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Přijmout vše
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Settings panel
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nastavení cookies
            </h3>
            <p className="text-sm text-gray-600">
              Vyberte si, které kategorie cookies chcete povolit. Nezbytné cookies jsou vždy aktivní.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {/* Necessary cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  Nezbytné cookies
                  <span className="ml-2 text-xs text-gray-500">(vždy aktivní)</span>
                </h4>
                <p className="text-sm text-gray-600">
                  Tyto cookies jsou nutné pro základní funkčnost webu (přihlášení, košík).
                  Nelze vypnout.
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                />
              </div>
            </div>

            {/* Analytics cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Analytické cookies</h4>
                <p className="text-sm text-gray-600">
                  Pomáhají nám pochopit, jak návštěvníci používají web, abychom ho mohli vylepšit.
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Marketing cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Marketingové cookies</h4>
                <p className="text-sm text-gray-600">
                  Používají se pro přizpůsobení reklam a měření efektivity kampaní.
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) =>
                    setPreferences({ ...preferences, marketing: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Zpět
            </button>
            <button
              onClick={savePreferences}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Uložit nastavení
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
