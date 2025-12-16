'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  customerName: string;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ProductReviewsProps {
  skuId: string;
}

export default function ProductReviews({ skuId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review form state
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    customerName: '',
    customerEmail: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [skuId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?skuId=${skuId}`);
      const data = await response.json();

      if (data.reviews) {
        setReviews(data.reviews);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skuId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(data.message);
        setFormData({
          rating: 5,
          title: '',
          comment: '',
          customerName: '',
          customerEmail: '',
        });
        setShowReviewForm(false);
      } else {
        setSubmitMessage(data.error || 'Chyba při odesílání recenze');
      }
    } catch (error) {
      setSubmitMessage('Chyba při odesílání recenze');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const sizeClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClass} ${
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

  const renderRatingBar = (stars: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="w-12 text-gray-600">{stars} ★</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-8 text-gray-600 text-right">{count}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-8">
        <p className="text-gray-600 text-center">Načítání recenzí...</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Hodnocení zákazníků</h2>

      {/* Summary */}
      {summary && summary.totalReviews > 0 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {summary.averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(summary.averageRating), 'lg')}
              <p className="text-gray-600 mt-2">
                {summary.totalReviews}{' '}
                {summary.totalReviews === 1 ? 'hodnocení' : 'hodnocení'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars}>
                  {renderRatingBar(
                    stars,
                    summary.ratingDistribution[stars as keyof typeof summary.ratingDistribution],
                    summary.totalReviews
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      <div className="mb-6">
        {!showReviewForm ? (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-maroon transition"
          >
            Napsat recenzi
          </button>
        ) : (
          <button
            onClick={() => setShowReviewForm(false)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Zrušit
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Napište recenzi</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Hodnocení *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Titulek (volitelné)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                placeholder="Shrňte svou zkušenost"
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Recenze * (min. 10 znaků)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                required
                minLength={10}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                placeholder="Popište svou zkušenost s tímto produktem..."
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Vaše jméno *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                placeholder="Jméno"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email (volitelné)
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy"
                placeholder="email@example.com"
              />
            </div>

            {submitMessage && (
              <div
                className={`p-4 rounded-lg ${
                  submitMessage.includes('Děkujeme')
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {submitMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-maroon transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Odesílám...' : 'Odeslat recenzi'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>Zatím žádné recenze. Buďte první, kdo ohodnotí tento produkt!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    {review.isVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        ✓ Ověřený nákup
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900">
                    {review.customerName}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                </p>
              </div>

              {review.title && (
                <h4 className="font-semibold text-gray-900 mb-2">
                  {review.title}
                </h4>
              )}

              <p className="text-gray-700 whitespace-pre-wrap">
                {review.comment}
              </p>

              {review.helpfulCount > 0 && (
                <p className="mt-3 text-sm text-gray-600">
                  {review.helpfulCount}{' '}
                  {review.helpfulCount === 1
                    ? 'člověk považuje tuto recenzi za užitečnou'
                    : 'lidé považují tuto recenzi za užitečnou'}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
