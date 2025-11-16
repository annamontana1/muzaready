export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Helper to check if user is admin
async function isAdmin() {
  const adminUser = await prisma.adminUser.findFirst({ where: { status: 'active' } });
  return Boolean(adminUser);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action'); // 'approve' or 'reject'

  try {
    // Check admin access
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const userId = params.userId;

    const prismaAny = prisma as any;
    const user = await prismaAny.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      // Approve wholesale request
      const updatedUser = await prismaAny.user.update({
        where: { id: userId },
        data: {
          isWholesale: true,
          wholesaleApprovedAt: new Date(),
        },
      });

      // Send approval email
      if (resend) {
        try {
          await resend.emails.send({
          from: 'noreply@muzaready.cz',
          to: user.email,
          subject: 'Vaše žádost o velkoobchodní přístup byla schválena',
          html: `
            <h2>Schválení velkoobchodního přístupu</h2>
            <p>Dobrý den ${user.firstName},</p>
            <p>Vaše žádost o velkoobchodní přístup byla schválena.</p>
            <p>Od nyní máte přístup k 10% slevě na produkty z řady vlasy.</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}">Návštívit obchod</a></p>
          `,
          });
        } catch (emailError) {
          console.error('Failed to send approval email:', emailError);
        }
      } else {
        console.warn('RESEND_API_KEY not configured; skipping approval email');
      }

      return NextResponse.json(
        { user: updatedUser },
        { status: 200 }
      );
    } else if (action === 'reject') {
      // Reject wholesale request
      const updatedUser = await prismaAny.user.update({
        where: { id: userId },
        data: {
          wholesaleRequested: false,
        },
      });

      // Send rejection email
      if (resend) {
        try {
          await resend.emails.send({
            from: 'noreply@muzaready.cz',
            to: user.email,
            subject: 'Vaše žádost o velkoobchodní přístup',
            html: `
              <h2>Rozhodnutí o velkoobchodním přístupu</h2>
              <p>Dobrý den ${user.firstName},</p>
              <p>Vaše žádost o velkoobchodní přístup byla zamítnuta.</p>
              <p>Pokud máte otázky, kontaktujte prosím náš tým podpory.</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send rejection email:', emailError);
        }
      } else {
        console.warn('RESEND_API_KEY not configured; skipping rejection email');
      }

      return NextResponse.json(
        { user: updatedUser },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing wholesale request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
