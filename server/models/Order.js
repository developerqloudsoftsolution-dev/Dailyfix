import mongoose from "mongoose";

const trackingHistorySchema = new mongoose.Schema(
  {
    status: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    remarks: { type: String, default: "", trim: true },
    scanDate: { type: Date },
  },
  { _id: false }
);

 const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    sku: { type: String, trim: true }, 
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // ==========================
    // ORDER DETAILS
    // ==========================

    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ==========================
    // CUSTOMER
    // ==========================

    customer: {
     firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        lowercase: true, 
        trim: true,
      },
      phone: { type: String, required: true, trim: true },
    },

    // ==========================
    // SHIPPING ADDRESS
    // ==========================

   shippingAddress: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      country: { type: String, default: "India", trim: true },
    },
    // ==========================
    // PACKAGE DETAILS
    // ==========================

   packageDetails: {
      weight: { type: Number, default: 500, min: 1 }, // grams
      length: { type: Number, default: 15, min: 1 }, // cm
      width: { type: Number, default: 10, min: 1 },
      height: { type: Number, default: 5, min: 1 },
    },

    // ==========================
    // PRODUCTS
    // ==========================

  items: {
      type: [orderItemSchema],
      validate: [(val) => val.length > 0, "Order must contain at least one item."],
    },
    // ==========================
    // PAYMENT
    // ==========================

    total: { type: Number, required: true },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "", trim: true },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Pending (COD)",
        "Paid",
        "Failed",
        "Refunded",
      ],
      default: "Pending",
    },

    razorpayOrderId: { type: String, default: "", trim: true },
    razorpayPaymentId: { type: String, default: "", trim: true },
    razorpaySignature: { type: String, default: "", trim: true },

    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ==========================
    // ORDER STATUS
    // ==========================

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },

    // ==========================
    // CARRIER / LOGISTICS INTEGRATION
    // ==========================
    carrier: {
      type: String,
      enum: ["Delhivery", "Ekart", "Manual"],
      default: "Delhivery",
    },

    // ==========================
    // DELHIVERY INTEGRATION
    // ==========================
    delhivery: {
      waybill: {
        type: String,
        default: "",
        index: true, // Crucial for fast webhook updates by AWB
        trim: true,
      },
      shipmentId: { type: String, default: "", trim: true },
      pickupRequestId: { type: String, default: "", trim: true },
      labelUrl: { type: String, default: "", trim: true },
      invoiceUrl: { type: String, default: "", trim: true },
      currentStatus: { type: String, default: "Pending", trim: true },
      currentLocation: { type: String, default: "", trim: true },
      expectedDelivery: { type: Date, default: null },
      trackingHistory: { type: [trackingHistorySchema], default: [] },
      shipmentResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
      lastSynced: { type: Date, default: null },
    },

    // ==========================
    // EKART LOGISTICS INTEGRATION
    // ==========================
    ekart: {
      trackingId: {
        type: String,
        default: "",
        index: true,
        trim: true,
      },
      waybill: {
        type: String,
        default: "",
        index: true,
        trim: true,
      },
      shipmentId: { type: String, default: "", trim: true },
      pickupRequestId: { type: String, default: "", trim: true },
      labelUrl: { type: String, default: "", trim: true },
      invoiceUrl: { type: String, default: "", trim: true },
      currentStatus: { type: String, default: "Pending", trim: true },
      currentLocation: { type: String, default: "", trim: true },
      expectedDelivery: { type: Date, default: null },
      trackingHistory: { type: [trackingHistorySchema], default: [] },
      shipmentResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
      lastSynced: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ "customer.email": 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);