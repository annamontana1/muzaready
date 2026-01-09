import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('k');

  if (key !== 'debug123') {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  }

  const action = searchParams.get('action');

  try {
    if (action === 'fix') {
      // Fix admin passwords with bcryptjs
      const hash1 = await bcrypt.hash('muzaisthebestA8', 10);
      const hash2 = await bcrypt.hash('Barcelona33', 10);

      await prisma.adminUser.upsert({
        where: { email: 'anna@muzahair.cz' },
        update: { password: hash1, status: 'active', role: 'admin' },
        create: { name: 'Anna', email: 'anna@muzahair.cz', password: hash1, role: 'admin', status: 'active' }
      });

      await prisma.adminUser.upsert({
        where: { email: 'zen@muzahair.cz' },
        update: { password: hash2, status: 'active', role: 'admin' },
        create: { name: 'Zen', email: 'zen@muzahair.cz', password: hash2, role: 'admin', status: 'active' }
      });

      return NextResponse.json({
        success: true,
        message: 'Passwords fixed with bcryptjs',
        hashes: { anna: hash1.substring(0, 20), zen: hash2.substring(0, 20) }
      });
    }

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

    // Test bcryptjs
    const testHash = await bcrypt.hash('test', 10);

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
        hashPrefix: a.password?.substring(0, 25),
        hashLength: a.password?.length,
      })),
      bcryptjsWorking: true,
      testHashPrefix: testHash.substring(0, 20),
      zenPasswordTest,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
