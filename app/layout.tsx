import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mùza Hair Praha – pravé vlasy k prodloužení, příčesky, paruky",
  description: "Český výrobce pravých a panenských vlasů. Vlastní barvírna, ruční výroba. Nebarvené panenské, barvené blond, keratin, pásky, tresy.",
  keywords: ["vlasy k prodloužení", "panenské vlasy", "prodloužení vlasů Praha", "nebarvené vlasy", "barvené blond vlasy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
