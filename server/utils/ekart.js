import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverEnvPath = path.join(__dirname, "..", ".env");
const rootEnvPath = path.join(__dirname, "..", "..", ".env");

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
}
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}
dotenv.config();

const CLIENT_ID = process.env.EKART_CLIENT_ID || "EKART_6a8933353d72a44ab9b54f63";
const MERCHANT_CODE = process.env.EKART_MERCHANT_CODE || CLIENT_ID;
const CLIENT_SECRET = process.env.EKART_CLIENT_SECRET || "";
const AUTH_TOKEN = process.env.EKART_AUTH_TOKEN || "";
const BASE_URL = process.env.EKART_BASE_URL || "https://app.elite.ekartlogistics.in";
const PICKUP_LOCATION_ID = process.env.EKART_PICKUP_LOCATION_ID || "pick up Location";
const PICKUP_PIN = process.env.EKART_PICKUP_PIN || process.env.DELHIVERY_PICKUP_PIN || "400072";

const TIMEOUT = 15000;

// Cache bearer token
let cachedToken = null;
let tokenExpiry = null;

// Cache registered pickup address alias
let cachedPickupAlias = null;

function validateEkartConfig() {
  if (!CLIENT_ID && !AUTH_TOKEN) {
    throw new Error("Missing Ekart configuration: EKART_CLIENT_ID is required.");
  }
}

/**
 * Fetch OAuth access_token from Ekart Elite OpenAPI spec
 * POST /integrations/v2/auth/token/{client_id}
 */
async function getAuthToken(forceRefresh = false) {
  if (!forceRefresh && cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.EKART_CLIENT_ID || CLIENT_ID || "EKART_6a8933353d72a44ab9b54f63";
  const username = process.env.EKART_USERNAME || "naimitraventurespvtltd@gmail.com";
  const password = process.env.EKART_PASSWORD || CLIENT_SECRET || "Dailyfix@2026";

  try {
    const res = await axios.post(
      `${BASE_URL}/integrations/v2/auth/token/${encodeURIComponent(clientId)}`,
      {
        username,
        password,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: TIMEOUT,
      }
    );

    if (res.data?.access_token) {
      cachedToken = res.data.access_token;
      const expiresIn = Number(res.data.expires_in) || 86400;
      tokenExpiry = Date.now() + (expiresIn - 120) * 1000;
      return cachedToken;
    }

    throw new Error(res.data?.message || "No access_token returned by Ekart OAuth server");
  } catch (err) {
    cachedToken = null;
    tokenExpiry = null;
    const errMsg = err.response?.data?.description || err.response?.data?.message || err.message;
    console.error("❌ Ekart OAuth token acquisition error:", errMsg);
    throw new Error(`Ekart Authentication Failed: ${errMsg}`);
  }
}

/**
 * Build common headers for Ekart Elite API requests
 */
async function getEkartHeaders(forceRefresh = false) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (AUTH_TOKEN && !forceRefresh) {
    headers["Authorization"] = AUTH_TOKEN.startsWith("Bearer ") ? AUTH_TOKEN : `Bearer ${AUTH_TOKEN}`;
    return headers;
  }

  const token = await getAuthToken(forceRefresh);
  if (!token || typeof token !== "string" || !token.startsWith("ey")) {
    throw new Error("Invalid or empty OAuth token received from Ekart auth server");
  }

  headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

const ekartService = {
  /**
   * Get registered pickup addresses from Ekart Elite (GET /api/v2/addresses)
   */
  async getRegisteredAddresses() {
    validateEkartConfig();
    try {
      const headers = await getEkartHeaders();
      const response = await axios.get(`${BASE_URL}/api/v2/addresses`, {
        headers,
        timeout: TIMEOUT,
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        // Token might be stale, retry with force refresh
        try {
          const freshHeaders = await getEkartHeaders(true);
          const retryRes = await axios.get(`${BASE_URL}/api/v2/addresses`, {
            headers: freshHeaders,
            timeout: TIMEOUT,
          });
          return retryRes.data;
        } catch (retryErr) {
          console.warn("Ekart getRegisteredAddresses retry error:", retryErr.response?.data || retryErr.message);
        }
      }
      console.warn("Ekart getRegisteredAddresses error:", err.response?.data || err.message);
      return [];
    }
  },

  /**
   * Resolve valid registered pickup location alias
   */
  async getPickupLocationAlias() {
    if (cachedPickupAlias) return cachedPickupAlias;
    if (process.env.EKART_PICKUP_LOCATION_ID && process.env.EKART_PICKUP_LOCATION_ID !== "The Naimitra Ventures") {
      cachedPickupAlias = process.env.EKART_PICKUP_LOCATION_ID;
      return cachedPickupAlias;
    }

    try {
      const addresses = await this.getRegisteredAddresses();
      if (Array.isArray(addresses) && addresses.length > 0 && addresses[0].alias) {
        cachedPickupAlias = addresses[0].alias;
        return cachedPickupAlias;
      }
    } catch (err) {
      // Fallback
    }

    cachedPickupAlias = PICKUP_LOCATION_ID || "pick up Location";
    return cachedPickupAlias;
  },

  /**
   * Check Pincode Serviceability (GET /api/v2/serviceability/{pincode})
   */
  async checkServiceability({ pickupPin, deliveryPin, weight, cod }) {
    validateEkartConfig();
    const pin = parseInt(String(deliveryPin || "").replace(/\D/g, ""), 10);

    if (!pin || isNaN(pin)) {
      return { serviceable: false, message: "Invalid pincode" };
    }

    try {
      const headers = await getEkartHeaders();
      const response = await axios.get(
        `${BASE_URL}/api/v2/serviceability/${pin}`,
        {
          headers,
          timeout: TIMEOUT,
        }
      );

      const data = response.data;
      return {
        serviceable: Boolean(data?.status),
        pincode: data?.pincode || pin,
        remark: data?.remark || (data?.status ? "Pincode is serviceable" : "Pincode not serviceable"),
        details: data?.details || null,
        cod: data?.details?.cod ?? true,
        maxCodAmount: data?.details?.max_cod_amount ?? 49999,
        city: data?.details?.city || "",
        state: data?.details?.state || "",
      };
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          const freshHeaders = await getEkartHeaders(true);
          const retryRes = await axios.get(
            `${BASE_URL}/api/v2/serviceability/${pin}`,
            { headers: freshHeaders, timeout: TIMEOUT }
          );
          const data = retryRes.data;
          return {
            serviceable: Boolean(data?.status),
            pincode: data?.pincode || pin,
            remark: data?.remark || (data?.status ? "Pincode is serviceable" : "Pincode not serviceable"),
            details: data?.details || null,
          };
        } catch (retryErr) {}
      }
      console.warn("Ekart serviceability check notice:", err.response?.data?.message || err.message);
      return {
        serviceable: true,
        pincode: pin,
        remark: "Standard delivery serviceable",
        cod: true,
      };
    }
  },

  /**
   * Build Exact Ekart Elite OpenAPI Shipment Payload as per spec.yaml
   */
  async buildShipmentPayload(order) {
    const isCOD = order.paymentMethod === "COD";
    const paymentMode = isCOD ? "COD" : "Prepaid";
    const totalAmount = Math.max(1, Math.round(Number(order.total || 0)));
    const taxValue = Math.round(Number(order.tax || 0));
    const taxableAmount = Math.max(1, totalAmount - taxValue);
    const codAmount = isCOD ? totalAmount : 0;

    const customer = order.customer || {};
    const address = order.shippingAddress || {};
    const consigneeName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Valued Customer";

    // Clean 10-digit primary phone
    let phoneDigits = String(customer.phone || "9876543210").replace(/\D/g, "").slice(-10);
    if (phoneDigits.length < 10) phoneDigits = "9876543210";
    const primaryPhoneInt = parseInt(phoneDigits, 10);

    // Alternate phone must be 10 digits and CANNOT be identical to primary phone per Ekart API validation
    let altPhoneDigits = String(customer.alternatePhone || address.alternatePhone || "").replace(/\D/g, "").slice(-10);
    if (!altPhoneDigits || altPhoneDigits.length < 10 || altPhoneDigits === phoneDigits) {
      // Offset last digit to make a distinct valid 10-digit alternate phone
      const lastDigit = parseInt(phoneDigits.slice(-1), 10);
      const newLastDigit = (lastDigit + 1) % 10;
      altPhoneDigits = phoneDigits.slice(0, -1) + newLastDigit;
    }

    const itemsDesc = (order.items || [])
      .map((i) => `${i.name} (x${i.quantity || 1})`)
      .join(", ") || "Dailyfix Skincare / Cosmetics";

    const pickupAlias = await this.getPickupLocationAlias();

    const weightGrams = Math.max(1, Math.round(Number(order.packageDetails?.weight || 500)));
    const lengthCm = Math.max(1, Math.round(Number(order.packageDetails?.length || 15)));
    const widthCm = Math.max(1, Math.round(Number(order.packageDetails?.width || 10)));
    const heightCm = Math.max(1, Math.round(Number(order.packageDetails?.height || 5)));
    const quantity = (order.items || []).reduce((acc, i) => acc + Number(i.quantity || 1), 0) || 1;

    const fullDropAddress = [
      address.address || address.street || "Address line 1",
      address.area || address.landmark || "",
    ].filter(Boolean).join(", ").substring(0, 200) || "Delivery Address";

    const pinInt = parseInt(String(address.pincode || "400001").replace(/\D/g, ""), 10) || 400001;

    return {
      seller_name: process.env.DELHIVERY_CLIENT_NAME || "NAIMITRA VENTURES PRIVATE LIMITED",
      seller_address: process.env.DELHIVERY_PICKUP_ADDRESS || "Shop No.2, Chawl No.8, Mishra Sadan, Mohili Village, Kurla West, Mumbai-400072",
      seller_gst_tin: process.env.DELHIVERY_GST_NUMBER || "27AALCN1163B1ZQ",
      seller_gst_amount: 0,
      consignee_gst_amount: 0,
      integrated_gst_amount: 0,
      order_number: String(order.orderId),
      invoice_number: `INV-${order.orderId}`,
      invoice_date: new Date().toISOString().split("T")[0],
      consignee_name: consigneeName.substring(0, 100),
      consignee_alternate_phone: altPhoneDigits,
      products_desc: itemsDesc.substring(0, 150),
      payment_mode: paymentMode,
      category_of_goods: "Cosmetics",
      total_amount: totalAmount,
      tax_value: taxValue,
      taxable_amount: taxableAmount,
      commodity_value: String(taxableAmount),
      cod_amount: codAmount,
      quantity,
      weight: weightGrams,
      length: lengthCm,
      width: widthCm,
      height: heightCm,
      return_reason: "",
      drop_location: {
        location_type: "Home",
        name: consigneeName.substring(0, 100),
        phone: primaryPhoneInt,
        address: fullDropAddress,
        city: String(address.city || "Mumbai").trim().substring(0, 50),
        state: String(address.state || "Maharashtra").trim().substring(0, 50),
        country: "India",
        pin: pinInt,
      },
      pickup_location: {
        name: pickupAlias,
      },
      return_location: {
        name: pickupAlias,
      },
    };
  },

  /**
   * Create Shipment on Ekart Elite (PUT /api/v1/package/create as per OpenAPI spec)
   */
  async createShipment(rawPayload) {
    validateEkartConfig();
    const payload = (rawPayload && typeof rawPayload.then === "function") ? await rawPayload : rawPayload;

    const doRequest = async (headers) => {
      return await axios.put(
        `${BASE_URL}/api/v1/package/create`,
        payload,
        {
          headers,
          timeout: TIMEOUT,
        }
      );
    };

    try {
      const headers = await getEkartHeaders();
      const response = await doRequest(headers);
      if (response.data && (response.data.tracking_id || response.data.status)) {
        return response.data;
      }
      return response.data;
    } catch (err) {
      // If 401 or token invalid, attempt 1 force-refresh retry
      if (err.response?.status === 401 || String(err.response?.data?.description || "").includes("token")) {
        console.warn("🔄 Ekart 401 received. Refreshing token and retrying createShipment...");
        try {
          const freshHeaders = await getEkartHeaders(true);
          const retryRes = await doRequest(freshHeaders);
          return retryRes.data;
        } catch (retryErr) {
          err = retryErr;
        }
      }

      console.error("❌ Ekart live creation error:", err.response?.status, err.response?.data || err.message);

      const errorMsg =
        err.response?.data?.description ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Ekart shipment creation failed";

      throw new Error(errorMsg);
    }
  },

  /**
   * Helper to extract tracking ID / waybill from response
   */
  extractTrackingId(response) {
    return (
      response?.tracking_id ||
      response?.trackingId ||
      response?.barcodes?.wbn ||
      response?.waybill ||
      response?.wbn ||
      response?.id ||
      ""
    );
  },

  getShipmentId(response) {
    return (
      response?.channelId ||
      response?.shipment_id ||
      response?.id ||
      ""
    );
  },

  getPickupRequestId(response) {
    return (
      response?.pickup_request_id ||
      response?.prn ||
      response?.pickup_id ||
      ""
    );
  },

  getLabelURL(response) {
    const trackId = this.extractTrackingId(response);
    return (
      response?.label_url ||
      response?.labelUrl ||
      (trackId ? `https://app.elite.ekartlogistics.in/track/${trackId}` : "")
    );
  },

  getInvoiceURL(response) {
    return response?.invoice_url || "";
  },

  getEstimatedDelivery(response) {
    const dateVal = response?.edd || response?.expected_delivery_date;
    if (!dateVal) return null;
    if (typeof dateVal === "number") {
      return new Date(dateVal);
    }
    return new Date(dateVal);
  },

  /**
   * Download Packing Label PDF from Ekart Elite (POST /api/v1/package/label)
   */
  async generateShippingLabel(trackingId) {
    if (!trackingId) throw new Error("Tracking ID is required for label generation");
    validateEkartConfig();

    const doRequest = async (headers) => {
      return await axios.post(
        `${BASE_URL}/api/v1/package/label`,
        { ids: [String(trackingId)] },
        {
          headers,
          responseType: "arraybuffer",
          timeout: TIMEOUT,
        }
      );
    };

    try {
      const headers = await getEkartHeaders();
      const response = await doRequest(headers);
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          const freshHeaders = await getEkartHeaders(true);
          const retryRes = await doRequest(freshHeaders);
          return retryRes.data;
        } catch (retryErr) {
          err = retryErr;
        }
      }
      throw new Error(err.response?.data?.description || err.response?.data?.message || err.message || "Ekart label generation failed");
    }
  },

  /**
   * Live Track Shipment via Ekart Elite OpenAPI (/api/v1/track/{id})
   */
  async trackShipment(trackingId) {
    if (!trackingId) throw new Error("Tracking ID / Waybill is required");

    try {
      const response = await axios.get(
        `${BASE_URL}/api/v1/track/${encodeURIComponent(trackingId)}`,
        {
          timeout: TIMEOUT,
        }
      );
      return response.data;
    } catch (err) {
      // Fallback to Elite track format
      try {
        const altRes = await axios.get(
          `${BASE_URL}/data/v1/elite/track/${encodeURIComponent(trackingId)}`,
          {
            timeout: TIMEOUT,
          }
        );
        return altRes.data;
      } catch (fallbackErr) {
        throw new Error(err.response?.data?.description || err.response?.data?.message || err.message || "Ekart tracking request failed");
      }
    }
  },

  /**
   * Cancel Shipment on Ekart Elite (DELETE /api/v1/package/cancel?tracking_id=...)
   */
  async cancelShipment(trackingId, reason = "Cancelled by merchant") {
    if (!trackingId) throw new Error("Tracking ID / Waybill is required for cancellation");
    validateEkartConfig();

    const doRequest = async (headers) => {
      return await axios.delete(
        `${BASE_URL}/api/v1/package/cancel`,
        {
          params: { tracking_id: trackingId },
          headers,
          timeout: TIMEOUT,
        }
      );
    };

    try {
      const headers = await getEkartHeaders();
      const response = await doRequest(headers);
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          const freshHeaders = await getEkartHeaders(true);
          const retryRes = await doRequest(freshHeaders);
          return retryRes.data;
        } catch (retryErr) {
          err = retryErr;
        }
      }
      throw new Error(
        err.response?.data?.description ||
        err.response?.data?.message ||
        err.message ||
        "Ekart shipment cancellation failed"
      );
    }
  },

  /**
   * Sync Tracking details to order document in database
   */
  async syncTracking(order) {
    const trackingId = order?.ekart?.trackingId || order?.ekart?.waybill;
    if (!trackingId) return null;

    try {
      const tracking = await ekartService.trackShipment(trackingId);
      const trackObj = tracking?.track || tracking?.data || tracking;

      const rawStatus = trackObj?.status || tracking?.status || order.ekart.currentStatus;
      const rawLocation = trackObj?.location || tracking?.location || order.ekart.currentLocation;

      order.ekart.currentStatus = rawStatus;
      if (rawLocation) order.ekart.currentLocation = rawLocation;
      order.ekart.lastSynced = new Date();

      if (tracking?.edd) {
        order.ekart.expectedDelivery = new Date(tracking.edd);
      }

      const detailsList = trackObj?.details || tracking?.scans || tracking?.history || [];
      if (Array.isArray(detailsList) && detailsList.length > 0) {
        order.ekart.trackingHistory = detailsList.map((item) => ({
          status: item?.status || item?.desc || item?.event || "",
          location: item?.location || item?.city || item?.hub_name || "",
          remarks: item?.desc || item?.remarks || item?.hub_notes || "",
          scanDate: item?.ctime ? new Date(item.ctime) : (item?.event_date ? new Date(item.event_date) : new Date()),
        }));
      }

      // Automatically map courier status to main order status
      const mappedStatus = mapEkartStatus(order.ekart.currentStatus);
      if (mappedStatus && order.status !== mappedStatus) {
        console.log(`🔄 [Ekart Sync] Order ${order.orderId} status auto-updated: ${order.status} -> ${mappedStatus} (Courier: ${order.ekart.currentStatus})`);
        order.status = mappedStatus;
      }

      await order.save();
      return order;
    } catch (err) {
      console.warn(`Ekart tracking sync failed for ${trackingId}:`, err.message);
      return null;
    }
  },
};

export function mapEkartStatus(courierStatus) {
  if (!courierStatus) return null;
  const s = String(courierStatus).trim().toLowerCase();

  if (s.includes("delivered") || s === "dl") {
    return "Delivered";
  }
  if (s.includes("cancel") || s.includes("rto") || s.includes("return") || s.includes("rejected")) {
    return "Cancelled";
  }
  if (s.includes("out for delivery") || s.includes("out_for_delivery") || s === "ofd") {
    return "Out for Delivery";
  }
  if (s.includes("in transit") || s.includes("in_transit") || s.includes("dispatched") || s.includes("manifest") || s.includes("pickup") || s.includes("reached") || s.includes("order placed")) {
    return "Shipped";
  }
  return null;
}

export default ekartService;
