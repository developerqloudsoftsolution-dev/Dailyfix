/**
 * Customer Order Confirmation Email Template
 */
const customerOrderTemplate = (order) => {
  const orderId = order.orderId || "N/A";
  const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || "Valued Customer";
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  const items = order.items || [];
  const shippingAddress = order.shippingAddress || { address: "", city: "", state: "", pincode: "", phone: "" };
  const paymentMethod = order.paymentMethod || "N/A";
  const paymentStatus = order.paymentStatus || "N/A";
  const grandTotal = order.total || 0;
  const estimatedDelivery = order.delhivery?.estimatedDelivery || "N/A";

  // Extract first item or build items list
  const itemsList = items.map(item => {
    const itemTotal = (item.price || 0) * (item.quantity || 0);
    return `
      <tr>
        <td style="
          padding: 10px 0;
          color: #333333;
          font-size: 14px;
          width: 60%;
          vertical-align: top;
        ">
          ${item.name}
        </td>
        <td align="center" style="
          padding: 10px 0;
          color: #666666;
          font-size: 14px;
          width: 20%;
        ">
          x${item.quantity}
        </td>
        <td align="right" style="
          padding: 10px 0;
          color: #111827;
          font-weight: bold;
          font-size: 14px;
          width: 20%;
        ">
          ₹${itemTotal.toFixed(2)}
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
  <title>Order Confirmation - Dailyfix</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f4f6f8;
  font-family: Arial, Helvetica, sans-serif;
  color: #333333;
">

  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 30px 15px;">

        <!-- Main Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 650px;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          "
        >

          <!-- Header with Logo -->
          <tr>
            <td style="
              background-color: #111827;
              padding: 28px 30px;
              text-align: center;
            ">
              <!-- Logo -->
              <h1 style="
                margin:0;
                color:#ffffff;
                font-size:28px;
                font-weight:bold;
                letter-spacing:1px;
              ">
                DailyfixCare
              </h1>

              <p style="
                margin: 8px 0 0;
                color: #d1d5db;
                font-size: 14px;
              ">
                Order Confirmation
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 35px 30px;">

              <p style="
                margin: 0 0 18px;
                font-size: 16px;
                color: #333333;
              ">
                Hi <strong>${customerName}</strong>,
              </p>

              <h2 style="
                margin: 0 0 12px;
                color: #111827;
                font-size: 24px;
              ">
                Thank You for Your Order! 🎉
              </h2>

              <p style="
                margin: 0 0 28px;
                color: #555555;
                font-size: 15px;
                line-height: 1.6;
              ">
                Your order has been placed successfully and is being processed.
                We'll ship your items soon!
              </p>

              <!-- Order Summary -->
              <h3 style="
                margin: 0 0 15px;
                color: #111827;
                font-size: 18px;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 10px;
              ">
                Order Summary
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <!-- Table Headers -->
                <tr>
                  <td style="
                    padding: 10px 0;
                    color: #666666;
                    font-size: 13px;
                    font-weight: bold;
                    width: 60%;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 8px;
                  ">
                    Product
                  </td>
                  <td align="center" style="
                    padding: 10px 0;
                    color: #666666;
                    font-size: 13px;
                    font-weight: bold;
                    width: 20%;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 8px;
                  ">
                    Quantity
                  </td>
                  <td align="right" style="
                    padding: 10px 0;
                    color: #666666;
                    font-size: 13px;
                    font-weight: bold;
                    width: 20%;
                    border-bottom: 1px solid #e5e7eb;
                    padding-bottom: 8px;
                  ">
                    Price
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 10px 0;
                    color: #666666;
                    font-size: 14px;
                  ">
                    Order ID
                  </td>

                  <td align="right" style="
                    padding: 10px 0;
                    color: #111827;
                    font-weight: bold;
                    font-size: 14px;
                  " colspan="2">
                    #${orderId}
                  </td>
                </tr>

                <!-- Items List -->
                ${itemsList}

                <tr>
                  <td style="
                    padding: 15px 0;
                    color: #111827;
                    font-size: 16px;
                    font-weight: bold;
                    border-top: 1px solid #e5e7eb;
                  ">
                    Total Amount
                  </td>

                  <td align="right" style="
                    padding: 15px 0;
                    color: #16a34a;
                    font-size: 20px;
                    font-weight: bold;
                    border-top: 1px solid #e5e7eb;
                  " colspan="2">
                    ₹${(grandTotal || 0).toFixed(2)}
                  </td>
                </tr>

              </table>

              <!-- Delivery Information -->
              <h3 style="
                margin: 30px 0 15px;
                color: #111827;
                font-size: 18px;
                border-bottom: 1px solid #e5e7eb;
                padding-bottom: 10px;
              ">
                Delivery Information
              </h3>

              <table width="100%" cellpadding="0" cellspacing="0" border="0">

                <tr>
                  <td style="
                    padding: 8px 0;
                    color: #666666;
                    font-size: 14px;
                    vertical-align: top;
                  ">
                    Address
                  </td>

                  <td style="
                    padding: 8px 0;
                    color: #333333;
                    font-size: 14px;
                    line-height: 1.6;
                  ">
                    ${shippingAddress.address || ''}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 8px 0;
                    color: #666666;
                    font-size: 14px;
                  ">
                    City
                  </td>

                  <td style="
                    padding: 8px 0;
                    color: #333333;
                    font-size: 14px;
                  ">
                    ${shippingAddress.city || ''}, ${shippingAddress.state || ''} - ${shippingAddress.pincode || ''}
                  </td>
                </tr>

                ${shippingAddress.phone ? `
                <tr>
                  <td style="
                    padding: 8px 0;
                    color: #666666;
                    font-size: 14px;
                  ">
                    Phone
                  </td>

                  <td style="
                    padding: 8px 0;
                    color: #333333;
                    font-size: 14px;
                  ">
                    ${shippingAddress.phone}
                  </td>
                </tr>
                ` : ''}

              </table>

              <!-- Message -->
              <div style="
                margin-top: 30px;
                padding: 18px;
                background-color: #f9fafb;
                border-left: 4px solid #111827;
                border-radius: 6px;
              ">

                <p style="
                  margin: 0;
                  color: #555555;
                  font-size: 14px;
                  line-height: 1.7;
                ">
                  If you have any questions about your order, please don't
                  hesitate to contact us at
                  <a
                    href="mailto:orders@dailyfixcare.com"
                    style="color: #111827; font-weight: bold;"
                  >
                    orders@dailyfixcare.com
                  </a>.
                </p>

              </div>

              <p style="
                margin: 28px 0 0;
                color: #555555;
                font-size: 15px;
                line-height: 1.6;
              ">
                We'll send you an update as soon as your order ships!
              </p>

              <p style="
                margin: 25px 0 0;
                color: #333333;
                font-size: 15px;
                line-height: 1.6;
              ">
                Warm regards,<br />
                <strong>The Dailyfix Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              background-color: #f9fafb;
              padding: 25px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            ">

              <p style="
                margin: 0 0 10px;
                color: #777777;
                font-size: 12px;
                line-height: 1.6;
              ">
                You're receiving this email because you placed an order on Dailyfix.
              </p>

              <p style="
                margin: 0 0 10px;
                color: #777777;
                font-size: 12px;
                line-height: 1.6;
              ">
                Dailyfix | WE WORK LIGHTBRIDGE, 6 FLOOR HIRANANDANI BUSINESS PARK,
                Mumbai, Maharashtra 400072
              </p>

              <p style="
                margin: 0;
                color: #999999;
                font-size: 11px;
              ">
                © 2026 Dailyfix. All rights reserved.
              </p>

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

export default customerOrderTemplate;
