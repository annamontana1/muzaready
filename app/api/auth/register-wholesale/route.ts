import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      companyName,
      businessType,
      website,
      instagram,
      country,
      city,
      zipCode,
      streetAddress,
      taxId,
    } = body;

    // Validation
    if (!email || !password || !firstName || !lastName || !companyName || !businessType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        wholesaleRequested: true,
        isWholesale: false,
        wholesaleRequestedAt: new Date(),
        companyName,
        businessType,
        website: website || null,
        instagram: instagram || null,
        country: country || null,
        city: city || null,
        zipCode: zipCode || null,
        streetAddress: streetAddress || null,
        taxId: taxId || null,
        status: 'active',
      },
    });

    // Create session
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
    });

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@muzaready.cz';
    if (resend) {
      try {
        await resend.emails.send({
          from: 'noreply@muzaready.cz',
          to: adminEmail,
          subject: `Nová žádost o velkoobchodní přístup: ${companyName}`,
          html: `
            <h2>Nová žádost o velkoobchodní přístup</h2>
            <p><strong>Jméno:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone || 'N/A'}</p>
            <p><strong>Firma:</strong> ${companyName}</p>
            <p><strong>Typ podnikání:</strong> ${businessType}</p>
            <p><strong>Web:</strong> ${website || 'N/A'}</p>
            <p><strong>Instagram:</strong> ${instagram || 'N/A'}</p>
            <p><strong>Adresa:</strong> ${streetAddress || ''}, ${zipCode || ''} ${city || ''}, ${country || ''}</p>
            <p><strong>IČ:</strong> ${taxId || 'N/A'}</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/wholesale-requests">Schválit nebo zamítnout</a></p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send admin notification email:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY not configured; skipping admin email');
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Wholesale registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
