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
  if (category === 'BABY_SHADES') return [6, 7, 8, 9, 10];
  if (category === 'PLATINUM_EDITION') return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  if (type === 'nebarvene') return [1, 2, 3, 4, 5, 6];
  if (type === 'barvene') return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return [1, 2, 3, 4, 5, 6];
}

function Btn({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; desc?: string }[];
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
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-left ${
            value === opt.value
              ? 'bg-[#722F37] text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <span className="block">{opt.label}</span>
          {opt.desc && <span className={`block text-xs mt-0.5 ${value === opt.value ? 'text-white/75' : 'text-stone-400'}`}>{opt.desc}</span>}
        </button>
      ))}
    </div>
  );
}

export default function NaskladnitPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [structure, setStructure] = useState('');
  const [shade, setShade] = useState('');
  const [saleMode, setSaleMode] = useState<'BULK_G' | 'PIECE_BY_WEIGHT'>('BULK_G');
  // BULK_G: celkové gramy na skladě
  const [stockGrams, setStockGrams] = useState('');
  // PIECE_BY_WEIGHT: přesná gramáž 1 kusu
  const [pieceWeightG, setPieceWeightG] = useState('');
  const [pricePerGram, setPricePerGram] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const shadeOptions = getShadeOptions(category, type);

  const gramsOk = saleMode === 'BULK_G'
    ? stockGrams && Number(stockGrams) > 0
    : pieceWeightG && Number(pieceWeightG) > 0;

  const isValid = !!(category && type && structure && shade && gramsOk && pricePerGram && Number(pricePerGram) > 0);

  const priceNum = Number(pricePerGram);
  const price100g = priceNum > 0 ? Math.round(priceNum * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSaving(true);

    try {
      const categoryKey = type === 'barvene' ? 'barvene_vlasy' : 'nebarvene_panenske';
      const tierKey =
        category === 'LUXE' ? 'LUXE' :
        category === 'PLATINUM_EDITION' ? 'Platinum edition' :
        category === 'BABY_SHADES' ? 'BABY_SHADES' :
        'Standard';

      const body: any = {
        category: categoryKey,
        tier: tierKey,
        shade: Number(shade),
        structure,
        imageUrl: images[0] || null,
        images,
        isListed: false,
        usePriceMatrix: false,
        pricePerGramCzk: priceNum,
      };

      if (saleMode === 'BULK_G') {
        body.productType = 'vlasyx';
        body.selectedLengths = [45];
        body.defaultLength = 45;
        body.stockByLength = { 45: Number(stockGrams) };
        body.minOrderG = 50;
        body.stepG = 10;
        body.defaultGrams = 100;
      } else {
        // PIECE_BY_WEIGHT — celý culík s přesnou gramáží
        body.productType = 'vlasyy';
        body.lengthCm = 45;
        body.weightGrams = Number(pieceWeightG);
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

      alert('Naskladneno! ✓');
      router.push('/admin/sklad');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Naskladnit</h1>
        <button onClick={() => router.push('/admin/sklad')} className="text-sm text-stone-500 hover:text-stone-700">
          ← Zpět na sklad
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">

        {/* Kategorie */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Kategorie</label>
          <Btn options={CATEGORIES} value={category} onChange={setCategory} />
        </div>

        {/* Typ */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Typ vlasů</label>
          <Btn options={TYPES} value={type} onChange={setType} />
        </div>

        {/* Struktura */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Struktura</label>
          <Btn options={STRUCTURES} value={structure} onChange={setStructure} />
        </div>

        {/* Odstín */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Odstín</label>
          {category && type ? (
            <select
              value={shade}
              onChange={(e) => setShade(e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            >
              <option value="">Vyber odstín...</option>
              {shadeOptions.map((n) => (
                <option key={n} value={n}>Odstín {n}</option>
              ))}
            </select>
          ) : (
            <p className="text-sm text-stone-400">Nejdřív vyber kategorii a typ.</p>
          )}
        </div>

        {/* Způsob prodeje */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Způsob prodeje</label>
          <Btn
            options={[
              { value: 'BULK_G', label: '📦 Na gramy', desc: 'Zákazník volí množství (50g, 100g, 150g…)' },
              { value: 'PIECE_BY_WEIGHT', label: '🔹 Celý culík', desc: 'Jeden kus s přesnou gramáží' },
            ]}
            value={saleMode}
            onChange={(v) => setSaleMode(v as 'BULK_G' | 'PIECE_BY_WEIGHT')}
          />
        </div>

        {/* Gramáž — závisí na saleMode */}
        {saleMode === 'BULK_G' ? (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Celková gramáž na skladě (g)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number" min="1" value={stockGrams}
                onChange={(e) => setStockGrams(e.target.value)}
                placeholder="např. 500"
                className="w-40 px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
              <span className="text-sm text-stone-500">g celkem na skladě</span>
            </div>
            <p className="text-xs text-stone-400 mt-1">Zákazník si pak vybere kolik gramů chce (min. 50g, po 10g).</p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Přesná gramáž kusu (g)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number" min="1" value={pieceWeightG}
                onChange={(e) => setPieceWeightG(e.target.value)}
                placeholder="např. 120"
                className="w-40 px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
              />
              <span className="text-sm text-stone-500">g / kus</span>
              {pieceWeightG && Number(pieceWeightG) > 0 && priceNum > 0 && (
                <span className="text-sm text-blue-700 font-medium">
                  = {Math.round(priceNum * Number(pieceWeightG)).toLocaleString('cs-CZ')} Kč za kus
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-1">Zákazník kupuje celý culík — tato gramáž se zobrazí na produktové stránce.</p>
          </div>
        )}

        {/* Cena za gram */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Cena za gram (Kč/g) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="number" min="0.01" step="0.01" value={pricePerGram}
              onChange={(e) => setPricePerGram(e.target.value)}
              placeholder="např. 89.9"
              className="w-40 px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37]"
            />
            <span className="text-sm text-stone-500">Kč/g</span>
            {priceNum > 0 && (
              <span className="text-sm text-green-700 font-medium">
                = {price100g.toLocaleString('cs-CZ')} Kč / 100g
              </span>
            )}
          </div>
        </div>

        {/* Fotky */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Fotky</label>
          <div className="space-y-3">
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt={`Foto ${i + 1}`} className="w-24 h-24 object-cover rounded-lg border border-stone-200" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
            <ImageUpload value="" onChange={(url) => { if (url) setImages((prev) => [...prev, url]); }} folder="skus" />
          </div>
        </div>

        {/* Shrnutí */}
        <div className="bg-stone-50 rounded-lg p-4 space-y-1 text-sm text-stone-500">
          <p>→ Délka bude uložena jako 45 cm (zákazník v konfigurátoru vybírá 45–80 cm)</p>
          {saleMode === 'BULK_G' && <p>→ Min. objednávka 50g, krok 10g (lze změnit v editaci SKU)</p>}
          {saleMode === 'PIECE_BY_WEIGHT' && <p>→ Produkt se prodává jako 1 kus pevné gramáže</p>}
          <p>→ Po naskladnění zapni viditelnost v katalogu v editaci SKU</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || saving}
          className="w-full py-3 bg-[#722F37] text-white rounded-xl font-semibold hover:bg-[#5a252c] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Ukládám…' : 'Naskladnit'}
        </button>
      </form>
    </div>
  );
}
