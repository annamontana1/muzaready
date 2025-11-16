'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError('Vyplňte email a heslo');
      return;
    }

    try {
      await login(formData);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Přihlášení selhalo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-center mb-2">Přihlášení</h1>
          <p className="text-gray-600 text-center mb-6">Přihlaste se ke svému účtu</p>

          {(error || authError) && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error || authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heslo
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Přihlašuji...' : 'Přihlásit se'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-gray-600 text-sm">
              Nemáte ještě účet?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                Zaregistrujte se
              </Link>
            </p>
            <p className="text-gray-600 text-sm">
              Chcete velkoobchodní ceník?{' '}
              <Link href="/velkoobchod" className="text-blue-600 hover:underline font-medium">
                Zaregistrujte se jako salon
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
