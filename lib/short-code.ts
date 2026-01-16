/**
 * Short Code Generator for Instagram
 * Format: M0001, M0002, ... M9999
 */

import prisma from './prisma';

const PREFIX = 'M';
const CODE_LENGTH = 4; // 4 digits = 0001-9999

/**
 * Generates the next available short code
 * @returns Promise<string> - Next short code like "M0001"
 */
export async function generateNextShortCode(): Promise<string> {
  // Find the highest existing short code
  const lastSku = await prisma.sku.findFirst({
    where: {
      shortCode: {
        startsWith: PREFIX,
        not: null,
      },
    },
    orderBy: {
      shortCode: 'desc',
    },
    select: {
      shortCode: true,
    },
  });

  let nextNumber = 1;

  if (lastSku?.shortCode) {
    // Extract number from "M0001" -> 1
    const numPart = lastSku.shortCode.slice(PREFIX.length);
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed)) {
      nextNumber = parsed + 1;
    }
  }

  // Format: M + zero-padded number
  const code = `${PREFIX}${nextNumber.toString().padStart(CODE_LENGTH, '0')}`;

  return code;
}

/**
 * Validates short code format
 * @param code - Code to validate
 * @returns boolean
 */
export function isValidShortCode(code: string): boolean {
  const regex = new RegExp(`^${PREFIX}\\d{${CODE_LENGTH}}$`);
  return regex.test(code);
}

/**
 * Parses short code to number
 * @param code - Short code like "M0001"
 * @returns number or null
 */
export function parseShortCode(code: string): number | null {
  if (!isValidShortCode(code)) return null;
  const numPart = code.slice(PREFIX.length);
  return parseInt(numPart, 10);
}

/**
 * Formats number to short code
 * @param num - Number to format
 * @returns string like "M0001"
 */
export function formatShortCode(num: number): string {
  return `${PREFIX}${num.toString().padStart(CODE_LENGTH, '0')}`;
}

/**
 * Assigns short codes to all SKUs that don't have one
 * @returns Promise<number> - Number of SKUs updated
 */
export async function assignMissingShortCodes(): Promise<number> {
  // Get all SKUs without short codes, ordered by creation date
  const skusWithoutCode = await prisma.sku.findMany({
    where: {
      shortCode: null,
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
    },
  });

  if (skusWithoutCode.length === 0) {
    return 0;
  }

  // Get the starting number
  const lastSku = await prisma.sku.findFirst({
    where: {
      shortCode: {
        startsWith: PREFIX,
        not: null,
      },
    },
    orderBy: {
      shortCode: 'desc',
    },
    select: {
      shortCode: true,
    },
  });

  let nextNumber = 1;
  if (lastSku?.shortCode) {
    const numPart = lastSku.shortCode.slice(PREFIX.length);
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed)) {
      nextNumber = parsed + 1;
    }
  }

  // Update each SKU with a new short code
  for (const sku of skusWithoutCode) {
    const code = formatShortCode(nextNumber);
    await prisma.sku.update({
      where: { id: sku.id },
      data: { shortCode: code },
    });
    nextNumber++;
  }

  return skusWithoutCode.length;
}
