/**
 * Database URL getter for Turso serverless SQLite
 *
 * Turso is a serverless SQLite database built for edge computing
 * and is optimized for Vercel serverless functions.
 *
 * Uses LibSQL protocol for remote SQLite access via:
 * libsql://[database-name].turso.io?authToken=[token]
 */
export function getDbUrl(): string {
  const tursoUrl = process.env.TURSO_CONNECTION_URL;

  if (!tursoUrl) {
    throw new Error('TURSO_CONNECTION_URL environment variable is not set');
  }

  return tursoUrl;
}
