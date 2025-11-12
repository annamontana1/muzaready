import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (
  email: string,
  orderId: string,
  items: any[],
  total: number
) => {
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
