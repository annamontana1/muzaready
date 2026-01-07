'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoriteButtonProps {
  productId: string;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
}

export default function FavoriteButton({
  productId,
  size = 'md',
  variant = 'icon',
  className = ''
}: FavoriteButtonProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [showToast, setShowToast] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Check if product is in favorites
  useEffect(() => {
    const isFav = favorites.some(fav => fav.id === productId);
    setIsActive(isFav);
  }, [productId, favorites]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isActive) {
      removeFavorite(productId);
    } else {
      addFavorite({ id: productId });
    }
    const newState = !isActive;
    setIsActive(newState);

    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
            isActive
              ? 'bg-burgundy text-white border-burgundy'
              : 'bg-white text-burgundy border-burgundy hover:bg-burgundy/5'
          } ${className}`}
          aria-label={isActive ? 'Odebrat z vybraných' : 'Přidat do vybraných'}
          aria-pressed={isActive}
        >
          <motion.svg
            className={iconSizeClasses[size]}
            fill={isActive ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isActive ? 0 : 2}
            viewBox="0 0 24 24"
            initial={false}
            animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </motion.svg>
          <span className="text-sm font-medium">
            {isActive ? 'V oblíbených' : 'Přidat do oblíbených'}
          </span>
        </button>

        {/* Toast notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-burgundy text-white px-6 py-3 rounded-lg shadow-2xl pointer-events-none"
            >
              <p className="text-sm font-medium">
                {isActive ? 'Uloženo do vybraných' : 'Odebráno z vybraných'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Icon variant (default)
  return (
    <>
      <button
        onClick={handleClick}
        className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all ${className}`}
        aria-label={isActive ? 'Odebrat z vybraných' : 'Přidat do vybraných'}
        aria-pressed={isActive}
      >
        <motion.svg
          className={`${iconSizeClasses[size]} text-burgundy`}
          fill={isActive ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={isActive ? 0 : 2}
          viewBox="0 0 24 24"
          initial={false}
          animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </motion.svg>
      </button>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-burgundy text-white px-6 py-3 rounded-lg shadow-2xl pointer-events-none"
          >
            <p className="text-sm font-medium">
              {isActive ? 'Uloženo do vybraných' : 'Odebráno z vybraných'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
