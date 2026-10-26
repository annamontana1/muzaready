'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { soldByGrams, GRAM_STEP, PIECE_MIN_GRAMS, PIECE_MAX_GRAMS } from '@/lib/sale-rule';

// Košík ve stylu detailu (návrh B3): culík v oblouku a pod ním tabulka
// délka / gramáž / cena za gram / zakončení / cena. Gramáž jde upravit přímo tady.

const ENDING_LABELS: Record<string, string> = {
  NONE: 'Bez zakončení',
  KERATIN: 'Keratin',
  STANDARD_KERATIN: 'Keratin',
  MICRO_KERATIN: 'Mikrokeratin',
  PASKY_KERATINU: 'Keratinové pásky',
  TAPES: 'Pásky / tape-in',
  WEFT: 'Weft',
};

const CATEGORY_LABELS: Record<string, string> = {
  PLATINUM_EDITION: 'Platinum Edition',
  LUXE: 'Luxe',
  BABY_SHADES: 'Baby Shades',
  STANDARD: 'Standard',
};

// Doplňující údaje o kusu z detailu (fotka, druh, název odstínu)
interface PieceInfo { imageUrl?: string; isDyed?: boolean; shadeName?: string | null }

const formatPrice = (price: number, decimals = false) =>
  new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(price);

const rowClass = 'flex items-center justify-between gap-3 py-3 border-t border-muza-line';
const dtClass = 'text-sm font-normal text-[#45302F]';
const ddClass = 'text-[15px] font-normal text-text-dark text-right';

export default function CartPage() {
  const { items, updateGrams, removeFromCart, getTotalPrice } = useCart();
  const [info, setInfo] = useState<Record<string, PieceInfo>>({});

  useEffect(() => {
    const missing = items.map((i) => i.skuId).filter((id) => !info[id]);
    if (!missing.length) return;
    let alive = true;
    Promise.all(missing.map((id) => fetch(`/api/sku/public/${id}`).then((r) => (r.ok ? r.json() : null)).catch(() => null)))
      .then((list) => {
        if (!alive) return;
        const next: Record<string, PieceInfo> = {};
        list.forEach((sku, i) => {
          next[missing[i]] = { imageUrl: sku?.imageUrl || sku?.images?.[0], isDyed: sku?.isDyed, shadeName: sku?.shadeName };
        });
        setInfo((prev) => ({ ...prev, ...next }));
      });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const subtotal = getTotalPrice();
  const count = items.length;

  if (count === 0) {
    return (
      <div className="min-h-screen bg-muza-ivory text-text-dark font-light">
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <h1 className="font-cormorant text-[40px] leading-none text-muza-ink">Košík je prázdný</h1>
          <p className="mt-3 text-[15px] text-[#45302F]">Vyberte si culík a vraťte se sem.</p>
          <Link href="/katalog"
            className="mt-8 inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity">
            Vybrat culík
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muza-ivory text-text-dark font-light pb-32 lg:pb-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-6 lg:pt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:items-start">
        <div className="min-w-0">
          <h1 className="font-cormorant text-[40px] lg:text-[48px] leading-none text-muza-ink">Košík</h1>
          <p className="mt-1 text-sm text-[#45302F]">{count === 1 ? '1 položka' : count < 5 ? `${count} položky` : `${count} položek`}</p>

          <ul className="mt-2">
            {items.map((item) => {
              const extra = info[item.skuId] ?? {};
              const img = item.imageUrl || extra.imageUrl;
              const title = (item.skuName || 'Vlasy').split(' · ')[0];
              const druh = typeof extra.isDyed === 'boolean' ? (extra.isDyed ? 'Středoevropské' : 'Panenské') : null;
              const kind = [druh, item.customerCategory ? CATEGORY_LABELS[item.customerCategory] : null].filter(Boolean).join(' · ');
              const editable = soldByGrams({ saleMode: item.saleMode, customerCategory: item.customerCategory }) && item.grams > 0;
              const isPiece = item.saleMode !== 'BULK_G';
              const canDec = item.grams > PIECE_MIN_GRAMS;
              const canInc = !isPiece || item.grams < PIECE_MAX_GRAMS;
              return (
                <li key={item.skuId} className="pt-5 mt-5 border-t border-muza-line first:border-t-0 first:mt-3">
                  <div className="flex gap-3.5">
                    <Link href={`/sku-detail/${item.skuId}`} aria-label={`Zobrazit ${title}`}
                      className="flex-none w-[76px] h-[100px] rounded-t-full rounded-b-[8px] border border-muza-ink p-[3px]">
                      <span className="block w-full h-full rounded-t-full rounded-b-[6px] overflow-hidden bg-muza-mocha">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : null}
                      </span>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <Link href={`/sku-detail/${item.skuId}`} className="font-cormorant text-[26px] leading-tight text-muza-ink [font-variant-numeric:lining-nums]">{title}</Link>
                        <button type="button" onClick={() => removeFromCart(item.skuId)}
                          className="text-[13px] text-[#45302F] underline underline-offset-2 py-1">Odebrat</button>
                      </div>
                      {kind && <p className="text-[13px] text-[#45302F]">{kind}</p>}
                      {(item.shade || extra.shadeName) && (
                        <p className="text-[13px] text-[#45302F]">
                          odstín {item.shade && <b className="font-semibold text-text-dark">{item.shade}</b>}{item.shade && extra.shadeName ? ' · ' : ''}{extra.shadeName}
                        </p>
                      )}
                    </div>
                  </div>

                  <dl className="mt-3">
                    {item.selectedLength ? (
                      <div className={rowClass}><dt className={dtClass}>Délka</dt><dd className={ddClass}><b className="font-semibold">{item.selectedLength}</b> cm</dd></div>
                    ) : null}
                    {item.grams > 0 && (
                      <div className={rowClass}>
                        <dt className={dtClass}>Gramáž</dt>
                        <dd className="flex items-center gap-2.5">
                          {editable ? (
                            <>
                              <button type="button" aria-label={`Ubrat ${GRAM_STEP} g`} disabled={!canDec}
                                onClick={() => updateGrams(item.skuId, item.grams - GRAM_STEP)}
                                className="w-8 h-8 rounded-full border border-muza-ink text-muza-ink leading-none disabled:opacity-30">−</button>
                              <span className="min-w-[60px] text-center text-[15px]" aria-live="polite"><b className="font-semibold">{item.grams}</b> g</span>
                              <button type="button" aria-label={`Přidat ${GRAM_STEP} g`} disabled={!canInc}
                                onClick={() => updateGrams(item.skuId, item.grams + GRAM_STEP)}
                                className="w-8 h-8 rounded-full border border-muza-ink text-muza-ink leading-none disabled:opacity-30">+</button>
                            </>
                          ) : (
                            <span className="text-[15px]"><b className="font-semibold">{item.grams}</b> g · celý culík</span>
                          )}
                        </dd>
                      </div>
                    )}
                    {item.pricePerGram > 0 && item.grams > 0 && (
                      // Cena za gram dobře čitelná, ne drobným písmem
                      <div className={rowClass}><dt className={dtClass}>Cena za gram</dt><dd className={ddClass}>{formatPrice(item.pricePerGram, true)} / g</dd></div>
                    )}
                    <div className={rowClass}>
                      <dt className={dtClass}>Zakončení</dt>
                      <dd className={ddClass}>
                        {ENDING_LABELS[item.ending] || item.ending}
                        {item.assemblyFeeTotal > 0 && <span className="block text-[13px] text-[#45302F]">{formatPrice(item.assemblyFeeTotal)}</span>}
                      </dd>
                    </div>
                    <div className={`${rowClass} border-b`}>
                      <dt className={dtClass}>Cena</dt>
                      <dd className="font-jost font-semibold text-[18px] text-muza-ink tabular-nums">{formatPrice(item.lineGrandTotal)}</dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </div>

        <aside aria-label="Souhrn košíku" className="mt-6 lg:mt-14 lg:sticky lg:top-28">
          <div className="rounded-2xl border border-muza-line bg-muza-cream p-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-[#45302F]">Mezisoučet</span><span className="tabular-nums">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between gap-3"><span className="text-[#45302F]">Doprava</span><span className="text-[#45302F] text-right">vyberete v dalším kroku</span></div>
          </div>
          <div className="hidden lg:block mt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] text-[#45302F]">Celkem za zboží</span>
              <span className="font-jost font-semibold text-[28px] text-muza-ink tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <Link href="/pokladna"
              className="mt-4 flex items-center justify-center h-[52px] rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 transition-opacity">
              K pokladně
            </Link>
          </div>
          <Link href="/katalog" className="mt-4 inline-block py-1.5 text-sm text-muza-ink underline underline-offset-[3px]">Pokračovat v nákupu</Link>
        </aside>
      </div>

      {/* Mobil: spodní lišta se součtem */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-muza-line px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-[#45302F]">Celkem za zboží</div>
          <div className="font-jost font-semibold text-[24px] leading-tight text-muza-ink whitespace-nowrap tabular-nums">{formatPrice(subtotal)}</div>
        </div>
        <Link href="/pokladna"
          className="h-[52px] px-6 rounded-full bg-muza-ink text-muza-onink text-sm font-medium flex items-center hover:opacity-90">
          K pokladně
        </Link>
      </div>
    </div>
  );
}
