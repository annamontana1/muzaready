'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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
  dic: string;
  contactPerson: string;
  street: string;
  city: string;
  zipCode: string;
}

interface ShippingOption {
  carrier: string;
  price: number;
  customPrice?: number;
}

interface CustomerSuggestion {
  source: 'registered' | 'order';
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  ico: string;
  isB2B: boolean;
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
    dic: '',
    contactPerson: '',
    street: '',
    city: '',
    zipCode: '',
  });

  // ARES lookup
  const [aresLoading, setAresLoading] = useState(false);

  async function fetchAres() {
    const ico = customer.ico.trim();
    if (!/^\d{8}$/.test(ico)) {
      showToast('IČO musí mít 8 číslic', 'error');
      return;
    }
    setAresLoading(true);
    try {
      const res = await fetch(`/api/ares?ico=${ico}`);
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Firma nenalezena v ARES', 'error');
        return;
      }
      setCustomer((prev) => ({
        ...prev,
        companyName: data.companyName || prev.companyName,
        dic: data.dic || prev.dic,
        street: data.street || prev.street,
        city: data.city || prev.city,
        zipCode: data.zipCode || prev.zipCode,
      }));
      showToast(`Načteno z ARES: ${data.companyName}`, 'success');
    } catch {
      showToast('Chyba při dotazu na ARES', 'error');
    } finally {
      setAresLoading(false);
    }
  }

  // Autocomplete zákazníků
  const [customerQuery, setCustomerQuery] = useState('');
  const [customerSuggestions, setCustomerSuggestions] = useState<CustomerSuggestion[]>([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const customerSearchRef = useRef<HTMLDivElement>(null);

  // Zavřít dropdown při kliknutí mimo
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (customerSearchRef.current && !customerSearchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (customerQuery.length < 2) {
      setCustomerSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setCustomerSearchLoading(true);
      try {
        const res = await fetch(`/api/admin/pos/customer-search?q=${encodeURIComponent(customerQuery)}`);
        const data = await res.json();
        setCustomerSuggestions(data.customers || []);
        setShowSuggestions(true);
      } catch {
        setCustomerSuggestions([]);
      } finally {
        setCustomerSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [customerQuery]);

  function selectCustomer(s: CustomerSuggestion) {
    setCustomer({
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      phone: s.phone,
      companyName: s.companyName,
      ico: s.ico,
      dic: '',
      contactPerson: s.companyName ? s.firstName + ' ' + s.lastName : '',
      street: '',
      city: '',
      zipCode: '',
    });
    if (s.isB2B) setCustomerType('b2b');
    else setCustomerType('new');
    setCustomerQuery(s.companyName || `${s.firstName} ${s.lastName}`.trim());
    setShowSuggestions(false);
  }

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
  // Ruční zadání ceny (když není v matici)
  const [manualPricePerGram, setManualPricePerGram] = useState<number>(0);

  // 4. Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // 5. Discount
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // 6. Shipping (Instagram only)
  const [shipping, setShipping] = useState<ShippingOption>({ carrier: 'zasilkovna', price: 89 });
  const [customShippingPrice, setCustomShippingPrice] = useState<number>(0);

  // 8. Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('hotovost');

  // Faktura
  const [invoiceType, setInvoiceType] = useState<'fakturoid' | 'uctenka' | null>(null);

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
    setPriceError(null);
    setManualPricePerGram(0);
  }

  function handleTypeChange(typ: ProductType) {
    setProductType(typ);
    const shades = getShadeRange(productCategory, typ);
    if (!shades.includes(productShade)) setProductShade(shades[0]);
    setPriceCheck(null);
    setPriceError(null);
    setManualPricePerGram(0);
  }

  function applyManualPrice() {
    if (manualPricePerGram <= 0) return;
    const epg = getEndingPricePerGram(productEnding);
    setPriceCheck({
      pricePerGram: manualPricePerGram,
      endingPrice: epg * productGrams,
      subtotal: Math.round((manualPricePerGram + epg) * productGrams),
    });
    setPriceError(null);
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
    if (ch === 'prodejna') setPaymentMethod('hotovost');
    else if (ch === 'instagram') setPaymentMethod('prevod');
    else setPaymentMethod('hotovost');
    setInvoiceType(null);
  }

  // ─── Submit ──────────────────────────────────────────────────

  async function handleSubmit() {
    if (cart.length === 0) {
      showToast('Nejdříve přidejte položky do košíku', 'error');
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
        invoiceType: invoiceType || 'uctenka',
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

      const orderId = data.order?.id;
      if (invoiceType === 'uctenka') {
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

        {/* Vyhledat zákazníka */}
        <div className="relative mb-4" ref={customerSearchRef}>
          <label className={labelClass}>Vyhledat zákazníka (jméno, email, firma, IČO…)</label>
          <div className="relative">
            <input
              type="text"
              className={inputClass + ' pr-8'}
              value={customerQuery}
              onChange={(e) => { setCustomerQuery(e.target.value); if (!e.target.value) setShowSuggestions(false); }}
              onFocus={() => { if (customerSuggestions.length > 0) setShowSuggestions(true); }}
              placeholder="Začněte psát…"
              autoComplete="off"
            />
            {customerSearchLoading && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">⏳</span>
            )}
            {customerQuery && !customerSearchLoading && (
              <button
                type="button"
                onClick={() => { setCustomerQuery(''); setCustomerSuggestions([]); setShowSuggestions(false); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-lg leading-none"
              >×</button>
            )}
          </div>

          {/* Dropdown výsledků */}
          {showSuggestions && customerSuggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
              {customerSuggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); selectCustomer(s); }}
                  className="w-full text-left px-4 py-3 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="font-medium text-stone-800">
                        {s.companyName || `${s.firstName} ${s.lastName}`.trim()}
                      </span>
                      {s.companyName && (
                        <span className="text-stone-500 text-xs ml-2">
                          {s.firstName} {s.lastName}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.isB2B ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {s.isB2B ? 'B2B' : 'B2C'}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5 flex gap-3">
                    {s.email && <span>{s.email}</span>}
                    {s.phone && <span>{s.phone}</span>}
                    {s.ico && <span>IČO: {s.ico}</span>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showSuggestions && customerQuery.length >= 2 && customerSuggestions.length === 0 && !customerSearchLoading && (
            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-lg px-4 py-3 text-sm text-stone-500">
              Žádný zákazník nenalezen — vyplňte níže jako nového
            </div>
          )}
        </div>

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
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  value={customer.ico}
                  onChange={(e) => setCustomer((p) => ({ ...p, ico: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
                  placeholder="12345678"
                  maxLength={8}
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={fetchAres}
                  disabled={aresLoading || customer.ico.length !== 8}
                  className="shrink-0 bg-stone-700 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                  title="Načíst údaje z ARES"
                >
                  {aresLoading ? '⏳' : '🔍 ARES'}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>DIČ</label>
              <input
                className={inputClass}
                value={customer.dic}
                onChange={(e) => setCustomer((p) => ({ ...p, dic: e.target.value }))}
                placeholder="CZ12345678"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Ulice a číslo popisné</label>
              <input
                className={inputClass}
                value={customer.street}
                onChange={(e) => setCustomer((p) => ({ ...p, street: e.target.value }))}
                placeholder="Např. Šrámkova 430/12"
              />
            </div>
            <div>
              <label className={labelClass}>Město</label>
              <input
                className={inputClass}
                value={customer.city}
                onChange={(e) => setCustomer((p) => ({ ...p, city: e.target.value }))}
                placeholder="Praha"
              />
            </div>
            <div>
              <label className={labelClass}>PSČ</label>
              <input
                className={inputClass}
                value={customer.zipCode}
                onChange={(e) => setCustomer((p) => ({ ...p, zipCode: e.target.value }))}
                placeholder="11000"
                inputMode="numeric"
                maxLength={5}
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
              onChange={(e) => { setProductStructure(e.target.value as Structure); setPriceCheck(null); setPriceError(null); setManualPricePerGram(0); }}
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
              onChange={(e) => { setProductShade(e.target.value); setPriceCheck(null); setPriceError(null); setManualPricePerGram(0); }}
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
              onChange={(e) => { setProductLength(Number(e.target.value)); setPriceCheck(null); setPriceError(null); setManualPricePerGram(0); }}
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
              onChange={(e) => { setProductEnding(e.target.value as Ending); setPriceCheck(null); setPriceError(null); setManualPricePerGram(0); }}
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
              onChange={(e) => { setProductGrams(Math.max(1, Number(e.target.value))); setPriceCheck(null); setPriceError(null); setManualPricePerGram(0); }}
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
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-amber-800 text-sm font-medium mb-2">
              ⚠️ {priceError} — zadejte cenu ručně:
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  className="w-28 border border-amber-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={manualPricePerGram || ''}
                  onChange={(e) => setManualPricePerGram(Number(e.target.value))}
                  placeholder="0"
                />
                <span className="text-sm text-stone-600">Kč / g</span>
              </div>
              <button
                type="button"
                onClick={applyManualPrice}
                disabled={manualPricePerGram <= 0}
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-40"
              >
                Použít tuto cenu
              </button>
            </div>
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
            <div className="flex gap-3">
              {(['hotovost', 'karta', 'prevod'] as PaymentMethod[]).map((pm) => (
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
                  {pm === 'hotovost' ? 'Hotovost' : pm === 'karta' ? 'Karta' : 'Převod'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 9. FAKTURA ──────────────────────────────────────── */}
      {cart.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Chce zákazník fakturu?</h2>
          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() => setInvoiceType('fakturoid')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                invoiceType === 'fakturoid'
                  ? 'border-[#722F37] bg-[#722F37]/5'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-2xl">🧾</span>
              <span className={`font-semibold text-sm ${invoiceType === 'fakturoid' ? 'text-[#722F37]' : 'text-stone-800'}`}>
                ANO — s fakturou
              </span>
              <span className="text-xs text-stone-500 text-center leading-snug">
                Oficiální faktura přes Fakturoid
              </span>
            </button>

            <button
              type="button"
              onClick={() => setInvoiceType('uctenka')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                invoiceType === 'uctenka'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className="text-2xl">📋</span>
              <span className={`font-semibold text-sm ${invoiceType === 'uctenka' ? 'text-blue-700' : 'text-stone-800'}`}>
                NE — bez faktury
              </span>
              <span className="text-xs text-stone-500 text-center leading-snug">
                Jednoduchý pokladní doklad
              </span>
            </button>

          </div>

          {invoiceType === 'fakturoid' && (
            <p className="mt-3 text-xs text-[#722F37] bg-[#722F37]/5 border border-[#722F37]/20 rounded-lg px-3 py-2">
              ✅ Fakturoid faktura bude vytvořena a zákazník ji dostane emailem
            </p>
          )}
          {invoiceType === 'uctenka' && (
            <p className="mt-3 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              📋 Po uložení se otevře jednoduchý pokladní doklad k vytisknutí
            </p>
          )}
        </div>
      )}

      {/* ── 10. NÁHLED OBJEDNÁVKY ─────────────────────────────── */}
      {cart.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-lg font-semibold text-stone-800 mb-4">📋 Náhled objednávky</h2>
          <div className="bg-stone-50 rounded-xl p-6 space-y-4 text-sm">
            {/* Channel + Customer */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-stone-500 block mb-1">Kanál</span>
                <span className="font-medium text-stone-800">
                  {channel === 'prodejna' ? '🏪 Prodejna' : channel === 'instagram' ? '📸 Instagram' : '🌐 E-shop'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block mb-1">Zákazník</span>
                <span className="font-medium text-stone-800">
                  {customerType === 'anonymous' ? 'Anonymní' : (
                    <>
                      {customer.companyName || customer.firstName || 'Nový zákazník'}
                      {customer.email && <span className="text-stone-500 ml-1">({customer.email})</span>}
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Items */}
            <div>
              <span className="text-stone-500 block mb-2">Položky</span>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-stone-200">
                    <div>
                      <span className="font-medium text-stone-700">{item.label}</span>
                      <span className="text-stone-500 ml-2">{item.config.grams}g</span>
                      {item.config.ending !== 'bez' && (
                        <span className="text-stone-400 ml-1 text-xs">
                          + {ENDING_OPTIONS.find(e => e.value === item.config.ending)?.label.split(' (')[0]}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-stone-800">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-stone-200 pt-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-600">Produkty:</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Sleva {discountPercent}%:</span>
                  <span>−{formatPrice(discountAmount)}</span>
                </div>
              )}
              {channel === 'instagram' && shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-stone-600">Doprava ({SHIPPING_OPTIONS.find(s => s.carrier === shipping.carrier)?.label || shipping.carrier}):</span>
                  <span>+{formatPrice(shippingCost)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-stone-300 pt-2 mt-2">
                <span className="text-lg font-bold text-stone-800">CELKEM:</span>
                <span className="text-lg font-bold text-[#722F37]">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white rounded-lg px-3 py-2 border border-stone-200 flex justify-between items-center">
              <span className="text-stone-500">Platba:</span>
              <span className="font-medium text-stone-700">
                {channel === 'instagram' ? 'Převod na účet (proforma faktura)' :
                  paymentMethod === 'prevod' ? 'Převod (proforma faktura)' :
                  paymentMethod === 'hotovost' ? 'Hotovost (pokladní doklad)' : 'Karta (Fakturoid faktura)'}
              </span>
            </div>
          </div>

          {/* Submit button inside preview */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || cart.length === 0 || !invoiceType}
              className={`${btnPrimary} text-base px-8 py-3`}
            >
              {isSubmitting ? 'Vytvářím...' : invoiceType === 'fakturoid'
                ? '🧾 Potvrdit + vytvořit fakturu'
                : invoiceType === 'uctenka'
                ? '📋 Potvrdit + vytisknout doklad'
                : 'Nejprve vyberte typ dokladu ↑'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
