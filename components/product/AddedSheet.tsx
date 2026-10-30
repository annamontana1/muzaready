'use client';

import { useEffect } from 'react';

// Okno „Přidáno do košíku“ (návrh B3): vyjede zespodu po přidání culíku,
// ukáže, co přesně zákaznice přidala, a nabídne košík nebo pokračování v nákupu.
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

interface Props {
  open: boolean;
  onClose: () => void;
  onGoCart: () => void;
  imageUrl?: string;
  title: string;
  shade?: string | null;
  shadeName?: string | null;
  rows: { k: string; v: React.ReactNode }[];
  cartTotal: string;
}

export default function AddedSheet({ open, onClose, onGoCart, imageUrl, title, shade, shadeName, rows, cartTotal }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div aria-hidden="true" onClick={onClose}
        className={`fixed inset-0 z-[80] bg-[rgba(42,10,11,0.35)] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <div role="dialog" aria-modal="true" aria-label="Přidáno do košíku" aria-hidden={!open}
        className="fixed inset-x-0 bottom-0 z-[81] mx-auto max-w-lg rounded-t-3xl bg-muza-ivory shadow-[0_-8px_24px_rgba(74,21,32,0.16)] text-text-dark font-light"
        style={{ transform: open ? 'translateY(0)' : 'translateY(105%)', transition: `transform 380ms ${EASE}`, visibility: open ? 'visible' : 'hidden' }}>
        <div className="mx-auto mt-2 mb-3.5 h-1 w-10 rounded-full bg-[#BBAD9F]" />
        <div className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <p role="status" className="flex items-center gap-2 text-sm text-[#2F5E3D]">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12l4 4 10-10" /></svg>
            Přidáno do košíku
          </p>
          <div className="mt-3 flex items-center gap-3.5">
            <span className="flex-none w-16 h-[84px] rounded-t-full rounded-b-[8px] border border-muza-ink p-[3px]">
              <span className="block w-full h-full rounded-t-full rounded-b-[6px] overflow-hidden bg-muza-mocha">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-cover" /> : null}
              </span>
            </span>
            <span>
              <span className="block font-cormorant text-[28px] leading-tight text-muza-ink [font-variant-numeric:lining-nums]">{title}</span>
              {(shade || shadeName) && (
                <span className="block text-[14px] text-[#45302F]">
                  odstín {shade && <b className="font-semibold text-text-dark">{shade}</b>}{shade && shadeName ? ' · ' : ''}{shadeName}
                </span>
              )}
            </span>
          </div>
          <dl className="mt-3.5">
            {[...rows, { k: 'V košíku celkem', v: <span className="font-jost font-semibold text-[20px] text-muza-ink tabular-nums">{cartTotal}</span> }].map((r, i, all) => (
              <div key={r.k} className={`flex items-center justify-between gap-3 py-3 border-t border-muza-line ${i === all.length - 1 ? 'border-b' : ''}`}>
                <dt className="text-sm font-normal text-[#45302F]">{r.k}</dt>
                <dd className="text-[15px] font-normal text-right">{r.v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-col gap-2.5">
            <button type="button" onClick={onGoCart}
              className="h-[52px] rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity">
              Přejít do košíku
            </button>
            <button type="button" onClick={onClose}
              className="h-[52px] rounded-full border border-muza-ink text-muza-ink text-sm font-medium">
              Pokračovat v nákupu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
