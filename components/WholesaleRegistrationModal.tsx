'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

interface WholesaleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WholesaleRegistrationModal({
  isOpen,
  onClose,
}: WholesaleRegistrationModalProps) {
  const { registerWholesale, loading, error } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
    businessType: '',
    website: '',
    instagram: '',
    country: '',
    city: '',
    zipCode: '',
    streetAddress: '',
    taxId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setLocalError('Vyplňte všechna povinná pole (email, heslo, jméno, příjmení)');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Hesla se neshodují');
      return;
    }

    if (formData.password.length < 8) {
      setLocalError('Heslo musí být alespoň 8 znaků');
      return;
    }

    if (!formData.companyName) {
      setLocalError('Zadejte název firmy');
      return;
    }

    if (!formData.businessType) {
      setLocalError('Vyberte typ podnikání');
      return;
    }

    try {
      await registerWholesale({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        companyName: formData.companyName,
        businessType: formData.businessType,
        website: formData.website || undefined,
        instagram: formData.instagram || undefined,
        country: formData.country || undefined,
        city: formData.city || undefined,
        zipCode: formData.zipCode || undefined,
        streetAddress: formData.streetAddress || undefined,
        taxId: formData.taxId || undefined,
      });
      onClose();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registrace selhala');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-burgundy">Registrace na velkoobchod</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(error || localError) && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error || localError}
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4">
            Vyplňte formulář pro registraci na velkoobchodní program. Po odeslání budeme vaši žádost
            zpracovávat.
          </p>

          {/* Row 1: Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jméno *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Příjmení *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 2: Contact */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Název firmy *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>

          {/* Row 4: Business Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ firmy</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              >
                <option value="">Vyberte typ...</option>
                <option value="salon">Salon krásy</option>
                <option value="stylist">Kadeřník/Kadeřnice</option>
                <option value="distributor">Distributor</option>
                <option value="eshop">E-shop</option>
                <option value="other">Jiné</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">DIČ</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 5: Web */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webové stránky
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                disabled={loading}
                placeholder="@vaseJmeno"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 6: Address */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Země</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                placeholder="ČR"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Město</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PSČ</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 7: Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heslo *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Min. 8 znaků</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Potvrzení hesla *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-burgundy text-white py-2 rounded-md font-medium hover:bg-maroon disabled:bg-gray-400 transition"
            >
              {loading ? 'Registruji...' : 'Registrovat se'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md font-medium hover:bg-gray-300 disabled:bg-gray-100 transition"
            >
              Zrušit
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Již máte účet?{' '}
            <a href="/auth/login" className="text-burgundy hover:underline font-medium">
              Přihlaste se
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
