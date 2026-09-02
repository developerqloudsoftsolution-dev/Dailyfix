import whatsappService from '../utils/whatsappService.js';
import WhatsAppSettings from '../models/WhatsAppSettings.js';

export const getStatus = async (req, res) => {
  try {
    const result = await whatsappService.getStatus();
    const config = await whatsappService.getConfig();

    return res.json({
      success: true,
      serviceOnline: result.ok,
      status: result.data?.status || 'disconnected',
      user: result.data?.user || null,
      phone: result.data?.phone || (result.data?.user?.id ? result.data.user.id.split(':')[0] : null),
      apiUrl: config.apiUrl,
      adminPhone: config.adminPhone,
      enabled: config.enabled,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getQrCode = async (req, res) => {
  try {
    // Security check: Must be authenticated admin
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized access to WhatsApp QR' });
    }

    const result = await whatsappService.getQrCode();
    if (result.ok && result.data?.qr) {
      return res.json({
        success: true,
        qr: result.data.qr,
        expiresIn: result.data.expiresIn || 60,
      });
    }

    return res.status(result.status || 404).json({
      success: false,
      message: result.message || 'QR code not available. Initializing connection...',
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const connectWhatsApp = async (req, res) => {
  try {
    const result = await whatsappService.connect(true);
    return res.json({
      success: result.ok,
      message: result.data?.message || 'Connection initiated',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutWhatsApp = async (req, res) => {
  try {
    const result = await whatsappService.logout();
    return res.json({
      success: true,
      message: result.data?.message || 'Logged out from WhatsApp session',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const DEFAULT_WHATSAPP_API_URL = 'https://dailyfix-whatsapp-backend.onrender.com';

export const getSettings = async (req, res) => {
  try {
    let settings = await WhatsAppSettings.findOne();
    const defaultApiKey = process.env.WHATSAPP_API_KEY || 'local-development-key';
    const defaultApiUrl = process.env.WHATSAPP_API_URL || DEFAULT_WHATSAPP_API_URL;

    if (!settings) {
      settings = await WhatsAppSettings.create({
        adminPhones: [],
        adminPhone: '',
        notifyConnectedNumber: true,
        apiUrl: defaultApiUrl,
        apiKey: defaultApiKey,
        enabled: true,
      });
    } else {
      let needsSave = false;
      if (!settings.apiUrl || settings.apiUrl === 'http://127.0.0.1:3000' || settings.apiUrl === 'http://localhost:3000') {
        settings.apiUrl = defaultApiUrl;
        needsSave = true;
      }
      if (!settings.apiKey || settings.apiKey.trim() === '') {
        settings.apiKey = defaultApiKey;
        needsSave = true;
      }
      if (needsSave) await settings.save();
    }

    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const {
      adminPhones,
      adminPhone,
      notifyConnectedNumber,
      apiUrl,
      apiKey,
      enabled,
      notifyCustomerOnOrder,
      notifyAdminOnOrder,
      notifyCustomerOnShipment,
      notifyAdminOnProductAdd,
      notifyAdminOnContact,
    } = req.body;

    let settings = await WhatsAppSettings.findOne();
    if (!settings) {
      settings = new WhatsAppSettings();
    }

    if (adminPhones !== undefined && Array.isArray(adminPhones)) {
      settings.adminPhones = adminPhones
        .filter((item) => item && (item.phone || typeof item === 'string'))
        .map((item) => ({
          phone: typeof item === 'string' ? item.trim() : item.phone.trim(),
          label: (typeof item === 'object' && item.label) ? item.label.trim() : 'Admin',
        }));
    }

    if (adminPhone !== undefined) settings.adminPhone = adminPhone.trim();
    if (notifyConnectedNumber !== undefined) settings.notifyConnectedNumber = Boolean(notifyConnectedNumber);
    if (apiUrl !== undefined) {
      const cleanUrl = apiUrl.trim();
      settings.apiUrl = cleanUrl || process.env.WHATSAPP_API_URL || DEFAULT_WHATSAPP_API_URL;
    }
    if (apiKey !== undefined) settings.apiKey = apiKey.trim();
    if (enabled !== undefined) settings.enabled = Boolean(enabled);
    if (notifyCustomerOnOrder !== undefined) settings.notifyCustomerOnOrder = Boolean(notifyCustomerOnOrder);
    if (notifyAdminOnOrder !== undefined) settings.notifyAdminOnOrder = Boolean(notifyAdminOnOrder);
    if (notifyCustomerOnShipment !== undefined) settings.notifyCustomerOnShipment = Boolean(notifyCustomerOnShipment);
    if (notifyAdminOnProductAdd !== undefined) settings.notifyAdminOnProductAdd = Boolean(notifyAdminOnProductAdd);
    if (notifyAdminOnContact !== undefined) settings.notifyAdminOnContact = Boolean(notifyAdminOnContact);

    await settings.save();

    return res.json({
      success: true,
      message: 'WhatsApp notification settings saved successfully',
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendTestMessage = async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Recipient phone number is required',
      });
    }

    const text = message?.trim() || '🧪 *Test Message from DailyFix Care WhatsApp Bot*\n\nYour WhatsApp API connection is working perfectly! ✅';
    const result = await whatsappService.sendTextMessage(phone, text);

    if (result.ok) {
      return res.json({
        success: true,
        message: `Test message sent successfully to ${phone}!`,
        data: result.data,
      });
    }

    return res.status(400).json({
      success: false,
      message: result.message || 'Failed to send test message. Check if WhatsApp is connected.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
