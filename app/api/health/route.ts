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
  // TEMPORARY: Test both pool and direct connections
  const poolUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  const maskedPoolUrl = maskPassword(poolUrl);
  const maskedDirectUrl = maskPassword(directUrl);
  const poolHostPort = extractHostPort(poolUrl);
  const directHostPort = extractHostPort(directUrl);

  // Test pool connection (DATABASE_URL)
  let poolResult: { ok: boolean; error?: string } = { ok: false };
  try {
    await prisma.$queryRaw`SELECT 1`;
    poolResult = { ok: true };
  } catch (error: any) {
    poolResult = { ok: false, error: error?.message || 'Database connection failed' };
  }

  // Test direct connection (DIRECT_URL) - create temporary client
  let directResult: { ok: boolean; error?: string } = { ok: false };
  if (directUrl) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const directPrisma = new PrismaClient({
        datasources: {
          db: {
            url: directUrl,
          },
        },
      });
      await directPrisma.$queryRaw`SELECT 1`;
      await directPrisma.$disconnect();
      directResult = { ok: true };
    } catch (error: any) {
      directResult = { ok: false, error: error?.message || 'Direct connection failed' };
    }
  }

  const overallOk = poolResult.ok || directResult.ok;
  
  return NextResponse.json(
    {
      ok: overallOk,
      db: overallOk ? 'up' : 'down',
      pool: {
        source: 'DATABASE_URL (pool)',
        url: maskedPoolUrl,
        hostPort: poolHostPort,
        ok: poolResult.ok,
        error: poolResult.error,
      },
      direct: {
        source: 'DIRECT_URL (direct)',
        url: maskedDirectUrl,
        hostPort: directHostPort,
        ok: directResult.ok,
        error: directResult.error,
      },
    },
    { status: overallOk ? 200 : 500 }
  );
}

