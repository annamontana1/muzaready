import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * List all admin users (without passwords)
 * Visit: /api/list-admins?key=Muza2024
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== 'Muza2024') {
      return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
    }

    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });

    return NextResponse.json({
      count: admins.length,
      admins
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to list admins',
      details: error.message
    }, { status: 500 });
  }
}
