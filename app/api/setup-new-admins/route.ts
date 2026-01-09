import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('key') !== 'Muza2024') {
    return NextResponse.json({ error: 'Invalid key' }, { status: 401 });
  }

  try {
    // Anna
    const anna = await prisma.adminUser.upsert({
      where: { email: 'anna@muzahair.cz' },
      update: {
        password: '$2b$10$JYY1H8ZfQ3n6CAUTCDYVDecFgLtW6X1uXaOFFKUF7DhmZ0GMrwd..',
        status: 'active',
        role: 'admin'
      },
      create: {
        name: 'Anna',
        email: 'anna@muzahair.cz',
        password: '$2b$10$JYY1H8ZfQ3n6CAUTCDYVDecFgLtW6X1uXaOFFKUF7DhmZ0GMrwd..',
        role: 'admin',
        status: 'active'
      }
    });

    // Zen
    const zen = await prisma.adminUser.upsert({
      where: { email: 'zen@muzahair.cz' },
      update: {
        password: '$2b$10$eW6yMoAUGv5oTQdqNM1h4emdQmOsqx1B9KSjFpGjhbh08PGVnBXFO',
        status: 'active',
        role: 'admin'
      },
      create: {
        name: 'Zen',
        email: 'zen@muzahair.cz',
        password: '$2b$10$eW6yMoAUGv5oTQdqNM1h4emdQmOsqx1B9KSjFpGjhbh08PGVnBXFO',
        role: 'admin',
        status: 'active'
      }
    });

    return NextResponse.json({
      success: true,
      admins: [
        { email: 'anna@muzahair.cz', password: 'muzaisthebestA8' },
        { email: 'zen@muzahair.cz', password: 'Barcelona33' }
      ]
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
