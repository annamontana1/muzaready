'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartProvider } from '@/contexts/CartContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Redirect to login page
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <CartProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
        >
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? '📊 Dashboard' : '📊'}
          </Link>
          <Link
            href="/admin/produkty"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? '📦 Produkty' : '📦'}
          </Link>
          <Link
            href="/admin/objednavky"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? '🛒 Objednávky' : '🛒'}
          </Link>
          <Link
            href="/admin/uzivatele"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? '👥 Uživatelé' : '👥'}
          </Link>
          <Link
            href="/admin/sklad"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? '📦 Sklad (SKU)' : '📦'}
          </Link>
          <Link
            href="/admin/price-matrix"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? '💰 Matice cen' : '💰'}
          </Link>
          <Link
            href="/admin/konfigurator-sku"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm"
          >
            {sidebarOpen ? '➕ Nový produkt' : '➕'}
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            href="/"
            className="block px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm text-center"
          >
            {sidebarOpen ? '← Zpět na obchod' : '←'}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm text-center bg-red-700"
          >
            {sidebarOpen ? '🚪 Odhlásit se' : '🚪'}
          </button>
        </div>
      </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </CartProvider>
  );
}
