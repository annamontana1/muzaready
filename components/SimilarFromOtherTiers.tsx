'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types/product';

interface Props {
  currentTier: string;
  activeShades: number[];
}

const ALL_TIERS = [
  { name: 'Standard', param: 'Standard', href: '/vlasy-k-prodlouzeni/standard' },
  { name: 'Luxe', param: 'Luxe', href: '/vlasy-k-prodlouzeni/luxe' },
  { name: 'Platinum Edition', param: 'Platinum+Edition', href: '/vlasy-k-prodlouzeni/platinum-edition' },
  { name: 'Baby Shades', param: 'Baby+Shades', href: '/vlasy-k-prodlouzeni/baby-shades' },
];

export default function SimilarFromOtherTiers({ currentTier, activeShades }: Props) {
  const [productsByTier, setProductsByTier] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(false);

  const otherTiers = useMemo(
    () => ALL_TIERS.filter((t) => t.name !== currentTier),
    [currentTier]
  );

  // Fetch products from other tiers
  useEffect(() => {
    setLoading(true);
    const fetches = otherTiers.map((tier) =>
      fetch(`/api/catalog?tier=${tier.param}`)
        .then((res) => res.json())
        .then((data: Product[]) => ({ tier: tier.name, products: data }))
        .catch(() => ({ tier: tier.name, products: [] as Product[] }))
    );

    Promise.all(fetches).then((results) => {
      const map: Record<string, Product[]> = {};
      results.forEach((r) => {
        map[r.tier] = r.products;
      });
      setProductsByTier(map);
      setLoading(false);
    });
  }, [otherTiers]);

  // Filter by active shades — show matching products, max 4 per tier
  const getRelevantProducts = (tierName: string): Product[] => {
    const products = productsByTier[tierName] || [];
    if (activeShades.length === 0) {
      // No shade filter — show first 4 products
      return products.slice(0, 4);
    }
    // Filter by matching shades
    const matching = products.filter((p) => {
      const shade = p.variants[0]?.shade;
      return shade && activeShades.includes(shade);
    });
    if (matching.length > 0) return matching.slice(0, 4);
    // Fallback: show closest shades
    return products.slice(0, 4);
  };

  const hasAnyProducts = otherTiers.some(
    (tier) => getRelevantProducts(tier.name).length > 0
  );

  if (loading || !hasAnyProducts) return null;

  return (
    <div className="mt-16 pt-12 border-t border-warm-beige">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-playfair text-burgundy mb-2">
          {activeShades.length > 0
            ? 'Podobný odstín v jiných kategoriích'
            : 'Nenašli jste co hledáte?'}
        </h2>
        <p className="text-gray-600">
          {activeShades.length > 0
            ? 'Podívejte se na stejný odstín v jiné kvalitě vlasů'
            : 'Prozkoumejte jiné kategorie vlasů'}
        </p>
      </div>

      <div className="space-y-10">
        {otherTiers.map((tier) => {
          const products = getRelevantProducts(tier.name);
          if (products.length === 0) return null;
          const tierInfo = ALL_TIERS.find((t) => t.name === tier.name)!;

          return (
            <div key={tier.name}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-burgundy">{tier.name}</h3>
                <Link
                  href={tierInfo.href}
                  className="text-sm text-burgundy hover:text-maroon font-medium transition"
                >
                  Zobrazit vše →
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
