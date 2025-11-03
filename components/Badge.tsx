interface BadgeProps {
  count: number;
  variant?: 'default' | 'small';
}

export default function Badge({ count, variant = 'default' }: BadgeProps) {
  const sizeClasses = variant === 'small'
    ? 'min-w-[16px] h-4 text-[10px]'
    : 'min-w-[18px] h-[18px] text-xs';

  return (
    <span
      className={`
        ${sizeClasses}
        px-1
        bg-burgundy
        text-white
        rounded-full
        flex
        items-center
        justify-center
        font-semibold
        absolute
        -top-1
        -right-1
      `}
      aria-label={`Počet položek: ${count}`}
    >
      {count}
    </span>
  );
}
