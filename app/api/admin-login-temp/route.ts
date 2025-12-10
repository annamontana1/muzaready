/**
 * TEMPORARY LOGIN ENDPOINT
 * This bypasses the broken admin/login route
 * DELETE after Vercel deployment is fixed
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email a heslo jsou povinné' },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    if (admin.status !== 'active') {
      return NextResponse.json(
        { error: 'Váš účet není aktivní' },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, admin.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    // Create session
    const token = randomBytes(32).toString('hex');
    const sessionData = {
      email: admin.email,
      name: admin.name,
      role: admin.role,
      loginTime: new Date().toISOString(),
      token,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: 'Přihlášení úspěšné',
        redirect: '/admin',
        admin: {
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }
      },
      { status: 200 }
    );

    response.cookies.set('admin-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Temp login error:', error);
    return NextResponse.json(
      { error: 'Chyba serveru: ' + (error instanceof Error ? error.message : 'Unknown') },
      { status: 500 }
    );
  }
}
