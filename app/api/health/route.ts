import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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

export async function GET(request: NextRequest) {
  // Force DIRECT_URL (5432) for health check only
  // Global lib/prisma.ts continues using DATABASE_URL (6543/pool)
  const directUrl = process.env.DIRECT_URL;
  const maskedUrl = maskPassword(directUrl);
  const hostPort = extractHostPort(directUrl);

  if (!directUrl) {
    return NextResponse.json(
      {
        ok: false,
        db: 'down',
        dbSource: 'DIRECT_URL (5432)',
        dbHostPort: 'unknown',
        error: 'DIRECT_URL environment variable is not set',
      },
      { status: 500 }
    );
  }

  // Create PrismaClient instance with DIRECT_URL override for this endpoint only
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: directUrl,
      },
    },
  });

  try {
    // Test DB connection with simple SELECT 1 query
    await prisma.$queryRaw`SELECT 1`;
    await prisma.$disconnect();

    return NextResponse.json(
      {
        ok: true,
        db: 'up',
        dbSource: 'DIRECT_URL (5432)',
        dbHostPort: hostPort,
        dbUrl: maskedUrl,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Health Check] DB error:', error);
    await prisma.$disconnect();

    // Mask password in error message
    const errorMessage = error?.message || 'Database connection failed';
    const maskedError = errorMessage.replace(/:([^:@]+)@/, ':***@');

    return NextResponse.json(
      {
        ok: false,
        db: 'down',
        dbSource: 'DIRECT_URL (5432)',
        dbHostPort: hostPort,
        dbUrl: maskedUrl,
        error: maskedError,
      },
      { status: 500 }
    );
  }
}

