'use client';

import { useEffect, useState } from 'react';

// Nabídka účtu až po dokončení objednávky (registrace není při nákupu potřeba).
// Účet se založí z údajů v objednávce, zákaznice jen zvolí heslo.
interface Props {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export default function AccountOffer({ email, firstName, lastName, phone }: Props) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'exists' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/session').then((r) => (r.ok ? r.json() : { user: null })).then((d) => setLoggedIn(!!d.user)).catch(() => setLoggedIn(false));
  }, []);

  if (loggedIn !== false || !email) return null;

  const create = async () => {
    if (password.length < 8) { setError('Heslo musí mít aspoň 8 znaků.'); return; }
    setError(''); setState('saving');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName: firstName || email.split('@')[0], lastName: lastName || '-', phone: phone || undefined }),
      });
      if (res.ok) { setState('done'); return; }
      const data = await res.json().catch(() => ({}));
      setState(data.error === 'Email already registered' ? 'exists' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'done' || state === 'exists') {
    return (
      <div role="status" className="mt-7 flex items-center gap-2 rounded-2xl border border-muza-line bg-muza-cream px-4 py-3.5 text-left text-sm text-[#2F5E3D]">
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12l4 4 10-10" /></svg>
        {state === 'done' ? 'Účet je vytvořený, příště se jen přihlásíte.' : 'Tento e-mail už u nás účet má, příště se stačí přihlásit.'}
      </div>
    );
  }

  return (
    <div className="mt-7 rounded-2xl border border-muza-ink p-4 text-left">
      <h2 className="font-cormorant text-[24px] leading-tight text-muza-ink">Uložit údaje na příště?</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-[#45302F]">
        Účet založíme z údajů v objednávce, stačí zvolit heslo. Uvidíte stav objednávky a příště nemusíte nic vyplňovat.
      </p>
      <label className="mt-3 block">
        <span className="text-sm font-normal text-[#45302F]">Heslo</span>
        <input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full h-[50px] px-3.5 rounded-xl border border-[#BBAD9F] bg-white text-base font-light focus:outline-none focus:border-muza-ink" />
      </label>
      {(error || state === 'error') && <p role="alert" className="mt-2 text-[13px] text-error">{error || 'Účet se nepodařilo vytvořit, zkuste to prosím znovu.'}</p>}
      <button type="button" onClick={create} disabled={state === 'saving'}
        className="mt-3 w-full h-[52px] rounded-full bg-muza-ink text-muza-onink text-sm font-medium hover:opacity-90 disabled:opacity-50">
        {state === 'saving' ? 'Vytvářím…' : 'Vytvořit účet'}
      </button>
    </div>
  );
}
