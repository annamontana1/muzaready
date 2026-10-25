'use client';

import { useLanguage, Language } from '@/contexts/LanguageContext';

export default function LanguageSwitcher({ className, compact = false }: { className?: string; compact?: boolean } = {}) {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <select
      value={language}
      onChange={handleLanguageChange}
      className={className ?? 'border border-warm-beige rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-burgundy text-sm'}
      aria-label="Jazyk / Language"
    >
      <option value="cs">{compact ? 'CS' : 'Čeština'}</option>
      <option value="en">{compact ? 'EN' : 'English'}</option>
    </select>
  );
}
