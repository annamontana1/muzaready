import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('k') !== 'debug123') {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  }

  try {
    // Get admin users
    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: true,
        password: true,
      }
    });

    // Test bcrypt
    const testHash = await bcrypt.hash('Barcelona33', 10);

    // Check if zen exists and test password
    const zen = admins.find(a => a.email === 'zen@muzahair.cz');
    let zenPasswordTest = false;
    if (zen) {
      zenPasswordTest = await bcrypt.compare('Barcelona33', zen.password);
    }

    return NextResponse.json({
      admins: admins.map(a => ({
        email: a.email,
        name: a.name,
        status: a.status,
        role: a.role,
        hashPrefix: a.password?.substring(0, 20),
        hashLength: a.password?.length,
      })),
      bcryptWorking: true,
      testHash: testHash.substring(0, 20),
      zenPasswordTest,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
  }
}
