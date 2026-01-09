'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { queryClient } from '@/lib/queryClient';

// Menu items configuration
const menuItems = [
  { href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Dashboard' },
  { href: '/admin/warehouse-scanner', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z', label: 'Warehouse Scanner' },
  { divider: true, label: 'E-shop' },
  { href: '/admin/produkty', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', label: 'Produkty' },
  { href: '/admin/objednavky', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', label: 'Objednávky' },
  { href: '/admin/uzivatele', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Uživatelé' },
  { href: '/admin/reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', label: 'Recenze' },
  { href: '/admin/coupons', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z', label: 'Slevové kupóny' },
  { href: '/admin/velkoobchod-zadosti', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: 'Velkoobchod' },
  { divider: true, label: 'Sklad' },
  { href: '/admin/sklad', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4', label: 'Sklad (SKU)' },
  { href: '/admin/stock-receive', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12', label: 'Naskladnění' },
  { href: '/admin/inventory', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', label: 'Inventury' },
  { href: '/admin/low-stock-alerts', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', label: 'Nízký stav' },
  { href: '/admin/price-matrix', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Matice cen' },
  { href: '/admin/konfigurator-sku', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', label: 'Konfigurátor SKU' },
  { divider: true, label: 'CMS' },
  { href: '/admin/seo', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', label: 'SEO Správa' },
  { href: '/admin/content', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', label: 'Obsah stránek' },
  { href: '/admin/redirects', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1', label: 'Přesměrování' },
  { href: '/admin/faq', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'FAQ' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if on login page
  const isLoginPage = pathname === '/admin/login';

  // Check authentication status on mount
  useEffect(() => {
    if (!isLoginPage) {
      checkAuth();
    } else {
      setIsAuthenticated(false);
    }
  }, [pathname, isLoginPage]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me', { credentials: 'include' });
      setIsAuthenticated(response.ok);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Login page - render without sidebar
  if (isLoginPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </QueryClientProvider>
    );
  }

  // Loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600">Načítání...</p>
            </div>
          </div>
        </ToastProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="flex h-screen bg-slate-50">
          {/* Modern Sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'w-64' : 'w-[72px]'
            } bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl`}
          >
            {/* Logo Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="font-semibold text-lg">Mùza Admin</span>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
                </svg>
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
              {menuItems.map((item, index) => {
                if (item.divider) {
                  return sidebarOpen ? (
                    <div key={index} className="pt-4 pb-2">
                      <span className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {item.label}
                      </span>
                    </div>
                  ) : (
                    <div key={index} className="py-2">
                      <div className="border-t border-slate-700/50"></div>
                    </div>
                  );
                }

                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href!));

                return (
                  <Link
                    key={item.href}
                    href={item.href!}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <svg className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'group-hover:text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-700/50 space-y-2">
              <Link
                href="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
                title={!sidebarOpen ? 'Zpět na e-shop' : undefined}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {sidebarOpen && <span className="text-sm font-medium">Zpět na e-shop</span>}
              </Link>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all ${!sidebarOpen ? 'justify-center' : ''}`}
                title={!sidebarOpen ? 'Odhlásit se' : undefined}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                {sidebarOpen && <span className="text-sm font-medium">Odhlásit se</span>}
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {/* Top Bar */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  {menuItems.find(item => !item.divider && (pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href!))))?.label || 'Admin'}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  {new Date().toLocaleDateString('cs-CZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Page Content */}
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
}
