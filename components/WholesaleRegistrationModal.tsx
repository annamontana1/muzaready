'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

interface WholesaleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Odkaz na Instagram/Facebook salonu (nebo @profil), podle kterého žádost ověřujeme
export function isSocialProfile(value: string): boolean {
  const v = value.trim().toLowerCase();
  return /^@[a-z0-9._]{2,}$/.test(v) || /(^|\/\/|\.)(instagram\.com|facebook\.com|fb\.com|m\.facebook\.com)\/[^\s]+/.test(v);
}

export default function WholesaleRegistrationModal({
  isOpen,
  onClose,
}: WholesaleRegistrationModalProps) {
  const { registerWholesale, loading, error } = useAuth();
  const [localError, setLocalError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
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

    if (!isSocialProfile(formData.instagram)) {
      setLocalError('Zadejte odkaz na Instagram nebo Facebook vašeho salonu, bez něj žádost nemůžeme ověřit.');
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
      setDone(true);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Registrace selhala');
    }
  };

  if (!isOpen) return null;

  if (done) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div role="status" className="bg-white rounded-2xl max-w-md w-full p-7 text-center">
          <h2 className="font-cormorant text-[30px] leading-tight text-muza-ink">Děkujeme, žádost máme</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#45302F]">
            Projdeme profil vašeho salonu a velkoobchodní slevu zapneme obvykle do 48 hodin. Jakmile bude aktivní,
            pošleme vám e-mail. Pak stačí nakupovat přihlášená a sleva se odečte sama.
          </p>
          <button type="button" onClick={() => { setDone(false); onClose(); }}
            className="mt-6 w-full h-[50px] rounded-full bg-muza-ink text-muza-onink text-sm font-medium">Zpět do obchodu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="font-cormorant text-[30px] leading-tight text-muza-ink">Velkoobchodní ceny pro salony</h2>
          <button
            onClick={onClose}
            className="text-text-soft hover:text-text-mid text-2xl font-light"
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

          {/* Proč a za jakých podmínek: salon musí být vidět na sociálních sítích */}
          <div className="mb-4 rounded-2xl bg-[#F7F3EE] border border-muza-line p-4 text-sm leading-relaxed text-text-dark">
            <p>
              Spolupracujeme se salony a kadeřnicemi, které se prodlužování vlasů věnují naplno. Po schválení
              u nás nakupujete <b className="font-semibold">trvale o 10 % levněji</b>, na vlasy i zakončení.
            </p>
            <p className="mt-2.5 font-medium text-muza-ink">Co od vás potřebujeme</p>
            <ul className="mt-1 space-y-1 list-disc pl-5">
              <li><b className="font-semibold">Instagram nebo Facebook vašeho salonu, povinně.</b> Podle profilu ověříme, že salon aktivně působí a sdílí svou práci.</li>
              <li>Web salonu, pokud ho máte.</li>
            </ul>
            <p className="mt-2.5 text-[13px] text-[#45302F]">
              Slevu zapínáme ručně po kontrole, obvykle do 48 hodin. O schválení vám dáme vědět e-mailem.
            </p>
          </div>

          {/* Row 1: Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Jméno *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Příjmení *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 2: Contact */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Telefon</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 3: Company */}
          <div>
            <label className="block text-sm font-medium text-text-mid mb-1">Název firmy *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>

          {/* Row 4: Business Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Typ firmy</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-text-mid mb-1">DIČ</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Sociální sítě salonu: bez nich registraci nepustíme dál */}
          <div>
            <label className="block text-sm font-medium text-text-mid mb-1">
              Instagram nebo Facebook salonu *
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="instagram.com/vas-salon nebo facebook.com/vas-salon"
              className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
            />
            <p className="text-xs text-text-soft mt-1">Profil musí být veřejný a aktivní, podle něj žádost ověřujeme.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-mid mb-1">Web salonu (nepovinné)</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={loading}
              placeholder="www.vas-salon.cz"
              className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>

          {/* Row 6: Address */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Země</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                placeholder="ČR"
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Město</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">PSČ</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Adresa</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Row 7: Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Heslo *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
              />
              <p className="text-xs text-text-soft mt-1">Min. 8 znaků</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">
                Potvrzení hesla *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-warm-beige rounded-md focus:outline-none focus:ring-blue-500"
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
              className="flex-1 bg-gray-200 text-text-dark py-2 rounded-md font-medium hover:bg-gray-300 disabled:bg-soft-cream transition"
            >
              Zrušit
            </button>
          </div>

          <p className="text-xs text-text-soft text-center">
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
