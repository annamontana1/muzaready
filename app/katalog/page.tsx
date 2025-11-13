'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Sku {
  id: string;
  sku: string;
  name: string | null;
  customerCategory: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | null;
  shade: string | null;
  shadeName: string | null;
  lengthCm: number | null;
  structure: string | null;
  saleMode: 'PIECE_BY_WEIGHT' | 'BULK_G';
  pricePerGramCzk: number;
  weightTotalG: number | null;
  availableGrams: number | null;
  minOrderG: number | null;
  stepG: number | null;
  inStock: boolean;
  soldOut: boolean;
  isListed: boolean;
  listingPriority: number | null;
}

export default function CatalogPage() {
  const router = useRouter();
  const [skus, setSkus] = useState<Sku[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    fetchSkus();
  }, []);

  const fetchSkus = async () => {
    try {
      const res = await fetch('/api/admin/skus');
      if (!res.ok) throw new Error('Failed to fetch SKUs');
      const data: Sku[] = await res.json();
      // Filter only listed SKUs and sort by priority
      const listed = data
        .filter((sku) => sku.isListed && sku.inStock)
        .sort((a, b) => (a.listingPriority || 999) - (b.listingPriority || 999));
      setSkus(listed);
    } catch (err) {
      console.error('Error fetching SKUs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'PLATINUM_EDITION':
        return 'bg-yellow-50 border-yellow-200';
      case 'LUXE':
        return 'bg-pink-50 border-pink-200';
      case 'STANDARD':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string | null) => {
    switch (category) {
      case 'PLATINUM_EDITION':
        return '✨ Platinum Edition';
      case 'LUXE':
        return '💎 Luxe';
      case 'STANDARD':
        return '⭐ Standard';
      default:
        return category;
    }
  };

  const handleAddToCart = async (sku: Sku) => {
    setAddingToCart(sku.id);
    try {
      // Get quote for default configuration (no ending = NONE)
      const quoteRes = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: [
            {
              skuId: sku.id,
              wantedGrams: sku.saleMode === 'BULK_G' ? sku.minOrderG : undefined,
              ending: 'NONE',
            },
          ],
        }),
      });

      if (!quoteRes.ok) {
        const err = await quoteRes.json();
        alert(`Chyba: ${err.error || 'Nelze vypočítat cenu'}`);
        setAddingToCart(null);
        return;
      }

      const quoteData = await quoteRes.json();
      const quote = quoteData.items[0];

      // Add to localStorage cart
      const cart = JSON.parse(localStorage.getItem('sku-cart') || '[]');
      cart.push({
        skuId: sku.id,
        skuName: sku.name,
        customerCategory: sku.customerCategory,
        saleMode: sku.saleMode,
        grams: quote.grams,
        pricePerGram: quote.pricePerGram,
        lineTotal: quote.lineTotal,
        ending: 'NONE',
        assemblyFeeType: quote.assemblyFeeType,
        assemblyFeeCzk: quote.assemblyFeeCzk,
        assemblyFeeTotal: quote.assemblyFeeTotal,
        lineGrandTotal: quote.lineGrandTotal,
      });
      localStorage.setItem('sku-cart', JSON.stringify(cart));

      // Navigate to cart
      router.push('/sku-kosik');
    } catch (err: any) {
      alert(`Chyba: ${err.message}`);
      setAddingToCart(null);
    }
  };

  const getSaleModeLabel = (mode: string) => {
    return mode === 'PIECE_BY_WEIGHT' ? 'Culík' : 'Gramy';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const categories = ['STANDARD', 'LUXE', 'PLATINUM_EDITION'];
  const filteredSkus = selectedCategory
    ? skus.filter((sku) => sku.customerCategory === selectedCategory)
    : skus;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12">
            <p className="text-gray-600">Načítám katalog...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-burgundy mb-3">Katalog vlasů</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vyberte si z naší kolekce prémiových vlasů pro prodloužení. Všechny produkty jsou na skladě a připraveny k odeslání.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === null
                ? 'bg-burgundy text-white shadow-lg'
                : 'bg-white text-burgundy border-2 border-burgundy hover:bg-burgundy hover:text-white'
            }`}
          >
            Všechny ({skus.length})
          </button>
          {categories.map((cat) => {
            const count = skus.filter((sku) => sku.customerCategory === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === cat
                    ? 'bg-burgundy text-white shadow-lg'
                    : 'bg-white text-burgundy border-2 border-burgundy hover:bg-burgundy hover:text-white'
                }`}
              >
                {getCategoryLabel(cat)} ({count})
              </button>
            );
          })}
        </div>

        {/* SKU Grid */}
        {filteredSkus.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">V této kategorii nejsou dostupné produkty.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkus.map((sku) => (
              <div
                key={sku.id}
                className={`rounded-xl border-2 overflow-hidden shadow-lg hover:shadow-xl transition ${getCategoryColor(
                  sku.customerCategory
                )}`}
              >
                {/* Header with Category */}
                <div className="bg-gradient-to-r from-burgundy to-maroon text-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wide">{sku.sku}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {getSaleModeLabel(sku.saleMode)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{sku.name || 'Bez názvu'}</h3>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  {/* Category Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Kategorie:</span>
                    <span className="text-sm px-3 py-1 rounded-full bg-burgundy/10 text-burgundy font-medium">
                      {getCategoryLabel(sku.customerCategory)}
                    </span>
                  </div>

                  {/* Hair Details */}
                  <div className="space-y-2 text-sm text-gray-700">
                    {sku.shadeName && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Odstín:</span>
                        <span>{sku.shadeName}</span>
                      </div>
                    )}
                    {sku.lengthCm && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Délka:</span>
                        <span>{sku.lengthCm} cm</span>
                      </div>
                    )}
                    {sku.structure && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Struktura:</span>
                        <span className="capitalize">{sku.structure}</span>
                      </div>
                    )}
                  </div>

                  {/* Price & Stock */}
                  <div className="pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">Cena:</span>
                      <span className="text-2xl font-bold text-burgundy">
                        {formatPrice(sku.pricePerGramCzk)}
                      </span>
                    </div>

                    {/* Sale Mode Specific Info */}
                    {sku.saleMode === 'PIECE_BY_WEIGHT' ? (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Váha kusu:</span> {sku.weightTotalG}g
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Na skladě:</span> {sku.availableGrams}g
                        <br />
                        <span className="text-xs">Min. objednávka: {sku.minOrderG}g, krok: {sku.stepG}g</span>
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className="pt-2">
                      <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                        ✓ Na skladě
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleAddToCart(sku)}
                    disabled={addingToCart === sku.id}
                    className="mt-4 w-full bg-burgundy text-white text-center py-3 rounded-lg font-semibold hover:bg-maroon transition shadow-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart === sku.id ? '⏳ Přidávám...' : '🛒 Do košíku'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
