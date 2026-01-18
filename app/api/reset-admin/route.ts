import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * TEMPORARY ADMIN RESET ENDPOINT
 * Creates 2 admin users
 *
 * Usage: Visit /api/reset-admin?secret=MuzaReset2024
 * DELETE THIS FILE AFTER USE!
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Simple security check
  if (secret !== 'MuzaReset2024') {
    return NextResponse.json(
      { error: 'Invalid secret. Use ?secret=MuzaReset2024' },
      { status: 401 }
    );
  }

  try {
    // Admin 1
    const admin1Email = 'admin@muzahair.cz';
    const admin1Password = 'admin123';

    // Admin 2
    const admin2Email = 'anna@muzahair.cz';
    const admin2Password = 'Anna2024!';

    const hashedPassword1 = await bcrypt.hash(admin1Password, 10);
    const hashedPassword2 = await bcrypt.hash(admin2Password, 10);

    // Delete existing admins if exist
    await prisma.adminUser.deleteMany({
      where: {
        email: { in: [admin1Email, admin2Email] }
      }
    });

    // Create Admin 1
    const admin1 = await prisma.adminUser.create({
      data: {
        name: 'Admin',
        email: admin1Email,
        password: hashedPassword1,
        role: 'admin',
        status: 'active',
      },
    });

    // Create Admin 2
    const admin2 = await prisma.adminUser.create({
      data: {
        name: 'Anna',
        email: admin2Email,
        password: hashedPassword2,
        role: 'admin',
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      message: '2 admin users created successfully',
      admins: [
        {
          name: admin1.name,
          email: admin1Email,
          password: admin1Password,
        },
        {
          name: admin2.name,
          email: admin2Email,
          password: admin2Password,
        }
      ],
      warning: 'DELETE app/api/reset-admin/route.ts AFTER USE!'
    }, { status: 201 });

  } catch (error) {
    console.error('Reset admin error:', error);
    return NextResponse.json(
      { error: 'Failed to reset admin', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
