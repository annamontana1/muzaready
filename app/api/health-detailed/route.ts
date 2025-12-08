import { NextResponse } from 'next/server';
import { performHealthCheck } from '@/lib/prisma-health';

/**
 * Detailed health check endpoint for production monitoring
 * Returns information about database and table status
 * Useful for alerting and diagnostics
 */
export async function GET() {
  try {
    const health = await performHealthCheck();

    return NextResponse.json(
      {
        status: health.healthy ? 'healthy' : 'unhealthy',
        timestamp: health.timestamp.toISOString(),
        checks: {
          database: health.database,
          adminUsersTable: health.adminUsersTable,
          exchangeRateTable: health.exchangeRateTable,
        },
        errors: health.errors.length > 0 ? health.errors : undefined,
      },
      { status: health.healthy ? 200 : 503 }
    );
  } catch (error) {
    console.error('[Health Check] Unexpected error:', {
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        checks: {
          database: false,
          adminUsersTable: false,
          exchangeRateTable: false,
        },
        errors: ['Health check failed'],
      },
      { status: 503 }
    );
  }
}
