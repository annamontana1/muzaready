'use client';

import { HAIR_COLORS } from '@/types/product';

interface ShadeSelection {
  code: string;
  name: string;
  hex: string;
}

interface AdminShadePickerProps {
  selectedShadeCode: string;
  onSelect: (shade: ShadeSelection | null) => void;
}

const ALL_SHADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function AdminShadePicker({
  selectedShadeCode,
  onSelect,
}: AdminShadePickerProps) {
  const handleClick = (code: number) => {
    const codeStr = code.toString();
    if (selectedShadeCode === codeStr) {
      // Deselect
      onSelect(null);
    } else {
      const color = HAIR_COLORS[code];
      onSelect({
        code: codeStr,
        name: color.name,
        hex: color.hex,
      });
    }
  };

  const selectedCode = selectedShadeCode ? parseInt(selectedShadeCode) : null;
  const selectedColor = selectedCode ? HAIR_COLORS[selectedCode] : null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Odstin
      </label>
      <div className="flex flex-wrap gap-2">
        {ALL_SHADES.map((code) => {
          const color = HAIR_COLORS[code];
          if (!color) return null;

          const isSelected = selectedCode === code;
          // Use white text for dark shades (1-5), dark text for light shades (6-10)
          const textColor = code <= 5 ? 'text-white' : 'text-gray-800';

          return (
            <button
              key={code}
              type="button"
              onClick={() => handleClick(code)}
              className={`
                w-10 h-10 rounded-full border-2 transition-all relative flex items-center justify-center
                text-sm font-bold
                ${textColor}
                ${
                  isSelected
                    ? 'border-blue-500 scale-110 shadow-md ring-2 ring-blue-300'
                    : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={`${color.name} (S${code.toString().padStart(2, '0')})`}
              aria-label={`Odstin ${code}: ${color.name}`}
            >
              <span className="drop-shadow">{code}</span>
            </button>
          );
        })}
      </div>

      {selectedColor && selectedCode && (
        <div className="mt-2 text-sm text-gray-600">
          <strong>{selectedColor.name}</strong>{' '}
          (S{selectedCode.toString().padStart(2, '0')})
        </div>
      )}
    </div>
  );
}
