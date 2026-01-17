/**
 * Zásilkovna (Packeta) API Integration
 *
 * Documentation: https://docs.packetery.com/
 * API endpoint: https://www.zasilkovna.cz/api/rest
 */

const ZASILKOVNA_API_URL = 'https://www.zasilkovna.cz/api/rest';

interface PacketAttributes {
  // Required fields
  number: string;           // Internal order ID
  name: string;             // Customer first name
  surname: string;          // Customer last name
  email: string;            // Customer email
  phone: string;            // Customer phone (for SMS notifications)
  addressId: number;        // Pickup point ID from widget
  value: number;            // Order value in CZK (for COD, otherwise informational)

  // Optional fields
  weight?: number;          // Weight in kg
  eshop?: string;           // E-shop identifier
  cod?: number;             // Cash on delivery amount (0 if prepaid)
  currency?: string;        // Currency code (CZK)

  // Address for home delivery (if not using pickup point)
  street?: string;
  houseNumber?: string;
  city?: string;
  zip?: string;

  // Additional
  note?: string;            // Note for courier
  senderName?: string;      // Sender name on label
}

interface ZasilkovnaResponse {
  status: 'ok' | 'fault';
  result?: {
    id: number;              // Zásilkovna packet ID
    barcode: string;         // Tracking barcode
    barcodeText: string;     // Human readable barcode
  };
  fault?: {
    faultString: string;
    detail?: {
      attributes?: Record<string, { fault: string }>;
    };
  };
}

interface PacketInfo {
  id: number;
  barcode: string;
  status: string;
  statusText: string;
  trackingUrl: string;
}

/**
 * Create a packet (shipment) in Zásilkovna
 * This will trigger automatic email/SMS notifications to the customer
 */
export async function createPacket(
  orderNumber: string,
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  },
  pickupPointId: number,
  orderValue: number,
  weight: number = 0.5,
  cod: number = 0, // 0 for prepaid orders
  note?: string
): Promise<{ success: boolean; packetId?: number; barcode?: string; error?: string }> {
  const apiKey = process.env.NEXT_PUBLIC_PACKETA_API_KEY;
  const apiPassword = process.env.PACKETA_API_PASSWORD;

  if (!apiKey || !apiPassword) {
    console.error('Zásilkovna API credentials not configured');
    return { success: false, error: 'Zásilkovna API není nakonfigurováno' };
  }

  // Format phone number (remove spaces, ensure +420 prefix)
  let phone = customer.phone.replace(/\s/g, '');
  if (!phone.startsWith('+')) {
    phone = phone.startsWith('420') ? `+${phone}` : `+420${phone}`;
  }

  const packetData: PacketAttributes = {
    number: orderNumber,
    name: customer.firstName,
    surname: customer.lastName,
    email: customer.email,
    phone: phone,
    addressId: pickupPointId,
    value: Math.round(orderValue),
    weight: weight,
    cod: cod,
    currency: 'CZK',
    eshop: 'Mùza Hair',
    senderName: 'Mùza Hair',
    note: note || undefined,
  };

  try {
    // Zásilkovna uses XML API
    const xmlBody = buildCreatePacketXml(apiPassword, packetData);

    const response = await fetch(`${ZASILKOVNA_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xmlBody,
    });

    const responseText = await response.text();
    const result = parseZasilkovnaResponse(responseText);

    if (result.status === 'ok' && result.result) {
      console.log(`✅ Zásilkovna packet created: ${result.result.barcode}`);
      return {
        success: true,
        packetId: result.result.id,
        barcode: result.result.barcode,
      };
    } else {
      const errorMessage = result.fault?.faultString || 'Neznámá chyba';
      console.error('Zásilkovna API error:', errorMessage, result.fault?.detail);
      return {
        success: false,
        error: errorMessage,
      };
    }
  } catch (error) {
    console.error('Zásilkovna API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Chyba při komunikaci se Zásilkovnou',
    };
  }
}

/**
 * Get packet info/status from Zásilkovna
 */
export async function getPacketStatus(packetId: number): Promise<PacketInfo | null> {
  const apiPassword = process.env.PACKETA_API_PASSWORD;

  if (!apiPassword) {
    console.error('Zásilkovna API password not configured');
    return null;
  }

  try {
    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<packetStatus>
  <apiPassword>${apiPassword}</apiPassword>
  <packetId>${packetId}</packetId>
</packetStatus>`;

    const response = await fetch(`${ZASILKOVNA_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    // Parse status from response
    const statusMatch = responseText.match(/<status>(\d+)<\/status>/);
    const statusTextMatch = responseText.match(/<statusText>([^<]+)<\/statusText>/);
    const barcodeMatch = responseText.match(/<barcode>([^<]+)<\/barcode>/);

    if (statusMatch) {
      return {
        id: packetId,
        barcode: barcodeMatch?.[1] || '',
        status: statusMatch[1],
        statusText: statusTextMatch?.[1] || 'Neznámý stav',
        trackingUrl: `https://tracking.packeta.com/cs/?id=${barcodeMatch?.[1] || packetId}`,
      };
    }

    return null;
  } catch (error) {
    console.error('Failed to get packet status:', error);
    return null;
  }
}

/**
 * Get PDF label for printing
 */
export async function getPacketLabel(packetId: number): Promise<Buffer | null> {
  const apiPassword = process.env.PACKETA_API_PASSWORD;

  if (!apiPassword) {
    return null;
  }

  try {
    const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
<packetLabelPdf>
  <apiPassword>${apiPassword}</apiPassword>
  <packetId>${packetId}</packetId>
  <format>A7 on A4</format>
  <offset>0</offset>
</packetLabelPdf>`;

    const response = await fetch(`${ZASILKOVNA_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: xmlBody,
    });

    const responseText = await response.text();

    // Extract base64 PDF from response
    const pdfMatch = responseText.match(/<pdf>([^<]+)<\/pdf>/);
    if (pdfMatch) {
      return Buffer.from(pdfMatch[1], 'base64');
    }

    return null;
  } catch (error) {
    console.error('Failed to get packet label:', error);
    return null;
  }
}

/**
 * Build XML for createPacket API call
 */
function buildCreatePacketXml(apiPassword: string, packet: PacketAttributes): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<createPacket>
  <apiPassword>${escapeXml(apiPassword)}</apiPassword>
  <packetAttributes>
    <number>${escapeXml(packet.number)}</number>
    <name>${escapeXml(packet.name)}</name>
    <surname>${escapeXml(packet.surname)}</surname>
    <email>${escapeXml(packet.email)}</email>
    <phone>${escapeXml(packet.phone)}</phone>
    <addressId>${packet.addressId}</addressId>
    <value>${packet.value}</value>
    <weight>${packet.weight || 0.5}</weight>
    <cod>${packet.cod || 0}</cod>
    <currency>${packet.currency || 'CZK'}</currency>
    <eshop>${escapeXml(packet.eshop || '')}</eshop>
    ${packet.note ? `<note>${escapeXml(packet.note)}</note>` : ''}
    ${packet.senderName ? `<senderName>${escapeXml(packet.senderName)}</senderName>` : ''}
  </packetAttributes>
</createPacket>`;
}

/**
 * Parse XML response from Zásilkovna
 */
function parseZasilkovnaResponse(xml: string): ZasilkovnaResponse {
  // Check for fault
  if (xml.includes('<fault>') || xml.includes('<faultString>')) {
    const faultMatch = xml.match(/<faultString>([^<]+)<\/faultString>/);
    return {
      status: 'fault',
      fault: {
        faultString: faultMatch?.[1] || 'Neznámá chyba',
      },
    };
  }

  // Parse success response
  const idMatch = xml.match(/<id>(\d+)<\/id>/);
  const barcodeMatch = xml.match(/<barcode>([^<]+)<\/barcode>/);
  const barcodeTextMatch = xml.match(/<barcodeText>([^<]+)<\/barcodeText>/);

  if (idMatch && barcodeMatch) {
    return {
      status: 'ok',
      result: {
        id: parseInt(idMatch[1], 10),
        barcode: barcodeMatch[1],
        barcodeText: barcodeTextMatch?.[1] || barcodeMatch[1],
      },
    };
  }

  return {
    status: 'fault',
    fault: {
      faultString: 'Nepodařilo se parsovat odpověď ze Zásilkovny',
    },
  };
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Zásilkovna status codes
 */
export const ZASILKOVNA_STATUSES: Record<string, string> = {
  '1': 'Balík přijat',
  '2': 'Balík na cestě',
  '3': 'Připraven k vyzvednutí',
  '4': 'Doručen',
  '5': 'Vrácen odesílateli',
  '6': 'Zrušen',
  '7': 'Nedoručen',
};
