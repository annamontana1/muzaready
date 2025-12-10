import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';
import { verifyPassword } from '@/lib/admin-auth';
export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Neplatný formát požadavku. Očekává se JSON.' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Debug logging (only in development or with debug flag)
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_LOGIN === 'true') {
      console.log('Login attempt:', { email, passwordLength: password?.length });
    }

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
    
    // Debug logging
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_LOGIN === 'true') {
      console.log('Password verification:', { 
        valid: passwordValid,
        hashPreview: admin.password.substring(0, 30),
      });
    }
    
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    // Create cryptographically secure session token
    const token = randomBytes(32).toString('hex');
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

    // Set httpOnly cookie for security (prevents XSS attacks)
    // Note: secure flag should be true in production (HTTPS required)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const cookieValue = JSON.stringify(sessionData);
    
    // Debug logging
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG_LOGIN === 'true') {
      console.log('Setting cookie:', {
        isProduction,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        cookieLength: cookieValue.length,
      });
    }
    
    response.cookies.set('admin-session', cookieValue, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: isProduction, // HTTPS only in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      domain: undefined, // Let browser decide (works for all subdomains)
    });
    
    // Also set a response header to confirm cookie was set
    response.headers.set('X-Login-Success', 'true');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Chyba při zpracování přihlášení' },
      { status: 500 }
    );
  }
}