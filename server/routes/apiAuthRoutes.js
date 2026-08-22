import express from "express";
import rateLimit from "express-rate-limit";
import authMiddleware from "../middleware/auth.js";
import {
  validateAuthorizeParams,
  handleAuthorizeRedirect,
  approveAuthorization,
  denyAuthorization,
  getAllApiKeys,
  revokeApiKey,
} from "../controllers/apiAuthController.js";

const router = express.Router();

// Rate limiter for authorization requests
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 authorization requests per window
  message: {
    success: false,
    message: "Too many authorization requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/*
=================================================
WOOCOMMERCE / EXTERNAL APP AUTHORIZATION FLOW
=================================================
*/

// GET /api/auth/authorize (Validate params and redirect to React approval page)
router.get("/authorize", authLimiter, validateAuthorizeParams, handleAuthorizeRedirect);

// POST /api/auth/authorize/approve (Admin confirms connection)
router.post("/authorize/approve", authMiddleware, approveAuthorization);

// POST /api/auth/authorize/deny (Admin rejects connection)
router.post("/authorize/deny", authMiddleware, denyAuthorization);

// Admin Management of API Keys
router.get("/keys", authMiddleware, getAllApiKeys);
router.delete("/keys/:id", authMiddleware, revokeApiKey);

export default router;
