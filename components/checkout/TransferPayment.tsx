'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Platba převodem hned po objednávce: číslo účtu, částka, variabilní symbol a QR platba
// (formát SPAYD, který čtou české mobilní banky). Vlasy se odesílají po připsání platby.

// České číslo účtu (předčíslí-číslo/kód banky) → IBAN
function czIban(account: string): string | null {
  const m = account.replace(/\s/g, '').match(/^(?:(\d{1,6})-)?(\d{2,10})\/(\d{4})$/);
  if (!m) return null;
  const bban = m[3] + (m[1] || '').padStart(6, '0') + m[2].padStart(10, '0');
  // kontrolní číslice: BBAN + "CZ00" (C=12, Z=35), mod 97
  const numeric = bban + '123500';
  let rest = 0;
  for (const ch of numeric) rest = (rest * 10 + Number(ch)) % 97;
  return `CZ${String(98 - rest).padStart(2, '0')}${bban}`;
}

const formatPrice = (n: number) =>
  new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);

export default function TransferPayment({ orderNumber, amount }: { orderNumber: number | string; amount: number }) {
  const [info, setInfo] = useState<{ account: string | null; iban: string | null } | null>(null);
  const [qr, setQr] = useState('');

  useEffect(() => {
    fetch('/api/payment-info').then((r) => (r.ok ? r.json() : { account: null, iban: null })).then(setInfo).catch(() => setInfo({ account: null, iban: null }));
  }, []);

  const iban = info ? (info.iban?.replace(/\s/g, '') || (info.account ? czIban(info.account) : null)) : null;
  const vs = String(orderNumber).replace(/\D/g, '').slice(0, 10);

  useEffect(() => {
    if (!iban) return;
    const spayd = `SPD*1.0*ACC:${iban}*AM:${amount.toFixed(2)}*CC:CZK*X-VS:${vs}*MSG:MUZA HAIR OBJEDNAVKA ${vs}`;
    QRCode.toDataURL(spayd, { margin: 1, width: 360, color: { dark: '#1C0C0F', light: '#FFFFFF' } }).then(setQr).catch(() => setQr(''));
  }, [iban, amount, vs]);

  if (!info) return null;

  if (!info.account && !iban) {
    return (
      <div className="mt-7 rounded-2xl border border-muza-ink p-4 text-left">
        <h2 className="font-cormorant text-[24px] leading-tight text-muza-ink">Platba předem převodem</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[#45302F]">
          Platební údaje vám pošleme e-mailem během pár minut. Culík odešleme hned po připsání platby.
        </p>
      </div>
    );
  }

  const rows: [string, React.ReactNode][] = [
    ['Částka', <b key="a" className="font-jost font-semibold text-[18px] text-muza-ink tabular-nums">{formatPrice(amount)}</b>],
    ['Číslo účtu', info.account || iban],
    ['Variabilní symbol', <b key="v" className="font-semibold">{vs}</b>],
  ];

  return (
    <div className="mt-7 rounded-2xl border border-muza-ink p-4 text-left">
      <h2 className="font-cormorant text-[24px] leading-tight text-muza-ink">Zaplaťte prosím hned</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-[#45302F]">
        Naskenujte QR kód v mobilní bance, údaje se vyplní samy. Culík odešleme (nebo připravíme k vyzvednutí) hned po připsání platby.
      </p>
      {qr && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt={`QR platba ${formatPrice(amount)}, variabilní symbol ${vs}`} className="mt-3 mx-auto w-[180px] h-[180px] rounded-lg border border-muza-line bg-white" />
      )}
      <dl className="mt-3">
        {rows.map(([k, v], i) => (
          <div key={k} className={`flex items-center justify-between gap-3 py-3 border-t border-muza-line ${i === rows.length - 1 ? 'border-b' : ''}`}>
            <dt className="text-sm font-normal text-[#45302F]">{k}</dt>
            <dd className="text-[15px] font-normal text-right break-all">{v}</dd>
          </div>
        ))}
      </dl>
      {info.iban && info.account && <p className="mt-2 text-[12px] text-muza-soft">IBAN: {info.iban}</p>}
    </div>
  );
}
