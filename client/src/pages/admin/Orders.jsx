import { useEffect, useMemo, useState } from "react";
import api, { orderAPI } from "../../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../../components/Avatar";
import Modal from "../../components/Modal";
import {
  Search,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Eye,
  X,
  ExternalLink,
  Package,
  MapPin,
  User,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  RefreshCw,
  Edit2,
  Check,
  Send,
  Zap,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [loadingShipment, setLoadingShipment] = useState("");
  const [editingWaybillOrderId, setEditingWaybillOrderId] = useState(null);
  const [editingWaybillValue, setEditingWaybillValue] = useState("");
  const [savingWaybill, setSavingWaybill] = useState(false);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  // Shipment Creation Modal
  const [shipmentModalOrder, setShipmentModalOrder] = useState(null);
  const [manualWaybill, setManualWaybill] = useState("");
  const [manualCarrier, setManualCarrier] = useState("Ekart");
  const [markAsShipped, setMarkAsShipped] = useState(true);
  const [syncingTracking, setSyncingTracking] = useState(false);

  // Revert Shipment Modal
  const [revertModalOrder, setRevertModalOrder] = useState(null);
  const [revertingShipment, setRevertingShipment] = useState(false);
  const [revertTargetStatus, setRevertTargetStatus] = useState("Processing");
  const [revertCancelCourier, setRevertCancelCourier] = useState(true);

  // Return Request Management
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [approvingReturn, setApprovingReturn] = useState(false);
  const [rejectingReturn, setRejectingReturn] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApproveReturn = async (actionType = "ekart_pickup") => {
    if (!returnModalOrder) return;
    try {
      setApprovingReturn(true);
      toast.loading("Processing return approval & Ekart booking...", { id: "ret-toast" });
      const res = await orderAPI.approveReturn(returnModalOrder._id, { action: actionType });
      if (res.ok) {
        toast.success(res.data?.message || "Return approved & reverse pickup scheduled!", { id: "ret-toast" });
        setReturnModalOrder(null);
        fetchOrders();
      } else {
        toast.error(res.data?.message || "Failed to approve return", { id: "ret-toast" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error approving return", { id: "ret-toast" });
    } finally {
      setApprovingReturn(false);
    }
  };

  const handleRejectReturn = async () => {
    if (!returnModalOrder) return;
    try {
      setRejectingReturn(true);
      toast.loading("Rejecting return request...", { id: "ret-toast" });
      const res = await orderAPI.rejectReturn(returnModalOrder._id, {
        rejectionReason: rejectionReasonInput || "Return request does not meet eligibility criteria",
      });
      if (res.ok) {
        toast.success("Return request rejected", { id: "ret-toast" });
        setReturnModalOrder(null);
        setShowRejectForm(false);
        setRejectionReasonInput("");
        fetchOrders();
      } else {
        toast.error(res.data?.message || "Failed to reject return", { id: "ret-toast" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error rejecting return", { id: "ret-toast" });
    } finally {
      setRejectingReturn(false);
    }
  };

  const handleRevertShipment = async () => {
    if (!revertModalOrder) return;
    try {
      setRevertingShipment(true);
      const result = await orderAPI.revertShipment(revertModalOrder.orderId, {
        targetStatus: revertTargetStatus,
        cancelCourier: revertCancelCourier,
      });
      if (result.ok) {
        toast.success(result.data?.message || "Shipment reverted successfully!");
        setRevertModalOrder(null);
        setTrackingOrder(null);
        if (selectedOrder?._id === revertModalOrder._id) {
          setSelectedOrder(null);
        }
        fetchOrders();
      } else {
        toast.error(result.data?.message || "Failed to revert shipment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to revert shipment");
    } finally {
      setRevertingShipment(false);
    }
  };

  const handleSyncAllTracking = async () => {
    try {
      setSyncingTracking(true);
      toast.loading("Syncing courier statuses with Delhivery & Ekart...", { id: "sync-toast" });
      const res = await api.post("/orders/sync-tracking");
      if (res.data?.success) {
        toast.success(res.data.message || "Courier statuses synced successfully!", { id: "sync-toast" });
        fetchOrders();
      } else {
        toast.error(res.data?.message || "Sync failed", { id: "sync-toast" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to sync courier statuses", { id: "sync-toast" });
    } finally {
      setSyncingTracking(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // 📡 Auto-sync courier status with Delhivery & Ekart in the background on load
    api.post("/orders/sync-tracking")
      .then((res) => {
        if (res.data?.success) {
          fetchOrders(false);
        }
      })
      .catch(() => {});

    // 🔁 Auto-refresh status updates every 45 seconds
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 45 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [search, status, orders]);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await api.get("/orders");
      const list =
        (Array.isArray(res.data) && res.data) ||
        (res.data && (
          (Array.isArray(res.data.data) && res.data.data) ||
          (Array.isArray(res.data.orders) && res.data.orders)
        )) ||
        [];
      setOrders(list);
      setFilteredOrders(list);
    } catch (err) {
      console.log(err);
      if (showLoading) toast.error("Failed to load orders");
    } finally {
      if (showLoading) setLoading(false);
    }
  };


  const filterOrders = () => {
    let data = [...orders];
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter((o) =>
        o.orderId?.toLowerCase().includes(searchLower) ||
        o.customer?.firstName?.toLowerCase().includes(searchLower) ||
        o.customer?.lastName?.toLowerCase().includes(searchLower) ||
        (o.customer?.firstName + " " + o.customer?.lastName).toLowerCase().includes(searchLower) ||
        o.customer?.email?.toLowerCase().includes(searchLower) ||
        o.customer?.phone?.includes(search) ||
        o.delhivery?.waybill?.toLowerCase().includes(searchLower) ||
        o.ekart?.waybill?.toLowerCase().includes(searchLower) ||
        o.ekart?.trackingId?.toLowerCase().includes(searchLower) ||
        o.returnRequest?.returnWaybill?.toLowerCase().includes(searchLower)
      );
    }

    if (status !== "All") {
      if (status === "Returns") {
        data = data.filter((o) => o.returnRequest && o.returnRequest.status !== "None");
      } else {
        data = data.filter((o) => o.status === status);
      }
    }

    setFilteredOrders(data);
  };

  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (sum, o) => sum + Number(o.total || o.totalAmount || 0),
      0
    );
  }, [orders]);

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const shippedOrders = orders.filter((o) => o.status === "Shipped").length;
  const returnRequestsCount = orders.filter(
    (o) => o.returnRequest && ["Pending", "Approved", "Pickup Scheduled"].includes(o.returnRequest.status)
  ).length;

  const updateStatus = async (id, newStatus) => {
    try {
      // Optimistically update orders in UI immediately
      setOrders((prev) =>
        prev.map((o) => (o._id === id || o.orderId === id ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && (selectedOrder._id === id || selectedOrder.orderId === id)) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }

      const res = await api.put(`/orders/${id}/status`, {
        status: newStatus,
      });

      if (res.data?.success) {
        toast.success(res.data.message || `Order status updated to ${newStatus}`);
      } else {
        toast.error(res.data?.message || "Failed to update status");
      }
      fetchOrders();
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
      fetchOrders();
    }
  };


  const openShipmentModal = (order) => {
    setShipmentModalOrder(order);
    const existingWaybill = order.ekart?.waybill || order.delhivery?.waybill || "";
    setManualWaybill(existingWaybill);
    setManualCarrier(order.carrier === "Delhivery" ? "Ekart" : (order.carrier || "Ekart"));
    setMarkAsShipped(true);
  };

  const handleAutoDelhiveryShipment = async () => {
    if (!shipmentModalOrder) return;
    try {
      setLoadingShipment(shipmentModalOrder._id);
      const result = await orderAPI.createDelhiveryShipment(shipmentModalOrder.orderId);
      if (result.ok) {
        toast.success("Delhivery Shipment Created Successfully!");
        setShipmentModalOrder(null);
        fetchOrders();
      } else {
        const errorMsg = result.data?.message || "Failed to create Delhivery shipment. You can add AWB manually.";
        toast.error(errorMsg, { duration: 6000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create Delhivery shipment", { duration: 6000 });
    } finally {
      setLoadingShipment("");
    }
  };

  const handleAutoEkartShipment = async () => {
    if (!shipmentModalOrder) return;
    try {
      setLoadingShipment(shipmentModalOrder._id);
      const result = await orderAPI.createEkartShipment(shipmentModalOrder.orderId);
      if (result.ok) {
        toast.success("Ekart Logistics Shipment Created Successfully!");
        setShipmentModalOrder(null);
        fetchOrders();
      } else {
        const errorMsg = result.data?.message || "Failed to create Ekart shipment. You can add AWB manually.";
        toast.error(errorMsg, { duration: 6000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create Ekart shipment", { duration: 6000 });
    } finally {
      setLoadingShipment("");
    }
  };

  const handleSaveManualShipment = async () => {
    if (!shipmentModalOrder) return;
    if (!manualWaybill.trim()) {
      toast.error("Please enter an AWB / Tracking number");
      return;
    }
    try {
      setSavingWaybill(true);
      const result = await orderAPI.updateOrderWaybill(
        shipmentModalOrder.orderId,
        manualWaybill.trim(),
        manualCarrier
      );
      if (result.ok) {
        if (markAsShipped && shipmentModalOrder.status !== "Shipped") {
          await api.put(`/orders/${shipmentModalOrder._id}/status`, {
            status: "Shipped",
          });
        }
        toast.success(`Shipment AWB saved for ${manualCarrier}!`);
        setShipmentModalOrder(null);
        fetchOrders();
      } else {
        toast.error(result.data?.message || "Failed to update AWB");
      }
    } catch (err) {
      toast.error("Failed to update AWB");
    } finally {
      setSavingWaybill(false);
    }
  };

  const openTrackingModal = async (order) => {
    setTrackingOrder(order);
    setTrackingData(null);
    setLoadingTracking(true);
    try {
      const res = await api.get(`/orders/${order.orderId}/track`);
      if (res.data && res.data.success) {
        setTrackingData(res.data.trackingData || res.data);
      } else {
        const isEkart = order.carrier === "Ekart" || order.ekart?.waybill;
        setTrackingData({
          carrier: isEkart ? "Ekart" : "Delhivery",
          waybill: isEkart ? (order.ekart?.waybill || order.ekart?.trackingId) : order.delhivery?.waybill,
          status: isEkart ? (order.ekart?.currentStatus || order.status) : (order.delhivery?.currentStatus || order.status),
          scans: isEkart ? (order.ekart?.trackingHistory || []) : (order.delhivery?.trackingHistory || [])
        });
      }
    } catch (err) {
      const isEkart = order.carrier === "Ekart" || order.ekart?.waybill;
      setTrackingData({
        carrier: isEkart ? "Ekart" : "Delhivery",
        waybill: isEkart ? (order.ekart?.waybill || order.ekart?.trackingId) : order.delhivery?.waybill,
        status: isEkart ? (order.ekart?.currentStatus || order.status) : (order.delhivery?.currentStatus || order.status),
        scans: isEkart ? (order.ekart?.trackingHistory || []) : (order.delhivery?.trackingHistory || [])
      });
    } finally {
      setLoadingTracking(false);
    }
  };

  const startEditingWaybill = (order) => {
    setEditingWaybillOrderId(order._id);
    const existingWaybill = order.ekart?.waybill || order.delhivery?.waybill || "";
    setEditingWaybillValue(existingWaybill);
  };

  const cancelEditingWaybill = () => {
    setEditingWaybillOrderId(null);
    setEditingWaybillValue("");
  };

  const saveWaybill = async (order) => {
    if (!editingWaybillValue.trim()) {
      toast.error("Please enter a valid AWB/Waybill number");
      return;
    }
    try {
      setSavingWaybill(true);
      const carrier = order.carrier || (order.ekart?.waybill ? "Ekart" : "Delhivery");
      const result = await orderAPI.updateOrderWaybill(
        order.orderId,
        editingWaybillValue.trim(),
        carrier
      );
      if (result.ok) {
        toast.success("AWB/Waybill updated successfully");
        cancelEditingWaybill();
        fetchOrders();
      } else {
        toast.error(result.data?.message || "Failed to update AWB");
      }
    } catch (err) {
      toast.error("Failed to update AWB");
    } finally {
      setSavingWaybill(false);
    }
  };


  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500">Manage customer orders and track shipments</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncAllTracking}
            disabled={syncingTracking}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2 rounded-xl transition text-sm font-semibold shadow-sm disabled:opacity-60"
          >
            <RefreshCw size={15} className={syncingTracking ? "animate-spin" : ""} />
            {syncingTracking ? "Syncing Couriers..." : "Sync Courier Status"}
          </button>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition text-sm font-medium"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>


      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
        >
          <ShoppingBag className="text-blue-600 mb-2" size={22} />
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</h2>
          <p className="text-slate-500 text-xs">Total Orders</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
        >
          <IndianRupee className="text-emerald-600 mb-2" size={22} />
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
          <p className="text-slate-500 text-xs">Revenue</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
        >
          <Truck className="text-purple-600 mb-2" size={22} />
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{shippedOrders}</h2>
          <p className="text-slate-500 text-xs">Shipped</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
        >
          <CheckCircle2 className="text-teal-600 mb-2" size={22} />
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{deliveredOrders}</h2>
          <p className="text-slate-500 text-xs">Delivered</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setStatus(status === "Returns" ? "All" : "Returns")}
          className={`col-span-2 md:col-span-1 rounded-2xl p-5 border transition cursor-pointer shadow-sm ${
            status === "Returns"
              ? "bg-rose-50 border-rose-300 ring-2 ring-rose-500/20"
              : "bg-white border-slate-100 hover:border-rose-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <RotateCcw className="text-rose-600 mb-2" size={22} />
            {returnRequestsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                Action Required
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">{returnRequestsCount}</h2>
          <p className="text-slate-500 text-xs">Returns / Replacements</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search Order ID / AWB / Customer Name / Phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Returns">📦 Return Requests ({returnRequestsCount})</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Waybill / AWB</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-500">
                    <Package className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="font-medium text-slate-600">No Orders Found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Order ID & Date */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{order.orderId}</p>
                      <p className="text-xs text-slate-400">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Recent"}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={`${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.trim() || "Customer"}
                          size="md"
                        />
                        <div>
                          <p className="font-medium text-slate-900">
                            {order.customer?.firstName} {order.customer?.lastName}
                          </p>
                          <p className="text-xs text-slate-500">{order.customer?.phone}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[150px]">
                            {order.customer?.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      ₹{order.total || order.totalAmount || 0}
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          order.paymentMethod === "COD"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {order.paymentMethod || "COD"}
                      </span>
                    </td>

                    {/* Status Select */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : order.status === "Shipped"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : order.status === "Cancelled"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : order.status === "Returned"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Returned">Returned</option>
                        </select>

                        {order.returnRequest && order.returnRequest.status !== "None" && (
                          <button
                            type="button"
                            onClick={() => {
                              setReturnModalOrder(order);
                              setShowRejectForm(false);
                            }}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                              order.returnRequest.status === "Pending"
                                ? "bg-rose-100 text-rose-800 border-rose-300 animate-pulse shadow-sm"
                                : order.returnRequest.status === "Pickup Scheduled"
                                ? "bg-purple-100 text-purple-800 border-purple-300 shadow-sm"
                                : order.returnRequest.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm"
                                : "bg-slate-100 text-slate-700 border-slate-300"
                            }`}
                          >
                            <RotateCcw size={10} />
                            <span>Return: {order.returnRequest.status}</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Waybill / AWB */}
                    <td className="px-6 py-4">
                      {editingWaybillOrderId === order._id ? (
                        <div className="flex flex-col gap-1.5 w-44">
                          <input
                            type="text"
                            value={editingWaybillValue}
                            onChange={(e) => setEditingWaybillValue(e.target.value)}
                            placeholder="Enter AWB number"
                            className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveWaybill(order);
                              if (e.key === "Escape") cancelEditingWaybill();
                            }}
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => saveWaybill(order)}
                              disabled={savingWaybill}
                              className="flex-1 text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {savingWaybill ? "..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEditingWaybill}
                              disabled={savingWaybill}
                              className="flex-1 text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-slate-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {order.ekart?.waybill || order.delhivery?.waybill ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {order.carrier === "Ekart" || order.ekart?.waybill ? (
                                <span className="inline-flex items-center text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                                  Ekart
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  Delhivery
                                </span>
                              )}
                              <span className="font-mono text-xs font-semibold text-slate-800">
                                {order.ekart?.waybill || order.delhivery?.waybill}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs">No AWB</span>
                          )}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditingWaybill(order)}
                              className="text-left text-[11px] text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition cursor-pointer"
                            >
                              <Edit2 size={10} />
                              {order.ekart?.waybill || order.delhivery?.waybill ? "Edit AWB" : "+ Add AWB"}
                            </button>
                            {(order.ekart?.waybill || order.delhivery?.waybill) && (
                              <button
                                onClick={() => {
                                  setRevertModalOrder(order);
                                  setRevertTargetStatus("Processing");
                                  setRevertCancelCourier(true);
                                }}
                                className="text-left text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-0.5 transition cursor-pointer"
                                title="Revert shipment"
                              >
                                <RotateCcw size={10} /> Revert
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 items-center flex-wrap">
                        {order.ekart?.waybill || order.delhivery?.waybill ? (
                          <>
                            <button
                              onClick={() => openTrackingModal(order)}
                              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                            >
                              <Truck size={13} /> Track
                            </button>
                            <button
                              onClick={() => {
                                setRevertModalOrder(order);
                                setRevertTargetStatus("Processing");
                                setRevertCancelCourier(true);
                              }}
                              className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                              title="Revert shipment and cancel courier booking"
                            >
                              <RotateCcw size={12} /> Revert
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => openShipmentModal(order)}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            <Truck size={13} /> Shipment
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          <Eye size={13} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================= */}
      {/* CREATE SHIPMENT MODAL                     */}
      {/* ========================================= */}
      <Modal
        isOpen={Boolean(shipmentModalOrder)}
        onClose={() => setShipmentModalOrder(null)}
        maxWidth="max-w-xl"
      >
        {shipmentModalOrder && (
          <div>
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <div className="flex items-center gap-2">
                <Truck className="text-emerald-600" size={20} />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Create / Assign Shipment
                  </h2>
                  <p className="text-xs text-slate-500">
                    Order #{shipmentModalOrder.orderId} • {shipmentModalOrder.customer?.firstName} {shipmentModalOrder.customer?.lastName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShipmentModalOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {Boolean(shipmentModalOrder.ekart?.waybill || shipmentModalOrder.delhivery?.waybill) && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                    <span>
                      An active shipment already exists for this order (<strong>{shipmentModalOrder.ekart?.waybill || shipmentModalOrder.delhivery?.waybill}</strong>).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRevertModalOrder(shipmentModalOrder);
                      setShipmentModalOrder(null);
                    }}
                    className="inline-flex items-center gap-1 bg-amber-200 hover:bg-amber-300 text-amber-900 px-2.5 py-1 rounded-lg font-semibold shrink-0 cursor-pointer transition"
                  >
                    <RotateCcw size={12} /> Revert Shipment
                  </button>
                </div>
              )}

              {/* Method 1: Enter AWB / Tracking Number */}
              <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-xs text-emerald-900 uppercase tracking-wider">
                    <Edit2 size={13} className="text-emerald-700" /> Enter Courier AWB / Tracking ID Manually
                  </div>
                  <select
                    value={manualCarrier}
                    onChange={(e) => setManualCarrier(e.target.value)}
                    className="text-xs font-semibold bg-white border border-emerald-300 text-emerald-900 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Ekart">Ekart Logistics</option>
                    <option value="Delhivery" className="hidden" style={{ display: "none" }}>Delhivery Express</option>
                  </select>
                </div>
                <p className="text-xs text-slate-600">
                  Paste the tracking number generated from your courier dashboard:
                </p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="e.g. EKART_DFX... or FMPC12345 or LUAP..."
                    value={manualWaybill}
                    onChange={(e) => setManualWaybill(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={markAsShipped}
                      onChange={(e) => setMarkAsShipped(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Mark order status as <strong>"Shipped"</strong> automatically</span>
                  </label>
                </div>
                <button
                  onClick={handleSaveManualShipment}
                  disabled={savingWaybill}
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer"
                >
                  <Check size={14} />
                  {savingWaybill ? "Saving..." : `Save ${manualCarrier} AWB & Enable Tracking`}
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-xs text-slate-400 font-medium uppercase">Or Automatic API Booking</span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Grid for Auto Booking APIs */}
              <div className="grid grid-cols-1 gap-4">
                {/* Method 2: Automatic Delhivery API (Hidden with CSS) */}
                <div className="hidden" style={{ display: "none" }}>
                  <button
                    onClick={handleAutoDelhiveryShipment}
                    disabled={loadingShipment === shipmentModalOrder._id}
                  >
                    Book with Delhivery
                  </button>
                </div>

                {/* Method 3: Automatic Ekart Logistics API */}
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-purple-900 uppercase tracking-wider">
                        <Zap size={13} className="text-purple-600" /> Ekart Logistics API
                      </div>
                      <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono font-bold">
                        Connected & Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Book shipment and generate tracking ID instantly via Ekart Logistics API.
                    </p>
                  </div>
                  <button
                    onClick={handleAutoEkartShipment}
                    disabled={loadingShipment === shipmentModalOrder._id}
                    className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer shadow-md shadow-purple-500/20"
                  >
                    <Truck size={14} />
                    {loadingShipment === shipmentModalOrder._id
                      ? "Booking with Ekart..."
                      : "Book Shipment with Ekart"}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
              <button
                onClick={() => setShipmentModalOrder(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>


      {/* ========================================= */}
      {/* ORDER DETAILS MODAL (VIEW)               */}
      {/* ========================================= */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div>
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Order Details: {selectedOrder.orderId}
                </h2>
                <p className="text-xs text-slate-500">
                  Placed on{" "}
                  {selectedOrder.createdAt
                    ? new Date(selectedOrder.createdAt).toLocaleString("en-IN")
                    : "Recent"}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div>
                  <span className="text-xs text-slate-500 block">Current Status</span>
                  <span className="font-semibold text-slate-900 text-sm">
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Update:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-white focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Customer & Shipping Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Customer Info */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    <User size={14} className="text-slate-500" /> Customer Information
                  </div>
                  <p className="font-medium text-slate-900 text-sm">
                    {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Phone size={12} className="text-slate-400" />
                    {selectedOrder.customer?.phone || "N/A"}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Mail size={12} className="text-slate-400" />
                    {selectedOrder.customer?.email || "N/A"}
                  </p>
                </div>

                {/* Shipping Address */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    <MapPin size={14} className="text-slate-500" /> Delivery Address
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {selectedOrder.shippingAddress?.address || "Address not provided"}
                    <br />
                    {selectedOrder.shippingAddress?.city && `${selectedOrder.shippingAddress.city}, `}
                    {selectedOrder.shippingAddress?.state && `${selectedOrder.shippingAddress.state} `}
                    {selectedOrder.shippingAddress?.pincode && `- ${selectedOrder.shippingAddress.pincode}`}
                  </p>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <Package size={14} className="text-slate-500" /> Ordered Products
                </h3>
                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 text-sm">
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <span className="font-semibold text-slate-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-xs text-slate-500">1 × Dailyfix Beard Colour (Default Package)</div>
                  )}
                </div>
              </div>

              {/* Pricing & Payment Details */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Payment Info */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    <CreditCard size={14} className="text-slate-500" /> Payment Info
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-slate-500">Payment Method:</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.paymentMethod || "COD"}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-semibold text-slate-800">{selectedOrder.paymentStatus || "Pending"}</span>
                  </div>
                  {selectedOrder.razorpayPaymentId && (
                    <div className="flex justify-between text-xs py-1">
                      <span className="text-slate-500">Razorpay ID:</span>
                      <span className="font-mono text-slate-800">{selectedOrder.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>

                {/* Pricing Total */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-700">
                    Total Summary
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.total || selectedOrder.totalAmount || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Shipping:</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-sm text-slate-900">
                    <span>Final Total:</span>
                    <span className="text-emerald-700">₹{selectedOrder.total || selectedOrder.totalAmount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Logistics & Courier Section */}
              {(() => {
                const isEkart = selectedOrder.carrier === "Ekart" || (!selectedOrder.delhivery?.waybill && selectedOrder.ekart?.waybill);
                const waybill = isEkart ? (selectedOrder.ekart?.waybill || selectedOrder.ekart?.trackingId) : selectedOrder.delhivery?.waybill;
                const courierTitle = isEkart ? "Ekart Logistics" : "Delhivery Express";
                const borderClass = isEkart ? "border-purple-100 bg-purple-50/40 text-purple-900" : "border-blue-100 bg-blue-50/40 text-blue-900";
                const iconColor = isEkart ? "text-purple-600" : "text-blue-600";

                return (
                  <div className={`p-4 rounded-xl border ${borderClass} space-y-2`}>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wider">
                        <Truck size={14} className={iconColor} /> {courierTitle}
                      </div>
                      <div className="flex items-center gap-2">
                        {waybill && (
                          <button
                            onClick={() => openTrackingModal(selectedOrder)}
                            className={`text-xs font-semibold underline flex items-center gap-1 ${isEkart ? "text-purple-700 hover:text-purple-900" : "text-blue-700 hover:text-blue-900"}`}
                          >
                            Live Tracking <ExternalLink size={12} />
                          </button>
                        )}
                        {waybill && (
                          <button
                            onClick={() => {
                              setRevertModalOrder(selectedOrder);
                              setRevertTargetStatus("Processing");
                              setRevertCancelCourier(true);
                            }}
                            className="inline-flex items-center gap-1 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            <RotateCcw size={11} /> Revert Shipment
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      AWB / Waybill:{" "}
                      <span className="font-mono font-bold text-slate-900">
                        {waybill || "Not assigned yet"}
                      </span>
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================= */}
      {/* SHIPMENT TRACKING MODAL                   */}
      {/* ========================================= */}
      <Modal
        isOpen={Boolean(trackingOrder)}
        onClose={() => setTrackingOrder(null)}
        maxWidth="max-w-lg"
      >
        {trackingOrder && (() => {
          const isEkart = trackingOrder.carrier === "Ekart" || (!trackingOrder.delhivery?.waybill && trackingOrder.ekart?.waybill);
          const waybill = isEkart ? (trackingOrder.ekart?.waybill || trackingOrder.ekart?.trackingId) : trackingOrder.delhivery?.waybill;
          const courierName = isEkart ? "Ekart Logistics" : "Delhivery Express";
          const currentStatus = isEkart ? (trackingOrder.ekart?.currentStatus || trackingOrder.status) : (trackingOrder.delhivery?.currentStatus || trackingOrder.status);
          const externalTrackingUrl = isEkart
            ? `https://ekartlogistics.com/shipmenttrack/${waybill}`
            : `https://www.delhivery.com/track/package/${waybill}`;

          return (
            <div>
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
                <div className="flex items-center gap-2">
                  <Truck className={isEkart ? "text-purple-600" : "text-blue-600"} size={20} />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {courierName} Tracking
                    </h2>
                    <p className="text-xs text-slate-500">Order #{trackingOrder.orderId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Waybill Box */}
                <div className={`p-4 rounded-xl flex justify-between items-center border ${isEkart ? "bg-purple-50 border-purple-100" : "bg-blue-50 border-blue-100"}`}>
                  <div>
                    <p className={`text-xs font-medium ${isEkart ? "text-purple-600" : "text-blue-600"}`}>
                      {courierName} Waybill / AWB
                    </p>
                    <p className={`text-lg font-mono font-bold ${isEkart ? "text-purple-900" : "text-blue-900"}`}>
                      {waybill || "No AWB assigned"}
                    </p>
                  </div>
                  {waybill && (
                    <a
                      href={externalTrackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-white text-xs font-semibold px-3 py-2 rounded-lg transition ${
                        isEkart ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Track Live <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Courier Status</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                    isEkart
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                    {currentStatus || "Manifested"}
                  </span>
                </div>

                {/* Tracking Scans / History Timeline */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Tracking Timeline
                  </h3>

                  {loadingTracking ? (
                    <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin" size={16} /> Fetching live tracking from {courierName}...
                    </div>
                  ) : (
                    <div className="space-y-4 border-l-2 border-slate-200 pl-4 ml-2">
                      {trackingData?.ShipmentData?.[0]?.Shipment?.Scan &&
                      trackingData.ShipmentData[0].Shipment.Scan.length > 0 ? (
                        trackingData.ShipmentData[0].Shipment.Scan.map((scan, idx) => (
                          <div key={idx} className="relative">
                            <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                              isEkart ? "bg-purple-600" : "bg-blue-600"
                            }`} />
                            <p className="font-semibold text-xs text-slate-900">{scan.status || "Scanned"}</p>
                            <p className="text-[11px] text-slate-500">{scan.location || "In Transit"}</p>
                            {scan.date && (
                              <p className="text-[10px] text-slate-400">
                                {new Date(scan.date).toLocaleString("en-IN")}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="relative">
                          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                          <p className="font-semibold text-xs text-slate-900">
                            {currentStatus || "Order Placed / Manifested"}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Package ready for pickup by {courierName}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {trackingOrder.createdAt
                              ? new Date(trackingOrder.createdAt).toLocaleString("en-IN")
                              : "Recent"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center">
                <button
                  onClick={() => {
                    setRevertModalOrder(trackingOrder);
                    setRevertTargetStatus("Processing");
                    setRevertCancelCourier(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <RotateCcw size={13} /> Revert Shipment
                </button>
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ========================================= */}
      {/* REVERT SHIPMENT CONFIRMATION MODAL        */}
      {/* ========================================= */}
      <Modal
        isOpen={Boolean(revertModalOrder)}
        onClose={() => !revertingShipment && setRevertModalOrder(null)}
        maxWidth="max-w-md"
      >
        {revertModalOrder && (() => {
          const isEkart = revertModalOrder.carrier === "Ekart" || (!revertModalOrder.delhivery?.waybill && revertModalOrder.ekart?.waybill);
          const waybill = isEkart ? (revertModalOrder.ekart?.waybill || revertModalOrder.ekart?.trackingId) : revertModalOrder.delhivery?.waybill;
          const courierName = isEkart ? "Ekart Logistics" : "Delhivery Express";

          return (
            <div>
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b bg-rose-50/60">
                <div className="flex items-center gap-2 text-rose-800">
                  <RotateCcw size={20} className="text-rose-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    Revert Shipment
                  </h2>
                </div>
                <button
                  onClick={() => !revertingShipment && setRevertModalOrder(null)}
                  disabled={revertingShipment}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order ID:</span>
                    <span className="font-bold text-slate-900">#{revertModalOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer:</span>
                    <span className="font-medium text-slate-800">
                      {revertModalOrder.customer?.firstName} {revertModalOrder.customer?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Courier / AWB:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {courierName} ({waybill || "Manual"})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Reverting this shipment will <strong>clear the assigned AWB/tracking ID</strong> and return the order to unfulfilled status so you can re-ship, change courier, or edit package details.
                </p>

                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Reset Order Status To:
                    </label>
                    <select
                      value={revertTargetStatus}
                      onChange={(e) => setRevertTargetStatus(e.target.value)}
                      disabled={revertingShipment}
                      className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="Processing">Processing (Recommended)</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 bg-rose-50/50 border border-rose-100 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={revertCancelCourier}
                      onChange={(e) => setRevertCancelCourier(e.target.checked)}
                      disabled={revertingShipment}
                      className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span>
                      <strong>Auto-cancel on courier portal</strong> ({courierName}) via API request
                    </span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setRevertModalOrder(null)}
                  disabled={revertingShipment}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRevertShipment}
                  disabled={revertingShipment}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition shadow-md shadow-rose-500/20 disabled:opacity-60 cursor-pointer"
                >
                  {revertingShipment ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Reverting...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={13} /> Confirm Revert Shipment
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Return Request Details & Action Modal */}
      <Modal
        isOpen={Boolean(returnModalOrder)}
        onClose={() => !approvingReturn && !rejectingReturn && setReturnModalOrder(null)}
        title="Return Request Management"
        size="lg"
      >
        {returnModalOrder && (() => {
          const ret = returnModalOrder.returnRequest || {};
          const customer = returnModalOrder.customer || {};
          const address = returnModalOrder.shippingAddress || {};

          return (
            <div>
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-rose-50 to-amber-50">
                <div className="flex items-center gap-2">
                  <RotateCcw size={20} className="text-rose-600" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Return Request: #{returnModalOrder.orderId}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Requested on {ret.requestedAt ? new Date(ret.requestedAt).toLocaleString("en-IN") : "Recent"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !approvingReturn && !rejectingReturn && setReturnModalOrder(null)}
                  disabled={approvingReturn || rejectingReturn}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Status Bar */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 border rounded-2xl">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">RETURN STATUS</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      ret.status === "Pending"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : ret.status === "Pickup Scheduled"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : ret.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-slate-200 text-slate-700"
                    }`}>
                      {ret.status || "Pending"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">REQUESTED ACTION</span>
                    <span className="text-xs font-bold text-slate-900">{ret.returnType || "Replacement"}</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">ORDER VALUE</span>
                    <span className="text-xs font-bold text-slate-900">₹{returnModalOrder.total} ({returnModalOrder.paymentMethod})</span>
                  </div>
                </div>

                {/* Reason & Comments */}
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                    <AlertTriangle size={15} />
                    <span>Customer Stated Reason:</span>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">{ret.reason || "Not specified"}</p>
                  {ret.customerComments && (
                    <p className="text-slate-600 bg-white/80 p-2.5 rounded-xl border border-amber-100 italic">
                      "{ret.customerComments}"
                    </p>
                  )}
                </div>

                {/* Proof Photos */}
                {Array.isArray(ret.proofImages) && ret.proofImages.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">Customer Uploaded Photos ({ret.proofImages.length}):</span>
                    <div className="flex flex-wrap gap-3">
                      {ret.proofImages.map((img, i) => (
                        <a
                          key={i}
                          href={img}
                          target="_blank"
                          rel="noreferrer"
                          className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:opacity-90 transition group relative"
                        >
                          <img src={img} alt={`Proof ${i + 1}`} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">Zoom</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Details & Pickup Address */}
                <div className="p-4 bg-slate-50 border rounded-2xl space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Pickup Location & Customer Contact:</span>
                  <p className="text-slate-700">
                    <strong>{customer.firstName} {customer.lastName}</strong> • Phone: <a href={`tel:${customer.phone}`} className="text-indigo-600 font-mono">{customer.phone}</a>
                  </p>
                  <p className="text-slate-600">
                    {address.address}, {address.city}, {address.state} - {address.pincode}
                  </p>

                  {ret.upiId && (
                    <div className="pt-2 border-t mt-2 flex items-center justify-between">
                      <span className="text-slate-500">Refund UPI ID:</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{ret.upiId}</span>
                    </div>
                  )}
                </div>

                {/* Ekart Reverse Waybill Info if Booked */}
                {ret.returnWaybill && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-900 font-bold block">🚚 Ekart Reverse Pickup Booked:</span>
                      <span className="text-emerald-700 font-mono text-sm font-bold">{ret.returnWaybill}</span>
                    </div>
                    <a
                      href={`https://app.elite.ekartlogistics.in/track/${ret.returnWaybill}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition"
                    >
                      Track Reverse Courier
                    </a>
                  </div>
                )}

                {/* Rejection Form Input */}
                {showRejectForm && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                    <label className="text-xs font-bold text-rose-900 block">Reason for Rejection:</label>
                    <input
                      type="text"
                      value={rejectionReasonInput}
                      onChange={(e) => setRejectionReasonInput(e.target.value)}
                      placeholder="e.g. Return request is outside the 7-day policy window"
                      className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowRejectForm(false)}
                        className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRejectReturn}
                        disabled={rejectingReturn}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                      >
                        Confirm Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-slate-50 border-t flex flex-wrap items-center justify-between gap-3">
                <div>
                  {!showRejectForm && ret.status !== "Rejected" && (
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(true)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer underline"
                    >
                      Reject Return Request
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnModalOrder(null)}
                    disabled={approvingReturn || rejectingReturn}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Close
                  </button>

                  {ret.status !== "Pickup Scheduled" && (
                    <button
                      type="button"
                      onClick={() => handleApproveReturn("ekart_pickup")}
                      disabled={approvingReturn || rejectingReturn}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-xl text-xs font-bold transition shadow-md shadow-purple-700/20 disabled:opacity-60 cursor-pointer"
                    >
                      {approvingReturn ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" /> Booking Ekart Reverse Pickup...
                        </>
                      ) : (
                        <>
                          <Truck size={14} /> Approve & Book Ekart Reverse Pickup
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}