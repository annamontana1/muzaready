import { NextRequest, NextResponse } from 'next/server';
import prisma from './prisma';
import * as bcrypt from '@node-rs/bcrypt';

/**
 * Helper function to verify admin session from cookie
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
    
    // Verify session has required fields
    if (!sessionData.email || !sessionData.token) {
      return { valid: false, error: 'Invalid session data' };
    }

    // Check if admin user exists and is active
    const admin = await prisma.adminUser.findUnique({
      where: { email: sessionData.email },
    });

    if (!admin || admin.status !== 'active') {
      return { valid: false, error: 'Admin user not found or inactive' };
    }

    return {
      valid: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return { valid: false, error: 'Session verification failed' };
  }
}

/**
 * Middleware helper to protect admin API routes
 * Returns NextResponse with 401 if not authenticated, null if authenticated
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

