'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';

// ─── Typy ────────────────────────────────────────────────────────────────────

type Category = 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION' | 'BABY_SHADES' | '';

// Podkategorie pro Platinum a Baby Shades
type Subtype =
  | 'nebarvene_14'   // Platinum nebarvené 1-4
  | 'nebarvene_510'  // Platinum nebarvené světlé 5-10
  | 'barvene_510'    // Platinum barvené 5-10
  | 'baby_710'       // Baby Shades nebarvené 7-10
  | 'barvene'        // Standard/Luxe barvené
  | 'nebarvene'      // Standard/Luxe nebarvené
  | '';

const STRUCTURES = [
  { value: 'rovne', label: 'Rovné' },
  { value: 'vlnite', label: 'Vlnité' },
  { value: 'mirne vlnite', label: 'Mírně vlnité' },
  { value: 'kudrnate', label: 'Kudrnaté' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getShadeRange(category: Category, subtype: Subtype): number[] {
  if (category === 'PLATINUM_EDITION') {
    if (subtype === 'nebarvene_14') return [1, 2, 3, 4];
    if (subtype === 'nebarvene_510') return [5, 6, 7, 8, 9, 10];
    if (subtype === 'barvene_510') return [5, 6, 7, 8, 9, 10];
    return [];
  }
  if (category === 'BABY_SHADES') return [7, 8, 9, 10];
  if (subtype === 'nebarvene') return [1, 2, 3, 4, 5, 6];
  if (subtype === 'barvene') return [5, 6, 7, 8, 9, 10];
  return [];
}

function getDerivedType(subtype: Subtype): 'barvene' | 'nebarvene' {
  if (subtype === 'barvene_510' || subtype === 'barvene') return 'barvene';
  return 'nebarvene';
}

function getIsDyed(subtype: Subtype): boolean {
  return subtype === 'barvene_510' || subtype === 'barvene';
}

function getCategoryKey(category: Category, subtype: Subtype): string {
  if (category === 'BABY_SHADES') return 'baby_shades';
  if (getDerivedType(subtype) === 'barvene') return 'barvene_vlasy';
  return 'nebarvene_panenske';
}

function getTierKey(category: Category): string {
  if (category === 'LUXE') return 'LUXE';
  if (category === 'PLATINUM_EDITION') return 'Platinum edition';
  if (category === 'BABY_SHADES') return 'BABY_SHADES';
  return 'Standard';
}

// ─── Komponenty ──────────────────────────────────────────────────────────────

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
          {opt.desc && (
            <span className={`block text-xs mt-0.5 ${value === opt.value ? 'text-white/75' : 'text-stone-400'}`}>
              {opt.desc}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function ShadeButtons({
  shades,
  value,
  onChange,
}: {
  shades: number[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {shades.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(String(n))}
          className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
            value === String(n)
              ? 'bg-[#722F37] text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// ─── Hlavní stránka ──────────────────────────────────────────────────────────

export default function NaskladnitPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [category, setCategory] = useState<Category>('');
  const [subtype, setSubtype] = useState<Subtype>('');
  const [structure, setStructure] = useState('');
  const [shade, setShade] = useState('');
  const [description, setDescription] = useState('');

  const [saleMode, setSaleMode] = useState<'BULK_G' | 'PIECE_BY_WEIGHT'>('BULK_G');
  const [stockGrams, setStockGrams] = useState('');
  const [pieceWeightG, setPieceWeightG] = useState('');
  const [pricePerGram, setPricePerGram] = useState('');
  const [images, setImages] = useState<string[]>([]);

  // Reset podřízených polí při změně kategorie
  const handleCategoryChange = (v: string) => {
    setCategory(v as Category);
    setSubtype('');
    setShade('');
  };

  const handleSubtypeChange = (v: string) => {
    setSubtype(v as Subtype);
    setShade('');
  };

  const shadeRange = getShadeRange(category, subtype);
  const priceNum = Number(pricePerGram);
  const price100g = priceNum > 0 ? Math.round(priceNum * 100) : 0;

  const gramsOk = saleMode === 'BULK_G'
    ? stockGrams && Number(stockGrams) > 0
    : pieceWeightG && Number(pieceWeightG) > 0;

  // Baby Shades nepotřebuje výběr subtype (vždy nebarvene 7-10)
  const subtypeOk = category === 'BABY_SHADES' ? true : !!subtype;
  const isValid = !!(category && subtypeOk && structure && shade && gramsOk && pricePerGram && priceNum > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError('');
    setSaving(true);

    try {
      const effectiveSubtype: Subtype = category === 'BABY_SHADES' ? 'baby_710' : subtype;
      const categoryKey = getCategoryKey(category, effectiveSubtype);
      const tierKey = getTierKey(category);
      const isDyed = getIsDyed(effectiveSubtype);

      const body: any = {
        category: categoryKey,
        tier: tierKey,
        shade: Number(shade),
        structure,
        description: description.trim() || undefined,
        isDyed,
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
      if (!res.ok) throw new Error(data.error || 'Chyba při ukládání');

      alert('Naskladneno! ✓');
      router.push('/admin/sklad');
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Naskladnit</h1>
        <button onClick={() => router.push('/admin/sklad')} className="text-sm text-stone-500 hover:text-stone-700">
          ← Zpět na sklad
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">

        {/* ── Kategorie ── */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Kategorie</label>
          <Btn
            options={[
              { value: 'STANDARD', label: 'Standard' },
              { value: 'LUXE', label: 'Luxe' },
              { value: 'PLATINUM_EDITION', label: 'Platinum Edition' },
              { value: 'BABY_SHADES', label: 'Baby Shades' },
            ]}
            value={category}
            onChange={handleCategoryChange}
          />
        </div>

        {/* ── Podkategorie / Typ ── */}
        {category === 'PLATINUM_EDITION' && (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Typ vlasů</label>
            <Btn
              options={[
                { value: 'nebarvene_14', label: 'Nebarvené 1–4', desc: 'Přírodní tmavé, odstíny 1–4' },
                { value: 'nebarvene_510', label: 'Nebarvené 5–10', desc: 'Přírodní světlé, odstíny 5–10' },
                { value: 'barvene_510', label: 'Barvené 5–10', desc: 'Barvené blond, odstíny 5–10' },
              ]}
              value={subtype}
              onChange={handleSubtypeChange}
            />
          </div>
        )}

        {(category === 'STANDARD' || category === 'LUXE') && (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Typ vlasů</label>
            <Btn
              options={[
                { value: 'barvene', label: 'Barvené' },
                { value: 'nebarvene', label: 'Nebarvené' },
              ]}
              value={subtype}
              onChange={handleSubtypeChange}
            />
          </div>
        )}

        {/* Baby Shades — typ je vždy nebarvené 7-10, žádná volba */}
        {category === 'BABY_SHADES' && (
          <div className="text-sm text-stone-500 bg-stone-50 rounded-lg px-4 py-2">
            Vždy nebarvené · odstíny 7–10
          </div>
        )}

        {/* ── Odstín ── */}
        {shadeRange.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Odstín {shade && <span className="text-[#722F37]">· #{shade}</span>}
            </label>
            <ShadeButtons shades={shadeRange} value={shade} onChange={setShade} />
          </div>
        )}

        {/* ── Struktura ── */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Struktura</label>
          <Btn options={STRUCTURES} value={structure} onChange={setStructure} />
        </div>

        {/* ── Krátký popis ── */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1">
            Krátký popis <span className="font-normal text-stone-400">(volitelné — doplníš později)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Krátký popis produktu…"
            rows={2}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] resize-none"
          />
        </div>

        {/* ── Způsob prodeje ── */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Způsob prodeje</label>
          <Btn
            options={[
              { value: 'BULK_G', label: '📦 Na gramy', desc: 'Zákazník volí množství (50g, 100g…)' },
              { value: 'PIECE_BY_WEIGHT', label: '🔹 Celý culík', desc: 'Jeden kus s přesnou gramáží' },
            ]}
            value={saleMode}
            onChange={(v) => setSaleMode(v as 'BULK_G' | 'PIECE_BY_WEIGHT')}
          />
        </div>

        {/* ── Gramáž ── */}
        {saleMode === 'BULK_G' ? (
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Celková gramáž na skladě (g)</label>
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
            <label className="block text-sm font-semibold text-stone-700 mb-2">Přesná gramáž kusu (g)</label>
            <div className="flex items-center gap-2 flex-wrap">
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
          </div>
        )}

        {/* ── Cena za gram ── */}
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

        {/* ── Fotky ── */}
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

        {/* ── Shrnutí ── */}
        {isValid && (
          <div className="bg-stone-50 rounded-lg p-4 space-y-1 text-sm text-stone-500">
            <p>→ Kategorie: <strong className="text-stone-700">{getTierKey(category)}</strong> · odstín <strong className="text-stone-700">#{shade}</strong></p>
            <p>→ Délka uložena jako 45 cm</p>
            {saleMode === 'BULK_G' && <p>→ Min. objednávka 50g, krok 10g (lze změnit v editaci SKU)</p>}
            {saleMode === 'PIECE_BY_WEIGHT' && <p>→ Prodává se jako 1 kus pevné gramáže</p>}
            <p>→ Po naskladnění zapni viditelnost v katalogu přes sklad</p>
          </div>
        )}

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
