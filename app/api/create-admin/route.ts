import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Reset 2 admin accounts
 * Visit: /api/create-admin?key=Muza2024
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== 'Muza2024') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
    }

    const admins = [
      { email: 'anna@muzahair.cz', password: 'muzaisthebestA8', name: 'Anna' },
      { email: 'muzahaircz@gmail.com', password: 'Muza2024!', name: 'Muza Admin' },
    ];

    const results = [];

    for (const admin of admins) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);

      const existing = await prisma.adminUser.findUnique({
        where: { email: admin.email }
      });

      if (existing) {
        await prisma.adminUser.update({
          where: { email: admin.email },
          data: {
            password: hashedPassword,
            status: 'active',
            role: 'admin'
          }
        });
        results.push({ email: admin.email, password: admin.password, status: 'password reset' });
      } else {
        await prisma.adminUser.create({
          data: {
            name: admin.name,
            email: admin.email,
            password: hashedPassword,
            role: 'admin',
            status: 'active',
          },
        });
        results.push({ email: admin.email, password: admin.password, status: 'created' });
      }
    }

    return NextResponse.json({
      success: true,
      message: '2 admin accounts ready',
      accounts: results
    });

  } catch (error: any) {
    console.error('Create admin error:', error);
    return NextResponse.json({
      error: 'Failed',
      details: error.message
    }, { status: 500 });
  }
}
