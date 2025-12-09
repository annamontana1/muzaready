import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export const sendOrderConfirmationEmail = async (
  email: string,
  orderId: string,
  items: any[],
  total: number
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured; skipping email send for sendOrderConfirmationEmail');
    return;
  }

  try {
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.variant}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('cs-CZ')} Kč</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${(item.price * item.quantity).toLocaleString('cs-CZ')} Kč</td>
          </tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B1538; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .order-id { background-color: #f0f0f0; padding: 10px; border-radius: 3px; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background-color: #f0f0f0; padding: 10px; text-align: left; font-weight: bold; }
            .total-row { background-color: #f0f0f0; font-weight: bold; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Potvrzení objednávky</h1>
            </div>
            <div class="content">
              <p>Dobrý den,</p>
              <p>Děkujeme vám za vaši objednávku v obchodě <strong>Múza Hair</strong>.</p>

              <div class="order-id">
                <strong>Číslo objednávky:</strong> ${orderId}
              </div>

              <h3>Vámi objednaná zboží:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Produkt</th>
                    <th>Počet</th>
                    <th>Cena</th>
                    <th>Celkem</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr class="total-row">
                    <td colspan="3" style="padding: 10px; text-align: right;">CELKEM:</td>
                    <td style="padding: 10px; text-align: right;">${total.toLocaleString('cs-CZ')} Kč</td>
                  </tr>
                </tbody>
              </table>

              <p>Vaše objednávka čeká na zaplacení. Brzy vás přesměrujeme na platební bránu.</p>

              <p><strong>Pokud máte jakékoliv dotazy, kontaktujte nás prosím.</strong></p>

              <div class="footer">
                <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    if (!resend) {
      
      return;
    }

    if (!resend) {
      
      return;
    }

    if (!resend) {
      
      return;
    }

    if (!resend) {
      
      return;
    }

    const result = await resend.emails.send({
      from: 'objednavky@muzahair.cz',
      to: email,
      subject: `Potvrzení objednávky #${orderId.substring(0, 8)}`,
      html,
    });

    console.log('Order confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

export const sendPaymentConfirmationEmail = async (
  email: string,
  orderId: string,
  amount: number
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured; skipping email send for sendPaymentConfirmationEmail');
    return;
  }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .success-icon { font-size: 48px; margin: 20px 0; }
            .info-box { background-color: #e8f5e9; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✓</div>
              <h1>Platba byla přijata</h1>
            </div>
            <div class="content">
              <p>Dobrý den,</p>
              <p>Potvrzujeme, že vaše platba byla úspěšně zpracována.</p>

              <div class="info-box">
                <p><strong>Číslo objednávky:</strong> ${orderId.substring(0, 8)}</p>
                <p><strong>Zaplacená částka:</strong> ${amount.toLocaleString('cs-CZ')} Kč</p>
              </div>

              <p>Vaše objednávka je nyní zaplacena a připravena k odeslání. Brzy vám pošleme informace o odesílání balíčku.</p>

              <p>Děkujeme vám za vašich nákup v obchodě <strong>Múza Hair</strong>.</p>

              <div class="footer">
                <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'objednavky@muzahair.cz',
      to: email,
      subject: `Potvrzení platby #${orderId.substring(0, 8)}`,
      html,
    });

    console.log('Payment confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending payment confirmation email:', error);
    throw error;
  }
};

export const sendShippingNotificationEmail = async (
  email: string,
  orderId: string,
  trackingInfo?: string
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured; skipping email send for sendShippingNotificationEmail');
    return;
  }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .info-box { background-color: #e7f3ff; padding: 15px; border-left: 4px solid #007bff; margin: 15px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Vaše balíček je na cestě!</h1>
            </div>
            <div class="content">
              <p>Dobrý den,</p>
              <p>Vaše objednávka byla odeslána a je na cestě k vám.</p>

              <div class="info-box">
                <p><strong>Číslo objednávky:</strong> ${orderId.substring(0, 8)}</p>
                ${trackingInfo ? `<p><strong>Číslo sledování:</strong> ${trackingInfo}</p>` : ''}
              </div>

              <p>Balíček by měl k vám dorazit do několika pracovních dnů.</p>

              <p>Děkujeme za vaši trpělivost a za nákup v obchodě <strong>Múza Hair</strong>.</p>

              <div class="footer">
                <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'objednavky@muzahair.cz',
      to: email,
      subject: `Balíček je na cestě #${orderId.substring(0, 8)}`,
      html,
    });

    console.log('Shipping notification email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    throw error;
  }
};

export const sendAdminOrderNotificationEmail = async (
  orderId: string,
  customerEmail: string,
  items: any[],
  total: number
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured; skipping email send for sendAdminOrderNotificationEmail');
    return;
  }

  try {
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.variant}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('cs-CZ')} Kč</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${(item.price * item.quantity).toLocaleString('cs-CZ')} Kč</td>
          </tr>`
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #8B1538; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .order-id { background-color: #f0f0f0; padding: 10px; border-radius: 3px; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background-color: #f0f0f0; padding: 10px; text-align: left; font-weight: bold; }
            .total-row { background-color: #f0f0f0; font-weight: bold; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nová objednávka!</h1>
            </div>
            <div class="content">
              <p>Dobrý den,</p>
              <p>Přišla nová objednávka v e-shopu <strong>Múza Hair</strong>.</p>

              <div class="order-id">
                <strong>Číslo objednávky:</strong> ${orderId}<br>
                <strong>Email zákazníka:</strong> ${customerEmail}
              </div>

              <h3>Objednaná zboží:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Produkt</th>
                    <th>Počet</th>
                    <th>Cena</th>
                    <th>Celkem</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr class="total-row">
                    <td colspan="3" style="padding: 10px; text-align: right;">CELKEM:</td>
                    <td style="padding: 10px; text-align: right;">${total.toLocaleString('cs-CZ')} Kč</td>
                  </tr>
                </tbody>
              </table>

              <p><strong>Akce:</strong> Přejdi do <a href="https://muzahair.cz/admin/objednavky/${orderId}" style="color: #8B1538; text-decoration: none;">admin panelu</a> pro více informací.</p>

              <div class="footer">
                <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'objednavky@muzahair.cz',
      to: 'objednavky@muzahair.cz',
      subject: `[ADMIN] Nová objednávka #${orderId.substring(0, 8)}`,
      html,
    });

    console.log('Admin order notification email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending admin order notification email:', error);
    throw error;
  }
};

export const sendDeliveryConfirmationEmail = async (
  email: string,
  orderId: string
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured; skipping email send for sendDeliveryConfirmationEmail');
    return;
  }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .success-icon { font-size: 48px; margin: 20px 0; }
            .info-box { background-color: #e8f5e9; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">📦</div>
              <h1>Balíček byl doručen!</h1>
            </div>
            <div class="content">
              <p>Dobrý den,</p>
              <p>Vaše objednávka byla úspěšně doručena.</p>

              <div class="info-box">
                <p><strong>Číslo objednávky:</strong> ${orderId.substring(0, 8)}</p>
              </div>

              <p>Doufáme, že jste s vaším nákupem spokojeni. Pokud máte jakékoliv dotazy nebo připomínky, neváhejte nás kontaktovat.</p>

              <p>Děkujeme za váš nákup v obchodě <strong>Múza Hair</strong> a těšíme se na další spolupráci!</p>

              <div class="footer">
                <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'objednavky@muzahair.cz',
      to: email,
      subject: `Balíček doručen #${orderId.substring(0, 8)}`,
      html,
    });

    console.log('Delivery confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending delivery confirmation email:', error);
    throw error;
  }
};

export const sendOrderCancellationEmail = async (
  email: string,
  orderId: string,
  reason?: string
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured; skipping email send for sendOrderCancellationEmail');
    return;
  }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .info-box { background-color: #ffe6e6; padding: 15px; border-left: 4px solid #dc3545; margin: 15px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Objednávka byla zrušena</h1>
            </div>
            <div class="content">
              <p>Dobrý den,</p>
              <p>Bohužel jsme museli zrušit vaši objednávku.</p>

              <div class="info-box">
                <p><strong>Číslo objednávky:</strong> ${orderId.substring(0, 8)}</p>
                ${reason ? `<p><strong>Důvod:</strong> ${reason}</p>` : ''}
              </div>

              <p>Pokud byla platba již provedena, peníze budou vráceny na váš účet do 5-7 pracovních dnů.</p>

              <p>Pokud máte jakékoliv dotazy, kontaktujte nás prosím na <strong>info@muzahair.cz</strong>.</p>

              <p>Omlouváme se za případné nepříjemnosti.</p>

              <div class="footer">
                <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'objednavky@muzahair.cz',
      to: email,
      subject: `Objednávka zrušena #${orderId.substring(0, 8)}`,
      html,
    });

    console.log('Order cancellation email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending order cancellation email:', error);
    throw error;
  }
};

export const sendPaymentReminderEmail = async (
  email: string,
  orderId: string,
  total: number,
  daysSinceOrder: number
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured; skipping email send for sendPaymentReminderEmail');
    return;
  }

  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ffc107; color: #333; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; }
            .info-box { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0; }
            .button { display: inline-block; padding: 12px 24px; background-color: #8B1538; color: white; text-decoration: none; border-radius: 4px; margin: 15px 0; }
            .footer { color: #666; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Připomínka platby</h1>
            </div>
            <div class="content">
              <p>Dobrý den,</p>
              <p>Vaše objednávka čeká na zaplacení již ${daysSinceOrder} ${daysSinceOrder === 1 ? 'den' : 'dnů'}.</p>

              <div class="info-box">
                <p><strong>Číslo objednávky:</strong> ${orderId.substring(0, 8)}</p>
                <p><strong>Částka k úhradě:</strong> ${total.toLocaleString('cs-CZ')} Kč</p>
              </div>

              <p>Pro dokončení objednávky prosím dokončete platbu. Pokud jste již zaplatili, tento email můžete ignorovat.</p>

              <p style="text-align: center;">
                <a href="https://muzahair.cz/sledovani-objednavky" class="button">Sledovat objednávku</a>
              </p>

              <p>Pokud máte jakékoliv dotazy, kontaktujte nás prosím na <strong>info@muzahair.cz</strong>.</p>

              <div class="footer">
                <p>Tento email byl odeslán automaticky. Prosím neodpovídejte na něj.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'objednavky@muzahair.cz',
      to: email,
      subject: `Připomínka platby #${orderId.substring(0, 8)}`,
      html,
    });

    console.log('Payment reminder email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending payment reminder email:', error);
    throw error;
  }
};

/**
 * Send invoice email with PDF attachment
 */
export const sendInvoiceEmail = async (
  email: string,
  invoiceNumber: string,
  pdfBase64: string
) => {
  if (!resend) {
    console.warn('RESEND_API_KEY not configured; skipping invoice email');
    return;
  }

  try {
    // Extract base64 data from data URI
    const base64Data = pdfBase64.split(',')[1];

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3a2020 0%, #6b4545 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 30px; background: #3a2020; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            h1 { margin: 0; font-size: 24px; }
            .invoice-number { font-size: 18px; font-weight: bold; color: #3a2020; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💎 Mùza Hair</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Faktura za vaši objednávku</p>
            </div>

            <div class="content">
              <h2 style="color: #3a2020;">Dobrý den,</h2>

              <p>děkujeme za vaši objednávku. V příloze najdete <strong>daňový doklad - fakturu</strong>.</p>

              <div class="invoice-number">
                Faktura č. ${invoiceNumber}
              </div>

              <p>Faktura je přiložena jako PDF soubor. Můžete si ji stáhnout a vytisknout pro své účely.</p>

              <p><strong>Důležité informace:</strong></p>
              <ul>
                <li>Faktura slouží jako daňový doklad</li>
                <li>Prosím uschovejte si ji pro případné reklamace</li>
                <li>V případě dotazů nás kontaktujte na info@muzahair.cz</li>
              </ul>

              <p style="margin-top: 30px;">Děkujeme za vaši důvěru a těšíme se na další spolupráci!</p>

              <p style="margin-top: 20px;">
                S pozdravem,<br>
                <strong>Tým Mùza Hair</strong>
              </p>
            </div>

            <div class="footer">
              <p>
                <strong>Mùza Hair s.r.o.</strong><br>
                Revoluční 8, Praha<br>
                Tel: +420 728 722 880 | Email: info@muzahair.cz<br>
                <a href="https://muzahair.cz" style="color: #3a2020;">www.muzahair.cz</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'faktury@muzahair.cz',
      to: email,
      subject: `Faktura ${invoiceNumber} - Mùza Hair`,
      html,
      attachments: [
        {
          filename: `faktura_${invoiceNumber}.pdf`,
          content: base64Data,
        },
      ],
    });

    console.log('Invoice email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
};
