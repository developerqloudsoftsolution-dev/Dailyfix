import crypto from "crypto";
import ApiKey from "../models/ApiKey.js";

/**
 * Middleware to authenticate requests using WooCommerce-compatible Consumer Key & Secret
 *
 * Supports:
 * 1. HTTP Basic Auth: Authorization: Basic base64(consumer_key:consumer_secret)
 * 2. Query Params: ?consumer_key=ck_...&consumer_secret=cs_...
 * 3. Headers: X-Consumer-Key and X-Consumer-Secret
 *
 * @param {string} requiredScope - 'read' | 'write' | 'read_write'
 */
export const validateApiKey = (requiredScope = "read") => {
  return async (req, res, next) => {
    try {
      let consumerKey = "";
      let consumerSecret = "";

      // 1. Extract from HTTP Basic Auth
      const authHeader = req.headers["authorization"] || "";
      if (authHeader.startsWith("Basic ")) {
        const credentials = Buffer.from(authHeader.substring(6), "base64").toString("utf-8");
        const parts = credentials.split(":");
        if (parts.length >= 2) {
          consumerKey = parts[0];
          consumerSecret = parts.slice(1).join(":");
        }
      }

      // 2. Extract from Query Parameters if not in Basic Auth
      if (!consumerKey && req.query.consumer_key) {
        consumerKey = String(req.query.consumer_key);
        consumerSecret = String(req.query.consumer_secret || "");
      }

      // 3. Extract from custom headers
      if (!consumerKey && req.headers["x-consumer-key"]) {
        consumerKey = String(req.headers["x-consumer-key"]);
        consumerSecret = String(req.headers["x-consumer-secret"] || "");
      }

      if (!consumerKey || !consumerSecret) {
        return res.status(401).json({
          code: "woocommerce_rest_cannot_view",
          message: "Consumer Key and Consumer Secret are required for authentication.",
          data: { status: 401 },
        });
      }

      // 4. Look up API Key in database
      const keyDoc = await ApiKey.findOne({
        consumerKey: consumerKey.trim(),
        status: "active",
      });

      if (!keyDoc) {
        return res.status(401).json({
          code: "woocommerce_rest_authentication_error",
          message: "Consumer key is invalid or revoked.",
          data: { status: 401 },
        });
      }

      // 5. Verify hashed consumer secret
      const incomingSecretHash = crypto
        .createHash("sha256")
        .update(consumerSecret.trim())
        .digest("hex");

      if (incomingSecretHash !== keyDoc.consumerSecretHash) {
        return res.status(401).json({
          code: "woocommerce_rest_authentication_error",
          message: "Consumer secret is invalid.",
          data: { status: 401 },
        });
      }

      // 6. Enforce permission scope
      const keyScope = keyDoc.scope || "read";

      if (requiredScope === "write" && keyScope === "read") {
        return res.status(403).json({
          code: "woocommerce_rest_cannot_edit",
          message: "This API key has read-only permissions and cannot perform write operations.",
          data: { status: 403 },
        });
      }

      if (requiredScope === "read_write" && keyScope !== "read_write") {
        return res.status(403).json({
          code: "woocommerce_rest_insufficient_scope",
          message: "This endpoint requires full read_write permission scope.",
          data: { status: 403 },
        });
      }

      // Update last accessed timestamp asynchronously
      keyDoc.lastAccessAt = new Date();
      keyDoc.save().catch(() => {});

      // Attach key metadata to request
      req.apiKey = {
        id: keyDoc._id,
        appName: keyDoc.appName,
        userId: keyDoc.userId,
        scope: keyDoc.scope,
      };

      next();
    } catch (error) {
      console.error("❌ API Key validation error:", error);
      return res.status(500).json({
        code: "woocommerce_rest_server_error",
        message: "Internal server authentication error.",
        data: { status: 500 },
      });
    }
  };
};

export default validateApiKey;
