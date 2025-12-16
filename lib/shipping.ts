/**
 * Shipping utilities for tracking URLs and carrier information
 */

export type Carrier =
  | 'zasilkovna'
  | 'gls'
  | 'dpd'
  | 'ceska_posta'
  | 'fedex'
  | 'ups'
  | 'other';

export const CARRIER_NAMES: Record<Carrier, string> = {
  zasilkovna: 'Zásilkovna',
  gls: 'GLS',
  dpd: 'DPD',
  ceska_posta: 'Česká pošta',
  fedex: 'FedEx',
  ups: 'UPS',
  other: 'Jiný dopravce',
};

/**
 * Generate tracking URL for a specific carrier
 */
export function getTrackingUrl(carrier: string | null | undefined, trackingNumber: string): string {
  if (!carrier) {
    // Default to Česká pošta if carrier is unknown
    return `https://www.postaonline.cz/trackandtrace?parcelNumbers=${encodeURIComponent(trackingNumber)}`;
  }

  const normalizedCarrier = carrier.toLowerCase();

  const trackingUrls: Record<string, string> = {
    zasilkovna: `https://tracking.packeta.com/cs/?id=${encodeURIComponent(trackingNumber)}`,
    gls: `https://gls-group.eu/CZ/cs/sledovani-zasilek?match=${encodeURIComponent(trackingNumber)}`,
    dpd: `https://tracking.dpd.de/parcelstatus?query=${encodeURIComponent(trackingNumber)}`,
    ceska_posta: `https://www.postaonline.cz/trackandtrace?parcelNumbers=${encodeURIComponent(trackingNumber)}`,
    ups: `https://www.ups.com/track?trackingNumber=${encodeURIComponent(trackingNumber)}`,
    fedex: `https://www.fedex.com/fedextrack/?tracknumbers=${encodeURIComponent(trackingNumber)}`,
  };

  return trackingUrls[normalizedCarrier] || trackingUrls.ceska_posta;
}

/**
 * Get carrier display name
 */
export function getCarrierName(carrier: string | null | undefined): string {
  if (!carrier) return 'Česká pošta';

  const normalizedCarrier = carrier.toLowerCase() as Carrier;
  return CARRIER_NAMES[normalizedCarrier] || 'Jiný dopravce';
}

/**
 * Validate carrier code
 */
export function isValidCarrier(carrier: string): carrier is Carrier {
  const validCarriers = ['zasilkovna', 'gls', 'dpd', 'ceska_posta', 'fedex', 'ups', 'other'];
  return validCarriers.includes(carrier.toLowerCase());
}

/**
 * Get tracking format hint for admin UI
 */
export function getTrackingFormatHint(carrier: string | null | undefined): string {
  if (!carrier) return 'Zadejte sledovací číslo';

  const hints: Record<string, string> = {
    zasilkovna: 'Formát: Z123456789',
    gls: 'Formát: číselný kód (např. 12345678901)',
    dpd: 'Formát: alfanumerický kód',
    ceska_posta: 'Formát: DR123456789CZ nebo RR123456789CZ',
    ups: 'Formát: 1Z999AA10123456784',
    fedex: 'Formát: 12 nebo 14 číslic',
  };

  return hints[carrier.toLowerCase()] || 'Zadejte sledovací číslo';
}
