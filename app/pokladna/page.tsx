'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';

declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (
          apiKey: string,
          callback: (point: PacketaPoint | null) => void,
          opts?: PacketaOptions
        ) => void;
      };
    };
  }
}

interface PacketaPoint {
  id: string;
  name: string;
  city: string;
  street: string;
  zip: string;
  country: string;
  url?: string;
}

interface PacketaOptions {
  country?: string;
  language?: string;
}

const inputClass = `
  w-full px-4 py-3 text-sm font-light
  border focus:outline-none transition-colors
  bg-white
`;
const inputStyle = {
  borderColor: 'var(--warm-beige)',
  color: 'var(--text-dark)',
};
const inputFocusStyle = `focus:ring-0`;

export default function PokladnaPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [packetaLoaded, setPacketaLoaded] = useState(false);

  useEffect(() => {
    if (packetaLoaded) return;
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.Packeta) {
        setPacketaLoaded(true);
        clearInterval(interval);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [packetaLoaded]);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    country: 'CZ',
    deliveryMethod: 'zasilkovna',
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PacketaPoint | null>(null);

  const total = getTotalPrice();

  const getShippingCost = () => {
    if (formData.deliveryMethod === 'zasilkovna') return 65;
    if (formData.deliveryMethod === 'dpd') return 99;
    if (formData.deliveryMethod === 'ppl') return 99;
    if (formData.deliveryMethod === 'showroom') return 0;
    return 150;
  };

  const needsAddress = ['standard', 'dpd', 'ppl'].includes(formData.deliveryMethod);
  const shipping = getShippingCost();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(language === 'cs' ? 'cs-CZ' : 'en-US', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
    }).format(price);

  const openPacketaWidget = () => {
    if (!window.Packeta) { alert(t('checkout.shippingMethod.packetaLoading')); return; }
    const apiKey = process.env.NEXT_PUBLIC_PACKETA_API_KEY;
    if (!apiKey) { alert('Zásilkovna API klíč není nastaven.'); return; }
    window.Packeta.Widget.pick(apiKey, (point) => { if (point) setSelectedPickupPoint(point); }, {
      country: formData.country.toLowerCase(),
      language: 'cs',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) { setCouponError('Zadejte kód kupónu'); return; }
    setCouponLoading(true); setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: total, userEmail: formData.email || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) { setCouponError(data.error || 'Neplatný kupón'); setCouponDiscount(0); setCouponApplied(false); }
      else { setCouponDiscount(data.discount.amount); setCouponApplied(true); setCouponError(''); }
    } catch { setCouponError('Chyba při ověřování kupónu'); }
    finally { setCouponLoading(false); }
  };

  const handleRemoveCoupon = () => { setCouponCode(''); setCouponDiscount(0); setCouponApplied(false); setCouponError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      if (!formData.email || !formData.firstName) { setError(t('checkout.requiredFields')); setLoading(false); return; }
      if (formData.deliveryMethod === 'zasilkovna' && !selectedPickupPoint) { setError(t('checkout.shippingMethod.pickupPointRequired')); setLoading(false); return; }
      if (needsAddress && (!formData.streetAddress || !formData.city)) { setError(t('checkout.addressRequired')); setLoading(false); return; }

      const orderCreationData = {
        email: formData.email,
        cartLines: items.map((item) => ({
          skuId: item.skuId,
          wantedGrams: item.saleMode === 'BULK_G' ? item.grams : undefined,
          ending: item.ending,
        })),
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          streetAddress: formData.deliveryMethod === 'zasilkovna' ? (selectedPickupPoint?.street || '') : formData.deliveryMethod === 'showroom' ? 'Revoluční 8' : formData.streetAddress,
          city: formData.deliveryMethod === 'zasilkovna' ? (selectedPickupPoint?.city || '') : formData.deliveryMethod === 'showroom' ? 'Praha 1' : formData.city,
          zipCode: formData.deliveryMethod === 'zasilkovna' ? (selectedPickupPoint?.zip || '') : formData.deliveryMethod === 'showroom' ? '110 00' : formData.zipCode,
          country: formData.country,
          deliveryMethod: formData.deliveryMethod,
        },
        packetaPoint: formData.deliveryMethod === 'zasilkovna' && selectedPickupPoint ? {
          id: selectedPickupPoint.id, name: selectedPickupPoint.name, street: selectedPickupPoint.street,
          city: selectedPickupPoint.city, zip: selectedPickupPoint.zip, country: selectedPickupPoint.country,
        } : undefined,
        couponCode: couponApplied && couponCode ? couponCode.trim() : undefined,
      };

      const orderResponse = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderCreationData) });
      if (!orderResponse.ok) { const err = await orderResponse.json(); setError(err.error || t('checkout.errors.orderCreation')); setLoading(false); return; }

      const { orderId, total: orderTotal } = await orderResponse.json();
      setSuccess(t('checkout.payment.orderCreated'));

      const paymentResponse = await fetch('/api/gopay/create-payment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: orderTotal, email: formData.email, firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone }),
      });
      if (!paymentResponse.ok) { const err = await paymentResponse.json(); setError(err.error || t('checkout.errors.paymentCreation')); setLoading(false); return; }

      const { paymentUrl } = await paymentResponse.json();
      if (!paymentUrl) { setError(t('checkout.errors.paymentUrl')); setLoading(false); return; }

      clearCart();
      window.location.href = paymentUrl;
    } catch (err) {
      setError(`${t('checkout.errors.generic')}: ${err instanceof Error ? err.message : t('errors.generic')}`);
      setLoading(false);
    }
  };

  // ── Empty cart ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center justify-center gap-3" style={{ color: 'var(--accent)' }}>
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
            POKLADNA
            <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
          </div>
          <h1 className="font-cormorant text-[clamp(32px,4vw,48px)] font-light mb-4" style={{ color: 'var(--text-dark)' }}>
            V košíku nic není
          </h1>
          <p className="text-sm font-light mb-10" style={{ color: 'var(--text-soft)' }}>
            Přidejte produkty do košíku a vraťte se sem
          </p>
          <Link href="/vlasy-k-prodlouzeni"
            className="inline-block px-10 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'var(--burgundy)' }}>
            Pokračovat v nákupu
          </Link>
        </div>
      </div>
    );
  }

  const deliveryOptions = [
    { value: 'zasilkovna', label: 'Zásilkovna — výdejní místo', price: '65 Kč', desc: 'Výdejní místa po celé ČR a SK' },
    { value: 'dpd', label: 'DPD — kurýr na adresu', price: '99 Kč', desc: '1–2 pracovní dny' },
    { value: 'ppl', label: 'PPL — kurýr na adresu', price: '99 Kč', desc: '1–2 pracovní dny' },
    { value: 'standard', label: 'Česká pošta', price: '150 Kč', desc: '2–4 pracovní dny' },
    { value: 'showroom', label: 'Osobní odběr — Showroom Praha', price: 'Zdarma', desc: 'Revoluční 8, Praha 1 · Po domluvě' },
  ];

  return (
    <>
      <Script src="https://widget.packeta.com/v6/www/js/library.js" strategy="afterInteractive" onLoad={() => setPacketaLoaded(true)} />

      <div className="min-h-screen" style={{ background: 'var(--ivory)' }}>
        <div className="max-w-6xl mx-auto px-6 py-16">

          {/* Breadcrumb */}
          <nav className="text-[11px] tracking-[0.15em] uppercase font-light mb-12" style={{ color: 'var(--text-soft)' }}>
            <Link href="/" style={{ color: 'var(--text-soft)' }} className="hover:underline">Domů</Link>
            <span className="mx-2">—</span>
            <Link href="/kosik" style={{ color: 'var(--text-soft)' }} className="hover:underline">Košík</Link>
            <span className="mx-2">—</span>
            <span style={{ color: 'var(--text-mid)' }}>Pokladna</span>
          </nav>

          {/* Header */}
          <div className="mb-10 pb-6 border-b" style={{ borderColor: 'var(--warm-beige)' }}>
            <div className="text-[11px] tracking-[0.2em] uppercase mb-3 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
              <span className="block w-8 h-px" style={{ background: 'var(--accent)' }} />
              DOKONČENÍ OBJEDNÁVKY
            </div>
            <h1 className="font-cormorant text-[clamp(28px,3vw,42px)] font-light" style={{ color: 'var(--text-dark)' }}>
              Pokladna
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-10 items-start">

            {/* ── Form ── */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-10">

                {/* Error / success */}
                {error && (
                  <div className="px-5 py-4 text-sm" style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="px-5 py-4 text-sm" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534' }}>
                    {success}
                  </div>
                )}

                {/* Section: Kontakt */}
                <section>
                  <h2 className="font-cormorant text-2xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                    Kontaktní údaje
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-light" style={{ color: 'var(--text-soft)' }}>
                        E-mail *
                      </label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required disabled={loading}
                        placeholder={language === 'cs' ? 'vase@email.cz' : 'your@email.com'}
                        className={`${inputClass} ${inputFocusStyle}`} style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-light" style={{ color: 'var(--text-soft)' }}>Jméno *</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required disabled={loading}
                          placeholder="Jana" className={`${inputClass} ${inputFocusStyle}`} style={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-light" style={{ color: 'var(--text-soft)' }}>Příjmení *</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required disabled={loading}
                          placeholder="Nováková" className={`${inputClass} ${inputFocusStyle}`} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-light" style={{ color: 'var(--text-soft)' }}>Telefon</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={loading}
                        placeholder="+420 123 456 789" className={`${inputClass} ${inputFocusStyle}`} style={inputStyle} />
                    </div>
                  </div>
                </section>

                {/* Section: Doprava */}
                <section>
                  <h2 className="font-cormorant text-2xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                    Způsob dopravy
                  </h2>
                  <div className="space-y-2">
                    {deliveryOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className="flex items-start gap-4 p-4 cursor-pointer transition-colors"
                        style={{
                          border: `1px solid ${formData.deliveryMethod === opt.value ? 'var(--burgundy)' : 'var(--warm-beige)'}`,
                          background: formData.deliveryMethod === opt.value ? 'var(--white, #fff)' : 'transparent',
                        }}
                      >
                        <input type="radio" name="deliveryMethod" value={opt.value}
                          checked={formData.deliveryMethod === opt.value}
                          onChange={handleInputChange} disabled={loading}
                          className="mt-1 flex-shrink-0 accent-burgundy" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>{opt.label}</span>
                            <span className="text-sm flex-shrink-0" style={{ color: opt.price === 'Zdarma' ? 'var(--success, #4A7C59)' : 'var(--text-dark)' }}>{opt.price}</span>
                          </div>
                          <p className="text-xs mt-0.5 font-light" style={{ color: 'var(--text-soft)' }}>{opt.desc}</p>

                          {/* Zásilkovna picker */}
                          {opt.value === 'zasilkovna' && formData.deliveryMethod === 'zasilkovna' && (
                            <div className="mt-3">
                              {selectedPickupPoint ? (
                                <div className="p-3 text-sm" style={{ background: 'var(--ivory)', border: '1px solid var(--warm-beige)' }}>
                                  <p className="font-medium mb-0.5" style={{ color: 'var(--text-dark)' }}>{selectedPickupPoint.name}</p>
                                  <p className="text-xs font-light" style={{ color: 'var(--text-soft)' }}>
                                    {selectedPickupPoint.street}, {selectedPickupPoint.city}, {selectedPickupPoint.zip}
                                  </p>
                                  <button type="button" onClick={openPacketaWidget}
                                    className="mt-2 text-[11px] tracking-[0.08em] uppercase hover:underline"
                                    style={{ color: 'var(--accent)' }}>
                                    Změnit výdejní místo
                                  </button>
                                </div>
                              ) : (
                                <button type="button" onClick={openPacketaWidget} disabled={!packetaLoaded}
                                  className="mt-1 px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase font-medium text-white transition-all hover:opacity-90 disabled:opacity-40"
                                  style={{ background: 'var(--burgundy)' }}>
                                  {packetaLoaded ? 'Vybrat výdejní místo' : 'Načítám…'}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Showroom info */}
                          {opt.value === 'showroom' && formData.deliveryMethod === 'showroom' && (
                            <div className="mt-3 p-3 text-xs font-light" style={{ background: 'var(--ivory)', border: '1px solid var(--warm-beige)', color: 'var(--text-mid)' }}>
                              📍 Revoluční 8, 110 00 Praha 1 · Otevřeno Po–Ne 9:00–19:00
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Section: Doručovací adresa */}
                {needsAddress && (
                  <section>
                    <h2 className="font-cormorant text-2xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                      Doručovací adresa
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-light" style={{ color: 'var(--text-soft)' }}>Ulice a číslo popisné *</label>
                        <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange}
                          required={needsAddress} disabled={loading} placeholder="Václavské náměstí 1"
                          className={`${inputClass} ${inputFocusStyle}`} style={inputStyle} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-light" style={{ color: 'var(--text-soft)' }}>Město *</label>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                            required={needsAddress} disabled={loading} placeholder="Praha"
                            className={`${inputClass} ${inputFocusStyle}`} style={inputStyle} />
                        </div>
                        <div>
                          <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-light" style={{ color: 'var(--text-soft)' }}>PSČ *</label>
                          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                            required={needsAddress} disabled={loading} placeholder="110 00"
                            className={`${inputClass} ${inputFocusStyle}`} style={inputStyle} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.1em] uppercase mb-2 font-light" style={{ color: 'var(--text-soft)' }}>Země</label>
                        <select name="country" value={formData.country} onChange={handleInputChange} disabled={loading}
                          className={`${inputClass} ${inputFocusStyle}`} style={inputStyle}>
                          <option value="CZ">Česká republika</option>
                          <option value="SK">Slovensko</option>
                          <option value="PL">Polsko</option>
                          <option value="DE">Německo</option>
                          <option value="AT">Rakousko</option>
                        </select>
                      </div>
                    </div>
                  </section>
                )}

                {/* Submit */}
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full py-4 text-[11px] tracking-[0.15em] uppercase font-medium text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: 'var(--burgundy)' }}>
                    {loading ? 'Zpracovávám…' : 'Dokončit objednávku a zaplatit →'}
                  </button>
                  <p className="text-[11px] text-center mt-3 font-light" style={{ color: 'var(--text-soft)' }}>
                    * Povinná pole · Platba přes GoPay
                  </p>
                </div>

              </form>
            </div>

            {/* ── Order summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 p-8" style={{ background: 'var(--white, #fff)', border: '1px solid var(--warm-beige)' }}>

                <div className="text-[11px] tracking-[0.2em] uppercase mb-6 font-normal flex items-center gap-3" style={{ color: 'var(--accent)' }}>
                  <span className="block w-6 h-px" style={{ background: 'var(--accent)' }} />
                  SOUHRN
                </div>

                {/* Items */}
                <div className="space-y-4 pb-6 mb-6 border-b" style={{ borderColor: 'var(--warm-beige)' }}>
                  {items.map((item) => (
                    <div key={item.skuId} className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-light truncate" style={{ color: 'var(--text-dark)' }}>
                          {item.skuName}
                          {item.shade && <span style={{ color: 'var(--text-soft)' }}> · #{item.shade}</span>}
                        </p>
                        <p className="text-xs font-light mt-0.5" style={{ color: 'var(--text-soft)' }}>
                          {item.saleMode === 'BULK_G' ? `${item.grams}g @ ${formatPrice(item.pricePerGram)}/g` : `${item.quantity}× ks`}
                        </p>
                        {item.assemblyFeeTotal > 0 && (
                          <p className="text-xs font-light" style={{ color: 'var(--text-soft)' }}>
                            Servisní poplatek: {formatPrice(item.assemblyFeeTotal)}
                          </p>
                        )}
                      </div>
                      <p className="text-sm font-light flex-shrink-0" style={{ color: 'var(--text-dark)' }}>
                        {formatPrice(item.lineGrandTotal)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="pb-6 mb-6 border-b" style={{ borderColor: 'var(--warm-beige)' }}>
                  <p className="text-[11px] tracking-[0.08em] uppercase mb-3 font-light" style={{ color: 'var(--text-soft)' }}>Slevový kupón</p>
                  {!couponApplied ? (
                    <div className="flex gap-2">
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="KÓD KUPÓNU" disabled={couponLoading}
                        className="flex-1 px-3 py-2.5 text-xs uppercase border bg-white focus:outline-none"
                        style={{ borderColor: 'var(--warm-beige)', color: 'var(--text-dark)' }} />
                      <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2.5 text-[10px] tracking-[0.1em] uppercase font-medium text-white transition-all hover:opacity-90 disabled:opacity-40"
                        style={{ background: 'var(--burgundy)' }}>
                        {couponLoading ? '…' : 'Použít'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-3 text-sm"
                      style={{ background: 'var(--ivory)', border: '1px solid var(--warm-beige)' }}>
                      <span style={{ color: 'var(--text-dark)' }}>{couponCode} <span style={{ color: 'var(--success, #4A7C59)' }}>−{formatPrice(couponDiscount)}</span></span>
                      <button onClick={handleRemoveCoupon} className="text-xs hover:underline" style={{ color: 'var(--text-soft)' }}>Odebrat</button>
                    </div>
                  )}
                  {couponError && <p className="text-xs mt-2" style={{ color: 'var(--error, #8B3A3A)' }}>{couponError}</p>}
                </div>

                {/* Totals */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex justify-between text-sm font-light" style={{ color: 'var(--text-mid)' }}>
                    <span>Mezisoučet</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  {couponApplied && couponDiscount > 0 && (
                    <div className="flex justify-between text-sm font-light">
                      <span style={{ color: 'var(--text-mid)' }}>Sleva ({couponCode})</span>
                      <span style={{ color: 'var(--success, #4A7C59)' }}>−{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-light" style={{ color: 'var(--text-mid)' }}>
                    <span>Doprava</span>
                    <span style={{ color: shipping === 0 ? 'var(--success, #4A7C59)' : 'var(--text-dark)' }}>
                      {shipping === 0 ? 'Zdarma' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>

                <div className="pt-5 border-t" style={{ borderColor: 'var(--warm-beige)' }}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-cormorant text-xl font-light" style={{ color: 'var(--text-dark)' }}>Celkem</span>
                    <span className="font-cormorant text-2xl font-light" style={{ color: 'var(--text-dark)' }}>
                      {formatPrice(total - couponDiscount + shipping)}
                    </span>
                  </div>
                </div>

                <Link href="/kosik"
                  className="mt-6 block text-center text-[11px] tracking-[0.08em] uppercase hover:underline"
                  style={{ color: 'var(--text-soft)' }}>
                  ← Zpět do košíku
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
