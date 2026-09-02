import express from "express";

const router = express.Router();

import authMiddleware from "../middleware/auth.js";

import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,

  trackDelhiveryOrder,
  createManualShipment,
  createEkartShipment,
  updateOrderWaybill,
  cancelDelhiveryShipment,
  cancelEkartShipment,
  downloadShippingLabel,
  downloadEkartShippingLabel,
  revertShipment,
  syncOrderTracking,
  getShippingRate,

  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,

  getDashboardStats,
  delhiveryWebhook,
  ekartWebhook,

  initiateReturnRequest,
  getReturnRequests,
  approveReturnRequest,
  rejectReturnRequest,
  notifyOrderCustomer,
} from "../controllers/orderController.js";

/*
=================================================
COURIER WEBHOOKS (Delhivery & Ekart Real-time Updates)
=================================================
*/
// Delhivery Webhook (Public endpoint called by Delhivery servers)
router.post("/delhivery-webhook", express.json(), delhiveryWebhook);

// Ekart Logistics Webhook (Public endpoint called by Ekart servers)
router.post("/ekart-webhook", express.json(), ekartWebhook);

/*
=================================================
RAZORPAY ROUTES
=================================================
*/


// Razorpay Webhook (must be before auth routes - no auth needed)
router.post("/razorpay-webhook", express.raw({ type: "application/json" }), razorpayWebhook);

// Create Razorpay Order (public - checkout use)
router.post("/create-razorpay-order", createRazorpayOrder);

// Verify Razorpay Payment Signature (public - checkout use)
router.post("/verify-payment", verifyRazorpayPayment);

/*
=================================================
ORDER ROUTES
=================================================
*/

router.get("/shipping/rate", getShippingRate);

// Dashboard Stats (Admin)
router.get("/dashboard/stats", authMiddleware, getDashboardStats);

// Sync All Tracking (Admin - Delhivery & Ekart)
router.post("/sync-tracking", authMiddleware, syncOrderTracking);

// Create Order
router.post("/", createOrder);

// Get All Orders (Admin)
router.get("/", authMiddleware, getAllOrders);

// Get Single Order
router.get("/:id", getOrderById);
// Update Order Status
router.put("/:id/status", authMiddleware, updateOrderStatus);

/*
=================================================
SHIPPING & COURIER ROUTES (DELHIVERY & EKART)
=================================================
*/
// Unified Tracking (Works with Delhivery and Ekart tracking IDs)
router.get("/:orderId/track", trackDelhiveryOrder);

// Delhivery Specific
router.post("/:orderId/create-shipment", authMiddleware, createManualShipment);
router.get("/:orderId/label", authMiddleware, downloadShippingLabel);
router.get("/:orderId/cancel", authMiddleware, cancelDelhiveryShipment);

// Ekart Logistics Specific
router.post("/:orderId/create-ekart-shipment", authMiddleware, createEkartShipment);
router.get("/:orderId/ekart-label", authMiddleware, downloadEkartShippingLabel);
router.get("/:orderId/ekart-cancel", authMiddleware, cancelEkartShipment);

// Revert Shipment (Reset to Unshipped / Processing)
router.post("/:orderId/revert-shipment", authMiddleware, revertShipment);

// Returns & Replacements
router.post("/return-request", initiateReturnRequest);
router.get("/returns/list", authMiddleware, getReturnRequests);
router.post("/:orderId/approve-return", authMiddleware, approveReturnRequest);
router.post("/:orderId/reject-return", authMiddleware, rejectReturnRequest);

// Send Customer Live Update Notification (WhatsApp & Email)
router.post("/:orderId/notify-customer", authMiddleware, notifyOrderCustomer);

// Update AWB Manually (Supports carrier specification)
router.put("/:orderId/waybill", authMiddleware, updateOrderWaybill);

export default router;