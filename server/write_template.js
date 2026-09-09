
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const content = `
/**
 * Customer Order Confirmation Email Template
 */
const customerOrderTemplate = (data) => {
  const {
    orderId = "N/A",
    customerName = "Valued Customer",
    orderDate = new Date().toLocaleDateString(),
    items = [],
    shippingAddress = { address: "", city: "", state: "", pincode: "" },
    paymentMethod = "N/A",
    paymentStatus = "N/A",
    grandTotal = 0,
    estimatedDelivery = "N/A",
  } = data || {};

  return \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Order Confirmation - \${orderId}</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f3f4f6;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;">
        <tr>
          <td align="center" style="padding:24px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#fff;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
              
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:32px;border-radius:16px 16px 0 0;">
                  <h1 style="margin:0;color:#fff;font-size:28px;font-weight:700;">DailyfixCare</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:40px 32px 24px;">
                  <h2 style="margin:0 0 12px;font-size:24px;color:#111827;">Thank You for Your Order!</h2>
                  <p style="margin:0;color:#4b5563;">Hi \${customerName}, your order is being processed!</p>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 24px;">
                  <h3 style="margin:0 0 16px;font-size:18px;color:#111827;font-weight:700;">Ordered Products</h3>
                  \${items.map(item => \`
                    <div style="margin-bottom:12px;padding:16px;background-color:#f9fafb;border-radius:12px;">
                      <p style="margin:0;color:#111827;font-weight:600;font-size:16px;">\${item.name}</p>
                      <p style="margin:4px 0 0;color:#6b7280;font-size:14px;">Qty: \${item.quantity} - ₹\${(item.total || 0).toFixed(2)}</p>
                    </div>
                  \`).join('')}
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 24px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="padding:16px 0 0;border-top:2px solid #e5e7eb;color:#111827;font-weight:700;font-size:18px;">Grand Total</td>
                      <td style="padding:16px 0 0;border-top:2px solid #e5e7eb;text-align:right;color:#2563eb;font-weight:700;font-size:20px;">₹\${(grandTotal || 0).toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <tr>
                <td style="padding:0 32px 24px;">
                  <h3 style="margin:0 0 16px;font-size:18px;color:#111827;font-weight:700;">Shipping Address</h3>
                  <div style="background-color:#f9fafb;border-radius:12px;padding:20px;">
                    <p style="margin:0;color:#111827;font-weight:600;font-size:16px;">\${customerName}</p>
                    <p style="margin:4px 0 0;color:#4b5563;">
                      \${shippingAddress.address}<br>
                      \${shippingAddress.city}, \${shippingAddress.state} - \${shippingAddress.pincode}
                    </p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  \`;
};

export default customerOrderTemplate;
`;

fs.writeFileSync(path.join(__dirname, 'templates', 'customerOrderTemplate.js'), content.trim());
console.log('Template written successfully!');
