import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { verifyPassword } from '@/lib/admin-auth';
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

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email a heslo jsou povinné' },
        { status: 400 }
      );
    }

    // Uses SUPABASE_SERVICE_ROLE_KEY (now set in Vercel) — bypasses PostgREST restrictions
    const { data: admin, error: dbError } = await getSupabaseAdminClient()
      .from('admin_users')
      .select('id, email, name, role, status, password')
      .eq('email', email)
      .single();

    if (dbError || !admin) {
      console.error('Admin lookup failed:', dbError?.message, dbError?.code);
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

    if (admin.status !== 'active') {
      return NextResponse.json(
        { error: 'Váš účet není aktivní. Kontaktujte administrátora.' },
        { status: 403 }
      );
    }

    const passwordValid = await verifyPassword(password, admin.password);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Nesprávný email nebo heslo' },
        { status: 401 }
      );
    }

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
        message: 'Přihlášení bylo úspěšné',
        admin: { name: admin.name, email: admin.email, role: admin.role }
      },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const host = request.headers.get('host') || '';
    const rootDomain = host.includes('muzahair.cz') ? '.muzahair.cz' : undefined;

    response.cookies.set('admin-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
      domain: rootDomain,
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
