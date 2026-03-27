import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import * as XLSX from 'xlsx';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST: Upload and parse Excel file
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;

    // Verify partner exists
    const partner = await prisma.b2bPartner.findUnique({ where: { id } });
    if (!partner) {
      return NextResponse.json({ error: 'Partner nenalezen' }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Soubor nebyl nahrán' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const results: { sheetName: string; itemsCount: number; shipmentId: string }[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

      if (rows.length === 0) continue;

      // Try to parse date from sheet name (e.g., "15.3.2024" or "Březen 2024")
      let shipmentDate = new Date();
      const dateMatch = sheetName.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
      if (dateMatch) {
        shipmentDate = new Date(
          parseInt(dateMatch[3]),
          parseInt(dateMatch[2]) - 1,
          parseInt(dateMatch[1])
        );
      }

      // Parse items from rows — flexible column matching
      const items: {
        druh: string;
        barva: string;
        delkaCm: number;
        gramaz: number;
        cenaPerGram: number;
        celkem: number;
        stav: string;
      }[] = [];

      for (const row of rows) {
        // Try to find columns by various Czech names
        const druh = findColumn(row, ['druh', 'typ', 'type', 'kategorie']) || 'Středoevropské';
        const barva = findColumn(row, ['barva', 'odstín', 'odstin', 'shade', 'color']) || '';
        const delka = parseNum(findColumn(row, ['délka', 'delka', 'cm', 'length']));
        const gramaz = parseNum(findColumn(row, ['gramáž', 'gramaz', 'gramy', 'g', 'váha', 'vaha', 'weight']));
        const cenaPerGram = parseNum(findColumn(row, ['cena/g', 'cena/gram', 'kč/g', 'kc/g', 'cena za gram', 'price/g']));
        const celkem = parseNum(findColumn(row, ['celkem', 'cena celkem', 'total', 'kč', 'kc', 'cena']));
        const stav = normalizeStav(findColumn(row, ['stav', 'status', 'state']));

        // Skip rows without meaningful data
        if (gramaz <= 0 && celkem <= 0) continue;

        items.push({
          druh: String(druh),
          barva: String(barva),
          delkaCm: delka,
          gramaz,
          cenaPerGram: cenaPerGram || (gramaz > 0 ? celkem / gramaz : 0),
          celkem: celkem || gramaz * cenaPerGram,
          stav,
        });
      }

      if (items.length === 0) continue;

      // Create shipment with items
      const shipment = await prisma.b2bShipment.create({
        data: {
          partnerId: id,
          date: shipmentDate,
          notes: `Import z Excelu: ${sheetName}`,
          items: {
            create: items,
          },
        },
      });

      results.push({
        sheetName,
        itemsCount: items.length,
        shipmentId: shipment.id,
      });
    }

    return NextResponse.json({
      message: `Importováno ${results.length} zásilek`,
      shipments: results,
    });
  } catch (error) {
    console.error('B2B import error:', error);
    return NextResponse.json({ error: 'Chyba při importu Excelu' }, { status: 500 });
  }
}

// Helper: Find a column value by trying multiple possible column names
function findColumn(row: Record<string, unknown>, possibleNames: string[]): string {
  for (const name of possibleNames) {
    // Try exact match (case-insensitive)
    for (const key of Object.keys(row)) {
      if (key.toLowerCase().trim() === name.toLowerCase()) {
        return String(row[key]);
      }
    }
    // Try partial match
    for (const key of Object.keys(row)) {
      if (key.toLowerCase().trim().includes(name.toLowerCase())) {
        return String(row[key]);
      }
    }
  }
  return '';
}

// Helper: Parse a number from string
function parseNum(val: string): number {
  if (!val) return 0;
  const cleaned = String(val).replace(/[^\d.,\-]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// Helper: Normalize status values
function normalizeStav(val: string): string {
  const lower = val.toLowerCase().trim();
  if (lower.includes('prodán') || lower.includes('prodan') || lower === 'prodano') return 'prodano';
  if (lower.includes('vrác') || lower.includes('vrac') || lower === 'vraceni') return 'vraceni';
  if (lower.includes('zaplac') || lower === 'zaplaceno') return 'zaplaceno';
  return 'skladem';
}
