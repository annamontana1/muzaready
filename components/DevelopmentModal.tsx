'use client';

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'muza-dev-modal-seen';

export default function DevelopmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Check if user has seen the modal before
    const hasSeenModal = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenModal) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  // Fokus na tlačítko a zavření klávesou Esc
  useEffect(() => {
    if (!isOpen) return;
    buttonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        localStorage.setItem(STORAGE_KEY, 'true');
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-burgundy-dark/50" onClick={handleClose} aria-hidden="true" />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dev-modal-title"
        className="relative bg-white rounded-2xl shadow-heavy max-w-lg w-full overflow-hidden animate-modal-in"
      >
        <div className="bg-burgundy px-6 pt-8 pb-6 text-ivory text-center">
          <h2 id="dev-modal-title" className="text-3xl sm:text-4xl font-cormorant font-light">
            Web je ve vývoji
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 text-center">
          <p className="text-lg text-text-mid mb-4">
            Připravujeme pro vás <strong>nový e-shop</strong> s pravými vlasy nejvyšší kvality.
          </p>

          <p className="text-text-mid mb-6">
            Některé funkce zatím nemusí fungovat správně. Děkujeme za trpělivost a pochopení.
          </p>

          <div className="bg-ivory rounded-lg p-4 mb-6">
            <p className="text-sm text-text-mid mb-2">Máte dotaz? Kontaktujte nás:</p>
            <a
              href="https://wa.me/420728722880"
              target="_blank"
              rel="noopener noreferrer"
              className="text-burgundy font-semibold hover:underline"
            >
              +420 728 722 880
            </a>
          </div>

          <button
            ref={buttonRef}
            onClick={handleClose}
            className="w-full sm:w-auto min-h-[44px] px-8 py-3 bg-burgundy hover:bg-maroon text-white font-medium rounded-lg transition-[transform,background-color] duration-150 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
          >
            Rozumím, pokračovat na web
          </button>
        </div>
      </div>
    </div>
  );
}
