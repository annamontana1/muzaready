import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Create/Reset 2 admin accounts
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
      { email: 'zen@muzahair.cz', password: 'Barcelona33', name: 'Zen' },
    ];

    const results = [];

    for (const admin of admins) {
      try {
        const hashedPassword = await hashPassword(admin.password);

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
      } catch (e: any) {
        results.push({ email: admin.email, error: e.message });
      }
    }

    return NextResponse.json({
      success: true,
      message: '2 admin accounts processed',
      accounts: results
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed',
      details: error.message,
      stack: error.stack?.substring(0, 300)
    }, { status: 500 });
  }
}
