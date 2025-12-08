import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import prisma from '@/lib/prisma';
import { UpdateAdminUserSchema } from '@/lib/validation/admin-users';
import bcrypt from 'bcryptjs';
export const runtime = 'nodejs';

interface Params {
  id: string;
}

/**
 * GET /api/admin/users/[id]
 * Fetch single admin user
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    const user = await prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Uživatel nebyl nalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin user:', error);
    return NextResponse.json(
      { error: 'Chyba při načítání uživatele' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update admin user
 */
export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();

    // Validate request body
    const validation = UpdateAdminUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Neplatná data',
          details: validation.error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, password, role, status } = validation.data;

    // Check if user exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Uživatel nebyl nalezen' },
        { status: 404 }
      );
    }

    // If email is being changed, check if it's already taken
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.adminUser.findUnique({
        where: { email },
      });

      if (emailTaken) {
        return NextResponse.json(
          { error: 'Tento email již používá jiný uživatel' },
          { status: 409 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (status) updateData.status = status;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json(
      { error: 'Chyba při aktualizaci uživatele' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete admin user
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { id } = params;

    // Check if user exists
    const user = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Uživatel nebyl nalezen' },
        { status: 404 }
      );
    }

    // Prevent deleting yourself (optional safety check)
    // You could add logic here to check if the user is deleting themselves

    // Delete user
    await prisma.adminUser.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Uživatel byl úspěšně smazán' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json(
      { error: 'Chyba při mazání uživatele' },
      { status: 500 }
    );
  }
}
