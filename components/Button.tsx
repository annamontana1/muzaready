import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-burgundy text-white hover:bg-maroon focus:ring-burgundy disabled:bg-gray-400 active:scale-95',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-100 active:scale-95',
  outline:
    'border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white focus:ring-burgundy disabled:border-gray-300 disabled:text-gray-300',
  ghost:
    'text-burgundy hover:bg-burgundy/10 focus:ring-burgundy disabled:text-gray-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-400 active:scale-95',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm font-medium rounded-md',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-lg',
  lg: 'px-6 py-3 text-base font-semibold rounded-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = 'disabled:cursor-not-allowed disabled:opacity-50';
  const loadingStyles = isLoading ? 'opacity-75 pointer-events-none' : '';

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${widthStyles}
        ${disabledStyles}
        ${loadingStyles}
        ${className}
      `.trim()}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⟳</span>
          {children}
        </>
      ) : (
        <>
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
