import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

/**
 * Helper function to verify admin session from cookie
 * Uses Supabase Edge Function (service_role) to bypass PostgREST permission issues
 */
export async function verifyAdminSession(request: NextRequest): Promise<{
  valid: boolean;
  admin?: { id: string; email: string; name: string; role: string };
  error?: string;
}> {
  try {
    const adminSession = request.cookies.get('admin-session');

    if (!adminSession) {
      return { valid: false, error: 'No session found' };
    }

    const sessionData = JSON.parse(adminSession.value);

    if (!sessionData.email || !sessionData.token) {
      return { valid: false, error: 'Invalid session data' };
    }

    // Call edge function — uses service_role key, bypasses PostgREST restrictions
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return { valid: false, error: 'Missing SUPABASE_URL' };
    }

    const edgeRes = await fetch(`${supabaseUrl}/functions/v1/admin-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: sessionData.email }),
    });

    const result = await edgeRes.json();

    if (!result.valid) {
      return { valid: false, error: 'Admin user not found or inactive' };
    }

    return { valid: true, admin: result.admin };
  } catch (error) {
    console.error('Session verification error:', error);
    return { valid: false, error: 'Session verification failed' };
  }
}

/**
 * Middleware helper to protect admin API routes
 */
export async function requireAdmin(
  request: NextRequest
): Promise<NextResponse | null> {
  const session = await verifyAdminSession(request);

  if (!session.valid) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin session required' },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Hash password for storage
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
