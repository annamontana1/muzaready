'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';

// ─── Types ──────────────────────────────────────────────────────

type Channel = 'prodejna' | 'instagram' | 'eshop';
type CustomerType = 'anonymous' | 'new' | 'b2b';
type PaymentMethod = 'hotovost' | 'karta' | 'prevod' | 'gopay';

type Category = 'standard' | 'luxe' | 'platinum_edition' | 'baby_shades';
type ProductType = 'barvene' | 'nebarvene';
type Structure = 'rovne' | 'vlnite' | 'mirne_vlnite' | 'kudrnate';
type Ending = 'bez' | 'keratin' | 'mikrokeratin' | 'pasky_keratinu' | 'weft' | 'tapes';

interface ProductConfig {
  category: Category;
  productType: ProductType;
  structure: Structure;
  shadeCode: string;
  lengthCm: number;
  ending: Ending;
  grams: number;
}

interface CartItem {
  id: string;
  config: ProductConfig;
  label: string;
  pricePerGram: number;
  endingPricePerGram: number;
  subtotal: number;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  ico: string;
  contactPerson: string;
}

interface ShippingOption {
  carrier: string;
  price: number;
  customPrice?: number;
}

// ─── Constants ──────────────────────────────────────────────────

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'luxe', label: 'Luxe' },
  { value: 'platinum_edition', label: 'Platinum Edition' },
  { value: 'baby_shades', label: 'Baby Shades' },
];

const TYPE_OPTIONS: { value: ProductType; label: string }[] = [
  { value: 'barvene', label: 'Barvené' },
  { value: 'nebarvene', label: 'Nebarvené' },
];

const STRUCTURE_OPTIONS: { value: Structure; label: string }[] = [
  { value: 'rovne', label: 'Rovné' },
  { value: 'vlnite', label: 'Vlnité' },
  { value: 'mirne_vlnite', label: 'Mírně vlnité' },
  { value: 'kudrnate', label: 'Kudrnaté' },
];

const ENDING_OPTIONS: { value: Ending; label: string; pricePerGram: number }[] = [
  { value: 'bez', label: 'Bez zakončení', pricePerGram: 0 },
  { value: 'keratin', label: 'Keratin (+10 Kč/g)', pricePerGram: 10 },
  { value: 'mikrokeratin', label: 'Mikrokeratin (+10 Kč/g)', pricePerGram: 10 },
  { value: 'pasky_keratinu', label: 'Pásky keratinu (+10 Kč/g)', pricePerGram: 10 },
  { value: 'weft', label: 'Weft (+50 Kč/g)', pricePerGram: 50 },
  { value: 'tapes', label: 'Tapes (+50 Kč/g)', pricePerGram: 50 },
];

const LENGTH_OPTIONS = Array.from({ length: 11 }, (_, i) => 30 + i * 5); // 30-80

const SHIPPING_OPTIONS: { carrier: string; label: string; price: number }[] = [
  { carrier: 'zasilkovna', label: 'Zásilkovna', price: 89 },
  { carrier: 'dpd', label: 'DPD', price: 68 },
  { carrier: 'ppl', label: 'PPL', price: 79 },
  { carrier: 'jiny', label: 'Jiný dopravce', price: 0 },
  { carrier: 'osobni', label: 'Osobní odběr', price: 0 },
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

function getShadeRange(category: Category, productType: ProductType): string[] {
  let start: number;
  let end: number;

  if (category === 'baby_shades') {
    start = 6;
    end = 10;
  } else if (category === 'platinum_edition') {
    start = 1;
    end = 10;
  } else {
    // standard, luxe
    if (productType === 'nebarvene') {
      start = 1;
      end = 6;
    } else {
      start = 1;
      end = 10;
    }
  }

  return Array.from({ length: end - start + 1 }, (_, i) => String(start + i));
}

function getEndingPricePerGram(ending: Ending): number {
  const opt = ENDING_OPTIONS.find((e) => e.value === ending);
  return opt?.pricePerGram ?? 0;
}

function buildProductLabel(config: ProductConfig): string {
  const cat = CATEGORY_OPTIONS.find((c) => c.value === config.category)?.label ?? '';
  const typ = TYPE_OPTIONS.find((t) => t.value === config.productType)?.label ?? '';
  const str = STRUCTURE_OPTIONS.find((s) => s.value === config.structure)?.label ?? '';
  const end = ENDING_OPTIONS.find((e) => e.value === config.ending)?.label?.split(' (')[0] ?? '';
  return `${cat} ${typ} ${str} #${config.shadeCode} ${config.lengthCm}cm${config.ending !== 'bez' ? ' / ' + end : ''}`;
}

// ─── Component ──────────────────────────────────────────────────

export default function UnifiedNewSalePage() {
  const router = useRouter();
  const { showToast } = useToast();

  // 1. Channel
  const [channel, setChannel] = useState<Channel>('prodejna');

  // 2. Customer
  const [customerType, setCustomerType] = useState<CustomerType>('anonymous');
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    ico: '',
    contactPerson: '',
  });

  // 3. Product builder
  const [productCategory, setProductCategory] = useState<Category>('standard');
  const [productType, setProductType] = useState<ProductType>('barvene');
  const [productStructure, setProductStructure] = useState<Structure>('rovne');
  const [productShade, setProductShade] = useState<string>('1');
  const [productLength, setProductLength] = useState<number>(50);
  const [productEnding, setProductEnding] = useState<Ending>('bez');
  const [productGrams, setProductGrams] = useState<number>(100);

  // Price check result
  const [priceCheck, setPriceCheck] = useState<{ pricePerGram: number; endingPrice: number; subtotal: number } | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);

  // 4. Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // 5. Discount
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // 6. Shipping (Instagram only)
  const [shipping, setShipping] = useState<ShippingOption>({ carrier: 'zasilkovna', price: 89 });
  const [customShippingPrice, setCustomShippingPrice] = useState<number>(0);

  // 8. Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('hotovost');

  // Submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Derived values ──────────────────────────────────────────

  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const discountAmount = Math.round(cartSubtotal * (discountPercent / 100));
  const shippingCost = channel === 'instagram' ? (shipping.carrier === 'jiny' ? customShippingPrice : shipping.price) : 0;
  const grandTotal = cartSubtotal - discountAmount + shippingCost;

  // ─── Price Check ─────────────────────────────────────────────

  const fetchPrice = useCallback(async () => {
    setPriceLoading(true);
    setPriceError(null);
    setPriceCheck(null);

    try {
      const params = new URLSearchParams({
        category: productType, // barvene / nebarvene
        tier: productCategory,  // standard / luxe / platinum_edition / baby_shades
        lengthCm: String(productLength),
      });
      const res = await fetch(`/api/admin/pos/price-check?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setPriceError(data.error || 'Cena nebyla nalezena');
        return;
      }

      const ppg = data.pricePerGramCzk;
      const epg = getEndingPricePerGram(productEnding);
      setPriceCheck({
        pricePerGram: ppg,
        endingPrice: epg * productGrams,
        subtotal: Math.round((ppg + epg) * productGrams),
      });
    } catch {
      setPriceError('Chyba při načítání ceny');
    } finally {
      setPriceLoading(false);
    }
  }, [productCategory, productType, productLength, productEnding, productGrams]);

  // ─── Reset shade when category/type changes ──────────────────

  function handleCategoryChange(cat: Category) {
    setProductCategory(cat);
    const shades = getShadeRange(cat, productType);
    if (!shades.includes(productShade)) setProductShade(shades[0]);
    setPriceCheck(null);
  }

  function handleTypeChange(typ: ProductType) {
    setProductType(typ);
    const shades = getShadeRange(productCategory, typ);
    if (!shades.includes(productShade)) setProductShade(shades[0]);
    setPriceCheck(null);
  }

  // ─── Add to Cart ─────────────────────────────────────────────

  function addToCart() {
    if (!priceCheck) {
      showToast('Nejprve zkontrolujte cenu', 'error');
      return;
    }
    if (productGrams < 1) {
      showToast('Zadejte gramáž minimálně 1g', 'error');
      return;
    }

    const config: ProductConfig = {
      category: productCategory,
      productType,
      structure: productStructure,
      shadeCode: productShade,
      lengthCm: productLength,
      ending: productEnding,
      grams: productGrams,
    };

    const newItem: CartItem = {
      id: crypto.randomUUID(),
      config,
      label: buildProductLabel(config),
      pricePerGram: priceCheck.pricePerGram,
      endingPricePerGram: getEndingPricePerGram(productEnding),
      subtotal: priceCheck.subtotal,
    };

    setCart((prev) => [...prev, newItem]);
    setPriceCheck(null);
    showToast('Položka přidána do košíku', 'success');
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  // ─── Channel change effects ──────────────────────────────────

  function handleChannelChange(ch: Channel) {
    setChannel(ch);
    // Reset payment to default for new channel
    if (ch === 'prodejna') setPaymentMethod('hotovost');
    else if (ch === 'instagram') setPaymentMethod('prevod');
    else setPaymentMethod('gopay');
  }

  // ─── Submit ──────────────────────────────────────────────────

  async function handleSubmit() {
    if (cart.length === 0) {
      showToast('Nejdříve přidejte položky do košíku', 'error');
      return;
    }

    if (channel === 'eshop') {
      showToast('E-shop objednávky přicházejí automaticky', 'info');
      return;
    }

    setIsSubmitting(true);

    try {
      const channelMap: Record<Channel, string> = {
        prodejna: 'store',
        instagram: 'instagram',
        eshop: 'eshop',
      };

      const body = {
        channel: channelMap[channel],
        customerType: customerType === 'b2b' ? 'b2b' : customerType === 'new' ? 'new' : 'anonymous',
        customer: customerType === 'anonymous'
          ? {}
          : customerType === 'new'
            ? {
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
              }
            : {
                companyName: customer.companyName,
                ico: customer.ico,
                firstName: customer.contactPerson,
                email: customer.email,
                phone: customer.phone,
              },
        items: cart.map((item) => ({
          category: item.config.category,
          shadeCode: item.config.shadeCode,
          structure: item.config.structure,
          lengthCm: item.config.lengthCm,
          ending: item.config.ending,
          grams: item.config.grams,
          pricePerGram: item.pricePerGram,
          endingPricePerGram: item.endingPricePerGram,
          productType: item.config.productType,
        })),
        discountPercent,
        shipping: channel === 'instagram'
          ? { carrier: shipping.carrier, price: shippingCost }
          : null,
        paymentMethod,
      };

      const res = await fetch('/api/admin/pos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Chyba při vytváření prodeje', 'error');
        return;
      }

      showToast('Prodej byl úspěšně vytvořen', 'success');

      // Redirect based on channel + payment
      const orderId = data.order?.id;
      if (channel === 'prodejna' && paymentMethod === 'hotovost') {
        router.push(`/admin/prodeje/doklad?id=${orderId}`);
      } else {
        router.push('/admin/objednavky');
      }
    } catch (error: any) {
      showToast('Chyba: ' + (error.message || 'Neznámá chyba'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  // ─── Render helpers ──────────────────────────────────────────

  const sectionClass = 'bg-white rounded-xl shadow-sm p-6 mb-6';
  const labelClass = 'block text-sm font-medium text-stone-700 mb-1';
  const inputClass = 'w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/30 focus:border-[#722F37]';
  const selectClass = inputClass;
  const btnPrimary = 'bg-[#722F37] hover:bg-[#5a252c] text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const btnOutline = 'border border-stone-300 hover:bg-stone-50 text-stone-700 font-medium px-4 py-2 rounded-lg transition-colors';

  const shadeOptions = getShadeRange(productCategory, productType);

  // ─── JSX ─────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Nový prodej</h1>

      {/* ── 1. KANÁL ──────────────────────────────────────────── */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Kanál</h2>
        <div className="flex gap-3">
          {([
            { value: 'prodejna' as Channel, icon: '\ud83c\udfea', label: 'Prodejna' },
            { value: 'instagram' as Channel, icon: '\ud83d\udcf8', label: 'Instagram' },
            { value: 'eshop' as Channel, icon: '\ud83c\udf10', label: 'E-shop' },
          ]).map((ch) => (
            <button
              key={ch.value}
              type="button"
              onClick={() => handleChannelChange(ch.value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 font-medium transition-all ${
                channel === ch.value
                  ? 'border-[#722F37] bg-[#722F37]/5 text-[#722F37]'
                  : 'border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              <span className="text-xl">{ch.icon}</span>
              {ch.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. ZÁKAZNÍK ──────────────────────────────────────── */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Zákazník</h2>

        {/* Toggle */}
        <div className="flex gap-2 mb-4">
          {([
            { value: 'anonymous' as CustomerType, label: 'Anonymní' },
            { value: 'new' as CustomerType, label: 'Nový zákazník' },
            { value: 'b2b' as CustomerType, label: 'Firma (B2B)' },
          ]).map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setCustomerType(ct.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                customerType === ct.value
                  ? 'bg-[#722F37] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>

        {/* New customer fields */}
        {customerType === 'new' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Jméno</label>
              <input
                className={inputClass}
                value={customer.firstName}
                onChange={(e) => setCustomer((p) => ({ ...p, firstName: e.target.value }))}
                placeholder="Jméno a příjmení"
              />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                className={inputClass}
                value={customer.email}
                onChange={(e) => setCustomer((p) => ({ ...p, email: e.target.value }))}
                placeholder="email@example.cz"
              />
            </div>
            <div>
              <label className={labelClass}>Telefon</label>
              <input
                type="tel"
                className={inputClass}
                value={customer.phone}
                onChange={(e) => setCustomer((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+420..."
              />
            </div>
          </div>
        )}

        {/* B2B fields */}
        {customerType === 'b2b' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Název firmy</label>
              <input
                className={inputClass}
                value={customer.companyName}
                onChange={(e) => setCustomer((p) => ({ ...p, companyName: e.target.value }))}
                placeholder="Název firmy"
              />
            </div>
            <div>
              <label className={labelClass}>IČO</label>
              <input
                className={inputClass}
                value={customer.ico}
                onChange={(e) => setCustomer((p) => ({ ...p, ico: e.target.value }))}
                placeholder="12345678"
              />
            </div>
            <div>
              <label className={labelClass}>Kontaktní osoba</label>
              <input
                className={inputClass}
                value={customer.contactPerson}
                onChange={(e) => setCustomer((p) => ({ ...p, contactPerson: e.target.value }))}
                placeholder="Jméno kontaktu"
              />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                className={inputClass}
                value={customer.email}
                onChange={(e) => setCustomer((p) => ({ ...p, email: e.target.value }))}
                placeholder="firma@example.cz"
              />
            </div>
            <div>
              <label className={labelClass}>Telefon</label>
              <input
                type="tel"
                className={inputClass}
                value={customer.phone}
                onChange={(e) => setCustomer((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+420..."
              />
            </div>
          </div>
        )}

        {customerType === 'anonymous' && (
          <p className="text-sm text-stone-500 italic">Bez záznamu zákazníka</p>
        )}
      </div>

      {/* ── 3. PRODUKTY ────────────────────────────────────────── */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Produkty</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          {/* Kategorie */}
          <div>
            <label className={labelClass}>Kategorie</label>
            <select
              className={selectClass}
              value={productCategory}
              onChange={(e) => handleCategoryChange(e.target.value as Category)}
            >
              {CATEGORY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Typ */}
          <div>
            <label className={labelClass}>Typ</label>
            <select
              className={selectClass}
              value={productType}
              onChange={(e) => handleTypeChange(e.target.value as ProductType)}
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Struktura */}
          <div>
            <label className={labelClass}>Struktura</label>
            <select
              className={selectClass}
              value={productStructure}
              onChange={(e) => { setProductStructure(e.target.value as Structure); setPriceCheck(null); }}
            >
              {STRUCTURE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Odstín */}
          <div>
            <label className={labelClass}>Odstín</label>
            <select
              className={selectClass}
              value={productShade}
              onChange={(e) => { setProductShade(e.target.value); setPriceCheck(null); }}
            >
              {shadeOptions.map((s) => (
                <option key={s} value={s}>#{s}</option>
              ))}
            </select>
          </div>

          {/* Délka */}
          <div>
            <label className={labelClass}>Délka (cm)</label>
            <select
              className={selectClass}
              value={productLength}
              onChange={(e) => { setProductLength(Number(e.target.value)); setPriceCheck(null); }}
            >
              {LENGTH_OPTIONS.map((l) => (
                <option key={l} value={l}>{l} cm</option>
              ))}
            </select>
          </div>

          {/* Zakončení */}
          <div>
            <label className={labelClass}>Zakončení</label>
            <select
              className={selectClass}
              value={productEnding}
              onChange={(e) => { setProductEnding(e.target.value as Ending); setPriceCheck(null); }}
            >
              {ENDING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gramáž */}
        <div className="flex items-end gap-4 mb-4">
          <div className="w-40">
            <label className={labelClass}>Gramáž (g)</label>
            <input
              type="number"
              min={1}
              step={1}
              className={inputClass}
              value={productGrams}
              onChange={(e) => { setProductGrams(Math.max(1, Number(e.target.value))); setPriceCheck(null); }}
            />
          </div>
          <button
            type="button"
            onClick={fetchPrice}
            disabled={priceLoading}
            className={btnOutline}
          >
            {priceLoading ? 'Načítám...' : 'Zkontrolovat cenu'}
          </button>
        </div>

        {/* Price result */}
        {priceError && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {priceError}
          </div>
        )}

        {priceCheck && (
          <div className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-3 mb-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Cena z matice:</span>
              <span className="font-medium">{formatPrice(priceCheck.pricePerGram)} / g</span>
            </div>
            {priceCheck.endingPrice > 0 && (
              <div className="flex justify-between">
                <span className="text-stone-600">Zakončení:</span>
                <span className="font-medium">+{formatPrice(priceCheck.endingPrice)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-stone-200 pt-1 mt-1">
              <span className="text-stone-700 font-semibold">Mezisoučet:</span>
              <span className="font-bold text-[#722F37]">{formatPrice(priceCheck.subtotal)}</span>
            </div>
          </div>
        )}

        {/* Add to cart button */}
        <button
          type="button"
          onClick={addToCart}
          disabled={!priceCheck}
          className={btnPrimary}
        >
          + Přidat položku
        </button>
      </div>

      {/* ── 4. KOŠÍK ────────────────────────────────────────────── */}
      {cart.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Košík ({cart.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-left text-stone-500">
                  <th className="pb-2 font-medium">Produkt</th>
                  <th className="pb-2 font-medium text-right">Gramáž</th>
                  <th className="pb-2 font-medium text-right">Cena/g</th>
                  <th className="pb-2 font-medium text-right">Zakončení</th>
                  <th className="pb-2 font-medium text-right">Celkem</th>
                  <th className="pb-2 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b border-stone-100">
                    <td className="py-2 text-stone-700">{item.label}</td>
                    <td className="py-2 text-right text-stone-600">{item.config.grams} g</td>
                    <td className="py-2 text-right text-stone-600">{formatPrice(item.pricePerGram)}</td>
                    <td className="py-2 text-right text-stone-600">
                      {item.endingPricePerGram > 0 ? `+${formatPrice(item.endingPricePerGram * item.config.grams)}` : '—'}
                    </td>
                    <td className="py-2 text-right font-medium text-stone-800">{formatPrice(item.subtotal)}</td>
                    <td className="py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Odebrat"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-stone-300">
                  <td colSpan={4} className="py-3 text-right font-semibold text-stone-700">Celkem produkty:</td>
                  <td className="py-3 text-right font-bold text-stone-800">{formatPrice(cartSubtotal)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── 5. SLEVA ───────────────────────────────────────────── */}
      {cart.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Sleva</h2>
          <div className="flex items-center gap-4">
            <div className="w-32">
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                className={inputClass}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
                placeholder="0"
              />
            </div>
            <span className="text-stone-600 text-sm font-medium">%</span>
            {discountPercent > 0 && (
              <span className="text-sm text-red-600 font-medium">
                −{formatPrice(discountAmount)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── 6. DOPRAVA (Instagram only) ────────────────────────── */}
      {channel === 'instagram' && cart.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Doprava</h2>
          <div className="space-y-2">
            {SHIPPING_OPTIONS.map((opt) => (
              <label
                key={opt.carrier}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  shipping.carrier === opt.carrier
                    ? 'border-[#722F37] bg-[#722F37]/5'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  checked={shipping.carrier === opt.carrier}
                  onChange={() => setShipping({ carrier: opt.carrier, price: opt.price })}
                  className="accent-[#722F37]"
                />
                <span className="flex-1 text-sm text-stone-700">{opt.label}</span>
                {opt.carrier === 'jiny' ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      className="w-20 border border-stone-300 rounded px-2 py-1 text-sm text-right"
                      value={customShippingPrice}
                      onChange={(e) => setCustomShippingPrice(Number(e.target.value))}
                      onClick={(e) => { e.stopPropagation(); setShipping({ carrier: 'jiny', price: 0 }); }}
                    />
                    <span className="text-sm text-stone-500">Kč</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-stone-600">
                    {opt.price === 0 ? 'Zdarma' : `${opt.price} Kč`}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. SOUHRN ──────────────────────────────────────────── */}
      {cart.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Souhrn</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-600">Produkty:</span>
              <span className="font-medium">{formatPrice(cartSubtotal)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Sleva {discountPercent}%:</span>
                <span className="font-medium">−{formatPrice(discountAmount)}</span>
              </div>
            )}
            {channel === 'instagram' && (
              <div className="flex justify-between">
                <span className="text-stone-600">Doprava:</span>
                <span className="font-medium">+{formatPrice(shippingCost)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-stone-200 pt-3 mt-3">
              <span className="text-lg font-bold text-stone-800">CELKEM:</span>
              <span className="text-lg font-bold text-[#722F37]">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. PLATBA ──────────────────────────────────────────── */}
      {cart.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Platba</h2>

          {channel === 'prodejna' && (
            <div className="flex gap-3">
              {(['hotovost', 'karta'] as PaymentMethod[]).map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all text-sm ${
                    paymentMethod === pm
                      ? 'border-[#722F37] bg-[#722F37]/5 text-[#722F37]'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {pm === 'hotovost' ? 'Hotovost' : 'Karta'}
                </button>
              ))}
            </div>
          )}

          {channel === 'instagram' && (
            <div className="bg-stone-50 rounded-lg px-4 py-3 text-sm text-stone-600">
              <span className="font-medium text-stone-700">Převod na účet</span>
              <span className="ml-2 text-stone-500">— bude vygenerována proforma faktura</span>
            </div>
          )}

          {channel === 'eshop' && (
            <div className="bg-stone-50 rounded-lg px-4 py-3 text-sm text-stone-500 italic">
              GoPay — E-shop objednávky přicházejí automaticky
            </div>
          )}
        </div>
      )}

      {/* ── 9. SUBMIT ──────────────────────────────────────────── */}
      {cart.length > 0 && channel !== 'eshop' && (
        <div className="flex justify-end mb-12">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || cart.length === 0}
            className={`${btnPrimary} text-base px-8 py-3`}
          >
            {isSubmitting ? 'Vytvářím...' : (
              <>
                \ud83d\udcc4 Vytvořit prodej
                {channel === 'instagram' && ' + odeslat fakturu'}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
