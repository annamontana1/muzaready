'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'muza-dev-modal-seen';

export default function DevelopmentModal() {
  const [isOpen, setIsOpen] = useState(false);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-modal-in">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-burgundy via-maroon to-burgundy p-6 text-white text-center">
          <div className="text-5xl mb-3">🚧</div>
          <h2 className="text-2xl sm:text-3xl font-playfair font-bold">
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
            onClick={handleClose}
            className="w-full sm:w-auto px-8 py-3 bg-burgundy hover:bg-maroon text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Rozumím, pokračovat na web
          </button>
        </div>
      </div>
    </div>
  );
}
