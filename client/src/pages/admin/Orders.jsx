import { useEffect, useMemo, useState } from "react";
import api, { orderAPI } from "../../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
  const [markAsShipped, setMarkAsShipped] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [search, status, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
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
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
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
        o.delhivery?.waybill?.toLowerCase().includes(searchLower)
      );
    }

    if (status !== "All") {
      data = data.filter((o) => o.status === status);
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

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, {
        status: newStatus,
      });
      toast.success("Status Updated");
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openShipmentModal = (order) => {
    setShipmentModalOrder(order);
    setManualWaybill(order.delhivery?.waybill || "");
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
        const errorMsg = result.data?.message || "Failed to create shipment. You can add AWB manually.";
        toast.error(errorMsg, { duration: 6000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create shipment", { duration: 6000 });
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
        manualWaybill.trim()
      );
      if (result.ok) {
        if (markAsShipped && shipmentModalOrder.status !== "Shipped") {
          await api.put(`/orders/${shipmentModalOrder._id}/status`, {
            status: "Shipped",
          });
        }
        toast.success("Shipment AWB saved and tracking enabled!");
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
        setTrackingData({
          waybill: order.delhivery?.waybill,
          status: order.delhivery?.currentStatus || order.status,
          scans: order.delhivery?.trackingHistory || []
        });
      }
    } catch (err) {
      setTrackingData({
        waybill: order.delhivery?.waybill,
        status: order.delhivery?.currentStatus || order.status,
        scans: order.delhivery?.trackingHistory || []
      });
    } finally {
      setLoadingTracking(false);
    }
  };

  const startEditingWaybill = (order) => {
    setEditingWaybillOrderId(order._id);
    setEditingWaybillValue(order.delhivery?.waybill || "");
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
      const result = await orderAPI.updateOrderWaybill(
        order.orderId,
        editingWaybillValue.trim()
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500">Manage customer orders and track shipments</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition text-sm font-medium"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-4 gap-5">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <ShoppingBag className="text-blue-600 mb-2" size={24} />
          <h2 className="text-3xl font-bold text-slate-900 mt-1">{orders.length}</h2>
          <p className="text-slate-500 text-sm">Total Orders</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <IndianRupee className="text-emerald-600 mb-2" size={24} />
          <h2 className="text-3xl font-bold text-slate-900 mt-1">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
          <p className="text-slate-500 text-sm">Revenue</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <Truck className="text-purple-600 mb-2" size={24} />
          <h2 className="text-3xl font-bold text-slate-900 mt-1">{shippedOrders}</h2>
          <p className="text-slate-500 text-sm">Shipped</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <CheckCircle2 className="text-teal-600 mb-2" size={24} />
          <h2 className="text-3xl font-bold text-slate-900 mt-1">{deliveredOrders}</h2>
          <p className="text-slate-500 text-sm">Delivered</p>
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
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
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
                      <p className="font-medium text-slate-900">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </p>
                      <p className="text-xs text-slate-500">{order.customer?.phone}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[150px]">
                        {order.customer?.email}
                      </p>
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
                            : "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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
                        <div className="flex flex-col gap-0.5">
                          {order.delhivery?.waybill ? (
                            <span className="font-mono text-xs font-semibold text-emerald-700">
                              {order.delhivery.waybill}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">No AWB</span>
                          )}
                          <button
                            onClick={() => startEditingWaybill(order)}
                            className="text-left text-[11px] text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition"
                          >
                            <Edit2 size={10} />
                            {order.delhivery?.waybill ? "Edit AWB" : "+ Add AWB"}
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 items-center flex-wrap">
                        {order.delhivery?.waybill ? (
                          <button
                            onClick={() => openTrackingModal(order)}
                            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            <Truck size={13} /> Track
                          </button>
                        ) : (
                          <button
                            onClick={() => openShipmentModal(order)}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            <Truck size={13} /> Shipment
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
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
      <AnimatePresence>
        {shipmentModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
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
                {/* Method 1: Enter AWB / Tracking Number (Recommended) */}
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/40 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-xs text-emerald-900 uppercase tracking-wider">
                    <Edit2 size={13} className="text-emerald-700" /> Enter Courier AWB / Tracking ID
                  </div>
                  <p className="text-xs text-slate-600">
                    Paste the Waybill / AWB generated from your Delhivery, Shiprocket, or courier portal:
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. 1403215689123"
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
                    className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
                  >
                    <Check size={14} />
                    {savingWaybill ? "Saving..." : "Save AWB & Enable Live Tracking"}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-xs text-slate-400 font-medium uppercase">Or</span>
                  <div className="border-t border-slate-200 w-full" />
                </div>

                {/* Method 2: Automatic Delhivery API */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center gap-2 font-semibold text-xs text-slate-700 uppercase tracking-wider">
                    <Zap size={13} className="text-blue-600" /> Automatic Delhivery API Booking
                  </div>
                  <p className="text-xs text-slate-500">
                    Automatically book shipment & generate waybill directly via Delhivery API integration.
                  </p>
                  <button
                    onClick={handleAutoDelhiveryShipment}
                    disabled={loadingShipment === shipmentModalOrder._id}
                    className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
                  >
                    <Truck size={14} />
                    {loadingShipment === shipmentModalOrder._id
                      ? "Contacting Delhivery..."
                      : "Book Automatically with Delhivery API"}
                  </button>
                  <p className="text-[11px] text-slate-400 italic">
                    Note: Requires active DELHIVERY_API_KEY in your .env file.
                  </p>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* ORDER DETAILS MODAL (VIEW)               */}
      {/* ========================================= */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8"
            >
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

                {/* Delhivery Shipment Section */}
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-xs text-blue-900 uppercase tracking-wider">
                      <Truck size={14} className="text-blue-600" /> Delhivery Logistics
                    </div>
                    {selectedOrder.delhivery?.waybill && (
                      <button
                        onClick={() => openTrackingModal(selectedOrder)}
                        className="text-xs text-blue-700 hover:text-blue-900 font-semibold underline flex items-center gap-1"
                      >
                        Live Tracking <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">
                    AWB / Waybill:{" "}
                    <span className="font-mono font-bold text-slate-900">
                      {selectedOrder.delhivery?.waybill || "Not assigned yet"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* SHIPMENT TRACKING MODAL                   */}
      {/* ========================================= */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
                <div className="flex items-center gap-2">
                  <Truck className="text-blue-600" size={20} />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Shipment Tracking
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
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Delhivery Waybill / AWB</p>
                    <p className="text-lg font-mono font-bold text-blue-900">
                      {trackingOrder.delhivery?.waybill || "No AWB assigned"}
                    </p>
                  </div>
                  {trackingOrder.delhivery?.waybill && (
                    <a
                      href={`https://www.delhivery.com/track/package/${trackingOrder.delhivery.waybill}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                    >
                      Track on Delhivery <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Courier Status</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {trackingOrder.delhivery?.currentStatus || trackingOrder.status || "Manifested"}
                  </span>
                </div>

                {/* Tracking Scans / History Timeline */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Tracking Timeline
                  </h3>

                  {loadingTracking ? (
                    <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin" size={16} /> Fetching live tracking from Delhivery...
                    </div>
                  ) : (
                    <div className="space-y-4 border-l-2 border-slate-200 pl-4 ml-2">
                      {trackingData?.ShipmentData?.[0]?.Shipment?.Scan &&
                      trackingData.ShipmentData[0].Shipment.Scan.length > 0 ? (
                        trackingData.ShipmentData[0].Shipment.Scan.map((scan, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
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
                            {trackingOrder.delhivery?.currentStatus || "Order Placed / Manifested"}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Package ready for pickup by Delhivery Courier
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
              <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
                <button
                  onClick={() => setTrackingOrder(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}