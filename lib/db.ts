/**
 * Database URL getter for development and production
 *
 * Development: Uses local SQLite file (dev.db)
 * Production (Vercel): Uses Turso serverless SQLite
 *
 * Turso uses LibSQL protocol for remote SQLite access:
 * libsql://[database-name].turso.io?authToken=[token]
 */
export function getDbUrl(): string {
  // Use DATABASE_URL from .env (local SQLite for dev)
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  return databaseUrl;
}
