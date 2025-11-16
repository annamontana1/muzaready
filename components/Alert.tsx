import { ReactNode } from 'react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: ReactNode;
  children?: ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-l-4 border-green-500',
    text: 'text-green-900',
    icon: '✓',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-l-4 border-red-500',
    text: 'text-red-900',
    icon: '✕',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-l-4 border-yellow-500',
    text: 'text-yellow-900',
    icon: '⚠',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-l-4 border-blue-500',
    text: 'text-blue-900',
    icon: 'ℹ',
  },
};

export default function Alert({
  variant,
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} ${styles.border} rounded p-4`}>
      <div className="flex gap-3">
        <span className={`text-xl flex-shrink-0 ${styles.text}`}>{styles.icon}</span>

        <div className="flex-1 min-w-0">
          {title && (
            <p className={`font-semibold ${styles.text} mb-1`}>{title}</p>
          )}
          <p className={`text-sm ${styles.text}`}>
            {message}
          </p>
          {children}
        </div>

        {dismissible && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 font-semibold ${styles.text} hover:opacity-75 transition`}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
