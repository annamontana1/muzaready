'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';

const CATEGORIES = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'LUXE', label: 'Luxe' },
  { value: 'PLATINUM_EDITION', label: 'Platinum Edition' },
  { value: 'BABY_SHADES', label: 'Baby Shades' },
];

const TYPES = [
  { value: 'barvene', label: 'Barvene' },
  { value: 'nebarvene', label: 'Nebarvene' },
];

const STRUCTURES = [
  { value: 'rovne', label: 'Rovne' },
  { value: 'vlnite', label: 'Vlnite' },
  { value: 'mirne vlnite', label: 'Mirne vlnite' },
  { value: 'kudrnate', label: 'Kudrnate' },
];

function getShadeOptions(category: string, type: string): number[] {
  if (category === 'PLATINUM_EDITION' || category === 'BABY_SHADES') {
    if (category === 'BABY_SHADES') return [6, 7, 8, 9, 10];
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }
  if (type === 'nebarvene') return [1, 2, 3, 4, 5, 6];
  if (type === 'barvene') return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return [1, 2, 3, 4, 5, 6];
}

function ButtonGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            value === opt.value
              ? 'bg-[#722F37] text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function NaskladnitPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [structure, setStructure] = useState('');
  const [shade, setShade] = useState('');
  const [saleMode, setSaleMode] = useState('');
  const [grams, setGrams] = useState('');
  const [pricePerGram, setPricePerGram] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const shadeOptions = getShadeOptions(category, type);

  const handleAddImage = (url: string) => {
    if (url) setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid =
    category && type && structure && shade && saleMode && grams && Number(grams) > 0
    && pricePerGram && Number(pricePerGram) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSaving(true);
    try {
      // Map to the existing create-from-wizard API format
      const categoryKey = type === 'barvene' ? 'barvene_vlasy' : 'nebarvene_panenske';
      const tierKey =
        category === 'LUXE'
          ? 'LUXE'
          : category === 'PLATINUM_EDITION'
          ? 'Platinum edition'
          : 'Standard';

      const productType =
        category === 'PLATINUM_EDITION' || saleMode === 'PIECE_BY_WEIGHT'
          ? 'vlasyy'
          : 'vlasyx';

      const priceNum = Number(pricePerGram);
      const body: any = {
        productType,
        category: categoryKey,
        tier: tierKey,
        shade: Number(shade),
        structure,
        imageUrl: images[0] || null,
        images: images,
        isListed: false,
        usePriceMatrix: false, // always manual — ceník se doplní v sklad editoru
      };

      if (productType === 'vlasyx') {
        // BULK_G mode: "Na gramy"
        body.selectedLengths = [45]; // base 45cm
        body.defaultLength = 45;
        body.stockByLength = { 45: Number(grams) };
        body.minOrderG = 50;
        body.stepG = 10;
        body.defaultGrams = 100;
        body.pricePerGramCzk = priceNum;
      } else {
        // PIECE_BY_WEIGHT mode: "Cely culik"
        body.lengthCm = 45;
        body.weightGrams = Number(grams);
        body.pricePerGramCzk = priceNum; // cena/gram, API vypočítá totalPriceCzk = pricePerGram * weight
        body.inStock = true;
      }

      const res = await fetch('/api/admin/skus/create-from-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chyba pri ukladani');

      alert('Naskladneno!');
      router.push('/admin/sklad');
    } catch (err: any) {
      console.error(err);
      alert('Chyba: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Naskladnit</h1>
        <button
          onClick={() => router.push('/admin/sklad')}
          className="text-sm text-stone-500 hover:text-stone-700"
        >
          Zpet na sklad
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Kategorie */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Kategorie</label>
          <ButtonGroup options={CATEGORIES} value={category} onChange={setCategory} />
        </div>

        {/* Typ */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Typ</label>
          <ButtonGroup options={TYPES} value={type} onChange={setType} />
        </div>

        {/* Struktura */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Struktura</label>
          <ButtonGroup options={STRUCTURES} value={structure} onChange={setStructure} />
        </div>

        {/* Odstin */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Odstin</label>
          {category && type ? (
            <select
              value={shade}
              onChange={(e) => setShade(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            >
              <option value="">Vyber odstin...</option>
              {shadeOptions.map((n) => (
                <option key={n} value={n}>
                  Odstin {n}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-stone-400">Nejdriv vyber kategorii a typ.</p>
          )}
        </div>

        {/* Zpusob prodeje */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Zpusob prodeje</label>
          <ButtonGroup
            options={[
              { value: 'BULK_G', label: 'Na gramy (zakaznik voli mnozstvi)' },
              { value: 'PIECE_BY_WEIGHT', label: 'Cely culik (1 kus)' },
            ]}
            value={saleMode}
            onChange={setSaleMode}
          />
        </div>

        {/* Gramaz */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Gramaz na sklade
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              placeholder="0"
              className="w-40 px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            />
            <span className="text-sm text-stone-500">g</span>
          </div>
        </div>

        {/* Cena za gram */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Cena za gram (Kč/g) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={pricePerGram}
              onChange={(e) => setPricePerGram(e.target.value)}
              placeholder="napr. 89.9"
              className="w-40 px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            />
            <span className="text-sm text-stone-500">Kč/g</span>
            {pricePerGram && Number(pricePerGram) > 0 && (
              <span className="text-sm text-green-700 font-medium">
                = {Math.round(Number(pricePerGram) * 100)} Kč / 100g
              </span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-1">Cena bude uložena ke SKU. V ceníku lze upřesnit ceny pro různé délky.</p>
        </div>

        {/* Fotky */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Fotky</label>
          <div className="space-y-3">
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative">
                    <img
                      src={url}
                      alt={`Foto ${i + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-stone-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
            <ImageUpload value="" onChange={handleAddImage} folder="skus" />
          </div>
        </div>

        {/* Info texts */}
        <div className="bg-stone-50 rounded-lg p-4 space-y-1">
          <p className="text-sm text-stone-500">
            &rarr; Délka bude uložena jako 45 cm (zákazník v konfigurátoru vybírá 45–80 cm)
          </p>
          <p className="text-sm text-stone-500">
            &rarr; Zakončení volí zákazník v konfigurátoru
          </p>
          <p className="text-sm text-stone-500">
            &rarr; Po naskladnění zapni produkt v Sklad → editaci SKU (Viditelnost v katalogu)
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!isValid || saving}
          className="w-full py-3 bg-[#722F37] text-white rounded-xl font-semibold hover:bg-[#5a252c] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Ukladam...' : 'Naskladnit'}
        </button>
      </form>
    </div>
  );
}
