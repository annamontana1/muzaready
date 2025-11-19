import { getShadeInfo } from '@/lib/shades';
import { normalizeSlug } from '@/lib/slug-normalizer';

const toNumber = (value?: number | string | null): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const formatPlatinumName = (
  lengthCm?: number | string | null,
  shade?: number | string | null,
  weightGrams?: number | string | null
): string => {
  const length = toNumber(lengthCm);
  const shadeCode = toNumber(shade);
  const weight = toNumber(weightGrams);

  if (!length || !shadeCode || !weight) return '';
  return `${length} cm · Platinum · odstín #${shadeCode} · ${weight} g`;
};

export const formatPlatinumSlug = (
  lengthCm?: number | string | null,
  shade?: number | string | null,
  weightGrams?: number | string | null
): string => {
  const length = toNumber(lengthCm);
  const shadeCode = toNumber(shade);
  const weight = toNumber(weightGrams);

  const shadeInfo = shadeCode ? getShadeInfo(shadeCode) : null;
  const shadeSlug = shadeInfo ? normalizeSlug(shadeInfo.name) : `odstin-${shadeCode ?? 0}`;
  if (!length || !shadeCode || !weight) return '';
  return `platinum-${shadeSlug}-${length}cm-${weight}g`;
};
