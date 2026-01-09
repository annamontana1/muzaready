import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('key') !== 'FixPwd2024Secret') {
    return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
  }

  try {
    // Update Anna with correct hash
    await prisma.adminUser.upsert({
      where: { email: 'anna@muzahair.cz' },
      update: {
        password: '$2b$10$G2aBWuBg3vD7sYtCCvTngOYRtlBvbY582O3T1uo64EAgAXTzc34Ga',
        status: 'active',
        role: 'admin'
      },
      create: {
        name: 'Anna',
        email: 'anna@muzahair.cz',
        password: '$2b$10$G2aBWuBg3vD7sYtCCvTngOYRtlBvbY582O3T1uo64EAgAXTzc34Ga',
        role: 'admin',
        status: 'active'
      }
    });

    // Update Zen with correct hash
    await prisma.adminUser.upsert({
      where: { email: 'zen@muzahair.cz' },
      update: {
        password: '$2b$10$/WsMl0SGqgh3WuLszq3gZuqyfc3FGeQMlFr9x5HOnsde6B9fvIUAW',
        status: 'active',
        role: 'admin'
      },
      create: {
        name: 'Zen',
        email: 'zen@muzahair.cz',
        password: '$2b$10$/WsMl0SGqgh3WuLszq3gZuqyfc3FGeQMlFr9x5HOnsde6B9fvIUAW',
        role: 'admin',
        status: 'active'
      }
    });

    return NextResponse.json({ success: true, message: 'Passwords fixed' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
