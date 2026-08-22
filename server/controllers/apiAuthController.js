import crypto from "crypto";
import axios from "axios";
import ApiKey from "../models/ApiKey.js";

/**
 * Validate URL is a valid web address (HTTPS or HTTP in local development)
 */
function isValidUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    const isLocal =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname.endsWith(".ngrok-free.app") ||
      parsed.hostname.endsWith(".loca.lt");

    if (process.env.NODE_ENV === "production" && !isLocal) {
      return parsed.protocol === "https:";
    }
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch (e) {
    return false;
  }
}

/**
 * Validate required query params for /api/auth/authorize & /wc-auth/v1/authorize
 */
export const validateAuthorizeParams = (req, res, next) => {
  const { app_name, scope, user_id, return_url, callback_url } = req.query;

  const errors = [];
  if (!app_name || typeof app_name !== "string" || !app_name.trim()) {
    errors.push("Missing or invalid 'app_name' parameter.");
  }

  const validScopes = ["read", "write", "read_write"];
  if (!scope || !validScopes.includes(scope)) {
    errors.push("Invalid 'scope' parameter. Allowed values: read, write, read_write.");
  }

  if (!user_id || typeof user_id !== "string" || !user_id.trim()) {
    errors.push("Missing or invalid 'user_id' parameter.");
  }

  if (!return_url || !isValidUrl(return_url)) {
    errors.push("Missing or invalid 'return_url' (Must be a valid HTTPS URL).");
  }

  if (!callback_url || !isValidUrl(callback_url)) {
    errors.push("Missing or invalid 'callback_url' (Must be a valid HTTPS URL).");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Authorization request validation failed",
      errors,
    });
  }

  next();
};

/**
 * Handle initial GET /api/auth/authorize and GET /wc-auth/v1/authorize
 * Redirects to the React Authorization approval screen or returns JSON
 */
export const handleAuthorizeRedirect = async (req, res) => {
  const { app_name, scope, user_id, return_url, callback_url } = req.query;

  // Generate a temporary CSRF token for the session
  const csrfToken = crypto.randomBytes(16).toString("hex");

  // Construct target URL for the React frontend admin authorization screen
  const queryParams = new URLSearchParams({
    app_name: String(app_name).trim(),
    scope: String(scope).trim(),
    user_id: String(user_id).trim(),
    return_url: String(return_url).trim(),
    callback_url: String(callback_url).trim(),
    csrf: csrfToken,
  }).toString();

  // If request accepts JSON (API call), return details
  if (req.headers.accept && req.headers.accept.includes("application/json") && !req.headers.accept.includes("text/html")) {
    return res.json({
      success: true,
      data: {
        app_name,
        scope,
        user_id,
        return_url,
        callback_url,
        csrfToken,
      },
    });
  }

  // Otherwise, redirect browser to React approval page
  return res.redirect(`/admin/authorize-app?${queryParams}`);
};

/**
 * Approve App Authorization (POST /api/auth/authorize/approve)
 * Requires Admin Authentication
 */
export const approveAuthorization = async (req, res) => {
  try {
    const { app_name, scope, user_id, return_url, callback_url } = req.body;

    if (!app_name || !scope || !user_id || !return_url || !callback_url) {
      return res.status(400).json({
        success: false,
        message: "Missing required authorization parameters.",
      });
    }

    if (!isValidUrl(return_url) || !isValidUrl(callback_url)) {
      return res.status(400).json({
        success: false,
        message: "Invalid return_url or callback_url.",
      });
    }

    // 1. Generate secure Consumer Key and Consumer Secret
    const consumerKey = `ck_${crypto.randomBytes(20).toString("hex")}`;
    const rawConsumerSecret = `cs_${crypto.randomBytes(20).toString("hex")}`;

    // 2. Hash secret with SHA-256 for secure storage
    const consumerSecretHash = crypto
      .createHash("sha256")
      .update(rawConsumerSecret)
      .digest("hex");

    const consumerSecretLast4 = rawConsumerSecret.slice(-4);

    // 3. Save new API Key in MongoDB
    const apiKey = await ApiKey.create({
      appName: String(app_name).trim(),
      userId: String(user_id).trim(),
      scope: String(scope).trim(),
      consumerKey,
      consumerSecretHash,
      consumerSecretLast4,
      adminId: req.admin?._id || null,
      callbackUrl: String(callback_url).trim(),
      returnUrl: String(return_url).trim(),
      status: "active",
    });

    // 4. Server-to-server POST payload to callback_url
    const callbackPayload = {
      key_id: apiKey._id.toString(),
      user_id: String(user_id).trim(),
      consumer_key: consumerKey,
      consumer_secret: rawConsumerSecret,
      key_permissions: scope,
    };

    let callbackSuccess = false;
    let callbackError = null;

    try {
      console.log(`📡 [App Auth] Sending credentials to callback_url: ${callback_url}`);
      const callbackRes = await axios.post(callback_url, callbackPayload, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Dailyfix-WooCommerce-Bridge/1.0",
        },
        timeout: 10000,
      });

      if (callbackRes.status >= 200 && callbackRes.status < 300) {
        callbackSuccess = true;
        console.log(`✅ [App Auth] Callback successful for app: ${app_name}`);
      }
    } catch (cbErr) {
      console.warn(`⚠️ [App Auth] Callback POST notice:`, cbErr.response?.data || cbErr.message);
      callbackError = cbErr.message;
    }

    // 5. Construct browser redirect URL
    const returnUrlObj = new URL(return_url);
    returnUrlObj.searchParams.set("success", "1");
    returnUrlObj.searchParams.set("user_id", String(user_id).trim());
    returnUrlObj.searchParams.set("app_name", String(app_name).trim());

    return res.json({
      success: true,
      message: `Authorization granted for ${app_name}`,
      callback_delivered: callbackSuccess,
      callback_error: callbackError,
      redirect_url: returnUrlObj.toString(),
      key_details: {
        key_id: apiKey._id,
        appName: apiKey.appName,
        scope: apiKey.scope,
        consumerKey: apiKey.consumerKey,
        consumerSecretLast4: apiKey.consumerSecretLast4,
      },
    });
  } catch (error) {
    console.error("❌ Approve authorization error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process app authorization approval.",
    });
  }
};

/**
 * Deny App Authorization (POST /api/auth/authorize/deny)
 */
export const denyAuthorization = async (req, res) => {
  try {
    const { app_name, user_id, return_url } = req.body;

    if (!return_url || !isValidUrl(return_url)) {
      return res.status(400).json({
        success: false,
        message: "Invalid return_url provided.",
      });
    }

    const returnUrlObj = new URL(return_url);
    returnUrlObj.searchParams.set("success", "0");
    returnUrlObj.searchParams.set("denied", "1");
    if (user_id) returnUrlObj.searchParams.set("user_id", String(user_id));

    return res.json({
      success: false,
      denied: true,
      message: `Authorization denied for ${app_name || "application"}`,
      redirect_url: returnUrlObj.toString(),
    });
  } catch (error) {
    console.error("❌ Deny authorization error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process denial.",
    });
  }
};

/**
 * List all active API keys (Admin Only)
 */
export const getAllApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      keys: keys.map((k) => ({
        id: k._id,
        appName: k.appName,
        userId: k.userId,
        scope: k.scope,
        consumerKey: k.consumerKey,
        consumerSecretLast4: k.consumerSecretLast4,
        status: k.status,
        lastAccessAt: k.lastAccessAt,
        createdAt: k.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Revoke an API Key (Admin Only)
 */
export const revokeApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = await ApiKey.findByIdAndUpdate(
      id,
      { status: "revoked" },
      { new: true }
    );
    if (!apiKey) {
      return res.status(404).json({ success: false, message: "API key not found" });
    }
    return res.json({
      success: true,
      message: `API Key for ${apiKey.appName} revoked successfully.`,
      key: apiKey,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
