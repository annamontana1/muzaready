import { InputHTMLAttributes, ReactNode } from 'react';

type InputVariant = 'default' | 'error' | 'success';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: InputVariant;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<InputVariant, string> = {
  default: 'border-gray-300 focus:border-burgundy focus:ring-burgundy',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
};

export default function Input({
  label,
  variant = 'default',
  error,
  hint,
  icon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: InputProps) {
  const widthStyles = fullWidth ? 'w-full' : '';
  const baseStyles =
    'px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50';
  const finalVariant = error ? 'error' : variant;

  return (
    <div className={widthStyles}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 flex items-center justify-center text-gray-500 pointer-events-none">
            {icon}
          </span>
        )}

        <input
          {...props}
          disabled={disabled}
          className={`
            ${baseStyles}
            ${variantStyles[finalVariant]}
            ${icon ? 'pl-10' : ''}
            ${widthStyles}
            ${className}
          `.trim()}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm font-medium text-red-600">{error}</p>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
}
