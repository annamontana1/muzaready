'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useState } from 'react';

export default function PokladnaPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    streetAddress: '',
    city: '',
    zipCode: '',
    country: 'CZ',
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);

  // Calculate totals using new cart structure
  const total = getTotalPrice();
  const shippingThreshold = 3000;
  const shipping = total >= shippingThreshold ? 0 : 150;

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
      if (!formData.email || !formData.firstName || !formData.streetAddress || !formData.city) {
        setError('Prosím vyplňte všechna povinná pole');
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
          streetAddress: formData.streetAddress,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
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
        setError(errorData.error || 'Chyba při vytváření objednávky');
        setLoading(false);
        return;
      }

      const orderResult = await orderResponse.json();
      const { orderId, total: orderTotal } = orderResult;

      console.log(`✅ Order created: ${orderId}, total: ${orderTotal} CZK`);
      setSuccess('Objednávka vytvořena. Přesměrování na platbu...');

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
          paymentError.error ||
            'Chyba při vytváření platební relace. Objednávka byla vytvořena, prosím zkuste to znovu.'
        );
        setLoading(false);
        return;
      }

      const paymentData = await paymentResponse.json();
      const { paymentUrl } = paymentData;

      if (!paymentUrl) {
        setError('Chyba: Nebylo možné získat odkaz na platbu');
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
      const errorMessage = err instanceof Error ? err.message : 'Neznámá chyba';
      setError(`Chyba při zpracování objednávky: ${errorMessage}`);
      console.error('❌ Checkout error:', err);
      setLoading(false);
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold mb-6">Pokladna</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p className="text-yellow-800 mb-4">V košíku nic není.</p>
          <Link
            href="/vlasy-k-prodlouzeni/nebarvene-panenske"
            className="inline-block bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-maroon transition"
          >
            Pokračovat v nákupu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pokladna</h1>

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
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                placeholder="vase@email.cz"
              />
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jméno *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder="Jméno"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Příjmení *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder="Příjmení"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefonní číslo
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

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresa *
              </label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                placeholder="Ulice a číslo popisné"
              />
            </div>

            {/* City and Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Město *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder="Praha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PSČ *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                  placeholder="110 00"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Země
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              >
                <option value="CZ">Česká republika</option>
                <option value="SK">Slovensko</option>
                <option value="PL">Polsko</option>
                <option value="DE">Německo</option>
                <option value="AT">Rakousko</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-maroon transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Zpracovávám...' : 'Pokračovat k platbě'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              Povinná pole jsou označena *
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shrnutí objednávky</h2>

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
                Máte slevový kupón?
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
                <p className="text-gray-600">Mezisoučet:</p>
                <p className="text-gray-900 font-medium">{total.toLocaleString('cs-CZ')} Kč</p>
              </div>
              {couponApplied && couponDiscount > 0 && (
                <div className="flex justify-between">
                  <p className="text-gray-600">Sleva ({couponCode}):</p>
                  <p className="text-green-600 font-medium">
                    -{couponDiscount.toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              )}
              <div className="flex justify-between">
                <p className="text-gray-600">Doprava:</p>
                <p className="text-gray-900 font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Zdarma</span>
                  ) : (
                    `${shipping} Kč`
                  )}
                </p>
              </div>
              {total <= shippingThreshold && (
                <p className="text-xs text-gray-500">
                  Do dopravy zdarma zbývá: {(shippingThreshold - total).toLocaleString('cs-CZ')} Kč
                </p>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <p className="text-lg font-bold text-gray-900">Celkem:</p>
                  <p className="text-lg font-bold text-burgundy">
                    {(total - couponDiscount + shipping).toLocaleString('cs-CZ')} Kč
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/kosik"
              className="mt-6 block text-center text-burgundy hover:text-maroon text-sm"
            >
              ← Zpět na nákupní košík
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
