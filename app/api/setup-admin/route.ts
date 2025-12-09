import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
export const runtime = 'nodejs';

/**
 * TEMPORARY SETUP ENDPOINT
 * This endpoint creates the initial admin user in production database
 * IMPORTANT: Delete this file after first use for security reasons
 *
 * Usage: Visit /api/setup-admin once after deployment
 */
export async function GET() {
  try {
    // Check if any admin users already exist
    const existingAdmins = await prisma.adminUser.findMany();

    if (existingAdmins.length > 0) {
      return NextResponse.json(
        {
          error: 'Admin users already exist',
          count: existingAdmins.length,
          message: 'This endpoint can only be used once. Delete this file for security.'
        },
        { status: 400 }
      );
    }

    // Create the first admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.adminUser.create({
      data: {
        name: 'Admin',
        email: 'admin@muzahair.cz',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Admin user created successfully',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        instructions: [
          '1. Login at /admin/login with email: admin@muzahair.cz and password: admin123',
          '2. IMMEDIATELY change the password in admin panel',
          '3. DELETE this file (app/api/setup-admin/route.ts) for security',
        ],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
