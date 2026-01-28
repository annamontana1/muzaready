'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { queryClient } from '@/lib/queryClient';
import { useOrderNotifications } from '@/lib/hooks/useOrderNotifications';

// Navigation structure
const navigation = {
  main: [
    { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
    { href: '/admin/objednavky', label: 'Objednávky', icon: '🛒' },
    { href: '/admin/marketing', label: 'Marketing', icon: '📈' },
    { href: '/admin/ai-assistant', label: 'AI Assistant', icon: '🤖' },
  ],
  eshop: {
    label: 'E-shop',
    icon: '🛍️',
    items: [
      { href: '/admin/produkty', label: 'Produkty', icon: '📦' },
      { href: '/admin/uzivatele', label: 'Zákazníci', icon: '👥' },
      { href: '/admin/reviews', label: 'Recenze', icon: '⭐' },
      { href: '/admin/coupons', label: 'Kupóny', icon: '🎟️' },
      { href: '/admin/velkoobchod-zadosti', label: 'Velkoobchod', icon: '🏢' },
    ],
  },
  sklad: {
    label: 'Sklad',
    icon: '📦',
    items: [
      { href: '/admin/sklad', label: 'SKU položky', icon: '📋' },
      { href: '/admin/stock-receive', label: 'Naskladnění', icon: '📥' },
      { href: '/admin/inventory', label: 'Inventury', icon: '📊' },
      { href: '/admin/low-stock-alerts', label: 'Nízký stav', icon: '⚠️' },
      { href: '/admin/price-matrix', label: 'Matice cen', icon: '💰' },
      { href: '/admin/konfigurator-sku', label: 'Konfigurátor', icon: '⚙️' },
      { href: '/admin/warehouse-scanner', label: 'Scanner', icon: '📱' },
    ],
  },
  cms: {
    label: 'CMS',
    icon: '✏️',
    items: [
      { href: '/admin/nastaveni', label: 'Nastavení', icon: '⚙️' },
      { href: '/admin/seo', label: 'SEO', icon: '🔍' },
      { href: '/admin/content', label: 'Obsah', icon: '📄' },
      { href: '/admin/redirects', label: 'Redirecty', icon: '🔗' },
      { href: '/admin/faq', label: 'FAQ', icon: '❓' },
    ],
  },
};

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
        group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
        ${
          isActive
            ? 'bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white shadow-lg shadow-burgundy-900/40'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
        }
      `}
    >
      <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto min-w-[22px] h-5 flex items-center justify-center px-2 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg shadow-red-500/50 animate-pulse">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
      )}
    </Link>
  );
}

// Sidebar section with collapsible items
function SidebarSection({
  label,
  icon,
  items,
  pathname,
}: {
  label: string;
  icon: string;
  items: typeof navigation.eshop.items;
  pathname: string;
}) {
  const hasActive = items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href)
  );
  const [open, setOpen] = useState(hasActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`
          group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
          ${
            hasActive
              ? 'text-white bg-slate-800/80'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }
        `}
      >
        <span className={`text-lg transition-transform duration-200 ${hasActive ? 'scale-110' : 'group-hover:scale-110'}`}>
          {icon}
        </span>
        <span className="font-semibold">{label}</span>
        <svg
          className={`ml-auto w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="mt-1 space-y-0.5 ml-2">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-3 pl-9 pr-4 py-2.5 rounded-lg text-sm transition-all duration-200
                  ${
                    isActive
                      ? 'text-white bg-slate-700/60 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }
                `}
              >
                <span className={`text-base transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
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

  // Handle logout
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
          fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
          transition-transform duration-300 ease-in-out border-r border-slate-700/50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/50">
            <div className="w-11 h-11 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-burgundy-900/50 ring-2 ring-burgundy-500/20">
              💎
            </div>
            <div>
              <div className="text-white font-bold text-lg tracking-tight">Mùza Hair</div>
              <div className="text-slate-400 text-xs font-medium">Admin Dashboard</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {/* Main navigation */}
            {navigation.main.map((item) => (
              <SidebarNavItem
                key={item.href}
                {...item}
                pathname={pathname}
                badge={item.href === '/admin/objednavky' ? pendingCount : undefined}
              />
            ))}

            {/* Divider */}
            <div className="my-4 px-4">
              <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
            </div>

            {/* E-shop section */}
            <SidebarSection {...navigation.eshop} pathname={pathname} />

            {/* Sklad section */}
            <SidebarSection {...navigation.sklad} pathname={pathname} />

            {/* CMS section */}
            <SidebarSection {...navigation.cms} pathname={pathname} />
          </nav>

          {/* User section */}
          <div className="border-t border-slate-700/50 p-4">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-burgundy-500/20">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-semibold truncate">Admin</div>
                <div className="text-slate-400 text-xs truncate">admin@muzahair.cz</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all duration-200 border border-slate-700/50"
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
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-stone-200/80 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors duration-200"
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

            {/* Search bar */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="🔍 Hledat... (Cmd+K)"
                  className="w-full px-4 py-2.5 pl-10 bg-stone-50/80 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500/30 focus:border-burgundy-500 focus:bg-white transition-all duration-200 placeholder:text-stone-400"
                  onFocus={(e) => e.target.blur()} // Placeholder for command palette
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-burgundy-600 transition-colors"
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
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-stone-200 bg-stone-50 px-1.5 font-mono text-[10px] font-medium text-stone-500">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  soundEnabled
                    ? 'text-burgundy-600 bg-burgundy-50 hover:bg-burgundy-100'
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
              <button className="relative p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all duration-200 group">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                )}
              </button>

              {/* Quick action - New Order */}
              <Link
                href="/admin/objednavky"
                className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-burgundy-600/30 transition-all duration-200 hover:shadow-xl"
              >
                <span className="text-base">➕</span>
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

  // Check authentication
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

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-burgundy-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600">Načítám...</p>
        </div>
      </div>
    );
  }

  // Login page (no layout)
  if (pathname === '/admin/login') {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    );
  }

  // Authenticated pages
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthenticatedLayout>{children}</AuthenticatedLayout>
      </ToastProvider>
    </QueryClientProvider>
  );
}
