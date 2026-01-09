import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET() {
  return NextResponse.json({ status: 'Emergency login endpoint active' });
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid' }, { status: 401 });
    }

    const session = JSON.stringify({
      email: admin.email,
      name: admin.name,
      role: admin.role,
      token: Math.random().toString(36),
      loginTime: new Date().toISOString()
    });

    const response = NextResponse.json({ success: true, redirect: '/admin' });
    response.cookies.set('admin-session', session, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 86400,
      path: '/'
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
