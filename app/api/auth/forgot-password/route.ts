import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email je povinný' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Pokud existuje účet s tímto emailem, obdržíte odkaz pro reset hesla.',
      });
    }

    // Delete any existing reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Create new reset token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // TODO: Send email with reset link
    // For now, log the reset URL (in production, this should send an email)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://muzahair.cz'}/reset-hesla?token=${token}`;
    console.log(`Password reset link for ${email}: ${resetUrl}`);

    // In production, you would use a service like Resend, SendGrid, or Mailgun
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@muzahair.cz',
    //   to: email,
    //   subject: 'Reset hesla - Mùza Hair',
    //   html: `<p>Klikněte na tento odkaz pro reset hesla: <a href="${resetUrl}">${resetUrl}</a></p>`,
    // });

    return NextResponse.json({
      success: true,
      message: 'Pokud existuje účet s tímto emailem, obdržíte odkaz pro reset hesla.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Chyba při zpracování požadavku' },
      { status: 500 }
    );
  }
}
