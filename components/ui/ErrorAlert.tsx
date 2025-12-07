'use client';

import React from 'react';

interface ErrorAlertProps {
  error: string | Error | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({
  error,
  onDismiss,
  onRetry,
  className = '',
}: ErrorAlertProps) {
  if (!error) return null;

  const errorMessage = error instanceof Error ? error.message : error;

  return (
    <div
      className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Error icon */}
        <div className="flex-shrink-0 text-red-600 text-xl mt-0.5">⚠️</div>

        {/* Error message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-900 break-words">
            {errorMessage}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
            >
              Zkusit znovu
            </button>
          )}

          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Zavřít"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
