'use client';

import { useState } from 'react';

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/admin/run-migration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Setup</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Run Invoice Migration</h2>
        <p className="text-gray-600 mb-4">
          This will create the Invoice table and add billing fields to the Order table.
        </p>

        <button
          onClick={runMigration}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
            loading
              ? 'bg-gray-400 cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? '⏳ Running migration...' : '🚀 Run Migration'}
        </button>
      </div>

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            ✅ {result.message}
          </h3>
          {result.steps && (
            <ul className="space-y-1 text-green-800">
              {result.steps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            ❌ Migration Failed
          </h3>
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">📚 What this does:</h3>
        <ul className="list-disc list-inside space-y-2 text-blue-800">
          <li>Adds billing fields to Order table (companyName, ico, dic, etc.)</li>
          <li>Creates Invoice table with all required fields</li>
          <li>Creates database indexes for performance</li>
          <li>Sets up automatic timestamp updates</li>
        </ul>
      </div>
    </div>
  );
}
