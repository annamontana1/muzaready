/**
 * GoPay REST API helper
 *
 * Handles OAuth2 authentication and provides base URL based on environment.
 * Docs: https://doc.gopay.com/
 */

export function getGoPayBaseUrl(): string {
  const env = process.env.GOPAY_ENV || 'test';
  return env === 'production'
    ? 'https://gate.gopay.cz'
    : 'https://gw.sandbox.gopay.com';
}

/**
 * Get OAuth2 access token from GoPay.
 * Token is valid for 30 minutes but we don't cache it (called per-request).
 */
export async function getGoPayAccessToken(scope: string = 'payment-create'): Promise<string> {
  const clientId = process.env.GOPAY_CLIENT_ID;
  const clientSecret = process.env.GOPAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('GOPAY_CLIENT_ID or GOPAY_CLIENT_SECRET not configured');
  }

  const baseUrl = getGoPayBaseUrl();
  const response = await fetch(`${baseUrl}/api/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: `grant_type=client_credentials&scope=${scope}`,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GoPay OAuth2 token error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.access_token;
}
