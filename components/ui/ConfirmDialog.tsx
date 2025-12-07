'use client';

import React, { useEffect, useCallback, useState } from 'react';

export type ConfirmType = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const typeConfig: Record<
  ConfirmType,
  {
    icon: string;
    iconBgColor: string;
    iconColor: string;
    confirmButtonColor: string;
    confirmButtonHoverColor: string;
  }
> = {
  danger: {
    icon: '⛔',
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    confirmButtonColor: 'bg-red-600',
    confirmButtonHoverColor: 'hover:bg-red-700',
  },
  warning: {
    icon: '⚠️',
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    confirmButtonColor: 'bg-yellow-600',
    confirmButtonHoverColor: 'hover:bg-yellow-700',
  },
  info: {
    icon: 'ℹ️',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    confirmButtonColor: 'bg-blue-600',
    confirmButtonHoverColor: 'hover:bg-blue-700',
  },
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Potvrdit',
  cancelText = 'Zrušit',
  type = 'warning',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const config = typeConfig[type];

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key handler (disabled during loading)
  const handleEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading && !isProcessing) {
        onCancel();
      }
    },
    [isLoading, isProcessing, onCancel]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, handleEscKey]);

  // Handle confirm with async support
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const loading = isLoading || isProcessing;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[55] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-start gap-4">
            <div
              className={`${config.iconBgColor} ${config.iconColor} rounded-full p-3 flex-shrink-0`}
            >
              <span className="text-2xl">{config.icon}</span>
            </div>

            <div className="flex-1 min-w-0">
              <h3
                id="confirm-dialog-title"
                className="text-lg font-semibold text-gray-900 mb-2"
              >
                {title}
              </h3>

              <div className="text-sm text-gray-600">
                {typeof message === 'string' ? <p>{message}</p> : message}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white ${config.confirmButtonColor} ${config.confirmButtonHoverColor} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2`}
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {loading ? 'Zpracovávám...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
