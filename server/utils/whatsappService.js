import axios from 'axios';
import WhatsAppSettings from '../models/WhatsAppSettings.js';

class WhatsAppService {
  async getConfig() {
    let settings = null;
    try {
      settings = await WhatsAppSettings.findOne();
    } catch (err) {
      // Database might be initializing
    }

    const apiUrl =
      settings?.apiUrl ||
      process.env.WHATSAPP_API_URL ||
      'https://dailyfix-whatsapp-backend.onrender.com';

    const apiKey =
      settings?.apiKey ||
      process.env.WHATSAPP_API_KEY ||
      'local-development-key';

    const adminPhone =
      settings?.adminPhone ||
      process.env.WHATSAPP_ADMIN_PHONE ||
      '';

    return {
      apiUrl: apiUrl.replace(/\/+$/, ''),
      apiKey,
      adminPhone: this.formatPhone(adminPhone),
      enabled: settings ? settings.enabled : true,
      settings: settings || {
        adminPhones: [],
        notifyConnectedNumber: true,
        notifyCustomerOnOrder: true,
        notifyAdminOnOrder: true,
        notifyCustomerOnShipment: true,
        notifyAdminOnProductAdd: true,
        notifyAdminOnContact: true,
      },
    };
  }

  formatPhone(phone) {
    if (!phone) return '';
    let cleaned = String(phone).replace(/\D/g, '');
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    return cleaned;
  }

  async request(endpoint, method = 'GET', data = null, timeout = 10000) {
    const { apiUrl, apiKey } = await this.getConfig();
    try {
      const headers = {};
      if (apiKey && apiKey.trim() && apiKey !== 'local-development-key') {
        headers['x-api-key'] = apiKey.trim();
      }

      const axiosConfig = {
        url: `${apiUrl}/api${endpoint}`,
        method,
        headers,
        timeout,
      };

      if (data && method !== 'GET') {
        headers['Content-Type'] = 'application/json';
        axiosConfig.data = data;
      }

      const response = await axios(axiosConfig);
      return { ok: true, data: response.data };
    } catch (error) {
      // If 401, retry once without x-api-key header
      if (error.response?.status === 401) {
        try {
          const retryRes = await axios({
            url: `${apiUrl}/api${endpoint}`,
            method,
            headers: data && method !== 'GET' ? { 'Content-Type': 'application/json' } : {},
            data: data && method !== 'GET' ? data : undefined,
            timeout,
          });
          return { ok: true, data: retryRes.data };
        } catch (retryErr) {
          // Fall through
        }
      }

      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'WhatsApp API service unavailable';
      return {
        ok: false,
        status: error.response?.status || 503,
        message: errMsg,
        data: error.response?.data || null,
      };
    }
  }

  async getStatus() {
    return await this.request('/status');
  }

  async getQrCode() {
    for (let attempt = 1; attempt <= 4; attempt++) {
      const res = await this.request('/qr', 'GET', null, 15000);
      if (res.ok && res.data?.qr) {
        return res;
      }
      if (attempt < 4) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    }
    return await this.request('/qr', 'GET', null, 15000);
  }

  async connect(force = true) {
    return await this.request('/connect', 'POST', { force });
  }

  async logout() {
    return await this.request('/logout', 'POST');
  }

  async sendTextMessage(phone, message) {
    const formatted = this.formatPhone(phone);
    if (!formatted || !message) {
      return { ok: false, message: 'Invalid phone or empty message' };
    }

    return await this.request('/messages/send', 'POST', {
      phone: formatted,
      message,
    });
  }

  // ==========================================
  // ADMIN RECIPIENTS BROADCAST HELPER
  // ==========================================

  async getAdminRecipients() {
    const config = await this.getConfig();
    const recipients = new Set();

    // 1. Add configured admin numbers list
    if (config.settings?.adminPhones && Array.isArray(config.settings.adminPhones)) {
      for (const item of config.settings.adminPhones) {
        const ph = typeof item === 'string' ? item : item?.phone;
        const formatted = this.formatPhone(ph);
        if (formatted) recipients.add(formatted);
      }
    }

    // 2. Legacy fallback
    if (config.adminPhone) {
      recipients.add(config.adminPhone);
    }

    // 3. Automatically add the linked WhatsApp number if notifyConnectedNumber is enabled
    if (config.settings?.notifyConnectedNumber !== false) {
      try {
        const status = await this.getStatus();
        const connectedId = status.data?.user?.id || status.data?.phone;
        if (connectedId) {
          const raw = String(connectedId).split(':')[0].replace(/\D/g, '');
          const formatted = this.formatPhone(raw);
          if (formatted) recipients.add(formatted);
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    return Array.from(recipients);
  }

  async sendAdminAlert(message) {
    const recipients = await this.getAdminRecipients();
    if (!recipients || recipients.length === 0) {
      console.log('[WhatsApp] No admin numbers configured for alert.');
      return;
    }

    console.log(`[WhatsApp] Broadcasting alert to ${recipients.length} admin number(s):`, recipients.join(', '));
    for (const phone of recipients) {
      this.sendTextMessage(phone, message).catch((err) => {
        console.warn(`[WhatsApp] Failed alert to ${phone}:`, err.message);
      });
    }
  }

  // ==========================================
  // NOTIFICATION TEMPLATES & TRIGGERS
  // ==========================================

  // 1. Notify Customer on New Order
  async notifyNewOrderCustomer(order) {
    try {
      const config = await this.getConfig();
      if (!config.enabled || !config.settings.notifyCustomerOnOrder) return;

      const customerPhone = order.customer?.phone;
      if (!customerPhone) return;

      const customerName = `${order.customer?.firstName || 'Customer'} ${order.customer?.lastName || ''}`.trim();
      const itemsList = order.items && order.items.length > 0
        ? order.items.map((i) => `• ${i.name} (Qty: ${i.quantity}) - ₹${i.price * i.quantity}`).join('\n')
        : '• DailyFix Natural Beard Colour';

      const message = `🎉 *Order Confirmation - DailyFix Care*

Hello *${customerName}*,

Thank you for choosing DailyFix! Your order has been placed successfully.

📦 *Order ID:* ${order.orderId}
💰 *Total Amount:* ₹${order.total || order.totalAmount || 0}
💳 *Payment Mode:* ${order.paymentMethod || 'COD'}

🛒 *Items Ordered:*
${itemsList}

📍 *Delivery Address:*
${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.pincode || ''}

We are preparing your package and will send you live tracking details as soon as it ships!

🌐 *Track Your Order:* https://dailyfixcare.com/track-order?orderId=${order.orderId}
💬 *Support:* Reply to this message for any assistance.`;

      const res = await this.sendTextMessage(customerPhone, message);
      console.log(`[WhatsApp] Customer order notification sent for ${order.orderId}:`, res.ok ? 'SUCCESS' : res.message);
      return res;
    } catch (err) {
      console.warn('[WhatsApp] Failed to send customer order notification:', err.message);
    }
  }

  // 2. Notify Admin on New Order (Multicast)
  async notifyNewOrderAdmin(order) {
    try {
      const config = await this.getConfig();
      if (!config.enabled || !config.settings.notifyAdminOnOrder) return;

      const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim();
      const itemsList = order.items && order.items.length > 0
        ? order.items.map((i) => `• ${i.name} (x${i.quantity})`).join('\n')
        : '• 1 x Beard Colour';

      const message = `🚨 *NEW ORDER RECEIVED - DailyFix*

🛍️ *Order ID:* ${order.orderId}
👤 *Customer:* ${customerName} (${order.customer?.phone || 'No phone'})
💵 *Amount:* ₹${order.total || order.totalAmount || 0} [${order.paymentMethod || 'COD'}]
📍 *City:* ${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}

📦 *Products:*
${itemsList}

🔗 *View in Admin:* https://dailyfixcare.com/admin/orders`;

      await this.sendAdminAlert(message);
    } catch (err) {
      console.warn('[WhatsApp] Failed to send admin order alert:', err.message);
    }
  }

  // 3. Notify Customer on Shipment & Tracking
  async notifyShipmentTrackCustomer(order) {
    try {
      const config = await this.getConfig();
      if (!config.enabled || !config.settings.notifyCustomerOnShipment) return;

      const customerPhone = order.customer?.phone;
      if (!customerPhone) return;

      const waybill = order.delhivery?.waybill || 'Assigned';
      const customerName = `${order.customer?.firstName || 'Customer'}`.trim();

      const message = `🚚 *Your DailyFix Order has Shipped!*

Hello *${customerName}*,

Great news! Your package for Order *#${order.orderId}* is on its way.

📦 *Courier Partner:* Delhivery Express
🏷️ *AWB / Tracking Number:* ${waybill}

🔎 *Live Courier Tracking:*
https://www.delhivery.com/track/package/${waybill}

You can also track on our website:
https://dailyfixcare.com/track-order?orderId=${order.orderId}

Thank you for shopping with DailyFix!`;

      const res = await this.sendTextMessage(customerPhone, message);
      console.log(`[WhatsApp] Shipment tracking notification sent for ${order.orderId}:`, res.ok ? 'SUCCESS' : res.message);
      return res;
    } catch (err) {
      console.warn('[WhatsApp] Failed to send shipment notification:', err.message);
    }
  }

  // 4. Notify Admin on Product Added (Multicast)
  async notifyProductAddedAdmin(product) {
    try {
      const config = await this.getConfig();
      if (!config.enabled || !config.settings.notifyAdminOnProductAdd) return;

      const message = `✨ *Product Created / Updated - DailyFix*

🏷️ *Product:* ${product.name || 'New Product'}
💰 *Price:* ₹${product.price || 0} (MRP: ₹${product.mrp || product.price || 0})
📦 *Stock:* ${product.stock || 0} units
📂 *Category:* ${product.category || 'General'}

🔗 *View Catalog:* https://dailyfixcare.com/admin/products`;

      await this.sendAdminAlert(message);
    } catch (err) {
      console.warn('[WhatsApp] Failed to send product alert:', err.message);
    }
  }

  // 5. Notify Admin on Contact Form Submission (Multicast)
  async notifyContactInquiryAdmin(contactData) {
    try {
      const config = await this.getConfig();
      if (!config.enabled || !config.settings.notifyAdminOnContact) return;

      const message = `📩 *New Contact Form Message - DailyFix*

👤 *Name:* ${contactData.name || 'Visitor'}
📞 *Phone:* ${contactData.phone || 'N/A'}
✉️ *Email:* ${contactData.email || 'N/A'}
📝 *Subject:* ${contactData.subject || 'Website Inquiry'}

💬 *Message:*
"${contactData.message || 'No message content'}"`;

      await this.sendAdminAlert(message);
    } catch (err) {
      console.warn('[WhatsApp] Failed to send contact inquiry alert:', err.message);
    }
  }

  // 6. Notify Customer on Status Change (Confirmed, Shipped, Delivered, Cancelled, etc.)
  async notifyOrderStatusCustomer(order, newStatus) {
    try {
      const config = await this.getConfig();
      if (!config.enabled) return;

      const customerPhone = order.customer?.phone || order.customerPhone;
      if (!customerPhone) return;

      const customerName = `${order.customer?.firstName || order.customerName || 'Customer'}`.trim();
      const orderId = order.orderId;
      const waybill = order.delhivery?.waybill;

      let title = `📦 *Order Update - DailyFix Care*`;
      let statusDesc = `Your order *#${orderId}* status has been updated to *${newStatus}*.`;

      switch (newStatus) {
        case 'Confirmed':
          title = `✅ *Order Confirmed - DailyFix Care*`;
          statusDesc = `Great news! Your order *#${orderId}* has been confirmed by our team and is scheduled for packing.`;
          break;
        case 'Processing':
          title = `⚙️ *Order Processing - DailyFix Care*`;
          statusDesc = `Your order *#${orderId}* is currently being packed and prepared for courier dispatch.`;
          break;
        case 'Shipped':
          title = `🚚 *Order Shipped - DailyFix Care*`;
          statusDesc = `Your package for order *#${orderId}* is on its way via Delhivery Express!${
            waybill ? `\n🏷️ *AWB:* ${waybill}\n🔎 *Track Live:* https://www.delhivery.com/track/package/${waybill}` : ''
          }`;
          break;
        case 'Out for Delivery':
          title = `🛵 *Out for Delivery - DailyFix Care*`;
          statusDesc = `Your order *#${orderId}* is out for delivery today. Please keep your phone handy!`;
          break;
        case 'Delivered':
          title = `🎉 *Order Delivered - DailyFix Care*`;
          statusDesc = `Your order *#${orderId}* has been successfully delivered! Thank you for choosing DailyFix. Enjoy your natural beard colour!`;
          break;
        case 'Cancelled':
          title = `❌ *Order Cancelled - DailyFix Care*`;
          statusDesc = `Your order *#${orderId}* has been cancelled.${
            waybill ? ' Associated courier delivery has also been stopped.' : ''
          }\nIf you did not request this cancellation, please reply to this message directly.`;
          break;
        default:
          title = `ℹ️ *Order Status Update - DailyFix Care*`;
          statusDesc = `Your order *#${orderId}* is now marked as *${newStatus}*.`;
          break;
      }

      const message = `${title}

Hello *${customerName}*,

${statusDesc}

🌐 *Track on Website:* https://dailyfixcare.com/track-order?orderId=${orderId}
💬 *Need Help?* Reply to this message anytime.`;

      const res = await this.sendTextMessage(customerPhone, message);
      console.log(`[WhatsApp] Status update notification sent to customer for ${orderId} (${newStatus}):`, res.ok ? 'SUCCESS' : res.message);
      return res;
    } catch (err) {
      console.warn('[WhatsApp] Failed to send customer status notification:', err.message);
    }
  }

  // 7. Notify Admin on Status Change (Multicast)
  async notifyOrderStatusAdmin(order, newStatus, previousStatus) {
    try {
      const config = await this.getConfig();
      if (!config.enabled) return;

      const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Customer';
      const customerPhone = order.customer?.phone || 'No phone';

      let statusEmoji = '🔄';
      if (newStatus === 'Cancelled') statusEmoji = '❌';
      if (newStatus === 'Delivered') statusEmoji = '🎉';
      if (newStatus === 'Shipped') statusEmoji = '🚚';
      if (newStatus === 'Confirmed') statusEmoji = '✅';

      const message = `${statusEmoji} *ORDER STATUS CHANGED - DailyFix*

📦 *Order ID:* ${order.orderId}
👤 *Customer:* ${customerName} (${customerPhone})
📊 *New Status:* *${newStatus}* ${previousStatus ? `(was: ${previousStatus})` : ''}
💵 *Amount:* ₹${order.total || order.totalAmount || 0}
${order.delhivery?.waybill ? `🚚 *Delhivery AWB:* ${order.delhivery.waybill}\n` : ''}
🔗 *View in Admin:* https://dailyfixcare.com/admin/orders`;

      await this.sendAdminAlert(message);
    } catch (err) {
      console.warn('[WhatsApp] Failed to send admin status alert:', err.message);
    }
  }
}

export default new WhatsAppService();
