import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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
  const dbUrl = process.env.DATABASE_URL;
  const maskedUrl = maskPassword(dbUrl);
  const hostPort = extractHostPort(dbUrl);

  try {
    // Test DB connection with simple SELECT 1 query
    // Health route uses DATABASE_URL (pool), not DIRECT_URL
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json(
      { 
        ok: true, 
        db: 'up',
        dbUrl: maskedUrl,
        dbHostPort: hostPort,
        dbSource: 'DATABASE_URL (pool)'
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Health Check] DB error:', error);
    
    return NextResponse.json(
      { 
        ok: false, 
        db: 'down',
        dbUrl: maskedUrl,
        dbHostPort: hostPort,
        dbSource: 'DATABASE_URL (pool)',
        error: error?.message || 'Database connection failed'
      },
      { status: 500 }
    );
  }
}

