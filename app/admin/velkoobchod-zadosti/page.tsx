'use client';

import { useEffect, useState } from 'react';

// Don't pre-render this page during build
export const dynamic = 'force-dynamic';

interface WholesaleRequest {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  businessType?: string;
  website?: string;
  instagram?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  streetAddress?: string;
  taxId?: string;
  wholesaleRequestedAt: string;
  createdAt: string;
}

export default function WholesaleRequestsPage() {
  const [requests, setRequests] = useState<WholesaleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/wholesale-requests');
      if (!response.ok) {
        throw new Error('Chyba při načítání žádostí');
      }
      const data = await response.json();
      setRequests(data.requests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Neznámá chyba');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      setProcessingId(userId);
      const response = await fetch(`/api/admin/wholesale-requests/${userId}?action=approve`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Chyba při schvalování žádosti');
      }
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při schvalování');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setProcessingId(userId);
      const response = await fetch(`/api/admin/wholesale-requests/${userId}?action=reject`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Chyba při zamítání žádosti');
      }
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba při zamítání');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Žádosti o velkoobchodní přístup</h1>
        <p className="text-gray-600 mb-6">Spravujte a schvalujte žádosti od zájemců o velkoobchodní registraci</p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Načítám žádosti...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">Žádné nezpracované žádosti</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Jméno</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Firma</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Město</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Žádost od</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Akce</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {request.firstName} {request.lastName}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                          {request.email}
                        </a>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{request.companyName || '-'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">{request.city || '-'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {new Date(request.wholesaleRequestedAt).toLocaleDateString('cs-CZ')}
                      </td>
                      <td className="px-6 py-3 text-sm space-x-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processingId === request.id}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition text-xs font-medium"
                        >
                          {processingId === request.id ? 'Zpracuji...' : 'Schválit'}
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={processingId === request.id}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 transition text-xs font-medium"
                        >
                          {processingId === request.id ? 'Zpracuji...' : 'Zamítnout'}
                        </button>
                        <button
                          onClick={() => {
                            const details = `
Jméno: ${request.firstName} ${request.lastName}
Email: ${request.email}
Telefon: ${request.phone || '-'}
Firma: ${request.companyName || '-'}
Typ firmy: ${request.businessType || '-'}
Webové stránky: ${request.website || '-'}
Instagram: ${request.instagram || '-'}
Země: ${request.country || '-'}
Město: ${request.city || '-'}
PSČ: ${request.zipCode || '-'}
Adresa: ${request.streetAddress || '-'}
DIČ: ${request.taxId || '-'}
                            `;
                            alert(details);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs font-medium"
                        >
                          Detaily
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
