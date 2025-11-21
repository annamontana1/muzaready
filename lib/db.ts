/**
 * Database URL router
 *
 * In production on Vercel: returns DATABASE_URL (pgBouncer pooler at 6543)
 * - Stable for serverless short-lived requests
 * - Handles rapid connect/disconnect cycles
 *
 * In preview/development: returns DIRECT_URL if available, fallback to DATABASE_URL
 * - DIRECT_URL (direct connection at 5432) is preferred for dev tools like Prisma Studio
 * - Falls back to pooler if DIRECT_URL is not available
 */
export function getDbUrl(): string {
  const poolUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  // Production: always use pooler (6543) for stability
  if (process.env.NODE_ENV === 'production') {
    if (!poolUrl) {
      throw new Error('DATABASE_URL (pooler) is required in production');
    }
    return poolUrl;
  }

  // Preview/Development: prefer direct (5432), fallback to pooler
  if (directUrl) {
    return directUrl;
  }

  if (poolUrl) {
    return poolUrl;
  }

  throw new Error('Either DATABASE_URL or DIRECT_URL must be set');
}
