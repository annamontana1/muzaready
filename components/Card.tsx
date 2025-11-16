import { ReactNode, HTMLAttributes } from 'react';

type CardVariant = 'default' | 'elevated' | 'outlined';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white border border-gray-200 rounded-lg shadow-light',
  elevated: 'bg-white rounded-lg shadow-md',
  outlined: 'bg-white border-2 border-burgundy rounded-lg',
};

const paddingStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const hoverStyles = hoverable ? 'hover:shadow-lg hover:border-burgundy/50 transition-all' : '';

  return (
    <div
      {...props}
      className={`
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
