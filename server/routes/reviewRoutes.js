import express from "express";
const router = express.Router();

import {
  getReviewsForProduct,
  createReview,
  voteHelpful,
  getAdminReviews,
  updateReviewStatus,
  toggleFeatureReview,
  deleteReview,
  seedDummyReviews,
} from "../controllers/reviewController.js";
import authMiddleware from "../middleware/auth.js";

// ==========================================
// PUBLIC CUSTOMER ROUTES
// ==========================================

// Get reviews and stats for a specific product
router.get("/product/:slugOrId", getReviewsForProduct);

// Customer writes a new review
router.post("/", createReview);

// Vote a review as helpful
router.post("/:id/helpful", voteHelpful);

// ==========================================
// ADMIN MANAGEMENT ROUTES (PROTECTED)
// ==========================================

// Get all reviews with filters (status, rating, search, product)
router.get("/admin", authMiddleware, getAdminReviews);

// Update review status (Approved / Pending / Rejected)
router.put("/admin/:id/status", authMiddleware, updateReviewStatus);

// Toggle featured review
router.put("/admin/:id/feature", authMiddleware, toggleFeatureReview);

// Delete review
router.delete("/admin/:id", authMiddleware, deleteReview);

// Seed or reset curated dummy positive reviews
router.post("/admin/seed-dummy", authMiddleware, seedDummyReviews);

export default router;
