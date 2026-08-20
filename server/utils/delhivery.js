import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverEnvPath = path.join(__dirname, "..", ".env");
const rootEnvPath = path.join(__dirname, "..", "..", ".env");

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const API_KEY = process.env.DELHIVERY_API_KEY;
const BASE_URL = process.env.DELHIVERY_BASE_URL || "https://track.delhivery.com";
const CLIENT_NAME = process.env.DELHIVERY_CLIENT_NAME;
const PICKUP_NAME = process.env.DELHIVERY_PICKUP_NAME;

const TIMEOUT = 10000;

function validateDelhiveryConfig() {
  const required = [
    "DELHIVERY_API_KEY",
    "DELHIVERY_CLIENT_NAME",
    "DELHIVERY_PICKUP_NAME",
  ];
  const missing = required.filter((v) => !process.env[v]);
  if (missing.length) {
    throw new Error(`Missing Delhivery env vars: ${missing.join(", ")}`);
  }
}

const delhiveryService = {
  async checkServiceability({ pickupPin, deliveryPin, weight, cod }) {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/pin-codes/json/?filter_codes=194103`,
        {
          params: {
            origin_pin: pickupPin,
            destination_pin: deliveryPin,
            weight: weight,
            mode: cod ? "COD" : "Prepaid",
          },
          headers: { Authorization: `Token ${API_KEY}` },
          timeout: TIMEOUT,
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Serviceability check failed"
      );
    }
  },

  async calculateShipping({ pickupPin, deliveryPin, weight }) {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/kinko/v1/invoice/charges/.json?md=E&ss=Delivered&d_pin=${pickupPin}&o_pin=${deliveryPin}&cgm=10&pt=Pre-paid`,
        {
          params: {
            origin_pin: pickupPin,
            destination_pin: deliveryPin,
            weight: weight || 500,
            mode: "Prepaid",
          },
          headers: { Authorization: `Token ${API_KEY}` },
          timeout: TIMEOUT,
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Shipping rate calculation failed"
      );
    }
  },

  buildShipmentPayload(order) {
    const paymentMode =
      order.paymentMethod === "COD" ? "COD" : "Pre-paid";
    const codAmount = paymentMode === "COD" ? Number(order.total) : 0;
    const productsDesc = order.items
      .map((i) => `${i.name} x${i.quantity}`)
      .join(", ");

    const shipment = {
      name: `${order.customer.firstName} ${order.customer.lastName}`,
      add: order.shippingAddress.address,
      pin: String(order.shippingAddress.pincode),
      city: order.shippingAddress.city,
      state: order.shippingAddress.state,
      country: order.shippingAddress.country || "India",
      phone: String(order.customer.phone),

      order: String(order.orderId),
      payment_mode: paymentMode,
      shipping_mode: "Surface",
      cod_amount: codAmount,
      products_desc: productsDesc,

      pickup_location: PICKUP_NAME,

      weight: Number(order.packageDetails?.weight || 500),
      shipment_length: Number(order.packageDetails?.length || 15),
      shipment_width: Number(order.packageDetails?.width || 10),
      shipment_height: Number(order.packageDetails?.height || 5),

      seller_name: process.env.DELHIVERY_PICKUP_NAME,
      seller_address: process.env.DELHIVERY_PICKUP_ADDRESS,
      seller_city: process.env.DELHIVERY_PICKUP_CITY,
      seller_state: process.env.DELHIVERY_PICKUP_STATE,
      seller_pin: process.env.DELHIVERY_PICKUP_PIN,
      seller_country: process.env.DELHIVERY_PICKUP_COUNTRY || "India",
      seller_phone: process.env.DELHIVERY_PICKUP_PHONE,
      seller_gstin: process.env.DELHIVERY_GST_NUMBER,

      name_consignee: `${order.customer.firstName} ${order.customer.lastName}`,
      address_consignee: order.shippingAddress.address,
      city_consignee: order.shippingAddress.city,
      state_consignee: order.shippingAddress.state,
      pin_consignee: String(order.shippingAddress.pincode),
      phone_consignee: String(order.customer.phone),
      country_consignee: order.shippingAddress.country || "India",
    };

    return {
      shipments: [shipment],
      client: CLIENT_NAME,
    };
  },

  async createShipment(payload) {
    validateDelhiveryConfig();
    const postData = `format=json&data=${encodeURIComponent(
      JSON.stringify(payload)
    )}`;
    try {
      const response = await axios.post(
        `${BASE_URL}/api/cmu/create.json`,
        postData,
        {
          headers: {
            Authorization: `Token ${API_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
          timeout: TIMEOUT,
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.rmk ||
          err.response?.data?.error ||
          err.message ||
          "Shipment creation failed"
      );
    }
  },

  extractWaybill(response) {
    return (
      response?.packages?.[0]?.waybill ||
      response?.waybill ||
      response?.packages?.[0]?.awb ||
      response?.shipments?.[0]?.packages?.[0]?.waybill ||
      ""
    );
  },

  getShipmentId(response) {
    return (
      response?.packages?.[0]?.id ||
      response?.shipments?.[0]?.id ||
      response?.reference_number ||
      ""
    );
  },

  getPickupRequestId(response) {
    return response?.packages?.[0]?.pickup_request_id || response?.prn || "";
  },

  getLabelURL(response) {
    return response?.packages?.[0]?.label_url || response?.label_url || "";
  },

  getInvoiceURL(response) {
    return (
      response?.packages?.[0]?.invoice_url || response?.invoice_url || ""
    );
  },

  getEstimatedDelivery(response) {
    const dateStr =
      response?.packages?.[0]?.etd ||
      response?.etd ||
      response?.expected_delivery_date;
    return dateStr ? new Date(dateStr) : null;
  },

  async generateShippingLabel(waybill) {
    if (!waybill) throw new Error("Waybill is required");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/p/packing_slip/${waybill}?pdf=true&pdf_size=4R`,
        {
          headers: { Authorization: `Token ${API_KEY}` },
          responseType: "arraybuffer",
          timeout: TIMEOUT,
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(err.message || "Label generation failed");
    }
  },

  async trackShipment(waybill) {
    if (!waybill) throw new Error("Waybill required");
    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/packages/json/?waybill=${waybill}`,
        {
          headers: {'Content-Type': 'application/json', Authorization: `Token ${API_KEY}`}   
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(err.message || "Shipment tracking failed");
    }
  },

  async cancelShipment(waybill) {
    if (!waybill) throw new Error("Waybill required");
    const payload = {
      waybill: waybill,
      cancellation_reason: "Order cancelled by user",
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/p/edit`,
        { ...payload, client: CLIENT_NAME },
        {
          headers: {
            Authorization: `Token ${API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: TIMEOUT,
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.rmk ||
          err.message ||
          "Shipment cancellation failed"
      );
    }
  },

  async syncTracking(order) {
    if (!order?.delhivery?.waybill) return null;
    try {
      const tracking = await delhiveryService.trackShipment(
        order.delhivery.waybill
      );
      order.delhivery.currentStatus =
        tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status ||
        order.delhivery.currentStatus;
      order.delhivery.lastSynced = new Date();
      const scans = tracking?.ShipmentData?.[0]?.Shipment?.Scans || [];
      order.delhivery.trackingHistory = scans.map((scan) => ({
        status: scan.ScanDetail.Scan,
        location: scan.ScanDetail.ScannedLocation,
        remarks: scan.ScanDetail.Instructions,
        scanDate: scan.ScanDetail.ScanDateTime
          ? new Date(scan.ScanDetail.ScanDateTime)
          : null,
      }));
      await order.save();
      return order;
    } catch (err) {
      console.error("Tracking sync failed:", err.message);
      return null;
    }
  },
};

export default delhiveryService;
