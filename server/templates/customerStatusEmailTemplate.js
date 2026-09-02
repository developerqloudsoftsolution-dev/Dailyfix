/**
 * Customer Order Status Update Email Template
 * Sends dynamic status notifications (Confirmed, Processing, Shipped, Delivered, Cancelled)
 */
const customerStatusEmailTemplate = (order, customStatus = null) => {
  const currentStatus = customStatus || order.status || "Confirmed";
  const orderId = order.orderId || "N/A";
  const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || "Valued Customer";
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN');
  const items = order.items || [];
  const shippingAddress = order.shippingAddress || { address: "", city: "", state: "", pincode: "", phone: "" };
  const paymentMethod = order.paymentMethod || "COD";
  const paymentStatus = order.paymentStatus || (paymentMethod === "COD" ? "Pending (COD)" : "Paid");
  const grandTotal = order.total || order.totalAmount || 0;

  // Courier information
  const isEkart = order.carrier === 'Ekart' || (!order.delhivery?.waybill && (order.ekart?.waybill || order.ekart?.trackingId));
  const courierName = isEkart ? 'Ekart Logistics' : 'Delhivery Express';
  const waybill = isEkart ? (order.ekart?.waybill || order.ekart?.trackingId) : order.delhivery?.waybill;
  const courierTrackingUrl = isEkart
    ? `https://ekartlogistics.com/shipmenttrack/${waybill}`
    : `https://www.delhivery.com/track/package/${waybill}`;

  // Status-specific themes
  let statusBadgeBg = "#10b981"; // default emerald
  let statusTitle = "Order Status Update";
  let statusDescription = `Your order <strong>#${orderId}</strong> status has been updated to <strong>${currentStatus}</strong>.`;

  switch (currentStatus) {
    case "Confirmed":
      statusBadgeBg = "#059669";
      statusTitle = "Order Confirmed ✅";
      statusDescription = `Great news! Your order <strong>#${orderId}</strong> has been confirmed by our team and is scheduled for packing.`;
      break;
    case "Processing":
      statusBadgeBg = "#2563eb";
      statusTitle = "Order in Processing ⚙️";
      statusDescription = `Your order <strong>#${orderId}</strong> is currently being packed with care and prepared for courier handover.`;
      break;
    case "Shipped":
      statusBadgeBg = "#7c3aed";
      statusTitle = "Your Order has Shipped! 🚚";
      statusDescription = `Your package for order <strong>#${orderId}</strong> is on its way via ${courierName}! You can track its live progress below.`;
      break;
    case "Out for Delivery":
      statusBadgeBg = "#d97706";
      statusTitle = "Out for Delivery Today! 🛵";
      statusDescription = `Your package for order <strong>#${orderId}</strong> is out for delivery today. Please keep your phone handy!`;
      break;
    case "Delivered":
      statusBadgeBg = "#16a34a";
      statusTitle = "Order Delivered Successfully! 🎉";
      statusDescription = `Your order <strong>#${orderId}</strong> has been delivered. Thank you for shopping with DailyFix! Enjoy your natural beard colour.`;
      break;
    case "Cancelled":
      statusBadgeBg = "#e11d48";
      statusTitle = "Order Cancelled ❌";
      statusDescription = `Your order <strong>#${orderId}</strong> has been cancelled. If you did not request this cancellation, please contact our support team.`;
      break;
    case "Returned":
      statusBadgeBg = "#d97706";
      statusTitle = "Order Return / Replacement 🔄";
      statusDescription = `Your return / replacement request for order <strong>#${orderId}</strong> is being processed.`;
      break;
    default:
      statusBadgeBg = "#475569";
      statusTitle = `Order Update: ${currentStatus}`;
      statusDescription = `Your order <strong>#${orderId}</strong> is currently marked as <strong>${currentStatus}</strong>.`;
      break;
  }

  // Items table rows
  const itemsListHtml = items.map(item => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    return `
      <tr>
        <td style="padding: 10px 0; color: #333333; font-size: 14px; width: 60%; vertical-align: top; border-bottom: 1px solid #f1f5f9;">
          <div style="font-weight: 600; color: #0f172a;">${item.name || 'Dailyfix Product'}</div>
          ${item.sku ? `<div style="font-size: 11px; color: #94a3b8;">SKU: ${item.sku}</div>` : ''}
        </td>
        <td align="center" style="padding: 10px 0; color: #64748b; font-size: 14px; width: 20%; border-bottom: 1px solid #f1f5f9;">
          x${item.quantity || 1}
        </td>
        <td align="right" style="padding: 10px 0; color: #0f172a; font-weight: bold; font-size: 14px; width: 20%; border-bottom: 1px solid #f1f5f9;">
          ₹${Number(itemTotal).toFixed(2)}
        </td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${statusTitle} - DailyFix</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 30px 15px;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">

          <!-- Brand Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">
                DailyFix<span style="color: #10b981;">Care</span>
              </h1>
              <div style="display: inline-block; margin-top: 12px; background-color: ${statusBadgeBg}; color: #ffffff; padding: 5px 16px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                ${currentStatus}
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 35px 30px;">
              <p style="margin: 0 0 10px; font-size: 15px; color: #64748b;">
                Hi <strong>${customerName}</strong>,
              </p>

              <h2 style="margin: 0 0 14px; color: #0f172a; font-size: 22px; font-weight: 700;">
                ${statusTitle}
              </h2>

              <p style="margin: 0 0 24px; color: #334155; font-size: 15px; line-height: 1.6;">
                ${statusDescription}
              </p>

              <!-- Live Courier Tracking Box (if shipped or AWB available) -->
              ${waybill ? `
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
                <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                  🚚 Courier & Tracking Details
                </div>
                <div style="font-size: 14px; color: #0f172a; margin-bottom: 6px;">
                  <strong>Carrier:</strong> ${courierName}
                </div>
                <div style="font-size: 14px; color: #0f172a; margin-bottom: 16px;">
                  <strong>Tracking Number (AWB):</strong> <span style="font-family: monospace; font-size: 15px; background: #e2e8f0; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${waybill}</span>
                </div>
                <div style="text-align: center;">
                  <a href="${courierTrackingUrl}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 24px; border-radius: 8px;">
                    Track on ${courierName} →
                  </a>
                </div>
              </div>
              ` : `
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 25px; text-align: center;">
                <a href="https://dailyfixcare.com/track-order?orderId=${orderId}" target="_blank" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 24px; border-radius: 8px;">
                  Track Order on Website →
                </a>
              </div>
              `}

              <!-- Order Summary Section -->
              <h3 style="margin: 25px 0 12px; color: #0f172a; font-size: 16px; font-weight: 700; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
                Order Summary (#${orderId})
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                <thead>
                  <tr>
                    <th align="left" style="padding: 8px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Product</th>
                    <th align="center" style="padding: 8px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Qty</th>
                    <th align="right" style="padding: 8px 0; color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsListHtml}
                  <tr>
                    <td colspan="2" style="padding: 14px 0 6px; font-weight: bold; font-size: 15px; color: #0f172a;">Total Amount</td>
                    <td align="right" style="padding: 14px 0 6px; font-weight: 800; font-size: 18px; color: #10b981;">₹${Number(grandTotal).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 4px 0; font-size: 12px; color: #64748b;">Payment Method</td>
                    <td align="right" style="padding: 4px 0; font-size: 12px; color: #0f172a; font-weight: 600;">${paymentMethod} (${paymentStatus})</td>
                  </tr>
                </tbody>
              </table>

              <!-- Delivery Address -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-top: 20px;">
                <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                  📍 Delivery Address
                </div>
                <div style="font-size: 13px; color: #334155; line-height: 1.5;">
                  ${shippingAddress.address || ''}<br/>
                  ${shippingAddress.city ? `${shippingAddress.city}, ` : ''}${shippingAddress.state ? `${shippingAddress.state} ` : ''}${shippingAddress.pincode || ''}
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px; font-size: 13px; color: #475569;">
                Need assistance with your order?
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                Email us at <a href="mailto:support@dailyfixcare.com" style="color: #10b981; font-weight: 600; text-decoration: none;">support@dailyfixcare.com</a> or reply directly to this email.
              </p>
              <p style="margin: 12px 0 0; font-size: 11px; color: #94a3b8;">
                © ${new Date().getFullYear()} DailyFix Care. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
};

export default customerStatusEmailTemplate;
