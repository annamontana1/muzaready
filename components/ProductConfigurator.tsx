'use client';

import { useState, useEffect } from 'react';
import { Product, HairStructure, HairEnding, CATEGORY_RULES } from '@/types/product';
import { PriceCalculator } from '@/lib/price-calculator';
import { generateSKU } from '@/lib/sku-generator';
import ColorSwatchSelector from './ColorSwatchSelector';
import { PRICING_CONFIG } from '@/types/pricing';

interface ProductConfiguratorProps {
  product: Product;
}

export default function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const [config, setConfig] = useState({
    shade: 1,
    lengthCm: 45,
    weightG: 100,
    structure: 'rovné' as HairStructure,
    ending: 'keratin' as HairEnding,
  });

  const [price, setPrice] = useState(0);
  const [sku, setSku] = useState('');

  // Získání dostupných odstínů podle kategorie a tieru
  const getAvailableShades = () => {
    if (product.category === 'nebarvene_panenske') {
      const tierKey = product.tier.toLowerCase() as 'standard' | 'luxe' | 'platinum';
      return CATEGORY_RULES.nebarvene_panenske.shades[tierKey] || [1, 2, 3, 4, 5];
    } else {
      return CATEGORY_RULES.barvene_blond.shades;
    }
  };

  const availableShades = getAvailableShades();

  // Kalkulace ceny při změně konfigurace
  useEffect(() => {
    const calculator = new PriceCalculator();
    const newPrice = calculator.calculate({
      category: product.category,
      tier: product.tier,
      ...config,
    });
    setPrice(newPrice);

    // Generování SKU
    const newSku = generateSKU({
      category: product.category,
      tier: product.tier,
      ...config,
      batch: product.batch,
    });
    setSku(newSku);
  }, [config, product]);

  // Nastavení prvního dostupného odstínu při načtení
  useEffect(() => {
    if (!availableShades.includes(config.shade)) {
      setConfig((prev) => ({ ...prev, shade: availableShades[0] }));
    }
  }, [availableShades, config.shade]);

  const handleAddToCart = () => {
    console.log('Adding to cart:', { sku, config, price });
    // TODO: Implement cart functionality
    alert(`Přidáno do košíku!\nSKU: ${sku}\nCena: ${price} Kč`);
  };

  return (
    <div className="configurator space-y-6">
      {/* Odstín selector */}
      <div className="config-section">
        <label className="form-label">Odstín</label>
        <ColorSwatchSelector
          shades={availableShades}
          selectedShade={config.shade}
          category={product.category}
          tier={product.tier}
          onSelect={(shade) => setConfig({ ...config, shade })}
        />
      </div>

      {/* Délka */}
      <div className="config-section">
        <label className="form-label">Délka (cm)</label>
        <div className="space-y-3">
          <input
            type="range"
            min={35}
            max={90}
            step={5}
            value={config.lengthCm}
            onChange={(e) => setConfig({ ...config, lengthCm: parseInt(e.target.value) })}
            className="w-full h-2 bg-warm-beige rounded-lg appearance-none cursor-pointer accent-burgundy"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">35 cm</span>
            <span className="font-semibold text-burgundy text-lg">{config.lengthCm} cm</span>
            <span className="text-gray-600">90 cm</span>
          </div>
          <div className="measurement-note">
            <div className="flex items-start gap-3">
              <span className="text-burgundy">📏</span>
              <div>
                <h4 className="font-semibold text-burgundy mb-1">Jak měříme vlasy</h4>
                <p className="text-sm text-gray-700">
                  Všechny délky měříme <strong>tak, jak vlasy leží</strong> – nic nenatahujeme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gramáž */}
      <div className="config-section">
        <label className="form-label">Gramáž (g)</label>
        <input
          type="number"
          min={50}
          max={300}
          step={10}
          value={config.weightG}
          onChange={(e) => setConfig({ ...config, weightG: parseInt(e.target.value) })}
          className="form-input"
        />
        <p className="text-xs text-gray-600 mt-2">Krok: 10 g (50-300 g)</p>
      </div>

      {/* Struktura */}
      <div className="config-section">
        <label className="form-label">Struktura</label>
        <div className="grid grid-cols-2 gap-3">
          {(['rovné', 'mírně vlnité', 'vlnité', 'kudrnaté'] as HairStructure[]).map((structure) => (
            <button
              key={structure}
              onClick={() => setConfig({ ...config, structure })}
              className={`
                px-4 py-3 rounded-lg border-2 transition-all font-medium
                ${
                  config.structure === structure
                    ? 'border-burgundy bg-burgundy text-white'
                    : 'border-warm-beige bg-white text-burgundy hover:border-burgundy'
                }
              `}
            >
              {structure.charAt(0).toUpperCase() + structure.slice(1)}
            </button>
          ))}
        </div>
        {config.structure !== 'rovné' && (
          <p className="text-xs text-gray-600 mt-2">
            Příplatek: +{' '}
            {Math.round((PRICING_CONFIG.structure_multiplier[config.structure] - 1) * 100)}%
          </p>
        )}
      </div>

      {/* Zakončení */}
      <div className="config-section">
        <label className="form-label">Zakončení</label>
        <div className="grid grid-cols-2 gap-3">
          {(['keratin', 'microkeratin', 'nano_tapes', 'vlasove_tresy'] as HairEnding[]).map(
            (ending) => (
              <button
                key={ending}
                onClick={() => setConfig({ ...config, ending })}
                className={`
                  px-4 py-3 rounded-lg border-2 transition-all font-medium
                  ${
                    config.ending === ending
                      ? 'border-burgundy bg-burgundy text-white'
                      : 'border-warm-beige bg-white text-burgundy hover:border-burgundy'
                  }
                `}
              >
                {ending === 'nano_tapes'
                  ? 'Nano tapes'
                  : ending === 'vlasove_tresy'
                  ? 'Vlasové tresy'
                  : ending.charAt(0).toUpperCase() + ending.slice(1)}
              </button>
            )
          )}
        </div>
        {PRICING_CONFIG.ending_surcharge_czk[config.ending] > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            Příplatek: +{PRICING_CONFIG.ending_surcharge_czk[config.ending]} Kč
          </p>
        )}
      </div>

      {/* Cena & CTA */}
      <div className="config-summary bg-ivory p-6 rounded-lg border-2 border-burgundy">
        <div className="price-display mb-4">
          <span className="text-sm text-gray-600">Celková cena:</span>
          <div className="text-4xl font-bold text-burgundy mt-2">
            {price.toLocaleString('cs-CZ')} Kč
          </div>
        </div>

        <div className="text-xs text-gray-500 mb-4 font-mono">SKU: {sku}</div>

        <button onClick={handleAddToCart} className="btn-primary w-full text-lg">
          Vložit do košíku
        </button>

        {/* Features */}
        <div className="mt-6 space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-success">✓</span>
            <span>Doprava zdarma nad 2000 Kč</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success">✓</span>
            <span>30 denní vrácení</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success">✓</span>
            <span>100% přírodní vlasy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
