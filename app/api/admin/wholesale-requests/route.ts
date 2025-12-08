export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {

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