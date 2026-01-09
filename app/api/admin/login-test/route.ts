import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcryptjs from 'bcrypt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Test endpoint to debug login issues
 * GET /api/admin/login-test?email=admin@example.com&password=admin123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'admin@example.com';
    const password = searchParams.get('password') || 'admin123';

    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({
        success: false,
        error: 'Admin user not found',
        email,
      });
    }

    // Test password verification
    const passwordValid = await bcryptjs.compare(password, admin.password);

    return NextResponse.json({
      success: true,
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

