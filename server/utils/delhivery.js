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
      waybill: String(waybill).trim(),
      cancellation: "true",
      cancellation_reason: "Order cancelled by store admin",
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/api/p/edit`,
        payload,
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
          err.response?.data?.remark ||
          err.response?.data?.message ||
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
      const shipment = tracking?.ShipmentData?.[0]?.Shipment;
      const statusObj = shipment?.Status;
      const courierStatus =
        statusObj?.Status ||
        statusObj?.StatusType ||
        statusObj?.StatusLocation ||
        shipment?.StatusType ||
        order.delhivery.currentStatus;

      order.delhivery.currentStatus = courierStatus;
      if (statusObj?.StatusLocation) {
        order.delhivery.currentLocation = statusObj.StatusLocation;
      }
      order.delhivery.lastSynced = new Date();

      const rawScans = shipment?.Scans || [];
      if (Array.isArray(rawScans) && rawScans.length > 0) {
        order.delhivery.trackingHistory = rawScans.map((scan) => ({
          status: scan.ScanDetail?.Scan || scan.Scan || "Scanned",
          location: scan.ScanDetail?.ScannedLocation || scan.location || "In Transit",
          remarks: scan.ScanDetail?.Instructions || scan.remarks || "",
          scanDate: scan.ScanDetail?.ScanDateTime
            ? new Date(scan.ScanDetail.ScanDateTime)
            : new Date(),
        }));
      }

      // Automatically map courier status (including cancellation instructions) to main order status
      const latestScan = rawScans[rawScans.length - 1] || rawScans[0];
      const mappedStatus = mapDelhiveryStatus(statusObj || courierStatus, latestScan);

      if (mappedStatus && order.status !== mappedStatus) {
        console.log(`🔄 [Delhivery Sync] Order ${order.orderId} status auto-updated: ${order.status} -> ${mappedStatus} (Courier: ${courierStatus}, Instructions: ${statusObj?.Instructions || "none"})`);
        order.status = mappedStatus;
      }

      await order.save();
      return order;
    } catch (err) {
      console.error("Delhivery tracking sync failed:", err.message);
      return null;
    }
  },
};

export function mapDelhiveryStatus(statusObjOrString, scanDetailOrType) {
  let courierStatus = "";
  let instructions = "";
  let statusCode = "";
  let statusType = "";

  if (typeof statusObjOrString === "object" && statusObjOrString !== null) {
    courierStatus = statusObjOrString.Status || statusObjOrString.status || "";
    instructions = statusObjOrString.Instructions || statusObjOrString.instructions || "";
    statusCode = statusObjOrString.StatusCode || statusObjOrString.statusCode || "";
    statusType = statusObjOrString.StatusType || statusObjOrString.statusType || "";
  } else {
    courierStatus = String(statusObjOrString || "");
  }

  if (typeof scanDetailOrType === "object" && scanDetailOrType !== null) {
    const detail = scanDetailOrType.ScanDetail || scanDetailOrType;
    instructions = instructions || detail.Instructions || detail.instructions || "";
    statusCode = statusCode || detail.StatusCode || detail.statusCode || "";
    statusType = statusType || detail.ScanType || detail.scanType || detail.Scan || "";
  } else if (typeof scanDetailOrType === "string") {
    statusType = statusType || scanDetailOrType;
  }

  const s = courierStatus.trim().toLowerCase();
  const instr = instructions.trim().toLowerCase();
  const code = statusCode.trim().toUpperCase();
  const type = statusType.trim().toUpperCase();

  // 1. Check for Cancellation / RTO
  if (
    instr.includes("cancel") ||
    instr.includes("seller cancelled") ||
    instr.includes("buyer cancelled") ||
    instr.includes("cancelled by client") ||
    instr.includes("not received from client") ||
    s.includes("cancel") ||
    s.includes("rto") ||
    s.includes("returned") ||
    s.includes("return to origin") ||
    code === "DTUP-210" ||
    code.startsWith("RT") ||
    code.startsWith("CAN") ||
    type === "RT" ||
    type === "CN"
  ) {
    return "Cancelled";
  }

  // 2. Check for Delivered
  if (
    s.includes("delivered") ||
    instr.includes("delivered") ||
    type === "DL" ||
    code.startsWith("DL")
  ) {
    return "Delivered";
  }

  // 3. Check for Out for Delivery
  if (
    s.includes("out for delivery") ||
    instr.includes("out for delivery") ||
    type === "OFD" ||
    code === "OFD"
  ) {
    return "Out for Delivery";
  }

  // 4. Check for In Transit / Shipped
  if (
    s.includes("in transit") ||
    s.includes("in-transit") ||
    s.includes("dispatched") ||
    s.includes("manifest") ||
    s.includes("reached") ||
    s.includes("pickup") ||
    s.includes("picked") ||
    type === "UD" ||
    type === "IT"
  ) {
    return "Shipped";
  }

  return null;
}

export default delhiveryService;



