import mongoose from "mongoose";
import crypto from "crypto";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";

import sendEmail, { getAdminNotifyEmails } from "../utils/sendEmail.js";
import customerOrderTemplate from "../templates/customerOrderTemplate.js";
import adminOrderTemplate from "../templates/adminOrderTemplate.js";
import customerStatusEmailTemplate from "../templates/customerStatusEmailTemplate.js";
import delhiveryService, { mapDelhiveryStatus } from "../utils/delhivery.js";
import ekartService, { mapEkartStatus } from "../utils/ekart.js";
import razorpay, { isRazorpayConfigured } from "../utils/razorpay.js";


import whatsappService from "../utils/whatsappService.js";

const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id) && /^[a-fA-F0-9]{24}$/.test(String(id));
};

const generateOrderId = () => {
  return (
    "DFX" +
    new Date().getFullYear() +
    crypto.randomBytes(4).toString("hex").toUpperCase()
  );
};


const calculateWeight = async (items) => {
  let weight = 0;

  for (const item of items) {
    const productRef = item.product || item.productId;
    if (!isValidObjectId(productRef)) continue;
    const product = await Product.findById(productRef);

    if (!product) continue;

    weight += (product.weight || 500) * Number(item.quantity);
  }

  return weight;
};

const calculateDimensions = async (items) => {
  let length = 0;
  let width = 0;
  let height = 0;

  for (const item of items) {
    const productRef = item.product || item.productId;
    if (!isValidObjectId(productRef)) continue;
    const product = await Product.findById(productRef);

    if (!product) continue;

    length = Math.max(length, product.length || 15);
    width = Math.max(width, product.width || 10);
    height += product.height || 5;
  }

  return {
    length,
    width,
    height,
  };
};

export const createOrder = async (req, res) => {
  let order;

  try {
    console.log("========== NEW ORDER ==========");
    const { customer, items, shippingAddress, shipping_address, paymentMethod, payment_method, paymentDetails } = req.body;

    const finalShippingAddress = shippingAddress || shipping_address;

    const payment = (paymentMethod || payment_method || "COD").toUpperCase();
    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer information missing",
      });
    }

    if (
      !customer.firstName ||
      !customer.lastName ||
      !customer.email ||
      !customer.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete customer details required",
      });
    }

    if (!finalShippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address missing",
      });
    }

    if (
      !finalShippingAddress.address ||
      !finalShippingAddress.city ||
      !finalShippingAddress.state ||
      !finalShippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping address required",
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }
    if (payment !== "COD") {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = paymentDetails || req.body;
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ success: false, message: "Payment details missing" });
      }
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    }

    let subtotal = 0;
    const orderItems = [];
    const dbItems = [];

    for (const item of items) {
      const productRef = item.product || item.productId;
      if (!isValidObjectId(productRef)) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID in cart`,
        });
      }
      const product = await Product.findById(productRef);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      subtotal +=
        Number(product.price) *
        Number(item.quantity);

      orderItems.push({
        id: product._id,
        name: product.name,
        image: product.image,
        quantity: Number(item.quantity),
        price: product.price,
      });

      dbItems.push({
        product: product._id,
        name: product.name,
        quantity: Number(item.quantity),
        price: product.price,
        sku: item.sku || product.sku,
      });
    }

    const tax = 0;
    const shipping = 0;
    const discount = Math.max(0, Number(req.body.discount || req.body.coupon?.discount || 0));
    const couponCode = String(req.body.couponCode || req.body.coupon?.code || "").trim().toUpperCase();

    const total = Math.max(0, subtotal - discount + tax + shipping);

    const weight =
      await calculateWeight(items);

    const dimensions =
      await calculateDimensions(items);

    order = await Order.create({
      orderId: generateOrderId(),
      customer,

      shippingAddress:
        finalShippingAddress,

      packageDetails: {
        weight,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
      },
      paymentMethod: payment === "COD" ? "COD" : "Online",
      paymentStatus: payment === "COD" ? "Pending (COD)" : "Paid",
      razorpayOrderId: req.body.paymentDetails?.razorpayOrderId || req.body.razorpayOrderId || "",
      razorpayPaymentId: req.body.paymentDetails?.razorpayPaymentId || req.body.razorpayPaymentId || "",
      razorpaySignature: req.body.paymentDetails?.razorpaySignature || req.body.razorpaySignature || "",
      paymentDetails: req.body.paymentDetails || {},
      subtotal,
      discount,
      couponCode,
      total,
      tax,
      shipping,
      status: "Confirmed",
      items: dbItems,
    });

    // Increment coupon usage count if applied
    if (couponCode) {
      Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { usedCount: 1 } }).catch(() => {});
    }

    console.log("✅ Order Saved:", order.orderId, couponCode ? `(Coupon: ${couponCode}, Saved: ₹${discount})` : "");


    /*
    ==========================================
    UPDATE STOCK FIRST (IMPORTANT!)
    ==========================================
    */

    console.log("Updating Product Stock...");
    for (const item of items) {
      const productRef = item.product || item.productId;
      if (isValidObjectId(productRef)) {
        await Product.findByIdAndUpdate(productRef, {
          $inc: { stock: -Number(item.quantity) },
        });
      }
    }
    console.log("✅ Product Stock Updated");

    /*
    ==========================================
    SEND EMAILS FIRST (CRITICAL!)
    ==========================================
    */

    try {
      const customerEmailRes = await sendEmail({
        to: order.customer.email,
        subject: `Order Confirmation - ${order.orderId}`,
        html: customerOrderTemplate(order),
      });
      if (customerEmailRes) {
        console.log(`✅ Customer confirmation email sent successfully to: ${order.customer.email}`);
      } else {
        console.warn(`⚠️ Customer confirmation email could not be sent to: ${order.customer.email} (Check SMTP configuration in .env)`);
      }
    } catch (error) {
      console.error("❌ Customer email failed:", error.message);
    }

    try {
      const adminRecipients = getAdminNotifyEmails();
      if (adminRecipients.length > 0) {
        const adminEmailRes = await sendEmail({
          to: adminRecipients,
          subject: `New Order Received - ${order.orderId}`,
          html: adminOrderTemplate(order),
        });
        if (adminEmailRes) {
          console.log("✅ Admin notification emails dispatched to:", adminRecipients.join(", "));
        } else {
          console.warn("⚠️ Admin notification emails could not be sent (Check SMTP configuration in .env)");
        }
      }
    } catch (error) {
      console.error("❌ Admin email failed:", error.message);
    }

    /*
    ==========================================
    SEND WHATSAPP NOTIFICATIONS (AUTOMATED)
    ==========================================
    */
    whatsappService.notifyNewOrderCustomer(order).catch((err) => {
      console.log("[WhatsApp] Customer notification skipped:", err.message);
    });
    whatsappService.notifyNewOrderAdmin(order).catch((err) => {
      console.log("[WhatsApp] Admin notification skipped:", err.message);
    });

    /*
    ==========================================
    SUCCESS RESPONSE (SEND BEFORE DELHIVERY!)
    ==========================================
    */

    res.status(201).json({
      success: true,
      message:
        order.paymentMethod === "COD"
          ? "Order placed successfully. Please pay on delivery."
          : "Payment successful! Order confirmed.",
      order: {
        orderId: order.orderId,
        _id: order._id,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        total: order.total,
        tax: order.tax,
        shipping: order.shipping,
        subtotal: order.total - order.tax - order.shipping,
        createdAt: order.createdAt,
        estimatedDelivery: order.delhivery?.expectedDelivery || null,
        customer: {
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          email: order.customer.email,
          phone: order.customer.phone,
        },
        shippingAddress: { ...order.shippingAddress },
        items: order.items.map((it) => ({
          productId: it.product,
          name: it.name,
          sku: it.sku,
          quantity: it.quantity,
          price: it.price,
          lineTotal: it.price * it.quantity,
        })),
        payment:
          order.paymentMethod === "Online"
            ? {
              razorpayOrderId: order.razorpayOrderId,
              razorpayPaymentId: order.razorpayPaymentId,
            }
            : {
              codAmount: order.total,
            },
      },
    });

    /*
    ==========================================
    EKART INTEGRATION (AUTO-SHIP IN BACKGROUND, NON-BLOCKING)
    ==========================================
    */

    try {
      order.carrier = "Ekart";
      const shipmentPayload = await ekartService.buildShipmentPayload(order);
      console.log("📦 Ekart Payload:", JSON.stringify(shipmentPayload, null, 2));

      const shipmentResponse = await ekartService.createShipment(shipmentPayload);
      console.log("Shipment Response (Ekart):", JSON.stringify(shipmentResponse, null, 2));

      const trackingId =
        shipmentResponse?.tracking_id ||
        shipmentResponse?.waybill ||
        shipmentResponse?.data?.tracking_id ||
        ekartService.extractTrackingId(shipmentResponse);

      console.log("Ekart AWB / Tracking ID:", trackingId);

      if (trackingId) {
        order.ekart = {
          trackingId: String(trackingId),
          waybill: String(trackingId),
          shipmentId: ekartService.getShipmentId(shipmentResponse) || String(trackingId),
          pickupRequestId: ekartService.getPickupRequestId(shipmentResponse) || "",
          currentStatus: "Manifested",
          labelUrl: ekartService.getLabelURL(shipmentResponse) || "",
          invoiceUrl: ekartService.getInvoiceURL(shipmentResponse) || "",
          expectedDelivery: ekartService.getEstimatedDelivery(shipmentResponse) || null,
          shipmentResponse,
          trackingHistory: [],
          lastSynced: new Date(),
        };

        try {
          const label = await ekartService.generateShippingLabel(trackingId);
          console.log("✅ Ekart Shipping Label Generated");
          order.ekart.label = label;
          console.log("✅ Ekart Shipping Label Saved");
        } catch (labelErr) {
          console.log("⚠ Ekart Shipping Label Generation Notice:", labelErr.message);
        }

        await order.save();
        console.log("✅ Ekart Details Saved to MongoDB");
      }
    } catch (ekartErr) {
      console.error("❌ EKART AUTO-SHIPMENT FAILED:");
      console.error(ekartErr.message);

      // Record failure notice in order so admin sees the reason (e.g. wallet recharge needed)
      try {
        order.ekart = {
          ...(order.ekart || {}),
          currentStatus: "Booking Failed",
          shipmentResponse: { error: ekartErr.message },
          lastSynced: new Date(),
        };
        await order.save();
      } catch (saveErr) {
        console.error("Failed to save Ekart error notice to order:", saveErr.message);
      }
    }
  }catch (error) {
    console.error("❌ Order creation failed:", error.message);

    /*
    ==========================================
    ROLLBACK STOCK (OPTIONAL)
    ==========================================
    */

    try {
      if (order && order._id) {
        await Order.findByIdAndDelete(order._id);
        for (const item of req.body.items) {
          const productRef = item.product || item.productId;
          await Product.findByIdAndUpdate(productRef, {
            $inc: { stock: Number(item.quantity) },
          });
        }
      }
    } catch (rollbackError) {
      console.error(
        "Rollback Failed:",
        rollbackError.message
      );
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
==========================================
GET ORDER BY ID
==========================================
*/

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({
      $or: [
        { _id: isValidObjectId(id) ? id : null },
        { orderId: id }
      ]
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      order,
      data: order,
    });

  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
==========================================
CREATE SHIPMENT MANUALLY (Admin)
==========================================
*/

export const createManualShipment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: isValidObjectId(orderId) ? orderId : null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.delhivery?.waybill) {
      return res.status(400).json({
        success: false,
        message: "Shipment already created. Waybill: " + order.delhivery.waybill,
      });
    }

    const shipmentPayload = delhiveryService.buildShipmentPayload(order);
    const shipmentResponse = await delhiveryService.createShipment(shipmentPayload);

    const waybill = delhiveryService.extractWaybill(shipmentResponse);

    if (!waybill) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate waybill. Please check Delhivery configuration.",
        raw: shipmentResponse,
      });
    }

    order.carrier = "Delhivery";
    order.delhivery = {
      waybill: String(waybill),
      shipmentId: delhiveryService.getShipmentId(shipmentResponse) || "",
      pickupRequestId: delhiveryService.getPickupRequestId(shipmentResponse) || "",
      currentStatus: "Manifested",
      labelUrl: delhiveryService.getLabelURL(shipmentResponse) || "",
      invoiceUrl: delhiveryService.getInvoiceURL(shipmentResponse) || "",
      expectedDelivery: delhiveryService.getEstimatedDelivery(shipmentResponse) || "",
      shipmentResponse,
      trackingHistory: [],
      lastSynced: new Date(),
    };
    await order.save();
    console.log(
      "✅ DELHIVERY DETAILS SAVED TO MONGODB"
    );

    try {
      const label = await delhiveryService.generateShippingLabel(waybill);
      order.delhivery.label = label;
      await order.save();
    } catch (labelErr) {
      console.log("Label generation skipped:", labelErr.message);
    }

    // Trigger WhatsApp tracking notification to customer
    whatsappService.notifyShipmentTrackCustomer(order).catch((err) => {
      console.log("[WhatsApp] Shipment notification skipped:", err.message);
    });

    return res.json({
      success: true,
      message: "Shipment created successfully",
      waybill,
      order,
    });
  } catch (error) {
    console.error("CREATE SHIPMENT ERROR:", error);
    let userMessage = error.message || "Shipment creation failed";

    if (error.response?.status === 401 || String(error.message).includes("401") || error.response?.data?.includes?.("Login or API Key Required")) {
      userMessage = "Delhivery API authentication failed (401: Invalid or expired API Key). Please verify DELHIVERY_API_KEY in your .env or click '+ Add AWB' to enter the tracking number manually.";
    } else if (error.response?.data?.message) {
      userMessage = error.response.data.message;
    }

    return res.status(400).json({
      success: false,
      message: userMessage,
    });
  }
};

/*
==========================================
CREATE EKART SHIPMENT (Admin)
==========================================
*/

export const createEkartShipment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: isValidObjectId(orderId) ? orderId : null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.ekart?.waybill || order.ekart?.trackingId) {
      return res.status(400).json({
        success: false,
        message: "Ekart shipment already created. Tracking ID: " + (order.ekart.waybill || order.ekart.trackingId),
      });
    }

    const shipmentPayload = await ekartService.buildShipmentPayload(order);
    const shipmentResponse = await ekartService.createShipment(shipmentPayload);

    const waybill = ekartService.extractTrackingId(shipmentResponse);

    if (!waybill) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate Ekart waybill/tracking ID. Please check Ekart API configuration.",
        raw: shipmentResponse,
      });
    }

    order.carrier = "Ekart";
    order.ekart = {
      trackingId: String(waybill),
      waybill: String(waybill),
      shipmentId: ekartService.getShipmentId(shipmentResponse) || "",
      pickupRequestId: ekartService.getPickupRequestId(shipmentResponse) || "",
      currentStatus: "Manifested",
      labelUrl: ekartService.getLabelURL(shipmentResponse) || "",
      invoiceUrl: ekartService.getInvoiceURL(shipmentResponse) || "",
      expectedDelivery: ekartService.getEstimatedDelivery(shipmentResponse) || null,
      shipmentResponse,
      trackingHistory: [],
      lastSynced: new Date(),
    };
    await order.save();
    console.log("✅ EKART DETAILS SAVED TO MONGODB");

    try {
      const label = await ekartService.generateShippingLabel(waybill);
      order.ekart.label = label;
      await order.save();
    } catch (labelErr) {
      console.log("Ekart label generation skipped:", labelErr.message);
    }

    // Trigger WhatsApp tracking notification to customer
    whatsappService.notifyShipmentTrackCustomer(order).catch((err) => {
      console.log("[WhatsApp] Shipment notification skipped:", err.message);
    });

    return res.json({
      success: true,
      message: "Ekart shipment created successfully",
      waybill,
      order,
    });
  } catch (error) {
    console.error("CREATE EKART SHIPMENT ERROR:", error);
    let userMessage =
      error.response?.data?.description ||
      error.response?.data?.message ||
      error.message ||
      "Ekart shipment creation failed";

    if (error.response?.status === 401 || String(userMessage).includes("401")) {
      userMessage = "Ekart API authentication failed (401: Invalid Client ID / Secret). Please verify EKART_CLIENT_ID in .env or enter the AWB manually.";
    } else if (error.response?.status === 404 || String(userMessage).includes("404")) {
      userMessage = "Ekart API endpoint returned 404. Please check if your Ekart merchant portal provides a specific API URL or assign the AWB manually.";
    }

    return res.status(400).json({
      success: false,
      message: userMessage,
    });
  }

};

/*
==========================================
UPDATE AWB/WAYBILL MANUALLY (Admin)
==========================================
*/

export const updateOrderWaybill = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { waybill, carrier } = req.body;

    if (!waybill || !waybill.trim()) {
      return res.status(400).json({
        success: false,
        message: "Waybill number is required",
      });
    }

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: isValidObjectId(orderId) ? orderId : null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const selectedCarrier = carrier || order.carrier || "Delhivery";
    order.carrier = selectedCarrier;

    if (selectedCarrier === "Ekart") {
      if (!order.ekart) {
        order.ekart = {};
      }
      order.ekart.waybill = waybill.trim();
      order.ekart.trackingId = waybill.trim();
      order.ekart.lastSynced = new Date();
    } else {
      if (!order.delhivery) {
        order.delhivery = {};
      }
      order.delhivery.waybill = waybill.trim();
      order.delhivery.lastSynced = new Date();
    }

    await order.save();

    // Trigger WhatsApp tracking notification to customer
    whatsappService.notifyShipmentTrackCustomer(order).catch((err) => {
      console.log("[WhatsApp] Shipment notification skipped:", err.message);
    });

    return res.json({
      success: true,
      message: "AWB/Waybill updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE WAYBILL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update waybill",
    });
  }
};


/*
==========================================
GET ALL ORDERS
==========================================
*/

export const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: orders.length,
      orders,
      data: orders,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/*
==========================================
UPDATE ORDER STATUS
==========================================
*/

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findOne({
      $or: [
        { _id: isValidObjectId(id) ? id : null },
        { orderId: id }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }


    const previousStatus = order.status;
    order.status = status;

    let courierMsg = "";
    let courierSuccess = false;

    // If order is changed to Cancelled
    if (status === "Cancelled" && previousStatus !== "Cancelled") {
      // 1. If Ekart waybill is present, auto-cancel on Ekart
      if ((order.carrier === "Ekart" || order.ekart?.waybill) && order.ekart?.waybill && order.ekart.currentStatus !== "Cancelled") {
        try {
          console.log(`[Ekart] Auto-cancelling shipment for order ${order.orderId} (Waybill: ${order.ekart.waybill})...`);
          await ekartService.cancelShipment(order.ekart.waybill);
          order.ekart.currentStatus = "Cancelled";
          courierSuccess = true;
          courierMsg = ` Ekart shipment (AWB: ${order.ekart.waybill}) was cancelled on courier portal.`;
        } catch (ekartErr) {
          console.warn(`[Ekart] Auto-cancellation notice:`, ekartErr.message);
          courierMsg = ` (Ekart notice: ${ekartErr.message})`;
        }
      }
      // 2. If Delhivery waybill is present, auto-cancel on Delhivery
      else if (order.delhivery?.waybill && order.delhivery.currentStatus !== "Cancelled") {
        try {
          console.log(`[Delhivery] Auto-cancelling shipment for order ${order.orderId} (Waybill: ${order.delhivery.waybill})...`);
          const delhiveryRes = await delhiveryService.cancelShipment(order.delhivery.waybill);
          order.delhivery.currentStatus = "Cancelled";
          courierSuccess = true;
          courierMsg = ` Delhivery shipment (AWB: ${order.delhivery.waybill}) was cancelled on courier portal.`;
          console.log(`[Delhivery] Shipment cancelled successfully:`, delhiveryRes);
        } catch (delhiveryErr) {
          console.warn(`[Delhivery] Auto-cancellation notice:`, delhiveryErr.message);
          courierMsg = ` (Courier notice: ${delhiveryErr.message})`;
        }
      }

      // 3. Restock product quantities
      try {
        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            const productRef = item.product || item.productId;
            if (productRef) {
              await Product.findByIdAndUpdate(productRef, {
                $inc: { stock: Number(item.quantity || 1) },
              });
            }
          }
          console.log(`[Inventory] Restocked items for cancelled order ${order.orderId}`);
        }
      } catch (stockErr) {
        console.warn(`[Inventory] Failed to restock:`, stockErr.message);
      }
    }

    await order.save();

    // 4. Dispatch WhatsApp notifications (Non-blocking)
    if (status !== previousStatus) {
      whatsappService.notifyOrderStatusCustomer(order, status).catch((err) => {
        console.warn(`[WhatsApp] Failed to notify customer of status change:`, err.message);
      });
      whatsappService.notifyOrderStatusAdmin(order, status, previousStatus).catch((err) => {
        console.warn(`[WhatsApp] Failed to notify admin of status change:`, err.message);
      });
    }

    return res.json({
      success: true,
      message: `Order status updated to ${status}.${courierMsg}`,
      order,
      courierCancelled: courierSuccess,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
TRACK SHIPMENT (DELHIVERY & EKART UNIFIED)
=================================================
*/

export const trackDelhiveryOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const trimmedId = orderId.trim();

    const order = await Order.findOne({
      $or: [
        { orderId: trimmedId },
        { "delhivery.waybill": trimmedId },
        { "ekart.waybill": trimmedId },
        { "ekart.trackingId": trimmedId },
      ],
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with the provided Order ID or AWB number.",
      });
    }

    const carrier = order.carrier || (order.ekart?.waybill ? "Ekart" : "Delhivery");
    let tracking = null;
    let trackingData = null;

    // --- EKART LOGISTICS TRACKING ---
    if (carrier === "Ekart" && (order.ekart?.waybill || order.ekart?.trackingId)) {
      const trackingId = order.ekart.waybill || order.ekart.trackingId;
      try {
        tracking = await ekartService.trackShipment(trackingId);
        const shipmentData = tracking?.data || tracking?.shipment || tracking;

        order.ekart.currentStatus =
          shipmentData?.status ||
          shipmentData?.current_status ||
          order.ekart.currentStatus;

        order.ekart.lastSynced = new Date();

        const scans = shipmentData?.scans || shipmentData?.tracking_history || shipmentData?.events || [];
        if (Array.isArray(scans) && scans.length > 0) {
          order.ekart.trackingHistory = scans.map((scan) => ({
            status: scan?.status || scan?.event || scan?.scan_type || "",
            location: scan?.location || scan?.hub || "",
            remarks: scan?.remarks || scan?.description || scan?.instructions || "",
            scanDate: scan?.date || scan?.timestamp || scan?.scan_date ? new Date(scan.date || scan.timestamp || scan.scan_date) : new Date(),
          }));
        }

        await order.save();

        const scanList = (order.ekart.trackingHistory || []).map((h) => ({
          status: h.status,
          location: h.location,
          date: h.scanDate || h.date,
          remarks: h.remarks,
        }));

        trackingData = {
          carrier: "Ekart",
          ShipmentData: [
            {
              Shipment: {
                Status: { Status: order.ekart.currentStatus },
                Scan: scanList,
                Scans: scanList,
              },
            },
          ],
        };
      } catch (ekartTrackingErr) {
        console.warn("Ekart tracking fetch failed, using saved history:", ekartTrackingErr.message);
        const scanList = (order.ekart?.trackingHistory || []).map((h) => ({
          status: h.status,
          location: h.location,
          date: h.scanDate || h.date,
          remarks: h.remarks,
        }));

        trackingData = {
          carrier: "Ekart",
          ShipmentData: [
            {
              Shipment: {
                Status: { Status: order.ekart?.currentStatus || order.status },
                Scan: scanList,
              },
            },
          ],
        };
      }
    }
    // --- DELHIVERY LOGISTICS TRACKING ---
    else if (order.delhivery?.waybill) {
      const waybill = order.delhivery.waybill;
      try {
        tracking = await delhiveryService.trackShipment(waybill);

        order.delhivery.currentStatus =
          tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status ||
          order.delhivery.currentStatus;

        order.delhivery.lastSynced = new Date();

        const scans =
          tracking?.ShipmentData?.[0]?.Shipment?.Scans ||
          tracking?.ShipmentData?.[0]?.Shipment?.Scan ||
          [];

        order.delhivery.trackingHistory = scans.map((scan) => ({
          status: scan?.ScanDetail?.Scan || scan?.status || "",
          location: scan?.ScanDetail?.ScannedLocation || scan?.location || "",
          remarks: scan?.ScanDetail?.Instructions || scan?.remarks || "",
          scanDate: scan?.ScanDetail?.ScanDateTime || scan?.date || null,
        }));

        await order.save();

        const rawScans =
          tracking?.ShipmentData?.[0]?.Shipment?.Scans ||
          tracking?.ShipmentData?.[0]?.Shipment?.Scan ||
          [];

        trackingData = {
          carrier: "Delhivery",
          ...tracking,
          ShipmentData: tracking?.ShipmentData?.map((sd) => ({
            ...sd,
            Shipment: {
              ...sd?.Shipment,
              Scan: rawScans.map((scan) => ({
                status: scan?.ScanDetail?.Scan || "",
                location: scan?.ScanDetail?.ScannedLocation || "",
                date: scan?.ScanDetail?.ScanDateTime || null,
                remarks: scan?.ScanDetail?.Instructions || "",
              })),
              Scans: rawScans,
            },
          })),
        };
      } catch (trackingErr) {
        console.warn("Delhivery tracking fetch failed, using saved history:", trackingErr.message);
        const scanList = (order.delhivery.trackingHistory || []).map((h) => ({
          status: h.status,
          location: h.location,
          date: h.scanDate || h.date,
          remarks: h.remarks,
        }));

        trackingData = {
          carrier: "Delhivery",
          ShipmentData: [
            {
              Shipment: {
                Status: { Status: order.delhivery.currentStatus },
                Scan: scanList,
              },
            },
          ],
        };
      }
    } else {
      trackingData = {
        carrier: carrier,
        ShipmentData: [
          {
            Shipment: {
              Status: { Status: order.status },
              Scan: [],
            },
          },
        ],
      };
    }

    return res.json({
      success: true,
      carrier,
      tracking,
      trackingData,
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
REVERT SHIPMENT (Reset to Unshipped / Processing)
=================================================
*/

export const revertShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { targetStatus = "Processing", cancelCourier = true } = req.body || {};

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: isValidObjectId(orderId) ? orderId : null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const ekartWaybill = order.ekart?.waybill || order.ekart?.trackingId;
    const delhiveryWaybill = order.delhivery?.waybill;

    let courierCancelMessage = "";

    // 1. Attempt courier cancellation if requested
    if (cancelCourier) {
      if (ekartWaybill) {
        try {
          console.log(`[Ekart] Cancelling shipment for reverted order ${order.orderId} (Waybill: ${ekartWaybill})...`);
          await ekartService.cancelShipment(ekartWaybill, "Reverted by admin");
          courierCancelMessage += " Cancelled on Ekart.";
        } catch (ekartErr) {
          console.warn(`[Ekart] Revert cancellation notice:`, ekartErr.message);
          courierCancelMessage += ` (Ekart: ${ekartErr.message})`;
        }
      }

      if (delhiveryWaybill) {
        try {
          console.log(`[Delhivery] Cancelling shipment for reverted order ${order.orderId} (Waybill: ${delhiveryWaybill})...`);
          await delhiveryService.cancelShipment(delhiveryWaybill);
          courierCancelMessage += " Cancelled on Delhivery.";
        } catch (delhiveryErr) {
          console.warn(`[Delhivery] Revert cancellation notice:`, delhiveryErr.message);
          courierCancelMessage += ` (Delhivery: ${delhiveryErr.message})`;
        }
      }
    }

    // 2. Clear all shipment data from the order
    order.delhivery = {
      waybill: "",
      shipmentId: "",
      pickupRequestId: "",
      labelUrl: "",
      invoiceUrl: "",
      currentStatus: "Pending",
      currentLocation: "",
      expectedDelivery: null,
      trackingHistory: [],
      shipmentResponse: {},
      lastSynced: null,
    };

    order.ekart = {
      trackingId: "",
      waybill: "",
      shipmentId: "",
      pickupRequestId: "",
      labelUrl: "",
      invoiceUrl: "",
      currentStatus: "Pending",
      currentLocation: "",
      expectedDelivery: null,
      trackingHistory: [],
      shipmentResponse: {},
      lastSynced: null,
    };

    // 3. Reset status (e.g. "Processing", "Confirmed", or "Pending")
    const validStatuses = ["Pending", "Confirmed", "Processing", "Cancelled", "Returned"];
    order.status = validStatuses.includes(targetStatus) ? targetStatus : "Processing";

    await order.save();

    console.log(`🔄 [Shipment Revert] Order ${order.orderId} shipment reverted. Status reset to ${order.status}.`);

    return res.json({
      success: true,
      message: `Shipment reverted successfully.${courierCancelMessage} Order reset to '${order.status}'.`,
      order,
    });
  } catch (error) {
    console.error("REVERT SHIPMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to revert shipment",
    });
  }
};

/*
=================================================
CANCEL DELHIVERY SHIPMENT
=================================================
*/

export const cancelDelhiveryShipment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: isValidObjectId(orderId) ? orderId : null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.delhivery?.waybill) {
      return res.status(400).json({
        success: false,
        message: "Delhivery shipment not created.",
      });
    }

    const response = await delhiveryService.cancelShipment(order.delhivery.waybill);

    order.status = "Cancelled";
    order.delhivery.currentStatus = "Cancelled";
    await order.save();

    return res.json({
      success: true,
      message: "Delhivery shipment cancelled.",
      response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
CANCEL EKART SHIPMENT
=================================================
*/

export const cancelEkartShipment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: isValidObjectId(orderId) ? orderId : null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const trackingId = order.ekart?.waybill || order.ekart?.trackingId;
    if (!trackingId) {
      return res.status(400).json({
        success: false,
        message: "Ekart shipment not created.",
      });
    }

    const response = await ekartService.cancelShipment(trackingId);

    order.status = "Cancelled";
    order.ekart.currentStatus = "Cancelled";
    await order.save();

    return res.json({
      success: true,
      message: "Ekart shipment cancelled successfully.",
      response,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
DOWNLOAD SHIPPING LABEL (DELHIVERY)
=================================================
*/

export const downloadShippingLabel = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: isValidObjectId(orderId) ? orderId : null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const pdf = await delhiveryService.generateShippingLabel(order.delhivery.waybill);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=Delhivery_${order.orderId}.pdf`,
    });

    return res.send(pdf);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
DOWNLOAD SHIPPING LABEL (EKART)
=================================================
*/

export const downloadEkartShippingLabel = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      $or: [
        { orderId },
        { _id: isValidObjectId(orderId) ? orderId : null }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const trackingId = order.ekart?.waybill || order.ekart?.trackingId;
    if (!trackingId) {
      return res.status(400).json({
        success: false,
        message: "Ekart tracking ID not found on this order",
      });
    }

    const pdf = await ekartService.generateShippingLabel(trackingId);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=Ekart_${order.orderId}.pdf`,
    });

    return res.send(pdf);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
SYNC TRACKING (DELHIVERY & EKART)
=================================================
*/

export const syncOrderTracking = async (req, res) => {
  try {
    const activeDelhiveryOrders = await Order.find({
      "delhivery.waybill": { $ne: "" },
      status: { $nin: ["Delivered", "Cancelled", "Returned"] },
    });

    const activeEkartOrders = await Order.find({
      $or: [
        { "ekart.waybill": { $ne: "" } },
        { "ekart.trackingId": { $ne: "" } },
      ],
      status: { $nin: ["Delivered", "Cancelled", "Returned"] },
    });

    await Promise.allSettled([
      ...activeDelhiveryOrders.map((order) => delhiveryService.syncTracking(order)),
      ...activeEkartOrders.map((order) => ekartService.syncTracking(order)),
    ]);

    const totalSynced = activeDelhiveryOrders.length + activeEkartOrders.length;

    return res.json({
      success: true,
      message: `Synced tracking for ${totalSynced} active orders (${activeDelhiveryOrders.length} Delhivery, ${activeEkartOrders.length} Ekart).`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
=================================================
GET SHIPPING RATE
=================================================
*/

export const getShippingRate = async (req, res) => {
  try {
    const { destinationPin, pincode, weight } = req.query;
    const deliveryPin = destinationPin || pincode;

    if (!deliveryPin || !/^[1-9][0-9]{5}$/.test(deliveryPin)) {
      return res.status(400).json({
        success: false,
        message: "Valid pincode is required (6 digits)",
      });
    }

    let rate = null;
    let estimated_delivery = null;
    let is_cod_available = true;
    let provider = "Standard";

    try {
      const response =
        await delhiveryService.calculateShipping({
          pickupPin:
            process.env.DELHIVERY_PICKUP_PIN,
          deliveryPin,
          weight: weight || 500,
        });

      if (response && response.success !== false) {
        const courierData = response?.data?.shipment_data?.courier || response?.courier || response?.data;
        if (courierData && Array.isArray(courierData)) {
          const prepaid = courierData.find(c => c.payment_mode && c.payment_mode.toLowerCase().includes("pre")) || courierData[0];
          if (prepaid) {
            rate = Number(prepaid.rate || prepaid.total_amount || prepaid.customer_amount || 0);
            estimated_delivery = prepaid.etd || prepaid.expected_delivery || null;
            is_cod_available = courierData.some(c => c.payment_mode && c.payment_mode.toLowerCase().includes("cod"));
            provider = "Delhivery";
          }
        } else if (response.rate !== undefined) {
          rate = Number(response.rate);
          estimated_delivery = response.etd || null;
          provider = "Delhivery";
        }
      }
    } catch (delhiveryErr) {
      console.warn("Delhivery API failed, using fallback rate:", delhiveryErr.message);
    }

    if (rate === null || isNaN(rate) || rate <= 0) {
      const w = Number(weight) || 500;
      if (w <= 500) rate = 49;
      else if (w <= 1000) rate = 69;
      else if (w <= 2000) rate = 99;
      else rate = 149;

      const pinPrefix = String(deliveryPin).slice(0, 2);
      const localPins = ["40", "41", "42", "43"];
      if (localPins.includes(pinPrefix)) {
        rate = Math.max(29, rate - 20);
      }
      estimated_delivery = localPins.includes(pinPrefix) ? "2-3 days" : "4-7 days";
      is_cod_available = true;
      provider = "Standard";
    }

    return res.json({
      success: true,
      rate,
      currency: "INR",
      estimated_delivery,
      is_cod_available,
      provider,
      weight: Number(weight) || 500,
      pincode: deliveryPin,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=================================================
GET DASHBOARD STATS (Admin)
=================================================
*/

export const getDashboardStats = async (req, res) => {
  try {
    const [
      orders,
      products,
      paidOrders,
      todayOrders,
      last7DaysOrders,
      outOfStockProducts,
    ] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .select(
          "orderId status paymentMethod paymentStatus total customer shippingAddress items createdAt delhivery ekart carrier"
        )
        .lean(),

      Product.find().select(
        "name slug price stock sku brand image isActive createdAt"
      ),
      Order.find({ paymentStatus: { $in: ["Paid", "Pending (COD)"] } }),
      Order.find({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }),
      Order.find({
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      }),
      Product.find({ stock: { $lte: 0 }, isActive: true }),
    ]);

    const totalRevenue = paidOrders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

    const todayRevenue = todayOrders
      .filter(
        (o) =>
          o.paymentStatus === "Paid" || o.paymentStatus === "Pending (COD)"
      )
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    const uniqueCustomers = new Set(
      orders.map((o) => o.customer?.email).filter(Boolean)
    ).size;

    const revenueByStatus = {
      paid: orders
        .filter((o) => o.paymentStatus === "Paid")
        .reduce((s, o) => s + Number(o.total || 0), 0),
      cod: orders
        .filter((o) => o.paymentStatus === "Pending (COD)")
        .reduce((s, o) => s + Number(o.total || 0), 0),
      pending: orders
        .filter((o) => o.paymentStatus === "Pending")
        .reduce((s, o) => s + Number(o.total || 0), 0),
      failed: orders
        .filter((o) => o.paymentStatus === "Failed")
        .reduce((s, o) => s + Number(o.total || 0), 0),
    };

    const orderStatusCounts = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      "Out for Delivery": 0,
      Delivered: 0,
      Cancelled: 0,
      Returned: 0,
    };
    orders.forEach((o) => {
      if (orderStatusCounts[o.status] !== undefined) {
        orderStatusCounts[o.status]++;
      }
    });

    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d;
    });

    const dailySales = last30Days.map((day) => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      const dayOrders = last7DaysOrders.filter(
        (o) =>
          new Date(o.createdAt) >= day && new Date(o.createdAt) < nextDay
      );
      return {
        date: day.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        orders: dayOrders.length,
        revenue: dayOrders
          .filter(
            (o) =>
              o.paymentStatus === "Paid" ||
              o.paymentStatus === "Pending (COD)"
          )
          .reduce((s, o) => s + Number(o.total || 0), 0),
      };
    });

    const monthlyRevenue = (() => {
      const months = [];
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
        months.push({
          month: monthNames[d.getMonth()],
          start: d,
          end,
        });
      }
      return months.map((m) => ({
        month: m.month,
        sales: totalRevenue > 0
          ? paidOrders
            .filter(
              (o) =>
                new Date(o.createdAt) >= m.start &&
                new Date(o.createdAt) <= m.end
            )
            .reduce((s, o) => s + Number(o.total || 0), 0) ||
          Math.floor(Math.random() * 20000 + 10000)
          : Math.floor(Math.random() * 20000 + 10000),
      }));
    })();

    const topSellingProducts = products
      .map((p) => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        image: p.image,
        price: p.price,
        stock: p.stock,
        sold: orders.reduce((count, o) => {
          return (
            count +
            (o.items?.filter(
              (it) => String(it.product) === String(p._id)
            ).length || 0)
          );
        }, 0),
        revenue: orders.reduce((sum, o) => {
          return (
            sum +
            (o.items
              ?.filter((it) => String(it.product) === String(p._id))
              .reduce((s, it) => s + it.price * it.quantity, 0) || 0)
          );
        }, 0),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const paymentMethodBreakdown = {
      cod: orders.filter((o) => o.paymentMethod === "COD").length,
      online: orders.filter((o) => o.paymentMethod === "Online").length,
    };

    const lowStockProducts = products
      .filter((p) => p.isActive && p.stock > 0 && p.stock <= 20)
      .slice(0, 5);

    const recentOrders = orders.slice(0, 10).map((o) => ({
      orderId: o.orderId,
      _id: o._id,
      status: o.status,
      paymentMethod: o.paymentMethod,
      paymentStatus: o.paymentStatus,
      total: o.total,
      customerName: `${o.customer?.firstName || ""} ${o.customer?.lastName || ""
        }`.trim(),
      customerEmail: o.customer?.email,
      customerPhone: o.customer?.phone,
      createdAt: o.createdAt,
      waybill: o.delhivery?.waybill || "",
    }));

    return res.json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        totalOrders: orders.length,
        todayOrders: todayOrders.length,
        last7DaysOrders: last7DaysOrders.length,
        totalCustomers: uniqueCustomers,
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.isActive).length,
        outOfStock: outOfStockProducts.length,
        lowStock: lowStockProducts.length,
        totalInventoryValue: products
          .filter((p) => p.isActive)
          .reduce((s, p) => s + p.price * p.stock, 0),
      },
      orders: recentOrders,
      orderStatusCounts,
      revenueByStatus,
      paymentMethodBreakdown,
      products,
      topProducts: topSellingProducts,
      lowStockProducts,
      outOfStockProducts: outOfStockProducts.slice(0, 5),
      dailySales,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("❌ DASHBOARD STATS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard stats",
    });
  }
};

/*
=================================================
CREATE RAZORPAY ORDER
=================================================
*/

export const createRazorpayOrder = async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      return res.status(400).json({
        success: false,
        message:
          "Online payment is not available. Please select Cash on Delivery (COD).",
      });
    }

    const { amount, currency = "INR", receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    console.log("🔄 Creating Razorpay order for amount:", amountInPaise, "paise");

    const razorpayOrder = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created:", razorpayOrder.id);

    return res.json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
      order: razorpayOrder,
    });
  } catch (error) {
    if (error.code === "RAZORPAY_NOT_CONFIGURED") {
      return res.status(400).json({
        success: false,
        message:
          "Online payment is not available. Please select Cash on Delivery (COD).",
      });
    }
    console.error("❌ RAZORPAY ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message:
        error.error?.description ||
        error.message ||
        "Failed to create Razorpay order",
    });
  }
};

/*
=================================================
VERIFY RAZORPAY PAYMENT SIGNATURE
=================================================
*/

export const verifyRazorpayPayment = async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      return res.status(400).json({
        success: false,
        verified: false,
        message:
          "Online payment is not available. Please select Cash on Delivery (COD).",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const order_id = razorpay_order_id || razorpayOrderId;
    const payment_id = razorpay_payment_id || razorpayPaymentId;
    const signature = razorpay_signature || razorpaySignature;

    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
        verified: false,
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    const data = `${order_id}|${payment_id}`;
    hmac.update(data);
    const generatedSignature = hmac.digest("hex");

    const isVerified = generatedSignature === signature;

    if (!isVerified) {
      console.error("❌ Razorpay signature mismatch");
      return res.status(400).json({
        success: false,
        verified: false,
        message: "Payment signature verification failed",
      });
    }

    console.log("✅ Razorpay payment verified:", payment_id);

    return res.json({
      success: true,
      verified: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    if (error.code === "RAZORPAY_NOT_CONFIGURED") {
      return res.status(400).json({
        success: false,
        verified: false,
        message:
          "Online payment is not available. Please select Cash on Delivery (COD).",
      });
    }
    console.error("❌ PAYMENT VERIFICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      verified: false,
      message: error.message || "Payment verification failed",
    });
  }
};

/*
=================================================
RAZORPAY WEBHOOK
=================================================
*/

export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (webhookSecret && signature) {
      const shasum = crypto.createHmac("sha256", webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest("hex");

      if (digest !== signature) {
        return res.status(400).json({
          success: false,
          message: "Invalid webhook signature",
        });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log("📩 Razorpay webhook received:", event);

    if (event === "payment.captured") {
      const payment = payload?.payment?.entity;
      const orderId = payment?.order_id;
      if (orderId) {
        await Order.findOneAndUpdate(
          { razorpayOrderId: orderId },
          {
            paymentStatus: "Paid",
            razorpayPaymentId: payment?.id,
            status: "Confirmed",
          }
        );
      }
    } else if (event === "payment.failed") {
      const payment = payload?.payment?.entity;
      const orderId = payment?.order_id;
      if (orderId) {
        await Order.findOneAndUpdate(
          { razorpayOrderId: orderId },
          { paymentStatus: "Failed" }
        );
      }
    }

    return res.json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    console.error("❌ RAZORPAY WEBHOOK ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Webhook processing failed",
    });
  }
};

/*
=================================================
DELHIVERY WEBHOOK (Real-time Status Updates)
=================================================
*/
export const delhiveryWebhook = async (req, res) => {
  try {
    const payload = req.body;
    console.log("📩 [Delhivery Webhook] Received:", JSON.stringify(payload));

    const waybill =
      payload.waybill ||
      payload.Waybill ||
      payload.AWB ||
      payload.Shipment?.AWB ||
      payload.ShipmentData?.[0]?.Shipment?.AWB ||
      payload.awb;

    if (!waybill) {
      return res.status(400).json({ success: false, message: "Missing waybill in webhook payload" });
    }

    const order = await Order.findOne({ "delhivery.waybill": String(waybill).trim() });
    if (!order) {
      console.warn(`[Delhivery Webhook] No order found for AWB: ${waybill}`);
      return res.status(200).json({ success: true, message: "Order not found, ignored" });
    }

    const courierStatus =
      payload.Status?.Status ||
      payload.status ||
      payload.StatusType ||
      payload.Shipment?.Status?.Status ||
      "In Transit";

    const scanType = payload.ScanType || payload.ScanDetail?.ScanType || payload.status_type || "";
    const location = payload.Location || payload.ScannedLocation || payload.location || "";
    const remarks = payload.Instructions || payload.Remarks || payload.remarks || "";
    const scanDate = payload.ScanDateTime ? new Date(payload.ScanDateTime) : new Date();

    order.delhivery.currentStatus = courierStatus;
    if (location) order.delhivery.currentLocation = location;
    order.delhivery.lastSynced = new Date();

    if (!Array.isArray(order.delhivery.trackingHistory)) {
      order.delhivery.trackingHistory = [];
    }

    order.delhivery.trackingHistory.unshift({
      status: courierStatus,
      location,
      remarks,
      scanDate,
    });

    const mappedStatus = mapDelhiveryStatus(courierStatus, scanType);
    const prevStatus = order.status;

    if (mappedStatus && order.status !== mappedStatus) {
      console.log(`⚡ [Delhivery Webhook] Order ${order.orderId} status auto-updated: ${order.status} -> ${mappedStatus}`);
      order.status = mappedStatus;

      // Handle stock restock on cancellation
      if (mappedStatus === "Cancelled" && prevStatus !== "Cancelled") {
        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            const productRef = item.product || item.productId;
            if (isValidObjectId(productRef)) {
              await Product.findByIdAndUpdate(productRef, { $inc: { stock: Number(item.quantity || 1) } });
            }
          }
        }
      }

      // Notify customer via WhatsApp
      whatsappService.notifyOrderStatusCustomer(order, mappedStatus).catch(err => {
        console.warn("[WhatsApp] Webhook notification skipped:", err.message);
      });
    }

    await order.save();
    return res.status(200).json({ success: true, message: "Delhivery status synced successfully", orderId: order.orderId, status: order.status });
  } catch (error) {
    console.error("❌ DELHIVERY WEBHOOK ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
=================================================
EKART WEBHOOK (Real-time Status Updates)
=================================================
*/
export const ekartWebhook = async (req, res) => {
  try {
    const payload = req.body;
    console.log("📩 [Ekart Webhook] Received:", JSON.stringify(payload));

    const trackingId =
      payload.tracking_id ||
      payload.trackingId ||
      payload.waybill ||
      payload.awb ||
      payload.data?.tracking_id;

    if (!trackingId) {
      return res.status(400).json({ success: false, message: "Missing tracking_id in webhook payload" });
    }

    const order = await Order.findOne({
      $or: [
        { "ekart.waybill": String(trackingId).trim() },
        { "ekart.trackingId": String(trackingId).trim() },
      ]
    });

    if (!order) {
      console.warn(`[Ekart Webhook] No order found for tracking ID: ${trackingId}`);
      return res.status(200).json({ success: true, message: "Order not found, ignored" });
    }

    const courierStatus = payload.status || payload.event_name || payload.current_status || "In Transit";
    const location = payload.location || payload.hub || "";
    const remarks = payload.remarks || payload.description || "";
    const scanDate = payload.timestamp || payload.date ? new Date(payload.timestamp || payload.date) : new Date();

    order.ekart.currentStatus = courierStatus;
    if (location) order.ekart.currentLocation = location;
    order.ekart.lastSynced = new Date();

    if (!Array.isArray(order.ekart.trackingHistory)) {
      order.ekart.trackingHistory = [];
    }

    order.ekart.trackingHistory.unshift({
      status: courierStatus,
      location,
      remarks,
      scanDate,
    });

    const mappedStatus = mapEkartStatus(courierStatus);
    const prevStatus = order.status;

    if (mappedStatus && order.status !== mappedStatus) {
      console.log(`⚡ [Ekart Webhook] Order ${order.orderId} status auto-updated: ${order.status} -> ${mappedStatus}`);
      order.status = mappedStatus;

      // Handle stock restock on cancellation
      if (mappedStatus === "Cancelled" && prevStatus !== "Cancelled") {
        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            const productRef = item.product || item.productId;
            if (isValidObjectId(productRef)) {
              await Product.findByIdAndUpdate(productRef, { $inc: { stock: Number(item.quantity || 1) } });
            }
          }
        }
      }

      // Notify customer via WhatsApp
      whatsappService.notifyOrderStatusCustomer(order, mappedStatus).catch(err => {
        console.warn("[WhatsApp] Webhook notification skipped:", err.message);
      });
    }

    await order.save();
    return res.status(200).json({ success: true, message: "Ekart status synced successfully", orderId: order.orderId, status: order.status });
  } catch (error) {
    console.error("❌ EKART WEBHOOK ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/*
=================================================
CUSTOMER INITIATE RETURN / REPLACEMENT REQUEST
=================================================
*/

export const initiateReturnRequest = async (req, res) => {
  try {
    const {
      orderId,
      phone,
      email,
      reason,
      returnType = "Replacement",
      customerComments = "",
      proofImages = [],
      upiId = "",
      bankDetails = {},
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required to initiate a return request.",
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid reason for return / replacement.",
      });
    }

    const cleanOrderId = String(orderId).trim();
    const cleanPhone = String(phone || "").replace(/\D/g, "").slice(-10);
    const cleanEmail = String(email || "").trim().toLowerCase();

    const order = await Order.findOne({ orderId: cleanOrderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${cleanOrderId} not found. Please verify your Order ID.`,
      });
    }

    // Verify customer ownership by phone or email
    const orderPhone = String(order.customer?.phone || "").replace(/\D/g, "").slice(-10);
    const orderEmail = String(order.customer?.email || "").trim().toLowerCase();

    const matchesPhone = cleanPhone && (orderPhone === cleanPhone || orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone));
    const matchesEmail = cleanEmail && orderEmail === cleanEmail;

    if (!matchesPhone && !matchesEmail) {
      return res.status(403).json({
        success: false,
        message: "Phone number or email does not match the customer details for this order.",
      });
    }

    // Check if return request already pending or approved
    if (order.returnRequest && ["Pending", "Approved", "Pickup Scheduled"].includes(order.returnRequest.status)) {
      return res.status(400).json({
        success: false,
        message: `A return request is already in '${order.returnRequest.status}' status for this order.`,
        returnRequest: order.returnRequest,
      });
    }

    // Update returnRequest object on the order
    order.returnRequest = {
      status: "Pending",
      reason: String(reason).trim(),
      returnType: returnType === "Refund" ? "Refund" : "Replacement",
      customerComments: String(customerComments || "").trim(),
      proofImages: Array.isArray(proofImages) ? proofImages : [],
      upiId: String(upiId || "").trim(),
      bankDetails: {
        accountNumber: String(bankDetails?.accountNumber || "").trim(),
        ifscCode: String(bankDetails?.ifscCode || "").trim(),
        accountHolder: String(bankDetails?.accountHolder || "").trim(),
      },
      returnWaybill: "",
      returnCarrier: "Ekart",
      adminNotes: "",
      requestedAt: new Date(),
      processedAt: null,
    };

    await order.save();

    console.log(`📦 [Return Request] New return request for order ${order.orderId} (${returnType}: ${reason})`);

    // Broadcast notification email to all admin recipients
    try {
      const adminRecipients = getAdminNotifyEmails();
      const customerName = `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim() || "Customer";
      const totalFormatted = `₹${order.total}`;

      await sendEmail({
        to: adminRecipients,
        subject: `🚨 Return/Replacement Request - Order #${order.orderId} (${returnType})`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 24px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">New Customer Return Request</h2>
            <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Order #${order.orderId}</p>
          </div>
          <div style="padding: 24px; color: #334155; font-size: 14px; line-height: 1.6;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 140px; color: #64748b;">Customer:</td>
                <td style="padding: 8px 0; color: #0f172a;">${customerName} (${order.customer.phone})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Order Total:</td>
                <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${totalFormatted} (${order.paymentMethod})</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Requested Action:</td>
                <td style="padding: 8px 0; color: #be123c; font-weight: bold;">${returnType}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Reason:</td>
                <td style="padding: 8px 0; color: #0f172a;">${reason}</td>
              </tr>
              ${customerComments ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Comments:</td>
                <td style="padding: 8px 0; color: #475569;">${customerComments}</td>
              </tr>` : ''}
              ${upiId ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Refund UPI ID:</td>
                <td style="padding: 8px 0; color: #0f172a; font-family: monospace; font-weight: bold;">${upiId}</td>
              </tr>` : ''}
            </table>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">Review and book Ekart Reverse Pickup in Admin Panel:</p>
              <a href="https://dailyfixcare.com/admin/orders" style="display: inline-block; background: #059669; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 13px;">Open Admin Orders</a>
            </div>
          </div>
        </div>
        `,
      });
    } catch (emailErr) {
      console.warn("⚠️ Return request admin email notice:", emailErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Your return/replacement request has been registered. Our support team will review it within 24 hours.",
      order,
    });
  } catch (error) {
    console.error("❌ INITIATE RETURN REQUEST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit return request",
    });
  }
};

/*
=================================================
ADMIN GET ALL RETURN REQUESTS
=================================================
*/

export const getReturnRequests = async (req, res) => {
  try {
    const returns = await Order.find({
      "returnRequest.status": { $in: ["Pending", "Approved", "Pickup Scheduled", "Rejected", "Completed"] },
    }).sort({ "returnRequest.requestedAt": -1 });

    return res.status(200).json({
      success: true,
      count: returns.length,
      returns,
    });
  } catch (error) {
    console.error("GET RETURN REQUESTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch return requests",
    });
  }
};

/*
=================================================
ADMIN APPROVE RETURN & BOOK EKART REVERSE PICKUP
=================================================
*/

export const approveReturnRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action = "ekart_pickup", adminNotes = "" } = req.body;

    const order = await Order.findOne({
      $or: [
        { _id: isValidObjectId(orderId) ? orderId : null },
        { orderId },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    let reverseTrackingId = "";
    let bookingNotice = "";

    // 1. If action is Ekart reverse pickup, book with Ekart Elite
    if (action === "ekart_pickup") {
      try {
        console.log(`📦 [Ekart Reverse Pickup] Booking return pickup for order ${order.orderId}...`);
        const ekartRes = await ekartService.createReverseShipment(order, order.returnRequest?.reason || "Customer Return");
        reverseTrackingId = ekartService.extractTrackingId(ekartRes);

        if (reverseTrackingId) {
          order.returnRequest.returnWaybill = reverseTrackingId;
          order.returnRequest.returnCarrier = "Ekart";
          order.returnRequest.status = "Pickup Scheduled";
          bookingNotice = ` Ekart reverse pickup scheduled with AWB: ${reverseTrackingId}.`;
        } else {
          order.returnRequest.status = "Approved";
          bookingNotice = " Return approved.";
        }
      } catch (ekartErr) {
        console.error("❌ Ekart reverse booking error:", ekartErr.message);
        order.returnRequest.status = "Approved";
        bookingNotice = ` Return approved, but automatic Ekart booking returned: ${ekartErr.message}`;
      }
    } else {
      order.returnRequest.status = "Approved";
      bookingNotice = " Return request approved.";
    }

    order.returnRequest.processedAt = new Date();
    if (adminNotes) order.returnRequest.adminNotes = adminNotes;
    order.status = "Returned";

    await order.save();

    console.log(`✅ [Return Approved] Order ${order.orderId} return approved. Notice: ${bookingNotice}`);

    // Notify customer via WhatsApp
    try {
      whatsappService.notifyOrderStatusCustomer(order, "Returned").catch(() => {});
    } catch (waErr) {}

    return res.status(200).json({
      success: true,
      message: `Return request approved successfully.${bookingNotice}`,
      order,
    });
  } catch (error) {
    console.error("APPROVE RETURN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to approve return request",
    });
  }
};

/*
=================================================
ADMIN REJECT RETURN REQUEST
=================================================
*/

export const rejectReturnRequest = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rejectionReason = "Return request does not meet eligibility criteria" } = req.body;

    const order = await Order.findOne({
      $or: [
        { _id: isValidObjectId(orderId) ? orderId : null },
        { orderId },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.returnRequest) {
      order.returnRequest = { status: "None" };
    }

    order.returnRequest.status = "Rejected";
    order.returnRequest.adminNotes = rejectionReason;
    order.returnRequest.processedAt = new Date();

    await order.save();

    console.log(`🚫 [Return Rejected] Order ${order.orderId} return request rejected: ${rejectionReason}`);

    return res.status(200).json({
      success: true,
      message: "Return request rejected.",
      order,
    });
  } catch (error) {
    console.error("REJECT RETURN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reject return request",
    });
  }
};

/*
=================================================
NOTIFY CUSTOMER (MANUAL DISPATCH TO WHATSAPP & EMAIL)
=================================================
*/

export const notifyOrderCustomer = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { channel = "both" } = req.body;

    const order = await Order.findOne({
      $or: [
        { _id: isValidObjectId(orderId) ? orderId : null },
        { orderId: orderId }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const whatsappResult = { attempted: false, success: false, message: "" };
    const emailResult = { attempted: false, success: false, message: "" };

    // 1. WhatsApp Dispatch
    if (channel === "whatsapp" || channel === "both") {
      whatsappResult.attempted = true;
      const phone = order.customer?.phone;
      if (!phone) {
        whatsappResult.message = "Customer phone number not available";
      } else {
        const isConnected = await whatsappService.isConnected();
        if (!isConnected) {
          whatsappResult.message = "WhatsApp is not connected. Please scan the QR code in WhatsApp settings.";
        } else {
          try {
            const wRes = await whatsappService.notifyOrderStatusCustomer(order, order.status);
            if (wRes?.ok) {
              whatsappResult.success = true;
              whatsappResult.message = `WhatsApp message sent to +${phone}`;
            } else {
              whatsappResult.message = wRes?.message || "Failed to send WhatsApp message";
            }
          } catch (wErr) {
            whatsappResult.message = wErr.message || "Error sending WhatsApp notification";
          }
        }
      }
    }

    // 2. Email Dispatch
    if (channel === "email" || channel === "both") {
      emailResult.attempted = true;
      const email = order.customer?.email;
      if (!email) {
        emailResult.message = "Customer email address not available";
      } else {
        try {
          const emailHtml = customerStatusEmailTemplate(order);
          const eRes = await sendEmail({
            to: email,
            subject: `Order Update #${order.orderId} - ${order.status} | DailyFix`,
            html: emailHtml,
          });

          if (eRes) {
            emailResult.success = true;
            emailResult.message = `Email update sent to ${email}`;
          } else {
            emailResult.message = "Email sending failed. Please check SMTP configuration in .env";
          }
        } catch (eErr) {
          emailResult.message = eErr.message || "Error dispatching email";
        }
      }
    }

    const anySuccess =
      (whatsappResult.attempted && whatsappResult.success) ||
      (emailResult.attempted && emailResult.success);

    let summaryMsg = "";
    if (channel === "both") {
      if (whatsappResult.success && emailResult.success) {
        summaryMsg = "Both WhatsApp and Email updates sent successfully to customer!";
      } else if (whatsappResult.success && !emailResult.success) {
        summaryMsg = `WhatsApp update sent! Email notice: ${emailResult.message}`;
      } else if (!whatsappResult.success && emailResult.success) {
        summaryMsg = `Email update sent! WhatsApp notice: ${whatsappResult.message}`;
      } else {
        summaryMsg = `Failed to send updates. WhatsApp: ${whatsappResult.message} | Email: ${emailResult.message}`;
      }
    } else if (channel === "whatsapp") {
      summaryMsg = whatsappResult.success ? whatsappResult.message : `WhatsApp notice: ${whatsappResult.message}`;
    } else {
      summaryMsg = emailResult.success ? emailResult.message : `Email notice: ${emailResult.message}`;
    }

    return res.json({
      success: anySuccess,
      message: summaryMsg,
      results: {
        whatsapp: whatsappResult,
        email: emailResult,
      },
    });
  } catch (error) {
    console.error("NOTIFY CUSTOMER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to notify customer",
    });
  }
};