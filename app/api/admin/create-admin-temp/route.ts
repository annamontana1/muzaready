import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * TEMPORARY endpoint to create admin user
 * DELETE THIS FILE AFTER USE!
 */
export async function GET() {
  try {
    const email = 'admin@muzahair.cz';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upsert - create or update
    const admin = await prisma.adminUser.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        status: 'active',
      },
      create: {
        name: 'Administrator',
        email,
        password: hashedPassword,
        role: 'admin',
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin účet vytvořen/resetován!',
      email: admin.email,
      password: 'admin123',
      note: 'SMAŽ tento endpoint po použití! /api/admin/create-admin-temp',
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
