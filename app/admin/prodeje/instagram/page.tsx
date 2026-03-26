'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

// ─── Types ──────────────────────────────────────────────────────

interface ConfiguredItem {
  id: string; // client-side ID for key
  category: string;
  structure: string;
  shade: number;
  lengthCm: number;
  grams: number;
  ending: string;
  pricePerGram: number;
  endingSurcharge: number;
  lineTotal: number;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
}

interface ShippingData {
  method: 'zadna' | 'dpd' | 'zasilkovna' | 'jiny';
  customName: string;
  customPrice: number;
}

type Step = 1 | 2 | 3;

// ─── Constants ──────────────────────────────────────────────────

const CATEGORIES = [
  { value: 'STANDARD', label: 'Standard' },
  { value: 'LUXE', label: 'Luxe' },
  { value: 'PLATINUM_EDITION', label: 'Platinum Edition' },
  { value: 'BABY_SHADES', label: 'Baby Shades' },
];

const STRUCTURES = [
  { value: 'rovné', label: 'Rovné' },
  { value: 'vlnité', label: 'Vlnité' },
  { value: 'kudrnaté', label: 'Kudrnaté' },
];

const SHADES = Array.from({ length: 10 }, (_, i) => i + 1);

const LENGTHS = [40, 45, 50, 55, 60, 65, 70, 75, 80];

const ENDINGS = [
  { value: 'keratin', label: 'Keratin', surchargePerGram: 10 },
  { value: 'mikrokeratin', label: 'Mikrokeratin', surchargePerGram: 10 },
  { value: 'pásky keratinu', label: 'Pásky keratinu', surchargePerGram: 50 },
  { value: 'weft', label: 'Weft', surchargePerGram: 50 },
  { value: 'tapes', label: 'Tapes', surchargePerGram: 50 },
];

const SHIPPING_OPTIONS = [
  { value: 'zadna', label: 'Bez dopravy (osobní odběr)', price: 0 },
  { value: 'dpd', label: 'DPD', price: 68 },
  { value: 'zasilkovna', label: 'Zásilkovna', price: 89 },
  { value: 'jiny', label: 'Jiný dopravce', price: 0 },
];

// ─── Helpers ────────────────────────────────────────────────────

function formatPrice(czk: number): string {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(czk);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// ─── Component ──────────────────────────────────────────────────

export default function InstagramSalePage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Multi-step state
  const [step, setStep] = useState<Step>(1);

  // Step 1: Product configurator
  const [items, setItems] = useState<ConfiguredItem[]>([]);
  const [currentItem, setCurrentItem] = useState({
    category: 'STANDARD',
    structure: 'rovné',
    shade: 1,
    lengthCm: 50,
    grams: 100,
    ending: 'keratin',
  });
  const [priceLoading, setPriceLoading] = useState(false);
  const [currentPricePerGram, setCurrentPricePerGram] = useState<number | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Step 2: Customer + Shipping
  const [customer, setCustomer] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    zipCode: '',
  });
  const [shipping, setShipping] = useState<ShippingData>({
    method: 'zadna',
    customName: '',
    customPrice: 0,
  });

  // Step 3: Review & Submit
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Price matrix lookup ─────────────────────────────────────

  const fetchPrice = useCallback(async (category: string, lengthCm: number) => {
    setPriceLoading(true);
    setPriceError(null);
    try {
      const tierMap: Record<string, string> = {
        STANDARD: 'standard',
        LUXE: 'luxe',
        PLATINUM_EDITION: 'platinum',
        BABY_SHADES: 'baby_shades',
      };
      const tier = tierMap[category] || category.toLowerCase();
      const res = await fetch(`/api/price-matrix?category=${category}&tier=${tier}`);
      if (!res.ok) {
        setPriceError('Nepodařilo se načíst cenu z matice');
        setCurrentPricePerGram(null);
        return;
      }
      const entries = await res.json();
      const entry = entries.find((e: any) => e.lengthCm === lengthCm);
      if (entry) {
        setCurrentPricePerGram(entry.pricePerGramCzk);
      } else {
        setPriceError(`Cena pro ${category} ${lengthCm}cm nebyla nalezena v matici`);
        setCurrentPricePerGram(null);
      }
    } catch {
      setPriceError('Chyba při načítání ceny');
      setCurrentPricePerGram(null);
    } finally {
      setPriceLoading(false);
    }
  }, []);

  // Fetch price when category or length changes
  const handleConfigChange = (field: string, value: string | number) => {
    const updated = { ...currentItem, [field]: value };
    setCurrentItem(updated);
    if (field === 'category' || field === 'lengthCm') {
      fetchPrice(
        field === 'category' ? (value as string) : updated.category,
        field === 'lengthCm' ? (value as number) : updated.lengthCm
      );
    }
  };

  // Initial price fetch
  useState(() => {
    fetchPrice(currentItem.category, currentItem.lengthCm);
  });

  // ─── Calculate current item price ────────────────────────────

  const endingDef = ENDINGS.find((e) => e.value === currentItem.ending);
  const endingSurchargePerGram = endingDef?.surchargePerGram || 0;
  const currentEndingSurcharge = Math.round(endingSurchargePerGram * currentItem.grams);
  const currentBasePrice = currentPricePerGram
    ? Math.round(currentPricePerGram * currentItem.grams)
    : 0;
  const currentLineTotal = currentBasePrice + currentEndingSurcharge;

  // ─── Add item to list ────────────────────────────────────────

  function addItem() {
    if (!currentPricePerGram) {
      showToast('Cena za gram není k dispozici. Zkontrolujte matici cen.', 'error');
      return;
    }
    if (currentItem.grams <= 0) {
      showToast('Zadejte gramáž', 'error');
      return;
    }

    const newItem: ConfiguredItem = {
      id: generateId(),
      ...currentItem,
      pricePerGram: currentPricePerGram,
      endingSurcharge: currentEndingSurcharge,
      lineTotal: currentLineTotal,
    };

    setItems((prev) => [...prev, newItem]);
    showToast('Položka přidána', 'success');
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  // ─── Totals ──────────────────────────────────────────────────

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingCost =
    shipping.method === 'jiny'
      ? shipping.customPrice
      : SHIPPING_OPTIONS.find((o) => o.value === shipping.method)?.price || 0;
  const total = subtotal + shippingCost;

  // ─── Navigation ──────────────────────────────────────────────

  function canProceedToStep2() {
    return items.length > 0;
  }

  function canProceedToStep3() {
    return customer.name.trim() !== '' && customer.email.trim() !== '';
  }

  // ─── Submit ──────────────────────────────────────────────────

  async function handleSubmit() {
    if (items.length === 0) {
      showToast('Nejdříve přidejte položky', 'error');
      return;
    }
    if (!customer.name || !customer.email) {
      showToast('Vyplňte jméno a email zákazníka', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/pos/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone || undefined,
            street: customer.street || undefined,
            city: customer.city || undefined,
            zipCode: customer.zipCode || undefined,
          },
          items: items.map((item) => ({
            category: item.category,
            structure: item.structure,
            shade: item.shade,
            lengthCm: item.lengthCm,
            grams: item.grams,
            ending: item.ending,
            pricePerGram: item.pricePerGram,
            endingSurcharge: item.endingSurcharge,
            lineTotal: item.lineTotal,
          })),
          shipping: {
            method: shipping.method,
            customName: shipping.method === 'jiny' ? shipping.customName : undefined,
            price: shippingCost,
          },
          note: note || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Chyba při vytváření prodeje', 'error');
        return;
      }

      showToast(
        `Instagram prodej vytvořen! Celkem: ${formatPrice(data.order.total)}${
          data.invoice?.success ? ' — Faktura odeslána' : ''
        }`,
        'success'
      );

      // Redirect to orders
      router.push(`/admin/objednavky`);
    } catch (err: any) {
      showToast('Chyba: ' + (err.message || 'Neznámá chyba'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Render ──────────────────────────────────────────────────

  const inputClass =
    'w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none';
  const selectClass =
    'w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] outline-none bg-white';
  const labelClass = 'block text-sm font-medium text-stone-700 mb-1';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Nový prodej — Instagram</h1>
          <p className="text-sm text-stone-500 mt-1">
            Prodej přes Instagram (faktura, bankovní převod)
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Produkty' },
            { num: 2, label: 'Zákazník & Doprava' },
            { num: 3, label: 'Shrnutí' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <button
                onClick={() => {
                  if (s.num === 1) setStep(1);
                  else if (s.num === 2 && canProceedToStep2()) setStep(2);
                  else if (s.num === 3 && canProceedToStep2() && canProceedToStep3()) setStep(3);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  step === s.num
                    ? 'bg-[#722F37] text-white'
                    : step > s.num
                    ? 'bg-green-100 text-green-700'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s.num
                      ? 'bg-white/20'
                      : step > s.num
                      ? 'bg-green-200'
                      : 'bg-stone-200'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span className="hidden sm:inline text-sm font-medium">{s.label}</span>
              </button>
              {i < 2 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    step > s.num ? 'bg-green-300' : 'bg-stone-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Step 1: Product Configurator */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Configurator */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-stone-800">Konfigurátor produktu</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className={labelClass}>Kategorie</label>
                <select
                  value={currentItem.category}
                  onChange={(e) => handleConfigChange('category', e.target.value)}
                  className={selectClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Structure */}
              <div>
                <label className={labelClass}>Struktura</label>
                <select
                  value={currentItem.structure}
                  onChange={(e) => handleConfigChange('structure', e.target.value)}
                  className={selectClass}
                >
                  {STRUCTURES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shade */}
              <div>
                <label className={labelClass}>Odstín</label>
                <select
                  value={currentItem.shade}
                  onChange={(e) => handleConfigChange('shade', parseInt(e.target.value))}
                  className={selectClass}
                >
                  {SHADES.map((shade) => (
                    <option key={shade} value={shade}>
                      #{shade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Length */}
              <div>
                <label className={labelClass}>Délka (cm)</label>
                <select
                  value={currentItem.lengthCm}
                  onChange={(e) => handleConfigChange('lengthCm', parseInt(e.target.value))}
                  className={selectClass}
                >
                  {LENGTHS.map((len) => (
                    <option key={len} value={len}>
                      {len} cm
                    </option>
                  ))}
                </select>
              </div>

              {/* Grams */}
              <div>
                <label className={labelClass}>Gramáž (g)</label>
                <input
                  type="number"
                  min={10}
                  max={1000}
                  step={10}
                  value={currentItem.grams}
                  onChange={(e) =>
                    handleConfigChange('grams', Math.max(1, parseInt(e.target.value) || 0))
                  }
                  className={inputClass}
                />
              </div>

              {/* Ending */}
              <div>
                <label className={labelClass}>Zakončení</label>
                <select
                  value={currentItem.ending}
                  onChange={(e) => handleConfigChange('ending', e.target.value)}
                  className={selectClass}
                >
                  {ENDINGS.map((ending) => (
                    <option key={ending.value} value={ending.value}>
                      {ending.label} ({ending.surchargePerGram * 100} Kč/100g)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price calculation */}
            <div className="bg-stone-50 rounded-lg p-4 space-y-2">
              {priceLoading && (
                <p className="text-sm text-stone-500">Načítání ceny...</p>
              )}
              {priceError && (
                <p className="text-sm text-red-600">{priceError}</p>
              )}
              {currentPricePerGram && !priceLoading && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">Cena za gram:</span>
                    <span className="font-medium">{currentPricePerGram} Kč/g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">
                      Základ ({currentItem.grams}g × {currentPricePerGram} Kč):
                    </span>
                    <span className="font-medium">{formatPrice(currentBasePrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-600">
                      Zakončení ({currentItem.ending}, {endingSurchargePerGram} Kč/g × {currentItem.grams}g):
                    </span>
                    <span className="font-medium">{formatPrice(currentEndingSurcharge)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-stone-300 pt-2 mt-2">
                    <span>Celkem za položku:</span>
                    <span className="text-[#722F37]">{formatPrice(currentLineTotal)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Add button */}
            <button
              onClick={addItem}
              disabled={!currentPricePerGram || priceLoading}
              className="w-full py-3 bg-[#722F37] text-white rounded-lg font-medium hover:bg-[#5a252c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Přidat položku do objednávky
            </button>
          </div>

          {/* Items list */}
          {items.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">
                Položky objednávky ({items.length})
              </h2>

              <div className="divide-y divide-stone-200">
                {items.map((item) => {
                  const catLabel =
                    CATEGORIES.find((c) => c.value === item.category)?.label || item.category;
                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">
                          {catLabel} {item.structure} #{item.shade} — {item.lengthCm}cm
                        </p>
                        <p className="text-sm text-stone-500">
                          {item.grams}g · {item.ending} · {item.pricePerGram} Kč/g
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-stone-800">{formatPrice(item.lineTotal)}</p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Odebrat
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between text-lg font-bold border-t border-stone-200 pt-4">
                <span>Mezisoučet:</span>
                <span className="text-[#722F37]">{formatPrice(subtotal)}</span>
              </div>

              {/* Next step */}
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-[#722F37] text-white rounded-lg font-medium hover:bg-[#5a252c] transition-colors"
              >
                Pokračovat → Zákazník & Doprava
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Step 2: Customer & Shipping */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Customer info */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-stone-800">Zákazník</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Jméno a příjmení <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className={inputClass}
                  placeholder="Jana Nováková"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className={inputClass}
                  placeholder="jana@example.com"
                />
              </div>
              <div>
                <label className={labelClass}>Telefon</label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className={inputClass}
                  placeholder="+420 123 456 789"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Ulice</label>
                <input
                  type="text"
                  value={customer.street}
                  onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                  className={inputClass}
                  placeholder="Václavské nám. 1"
                />
              </div>
              <div>
                <label className={labelClass}>Město</label>
                <input
                  type="text"
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className={inputClass}
                  placeholder="Praha"
                />
              </div>
              <div>
                <label className={labelClass}>PSČ</label>
                <input
                  type="text"
                  value={customer.zipCode}
                  onChange={(e) => setCustomer({ ...customer, zipCode: e.target.value })}
                  className={inputClass}
                  placeholder="110 00"
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-stone-800">Doprava</h2>

            <div className="space-y-2">
              {SHIPPING_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    shipping.method === option.value
                      ? 'border-[#722F37] bg-[#722F37]/5'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={option.value}
                      checked={shipping.method === option.value}
                      onChange={(e) =>
                        setShipping({ ...shipping, method: e.target.value as ShippingData['method'] })
                      }
                      className="text-[#722F37] focus:ring-[#722F37]"
                    />
                    <span className="text-sm font-medium text-stone-700">{option.label}</span>
                  </div>
                  {option.value !== 'jiny' && (
                    <span className="text-sm font-medium text-stone-600">
                      {option.price === 0 ? 'Zdarma' : formatPrice(option.price)}
                    </span>
                  )}
                </label>
              ))}
            </div>

            {/* Custom shipping inputs */}
            {shipping.method === 'jiny' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pl-8">
                <div>
                  <label className={labelClass}>Název dopravce</label>
                  <input
                    type="text"
                    value={shipping.customName}
                    onChange={(e) => setShipping({ ...shipping, customName: e.target.value })}
                    className={inputClass}
                    placeholder="Název dopravce"
                  />
                </div>
                <div>
                  <label className={labelClass}>Cena dopravy (Kč)</label>
                  <input
                    type="number"
                    min={0}
                    value={shipping.customPrice}
                    onChange={(e) =>
                      setShipping({ ...shipping, customPrice: parseInt(e.target.value) || 0 })
                    }
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
            >
              ← Zpět
            </button>
            <button
              onClick={() => {
                if (canProceedToStep3()) {
                  setStep(3);
                } else {
                  showToast('Vyplňte jméno a email zákazníka', 'error');
                }
              }}
              className="flex-1 py-3 bg-[#722F37] text-white rounded-lg font-medium hover:bg-[#5a252c] transition-colors"
            >
              Pokračovat → Shrnutí
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* Step 3: Review & Submit */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Order summary */}
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-stone-800">Shrnutí objednávky</h2>

            {/* Customer summary */}
            <div className="bg-stone-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Zákazník
              </h3>
              <p className="text-sm text-stone-800 font-medium">{customer.name}</p>
              <p className="text-sm text-stone-600">{customer.email}</p>
              {customer.phone && <p className="text-sm text-stone-600">{customer.phone}</p>}
              {customer.street && (
                <p className="text-sm text-stone-600">
                  {customer.street}, {customer.city} {customer.zipCode}
                </p>
              )}
            </div>

            {/* Items summary */}
            <div>
              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                Položky
              </h3>
              <div className="divide-y divide-stone-200">
                {items.map((item) => {
                  const catLabel =
                    CATEGORIES.find((c) => c.value === item.category)?.label || item.category;
                  return (
                    <div key={item.id} className="py-2 flex justify-between text-sm">
                      <span className="text-stone-700">
                        {catLabel} {item.structure} #{item.shade} — {item.lengthCm}cm, {item.grams}g, {item.ending}
                      </span>
                      <span className="font-medium text-stone-800">{formatPrice(item.lineTotal)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping & total */}
            <div className="border-t border-stone-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Mezisoučet:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">
                  Doprava (
                  {shipping.method === 'jiny'
                    ? shipping.customName || 'Jiný dopravce'
                    : SHIPPING_OPTIONS.find((o) => o.value === shipping.method)?.label}
                  ):
                </span>
                <span className="font-medium">
                  {shippingCost === 0 ? 'Zdarma' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-stone-300 pt-2">
                <span>Celkem:</span>
                <span className="text-[#722F37]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                💳 Platba: <strong>Bankovní převod (faktura)</strong> — Fakturoid faktura bude
                automaticky vytvořena a odeslána zákazníkovi na email.
              </p>
            </div>

            {/* Note */}
            <div>
              <label className={labelClass}>Interní poznámka (volitelné)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Poznámka k objednávce..."
              />
            </div>
          </div>

          {/* Navigation & Submit */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
            >
              ← Zpět
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-4 bg-[#722F37] text-white rounded-lg font-bold text-lg hover:bg-[#5a252c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Vytvářím prodej...
                </span>
              ) : (
                `Vytvořit prodej — ${formatPrice(total)}`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
