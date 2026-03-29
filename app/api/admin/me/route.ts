import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/me
 * Returns the currently authenticated admin user's basic info (id, email, name, role).
 * Used by the admin UI to conditionally show role-restricted features.
 */
export async function GET(request: NextRequest) {
  const session = await verifyAdminSession(request);

  if (!session.valid || !session.admin) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin session required' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: session.admin.id,
    email: session.admin.email,
    name: session.admin.name,
    role: session.admin.role,
  });
}
