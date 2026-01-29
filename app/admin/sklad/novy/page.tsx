'use client';

import { useState } from 'react';
import Link from 'next/link';
import VlasyXTab from '@/app/admin/konfigurator-sku/tabs/VlasyXTab';
import PlatinumTab from '@/app/admin/konfigurator-sku/tabs/PlatinumTab';
import PriceMatrixTab from '@/app/admin/konfigurator-sku/tabs/PriceMatrixTab';
import BulkImportTab from './tabs/BulkImportTab';

type TabType = 'vlasyx' | 'platinum' | 'import' | 'pricematrix';

const TABS: { id: TabType; label: string; description: string }[] = [
  { id: 'vlasyx', label: 'Standard / LUXE', description: 'BULK - prodej na gramy' },
  { id: 'platinum', label: 'Platinum', description: 'PIECE - culik (fixni vaha)' },
  { id: 'import', label: 'Hromadny import', description: 'CSV upload' },
  { id: 'pricematrix', label: 'Cenik', description: 'Matice cen' },
];

export default function NewSkuWizardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('vlasyx');

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novy SKU</h1>
          <p className="text-gray-500 mt-1">Vytvoreni novych skladovych polozek</p>
        </div>
        <Link
          href="/admin/sklad"
          className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          ← Zpet na sklad
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="font-semibold">{tab.label}</div>
            <div className={`text-xs mt-0.5 ${activeTab === tab.id ? 'text-gray-500' : 'text-gray-400'}`}>
              {tab.description}
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'vlasyx' && <VlasyXTab />}
      {activeTab === 'platinum' && <PlatinumTab />}
      {activeTab === 'import' && <BulkImportTab />}
      {activeTab === 'pricematrix' && <PriceMatrixTab />}
    </div>
  );
}
