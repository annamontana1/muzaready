import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


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

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email a heslo jsou povinné' },
        { status: 400 }
      );
    }

    // Call Supabase Edge Function — runs with service_role key, bypasses PostgREST permissions
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('Missing SUPABASE_URL env var');
      return NextResponse.json({ error: 'Chyba konfigurace serveru' }, { status: 500 });
    }

    const edgeFnUrl = `${supabaseUrl}/functions/v1/admin-login`;
    console.log('Calling edge function:', edgeFnUrl);

    const edgeRes = await fetch(edgeFnUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await edgeRes.json();
    console.log('Edge function result:', { valid: result.valid, error: result.error });

    if (!result.valid) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    const admin = result.admin;

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

    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const cookieValue = JSON.stringify(sessionData);

    // Get the root domain for cookie (works for both www and non-www)
    const host = request.headers.get('host') || '';
    const rootDomain = host.includes('muzahair.cz') ? '.muzahair.cz' : undefined;

    response.cookies.set('admin-session', cookieValue, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
      domain: rootDomain,
    });

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
