/**
 * Admin New Order Notification Email Template
 */
const adminOrderTemplate = (order) => {
  const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Valued Customer';
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  const grandTotal = order.total || 0;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Received: ${order.orderId}</title>
    </head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f3f4f6;">
      <!-- Email Container -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f3f4f6;">
        <tr>
          <td align="center" style="padding:24px 16px;">
            <!-- Email Card -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:640px;background-color:#ffffff;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:32px 24px;border-radius:16px 16px 0 0;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">New Order Received!</h1>
                </td>
              </tr>

              <!-- Order Info -->
              <tr>
                <td style="padding:40px 32px 24px;">
                  <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">Order #${order.orderId}</h2>
                  
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="padding:6px 0;color:#4b5563;font-size:14px;">Order Date</td>
                      <td style="padding:6px 0;text-align:right;color:#111827;font-size:14px;font-weight:600;">${orderDate}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#4b5563;font-size:14px;">Total Amount</td>
                      <td style="padding:6px 0;text-align:right;color:#059669;font-size:18px;font-weight:700;">₹${grandTotal.toFixed(2)}</td>
                    </tr>
                  </table>
                  
                  <h3 style="margin:24px 0 12px;font-size:17px;color:#111827;font-weight:700;">Customer Details</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0fdf4;border-radius:12px;padding:16px;margin-bottom:24px;">
                    <tr>
                      <td style="padding:6px 0;color:#111827;font-weight:600;font-size:15px;">${customerName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#4b5563;font-size:14px;">📧 ${order.customer?.email || ''}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#4b5563;font-size:14px;">📱 ${order.customer?.phone || ''}</td>
                    </tr>
                  </table>
                  
                  <h3 style="margin:24px 0 12px;font-size:17px;color:#111827;font-weight:700;">Shipping Address</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px;">
                    <tr>
                      <td style="padding:0;color:#111827;font-size:15px;line-height:1.6;">
                        ${order.shippingAddress?.address || ''}<br>
                        ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}
                      </td>
                    </tr>
                  </table>

                  <h3 style="margin:24px 0 12px;font-size:17px;color:#111827;font-weight:700;">Payment Details</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                    <tr>
                      <td style="padding:6px 0;color:#4b5563;font-size:14px;">Payment Method</td>
                      <td style="padding:6px 0;text-align:right;color:#111827;font-size:14px;font-weight:600;">${order.paymentMethod || ''}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;color:#4b5563;font-size:14px;">Payment Status</td>
                      <td style="padding:6px 0;text-align:right;color:${order.paymentStatus === 'Paid' ? '#059669' : '#f59e0b'};font-weight:700;font-size:14px;">${order.paymentStatus || ''}</td>
                    </tr>
                  </table>

                  <h3 style="margin:24px 0 12px;font-size:17px;color:#111827;font-weight:700;">Ordered Products</h3>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                    <tr style="background-color:#f3f4f6;">
                      <th style="text-align:left;padding:12px 16px;color:#374151;font-weight:700;font-size:13px;">Product</th>
                      <th style="text-align:center;padding:12px 8px;color:#374151;font-weight:700;font-size:13px;">Qty</th>
                      <th style="text-align:right;padding:12px 16px;color:#374151;font-weight:700;font-size:13px;">Price</th>
                    </tr>
                    ${(order.items || []).map(item => {
                      const itemTotal = (item.price || 0) * (item.quantity || 0);
                      return `
                        <tr style="border-bottom:1px solid #e5e7eb;">
                          <td style="padding:12px 16px;color:#111827;font-size:14px;">${item.name || ''}</td>
                          <td style="padding:12px 8px;text-align:center;color:#4b5563;font-size:14px;">${item.quantity || 0}</td>
                          <td style="padding:12px 16px;text-align:right;color:#111827;font-weight:600;font-size:14px;">₹${itemTotal.toFixed(2)}</td>
                        </tr>
                      `;
                    }).join('')}
                  </table>

                  <!-- View Order Button -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:32px;">
                    <tr>
                      <td align="center">
                        <a href="http://localhost:5173/admin/orders" style="display:inline-block;background:linear-gradient(135deg,#059669 0%,#047857 100%);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;box-shadow:0 4px 6px -1px rgba(5,150,105,0.3);">
                          👨‍💼 View Order in Admin
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#111827;padding:24px 32px;border-radius:0 0 16px 16px;text-align:center;">
                  <p style="margin:0;color:#6b7280;font-size:13px;">© ${new Date().getFullYear()} DailyfixCare Admin. This is an automated email.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default adminOrderTemplate;