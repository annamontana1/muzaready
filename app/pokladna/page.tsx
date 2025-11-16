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
    address: '',
    city: '',
    postalCode: '',
    country: 'CZ',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.firstName || !formData.address || !formData.city) {
        setError('Prosím vyplňte všechna povinná pole');
        setLoading(false);
        return;
      }

      // Prepare order data using new SKU structure
      const orderData = {
        email: formData.email,
        items: items.map((item) => ({
          skuId: item.skuId,
          skuName: item.skuName,
          saleMode: item.saleMode,
          quantity: item.saleMode === 'PIECE_BY_WEIGHT' ? item.quantity : item.grams,
          lineGrandTotal: item.lineGrandTotal,
          ending: item.ending,
        })),
        subtotal: total,
        shipping: shipping,
        total: total + shipping,
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };

      // Send to API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Chyba při vytváření objednávky');
        setLoading(false);
        return;
      }

      const { orderId } = await response.json();
      setSuccess('Objednávka byla vytvořena! Přesměrování...');

      // Clear cart after successful order
      clearCart();

      // Redirect to confirmation after 2 seconds
      setTimeout(() => {
        window.location.href = `/pokladna/potvrzeni?orderId=${orderId}`;
      }, 2000);
    } catch (err) {
      setError('Chyba při zpracování objednávky. Zkuste to prosím později.');
      console.error(err);
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
                name="address"
                value={formData.address}
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
                  name="postalCode"
                  value={formData.postalCode}
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

            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-600">Mezisoučet:</p>
                <p className="text-gray-900 font-medium">{total.toLocaleString('cs-CZ')} Kč</p>
              </div>
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
                    {(total + shipping).toLocaleString('cs-CZ')} Kč
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
