import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('k') !== 'X9kL2mN4') {
    return NextResponse.json({ error: 'Invalid' }, { status: 401 });
  }

  try {
    await prisma.adminUser.upsert({
      where: { email: 'anna@muzahair.cz' },
      update: {
        password: '$2b$10$0aP.QdoPNtVfEzK5zmX/mOdxrVHIVTg/tQOKL02r5SWQpi/O5Jn/q',
        status: 'active',
        role: 'admin'
      },
      create: {
        name: 'Anna',
        email: 'anna@muzahair.cz',
        password: '$2b$10$0aP.QdoPNtVfEzK5zmX/mOdxrVHIVTg/tQOKL02r5SWQpi/O5Jn/q',
        role: 'admin',
        status: 'active'
      }
    });

    await prisma.adminUser.upsert({
      where: { email: 'zen@muzahair.cz' },
      update: {
        password: '$2b$10$YVCJZ13Ijj9lNHPJxXEsLukxWtJb95Yf5qlLSG8lQicmCmhS4Iu0u',
        status: 'active',
        role: 'admin'
      },
      create: {
        name: 'Zen',
        email: 'zen@muzahair.cz',
        password: '$2b$10$YVCJZ13Ijj9lNHPJxXEsLukxWtJb95Yf5qlLSG8lQicmCmhS4Iu0u',
        role: 'admin',
        status: 'active'
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
