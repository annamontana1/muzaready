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
  const [selectedRequest, setSelectedRequest] = useState<WholesaleRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
                            setSelectedRequest(request);
                            setShowDetailModal(true);
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

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Detail žádosti o velkoobchod</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedRequest(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Osobní údaje</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Jméno</p>
                      <p className="text-base font-medium text-gray-900">{selectedRequest.firstName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Příjmení</p>
                      <p className="text-base font-medium text-gray-900">{selectedRequest.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-base font-medium text-blue-600">
                        <a href={`mailto:${selectedRequest.email}`} className="hover:underline">
                          {selectedRequest.email}
                        </a>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telefon</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.phone ? (
                          <a href={`tel:${selectedRequest.phone}`} className="hover:underline">
                            {selectedRequest.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">Neuvedeno</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Firemní údaje</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Název firmy</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.companyName || <span className="text-gray-400">Neuvedeno</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Typ podnikání</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.businessType || <span className="text-gray-400">Neuvedeno</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">DIČ</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.taxId || <span className="text-gray-400">Neuvedeno</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Online Presence */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Online prezence</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Webové stránky</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.website ? (
                          <a
                            href={selectedRequest.website.startsWith('http') ? selectedRequest.website : `https://${selectedRequest.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedRequest.website}
                          </a>
                        ) : (
                          <span className="text-gray-400">Neuvedeno</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Instagram</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.instagram ? (
                          <a
                            href={`https://instagram.com/${selectedRequest.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            @{selectedRequest.instagram.replace('@', '')}
                          </a>
                        ) : (
                          <span className="text-gray-400">Neuvedeno</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Adresa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Ulice a číslo</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.streetAddress || <span className="text-gray-400">Neuvedeno</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Město</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.city || <span className="text-gray-400">Neuvedeno</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">PSČ</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.zipCode || <span className="text-gray-400">Neuvedeno</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Země</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedRequest.country || <span className="text-gray-400">Neuvedeno</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">Informace o žádosti</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Datum žádosti</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(selectedRequest.wholesaleRequestedAt).toLocaleDateString('cs-CZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Registrace účtu</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(selectedRequest.createdAt).toLocaleDateString('cs-CZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setShowDetailModal(false);
                      setSelectedRequest(null);
                    }}
                    disabled={processingId === selectedRequest.id}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-medium"
                  >
                    Schválit žádost
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setShowDetailModal(false);
                      setSelectedRequest(null);
                    }}
                    disabled={processingId === selectedRequest.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition font-medium"
                  >
                    Zamítnout žádost
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedRequest(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Zavřít
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
