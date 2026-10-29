import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

// Velkoobchodní sleva: schválený velkoobchodní účet má −10 % na vlasy i zakončení (doprava bez slevy)
export const WHOLESALE_DISCOUNT_PERCENT = 10;

/** Přihlášený zákazník z cookie session (nebo null). Jen na serveru. */
export async function getSessionUser() {
  try {
    const token = (await cookies()).get('session')?.value;
    if (!token) return null;
    const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
    if (!session || new Date(session.expiresAt) < new Date()) return null;
    return session.user;
  } catch {
    return null;
  }
}

/** Je přihlášený zákazník schválený velkoobchod? */
export async function isWholesaleSession(): Promise<boolean> {
  const user = await getSessionUser();
  return !!user?.isWholesale && user.status !== 'suspended';
}
