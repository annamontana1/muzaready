export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function isAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return false;

  const adminUser = await prisma.adminUser.findFirst({ where: { status: 'active' } });
  return Boolean(adminUser);
}

export async function GET(request: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const prismaAny = prisma as any;
    const requests = await prismaAny.user.findMany({
      where: {
        wholesaleRequested: true,
        isWholesale: false,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        companyName: true,
        businessType: true,
        website: true,
        instagram: true,
        country: true,
        city: true,
        zipCode: true,
        streetAddress: true,
        taxId: true,
        wholesaleRequestedAt: true,
        createdAt: true,
      },
      orderBy: { wholesaleRequestedAt: 'desc' },
    });

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Error fetching wholesale requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
