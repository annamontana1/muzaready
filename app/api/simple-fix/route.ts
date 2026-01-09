import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('x') !== 'fix2024') {
    return NextResponse.json({ error: 'no' }, { status: 401 });
  }

  const hash1 = bcrypt.hashSync('muzaisthebestA8', 10);
  const hash2 = bcrypt.hashSync('Barcelona33', 10);

  await prisma.adminUser.upsert({
    where: { email: 'anna@muzahair.cz' },
    update: { password: hash1, status: 'active' },
    create: { name: 'Anna', email: 'anna@muzahair.cz', password: hash1, role: 'admin', status: 'active' }
  });

  await prisma.adminUser.upsert({
    where: { email: 'zen@muzahair.cz' },
    update: { password: hash2, status: 'active' },
    create: { name: 'Zen', email: 'zen@muzahair.cz', password: hash2, role: 'admin', status: 'active' }
  });

  return NextResponse.json({ ok: true });
}
