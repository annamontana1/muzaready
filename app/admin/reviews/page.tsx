'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  customerName: string;
  customerEmail: string | null;
  isApproved: boolean;
  isVerified: boolean;
  adminNotes: string | null;
  createdAt: string;
  sku: {
    sku: string;
    name: string | null;
  };
  user: {
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  order: {
    id: string;
    createdAt: string;
  } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterApproved, setFilterApproved] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [filterApproved]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterApproved !== 'all') {
        params.append('isApproved', filterApproved);
      }

      const response = await fetch(`/api/admin/reviews?${params.toString()}`);
      const data = await response.json();

      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: approve }),
      });

      if (response.ok) {
        fetchReviews();
      } else {
        alert('Chyba při úpravě recenze');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Chyba při úpravě recenze');
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notesValue }),
      });

      if (response.ok) {
        setEditingNotes(null);
        setNotesValue('');
        fetchReviews();
      } else {
        alert('Chyba při ukládání poznámky');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Chyba při ukládání poznámky');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto recenzi?')) return;

    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchReviews();
      } else {
        alert('Chyba při mazání recenze');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Chyba při mazání recenze');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Správa recenzí</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-600">
            Celkem: {reviews.length} recenzí
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-4">
          <select
            value={filterApproved}
            onChange={(e) => setFilterApproved(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">Všechny recenze</option>
            <option value="true">Pouze schválené</option>
            <option value="false">Pouze neschválené</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Načítání...</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-600">
          Žádné recenze nenalezeny
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                !review.isApproved ? 'border-2 border-yellow-400' : ''
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(review.rating)}
                    {review.isVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ✓ Ověřený nákup
                      </span>
                    )}
                    {!review.isApproved && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        ⏳ Čeká na schválení
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleString('cs-CZ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!review.isApproved ? (
                    <button
                      onClick={() => handleApprove(review.id, true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      ✓ Schválit
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(review.id, false)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition text-sm"
                    >
                      ✗ Zrušit schválení
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    🗑 Smazat
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Produkt:</p>
                <p className="font-medium">
                  {review.sku.name || 'Bez názvu'} ({review.sku.sku})
                </p>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                {review.title && (
                  <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
                )}
                <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Autor:</p>
                <p className="font-medium">{review.customerName}</p>
                {review.customerEmail && (
                  <p className="text-sm text-gray-600">{review.customerEmail}</p>
                )}
                {review.user && (
                  <p className="text-sm text-gray-600">
                    Registrovaný uživatel: {review.user.firstName}{' '}
                    {review.user.lastName} ({review.user.email})
                  </p>
                )}
                {review.order && (
                  <p className="text-sm text-gray-600">
                    Objednávka: {review.order.id.slice(0, 8)} (
                    {new Date(review.order.createdAt).toLocaleDateString('cs-CZ')})
                  </p>
                )}
              </div>

              {/* Admin Notes */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Admin poznámky:
                </p>
                {editingNotes === review.id ? (
                  <div>
                    <textarea
                      value={notesValue}
                      onChange={(e) => setNotesValue(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mb-2"
                      rows={3}
                      placeholder="Interní poznámky..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveNotes(review.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Uložit
                      </button>
                      <button
                        onClick={() => {
                          setEditingNotes(null);
                          setNotesValue('');
                        }}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                      >
                        Zrušit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      {review.adminNotes || 'Žádné poznámky'}
                    </p>
                    <button
                      onClick={() => {
                        setEditingNotes(review.id);
                        setNotesValue(review.adminNotes || '');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Upravit poznámky
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
