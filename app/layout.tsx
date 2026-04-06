import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import Providers from "./Providers";
import CookieBanner from "@/components/CookieBanner";
import MetaPixel from "@/components/MetaPixel";
import DevelopmentModal from "@/components/DevelopmentModal";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.muzahair.cz'),
  title: "Múza Hair Praha | Pravé vlasy k prodloužení | Keratin, Nanotapes, Weft | Vlastní barvírna",
  description: "Múza Hair Praha — český výrobce pravých vlasů od roku 2016. Vlastní barvírna v Praze. Keratinové pramínky, nanotapes, vlasové tresy weft. Standard, Luxe, Platinum. Showroom Revoluční 8, Praha 1.",
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
    siteName: 'Múza Hair',
    title: 'Múza Hair Praha | Pravé vlasy k prodloužení | Keratin, Nanotapes, Weft',
    description: 'Český výrobce pravých vlasů od roku 2016. Vlastní barvírna v Praze. Keratinové pramínky, nanotapes, vlasové tresy. Showroom Revoluční 8, Praha 1.',
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
    title: 'Múza Hair Praha | Pravé vlasy k prodloužení',
    description: 'Český výrobce pravých vlasů od roku 2016. Vlastní barvírna Praha. Keratin, nanotapes, weft.',
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

        {/* JSON-LD: LocalBusiness + Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'LocalBusiness',
                '@id': 'https://muzahair.cz/#business',
                name: 'Múza Hair',
                url: 'https://muzahair.cz',
                telephone: '+420728722880',
                email: 'muzahaircz@gmail.com',
                priceRange: '4 000 Kč – 11 000 Kč',
                image: 'https://muzahair.cz/og-image.jpg',
                description: 'Český výrobce pravých vlasů k prodloužení od roku 2016. Vlastní barvírna v Praze. Keratinové pramínky, nanotapes, vlasové tresy weft. Standard, Luxe, Platinum.',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: 'Revoluční 8',
                  addressLocality: 'Praha 1',
                  postalCode: '110 00',
                  addressCountry: 'CZ',
                },
                geo: { '@type': 'GeoCoordinates', latitude: 50.0916, longitude: 14.4282 },
                openingHoursSpecification: {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                  opens: '10:00',
                  closes: '20:00',
                },
                sameAs: [
                  'https://www.instagram.com/muzahair.cz',
                  'https://www.facebook.com/muzahair',
                ],
                hasOfferCatalog: {
                  '@type': 'OfferCatalog',
                  name: 'Vlasy k prodloužení',
                  itemListElement: [
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Keratinové prodloužení vlasů Praha' }, price: '4000', priceCurrency: 'CZK' },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Nanotapes prodloužení vlasů Praha' }, price: '55', priceCurrency: 'CZK' },
                    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Weft hollywoodské prodloužení vlasů Praha' }, price: '3800', priceCurrency: 'CZK' },
                  ],
                },
              },
              {
                '@type': 'Organization',
                '@id': 'https://muzahair.cz/#organization',
                name: 'Múza Hair s.r.o.',
                url: 'https://muzahair.cz',
                logo: { '@type': 'ImageObject', url: 'https://muzahair.cz/logo.png' },
                foundingDate: '2016',
                sameAs: ['https://www.instagram.com/muzahair.cz', 'https://www.facebook.com/muzahair'],
              },
              {
                '@type': 'WebSite',
                '@id': 'https://muzahair.cz/#website',
                url: 'https://muzahair.cz',
                name: 'Múza Hair',
                publisher: { '@id': 'https://muzahair.cz/#organization' },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: { '@type': 'EntryPoint', urlTemplate: 'https://muzahair.cz/katalog?q={search_term_string}' },
                  'query-input': 'required name=search_term_string',
                },
              },
            ],
          })}}
        />

        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
          <CookieBanner />
          <MetaPixel />
          <DevelopmentModal />
        </Providers>
      </body>
    </html>
  );
}
