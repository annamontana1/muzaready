import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prismaInstance =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

export const prisma = prismaInstance as PrismaClient & Record<string, unknown>;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;

export default prisma;
