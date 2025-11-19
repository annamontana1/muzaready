import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Test DB connection with simple SELECT 1 query
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json(
      { ok: true, db: 'up' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[Health Check] DB error:', error);
    
    return NextResponse.json(
      { 
        ok: false, 
        db: 'down',
        error: error?.message || 'Database connection failed'
      },
      { status: 500 }
    );
  }
}

