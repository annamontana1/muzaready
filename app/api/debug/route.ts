import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to check environment and database connection
 * Visit: /api/debug
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  };

  // Check if DATABASE_URL is set
  results.checks.databaseUrl = process.env.DATABASE_URL
    ? `Set (${process.env.DATABASE_URL.substring(0, 30)}...)`
    : 'NOT SET!';

  // Check if DIRECT_URL is set (for Supabase)
  results.checks.directUrl = process.env.DIRECT_URL
    ? 'Set'
    : 'Not set (optional)';

  // Try to import and use Prisma
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    // Try to connect
    await prisma.$connect();
    results.checks.prismaConnect = 'SUCCESS';

    // Try to query AdminUser table
    try {
      const count = await prisma.adminUser.count();
      results.checks.adminUserTable = `EXISTS (${count} users)`;
    } catch (e: any) {
      results.checks.adminUserTable = `ERROR: ${e.message}`;
    }

    // Try to query PageSeo table (new table)
    try {
      const count = await prisma.pageSeo.count();
      results.checks.pageSeoTable = `EXISTS (${count} records)`;
    } catch (e: any) {
      results.checks.pageSeoTable = `ERROR: ${e.message}`;
    }

    await prisma.$disconnect();
  } catch (e: any) {
    results.checks.prismaConnect = `FAILED: ${e.message}`;
  }

  return NextResponse.json(results, { status: 200 });
}
