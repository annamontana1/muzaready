import { NextResponse } from 'next/server';

export async function GET() {
  const resendKey = process.env.RESEND_API_KEY;
  const fakturoidId = process.env.FAKTUROID_CLIENT_ID;
  const fakturoidSecret = process.env.FAKTUROID_CLIENT_SECRET;

  const result: any = {
    resend_configured: !!resendKey,
    resend_key_prefix: resendKey ? resendKey.substring(0, 8) + '...' : 'NOT SET',
    fakturoid_configured: !!(fakturoidId && fakturoidSecret),
    fakturoid_id_prefix: fakturoidId ? fakturoidId.substring(0, 8) + '...' : 'NOT SET',
  };

  // Try sending a test email if Resend is configured
  if (resendKey) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(resendKey);
      const testResult = await resend.emails.send({
        from: 'Mùza Hair <faktury@mail.muzahair.cz>',
        to: 'muzahaircz@gmail.com',
        subject: 'Test email - Mùza Hair',
        html: '<h1>Test email funguje!</h1><p>Tento email potvrzuje že Resend je správně nastavený.</p>',
      });
      result.test_email = testResult;
    } catch (err: any) {
      result.test_email_error = err.message;
    }
  }

  return NextResponse.json(result);
}
