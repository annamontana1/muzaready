import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from './supabase';
import bcrypt from 'bcryptjs';

export async function verifyAdminSession(request: NextRequest): Promise<{
  valid: boolean;
  admin?: { id: string; email: string; name: string; role: string };
  error?: string;
}> {
  try {
    const adminSession = request.cookies.get('admin-session');
    if (!adminSession) return { valid: false, error: 'No session found' };

    const sessionData = JSON.parse(adminSession.value);
    if (!sessionData.email || !sessionData.token) {
      return { valid: false, error: 'Invalid session data' };
    }

    // Uses SUPABASE_SERVICE_ROLE_KEY — bypasses PostgREST restrictions
    const { data: admin, error } = await getSupabaseAdminClient()
      .from('admin_users')
      .select('id, email, name, role, status')
      .eq('email', sessionData.email)
      .single();

    if (error || !admin || admin.status !== 'active') {
      return { valid: false, error: 'Admin user not found or inactive' };
    }

    return { valid: true, admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role } };
  } catch (error) {
    console.error('Session verification error:', error);
    return { valid: false, error: 'Session verification failed' };
  }
}

export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const session = await verifyAdminSession(request);
  if (!session.valid) {
    return NextResponse.json({ error: 'Unauthorized - Admin session required' }, { status: 401 });
  }
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
