'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useTranslation } from '@/contexts/LanguageContext';
import AccountOffer from '@/components/checkout/AccountOffer';
import TransferPayment from '@/components/checkout/TransferPayment';

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

// Platí se vždy předem, u každého způsobu doručení i u osobního odběru:
// převodem (QR platba hned po objednávce) nebo kartou přes GoPay.
// Karta se nabídne, až bude GoPay připojená (ve Vercelu NEXT_PUBLIC_PAYMENT_MODE=gopay).
const CARD_ENABLED = process.env.NEXT_PUBLIC_PAYMENT_MODE === 'gopay';
const WHATSAPP_NUMBER = '420728722880';

const DELIVERY_OPTIONS = [
  // Ceny musí odpovídat výpočtu v app/api/orders/route.ts
  { value: 'zasilkovna', label: 'Zásilkovna', desc: 'Výdejní místo nebo Z-BOX, ČR a SK', price: 89 },
  { value: 'dpd', label: 'DPD výdejní místo nebo box', desc: 'DPD Pickup nebo DPD box, 1–2 pracovní dny', price: 68 },
  { value: 'standard', label: 'Doručení na adresu', desc: 'Kurýrem, 1–2 pracovní dny', price: 129 },
  { value: 'showroom', label: 'Osobní odběr', desc: 'Showroom Revoluční 8, Praha 1', price: 0 },
] as const;

const ENDING_LABELS: Record<string, string> = {
  NONE: 'bez zakončení',
  KERATIN: 'keratin',
  STANDARD_KERATIN: 'keratin',
  MICRO_KERATIN: 'mikrokeratin',
  PASKY_KERATINU: 'keratinové pásky',
  TAPES: 'tapes',
  WEFT: 'weft',
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(price);

const labelClass = 'block text-xs text-muza-soft';
const fieldClass =
  'w-full h-11 bg-transparent border-0 border-b border-muza-field px-0 text-base font-light text-text-dark placeholder:text-[#A39389] focus:outline-none focus:border-muza-ink transition-colors disabled:opacity-50';
const sectionTitle = 'font-cormorant text-[24px] leading-tight font-normal text-muza-ink';

function Radio({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex-none w-5 h-5 rounded-full box-border transition-[border] duration-150"
      style={{ border: on ? '6px solid #330D0D' : '1px solid #A39389' }}
    />
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.8z" />
    </svg>
  );
}

export default function PokladnaPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [packetaLoaded, setPacketaLoaded] = useState(false);
  const [packetaFailed, setPacketaFailed] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [sent, setSent] = useState<{ orderNumber: number; total: number } | null>(null);
  const [payment, setPayment] = useState<'transfer' | 'gopay'>(CARD_ENABLED ? 'gopay' : 'transfer');

  useEffect(() => {
    if (packetaLoaded) return;
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.Packeta) {
        setPacketaLoaded(true);
        clearInterval(interval);
      }
    }, 300);
    // Widget se občas nenačte (blokátor, výpadek) – po 10 s nabídneme jinou cestu
    const timeout = setTimeout(() => setPacketaFailed(true), 10000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [packetaLoaded]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    country: 'CZ',
    deliveryMethod: 'zasilkovna',
    note: '',
  });

  // Přihlášení je dobrovolné: přihlášené zákaznici se údaje vyplní samy
  const [account, setAccount] = useState<{ firstName: string; lastName: string; email: string; phone?: string | null } | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const fillFromAccount = (u: { firstName: string; lastName: string; email: string; phone?: string | null; streetAddress?: string | null; city?: string | null; zipCode?: string | null }) => {
    setAccount(u);
    setFormData((prev) => ({
      ...prev,
      name: [u.firstName, u.lastName].filter((x) => x && x !== '-').join(' '),
      email: u.email,
      phone: u.phone || prev.phone,
      streetAddress: u.streetAddress || prev.streetAddress,
      city: u.city || prev.city,
      zipCode: u.zipCode || prev.zipCode,
    }));
  };

  useEffect(() => {
    fetch('/api/auth/session').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d?.user) fillFromAccount(d.user); }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async () => {
    if (!login.email || !login.password) { setLoginError('Vyplňte e-mail a heslo.'); return; }
    setLoginLoading(true); setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: login.email.trim(), password: login.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) { setLoginError('E-mail nebo heslo nesedí.'); return; }
      fillFromAccount(data.user); setLoginOpen(false);
    } catch { setLoginError('Přihlášení se nepovedlo, zkuste to znovu.'); }
    finally { setLoginLoading(false); }
  };

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PacketaPoint | null>(null);
  // DPD výdejní místo nebo box: oficiální widget DPD (iframe), výběr přijde zprávou postMessage
  const [dpdPoint, setDpdPoint] = useState<{ id: string; text: string } | null>(null);
  const [dpdOpen, setDpdOpen] = useState(false);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://api.dpd.cz' || !event.data?.dpdWidget) return;
      const w = event.data.dpdWidget;
      if (w.message === 'widgetClose') { setDpdOpen(false); return; }
      const text = String(w.pickupPointResult || '').trim();
      if (!text) return;
      setDpdPoint({ id: String(w.id ?? text.split(/[\s,]/)[0]), text });
      setDpdOpen(false);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const subtotal = getTotalPrice();
  const delivery = DELIVERY_OPTIONS.find((o) => o.value === formData.deliveryMethod) ?? DELIVERY_OPTIONS[0];
  const shipping = delivery.price;
  const needsAddress = ['standard', 'ppl'].includes(formData.deliveryMethod);
  const grandTotal = subtotal - couponDiscount + shipping;
  const byTransfer = payment === 'transfer';

  const openPacketaWidget = () => {
    if (!window.Packeta) { alert(t('checkout.shippingMethod.packetaLoading')); return; }
    const apiKey = process.env.NEXT_PUBLIC_PACKETA_API_KEY;
    if (!apiKey) { alert('Zásilkovna API klíč není nastaven.'); return; }
    window.Packeta.Widget.pick(apiKey, (point) => { if (point) setSelectedPickupPoint(point); }, {
      country: formData.country.toLowerCase(),
      language: 'cs',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal, userEmail: formData.email || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) { setCouponError(data.error || 'Neplatný kupón'); setCouponDiscount(0); setCouponApplied(false); }
      else { setCouponDiscount(data.discount.amount); setCouponApplied(true); setCouponError(''); }
    } catch { setCouponError('Chyba při ověřování kupónu'); }
    finally { setCouponLoading(false); }
  };

  const handleRemoveCoupon = () => { setCouponCode(''); setCouponDiscount(0); setCouponApplied(false); setCouponError(''); };

  const describeItem = (item: (typeof items)[number]) =>
    [(item.skuName || 'Vlasy').split(' · ')[0], item.selectedLength ? `${item.selectedLength} cm` : null, item.grams ? `${item.grams} g` : null, ENDING_LABELS[item.ending] || null]
      .filter(Boolean)
      .join(' · ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const fail = (msg: string) => { setError(msg); setLoading(false); };
    try {
      const name = formData.name.trim().replace(/\s+/g, ' ');
      if (!name || !formData.email) return fail('Vyplňte prosím jméno a e-mail.');

      if (formData.deliveryMethod === 'zasilkovna' && !selectedPickupPoint) return fail(t('checkout.shippingMethod.pickupPointRequired'));
      if (formData.deliveryMethod === 'dpd' && !dpdPoint) return fail('Vyberte prosím výdejní místo nebo box DPD.');
      if (needsAddress && (!formData.streetAddress || !formData.city || !formData.zipCode)) return fail(t('checkout.addressRequired'));

      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ');
      const isPoint = formData.deliveryMethod === 'zasilkovna';
      const isShowroom = formData.deliveryMethod === 'showroom';
      const isDpd = formData.deliveryMethod === 'dpd';

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          cartLines: items.map((item) => ({
            skuId: item.skuId,
            wantedGrams: item.grams || undefined, // server podle pravidla prodeje (Baby Shades vždy celý culík)
            ending: item.ending,
            selectedLength: item.selectedLength,
          })),
          shippingInfo: {
            firstName,
            lastName,
            phone: formData.phone.trim() || undefined,
            streetAddress: isPoint ? (selectedPickupPoint?.street || '') : isShowroom ? 'Revoluční 8' : isDpd ? `DPD Pickup: ${dpdPoint?.text || ''}`.slice(0, 200) : formData.streetAddress,
            city: isPoint ? (selectedPickupPoint?.city || '') : isShowroom ? 'Praha 1' : isDpd ? undefined : formData.city,
            zipCode: isPoint ? (selectedPickupPoint?.zip || '') : isShowroom ? '110 00' : isDpd ? undefined : formData.zipCode,
            country: formData.country,
            deliveryMethod: formData.deliveryMethod,
          },
          packetaPoint: isPoint && selectedPickupPoint ? {
            id: selectedPickupPoint.id, name: selectedPickupPoint.name, street: selectedPickupPoint.street,
            city: selectedPickupPoint.city, zip: selectedPickupPoint.zip, country: selectedPickupPoint.country,
          } : undefined,
          couponCode: couponApplied && couponCode ? couponCode.trim() : undefined,
          paymentMethod: payment,
          note: formData.note.trim() || undefined,
        }),
      });
      if (!orderResponse.ok) {
        const err = await orderResponse.json().catch(() => ({}));
        return fail(err.error || t('checkout.errors.orderCreation'));
      }
      const { orderId, orderNumber, total: orderTotal } = await orderResponse.json();

      if (byTransfer) {
        // Objednávka je uložená, platební údaje a QR kód ukážeme hned
        clearCart();
        setSent({ orderNumber, total: orderTotal });
        setLoading(false);
        window.scrollTo(0, 0);
        return;
      }

      const paymentResponse = await fetch('/api/gopay/create-payment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: orderTotal, email: formData.email, firstName, lastName, phone: formData.phone }),
      });
      if (!paymentResponse.ok) {
        const err = await paymentResponse.json().catch(() => ({}));
        return fail(err.error || t('checkout.errors.paymentCreation'));
      }
      const { paymentUrl } = await paymentResponse.json();
      if (!paymentUrl) return fail(t('checkout.errors.paymentUrl'));
      try { sessionStorage.setItem('muza-checkout-contact', JSON.stringify({ email: formData.email.trim(), firstName, lastName, phone: formData.phone.trim() })); } catch {}
      // Košík mažeme až na potvrzovací stránce po zaplacení – zrušená platba ho nesmaže
      window.location.href = paymentUrl;
    } catch (err) {
      console.error(err);
      fail(t('checkout.errors.generic'));
    }
  };

  // ── Objednáno, platba převodem hned ─────────────────────────────────────
  if (sent) {
    const [first, ...rest] = formData.name.trim().split(/\s+/);
    return (
      <div className="min-h-screen bg-muza-cream">
        <div className="max-w-md mx-auto px-5 py-14 text-center">
          <div className="mx-auto w-14 h-14 rounded-full border border-muza-ink text-muza-ink flex items-center justify-center">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </div>
          <h1 className="mt-5 font-cormorant text-[40px] leading-none text-muza-ink">Děkujeme</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-[#45302F]">
            Objednávku <b className="font-semibold text-text-dark">č. {sent.orderNumber}</b> máme. Potvrzení jsme poslali na {formData.email.trim()}.
          </p>
          <TransferPayment orderNumber={sent.orderNumber} amount={sent.total} />
          {!account && <AccountOffer email={formData.email.trim()} firstName={first || ''} lastName={rest.join(' ')} phone={formData.phone.trim()} />}
          <p className="mt-4 text-[13px] text-muza-soft">Stav objednávky můžete sledovat i bez účtu, odkaz najdete v e-mailu.</p>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Dobrý den, mám dotaz k objednávce č. ${sent.orderNumber}.`)}`}
            target="_blank" rel="noopener" className="mt-6 flex items-center justify-center gap-2 h-12 rounded-full border border-muza-ink text-muza-ink text-sm">
            <WhatsAppIcon />Máte dotaz? Napište nám
          </a>
          <Link href="/" className="mt-3 flex items-center justify-center h-12 text-sm text-muza-ink underline underline-offset-[3px]">
            Zpět do obchodu
          </Link>
        </div>
      </div>
    );
  }

  // ── Prázdný košík ───────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muza-cream">
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <h1 className="font-cormorant text-4xl font-light text-muza-ink mb-3">V košíku nic není</h1>
          <p className="text-sm font-light text-muza-soft mb-10">Vyberte si culík a vraťte se sem.</p>
          <Link href="/vlasy-k-prodlouzeni"
            className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-muza-ink text-muza-onink text-[15px] hover:opacity-90 transition-opacity">
            Pokračovat v nákupu
          </Link>
        </div>
      </div>
    );
  }

  const submitLabel = loading ? 'Odesílám…' : byTransfer ? `Objednat a zaplatit ${formatPrice(grandTotal)}` : `Zaplatit kartou ${formatPrice(grandTotal)}`;

  const totals = (
    <div className="pt-4 border-t border-muza-ink">
      <div className="flex justify-between py-0.5 text-sm"><span className="text-muza-soft">Mezisoučet</span><span>{formatPrice(subtotal)}</span></div>
      {couponApplied && couponDiscount > 0 && (
        <div className="flex justify-between py-0.5 text-sm"><span className="text-muza-soft">Sleva ({couponCode})</span><span>−{formatPrice(couponDiscount)}</span></div>
      )}
      <div className="flex justify-between py-0.5 text-sm"><span className="text-muza-soft">Doprava</span><span>{shipping === 0 ? 'zdarma' : formatPrice(shipping)}</span></div>
      <div className="flex justify-between items-baseline pt-2.5">
        <span className="font-cormorant text-2xl font-light">Celkem</span>
        <span className="font-jost font-semibold text-[26px] text-muza-ink tabular-nums">{formatPrice(grandTotal)}</span>
      </div>
    </div>
  );

  return (
    <>
      <Script src="https://widget.packeta.com/v6/www/js/library.js" strategy="afterInteractive" onLoad={() => setPacketaLoaded(true)} />

      <div className="min-h-screen bg-muza-cream text-text-dark font-light">
        {/* Souhrn košíku – na mobilu sbalený nahoře */}
        <div className="lg:hidden border-b border-muza-line bg-[#EFE8DF]">
          <button type="button" aria-expanded={summaryOpen} onClick={() => setSummaryOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-left">
            <span className="flex-1 min-w-0">
              <span className="block text-sm">{items.length === 1 ? describeItem(items[0]) : `${items.length} položky v košíku`}</span>
              <span className="block text-xs text-muza-soft mt-0.5">{summaryOpen ? 'Skrýt souhrn' : 'Zobrazit souhrn'}</span>
            </span>
            <span className="flex items-center gap-1.5 font-jost font-semibold text-lg tabular-nums">
              {formatPrice(grandTotal)}
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#330D0D" strokeWidth="1.5"
                className={`transition-transform duration-200 ${summaryOpen ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
            </span>
          </button>
          {summaryOpen && (
            <div className="px-5 pb-4 space-y-1.5 text-[13px]">
              {items.map((item) => (
                <div key={item.skuId} className="flex justify-between gap-3">
                  <span className="text-muza-soft">{describeItem(item)}</span><span>{formatPrice(item.lineGrandTotal)}</span>
                </div>
              ))}
              <div className="flex justify-between"><span className="text-muza-soft">Doprava</span><span>{shipping === 0 ? 'zdarma' : formatPrice(shipping)}</span></div>
              <Link href="/kosik" className="inline-block pt-1 text-muza-ink underline underline-offset-2">Upravit košík</Link>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto px-5 lg:px-8 pt-7 pb-36 lg:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:items-start">
          <form id="checkout" onSubmit={handleSubmit} noValidate className="min-w-0">
            <h1 className="font-cormorant text-[40px] lg:text-[48px] leading-none text-muza-ink">Pokladna</h1>
            <p className="mt-2 text-[13px] text-muza-soft">
              Zabere to minutu. Platí se vždy předem.
            </p>

            {error && (
              <div role="alert" className="mt-6 px-4 py-3 text-sm border border-error/30 bg-error/5 text-error rounded-xl">{error}</div>
            )}

            {/* Kontakt: registrace není potřeba, přihlášení jen jako zkratka */}
            <section aria-labelledby="h-kontakt" className="mt-8">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="h-kontakt" className={sectionTitle}>Kontakt</h2>
                {!account && (
                  <button type="button" onClick={() => { setLoginOpen((v) => !v); setLoginError(''); }}
                    className="py-1.5 text-sm text-muza-ink underline underline-offset-[3px]">
                    {loginOpen ? 'Objednat bez účtu' : 'Máte účet? Přihlaste se'}
                  </button>
                )}
              </div>

              {loginOpen && !account && (
                <div className="mt-3 rounded-2xl border border-muza-line bg-[#F7F3EE] p-4">
                  <p className="text-sm text-[#45302F]">Přihlaste se a údaje se vyplní samy.</p>
                  <label className="block pt-3">
                    <span className={labelClass}>E-mail</span>
                    <input type="email" autoComplete="username" value={login.email} onChange={(e) => setLogin((l) => ({ ...l, email: e.target.value }))} className={fieldClass} />
                  </label>
                  <label className="block pt-4">
                    <span className={labelClass}>Heslo</span>
                    <input type="password" autoComplete="current-password" value={login.password} onChange={(e) => setLogin((l) => ({ ...l, password: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLogin(); } }} className={fieldClass} />
                  </label>
                  {loginError && <p role="alert" className="mt-2 text-[13px] text-error">{loginError}</p>}
                  <button type="button" onClick={handleLogin} disabled={loginLoading}
                    className="mt-4 w-full h-[50px] rounded-full bg-muza-ink text-muza-onink text-sm font-medium disabled:opacity-50">
                    {loginLoading ? 'Přihlašuji…' : 'Přihlásit'}
                  </button>
                  <Link href="/prihlaseni" className="mt-2.5 inline-block text-[13px] text-muza-soft underline underline-offset-2">Zapomenuté heslo</Link>
                </div>
              )}

              {account && !editContact ? (
                <dl className="mt-2">
                  {[['Jméno', formData.name], ['E-mail', formData.email], ['Telefon', formData.phone || '—']].map(([k, v], i, all) => (
                    <div key={k} className={`flex items-center justify-between gap-3 py-3 border-t border-muza-line ${i === all.length - 1 ? 'border-b' : ''}`}>
                      <dt className="text-sm font-normal text-[#45302F]">{k}</dt>
                      <dd className="text-[15px] font-normal text-right break-all">{v}</dd>
                    </div>
                  ))}
                  <button type="button" onClick={() => setEditContact(true)} className="mt-2 py-1 text-sm text-muza-ink underline underline-offset-[3px]">Upravit údaje</button>
                </dl>
              ) : (
                <>
                  <label className="block pt-3">
                    <span className={labelClass}>Jméno a příjmení</span>
                    <input type="text" name="name" autoComplete="name" required value={formData.name} onChange={handleInputChange} disabled={loading}
                      placeholder="Jana Nováková" className={fieldClass} />
                  </label>
                  <label className="block pt-4">
                    <span className={labelClass}>Telefon</span>
                    <input type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} disabled={loading}
                      placeholder="+420" className={fieldClass} />
                  </label>
                  <label className="block pt-4">
                    <span className={labelClass}>E-mail</span>
                    <input type="email" name="email" autoComplete="email" required value={formData.email} onChange={handleInputChange} disabled={loading}
                      placeholder="vas@email.cz" className={fieldClass} />
                  </label>
                  {!account && <p className="mt-3 text-[13px] text-muza-soft">Registrace není potřeba, objednáte i bez účtu.</p>}
                </>
              )}
            </section>

            {/* Doručení */}
            <section aria-labelledby="h-doruceni" className="mt-9">
              <h2 id="h-doruceni" className={`${sectionTitle} mb-1.5`}>Doručení</h2>
              <div role="radiogroup" aria-labelledby="h-doruceni">
                {DELIVERY_OPTIONS.map((opt) => {
                  const on = formData.deliveryMethod === opt.value;
                  return (
                    <div key={opt.value} className="border-b border-muza-line">
                      <button type="button" role="radio" aria-checked={on} disabled={loading}
                        onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: opt.value }))}
                        className="w-full flex items-center gap-3.5 min-h-[60px] py-2.5 text-left">
                        <Radio on={on} />
                        <span className="flex-1 min-w-0">
                          <span className={`block text-[15px] ${on ? 'font-normal' : ''}`}>{opt.label}</span>
                          <span className="block text-xs text-muza-soft mt-px">{opt.desc}</span>
                        </span>
                        <span className="text-sm whitespace-nowrap">{opt.price === 0 ? 'zdarma' : formatPrice(opt.price)}</span>
                      </button>

                      {on && opt.value === 'zasilkovna' && (
                        <div className="ml-[34px] mb-4">
                          {selectedPickupPoint ? (
                            <div className="text-sm">
                              <p>{selectedPickupPoint.name}</p>
                              <p className="text-xs text-muza-soft">{selectedPickupPoint.street}, {selectedPickupPoint.zip} {selectedPickupPoint.city}</p>
                              <button type="button" onClick={openPacketaWidget} className="mt-1.5 text-sm text-muza-ink underline underline-offset-[3px]">
                                Změnit výdejní místo
                              </button>
                            </div>
                          ) : (
                            <button type="button" onClick={openPacketaWidget} disabled={!packetaLoaded}
                              className="text-sm text-muza-ink underline underline-offset-[3px] disabled:opacity-50 disabled:no-underline">
                              {packetaLoaded ? 'Vybrat výdejní místo' : 'Načítám výdejní místa…'}
                            </button>
                          )}
                          {!packetaLoaded && packetaFailed && !selectedPickupPoint && (
                            <p role="alert" className="mt-2 text-xs text-text-mid">
                              Výběr výdejních míst se nenačetl. Obnovte stránku, nebo zvolte jiný způsob dopravy.
                            </p>
                          )}
                        </div>
                      )}

                      {on && needsAddress && (
                        <div className="ml-[34px] mb-4 grid grid-cols-[1fr_96px] gap-x-3.5">
                          <label className="col-span-2">
                            <span className={labelClass}>{dpdPoint ? 'Výdejní místo DPD (název nebo ulice)' : 'Ulice a číslo'}</span>
                            <input type="text" name="streetAddress" autoComplete="street-address" required value={formData.streetAddress}
                              onChange={handleInputChange} disabled={loading} className={fieldClass} />
                          </label>
                          <label className="pt-2.5">
                            <span className={labelClass}>Město</span>
                            <input type="text" name="city" autoComplete="address-level2" required value={formData.city}
                              onChange={handleInputChange} disabled={loading} className={fieldClass} />
                          </label>
                          <label className="pt-2.5">
                            <span className={labelClass}>PSČ</span>
                            <input type="text" name="zipCode" autoComplete="postal-code" inputMode="numeric" required value={formData.zipCode}
                              onChange={handleInputChange} disabled={loading} className={fieldClass} />
                          </label>
                          <label className="col-span-2 pt-2.5">
                            <span className={labelClass}>Země</span>
                            <select name="country" autoComplete="country" value={formData.country} onChange={handleInputChange} disabled={loading} className={fieldClass}>
                              <option value="CZ">Česká republika</option>
                              <option value="SK">Slovensko</option>
                              <option value="PL">Polsko</option>
                              <option value="DE">Německo</option>
                              <option value="AT">Rakousko</option>
                            </select>
                          </label>
                        </div>
                      )}

                      {on && opt.value === 'dpd' && (
                        <div className="ml-[34px] mb-4 text-sm">
                          {dpdPoint && <p className="whitespace-pre-line">{dpdPoint.text}</p>}
                          <button type="button" onClick={() => setDpdOpen(true)} className="mt-1.5 text-sm text-muza-ink underline underline-offset-[3px]">
                            {dpdPoint ? 'Změnit výdejní místo' : 'Vybrat výdejní místo nebo box'}
                          </button>
                        </div>
                      )}

                      {on && opt.value === 'showroom' && (
                        <p className="ml-[34px] mb-4 text-xs text-muza-soft">Čas vyzvednutí domluvíme telefonem.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Platba */}
            <section aria-labelledby="h-platba" className="mt-9">
              <h2 id="h-platba" className={`${sectionTitle} mb-2.5`}>Platba</h2>
              <p className="mb-2 text-sm text-[#45302F]">Platí se vždy předem, u každého způsobu doručení i u osobního odběru.</p>
              <div role="radiogroup" aria-labelledby="h-platba" className="border-t border-muza-line">
                {[
                  { id: 'transfer' as const, label: 'Bankovním převodem', desc: 'QR platba hned po odeslání objednávky', enabled: true },
                  // karta se ukáže až po zapnutí GoPay
                  ...(CARD_ENABLED ? [{ id: 'gopay' as const, label: 'Kartou online', desc: 'Apple Pay, Google Pay, karta (GoPay)', enabled: true }] : []),
                ].map((o) => {
                  const on = payment === o.id;
                  return (
                    <button key={o.id} type="button" role="radio" aria-checked={on} disabled={loading || !o.enabled}
                      onClick={() => setPayment(o.id)}
                      className="w-full flex items-center gap-3.5 min-h-[60px] py-2.5 text-left border-b border-muza-line disabled:opacity-45">
                      <Radio on={on} />
                      <span className="flex-1 min-w-0">
                        <span className={`block text-[15px] ${on ? 'font-normal' : ''}`}>{o.label}</span>
                        <span className="block text-xs text-muza-soft mt-px">{o.desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Poznámka a slevový kód */}
            <section className="mt-8 space-y-4">
              {noteOpen ? (
                <label className="block">
                  <span className={`${sectionTitle} block mb-2`}>Poznámka</span>
                  <textarea name="note" rows={3} maxLength={1000} value={formData.note} onChange={handleInputChange} disabled={loading}
                    placeholder="Přání k odstínu, termín aplikace…"
                    className="w-full px-3.5 py-3 rounded-xl border border-muza-field bg-white text-base font-light leading-normal placeholder:text-[#A39389] focus:outline-none focus:border-muza-ink resize-y" />
                </label>
              ) : (
                <button type="button" onClick={() => setNoteOpen(true)} className="flex items-center gap-2 text-sm text-muza-ink">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  Přidat poznámku k objednávce
                </button>
              )}

              {couponApplied ? (
                <div className="flex items-center justify-between text-sm">
                  <span>Kód {couponCode} <span className="text-success">−{formatPrice(couponDiscount)}</span></span>
                  <button type="button" onClick={handleRemoveCoupon} className="text-xs text-muza-soft underline underline-offset-2">Odebrat</button>
                </div>
              ) : couponOpen ? (
                <div>
                  <div className="flex gap-3 items-end">
                    <label className="flex-1 min-w-0">
                      <span className={labelClass}>Slevový kód</span>
                      <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} disabled={couponLoading}
                        className={`${fieldClass} uppercase`} />
                    </label>
                    <button type="button" onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                      className="h-11 px-5 rounded-full border border-muza-ink text-sm text-muza-ink disabled:opacity-40">
                      {couponLoading ? '…' : 'Použít'}
                    </button>
                  </div>
                  {couponError && <p className="text-xs mt-2 text-error">{couponError}</p>}
                </div>
              ) : (
                <button type="button" onClick={() => setCouponOpen(true)} className="flex items-center gap-2 text-sm text-muza-ink">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  Mám slevový kód
                </button>
              )}
            </section>

            <div className="mt-9 lg:hidden">{totals}</div>

            <p className="mt-5 text-xs leading-relaxed text-muza-soft">
              Odesláním objednávky souhlasíte s{' '}
              <Link href="/obchodni-podminky" className="text-muza-ink underline underline-offset-2">obchodními podmínkami</Link>
              {' '}a{' '}
              <Link href="/ochrana-osobnich-udaju" className="text-muza-ink underline underline-offset-2">zpracováním osobních údajů</Link>.
            </p>
          </form>

          {/* Souhrn – desktop */}
          <aside aria-label="Souhrn objednávky" className="hidden lg:block sticky top-28">
            <div className="space-y-4 pb-5">
              {items.map((item) => (
                <div key={item.skuId} className="flex justify-between gap-4 text-sm">
                  <span className="min-w-0">{describeItem(item)}</span>
                  <span className="flex-none">{formatPrice(item.lineGrandTotal)}</span>
                </div>
              ))}
            </div>
            {totals}
            <button type="submit" form="checkout" disabled={loading}
              className="mt-7 w-full h-14 flex items-center justify-center gap-2.5 rounded-full bg-muza-ink text-muza-onink text-[15px] tracking-[0.02em] hover:opacity-90 transition-opacity disabled:opacity-50">
              {submitLabel}
            </button>
            <Link href="/kosik" className="mt-4 block text-center text-sm text-muza-soft underline underline-offset-2">Zpět do košíku</Link>
          </aside>
        </div>

        {/* Mapa výdejních míst a boxů DPD */}
        {dpdOpen && (
          <div role="dialog" aria-modal="true" aria-label="Výběr výdejního místa DPD" onClick={(e) => { if (e.target === e.currentTarget) setDpdOpen(false); }}
            className="fixed inset-0 z-[90] bg-[rgba(42,10,11,0.45)] flex items-end lg:items-center justify-center">
            <div className="relative w-full lg:max-w-4xl h-[92vh] lg:h-[80vh] bg-white rounded-t-3xl lg:rounded-2xl overflow-hidden">
              <iframe src="https://api.dpd.cz/widget/latest/index.html?enabledCountries=CZ&enabledCountries=SK" title="Výdejní místa a boxy DPD"
                allow="geolocation" className="w-full h-full border-0" />
            </div>
          </div>
        )}

        {/* Tlačítko – mobil, stále po ruce */}
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-muza-cream from-75% to-transparent">
          <button type="submit" form="checkout" disabled={loading}
            className="w-full h-14 flex items-center justify-center gap-2.5 rounded-full bg-muza-ink text-muza-onink text-[15px] tracking-[0.02em] active:opacity-90 transition-opacity disabled:opacity-50">
            {submitLabel}
          </button>
        </div>
      </div>
    </>
  );
}
