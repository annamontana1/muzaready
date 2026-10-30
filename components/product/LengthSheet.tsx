'use client';

import { useEffect, useState } from 'react';

// Silueta ženy v cm: viewBox 0 0 125 200, podlaha na y=190.
// Postava se škáluje podle výšky, vlasy jsou nakreslené pro 100 cm od temene.
const FLOOR = 190;
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

export function hairZone(cm: number, height = 170) {
  const crownY = FLOOR - (height - 1.5);
  const r = (FLOOR - (crownY + cm)) / height;
  if (r > 0.8) return 'po ramena';
  if (r > 0.74) return 'pod ramena';
  if (r > 0.68) return 'pod lopatky';
  if (r > 0.62) return 'do půli zad';
  if (r > 0.565) return 'do pasu';
  if (r > 0.5) return 'na boky';
  return 'na hýždě';
}

interface LengthSheetProps {
  open: boolean;
  lengths: number[];
  value: number;
  onChange: (cm: number) => void;
  onClose: () => void;
}

export default function LengthSheet({ open, lengths, value, onChange, onClose }: LengthSheetProps) {
  const [height, setHeight] = useState(170);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  const k = height / 170;
  const crownY = FLOOR - (height - 1.5);
  const endY = crownY + value;
  const zone = hairZone(value, height);
  const transition = `transform 420ms ${EASE}`;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[80] bg-[rgba(42,10,11,0.35)] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Výběr délky"
        aria-hidden={!open}
        className="fixed inset-x-0 bottom-0 z-[81] mx-auto max-w-lg rounded-t-3xl bg-muza-ivory shadow-[0_-8px_24px_rgba(74,21,32,0.16)]"
        style={{ transform: open ? 'translateY(0)' : 'translateY(105%)', transition, visibility: open ? 'visible' : 'hidden' }}
      >
        <div className="mx-auto mt-2 mb-1.5 h-1 w-10 rounded-full bg-[#BBAD9F]" />
        <div className="flex items-end justify-between px-4">
          <div>
            <div className="text-[14px] text-text-mid">Délka vlasů</div>
            <div className="font-cormorant text-[38px] leading-none text-muza-ink">{value} <span className="text-lg">cm</span></div>
            <div className="mt-0.5 text-[14px] text-text-mid">sahají {zone}</div>
          </div>
          <div className="text-right">
            <div className="mb-1 text-xs text-text-mid">Vaše výška</div>
            <div className="flex h-11 items-center rounded-full border border-[#BBAD9F]">
              <button type="button" aria-label="Nižší postava" onClick={() => setHeight((h) => Math.max(150, h - 5))}
                className="h-full w-10 text-lg text-muza-ink">−</button>
              <span className="min-w-[56px] text-center text-sm">{height} cm</span>
              <button type="button" aria-label="Vyšší postava" onClick={() => setHeight((h) => Math.min(185, h + 5))}
                className="h-full w-10 text-lg text-muza-ink">+</button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <svg role="img" aria-label={`Postava ${height} cm, vlasy ${value} cm sahají ${zone}`} viewBox="0 0 125 200"
            className="h-[min(420px,46vh)] w-auto">
            <line x1="10" y1="190" x2="115" y2="190" stroke="#BBAD9F" strokeWidth="0.6" />
            <g stroke="#BBAD9F" strokeWidth="0.5">
              <line x1="17" y1="10" x2="17" y2="190" />
              {Array.from({ length: 19 }, (_, i) => 190 - i * 10).map((y, i) => (
                <line key={y} x1={i % 2 === 0 ? 12 : 14} y1={y} x2="17" y2={y} />
              ))}
            </g>
            <g fontFamily="Jost, sans-serif" fontSize="3.8" fill="#45302F">
              {[20, 40, 60, 80, 100, 120, 140, 160, 180].map((v) => (
                <text key={v} x="10.5" y={190 - v + 1.4} textAnchor="end">{v}</text>
              ))}
            </g>
            <g style={{ transformBox: 'view-box', transform: `translateY(${FLOOR - height}px)`, transition }}>
              <line x1="17" y1="0" x2="56" y2="0" stroke="#A07982" strokeWidth="0.4" strokeDasharray="1 1.5" />
              <circle cx="17" cy="0" r="1.3" fill="#330D0D" />
            </g>
            <g style={{ transformBox: 'view-box', transformOrigin: '62.5px 190px', transform: `scale(${k.toFixed(4)})`, transition }}>
              <ellipse cx="62.5" cy="31" rx="7.6" ry="10" fill="#FFFFFF" stroke="#A07982" strokeWidth="0.7" />
              <path fill="#FFFFFF" stroke="#A07982" strokeWidth="0.7" strokeLinejoin="round" d="M58.5 40.5 C58.5 45 57.5 47.5 53.5 48.6 C49.5 49.6 46.5 50.6 45.6 53.6 C44.6 60 43.8 70 43.2 80 C42.6 90 41.8 100 41.6 108 C41.9 110.4 43.6 110.4 44 108 C44.6 100 45.4 90 46.2 80 C47 72 47.6 66 48.4 62 C49.2 70 51 78 52.2 84 C51.2 90 46.5 96 46.5 102 C46.5 112 48.5 125 49.5 142 C50 155 50.5 170 51.3 182 C51.3 186 50.5 189 52.5 190 L58.2 190 C58.2 186 58.6 184 58.6 182 C59.1 170 59.6 155 60.1 142 C60.6 128 61.3 118 62.5 114 C63.7 118 64.4 128 64.9 142 C65.4 155 65.9 170 66.4 182 C66.4 184 66.8 186 66.8 190 L72.5 190 C74.5 189 73.7 186 73.7 182 C74.5 170 75 155 75.5 142 C76.5 125 78.5 112 78.5 102 C78.5 96 73.8 90 72.8 84 C74 78 75.8 70 76.6 62 C77.4 66 78 72 78.8 80 C79.6 90 80.4 100 81 108 C81.4 110.4 83.1 110.4 83.4 108 C83.2 100 82.4 90 81.8 80 C81.2 70 80.4 60 79.4 53.6 C78.5 50.6 75.5 49.6 71.5 48.6 C67.5 47.5 66.5 45 66.5 40.5 Z" />
              <path d="M54.5 108 Q62.5 113.5 70.5 108" fill="none" stroke="#BBAD9F" strokeWidth="0.5" />
            </g>
            <g style={{ transformBox: 'view-box', transformOrigin: '0 0', transform: `translate(62.5px, ${crownY.toFixed(2)}px) scale(${k.toFixed(4)}, ${(value / 100).toFixed(3)})`, transition }}>
              <path fill="#B98A5A" d="M-8 3 C-4 -2.5 4 -2.5 8 3 C10 9 11 16 12.5 24 C14.5 34 11 42 13.5 52 C15.5 62 11 72 12.5 82 C13.5 90 10.5 96 7.5 100 C4.5 98 2.5 101.5 0 99.5 C-2.5 101.5 -5 98 -7.5 100 C-10.5 96 -13.5 90 -12.5 82 C-11 72 -15.5 62 -13.5 52 C-11 42 -14.5 34 -12.5 24 C-11 16 -10 9 -8 3 Z" />
            </g>
            <g style={{ transformBox: 'view-box', transform: `translateY(${endY.toFixed(2)}px)`, transition }}>
              <line x1="17" y1="0" x2="95" y2="0" stroke="#330D0D" strokeWidth="0.5" strokeDasharray="1.6 1.6" />
              <circle cx="17" cy="0" r="1.3" fill="#330D0D" />
              <text x="97" y="1.6" fontFamily="Jost, sans-serif" fontSize="4.6" fill="#330D0D">{value} cm</text>
            </g>
          </svg>
        </div>

        <div role="radiogroup" aria-label="Délka" className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
          {lengths.map((cm) => {
            const on = cm === value;
            return (
              <button key={cm} type="button" role="radio" aria-checked={on} onClick={() => onChange(cm)}
                className={`h-11 min-w-[64px] flex-none rounded-full text-sm transition-colors duration-150 ${on ? 'bg-muza-ink text-muza-onink' : 'bg-muza-mocha text-text-dark'}`}>
                {cm} cm
              </button>
            );
          })}
        </div>
        <div className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={onClose}
            className="h-[52px] w-full rounded-full bg-muza-ink text-sm font-medium text-white">
            Potvrdit {value} cm
          </button>
        </div>
      </div>
    </>
  );
}
