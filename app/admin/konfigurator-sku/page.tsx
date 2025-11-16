'use client';

import { useState } from 'react';
import Link from 'next/link';
import VlasyXTab from './tabs/VlasyXTab';
import PlatinumTab from './tabs/PlatinumTab';
import PriceMatrixTab from './tabs/PriceMatrixTab';

type TabType = 'vlasyx' | 'platinum' | 'pricematrix';

export default function ConfiguratorSKUPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vlasyx');

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Konfigurátor SKU</h1>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          ← Zpět
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-300">
        <button
          onClick={() => setActiveTab('vlasyx')}
          className={`px-6 py-3 font-semibold text-sm transition ${
            activeTab === 'vlasyx'
              ? 'text-burgundy border-b-2 border-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          VlasyX (BULK – na gramy)
        </button>
        <button
          onClick={() => setActiveTab('platinum')}
          className={`px-6 py-3 font-semibold text-sm transition ${
            activeTab === 'platinum'
              ? 'text-burgundy border-b-2 border-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Platinum (PIECE – kus)
        </button>
        <button
          onClick={() => setActiveTab('pricematrix')}
          className={`px-6 py-3 font-semibold text-sm transition ${
            activeTab === 'pricematrix'
              ? 'text-burgundy border-b-2 border-burgundy'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Ceník (Matice cen)
        </button>
      </div>

      {/* Content */}
      {activeTab === 'vlasyx' && <VlasyXTab />}
      {activeTab === 'platinum' && <PlatinumTab />}
      {activeTab === 'pricematrix' && <PriceMatrixTab />}
    </div>
  );
}
