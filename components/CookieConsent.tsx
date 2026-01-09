'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CONSENT_KEY = 'muzaready_cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  // Fix hydration mismatch - wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Wait for client-side mount

    // Check if user has already made a choice
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const saved: CookieConsent = JSON.parse(consent);

        // Check if consent is expired (1 year)
        const oneYearAgo = Date.now() - (CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        if (saved.timestamp < oneYearAgo) {
          localStorage.removeItem(CONSENT_KEY);
          setShowBanner(true);
          return;
        }

        setPreferences({
          necessary: saved.necessary,
          analytics: saved.analytics,
          marketing: saved.marketing,
        });

        // Update consent for already-loaded analytics (GA4 loaded in layout.tsx)
        if (saved.analytics && window.gtag) {
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
          });
        }

        // Initialize marketing tracking if enabled
        if (saved.marketing) {
          initializeMarketing();
        }
      } catch (e) {
        console.error('Error loading cookie preferences:', e);
        setShowBanner(true);
      }
    }
  }, [mounted]);

  const saveConsent = (prefs: typeof preferences) => {
    const consentData: CookieConsent = {
      ...prefs,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: consentData,
    }));

    // Update consent for already-loaded analytics
    if (prefs.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }

    // Initialize marketing tracking (only if enabled)
    if (prefs.marketing) {
      initializeMarketing();
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
    setShowBanner(false);
  };

  const rejectOptional = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
    setShowBanner(false);
  };

  const savePreferences = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop with modern blur */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Cookie Banner - Modern Elevated Card */}
      <div
        className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-6 lg:left-auto lg:right-6 lg:max-w-lg z-[9999]"
        style={{ animation: 'slideUpBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="relative bg-white md:rounded-3xl shadow-[0_25px_80px_-10px_rgba(0,0,0,0.5)] border-2 border-burgundy overflow-hidden">
          {/* Elegant top accent with gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-burgundy" />

          {/* Subtle corner decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-burgundy/5 to-transparent rounded-bl-full pointer-events-none" />

          <div className="p-6">
            {!showSettings ? (
              /* SIMPLE VIEW - Modern Compact Design */
              <div className="space-y-5">
                {/* Modern minimalist header */}
                <div>
                  <h3 className="text-xl font-playfair font-semibold text-burgundy mb-2">
                    Cookies a soukromí
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Používáme cookies k personalizaci obsahu a analýze návštěvnosti. Vyberte si preferenci nebo přijměte vše.
                  </p>
                </div>

                {/* Modern action buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={acceptAll}
                    className="w-full px-5 py-3 text-sm font-medium text-white bg-burgundy hover:bg-burgundy-dark rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Přijmout vše
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={rejectOptional}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
                    >
                      Jen nezbytné
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-burgundy bg-white hover:bg-burgundy/5 rounded-lg transition-all duration-200 border border-burgundy/30"
                    >
                      Nastavení
                    </button>
                  </div>
                </div>

                {/* Footer link - minimal */}
                <div className="pt-3">
                  <Link
                    href="/informace/ochrana-osobnich-udaju"
                    className="text-xs text-gray-500 hover:text-burgundy transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="group-hover:underline">Zásady ochrany údajů</span>
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ) : (
              /* SETTINGS VIEW - Modern Cards */
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <h3 className="text-xl font-playfair font-semibold text-burgundy">
                      Nastavení cookies
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Vyberte si, které soubory cookies povolit</p>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                    aria-label="Zavřít nastavení"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Cookie Categories - Modern Card Design */}
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {/* Necessary Cookies */}
                  <div className="group relative rounded-xl p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                    <div className="absolute top-2 right-2">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="pr-14">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🔧</span>
                        <div>
                          <h4 className="font-bold text-gray-900">Nezbytné cookies</h4>
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-green-600 text-white text-xs font-medium rounded-full">
                            Vždy aktivní
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mt-2">
                        Zajišťují základní funkce webu - košík, přihlášení, zabezpečení. Bez nich web nemůže fungovat.
                      </p>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className={`group relative rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer ${
                    preferences.analytics
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-blue-200'
                  }`}
                    onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                  >
                    <div className="absolute top-3 right-3">
                      <button
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                          preferences.analytics ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-gray-300'
                        }`}
                        role="switch"
                        aria-checked={preferences.analytics}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                            preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="pr-16">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">📊</span>
                        <div>
                          <h4 className="font-bold text-gray-900">Analytické cookies</h4>
                          <span className="text-xs text-blue-600 font-medium">Google Analytics 4</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mt-2">
                        Pomáhají nám pochopit, jak návštěvníci používají web. Používáme anonymizované IP adresy.
                      </p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className={`group relative rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer ${
                    preferences.marketing
                      ? 'bg-gradient-to-br from-terracotta/10 to-burgundy/10 border-terracotta/40 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-terracotta/40'
                  }`}
                    onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                  >
                    <div className="absolute top-3 right-3">
                      <button
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
                          preferences.marketing ? 'bg-gradient-to-r from-burgundy to-maroon shadow-lg shadow-burgundy/20' : 'bg-gray-300'
                        }`}
                        role="switch"
                        aria-checked={preferences.marketing}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                            preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="pr-16">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">📢</span>
                        <div>
                          <h4 className="font-bold text-gray-900">Marketingové cookies</h4>
                          <span className="text-xs text-terracotta font-medium">Facebook Pixel, Google Ads</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mt-2">
                        Používají se pro cílenou reklamu a remarketing na sociálních sítích.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons - Modern with hover effects */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={rejectOptional}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    Odmítnout vše
                  </button>
                  <button
                    onClick={savePreferences}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    💾 Uložit
                  </button>
                  <button
                    onClick={acceptAll}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-burgundy to-maroon hover:from-burgundy-dark hover:to-burgundy rounded-xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    ✨ Přijmout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUpBounce {
          0% {
            transform: translateY(100%) scale(0.95);
            opacity: 0;
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        /* Smooth scrollbar for settings */
        .space-y-3::-webkit-scrollbar {
          width: 6px;
        }

        .space-y-3::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .space-y-3::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #340C0D, #5D1F20);
          border-radius: 10px;
        }

        .space-y-3::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2A0A0B, #340C0D);
        }
      `}</style>
    </>
  );
}

// NOTE: Google Analytics 4 is now loaded in app/layout.tsx using next/script
// This ensures proper SSR handling and env variable interpolation during build time

// Facebook Pixel initialization
function initializeMarketing() {
  if (typeof window === 'undefined') return;

  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (!FB_PIXEL_ID) {
    console.warn('Facebook Pixel ID not configured');
    return;
  }

  if (window.fbq) return; // Already loaded

  // @ts-ignore
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', FB_PIXEL_ID);
  window.fbq('track', 'PageView');
}

// TypeScript declarations
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}
