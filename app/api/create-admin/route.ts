import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Simple admin creation endpoint
 * Visit: /api/create-admin?key=Muza2024
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== 'Muza2024') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
    }

    const email = 'admin@muzahair.cz';
    const password = 'admin123';

    // Check if table exists by trying to count
    let tableExists = true;
    try {
      await prisma.adminUser.count();
    } catch (e: any) {
      tableExists = false;
      return NextResponse.json({
        error: 'AdminUser table does not exist',
        details: e.message,
        solution: 'Run: npx prisma db push'
      }, { status: 500 });
    }

    // Check if admin already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (existing) {
      // Update password
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.adminUser.update({
        where: { email },
        data: {
          password: hashedPassword,
          status: 'active'
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Admin password reset',
        credentials: { email, password }
      });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.adminUser.create({
      data: {
        name: 'Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin created',
      credentials: { email, password },
      adminId: admin.id
    });

  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json({
      error: 'Failed to create admin',
      details: error.message,
      stack: error.stack?.substring(0, 500)
    }, { status: 500 });
  }
}
