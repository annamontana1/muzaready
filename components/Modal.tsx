'use client';

import { ReactNode, useEffect, useId } from 'react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  closeButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  footer,
  closeButton = true,
  size = 'md',
  className = '',
}: ModalProps) {
  const titleId = useId();

  // Esc zavírá okno
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-burgundy-dark/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`
          relative bg-white rounded-xl shadow-heavy p-6 w-full mx-4
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && <h2 id={titleId} className="text-3xl font-cormorant font-light text-text-dark">{title}</h2>}
          {closeButton && (
            <button
              onClick={onClose}
              className="w-11 h-11 -mr-3 flex items-center justify-center text-text-soft hover:text-text-mid transition-colors"
              aria-label="Zavřít"
            >
              <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="mb-6">{children}</div>

        {/* Footer */}
        {footer && <div className="flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  );
}
