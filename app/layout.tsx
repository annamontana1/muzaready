import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import Providers from "./Providers";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.muzahair.cz'),
  title: "💎 Mùza Hair Praha | Panenské Vlasy & Prodloužení | Vlastní Barvírna 🇨🇿",
  description: "Český výrobce pravých vlasů od 2016 💫 Vlastní barvírna v Praze. Nebarvené panenské, barvené blond, keratin, pásky, tresy. LUXE & Platinum kvalita. Dodání do 48h.",
  keywords: [
    "vlasy k prodloužení",
    "panenské vlasy",
    "prodloužení vlasů Praha",
    "nebarvené vlasy",
    "barvené blond vlasy",
    "keratin vlasy",
    "pásky vlasy",
    "nano tapes",
    "vlasové tresy",
    "clip in vlasy",
    "pravé paruky",
    "ofiny",
    "toupee",
    "český výrobce vlasů",
    "vlastní barvírna Praha",
    "LUXE vlasy",
    "Platinum edition vlasy"
  ],
  authors: [{ name: "Mùza Hair Shop" }],
  creator: "Mùza Hair Shop",
  publisher: "Mùza Hair Shop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: 'https://www.muzahair.cz',
    siteName: 'Mùza Hair',
    title: '💎 Mùza Hair Praha | Panenské Vlasy & Prodloužení',
    description: 'Český výrobce pravých vlasů od 2016 💫 Vlastní barvírna v Praze. LUXE & Platinum kvalita. Dodání do 48h.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mùza Hair - Pravé panenské vlasy k prodloužení',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '💎 Mùza Hair Praha | Panenské Vlasy',
    description: 'Český výrobce pravých vlasů od 2016 💫 Vlastní barvírna v Praze. LUXE & Platinum kvalita.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="cs">
      <body className="antialiased">
        {/* Google Analytics 4 - loaded via consent from CookieConsent component */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics-config"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  // Default consent mode - denies until cookie consent given
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                  });

                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    anonymize_ip: true,
                    cookie_flags: 'SameSite=None;Secure'
                  });
                `,
              }}
            />
          </>
        )}

        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
