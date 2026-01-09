import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatPlatinumName } from '@/lib/platinum-format';
import { generateVlasyXName, VlasyXCategory, VlasyXTier } from '@/lib/vlasyx-format';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';


const EXCHANGE_RATE_ID = 'GLOBAL_RATE';
const FALLBACK_CZK_TO_EUR = 1 / 25.5;

const categoryMap: Record<string, string> = {
  nebarvene_panenske: 'nebarvene',
  barvene_vlasy: 'barvene',
  clipin: 'clipin',
  prislusenstvi: 'prislusenstvi',
};

const tierMap: Record<string, string> = {
  Standard: 'standard',
  LUXE: 'luxe',
  'Platinum edition': 'platinum',
};

const customerCategoryMap: Record<string, string> = {
  Standard: 'STANDARD',
  LUXE: 'LUXE',
  'Platinum edition': 'PLATINUM_EDITION',
};

const structureCodeMap: Record<string, string> = {
  'rovné': 'R',
  'mírně vlnité': 'MV',
  'vlnité': 'V',
  'kudrnaté': 'K',
};

const getCzkToEur = async () => {
  const rate = await prisma.exchangeRate.findFirst({
    where: { id: EXCHANGE_RATE_ID },
  });
  return rate ? Number(rate.czk_to_eur) : FALLBACK_CZK_TO_EUR;
};

const getShadeRange = (category: string, shade: number) => {
  if (category === 'barvene') {
    return { start: 5, end: 10 };
  }
  if (category === 'ceske') {
    return { start: 1, end: 4 };
  }
  if (shade <= 4) return { start: 1, end: 4 };
  if (shade <= 7) return { start: 5, end: 7 };
  return { start: 8, end: 10 };
};

const getMatrixEntry = async (
  category: string,
  tier: string,
  lengthCm: number,
  shadeRange: { start: number; end: number }
) => {
  return prisma.priceMatrix.findUnique({
    where: {
      category_tier_shadeRangeStart_shadeRangeEnd_lengthCm: {
        category,
        tier,
        shadeRangeStart: shadeRange.start,
        shadeRangeEnd: shadeRange.end,
        lengthCm,
      },
      },
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productType,
      category,
      tier,
      name,
      imageUrl,
      isListed,
      listingPriority,
      shade,
      shadeName,
      shadeHex,
      structure,
      selectedLengths,
      stockByLength,
      defaultLength,
      minOrderG,
      stepG,
      defaultGrams,
      usePriceMatrix,
      pricePerGramCzk: manualPricePerGramCzk,
      lengthCm,
      weightGrams,
      priceCzk: manualPriceCzk,
      inStock,
      ceskeVlasy,
    } = body;

    const shadeNumber = Number(shade);
    if (!shadeNumber || shadeNumber < 1 || shadeNumber > 10) {
      return NextResponse.json({ error: 'Neplatný odstín' }, { status: 400 });
    }

    const categoryKey = categoryMap[category] || category;
    const tierKey = tierMap[tier] || tier;
    const customerCategory = customerCategoryMap[tier] || 'STANDARD';
    const vlasyXCategory = (categoryKey === 'barvene' ? 'barvene' : 'nebarvene') as VlasyXCategory;
    const vlasyXTier = (tierKey === 'luxe' ? 'luxe' : 'standard') as VlasyXTier;
    const gramsForName = Number(defaultGrams) || 100;

    const czkToEur = await getCzkToEur();

    if (productType === 'vlasyx') {
      if (!Array.isArray(selectedLengths) || selectedLengths.length === 0) {
        return NextResponse.json(
          { error: 'Vyber alespoň jednu délku' },
          { status: 400 }
        );
      }

      if (!defaultLength || !selectedLengths.includes(Number(defaultLength))) {
        return NextResponse.json(
          { error: 'Default délka musí být mezi vybranými délkami' },
          { status: 400 }
        );
      }

      if (usePriceMatrix && !selectedLengths.every((len: number) => len in stockByLength)) {
        return NextResponse.json(
          { error: 'Chybí skladové údaje pro některé délky' },
          { status: 400 }
        );
      }

      if (!usePriceMatrix && (!manualPricePerGramCzk || Number(manualPricePerGramCzk) <= 0)) {
        return NextResponse.json(
          { error: 'Vyplň cenu za gram (Kč)' },
          { status: 400 }
        );
      }

      const shadeRange = getShadeRange(categoryKey, shadeNumber);
      const pricePerGramByLength: Record<number, number> = {};

      for (const length of selectedLengths) {
        if (usePriceMatrix) {
          const entry = await getMatrixEntry(categoryKey, tierKey, Number(length), shadeRange);
          if (!entry) {
            return NextResponse.json(
              { error: `Chybí cena v ceníku pro délku ${length} cm` },
              { status: 400 }
            );
          }
          pricePerGramByLength[length] = Number(entry.pricePerGramCzk);
        } else {
          pricePerGramByLength[length] = Number(manualPricePerGramCzk);
        }
      }

      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(
        today.getDate()
      ).padStart(2, '0')}`;
      const categoryPrefix = categoryKey === 'nebarvene' ? 'NB' : 'BR';
      const tierPrefix = tierKey === 'standard' ? 'STD' : 'LUX';
      const structureCode = structureCodeMap[structure] || 'R';
      const shadeCode = String(shadeNumber).padStart(2, '0');

      const createdSkus = [] as Array<{ id: string; sku: string; length: number }>;

      for (let index = 0; index < selectedLengths.length; index++) {
        const length = Number(selectedLengths[index]);
        const stockForLength = Number(stockByLength[length] || 0);
        const baseSkuCode = `X-${categoryPrefix}-${tierPrefix}-O${shadeCode}-S${structureCode}-${dateStr}-${String(
          index + 1
        ).padStart(2, '0')}`;

        let finalSkuCode = baseSkuCode;
        let counter = 1;
        while (true) {
          const existing = await prisma.sku.findUnique({ where: { sku: finalSkuCode } });
          if (!existing) break;
          counter += 1;
          finalSkuCode = `${baseSkuCode}-${String(counter).padStart(2, '0')}`;
        }

        const pricePerGram = pricePerGramByLength[length];
        const pricePerGramEur = Number((pricePerGram * czkToEur).toFixed(3));

        const manualName = typeof name === 'string' && name.trim().length > 0 ? name.trim() : null;
        const generatedNameForLength = generateVlasyXName(
          length,
          vlasyXCategory,
          vlasyXTier,
          shadeNumber,
          gramsForName
        );
        const finalName = manualName ?? generatedNameForLength;

        const sku = await prisma.sku.create({
          data: {
            sku: finalSkuCode,
            name: finalName,
            shade: String(shadeNumber),
            shadeName,
            shadeHex,
            shadeRangeStart: shadeRange.start,
            shadeRangeEnd: shadeRange.end,
            lengthCm: length,
            structure,
            saleMode: 'BULK_G',
            pricePerGramCzk: pricePerGram,
            pricePerGramEur,
            minOrderG,
            stepG,
            availableGrams: stockForLength,
            inStock: stockForLength > 0,
            customerCategory: customerCategory as any,
            isListed: Boolean(isListed),
            listingPriority: isListed ? listingPriority ?? 5 : null,
          } as any,
        });

        if (stockForLength > 0) {
          await prisma.stockMovement.create({
            data: {
              skuId: sku.id,
              type: 'IN',
              grams: stockForLength,
              note: 'Počáteční zásoba z konfigurátoru',
            },
          });
        }

        createdSkus.push({ id: sku.id, sku: finalSkuCode, length });
      }

      return NextResponse.json(
        { success: true, message: `Vytvořeno ${createdSkus.length} SKU`, skus: createdSkus },
        { status: 201 }
      );
    }

    if (productType === 'vlasyy') {
      if (!lengthCm || !weightGrams) {
        return NextResponse.json(
          { error: 'Vyplň délku i gramáž' },
          { status: 400 }
        );
      }

      const numericLength = Number(lengthCm);
      const numericWeight = Number(weightGrams);
      const categoryForPricing = ceskeVlasy ? 'ceske' : categoryKey;
      const shadeRange = getShadeRange(categoryForPricing, shadeNumber);

      let pricePerGram = 0;
      if (usePriceMatrix) {
        const entry = await getMatrixEntry(categoryForPricing, 'platinum', numericLength, shadeRange);
        if (!entry) {
          return NextResponse.json(
            { error: 'Chybí cena v ceníku pro tuto kombinaci' },
            { status: 400 }
          );
        }
        pricePerGram = Number(entry.pricePerGramCzk);
      } else if (manualPriceCzk && numericWeight > 0) {
        pricePerGram = Number(manualPriceCzk) / numericWeight;
      }

      if (!pricePerGram || pricePerGram <= 0) {
        return NextResponse.json(
          { error: 'Nelze určit cenu. Vyplň ruční cenu nebo doplň ceník.' },
          { status: 400 }
        );
      }

      const totalPriceCzk = usePriceMatrix
        ? Number((pricePerGram * numericWeight).toFixed(2))
        : Number(manualPriceCzk);

      if (!totalPriceCzk || totalPriceCzk <= 0) {
        return NextResponse.json(
          { error: 'Neplatná výsledná cena' },
          { status: 400 }
        );
      }

      const pricePerGramEur = Number((pricePerGram * czkToEur).toFixed(3));
      const priceEurTotal = Number((totalPriceCzk * czkToEur).toFixed(2));

      const platinumName = formatPlatinumName(numericLength, shadeNumber, numericWeight);
      const categoryPrefix = categoryKey === 'nebarvene' ? 'NB' : 'BR';
      const structureCode = structureCodeMap[structure] || 'R';
      const shadeCode = String(shadeNumber).padStart(2, '0');
      const baseSkuCode = `Y-${categoryPrefix}-PLAT-O${shadeCode}-S${structureCode}-L${numericLength}cm-W${numericWeight}g`;

      let finalSkuCode = baseSkuCode;
      let counter = 1;
      while (true) {
        const existing = await prisma.sku.findUnique({ where: { sku: finalSkuCode } });
        if (!existing) break;
        counter += 1;
        finalSkuCode = `${baseSkuCode}-${String(counter).padStart(2, '0')}`;
      }

      const sku = await prisma.sku.create({
        data: {
          sku: finalSkuCode,
          name: platinumName || name,
          shade: String(shadeNumber),
          shadeName,
          shadeHex,
          shadeRangeStart: shadeRange.start,
          shadeRangeEnd: shadeRange.end,
          structure,
          lengthCm: numericLength,
          customerCategory: 'PLATINUM_EDITION',
          saleMode: 'PIECE_BY_WEIGHT',
          pricePerGramCzk: pricePerGram,
          pricePerGramEur,
          priceCzkTotal: totalPriceCzk,
          priceEurTotal,
          weightTotalG: numericWeight,
          weightGrams: numericWeight,
          inStock: Boolean(inStock),
          isListed: Boolean(isListed),
          listingPriority: isListed ? listingPriority ?? 5 : null,
        } as any,
      });

      return NextResponse.json(
        { success: true, message: 'SKU vytvořen', skuId: sku.id, skuCode: finalSkuCode },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { error: 'Nepodporovaný typ produktu' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error creating SKU from wizard:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'SKU kód již existuje' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Chyba při vytváření SKU', details: error.message },
      { status: 500 }
    );
  }
}