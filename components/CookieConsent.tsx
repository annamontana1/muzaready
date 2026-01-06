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
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
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

        // Initialize tracking based on saved preferences
        if (saved.analytics) {
          initializeAnalytics();
        }
        if (saved.marketing) {
          initializeMarketing();
        }
      } catch (e) {
        console.error('Error loading cookie preferences:', e);
        setShowBanner(true);
      }
    }
  }, []);

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

    // Initialize tracking
    if (prefs.analytics) {
      initializeAnalytics();
    }
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
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998] animate-fade-in" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
        <div className="bg-white border-t-4 border-purple-600 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {!showSettings ? (
              /* SIMPLE VIEW */
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">🍪</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Používáme cookies
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Náš web používá cookies pro zajištění funkcí webu, analýzu návštěvnosti
                        a personalizaci obsahu. Kliknutím na <strong>"Přijmout vše"</strong> souhlasíte
                        se všemi cookies. Můžete si také upravit své preference.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm">
                        <Link
                          href="/informace/ochrana-osobnich-udaju"
                          className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                        >
                          Zásady ochrany údajů
                        </Link>
                        <button
                          onClick={() => setShowSettings(true)}
                          className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
                        >
                          Nastavení cookies
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <button
                    onClick={rejectOptional}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Jen nezbytné
                  </button>
                  <button
                    onClick={acceptAll}
                    className="px-6 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-lg"
                  >
                    Přijmout vše
                  </button>
                </div>
              </div>
            ) : (
              /* SETTINGS VIEW */
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-bold text-gray-900">Nastavení cookies</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Zavřít nastavení"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Cookie Categories */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                  {/* Necessary Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🔧</span>
                          <h4 className="font-semibold text-gray-900">Nezbytné cookies</h4>
                          <span className="px-2 py-0.5 bg-gray-600 text-white text-xs font-medium rounded">
                            Vždy aktivní
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Tyto cookies jsou nezbytné pro fungování webu (košík, přihlášení, zabezpečení).
                          Nelze je vypnout.
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="w-5 h-5 rounded cursor-not-allowed opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">📊</span>
                          <h4 className="font-semibold text-gray-900">Analytické cookies</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                          Pomáhají nám pochopit, jak návštěvníci používají web (Google Analytics).
                          Používáme anonymizované IP adresy.
                        </p>
                        <p className="text-xs text-gray-500">
                          Nástroje: Google Analytics 4
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.analytics ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                          role="switch"
                          aria-checked={preferences.analytics}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">📢</span>
                          <h4 className="font-semibold text-gray-900">Marketingové cookies</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                          Používají se pro cílenou reklamu a remarketing na sociálních sítích.
                        </p>
                        <p className="text-xs text-gray-500">
                          Nástroje: Facebook Pixel, Google Ads
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            preferences.marketing ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                          role="switch"
                          aria-checked={preferences.marketing}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={rejectOptional}
                    className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Odmítnout vše
                  </button>
                  <button
                    onClick={savePreferences}
                    className="flex-1 px-6 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors shadow-lg"
                  >
                    Uložit nastavení
                  </button>
                  <button
                    onClick={acceptAll}
                    className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-colors shadow-lg"
                  >
                    Přijmout vše
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Google Analytics initialization
function initializeAnalytics() {
  if (typeof window === 'undefined') return;

  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!GA_ID) {
    console.warn('Google Analytics ID not configured');
    return;
  }

  // Check if already loaded
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
    return;
  }

  // Load GA script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
}

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
