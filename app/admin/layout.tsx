'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { queryClient } from '@/lib/queryClient';
import { useOrderNotifications } from '@/lib/hooks/useOrderNotifications';

// Navigation structure - FLAT LIST
const navigation = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/objednavky', label: 'Objednávky', icon: '🛒', showBadge: true },
  { href: '/admin/produkty', label: 'Produkty', icon: '📦' },
  { href: '/admin/marketing', label: 'Marketing', icon: '📈' },
  { href: '/admin/ai-assistant', label: 'AI Assistant', icon: '🤖' },

  { divider: true, label: 'E-SHOP' },
  { href: '/admin/uzivatele', label: 'Zákazníci', icon: '👥' },
  { href: '/admin/reviews', label: 'Recenze', icon: '⭐' },
  { href: '/admin/coupons', label: 'Kupóny', icon: '🎟️' },
  { href: '/admin/velkoobchod-zadosti', label: 'Velkoobchod', icon: '🏢' },

  { divider: true, label: 'SKLAD' },
  { href: '/admin/sklad', label: 'SKU položky', icon: '📋' },
  { href: '/admin/stock-receive', label: 'Naskladnění', icon: '📥' },
  { href: '/admin/inventory', label: 'Inventury', icon: '📊' },
  { href: '/admin/low-stock-alerts', label: 'Nízký stav', icon: '⚠️' },
  { href: '/admin/price-matrix', label: 'Matice cen', icon: '💰' },
  { href: '/admin/konfigurator-sku', label: 'Konfigurátor', icon: '⚙️' },
  { href: '/admin/warehouse-scanner', label: 'Scanner', icon: '📱' },

  { divider: true, label: 'CMS' },
  { href: '/admin/nastaveni', label: 'Nastavení', icon: '⚙️' },
  { href: '/admin/seo', label: 'SEO', icon: '🔍' },
  { href: '/admin/content', label: 'Obsah', icon: '📄' },
  { href: '/admin/redirects', label: 'Redirecty', icon: '🔗' },
  { href: '/admin/faq', label: 'FAQ', icon: '❓' },
];

// Sidebar navigation item
function SidebarNavItem({
  href,
  label,
  icon,
  badge,
  exact = false,
  pathname,
}: {
  href: string;
  label: string;
  icon: string;
  badge?: number;
  exact?: boolean;
  pathname: string;
}) {
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`
        group relative flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
        ${
          isActive
            ? 'bg-burgundy text-white shadow-md'
            : 'text-stone-700 hover:text-burgundy hover:bg-stone-50'
        }
      `}
    >
      <span className={`text-xl transition-transform duration-150 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto min-w-[22px] h-5 flex items-center justify-center px-2 text-xs font-bold text-white bg-red-500 rounded-full shadow-sm animate-pulse">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-burgundy rounded-r-full" />
      )}
    </Link>
  );
}

// Section divider
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-2">
      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// Authenticated layout with sidebar
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { pendingCount } = useOrderNotifications(soundEnabled);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-72 bg-white border-r border-stone-200 shadow-sm
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-stone-200">
            <div className="w-12 h-12 bg-gradient-to-br from-burgundy to-burgundy-light rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              💎
            </div>
            <div>
              <div className="text-stone-800 font-bold text-lg tracking-tight">Mùza Hair</div>
              <div className="text-stone-500 text-xs font-medium">Admin Panel</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {navigation.map((item, index) => {
              if ('divider' in item && item.divider) {
                return <SectionDivider key={`divider-${index}`} label={item.label} />;
              }

              return (
                <SidebarNavItem
                  key={item.href}
                  href={item.href!}
                  label={item.label}
                  icon={item.icon!}
                  exact={item.exact}
                  pathname={pathname}
                  badge={item.showBadge ? pendingCount : undefined}
                />
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-stone-200 p-4">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-burgundy to-burgundy-light rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-stone-800 text-sm font-semibold truncate">Admin</div>
                <div className="text-stone-500 text-xs truncate">admin@muzahair.cz</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-lg text-sm font-semibold transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Odhlásit se
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Page title - hidden on mobile */}
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-stone-800">
                {navigation.find((item) => !item.divider && item.href === pathname)?.label || 'Dashboard'}
              </h1>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="🔍 Hledat..."
                  className="w-full px-4 py-2 pl-10 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy focus:bg-white transition-all placeholder:text-stone-400"
                  onFocus={(e) => e.target.blur()}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-burgundy transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  soundEnabled
                    ? 'text-burgundy bg-burgundy/5 hover:bg-burgundy/10'
                    : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                }`}
                title={soundEnabled ? '🔊 Zvuk zapnut' : '🔇 Zvuk vypnut'}
              >
                {soundEnabled ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                )}
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {pendingCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* Quick action */}
              <Link
                href="/admin/objednavky"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-burgundy hover:bg-burgundy-light text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <span>➕</span>
                Nová objednávka
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

// Main layout component
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    fetch('/api/admin/me', { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      });
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Načítám...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </ToastProvider>
    </QueryClientProvider>
  );
}
