/**
 * Default BULK product configuration
 * Used for catalog thumbnails and PDP pre-filling
 */

export const BULK_DEFAULT_GRAMS = 100;
export const BULK_DEFAULT_LENGTH_CM = 45;

/**
 * Fallback length priority order
 * When preferred length (45cm) is not available with enough grams,
 * try these lengths in order
 */
export const BULK_LENGTH_FALLBACK_ORDER = [45, 40, 50, 55, 60, 65, 70, 75, 80];
