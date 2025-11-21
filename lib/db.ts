/**
 * Database connection utilities
 * 
 * Provides smart database URL selection with fallback logic
 * for Vercel deployments with Supabase.
 */

/**
 * Extract host:port from database URL for logging (without password)
 */
function extractHostPort(url: string | undefined): string {
  if (!url) return 'unknown';
  try {
    const parsed = new URL(url);
    const port = parsed.port || (parsed.protocol === 'postgresql:' || parsed.protocol === 'postgres:' ? '5432' : '');
    return `${parsed.hostname}:${port}`;
  } catch {
    return 'unknown';
  }
}

/**
 * Mask password in database URL for safe logging
 */
export function maskPassword(url: string | undefined): string {
  if (!url) return 'not set';
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = '***';
    }
    return parsed.toString();
  } catch {
    // If URL parsing fails, just mask any password-like string
    return url.replace(/:([^:@]+)@/, ':***@');
  }
}

/**
 * Get database URL with automatic fallback logic
 * 
 * Priority:
 * 1. DATABASE_URL (preferred - connection pooler on port 6543)
 * 2. DIRECT_URL (fallback - direct connection on port 5432)
 * 
 * For Supabase:
 * - DATABASE_URL should use port 6543 (connection pooler) for optimal performance
 * - DIRECT_URL should use port 5432 (direct connection) for migrations and admin tasks
 * 
 * @param preferDirect - If true, prefer DIRECT_URL over DATABASE_URL (useful for health checks)
 * @returns {object} { url: string, source: 'DATABASE_URL' | 'DIRECT_URL', hostPort: string }
 * @throws {Error} If neither URL is available
 */
export function getDbUrl(preferDirect: boolean = false): {
  url: string;
  source: 'DATABASE_URL' | 'DIRECT_URL';
  hostPort: string;
} {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  // If preferDirect is true, try DIRECT_URL first
  if (preferDirect && directUrl) {
    const hostPort = extractHostPort(directUrl);
    console.log(`[DB] Using DIRECT_URL (preferred): ${hostPort}`);
    return {
      url: directUrl,
      source: 'DIRECT_URL',
      hostPort,
    };
  }

  // Default: prefer DATABASE_URL (pooler)
  if (databaseUrl) {
    const hostPort = extractHostPort(databaseUrl);
    console.log(`[DB] Using DATABASE_URL: ${hostPort}`);
    return {
      url: databaseUrl,
      source: 'DATABASE_URL',
      hostPort,
    };
  }

  // Fallback to DIRECT_URL
  if (directUrl) {
    const hostPort = extractHostPort(directUrl);
    console.log(`[DB] Using DIRECT_URL (fallback): ${hostPort}`);
    return {
      url: directUrl,
      source: 'DIRECT_URL',
      hostPort,
    };
  }

  // No URL available
  throw new Error('Neither DATABASE_URL nor DIRECT_URL environment variables are set');
}

/**
 * Validate database URL format
 */
export function isValidDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === 'postgresql:' || parsed.protocol === 'postgres:') &&
      parsed.hostname.length > 0
    );
  } catch {
    return false;
  }
}

/**
 * Get database configuration info for debugging
 */
export function getDbConfigInfo(): {
  databaseUrl: { available: boolean; hostPort: string; masked: string };
  directUrl: { available: boolean; hostPort: string; masked: string };
} {
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  return {
    databaseUrl: {
      available: !!databaseUrl && isValidDatabaseUrl(databaseUrl),
      hostPort: extractHostPort(databaseUrl),
      masked: maskPassword(databaseUrl),
    },
    directUrl: {
      available: !!directUrl && isValidDatabaseUrl(directUrl),
      hostPort: extractHostPort(directUrl),
      masked: maskPassword(directUrl),
    },
  };
}
