'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Něco se pokazilo');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Chyba při odesílání požadavku');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-warm-beige flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-soft p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-playfair text-burgundy mb-4">Email odeslán</h1>
          <p className="text-gray-600 mb-6">
            Pokud existuje účet s emailem <strong>{email}</strong>, obdržíte odkaz pro reset hesla.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Zkontrolujte také složku spam.
          </p>
          <Link
            href="/prihlaseni"
            className="inline-block bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-maroon transition"
          >
            Zpět na přihlášení
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-beige flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-soft p-8">
        <h1 className="text-2xl font-playfair text-burgundy mb-2 text-center">
          Zapomenuté heslo
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Zadejte svůj email a pošleme vám odkaz pro reset hesla.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
              placeholder="vas@email.cz"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy text-white py-3 rounded-lg font-medium hover:bg-maroon transition disabled:opacity-50"
          >
            {loading ? 'Odesílám...' : 'Odeslat odkaz'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/prihlaseni" className="text-burgundy hover:text-maroon text-sm">
            Zpět na přihlášení
          </Link>
        </div>
      </div>
    </div>
  );
}
