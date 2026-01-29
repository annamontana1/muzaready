/**
 * SKU Service - unified service layer for creating SKUs
 *
 * All SKU creation logic lives here. Both the Quick Add modal
 * and the Full Wizard call this service through the unified API endpoint.
 */

import prisma from '@/lib/prisma';
import { generateNextShortCode } from '@/lib/short-code';
import { generateVlasyXName, type VlasyXCategory, type VlasyXTier } from '@/lib/vlasyx-format';
import { formatPlatinumName } from '@/lib/platinum-format';
import { getShadeInfo } from '@/lib/shades';

// --------------- Types ---------------

export interface CreateSkuInput {
  // Required
  category: 'UNBARVENE' | 'BARVENE';
  tier: 'STANDARD' | 'LUXE' | 'PLATINUM_EDITION';
  shade: number; // 1-10
  structure: 'STRAIGHT' | 'WAVY' | 'CURLY';
  lengthCm: number;

  // Stock
  initialGrams?: number;
  location?: string;
  batchNumber?: string;
  costPerGramCzk?: number;

  // Price (if not provided, lookup from PriceMatrix)
  pricePerGramCzk?: number;

  // Platinum specific
  saleMode?: 'BULK_G' | 'PIECE_BY_WEIGHT';
  weightTotalG?: number;
  czechHair?: boolean;

  // Media
  imageUrl?: string;

  // Listing
  isListed?: boolean;
  listingPriority?: number;

  // BULK_G specifics
  minOrderG?: number;
  stepG?: number;

  // Options
  createStockMovement?: boolean; // default true
}

export interface CreateSkuResult {
  sku: {
    id: string;
    sku: string;
    name: string | null;
    shortCode: string | null;
    lengthCm: number | null;
    pricePerGramCzk: number | null;
  };
  stockMovement?: {
    id: string;
    grams: number;
  };
  shortCode: string;
  qrCodeUrl?: string;
}

export interface BulkLengthEntry {
  lengthCm: number;
  initialGrams: number;
  location?: string;
}

// --------------- Constants ---------------

const STRUCTURE_MAP: Record<string, string> = {
  'STRAIGHT': 'rovne',
  'WAVY': 'vlnite',
  'CURLY': 'kudrnate',
};

const STRUCTURE_DB_MAP: Record<string, string> = {
  'STRAIGHT': 'rovne',
  'WAVY': 'mirne-vlnite',
  'CURLY': 'kudrnate',
};

const STRUCTURE_LABEL_MAP: Record<string, string> = {
  'STRAIGHT': 'rovne',
  'WAVY': 'vlnite',
  'CURLY': 'kudrnate',
};

const TIER_CODE_MAP: Record<string, string> = {
  'STANDARD': 'STD',
  'LUXE': 'LUX',
  'PLATINUM_EDITION': 'PLAT',
};

const CATEGORY_CODE_MAP: Record<string, string> = {
  'UNBARVENE': 'NB',
  'BARVENE': 'BR',
};

const STRUCTURE_CODE_MAP: Record<string, string> = {
  'STRAIGHT': 'R',
  'WAVY': 'V',
  'CURLY': 'K',
};

const FALLBACK_CZK_TO_EUR = 1 / 25.5;

// --------------- Helpers ---------------

async function getCzkToEur(): Promise<number> {
  const rate = await prisma.exchangeRate.findFirst({
    orderBy: { lastUpdated: 'desc' },
  });
  return rate ? Number(rate.czk_to_eur) : FALLBACK_CZK_TO_EUR;
}

function getShadeRange(category: string, shade: number): { start: number; end: number } {
  if (category === 'BARVENE' || category === 'barvene') {
    return { start: 5, end: 10 };
  }
  if (shade <= 4) return { start: 1, end: 4 };
  if (shade <= 7) return { start: 5, end: 7 };
  return { start: 8, end: 10 };
}

function getStructureDbValue(structure: string): string {
  // Map our enum values to the DB values used in the existing system
  const map: Record<string, string> = {
    'STRAIGHT': 'rovne',
    'WAVY': 'mirne vlnite',
    'CURLY': 'kudrnate',
  };
  return map[structure] || structure;
}

// --------------- Public Methods ---------------

/**
 * Generate a unique SKU code
 * Format for Standard/LUXE: X-{CAT}-{TIER}-O{SHADE}-S{STR}-{DATE}-{SEQ}
 * Format for Platinum: Y-{CAT}-PLAT-O{SHADE}-S{STR}-L{LENGTH}cm-W{WEIGHT}g
 */
export function generateSkuCode(input: {
  category: string;
  tier: string;
  shade: number;
  structure: string;
  lengthCm: number;
  weightTotalG?: number;
  index?: number;
}): string {
  const catCode = CATEGORY_CODE_MAP[input.category] || 'NB';
  const tierCode = TIER_CODE_MAP[input.tier] || 'STD';
  const shadeCode = String(input.shade).padStart(2, '0');
  const structCode = STRUCTURE_CODE_MAP[input.structure] || 'R';

  if (input.tier === 'PLATINUM_EDITION') {
    return `Y-${catCode}-PLAT-O${shadeCode}-S${structCode}-L${input.lengthCm}cm-W${input.weightTotalG || 0}g`;
  }

  const today = new Date();
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
  const seq = String(input.index || 1).padStart(2, '0');
  return `X-${catCode}-${tierCode}-O${shadeCode}-S${structCode}-${dateStr}-${seq}`;
}

/**
 * Ensure SKU code is unique by appending counter suffix if needed
 */
async function ensureUniqueSkuCode(baseCode: string): Promise<string> {
  let finalCode = baseCode;
  let counter = 1;
  while (true) {
    const existing = await prisma.sku.findUnique({ where: { sku: finalCode } });
    if (!existing) break;
    counter += 1;
    finalCode = `${baseCode}-${String(counter).padStart(2, '0')}`;
  }
  return finalCode;
}

/**
 * Lookup price from PriceMatrix
 */
export async function lookupPrice(input: {
  category: string;
  tier: string;
  lengthCm: number;
  shade: number;
  czechHair?: boolean;
}): Promise<number | null> {
  const categoryKey = input.category === 'UNBARVENE' || input.category === 'nebarvene' ? 'nebarvene' : 'barvene';
  const tierKey = input.tier === 'STANDARD' ? 'standard'
    : input.tier === 'LUXE' ? 'luxe'
    : 'platinum';

  const categoryForRange = input.czechHair ? 'ceske' : categoryKey;
  const shadeRange = getShadeRange(categoryForRange, input.shade);

  const entry = await prisma.priceMatrix.findFirst({
    where: {
      category: categoryForRange,
      tier: tierKey,
      shadeRangeStart: shadeRange.start,
      shadeRangeEnd: shadeRange.end,
      lengthCm: input.lengthCm,
    },
  });

  return entry ? Number(entry.pricePerGramCzk) : null;
}

/**
 * Get the next available short code (M0001, M0002, ...)
 */
export async function getNextShortCode(): Promise<string> {
  return generateNextShortCode();
}

/**
 * Generate a display name for a SKU
 */
function generateName(input: {
  tier: string;
  shade: number;
  lengthCm: number;
  weightTotalG?: number;
}): string {
  if (input.tier === 'PLATINUM_EDITION') {
    return formatPlatinumName(input.lengthCm, input.shade, input.weightTotalG) || `Platinum #${input.shade}`;
  }

  const vlasyXCategory: VlasyXCategory = 'nebarvene'; // category doesn't affect the name format
  const vlasyXTier: VlasyXTier = input.tier === 'LUXE' ? 'luxe' : 'standard';

  return generateVlasyXName(
    null, // length not used in name
    vlasyXCategory,
    vlasyXTier,
    input.shade,
    null // grams not used in name
  );
}

/**
 * Create a single SKU with all associated data
 */
export async function createSku(input: CreateSkuInput): Promise<CreateSkuResult> {
  // Validate shade
  if (input.shade < 1 || input.shade > 10) {
    throw new Error('Neplatny odstin (musi byt 1-10)');
  }

  const shadeInfo = getShadeInfo(input.shade);
  if (!shadeInfo) {
    throw new Error(`Odstin ${input.shade} neexistuje`);
  }

  // Determine sale mode
  const saleMode = input.saleMode || (input.tier === 'PLATINUM_EDITION' ? 'PIECE_BY_WEIGHT' : 'BULK_G');

  // Resolve price
  let pricePerGramCzk = input.pricePerGramCzk;
  if (!pricePerGramCzk) {
    const matrixPrice = await lookupPrice({
      category: input.category,
      tier: input.tier,
      lengthCm: input.lengthCm,
      shade: input.shade,
      czechHair: input.czechHair,
    });
    if (!matrixPrice) {
      throw new Error(`Cena nenalezena v ceniku pro ${input.tier} / ${input.lengthCm}cm / odstin ${input.shade}. Zadejte cenu rucne.`);
    }
    pricePerGramCzk = matrixPrice;
  }

  // CZK to EUR conversion
  const czkToEur = await getCzkToEur();
  const pricePerGramEur = Number((pricePerGramCzk * czkToEur).toFixed(3));

  // Generate SKU code
  const baseSkuCode = generateSkuCode({
    category: input.category,
    tier: input.tier,
    shade: input.shade,
    structure: input.structure,
    lengthCm: input.lengthCm,
    weightTotalG: input.weightTotalG,
  });
  const finalSkuCode = await ensureUniqueSkuCode(baseSkuCode);

  // Generate short code
  const shortCode = await generateNextShortCode();

  // Generate name
  const name = generateName({
    tier: input.tier,
    shade: input.shade,
    lengthCm: input.lengthCm,
    weightTotalG: input.weightTotalG,
  });

  // Shade range for catalog adapter
  const categoryForRange = input.czechHair ? 'ceske'
    : input.category === 'UNBARVENE' ? 'nebarvene' : 'barvene';
  const shadeRange = getShadeRange(categoryForRange, input.shade);

  // Determine initial stock amounts
  const initialGrams = input.initialGrams || 0;
  const isPiece = saleMode === 'PIECE_BY_WEIGHT';
  const weightTotalG = isPiece ? (input.weightTotalG || 0) : null;
  const availableGrams = !isPiece ? initialGrams : null;
  const hasStock = isPiece ? (initialGrams > 0 || (input.weightTotalG || 0) > 0) : initialGrams > 0;

  // Platinum total price
  const priceCzkTotal = isPiece ? Number((pricePerGramCzk * (weightTotalG || 0)).toFixed(2)) : null;
  const priceEurTotal = priceCzkTotal ? Number((priceCzkTotal * czkToEur).toFixed(2)) : null;

  // Create SKU and optionally stock movement in a transaction
  const shouldCreateMovement = input.createStockMovement !== false && hasStock;

  const result = await prisma.$transaction(async (tx) => {
    const sku = await tx.sku.create({
      data: {
        sku: finalSkuCode,
        shortCode,
        name,
        imageUrl: input.imageUrl || null,
        shade: String(input.shade),
        shadeName: shadeInfo.name,
        shadeHex: shadeInfo.hex,
        shadeRangeStart: shadeRange.start,
        shadeRangeEnd: shadeRange.end,
        lengthCm: input.lengthCm,
        structure: input.structure,
        customerCategory: input.tier as any,
        saleMode,
        pricePerGramCzk,
        pricePerGramEur,
        priceCzkTotal,
        priceEurTotal,
        weightTotalG: isPiece ? weightTotalG : null,
        weightGrams: isPiece ? weightTotalG : null,
        availableGrams: !isPiece ? (initialGrams || null) : null,
        minOrderG: !isPiece ? (input.minOrderG || null) : null,
        stepG: !isPiece ? (input.stepG || null) : null,
        inStock: hasStock,
        inStockSince: hasStock ? new Date() : null,
        isListed: input.isListed ?? false,
        listingPriority: input.isListed ? (input.listingPriority ?? 5) : null,
      },
    });

    let stockMovement: { id: string; grams: number } | undefined;

    if (shouldCreateMovement) {
      const gramsForMovement = isPiece ? (weightTotalG || 0) : initialGrams;
      if (gramsForMovement > 0) {
        const movement = await tx.stockMovement.create({
          data: {
            skuId: sku.id,
            type: 'IN',
            grams: gramsForMovement,
            location: input.location || null,
            batchNumber: input.batchNumber || null,
            costPerGramCzk: input.costPerGramCzk || null,
            note: 'Pocatecni zasoba',
          },
        });
        stockMovement = { id: movement.id, grams: movement.grams };
      }
    }

    return { sku, stockMovement };
  });

  // QR code URL (based on existing pattern in the codebase)
  const qrCodeUrl = result.stockMovement
    ? `/api/admin/stock/qr-code/${result.stockMovement.id}`
    : undefined;

  return {
    sku: {
      id: result.sku.id,
      sku: result.sku.sku,
      name: result.sku.name,
      shortCode: result.sku.shortCode,
      lengthCm: result.sku.lengthCm,
      pricePerGramCzk: result.sku.pricePerGramCzk,
    },
    stockMovement: result.stockMovement,
    shortCode,
    qrCodeUrl,
  };
}

/**
 * Create multiple SKUs at once (for wizard with multiple lengths)
 * All-or-nothing transaction.
 */
export async function createBulkSkus(
  baseInput: Omit<CreateSkuInput, 'lengthCm' | 'initialGrams'>,
  lengths: BulkLengthEntry[]
): Promise<CreateSkuResult[]> {
  if (lengths.length === 0) {
    throw new Error('Vyber alespon jednu delku');
  }

  // Validate shade
  if (baseInput.shade < 1 || baseInput.shade > 10) {
    throw new Error('Neplatny odstin (musi byt 1-10)');
  }

  const shadeInfo = getShadeInfo(baseInput.shade);
  if (!shadeInfo) {
    throw new Error(`Odstin ${baseInput.shade} neexistuje`);
  }

  const saleMode = baseInput.saleMode || (baseInput.tier === 'PLATINUM_EDITION' ? 'PIECE_BY_WEIGHT' : 'BULK_G');
  const czkToEur = await getCzkToEur();

  // Pre-resolve prices for all lengths
  const priceByLength: Record<number, number> = {};
  for (const entry of lengths) {
    if (baseInput.pricePerGramCzk) {
      priceByLength[entry.lengthCm] = baseInput.pricePerGramCzk;
    } else {
      const matrixPrice = await lookupPrice({
        category: baseInput.category,
        tier: baseInput.tier,
        lengthCm: entry.lengthCm,
        shade: baseInput.shade,
        czechHair: baseInput.czechHair,
      });
      if (!matrixPrice) {
        throw new Error(`Cena nenalezena v ceniku pro delku ${entry.lengthCm}cm`);
      }
      priceByLength[entry.lengthCm] = matrixPrice;
    }
  }

  // Pre-generate unique SKU codes and short codes
  const skuCodes: string[] = [];
  const shortCodes: string[] = [];

  for (let i = 0; i < lengths.length; i++) {
    const entry = lengths[i];
    const baseCode = generateSkuCode({
      category: baseInput.category,
      tier: baseInput.tier,
      shade: baseInput.shade,
      structure: baseInput.structure,
      lengthCm: entry.lengthCm,
      weightTotalG: baseInput.weightTotalG,
      index: i + 1,
    });
    const finalCode = await ensureUniqueSkuCode(baseCode);
    skuCodes.push(finalCode);

    const shortCode = await generateNextShortCode();
    shortCodes.push(shortCode);
  }

  // Shade range
  const categoryForRange = baseInput.czechHair ? 'ceske'
    : baseInput.category === 'UNBARVENE' ? 'nebarvene' : 'barvene';
  const shadeRange = getShadeRange(categoryForRange, baseInput.shade);
  const isPiece = saleMode === 'PIECE_BY_WEIGHT';

  // Create all in a transaction
  const results = await prisma.$transaction(async (tx) => {
    const created: CreateSkuResult[] = [];

    for (let i = 0; i < lengths.length; i++) {
      const entry = lengths[i];
      const pricePerGramCzk = priceByLength[entry.lengthCm];
      const pricePerGramEur = Number((pricePerGramCzk * czkToEur).toFixed(3));

      const name = generateName({
        tier: baseInput.tier,
        shade: baseInput.shade,
        lengthCm: entry.lengthCm,
        weightTotalG: baseInput.weightTotalG,
      });

      const hasStock = entry.initialGrams > 0;
      const priceCzkTotal = isPiece ? Number((pricePerGramCzk * (baseInput.weightTotalG || 0)).toFixed(2)) : null;
      const priceEurTotal = priceCzkTotal ? Number((priceCzkTotal * czkToEur).toFixed(2)) : null;

      const sku = await tx.sku.create({
        data: {
          sku: skuCodes[i],
          shortCode: shortCodes[i],
          name,
          imageUrl: baseInput.imageUrl || null,
          shade: String(baseInput.shade),
          shadeName: shadeInfo.name,
          shadeHex: shadeInfo.hex,
          shadeRangeStart: shadeRange.start,
          shadeRangeEnd: shadeRange.end,
          lengthCm: entry.lengthCm,
          structure: baseInput.structure,
          customerCategory: baseInput.tier as any,
          saleMode,
          pricePerGramCzk,
          pricePerGramEur,
          priceCzkTotal,
          priceEurTotal,
          weightTotalG: isPiece ? (baseInput.weightTotalG || null) : null,
          weightGrams: isPiece ? (baseInput.weightTotalG || null) : null,
          availableGrams: !isPiece ? (entry.initialGrams || null) : null,
          minOrderG: !isPiece ? (baseInput.minOrderG || null) : null,
          stepG: !isPiece ? (baseInput.stepG || null) : null,
          inStock: hasStock,
          inStockSince: hasStock ? new Date() : null,
          isListed: baseInput.isListed ?? false,
          listingPriority: baseInput.isListed ? (baseInput.listingPriority ?? 5) : null,
        },
      });

      let stockMovement: { id: string; grams: number } | undefined;
      const shouldCreateMovement = baseInput.createStockMovement !== false;

      if (shouldCreateMovement && hasStock) {
        const gramsForMovement = isPiece ? (baseInput.weightTotalG || 0) : entry.initialGrams;
        if (gramsForMovement > 0) {
          const movement = await tx.stockMovement.create({
            data: {
              skuId: sku.id,
              type: 'IN',
              grams: gramsForMovement,
              location: entry.location || baseInput.location || null,
              batchNumber: baseInput.batchNumber || null,
              costPerGramCzk: baseInput.costPerGramCzk || null,
              note: 'Pocatecni zasoba',
            },
          });
          stockMovement = { id: movement.id, grams: movement.grams };
        }
      }

      const qrCodeUrl = stockMovement
        ? `/api/admin/stock/qr-code/${stockMovement.id}`
        : undefined;

      created.push({
        sku: {
          id: sku.id,
          sku: sku.sku,
          name: sku.name,
          shortCode: sku.shortCode,
          lengthCm: sku.lengthCm,
          pricePerGramCzk: sku.pricePerGramCzk,
        },
        stockMovement,
        shortCode: shortCodes[i],
        qrCodeUrl,
      });
    }

    return created;
  });

  return results;
}
