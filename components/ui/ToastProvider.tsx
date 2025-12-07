'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastMessage, ToastType } from './Toast';

interface ToastContextValue {
  showToast: (message: string, type: ToastType, duration?: number) => void;
  toasts: ToastMessage[];
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

const MAX_TOASTS = 5;

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType, duration?: number) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = {
        id,
        message,
        type,
        duration,
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Keep only last MAX_TOASTS toasts (remove oldest)
        if (updated.length > MAX_TOASTS) {
          return updated.slice(updated.length - MAX_TOASTS);
        }
        return updated;
      });
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[60] pointer-events-none">
        <div className="flex flex-col items-end pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast} onClose={removeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
