'use client';

import Link from 'next/link';

export default function TopContactBar() {
  // Konfigurace - později můžeš přesunout do globálního nastavení
  const phone = '728722880';
  const phoneFormatted = '728 722 880';
  const showroomText = 'Showroom: Revoluční 8, Praha';
  const showroomUrl = '/kontakt';

  // Pokud není telefon ani showroom, skryj celý bar
  if (!phone && !showroomText) {
    return null;
  }

  return (
    <div className="bg-[#F7F7F7] border-b border-gray-200 lg:hidden">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-700">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-1.5 hover:text-burgundy transition truncate"
              aria-label={`Zavolat na číslo ${phoneFormatted}`}
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="truncate">{phoneFormatted}</span>
            </a>
          )}

          {showroomText && (
            <>
              {phone && <span className="text-gray-400 mx-1">•</span>}
              <Link
                href={showroomUrl}
                className="flex items-center gap-1.5 hover:text-burgundy transition truncate"
                aria-label="Přejít na kontakt - showroom"
              >
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{showroomText}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
