'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';

// Packeta widget types
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

export default function PokladnaPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [packetaLoaded, setPacketaLoaded] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    country: 'CZ',
    deliveryMethod: 'standard', // standard nebo zasilkovna
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  // Zásilkovna state
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<PacketaPoint | null>(null);

  // Calculate totals using new cart structure
  const total = getTotalPrice();
  const shippingThreshold = 3000;

  // Zásilkovna má fixní cenu 65 Kč, showroom odběr je ZDARMA
  const getShippingCost = () => {
    if (formData.deliveryMethod === 'zasilkovna') return 65;
    if (formData.deliveryMethod === 'showroom') return 0;
    return total >= shippingThreshold ? 0 : 150;
  };
  const shipping = getShippingCost();

  // Open Packeta widget to select pickup point
  const openPacketaWidget = () => {
    if (!window.Packeta) {
      alert(t('checkout.shippingMethod.packetaLoading'));
      return;
    }

    // API klíč - POZNÁMKA: Tento klíč je placeholder, musíte ho nahradit skutečným API klíčem ze Zásilkovny
    const apiKey = process.env.NEXT_PUBLIC_PACKETA_API_KEY || 'demo-api-key';

    window.Packeta.Widget.pick(
      apiKey,
      (point) => {
        if (point) {
          setSelectedPickupPoint(point);
          console.log('Selected pickup point:', point);
        }
      },
      {
        country: formData.country,
        language: 'cs',
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Zadejte kód kupónu');
      return;
    }

    setCouponLoading(true);
    setCouponError('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount: total,
          userEmail: formData.email || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setCouponError(data.error || 'Neplatný kupón');
        setCouponDiscount(0);
        setCouponApplied(false);
      } else {
        setCouponDiscount(data.discount.amount);
        setCouponApplied(true);
        setCouponError('');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Chyba při ověřování kupónu');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(false);
    setCouponError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.firstName) {
        setError(t('checkout.requiredFields'));
        setLoading(false);
        return;
      }

      // Validate Zásilkovna selection
      if (formData.deliveryMethod === 'zasilkovna' && !selectedPickupPoint) {
        setError(t('checkout.shippingMethod.pickupPointRequired'));
        setLoading(false);
        return;
      }

      // Validate address for standard delivery
      if (formData.deliveryMethod === 'standard' && (!formData.streetAddress || !formData.city)) {
        setError(t('checkout.addressRequired'));
        setLoading(false);
        return;
      }

      // Prepare order data for creation
      // Use simpler structure for /api/orders endpoint which expects quoteCartLines format
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
          streetAddress: formData.deliveryMethod === 'zasilkovna'
            ? (selectedPickupPoint?.street || '')
            : formData.deliveryMethod === 'showroom'
            ? 'Revoluční 8'
            : formData.streetAddress,
          city: formData.deliveryMethod === 'zasilkovna'
            ? (selectedPickupPoint?.city || '')
            : formData.deliveryMethod === 'showroom'
            ? 'Praha 1'
            : formData.city,
          zipCode: formData.deliveryMethod === 'zasilkovna'
            ? (selectedPickupPoint?.zip || '')
            : formData.deliveryMethod === 'showroom'
            ? '110 00'
            : formData.zipCode,
          country: formData.country,
          deliveryMethod: formData.deliveryMethod,
        },
        // Zásilkovna pickup point data
        packetaPoint: formData.deliveryMethod === 'zasilkovna' && selectedPickupPoint
          ? {
              id: selectedPickupPoint.id,
              name: selectedPickupPoint.name,
              street: selectedPickupPoint.street,
              city: selectedPickupPoint.city,
              zip: selectedPickupPoint.zip,
              country: selectedPickupPoint.country,
            }
          : undefined,
        couponCode: couponApplied && couponCode ? couponCode.trim() : undefined,
      };

      // Step 1: Create order in database (status: pending)
      console.log('📝 Creating order...');
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderCreationData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        setError(errorData.error || t('checkout.errors.orderCreation'));
        setLoading(false);
        return;
      }

      const orderResult = await orderResponse.json();
      const { orderId, total: orderTotal } = orderResult;

      console.log(`✅ Order created: ${orderId}, total: ${orderTotal} CZK`);
      setSuccess(t('checkout.payment.orderCreated'));

      // Step 2: Create payment session with GoPay
      console.log('💳 Creating GoPay payment session...');
      const paymentResponse = await fetch('/api/gopay/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          amount: orderTotal,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        }),
      });

      if (!paymentResponse.ok) {
        const paymentError = await paymentResponse.json();
        console.error('❌ Payment creation failed:', paymentError);
        setError(
          paymentError.error || t('checkout.errors.paymentCreation')
        );
        setLoading(false);
        return;
      }

      const paymentData = await paymentResponse.json();
      const { paymentUrl } = paymentData;

      if (!paymentUrl) {
        setError(t('checkout.errors.paymentUrl'));
        setLoading(false);
        return;
      }

      console.log(`✅ Payment session created, redirecting to GoPay...`);

      // Clear cart after successful order creation (before redirect)
      clearCart();

      // Step 3: Redirect to GoPay payment gateway
      // The customer completes payment, then GoPay redirects them back to confirmation page
      // A webhook will be called to confirm payment and deduct stock
      window.location.href = paymentUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('errors.generic');
      setError(`${t('checkout.errors.generic')}: ${errorMessage}`);
      console.error('❌ Checkout error:', err);
      setLoading(false);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">{t('checkout.title')}</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-800 mb-4">{t('checkout.empty')}</p>
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske"
            className="inline-block bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-maroon transition"
          >
            {t('checkout.emptyButton')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Packeta Widget Library */}
      <Script
        src="https://widget.packeta.com/www/js/library.js"
        strategy="lazyOnload"
        onLoad={() => setPacketaLoaded(true)}
      />

      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('checkout.shipping.email')} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                placeholder={language === 'cs' ? 'vase@email.cz' : 'your@email.com'}
              />
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.shipping.firstName')} *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder={t('checkout.shipping.firstName')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('checkout.shipping.lastName')} *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder={t('checkout.shipping.lastName')}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('checkout.shipping.phoneOptional')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                placeholder="+420 123 456 789"
              />
            </div>

            {/* Delivery Method Selection */}
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('checkout.shippingMethod.title')} *
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="standard"
                    checked={formData.deliveryMethod === 'standard'}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{t('checkout.shippingMethod.standard')}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('checkout.shippingMethod.standardDesc')}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        {total >= shippingThreshold ? t('common.free') : '150 Kč'}
                      </p>
                    </div>
                    {total < shippingThreshold && (
                      <p className="text-xs text-gray-500 mt-2">
                        {t('checkout.shippingMethod.standardFree', { threshold: shippingThreshold.toLocaleString(language === 'cs' ? 'cs-CZ' : 'en-US') })}
                      </p>
                    )}
                  </div>
                </label>

                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="zasilkovna"
                    checked={formData.deliveryMethod === 'zasilkovna'}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{t('checkout.shippingMethod.pickup')}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('checkout.shippingMethod.pickupDesc')}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">65 Kč</p>
                    </div>
                    {formData.deliveryMethod === 'zasilkovna' && (
                      <div className="mt-3">
                        {selectedPickupPoint ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm font-medium text-green-900 mb-1">
                              ✓ {t('checkout.shippingMethod.selectedPickupPoint')}
                            </p>
                            <p className="text-sm text-green-800 font-medium">
                              {selectedPickupPoint.name}
                            </p>
                            <p className="text-xs text-green-700">
                              {selectedPickupPoint.street}, {selectedPickupPoint.city},{' '}
                              {selectedPickupPoint.zip}
                            </p>
                            <button
                              type="button"
                              onClick={openPacketaWidget}
                              className="mt-2 text-sm text-burgundy hover:text-maroon font-medium"
                            >
                              {t('checkout.shippingMethod.changePickupPoint')}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={openPacketaWidget}
                            className="w-full px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-maroon transition font-medium"
                          >
                            {t('checkout.shippingMethod.selectPickupPoint')}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </label>

                <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="showroom"
                    checked={formData.deliveryMethod === 'showroom'}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{t('checkout.shippingMethod.showroom')}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {t('checkout.shippingMethod.showroomDesc')}
                        </p>
                      </div>
                      <p className="font-medium text-green-600">{t('common.free')}</p>
                    </div>
                    {formData.deliveryMethod === 'showroom' && (
                      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-900 font-medium mb-1">
                          📍 {t('checkout.shippingMethod.showroomAddress')}
                        </p>
                        <p className="text-sm text-blue-800">
                          Revoluční 8, 110 00 Praha 1
                        </p>
                        <p className="text-xs text-blue-700 mt-2">
                          {t('checkout.shippingMethod.showroomInfo')}
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Address - only show if standard delivery selected */}
            {formData.deliveryMethod === 'standard' && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">{t('checkout.deliveryAddress')}</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.shipping.address')} *
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    required={formData.deliveryMethod === 'standard'}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                    placeholder={t('checkout.shipping.address')}
                  />
                </div>

                {/* City and Postal Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.shipping.city')} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required={formData.deliveryMethod === 'standard'}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                      placeholder={language === 'cs' ? 'Praha' : 'Prague'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('checkout.shipping.zip')} *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required={formData.deliveryMethod === 'standard'}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                      placeholder="110 00"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('checkout.shipping.country')}
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  >
                    <option value="CZ">{t('checkout.countries.CZ')}</option>
                    <option value="SK">{t('checkout.countries.SK')}</option>
                    <option value="PL">{t('checkout.countries.PL')}</option>
                    <option value="DE">{t('checkout.countries.DE')}</option>
                    <option value="AT">{t('checkout.countries.AT')}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-maroon transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('checkout.payment.processing') : t('checkout.payment.continueToPayment')}
            </button>

            <p className="text-xs text-gray-500 text-center">
              {t('checkout.required')}
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('cart.orderSummary')}</h2>

            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
              {items.map((item) => (
                <div key={item.skuId} className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-900 font-medium">{item.skuName}</p>
                    <p className="text-gray-600">
                      {item.saleMode === 'BULK_G'
                        ? `${item.grams}g @ ${item.pricePerGram.toLocaleString('cs-CZ')} Kč/g`
                        : `${item.quantity}x`}
                    </p>
                    {item.assemblyFeeTotal > 0 && (
                      <p className="text-gray-500 text-xs">
                        Poplatek: {item.assemblyFeeTotal.toLocaleString('cs-CZ')} Kč
                      </p>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium">
                    {item.lineGrandTotal.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              ))}
            </div>

            {/* Coupon Input */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('cart.coupon.title')}?
              </label>
              {!couponApplied ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="KÓD KUPÓNU"
                    disabled={couponLoading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy text-sm uppercase"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-burgundy text-white rounded-lg hover:bg-maroon transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponLoading ? 'Ověřuji...' : 'Použít'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-medium">{couponCode}</span>
                    <span className="text-green-600 text-sm">
                      (-{couponDiscount.toLocaleString('cs-CZ')} Kč)
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Odebrat
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-red-600 text-xs mt-2">{couponError}</p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-600">{t('cart.subtotal')}:</p>
                <p className="text-gray-900 font-medium">{total.toLocaleString(language === 'cs' ? 'cs-CZ' : 'en-US')} Kč</p>
              </div>
              {couponApplied && couponDiscount > 0 && (
                <div className="flex justify-between">
                  <p className="text-gray-600">{t('common.discount')} ({couponCode}):</p>
                  <p className="text-green-600 font-medium">
                    -{couponDiscount.toLocaleString(language === 'cs' ? 'cs-CZ' : 'en-US')} Kč
                  </p>
                </div>
              )}
              <div className="flex justify-between">
                <p className="text-gray-600">{t('cart.shipping')}:</p>
                <p className="text-gray-900 font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">{t('common.free')}</span>
                  ) : (
                    `${shipping} Kč`
                  )}
                </p>
              </div>
              {total <= shippingThreshold && (
                <p className="text-xs text-gray-500">
                  {t('cart.freeShippingRemaining')} {(shippingThreshold - total).toLocaleString(language === 'cs' ? 'cs-CZ' : 'en-US')} Kč
                </p>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <p className="text-lg font-bold text-gray-900">{t('cart.total')}:</p>
                  <p className="text-lg font-bold text-burgundy">
                    {(total - couponDiscount + shipping).toLocaleString(language === 'cs' ? 'cs-CZ' : 'en-US')} Kč
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/kosik"
              className="mt-6 block text-center text-burgundy hover:text-maroon text-sm"
            >
              ← {t('nav.cart')}
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
