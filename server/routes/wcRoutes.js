import express from "express";
import { validateApiKey } from "../middleware/apiKeyAuth.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

/**
 * Format Dailyfix Order into standard WooCommerce V3 Order JSON schema
 */
const formatWooOrder = (order) => {
  const isCOD = order.paymentMethod === "COD";
  const customer = order.customer || {};
  const address = order.shippingAddress || {};

  return {
    id: order._id,
    number: order.orderId,
    order_key: `wc_order_${order.orderId}`,
    status: mapDailyfixToWooStatus(order.status),
    currency: "INR",
    date_created: order.createdAt,
    date_modified: order.updatedAt,
    discount_total: "0.00",
    shipping_total: String(order.shippingCharge || "0.00"),
    total: String(order.total || 0),
    payment_method: isCOD ? "cod" : "razorpay",
    payment_method_title: isCOD ? "Cash on Delivery" : "Online Payment",
    billing: {
      first_name: customer.firstName || "",
      last_name: customer.lastName || "",
      address_1: address.address || "",
      city: address.city || "",
      state: address.state || "",
      postcode: address.pincode || "",
      country: address.country || "IN",
      email: customer.email || "",
      phone: customer.phone || "",
    },
    shipping: {
      first_name: customer.firstName || "",
      last_name: customer.lastName || "",
      address_1: address.address || "",
      city: address.city || "",
      state: address.state || "",
      postcode: address.pincode || "",
      country: address.country || "IN",
      phone: customer.phone || "",
    },
    line_items: (order.items || []).map((item) => ({
      id: item.product || item._id,
      name: item.name,
      product_id: item.product,
      quantity: Number(item.quantity || 1),
      subtotal: String(item.price * (item.quantity || 1)),
      total: String(item.price * (item.quantity || 1)),
      price: Number(item.price || 0),
      sku: item.sku || "",
    })),
    meta_data: [
      { key: "_delhivery_waybill", value: order.delhivery?.waybill || "" },
      { key: "_ekart_waybill", value: order.ekart?.waybill || order.ekart?.trackingId || "" },
      { key: "_carrier", value: order.carrier || "Delhivery" },
    ],
  };
};

const mapDailyfixToWooStatus = (status) => {
  switch (status) {
    case "Pending":
      return "pending";
    case "Processing":
    case "Confirmed":
      return "processing";
    case "Shipped":
    case "Out for Delivery":
      return "in-transit";
    case "Delivered":
      return "completed";
    case "Cancelled":
      return "cancelled";
    case "Returned":
      return "refunded";
    default:
      return "processing";
  }
};

/*
=================================================
WOOCOMMERCE COMPATIBLE V3 REST API
=================================================
*/

// GET /wp-json/wc/v3/orders (Read Orders)
router.get("/orders", validateApiKey("read"), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 20;
    const status = req.query.status;

    let query = {};
    if (status && status !== "any") {
      query.status = new RegExp(status, "i");
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / perPage);

    res.setHeader("X-WP-Total", totalOrders);
    res.setHeader("X-WP-TotalPages", totalPages);

    return res.json(orders.map(formatWooOrder));
  } catch (error) {
    return res.status(500).json({
      code: "woocommerce_rest_cannot_view",
      message: error.message,
      data: { status: 500 },
    });
  }
});

// GET /wp-json/wc/v3/orders/:id (Read Single Order)
router.get("/orders/:id", validateApiKey("read"), async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({
        code: "woocommerce_rest_order_invalid_id",
        message: "Invalid ID.",
        data: { status: 404 },
      });
    }

    return res.json(formatWooOrder(order));
  } catch (error) {
    return res.status(500).json({
      code: "woocommerce_rest_cannot_view",
      message: error.message,
      data: { status: 500 },
    });
  }
});

// PUT /wp-json/wc/v3/orders/:id (Update Order / AWB from logistics service)
router.put("/orders/:id", validateApiKey("write"), async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({
        code: "woocommerce_rest_order_invalid_id",
        message: "Invalid ID.",
        data: { status: 404 },
      });
    }

    const { status, meta_data } = req.body;

    if (status) {
      if (status === "completed") order.status = "Delivered";
      else if (status === "cancelled") order.status = "Cancelled";
      else if (status === "in-transit") order.status = "Shipped";
      else if (status === "processing") order.status = "Processing";
    }

    if (Array.isArray(meta_data)) {
      for (const meta of meta_data) {
        if (meta.key === "_ekart_waybill" || meta.key === "tracking_number" || meta.key === "ekart_awb") {
          order.ekart = order.ekart || {};
          order.ekart.waybill = meta.value;
          order.carrier = "Ekart";
        }
        if (meta.key === "_delhivery_waybill" || meta.key === "delhivery_awb") {
          order.delhivery = order.delhivery || {};
          order.delhivery.waybill = meta.value;
          order.carrier = "Delhivery";
        }
      }
    }

    await order.save();
    return res.json(formatWooOrder(order));
  } catch (error) {
    return res.status(500).json({
      code: "woocommerce_rest_cannot_edit",
      message: error.message,
      data: { status: 500 },
    });
  }
});

export default router;
