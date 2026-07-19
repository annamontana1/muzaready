import { getSupabaseAdminClient } from './supabase';

const PREFIX = 'M';
const CODE_LENGTH = 4;

export async function generateNextShortCode(): Promise<string> {
  const { data: lastSku } = await getSupabaseAdminClient()
    .from('skus')
    .select('shortCode')
    .like('shortCode', `${PREFIX}%`)
    .not('shortCode', 'is', null)
    .order('shortCode', { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextNumber = 1;
  if (lastSku?.shortCode) {
    const numPart = lastSku.shortCode.slice(PREFIX.length);
    const parsed = parseInt(numPart, 10);
    if (!isNaN(parsed)) nextNumber = parsed + 1;
  }

  return `${PREFIX}${nextNumber.toString().padStart(CODE_LENGTH, '0')}`;
}

export function isValidShortCode(code: string): boolean {
  return new RegExp(`^${PREFIX}\\d{${CODE_LENGTH}}$`).test(code);
}

export function parseShortCode(code: string): number | null {
  if (!isValidShortCode(code)) return null;
  return parseInt(code.slice(PREFIX.length), 10);
}

export function formatShortCode(num: number): string {
  return `${PREFIX}${num.toString().padStart(CODE_LENGTH, '0')}`;
}

export async function assignMissingShortCodes(): Promise<number> {
  const supabase = getSupabaseAdminClient();

  const { data: skusWithoutCode } = await supabase
    .from('skus')
    .select('id')
    .is('shortCode', null)
    .order('createdAt', { ascending: true });

  if (!skusWithoutCode || skusWithoutCode.length === 0) return 0;

  const { data: lastSku } = await supabase
    .from('skus')
    .select('shortCode')
    .like('shortCode', `${PREFIX}%`)
    .not('shortCode', 'is', null)
    .order('shortCode', { ascending: false })
    .limit(1)
    .maybeSingle();

  let nextNumber = 1;
  if (lastSku?.shortCode) {
    const parsed = parseInt(lastSku.shortCode.slice(PREFIX.length), 10);
    if (!isNaN(parsed)) nextNumber = parsed + 1;
  }

  for (const sku of skusWithoutCode) {
    await supabase.from('skus').update({ shortCode: formatShortCode(nextNumber) }).eq('id', sku.id);
    nextNumber++;
  }

  return skusWithoutCode.length;
}
