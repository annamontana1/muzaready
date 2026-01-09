'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import SmartsuppChat from '@/components/SmartsuppChat';
import { OrganizationSchema, WebSiteSchema } from '@/components/StructuredData';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Admin routes have their own layout - don't show main site header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Regular site pages - show full layout
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <SmartsuppChat />
    </>
  );
}
