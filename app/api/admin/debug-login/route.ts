import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to test login without authentication
 * GET /api/admin/debug-login?email=admin@example.com&password=admin123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'admin@example.com';
    const password = searchParams.get('password') || 'admin123';

    // Test database connection
    let dbConnected = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (dbError: any) {
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        dbError: dbError.message,
        email,
      }, { status: 500 });
    }

    // Find admin user
    let admin = null;
    try {
      admin = await prisma.adminUser.findUnique({
        where: { email },
      });
    } catch (dbError: any) {
      return NextResponse.json({
        success: false,
        error: 'Failed to query admin_users table',
        dbError: dbError.message,
        dbConnected,
        email,
      }, { status: 500 });
    }

    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Admin user not found',
        dbConnected,
        email,
        availableEmails: [], // Could query all emails, but skip for now
      }, { status: 404 });
    }

    // Test password verification
    let passwordValid = false;
    try {
      passwordValid = await bcryptjs.compare(password, admin.password);
    } catch (bcryptError: any) {
      return NextResponse.json({
        success: false,
        error: 'Password verification failed',
        bcryptError: bcryptError.message,
        dbConnected,
        admin: {
          email: admin.email,
          status: admin.status,
        },
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      dbConnected,
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
        status: admin.status,
      },
      passwordMatch: passwordValid,
      passwordHashPreview: admin.password.substring(0, 30),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
        vercelEnv: process.env.VERCEL_ENV,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}

