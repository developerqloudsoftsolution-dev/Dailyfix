import mongoose from 'mongoose';

const whatsAppSettingsSchema = new mongoose.Schema(
  {
    adminPhones: [
      {
        phone: { type: String, required: true, trim: true },
        label: { type: String, default: 'Admin', trim: true },
      }
    ],
    adminPhone: {
      type: String,
      default: '',
      trim: true,
    },
    notifyConnectedNumber: {
      type: Boolean,
      default: true,
    },
    apiUrl: {
      type: String,
      default: '',
      trim: true,
    },
    apiKey: {
      type: String,
      default: '',
      trim: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    notifyCustomerOnOrder: {
      type: Boolean,
      default: true,
    },
    notifyAdminOnOrder: {
      type: Boolean,
      default: true,
    },
    notifyCustomerOnShipment: {
      type: Boolean,
      default: true,
    },
    notifyAdminOnProductAdd: {
      type: Boolean,
      default: true,
    },
    notifyAdminOnContact: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('WhatsAppSettings', whatsAppSettingsSchema);
