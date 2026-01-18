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
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const saved: CookieConsent = JSON.parse(consent);
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

        if (saved.analytics && window.gtag) {
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
          });
        }

        if (saved.marketing) {
          initializeMarketing();
        }
      } catch {
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

    window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: consentData,
    }));

    if (prefs.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
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
      {/* Subtle backdrop */}
      <div
        className="fixed inset-0 bg-burgundy/20 backdrop-blur-[2px] z-[9998] transition-opacity duration-500"
        onClick={() => {}}
      />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 animate-slide-up">
        <div className="max-w-2xl mx-auto">
          <div className="bg-soft-cream border border-warm-beige rounded-2xl shadow-heavy overflow-hidden">

            {!showSettings ? (
              /* SIMPLE VIEW */
              <div className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  {/* Cookie icon */}
                  <div className="hidden sm:flex w-12 h-12 rounded-full bg-ivory items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-playfair text-xl text-burgundy mb-2">
                      Vaše soukromí
                    </h3>
                    <p className="text-sm text-burgundy/70 leading-relaxed mb-5">
                      Používáme cookies pro zlepšení vašeho zážitku z nakupování a analýzu návštěvnosti.
                      Můžete si vybrat, které cookies povolíte.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={acceptAll}
                        className="px-6 py-2.5 bg-burgundy text-white text-sm font-medium rounded-xl hover:bg-burgundy-light transition-colors shadow-light"
                      >
                        Přijmout vše
                      </button>
                      <button
                        onClick={rejectOptional}
                        className="px-6 py-2.5 bg-white text-burgundy text-sm font-medium rounded-xl border border-burgundy/20 hover:bg-ivory transition-colors"
                      >
                        Jen nezbytné
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="px-6 py-2.5 text-burgundy/70 text-sm font-medium rounded-xl hover:text-burgundy hover:bg-ivory transition-colors"
                      >
                        Nastavení
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer link */}
                <div className="mt-5 pt-4 border-t border-warm-beige/50">
                  <Link
                    href="/informace/ochrana-osobnich-udaju"
                    className="text-xs text-burgundy/50 hover:text-burgundy transition-colors"
                  >
                    Zásady ochrany osobních údajů →
                  </Link>
                </div>
              </div>
            ) : (
              /* SETTINGS VIEW */
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-playfair text-xl text-burgundy">
                    Nastavení cookies
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-8 h-8 rounded-full bg-ivory hover:bg-warm-beige flex items-center justify-center transition-colors"
                    aria-label="Zpět"
                  >
                    <svg className="w-4 h-4 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Cookie Categories */}
                <div className="space-y-3 mb-6">
                  {/* Necessary */}
                  <div className="flex items-center justify-between p-4 bg-ivory/50 rounded-xl border border-warm-beige/30">
                    <div>
                      <div className="font-medium text-burgundy text-sm">Nezbytné cookies</div>
                      <div className="text-xs text-burgundy/60 mt-0.5">Základní funkce webu</div>
                    </div>
                    <div className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      Vždy aktivní
                    </div>
                  </div>

                  {/* Analytics */}
                  <button
                    onClick={() => setPreferences({ ...preferences, analytics: !preferences.analytics })}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      preferences.analytics
                        ? 'bg-burgundy/5 border-burgundy/20'
                        : 'bg-white border-warm-beige/50 hover:border-burgundy/20'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-burgundy text-sm">Analytické cookies</div>
                      <div className="text-xs text-burgundy/60 mt-0.5">Pomáhají nám zlepšovat web</div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${
                      preferences.analytics ? 'bg-burgundy' : 'bg-warm-beige'
                    }`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        preferences.analytics ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </button>

                  {/* Marketing */}
                  <button
                    onClick={() => setPreferences({ ...preferences, marketing: !preferences.marketing })}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      preferences.marketing
                        ? 'bg-burgundy/5 border-burgundy/20'
                        : 'bg-white border-warm-beige/50 hover:border-burgundy/20'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-burgundy text-sm">Marketingové cookies</div>
                      <div className="text-xs text-burgundy/60 mt-0.5">Personalizovaná reklama</div>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors relative ${
                      preferences.marketing ? 'bg-burgundy' : 'bg-warm-beige'
                    }`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        preferences.marketing ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </div>
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-warm-beige/50">
                  <button
                    onClick={rejectOptional}
                    className="flex-1 px-5 py-2.5 text-burgundy/70 text-sm font-medium rounded-xl hover:bg-ivory transition-colors"
                  >
                    Odmítnout vše
                  </button>
                  <button
                    onClick={savePreferences}
                    className="flex-1 px-5 py-2.5 bg-burgundy text-white text-sm font-medium rounded-xl hover:bg-burgundy-light transition-colors shadow-light"
                  >
                    Uložit nastavení
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Facebook Pixel initialization
function initializeMarketing() {
  if (typeof window === 'undefined') return;

  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (!FB_PIXEL_ID) return;

  if (window.fbq) return;

  // @ts-expect-error Facebook Pixel script
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

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}
