'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { HAIR_COLORS } from '@/types/product';

interface ShadeGalleryProps {
  availableShades: number[];
  selectedShades: number[];
  onToggleShade: (shade: number) => void;
}

export default function ShadeGallery({
  availableShades,
  selectedShades,
  onToggleShade,
}: ShadeGalleryProps) {
  const [showModal, setShowModal] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const removeDiacritics = (str: string) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const getShadeImagePath = (shade: number) => {
    // Formát: /images/shades/01-cerna.jpg, 02-tmave-hneda.jpg, atd.
    const paddedNumber = shade.toString().padStart(2, '0');
    const shadeName = HAIR_COLORS[shade]?.name || 'unknown';
    const nameWithoutDiacritics = removeDiacritics(shadeName.toLowerCase()).replace(/\s+/g, '-');
    return `/images/shades/${paddedNumber}-${nameWithoutDiacritics}.jpg`;
  };

  const handleShadeClick = (shade: number) => {
    onToggleShade(shade);
  };

  const handleImageClick = (shade: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(shade);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  return (
    <>
      <div className="relative">
        {/* Scrollovací kontejner */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 md:gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-2 px-2"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {availableShades.map((shade) => {
            const color = HAIR_COLORS[shade];
            const isSelected = selectedShades.includes(shade);

            return (
              <button
                key={shade}
                onClick={() => handleShadeClick(shade)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleShadeClick(shade);
                }}
                className={`flex-shrink-0 snap-start group transition-transform duration-200 ${
                  isSelected ? 'scale-105' : 'hover:scale-105 active:scale-105'
                }`}
              >
                <div className="flex flex-col items-center gap-1 md:gap-2">
                  {/* Miniatura fotky */}
                  <div
                    className={`relative w-[75px] h-[100px] md:w-[90px] md:h-[120px] rounded-lg overflow-hidden transition-all ${
                      isSelected
                        ? 'ring-2 ring-[#4A1E1A] ring-offset-2 shadow-lg'
                        : 'hover:ring-2 hover:ring-[#4A1E1A] hover:shadow-md'
                    }`}
                  >
                    <Image
                      src={getShadeImagePath(shade)}
                      alt={`${color?.name} #${shade}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 75px, 90px"
                      unoptimized
                      onError={(e) => {
                        // Fallback na barevný gradient pokud obrázek neexistuje
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.style.background = `linear-gradient(135deg, ${color?.hex} 0%, ${color?.hex}dd 100%)`;
                        }
                      }}
                    />

                    {/* Ikona lupy v levém horním rohu */}
                    <button
                      onClick={(e) => handleImageClick(shade, e)}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setShowModal(shade);
                      }}
                      className="absolute top-2 left-2 z-10 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md transition pointer-events-auto"
                      aria-label="Zobrazit detail"
                    >
                      <svg
                        className="w-4 h-4 text-[#4A1E1A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Název odstínu */}
                  <div className="text-center">
                    <p
                      className={`text-xs font-semibold transition ${
                        isSelected ? 'text-[#4A1E1A]' : 'text-gray-700 group-hover:text-[#4A1E1A]'
                      }`}
                    >
                      #{shade}
                    </p>
                    <p
                      className={`text-[10px] transition ${
                        isSelected ? 'text-[#4A1E1A]' : 'text-gray-500'
                      }`}
                    >
                      {color?.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll hint pro mobil */}
        <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-[#e8e1d7] via-[#e8e1d7]/80 to-transparent pointer-events-none md:hidden flex items-center justify-end pr-2">
          <div className="text-[#4A1E1A]/40 text-xl animate-pulse">›</div>
        </div>
      </div>

      {/* Modal pro detail fotky */}
      {showModal !== null && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-600 hover:text-[#4A1E1A] transition shadow-lg"
              aria-label="Zavřít"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Detail fotky */}
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={getShadeImagePath(showModal)}
                alt={`${HAIR_COLORS[showModal]?.name} #${showModal}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px"
                unoptimized
                priority
              />
            </div>

            {/* Info panel */}
            <div className="p-6 bg-[#e8e1d7]">
              <h3 className="text-xl font-playfair text-[#4A1E1A] mb-2">
                {HAIR_COLORS[showModal]?.name} #{showModal}
              </h3>
              <p className="text-sm text-gray-700">
                Klikněte na fotografii pro výběr tohoto odstínu.
              </p>
              <button
                onClick={() => {
                  handleShadeClick(showModal);
                  closeModal();
                }}
                className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition ${
                  selectedShades.includes(showModal)
                    ? 'bg-gray-200 text-gray-600'
                    : 'bg-[#4A1E1A] text-white hover:bg-[#6E2A2A]'
                }`}
              >
                {selectedShades.includes(showModal) ? 'Odebrat z filtru' : 'Vybrat tento odstín'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}
