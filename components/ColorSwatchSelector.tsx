'use client';

import { HAIR_COLORS, ProductCategory, ProductTier } from '@/types/product';

interface ColorSwatchSelectorProps {
  shades: number[];
  selectedShade: number;
  category: ProductCategory;
  tier?: ProductTier;
  onSelect: (shade: number) => void;
}

export default function ColorSwatchSelector({
  shades,
  selectedShade,
  category,
  tier,
  onSelect,
}: ColorSwatchSelectorProps) {
  return (
    <div className="color-swatch-selector">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">
          {shades.length} S-odstínů
        </h3>
        <button
          className="text-xs text-burgundy hover:underline"
          onClick={() => {
            /* Open color guide modal */
          }}
        >
          Průvodce odstíny
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {shades.map((shade) => {
          const color = HAIR_COLORS[shade];
          const isSelected = shade === selectedShade;

          if (!color) return null;

          return (
            <button
              key={shade}
              onClick={() => onSelect(shade)}
              className={`
                w-12 h-12 rounded-full border-2 transition-all relative
                ${
                  isSelected
                    ? 'border-burgundy scale-110 shadow-md ring-2 ring-burgundy/30'
                    : 'border-warm-beige hover:border-warm-beige hover:scale-105'
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={`${color.name} (S${shade.toString().padStart(2, '0')})`}
              aria-label={`Odstín ${shade}: ${color.name}`}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-lg drop-shadow">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected shade info */}
      {selectedShade && HAIR_COLORS[selectedShade] && (
        <div className="mt-3 text-sm text-text-mid">
          <strong>{HAIR_COLORS[selectedShade].name}</strong>
          {' '}(S{selectedShade.toString().padStart(2, '0')})
        </div>
      )}

      {/* Info message for Platinum-only shades */}
      {category === 'nebarvene_panenske' &&
        tier !== 'Platinum edition' &&
        selectedShade >= 6 && (
          <div className="mt-3 p-3 bg-warning/10 border border-warning rounded-lg text-sm">
            💡 Odstín {selectedShade} je u Nebarvených dostupný pouze v{' '}
            <strong>Platinum edition</strong>
          </div>
        )}
    </div>
  );
}
