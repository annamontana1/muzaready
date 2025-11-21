import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/admin-auth';
export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
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

    // Check if admin is active
    if (admin.status !== 'active') {
      return NextResponse.json(
        { error: 'Váš účet není aktivní. Kontaktujte administrátora.' },
        { status: 403 }
      );
    }

    // Verify password
    const passwordValid = await verifyPassword(password, admin.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    // Create session token
    const token = 'admin-token-' + Math.random().toString(36).substring(7) + Date.now();
    const sessionData = {
      email: admin.email,
      name: admin.name,
      role: admin.role,
      loginTime: new Date().toISOString(),
      token,
    };

    // Set cookie with session
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Přihlášení bylo úspěšné',
        admin: {
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }
      },
      { status: 200 }
    );

    // Set httpOnly cookie for security (middleware can read cookies)
    response.cookies.set('admin-session', JSON.stringify(sessionData), {
      httpOnly: false, // Allow JavaScript to read for client-side checks
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Chyba při zpracování přihlášení' },
      { status: 500 }
    );
  }
}