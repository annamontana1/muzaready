import { getShadeInfo } from '@/lib/shades';
import { normalizeSlug } from '@/lib/slug-normalizer';

const toNumber = (value?: number | string | null): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(parsed) ? Number(parsed) : null;
};

export type VlasyXCategory = 'nebarvene' | 'barvene';
export type VlasyXTier = 'standard' | 'luxe';

export const generateVlasyXName = (
  lengthCm: number | string | null | undefined,
  category: VlasyXCategory,
  tier: VlasyXTier,
  shade: number | string | null | undefined,
  grams: number | string | null | undefined
): string => {
  const shadeCode = toNumber(shade);
  const shadeInfo = shadeCode ? getShadeInfo(shadeCode) : null;
  const tierLabel = tier === 'standard' ? 'Standard' : 'LUXE';

  if (!shadeInfo || !shadeCode) {
    return tierLabel;
  }

  return `#${shadeCode} · ${shadeInfo.name} · ${tierLabel}`;
};

export const generateVlasyXSlug = (
  category: VlasyXCategory,
  tier: VlasyXTier,
  shade: number | string | null | undefined
): string => {
  const shadeCode = toNumber(shade);
  const shadeInfo = shadeCode ? getShadeInfo(shadeCode) : null;
  const categorySlug = category === 'nebarvene' ? 'nebarvene' : 'barvene';
  const tierSlug = tier === 'standard' ? 'standard' : 'luxe';
  const shadeSlug = shadeInfo ? normalizeSlug(shadeInfo.name) : `odstin-${shadeCode ?? 0}`;
  return normalizeSlug(`${categorySlug}-${tierSlug}-${shadeSlug}`);
};
