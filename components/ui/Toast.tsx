'use client';

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onClose: (id: string) => void;
}

const typeConfig: Record<
  ToastType,
  {
    icon: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  }
> = {
  success: {
    icon: '✓',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    iconColor: 'text-green-600',
  },
  error: {
    icon: '⛔',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    iconColor: 'text-red-600',
  },
  warning: {
    icon: '⚠',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-900',
    iconColor: 'text-yellow-600',
  },
  info: {
    icon: 'ℹ',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-600',
  },
};

export function Toast({ message, onClose }: ToastProps) {
  const [progress, setProgress] = useState(100);
  const [isExiting, setIsExiting] = useState(false);

  const config = typeConfig[message.type];
  const duration = message.duration ?? 5000;

  useEffect(() => {
    // Progress bar countdown
    const interval = setInterval(() => {
      setProgress((prev) => {
        const decrement = (100 / duration) * 100;
        return Math.max(0, prev - decrement);
      });
    }, 100);

    // Auto-dismiss timer
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(message.id);
    }, 200);
  };

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border rounded-lg shadow-lg p-4 mb-3 min-w-[320px] max-w-md
        transition-all duration-200
        ${isExiting ? 'animate-out fade-out slide-out-to-right' : 'animate-in slide-in-from-right'}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${config.iconColor} text-xl flex-shrink-0 mt-0.5`}>
          {config.icon}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium break-words">{message.message}</p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
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
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${config.iconColor.replace('text-', 'bg-')} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
