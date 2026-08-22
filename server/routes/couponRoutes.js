import express from "express";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  getAllCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
  applyCoupon,
  getVisitorPromoPopup,
  getAvailableCoupons,
  uploadCouponBanner,
} from "../controllers/couponController.js";

const router = express.Router();

// Public: Visitor promo popup coupon
router.get("/popup", getVisitorPromoPopup);

// Public: Available checkout coupons
router.get("/available", getAvailableCoupons);

// Public: Apply coupon during checkout
router.post("/apply", applyCoupon);

// Admin: Manage coupons
router.get("/", getAllCoupons);
router.post("/upload", upload.single("image"), uploadCouponBanner);
router.post("/", authMiddleware, createCoupon);
router.patch("/:id/toggle", authMiddleware, toggleCouponStatus);
router.delete("/:id", authMiddleware, deleteCoupon);

export default router;


