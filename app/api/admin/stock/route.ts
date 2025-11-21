import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const runtime = 'nodejs';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skuId, type, grams, note } = body;

    if (!skuId || !type || grams === undefined) {
      return NextResponse.json({ error: 'Chybí povinná pole' }, { status: 400 });
    }

    const sku = await prisma.sku.findUnique({ where: { id: skuId } });
    if (!sku) {
      return NextResponse.json({ error: 'SKU nenalezeno' }, { status: 404 });
    }

    // Transakce: update SKU + create movement
    await prisma.$transaction(async (tx) => {
      if (type === 'IN') {
        // Příjem: pro PIECE_BY_WEIGHT nastav weightTotalG, pro BULK_G přičti
        if (sku.saleMode === 'PIECE_BY_WEIGHT') {
          await tx.sku.update({
            where: { id: skuId },
            data: {
              weightTotalG: grams,
              soldOut: false,
              inStock: true,
              inStockSince: new Date(),
            },
          });
        } else {
          // BULK_G
          const newGrams = (sku.availableGrams ?? 0) + grams;
          await tx.sku.update({
            where: { id: skuId },
            data: {
              availableGrams: newGrams,
              inStock: newGrams > 0,
              inStockSince: newGrams > 0 ? new Date() : null,
            },
          });
        }
      } else if (type === 'OUT') {
        // Výdej: odečti gramy (hlídej negativní)
        if (sku.saleMode === 'PIECE_BY_WEIGHT') {
          await tx.sku.update({
            where: { id: skuId },
            data: {
              soldOut: true,
              inStock: false,
            },
          });
        } else {
          const newGrams = Math.max(0, (sku.availableGrams ?? 0) - grams);
          await tx.sku.update({
            where: { id: skuId },
            data: {
              availableGrams: newGrams,
              inStock: newGrams > 0,
            },
          });
        }
      } else if (type === 'ADJUST') {
        // Korekce: nastav přesné množství
        if (sku.saleMode === 'PIECE_BY_WEIGHT') {
          await tx.sku.update({
            where: { id: skuId },
            data: {
              weightTotalG: grams,
              soldOut: grams === 0,
              inStock: grams > 0,
              inStockSince: grams > 0 ? new Date() : null,
            },
          });
        } else {
          await tx.sku.update({
            where: { id: skuId },
            data: {
              availableGrams: grams,
              inStock: grams > 0,
              inStockSince: grams > 0 ? new Date() : null,
            },
          });
        }
      }

      // Zapiš movement
      await tx.stockMovement.create({
        data: {
          skuId,
          type,
          grams,
          note: note || null,
        },
      });
    });

    return NextResponse.json({ ok: true, message: 'Skladový pohyb zaznamenán' });
  } catch (error) {
    console.error('Error in stock movement:', error);
    return NextResponse.json({ error: 'Chyba při záznamu pohybu' }, { status: 500 });
  }
}