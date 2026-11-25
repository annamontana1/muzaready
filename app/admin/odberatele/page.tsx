'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/ToastProvider';
import { czDate, formatKc } from '@/lib/odberatele';
import { NovyOdberatelForm, OdberatelSummary, Tile, TypBadge, api, btnPriCls } from './ui';

interface ListData {
  odberatele: OdberatelSummary[];
  souhrn: { mesic: string; zbyvaCelkem: number; predanoMesic: number; platbyMesic: number };
  archiv: { partneri: number; vydeje: number };
}

const V_MESICI = ['lednu', 'únoru', 'březnu', 'dubnu', 'květnu', 'červnu', 'červenci', 'srpnu', 'září', 'říjnu', 'listopadu', 'prosinci'];

export default function OdberatelePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    try {
      setData(await api<ListData>('/api/admin/odberatele'));
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Odběratele se nepodařilo načíst');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const mesic = data ? V_MESICI[Number(data.souhrn.mesic.slice(5, 7)) - 1] : '';
  const cols = 'lg:grid-cols-[minmax(0,2fr)_120px_80px_130px_130px_150px_16px]';

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-stone-500">Várky, dluhy a platby</p>
        <button onClick={() => setAdding(true)} className={btnPriCls}>+ Přidat odběratele</button>
      </div>

      {adding && (
        <NovyOdberatelForm
          onCancel={() => setAdding(false)}
          onError={(m) => showToast(m, 'error')}
          onCreated={(id) => router.push(`/admin/odberatele/${id}`)}
        />
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm">{error}</div>}

      {!data && !error && <div className="text-sm text-stone-500 py-8">Načítám…</div>}

      {data && (
        <>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            <Tile label="Zbývá zaplatit celkem" value={formatKc(data.souhrn.zbyvaCelkem)} tone="amber" />
            <Tile label={`Předáno v ${mesic}`} value={formatKc(data.souhrn.predanoMesic)} />
            <Tile label={`Platby v ${mesic}`} value={formatKc(data.souhrn.platbyMesic)} tone="green" />
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className={`hidden lg:grid ${cols} gap-3 px-5 py-2.5 text-xs uppercase tracking-wide text-stone-500 bg-stone-50 border-b border-stone-200`}>
              <span>Odběratel</span>
              <span>Typ</span>
              <span className="text-right">Várek</span>
              <span>Poslední várka</span>
              <span className="text-right">Zaplaceno</span>
              <span className="text-right">Zbývá zaplatit</span>
              <span />
            </div>
            {data.odberatele.length === 0 && (
              <div className="px-5 py-8 text-sm text-stone-500">
                Zatím tu není žádný odběratel. Začněte tlačítkem „Přidat odběratele“.
              </div>
            )}
            {data.odberatele.map((o) => (
              <Link
                key={o.id}
                href={`/admin/odberatele/${o.id}`}
                className={`grid grid-cols-[minmax(0,1fr)_auto] ${cols} gap-x-3 gap-y-1 items-center px-4 lg:px-5 py-3.5 border-t first:border-t-0 border-stone-200 hover:bg-stone-50`}
              >
                <span className="font-semibold text-stone-800 flex items-center gap-2 flex-wrap">
                  {o.name}
                  <span className="lg:hidden"><TypBadge type={o.type} /></span>
                </span>
                <span className="hidden lg:block"><TypBadge type={o.type} /></span>
                <span className="hidden lg:block text-right tabular-nums">{o.pocetVarek}</span>
                <span className="hidden lg:block tabular-nums">{o.posledniVarka ? czDate(o.posledniVarka) : '–'}</span>
                <span className="hidden lg:block text-right tabular-nums">{formatKc(o.zaplaceno)}</span>
                <span className={`row-span-2 lg:row-span-1 text-right font-bold tabular-nums ${o.zbyva > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {formatKc(o.zbyva)}
                  <small className="block lg:hidden font-normal text-xs text-stone-500">zbývá zaplatit</small>
                </span>
                <span className="lg:hidden text-[13px] text-stone-500">
                  {o.pocetVarek} várek{o.posledniVarka ? ` · poslední ${czDate(o.posledniVarka)}` : ''}
                </span>
                <span className="hidden lg:block text-stone-400">›</span>
              </Link>
            ))}
          </div>

          {data.archiv.partneri > 0 && (
            <Link
              href="/admin/b2b"
              className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border border-dashed border-stone-300 rounded-xl px-4 py-3 text-stone-700 hover:bg-white"
            >
              <strong className="font-semibold">Archiv starého B2B</strong>
              <span className="text-[13px] text-stone-500">
                {data.archiv.partneri} partneři · {data.archiv.vydeje} výdejů · jen ke čtení
              </span>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
