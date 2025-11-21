import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDbUrl, maskPassword, getDbConfigInfo } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Health check endpoint with smart database URL selection
 * 
 * Automatically selects the best available database URL:
 * 1. Prefers DIRECT_URL (port 5432) for reliable health checks
 * 2. Falls back to DATABASE_URL if DIRECT_URL is not available
 * 
 * Returns detailed connection info and database status.
 */
export async function GET(request: NextRequest) {
  let dbConfig;
  
  try {
    // Get database URL with automatic fallback (prefer DIRECT_URL for health checks)
    dbConfig = getDbUrl(true);
  } catch (error: any) {
    // Neither DATABASE_URL nor DIRECT_URL is available
    const configInfo = getDbConfigInfo();
    
    return NextResponse.json(
      {
        ok: false,
        db: 'down',
        dbSource: 'none',
        error: error.message,
        debug: {
          DATABASE_URL: configInfo.databaseUrl,
          DIRECT_URL: configInfo.directUrl,
        },
      },
      { status: 500 }
    );
  }

  // Create PrismaClient instance with selected URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbConfig.url,
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
        dbSource: dbConfig.source,
        dbHostPort: dbConfig.hostPort,
        dbUrl: maskPassword(dbConfig.url),
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
        dbSource: dbConfig.source,
        dbHostPort: dbConfig.hostPort,
        dbUrl: maskPassword(dbConfig.url),
        error: maskedError,
      },
      { status: 500 }
    );
  }
}

