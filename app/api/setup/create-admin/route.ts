import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/admin-auth';

// This is a ONE-TIME setup endpoint
// DELETE THIS FILE after running it once!

export async function GET() {
  try {
    const email = 'admin@example.com';
    const password = 'admin123';

    // Check if admin already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({
        message: 'Admin user already exists!',
        email: existing.email,
        name: existing.name,
      });
    }

    // Create new admin
    const hashedPassword = await hashPassword(password);
    const admin = await prisma.adminUser.create({
      data: {
        name: 'Mùza Admin',
        email,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      message: '✅ Admin user created successfully!',
      credentials: {
        email,
        password,
        loginUrl: '/admin/login',
      },
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      {
        error: 'Failed to create admin user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
