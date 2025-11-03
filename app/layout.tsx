import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Mùza Hair Praha – pravé vlasy k prodloužení, příčesky, paruky | Český výrobce",
  description: "Český výrobce pravých a panenských vlasů od roku 2016. Vlastní barvírna, ruční výroba. Nebarvené panenské, barvené blond vlasy, keratin, pásky, tresy. Prémiová kvalita Standard, LUXE, Platinum edition.",
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
    siteName: 'Mùza Hair Shop',
    title: 'Mùza Hair Praha – pravé vlasy k prodloužení, příčesky, paruky',
    description: 'Český výrobce pravých a panenských vlasů od roku 2016. Vlastní barvírna, ruční výroba v Praze. Standard, LUXE, Platinum edition.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mùza Hair Shop - Pravé vlasy k prodloužení',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mùza Hair Praha – pravé vlasy k prodloužení',
    description: 'Český výrobce pravých a panenských vlasů. Vlastní barvírna, ruční výroba v Praze.',
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
        <OrganizationSchema />
        <WebSiteSchema />
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
