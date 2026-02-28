import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const accounts = [
      { email: 'admin@muzahair.cz', name: 'Administrator', password: 'admin123456', role: 'admin' as const },
      { email: 'zen@muzahair.cz', name: 'Zen', password: 'admin123456', role: 'admin' as const },
    ];

    const results = [];
    for (const acc of accounts) {
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      const user = await prisma.adminUser.upsert({
        where: { email: acc.email },
        update: { password: hashedPassword, status: 'active' },
        create: { name: acc.name, email: acc.email, password: hashedPassword, role: acc.role, status: 'active' },
      });
      results.push({ email: user.email, password: acc.password });
    }

    return NextResponse.json({
      success: true,
      message: 'Účty vytvořeny/resetovány!',
      accounts: results,
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
