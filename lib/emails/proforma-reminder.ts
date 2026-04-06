import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendProformaReminder({
  customerEmail,
  customerName,
  invoiceNumber,
  amount,
  dueDate,
  invoiceUrl,
}: {
  customerEmail: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: Date;
  invoiceUrl: string;
}) {
  try {
    await resend.emails.send({
      from: 'Mùza Hair <info@mail.muzahair.cz>',
      replyTo: 'muzahaircz@gmail.com',
      to: customerEmail,
      subject: `Připomínka platby — Proforma ${invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #722F37; color: white; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 22px;">💎 Mùza Hair</h1>
          </div>
          <div style="background: #fff; padding: 24px; border: 1px solid #e5e5e5; border-top: none;">
            <p>Dobrý den, ${customerName},</p>
            <p>připomínáme, že proforma faktura <strong>${invoiceNumber}</strong> na částku <strong>${amount.toLocaleString('cs-CZ')} Kč</strong> je splatná <strong>zítra (${dueDate.toLocaleDateString('cs-CZ')})</strong>.</p>
            <p>Pokud nebude uhrazena včas, bude objednávka automaticky zrušena a zboží uvolněno.</p>
            <p style="text-align: center; margin: 24px 0;">
              <a href="${invoiceUrl}" style="display: inline-block; padding: 14px 32px; background: #722F37; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                📄 Zobrazit proformu a zaplatit
              </a>
            </p>
            <p style="color: #666; font-size: 13px;">Číslo účtu: 321286011/0300 (ČSOB)<br/>Variabilní symbol: číslo faktury</p>
            <p>Děkujeme,<br/><strong>Mùza Hair</strong></p>
          </div>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Proforma reminder email error:', error);
    return false;
  }
}
