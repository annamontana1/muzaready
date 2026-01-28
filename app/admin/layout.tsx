'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { queryClient } from '@/lib/queryClient';
import { useOrderNotifications } from '@/lib/hooks/useOrderNotifications';

// Navigation structure
const navigation = {
  main: [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/objednavky', label: 'Objednávky', icon: '🛒' },
    { href: '/admin/marketing', label: 'Marketing', icon: '📈' },
    { href: '/admin/ai-assistant', label: 'AI Assistant', icon: '🤖' },
  ],
  eshop: [
    { href: '/admin/uzivatele', label: 'Zákazníci', icon: '👥' },
    { href: '/admin/reviews', label: 'Recenze', icon: '⭐' },
    { href: '/admin/coupons', label: 'Kupóny', icon: '🎟️' },
    { href: '/admin/velkoobchod-zadosti', label: 'Velkoobchod', icon: '🏢' },
  ],
  sklad: [
    { href: '/admin/sklad', label: 'SKU položky', icon: '📋' },
    { href: '/admin/stock-receive', label: 'Naskladnění', icon: '📥' },
    { href: '/admin/inventory', label: 'Inventury', icon: '📊' },
    { href: '/admin/low-stock-alerts', label: 'Nízký stav', icon: '⚠️' },
    { href: '/admin/price-matrix', label: 'Matice cen', icon: '💰' },
    { href: '/admin/konfigurator-sku', label: 'Konfigurátor', icon: '⚙️' },
    { href: '/admin/warehouse-scanner', label: 'Scanner', icon: '📱' },
  ],
  cms: [
    { href: '/admin/nastaveni', label: 'Nastavení', icon: '⚙️' },
    { href: '/admin/seo', label: 'SEO', icon: '🔍' },
    { href: '/admin/content', label: 'Obsah', icon: '✏️' },
    { href: '/admin/redirects', label: 'Redirecty', icon: '🔗' },
    { href: '/admin/faq', label: 'FAQ', icon: '❓' },
  ],
};

// Order notification badge component
function OrderBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
      {count > 99 ? '99+' : count}
    </span>
  );
}

// Sound toggle button
function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-colors ${
        enabled ? 'text-stone-500 hover:text-stone-700 hover:bg-stone-100' : 'text-stone-300 hover:text-stone-500 hover:bg-stone-100'
      }`}
      title={enabled ? 'Zvuk zapnut' : 'Zvuk vypnut'}
    >
      {enabled ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      )}
    </button>
  );
}

function NavDropdown({
  label,
  items,
  pathname,
  pendingCount
}: {
  label: string;
  items: typeof navigation.main;
  pathname: string;
  pendingCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasActive = items.some(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          hasActive ? 'bg-[#722F37] text-white' : 'text-stone-600 hover:bg-stone-100'
        }`}
      >
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50">
          {items.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const isOrdersLink = item.href === '/admin/objednavky';
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative ${
                  isActive
                    ? 'bg-[#722F37]/10 text-[#722F37] font-medium'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
                {isOrdersLink && pendingCount !== undefined && pendingCount > 0 && (
                  <span className="ml-auto min-w-[20px] h-[20px] flex items-center justify-center px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Inner component that uses the notifications hook (only rendered when authenticated)
function AuthenticatedLayout({
  children,
  adminName,
  onLogout
}: {
  children: React.ReactNode;
  adminName: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Order notifications hook
  const { pendingCount, soundEnabled, toggleSound, markAsSeen } = useOrderNotifications();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Mark as seen when visiting orders page
  useEffect(() => {
    if (pathname.startsWith('/admin/objednavky')) {
      markAsSeen();
    }
  }, [pathname, markAsSeen]);

  // Get current page info
  const allItems = [...navigation.main, ...navigation.eshop, ...navigation.sklad, ...navigation.cms];
  const currentPage = allItems.find(item => pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href)));

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          <div className="h-16 flex items-center justify-between">
            {/* Logo + Main Nav */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/admin" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#722F37] to-[#9B4D56] flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold">M</span>
                </div>
                <span className="font-semibold text-stone-800 hidden sm:block">Mùza Admin</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navigation.main.map(item => {
                  const isActive = pathname === item.href;
                  const isOrdersLink = item.href === '/admin/objednavky';
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#722F37] text-white'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {item.label}
                      {isOrdersLink && <OrderBadge count={pendingCount} />}
                    </Link>
                  );
                })}

                <NavDropdown label="E-shop" items={navigation.eshop} pathname={pathname} />
                <NavDropdown label="Sklad" items={navigation.sklad} pathname={pathname} />
                <NavDropdown label="CMS" items={navigation.cms} pathname={pathname} />
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Sound toggle */}
              <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />

              <Link
                href="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Web
              </Link>

              {/* User menu */}
              <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-stone-700">{adminName}</div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Odhlásit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-stone-600 hover:bg-stone-100 rounded-lg relative"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
                {pendingCount > 0 && !mobileMenuOpen && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white">
            <nav className="max-w-[1600px] mx-auto px-4 py-4 space-y-6">
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Hlavní</div>
                <div className="space-y-1">
                  {navigation.main.map(item => {
                    const isOrdersLink = item.href === '/admin/objednavky';
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                          pathname === item.href ? 'bg-[#722F37] text-white' : 'text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                        {isOrdersLink && pendingCount > 0 && (
                          <span className="ml-auto min-w-[20px] h-[20px] flex items-center justify-center px-1.5 text-[11px] font-bold text-white bg-red-500 rounded-full">
                            {pendingCount > 99 ? '99+' : pendingCount}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {[
                { label: 'E-shop', items: navigation.eshop },
                { label: 'Sklad', items: navigation.sklad },
                { label: 'CMS', items: navigation.cms },
              ].map(section => (
                <div key={section.label}>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{section.label}</div>
                  <div className="space-y-1">
                    {section.items.map(item => {
                      const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                            isActive ? 'bg-[#722F37] text-white' : 'text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <span>{item.icon}</span>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Page Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center gap-3">
            {currentPage && <span className="text-2xl">{currentPage.icon}</span>}
            <h1 className="text-xl lg:text-2xl font-bold text-stone-800">
              {currentPage?.label || 'Admin'}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

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
      if (response.ok) {
        const data = await response.json();
        setAdminName(data.name || data.email || 'Admin');
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
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

  if (isLoginPage) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    );
  }

  if (isAuthenticated === null) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <div className="min-h-screen bg-stone-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#722F37] to-[#9B4D56] flex items-center justify-center">
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <div className="w-6 h-6 border-2 border-[#722F37] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </ToastProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthenticatedLayout adminName={adminName} onLogout={handleLogout}>
          {children}
        </AuthenticatedLayout>
      </ToastProvider>
    </QueryClientProvider>
  );
}
