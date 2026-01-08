'use client';

import { useLanguage, Language } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      className="border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-burgundy text-sm"
      aria-label="Select language"
    >
      <option value="cs">🇨🇿 Čeština</option>
      <option value="en">🇬🇧 English</option>
    </select>
  );
}
