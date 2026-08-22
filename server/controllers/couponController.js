import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";

// Get all coupons (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate("applicableProducts", "name price image stock")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Create new rich coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      title,
      description,
      discountType,
      discountAmount,
      minOrderAmount,
      maxDiscountAmount,
      minQuantity,
      applicableType,
      applicableProducts,
      showAsPopup,
      popupHeadline,
      theme,
      bannerImage,
      startDate,
      expiryDate,
      usageLimit,
    } = req.body;

    if (!code || !discountAmount) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and discount amount are required.",
      });
    }

    const cleanCode = String(code).trim().toUpperCase();

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon code '${cleanCode}' already exists.`,
      });
    }

    // If this coupon is set as popup, deactivate other popups so only 1 popup is active
    if (showAsPopup) {
      await Coupon.updateMany({ showAsPopup: true }, { showAsPopup: false });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      title: String(title || "").trim(),
      description: String(description || "").trim(),
      discountType: discountType || "percentage",
      discountAmount: Number(discountAmount),
      minOrderAmount: Number(minOrderAmount || 0),
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      minQuantity: Number(minQuantity || 1),
      applicableType: applicableType || "all",
      applicableProducts: Array.isArray(applicableProducts) ? applicableProducts : [],
      showAsPopup: Boolean(showAsPopup),
      popupHeadline: String(popupHeadline || "Special Visitor Offer!").trim(),
      theme: theme || "purple",
      bannerImage: bannerImage || "",
      startDate: startDate ? new Date(startDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      status: "active",
    });

    const populatedCoupon = await Coupon.findById(coupon._id).populate(
      "applicableProducts",
      "name price image"
    );

    return res.status(201).json({
      success: true,
      message: `Coupon '${coupon.code}' created successfully!`,
      coupon: populatedCoupon,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete coupon (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    return res.json({
      success: true,
      message: `Coupon '${coupon.code}' deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Toggle coupon status (Admin)
export const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }
    coupon.status = coupon.status === "active" ? "inactive" : "active";
    await coupon.save();
    return res.json({
      success: true,
      message: `Coupon '${coupon.code}' is now ${coupon.status}.`,
      coupon,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Visitor Promo Popup Coupon (Public)
export const getVisitorPromoPopup = async (req, res) => {
  try {
    const now = new Date();
    const popupCoupon = await Coupon.findOne({
      status: "active",
      showAsPopup: true,
      $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
    }).populate("applicableProducts", "name price image");

    return res.json({
      success: true,
      coupon: popupCoupon || null,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get Available Checkout Coupons (Public)
export const getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      status: "active",
      $or: [{ expiryDate: null }, { expiryDate: { $gt: now } }],
    })
      .populate("applicableProducts", "name price image")
      .sort({ discountAmount: -1 });

    return res.json({
      success: true,
      coupons,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Validate & Apply Coupon with Multi-Product & Specific Product Logic (Public)
export const applyCoupon = async (req, res) => {
  try {
    const { code, orderAmount, items } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: "Please enter a coupon code." });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode }).populate("applicableProducts");

    if (!coupon || coupon.status !== "active") {
      return res.status(400).json({ success: false, message: "Invalid or inactive coupon code." });
    }

    const now = new Date();
    if (coupon.startDate && now < new Date(coupon.startDate)) {
      return res.status(400).json({ success: false, message: "This coupon is not active yet." });
    }

    if (coupon.expiryDate && now > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: "This coupon code has expired." });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached." });
    }

    const cartItems = Array.isArray(items) ? items : [];
    const totalQty = cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
    const subtotal = Number(orderAmount || 0);

    // 1. Check Multiple Products / Bundle Quantity Rule
    if (coupon.minQuantity > 1 && totalQty < coupon.minQuantity) {
      const itemsNeeded = coupon.minQuantity - totalQty;
      return res.status(400).json({
        success: false,
        message: `Add ${itemsNeeded} more product${itemsNeeded > 1 ? "s" : ""} to your cart to unlock '${coupon.code}' (${coupon.minQuantity}+ items required)!`,
        minQuantity: coupon.minQuantity,
        itemsNeeded,
      });
    }

    // 2. Check Minimum Order Amount
    if (coupon.minOrderAmount > 0 && subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderAmount} required for '${coupon.code}'.`,
      });
    }

    // 3. Check Specific Product Scope
    let eligibleSubtotal = subtotal;
    if (coupon.applicableType === "specific" && coupon.applicableProducts.length > 0) {
      const allowedProductIds = coupon.applicableProducts.map((p) => String(p._id || p));

      const matchingCartItems = cartItems.filter((item) => {
        const prodId = String(item.product?._id || item.product || item.productId || item.id);
        return allowedProductIds.includes(prodId);
      });

      if (matchingCartItems.length === 0) {
        const eligibleNames = coupon.applicableProducts.map((p) => p.name).join(", ");
        return res.status(400).json({
          success: false,
          message: `This coupon is only valid for specific products: ${eligibleNames}.`,
        });
      }

      // Calculate subtotal for matching products only
      eligibleSubtotal = matchingCartItems.reduce((sum, item) => {
        const price = Number(item.product?.price || item.price || 0);
        return sum + price * Number(item.quantity || 1);
      }, 0);
    }

    // 4. Calculate Discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (eligibleSubtotal * coupon.discountAmount) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = Math.min(coupon.discountAmount, eligibleSubtotal);
    }

    discount = Math.round(discount);

    return res.json({
      success: true,
      message: `🎉 Coupon '${coupon.code}' applied! You saved ₹${discount}.`,
      coupon: {
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        discountCalculated: discount,
        applicableType: coupon.applicableType,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Upload Coupon Banner Creative
export const uploadCouponBanner = async (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please select an image file to upload." });
    }

    const relativeUrl = `/uploads/products/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Offer banner uploaded successfully!",
      imageUrl: relativeUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
  }
};

