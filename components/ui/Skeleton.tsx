interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ width, height, className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
      aria-label="Načítání..."
      role="status"
    />
  );
}

/**
 * Text skeleton (single line)
 */
export function TextSkeleton({ width = '100%', className = '' }: { width?: string; className?: string }) {
  return <Skeleton width={width} height="1rem" className={className} />;
}

/**
 * Table skeleton (multiple rows)
 */
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Načítání tabulky...">
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`header-${i}`} className="flex-1">
            <Skeleton height="1.5rem" />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1">
              <Skeleton height="1.25rem" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Card skeleton
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4" role="status" aria-label="Načítání karty...">
      {/* Title */}
      <Skeleton width="60%" height="2rem" />

      {/* Content lines */}
      <div className="space-y-2">
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="90%" height="1rem" />
        <Skeleton width="80%" height="1rem" />
      </div>

      {/* Button area */}
      <div className="flex gap-2 mt-4">
        <Skeleton width="6rem" height="2.5rem" className="rounded-md" />
        <Skeleton width="6rem" height="2.5rem" className="rounded-md" />
      </div>
    </div>
  );
}

/**
 * Stats card skeleton (pro dashboard cards)
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6" role="status" aria-label="Načítání statistiky...">
      <Skeleton width="50%" height="1rem" className="mb-4" />
      <Skeleton width="70%" height="2.5rem" />
    </div>
  );
}

/**
 * List skeleton (pro seznam objednávek)
 */
interface ListSkeletonProps {
  items?: number;
}

export function ListSkeleton({ items = 3 }: ListSkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Načítání seznamu...">
      {Array.from({ length: items }).map((_, index) => (
        <div key={`list-item-${index}`} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          {/* Avatar/Icon */}
          <Skeleton width="3rem" height="3rem" className="rounded-full" />

          {/* Content */}
          <div className="flex-1 space-y-2">
            <Skeleton width="40%" height="1.25rem" />
            <Skeleton width="60%" height="1rem" />
          </div>

          {/* Action button */}
          <Skeleton width="5rem" height="2rem" className="rounded-md" />
        </div>
      ))}
    </div>
  );
}
