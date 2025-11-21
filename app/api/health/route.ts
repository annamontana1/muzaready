import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDbUrl } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Mask password in database URL for logging
 */
function maskPassword(url: string | undefined): string {
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
 * Extract host:port from database URL
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
 * Determine which database URL source is being used
 */
function getDbSource(): string {
  const pool = process.env.DATABASE_URL;
  const direct = process.env.DIRECT_URL;

  if (process.env.NODE_ENV === 'production') {
    // Production always uses pooler
    return 'DATABASE_URL (pooler/6543)';
  }

  // Dev/Preview prefers direct, fallbacks to pooler
  if (direct) {
    return 'DIRECT_URL (direct/5432)';
  }

  return 'DATABASE_URL (pooler/6543)';
}

export async function GET(request: NextRequest) {
  try {
    // Use the router function to get the correct URL for this environment
    const dbUrl = getDbUrl();
    const maskedUrl = maskPassword(dbUrl);
    const hostPort = extractHostPort(dbUrl);
    const dbSource = getDbSource();

    // Create PrismaClient instance with the appropriate URL
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: dbUrl,
        },
      },
    });

    // Test DB connection with simple SELECT 1 query
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();

    return NextResponse.json(
      {
        ok: true,
        db: 'up',
        dbSource,
        dbHostPort: hostPort,
        dbUrl: maskedUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Health Check] DB error:', error);

    // Mask password in error message
    const errorMessage = error?.message || 'Database connection failed';
    const maskedError = errorMessage.replace(/:([^:@]+)@/, ':***@');

    const dbSource = getDbSource();
    const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;
    const maskedUrl = maskPassword(dbUrl);
    const hostPort = extractHostPort(dbUrl);

    return NextResponse.json(
      {
        ok: false,
        db: 'down',
        dbSource,
        dbHostPort: hostPort,
        dbUrl: maskedUrl,
        error: maskedError,
      },
      { status: 500 }
    );
  }
}

