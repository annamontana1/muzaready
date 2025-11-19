'use client';

import { useState, useEffect } from 'react';

interface HealthStatus {
  ok: boolean;
  db: string;
  error?: string;
}

export default function HealthPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        const data: HealthStatus = await res.json();
        setStatus(data);
        setTimestamp(new Date().toISOString());
      } catch (error: any) {
        setStatus({
          ok: false,
          db: 'error',
          error: error?.message || 'Failed to fetch health status'
        });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy/5 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-playfair text-burgundy mb-6">
            System Health Check
          </h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
              <p className="mt-4 text-gray-600">Checking system status...</p>
            </div>
          ) : status ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${
                status.ok 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${
                    status.ok ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-semibold text-lg">
                      {status.ok ? 'System Operational' : 'System Error'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Database: <span className="font-medium">{status.db}</span>
                    </p>
                  </div>
                </div>
              </div>

              {status.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {status.error}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last checked: {timestamp || 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Unable to fetch health status</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href="/"
              className="text-burgundy hover:text-maroon text-sm"
            >
              ← Back to homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

