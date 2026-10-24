import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://muzahair.cz'),
  title: "Mùza Hair Praha | Pravé vlasy k prodloužení | Vlastní barvírna ČR",
  description: "Český výrobce pravých vlasů od roku 2016. Vlastní barvírna v Praze, ruční výroba. Nebarvené panenské vlasy, barvené blond, keratin, pásky, tresy. LUXE & Platinum kvalita. 4,9★ · 500+ zákaznic.",
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
    url: 'https://muzahair.cz',
    siteName: 'Mùza Hair',
    title: 'Mùza Hair Praha | Pravé vlasy k prodloužení',
    description: 'Český výrobce pravých vlasů od roku 2016. Vlastní barvírna v Praze, ruční výroba v ČR. LUXE & Platinum kvalita. 4,9★ · 500+ zákaznic.',
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
  return (
    <html lang="cs">
      <body className="antialiased">
        <CartProvider>
          <OrganizationSchema />
          <WebSiteSchema />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
