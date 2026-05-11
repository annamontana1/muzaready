/**
 * Balikobot API Integration
 *
 * Documentation: https://balikobot.docs.apiary.io/
 * API v2: https://apiv2.balikobot.cz
 *
 * Auth: HTTP Basic — BALIKOBOT_API_USER / BALIKOBOT_API_KEY
 * Supported shippers: dpd, ppl, zasilkovna, gls, ups, fedex, ...
 */

const BALIKOBOT_API_URL = 'https://apiv2.balikobot.cz';

export type BalikobotShipper = 'dpd' | 'ppl' | 'gls' | 'ups';

interface BalikobotPackage {
  eid: string;            // External ID — your order number
  rec_name: string;       // Recipient full name
  rec_street: string;     // Recipient street + number
  rec_city: string;       // Recipient city
  rec_zip: string;        // Recipient ZIP
  rec_country: string;    // Recipient country (CZ, SK, ...)
  rec_email?: string;     // Recipient email
  rec_phone?: string;     // Recipient phone
  weight?: number;        // Weight in kg
  price?: number;         // Order value (for insurance)
  vs?: string;            // Variable symbol (for COD)
  cod_price?: number;     // COD amount (0 = prepaid)
  cod_currency?: string;  // COD currency
  note?: string;          // Note for courier
  service_type?: string;  // Service type (depends on shipper)
  // DPD specific
  del_exworks_id?: string;
}

interface BalikobotAddResponse {
  status: number;
  packages: Array<{
    carrier_id: string;       // Carrier tracking number
    package_id: number;       // Balikobot internal ID
    label_url: string;        // PDF label URL
    carrier_id_swap?: string;
    pieces_count?: number;
    status: number;
    eid: string;
  }>;
}

interface BalikobotOrderResponse {
  status: number;
  order_id: string;
  file_url: string;        // Handover protocol PDF
  label_url: string;       // All labels PDF
  labels_url?: string;
}

export interface BalikobotResult {
  success: boolean;
  carrierId?: string;       // Tracking number
  packageId?: number;       // Balikobot package ID
  labelUrl?: string;        // PDF label URL
  error?: string;
}

function getCredentials() {
  const user = process.env.BALIKOBOT_API_USER;
  const key = process.env.BALIKOBOT_API_KEY;
  if (!user || !key) return null;
  return Buffer.from(`${user}:${key}`).toString('base64');
}

async function balikobotRequest(
  path: string,
  body: object
): Promise<any> {
  const credentials = getCredentials();
  if (!credentials) {
    throw new Error('Balikobot API není nakonfigurováno (chybí BALIKOBOT_API_USER nebo BALIKOBOT_API_KEY)');
  }

  const response = await fetch(`${BALIKOBOT_API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const msg = data?.message || data?.errors?.[0] || `HTTP ${response.status}`;
    throw new Error(`Balikobot API chyba: ${msg}`);
  }

  return data;
}

/**
 * Add a package to Balikobot and get label
 */
export async function addPackage(
  shipper: BalikobotShipper,
  pkg: BalikobotPackage
): Promise<BalikobotResult> {
  try {
    // Service type defaults per shipper
    const serviceType = pkg.service_type || (shipper === 'dpd' ? '2' : shipper === 'ppl' ? 'NP' : '1');

    const data: BalikobotAddResponse = await balikobotRequest(
      `/${shipper}/add`,
      {
        packages: [
          {
            ...pkg,
            service_type: serviceType,
            cod_price: pkg.cod_price ?? 0,
            cod_currency: pkg.cod_currency || 'CZK',
            weight: pkg.weight || 0.5,
            price: pkg.price || 0,
          },
        ],
      }
    );

    if (data.status === 200 && data.packages?.[0]) {
      const pkg = data.packages[0];
      return {
        success: true,
        carrierId: pkg.carrier_id,
        packageId: pkg.package_id,
        labelUrl: pkg.label_url,
      };
    }

    return { success: false, error: 'Nepodařilo se přidat balíček do Balikobotu' };
  } catch (error) {
    console.error('Balikobot addPackage error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Chyba při komunikaci s Balikobotem',
    };
  }
}

/**
 * Order pickup for shipper (generates handover protocol)
 */
export async function orderPickup(
  shipper: BalikobotShipper,
  packageIds: number[]
): Promise<{ success: boolean; fileUrl?: string; labelUrl?: string; error?: string }> {
  try {
    const data: BalikobotOrderResponse = await balikobotRequest(
      `/${shipper}/order`,
      { package_ids: packageIds }
    );

    if (data.status === 200) {
      return {
        success: true,
        fileUrl: data.file_url,
        labelUrl: data.label_url || data.labels_url,
      };
    }

    return { success: false, error: 'Chyba při objednání svozu' };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Chyba při objednání svozu',
    };
  }
}

/**
 * Get tracking URL for carrier
 */
export function getTrackingUrl(shipper: BalikobotShipper, carrierId: string): string {
  switch (shipper) {
    case 'dpd':
      return `https://tracking.dpd.cz/parcelstatus?query=${carrierId}&lang=cs_CZ`;
    case 'ppl':
      return `https://www.ppl.cz/vyhledat-zasilku?shipmentId=${carrierId}`;
    case 'gls':
      return `https://gls-group.eu/track/${carrierId}`;
    default:
      return '';
  }
}
