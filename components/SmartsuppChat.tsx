'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

/**
 * Smartsupp Live Chat Widget
 * Free plan: 100 conversations/month, 3 agents, mobile apps
 *
 * Setup instructions:
 * 1. Register at https://www.smartsupp.com/cs/
 * 2. Get your unique key from dashboard
 * 3. Replace 'YOUR_SMARTSUPP_KEY' below with your actual key
 * 4. Customize colors, position, and behavior in Smartsupp dashboard
 */

export default function SmartsuppChat() {
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch - wait for client-side mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Wait for client-side mount

    // Initialize Smartsupp after script loads
    const initSmartsupp = () => {
      const smartsupp_key = process.env.NEXT_PUBLIC_SMARTSUPP_KEY || 'YOUR_SMARTSUPP_KEY';

      if (!window._smartsupp) {
        window._smartsupp = {};
      }

      window._smartsupp.key = smartsupp_key;
      window._smartsupp.cookieDomain = '.muzaready.cz';

      // Optional: Set visitor variables
      window._smartsupp.visitorVariables = {
        language: 'cs',
        currency: 'CZK',
      };
    };

    // Run initialization when DOM is ready
    if (document.readyState === 'complete') {
      initSmartsupp();
    } else {
      window.addEventListener('load', initSmartsupp);
      return () => window.removeEventListener('load', initSmartsupp);
    }
  }, [mounted]);

  return (
    <>
      <Script
        id="smartsupp-chat"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '${process.env.NEXT_PUBLIC_SMARTSUPP_KEY || 'YOUR_SMARTSUPP_KEY'}';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `,
        }}
      />
    </>
  );
}

// TypeScript declaration for Smartsupp global
declare global {
  interface Window {
    _smartsupp?: {
      key?: string;
      cookieDomain?: string;
      visitorVariables?: {
        language?: string;
        currency?: string;
      };
    };
    smartsupp?: any;
  }
}
