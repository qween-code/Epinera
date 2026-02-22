type OrderConfirmationParams = {
  orderId: string;
  totalAmount: string;
  currency: string;
  items: { name: string; quantity: number; price: string }[];
};

export function orderConfirmationTemplate({ orderId, totalAmount, currency, items }: OrderConfirmationParams): string {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1f2940; color: #e8edf5; font-size: 14px;">${item.name}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1f2940; color: #8892a8; font-size: 14px; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #1f2940; color: #00f0ff; font-size: 14px; text-align: right; font-family: monospace;">${item.price} ${currency}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background-color: #060a13; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #00f0ff, #b829ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; font-weight: 800; letter-spacing: -0.02em;">
        EPINERA
      </div>
      <div style="height: 2px; background: linear-gradient(90deg, transparent, #00f0ff, transparent); margin-top: 16px; opacity: 0.4;"></div>
    </div>

    <!-- Content -->
    <div style="background: #131a2b; border: 1px solid rgba(100, 220, 255, 0.1); border-radius: 14px; padding: 32px; margin-bottom: 24px;">
      <h1 style="color: #00f0ff; font-size: 20px; margin: 0 0 8px; font-weight: 700;">Siparis Onaylandi!</h1>
      <p style="color: #8892a8; font-size: 14px; margin: 0 0 24px;">Siparisiniz basariyla olusturuldu.</p>

      <div style="background: #0d1220; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
        <div style="font-family: monospace; font-size: 11px; color: #00f0ff; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; opacity: 0.7;">Siparis No</div>
        <div style="font-family: monospace; font-size: 14px; color: #e8edf5;">${orderId.slice(0, 8).toUpperCase()}</div>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #00f0ff; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #1f2940;">Urun</th>
            <th style="padding: 10px 16px; text-align: center; font-size: 11px; color: #00f0ff; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #1f2940;">Adet</th>
            <th style="padding: 10px 16px; text-align: right; font-size: 11px; color: #00f0ff; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #1f2940;">Fiyat</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #1f2940; text-align: right;">
        <span style="color: #8892a8; font-size: 14px;">Toplam: </span>
        <span style="color: #00f0ff; font-size: 20px; font-weight: 700; font-family: monospace;">${totalAmount} ${currency}</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center;">
      <p style="color: #3d4658; font-size: 12px; margin: 0;">Epinera Gaming Marketplace</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
