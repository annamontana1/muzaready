import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@muzahair.cz';
const ADMIN_PASSWORD = 'admin123'; // V praxi by to bylo hasováno!

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

    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    // Create session token
    const token = 'mock-token-' + Math.random().toString(36).substring(7);
    const sessionData = {
      email,
      name: 'Admin',
      loginTime: new Date().toISOString(),
      token,
    };

    // Set cookie with session
    const response = NextResponse.json(
      { success: true, message: 'Přihlášení bylo úspěšné' },
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
