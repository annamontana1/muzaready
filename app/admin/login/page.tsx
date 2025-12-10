'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Don't pre-render this page during build - it's a client-only page
export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send login request to API route
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ email, password }),
      });

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type');
      const hasJson = contentType && contentType.includes('application/json');

      if (response.ok) {
        // Login successful - API route sets cookie
        // Přesměrovat na dashboard
        router.push('/admin');
        return;
      } else {
        // Try to parse error response
        let errorMessage = 'Nesprávný email nebo heslo';
        
        if (hasJson) {
          try {
            const text = await response.text();
            if (text) {
              const data = JSON.parse(text);
              errorMessage = data.error || errorMessage;
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError);
            // Use status-based error message
            if (response.status === 401) {
              errorMessage = 'Nesprávný email nebo heslo';
            } else if (response.status === 403) {
              errorMessage = 'Váš účet není aktivní';
            } else if (response.status === 500) {
              errorMessage = 'Chyba serveru. Zkus to prosím znovu.';
            }
          }
        } else {
          // No JSON response, use status-based message
          if (response.status === 401) {
            errorMessage = 'Nesprávný email nebo heslo';
          } else if (response.status === 403) {
            errorMessage = 'Váš účet není aktivní';
          } else if (response.status === 500) {
            errorMessage = 'Chyba serveru. Zkus to prosím znovu.';
          }
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Chyba při přihlášení. Zkontroluj připojení k internetu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mùza Hair</h1>
          <p className="text-gray-600">Admin přihlášení</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@muzahair.cz"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heslo
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Přihlašuji...' : 'Přihlásit se'}
          </button>
        </form>
      </div>
    </div>
  );
}
