import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  IndianRupee,
  Boxes,
  CreditCard,
  Banknote,
  Eye,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Bell,
  Clock,
  LayoutDashboard,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import api from "../../services/api";
import { getProductImageSrc } from "../../utils/productImages";

import Modal from "../../components/Modal";
import StatsCard from "./Dashboard/StatsCard";
import RevenueChart from "./Dashboard/RevenueChart";
import StatusCards from "./Dashboard/StatusCards";
import RecentOrders from "./Dashboard/RecentOrders";
import TopProducts from "./Dashboard/TopProduct";
import QuickActions from "./Dashboard/QuickAction";

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
  Shipped: "bg-purple-100 text-purple-700 border-purple-200",
  "Out for Delivery":
    "bg-orange-100 text-orange-700 border-orange-200",
  Delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
  Returned: "bg-rose-100 text-rose-700 border-rose-200",
};

const getStatusStyle = (status) =>
  STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border-slate-200";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Selected Order for View Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [data, setData] = useState({
    stats: {
      totalRevenue: 0,
      todayRevenue: 0,
      totalOrders: 0,
      todayOrders: 0,
      last7DaysOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      activeProducts: 0,
      outOfStock: 0,
      lowStock: 0,
      totalInventoryValue: 0,
    },
    orders: [],
    products: [],
    topProducts: [],
    lowStockProducts: [],
    outOfStockProducts: [],
    monthlyRevenue: [],
    orderStatusCounts: {},
    revenueByStatus: {},
    paymentMethodBreakdown: { cod: 0, online: 0 },
  });

  const fetchDashboard = async (showToast = false) => {
    try {
      setError(null);
      const res = await api.get("/orders/dashboard/stats");
      if (res.data?.success) {
        setData({
          stats: res.data.stats || data.stats,
          orders: res.data.orders || [],
          products: res.data.products || [],
          topProducts: res.data.topProducts || [],
          lowStockProducts: res.data.lowStockProducts || [],
          outOfStockProducts: res.data.outOfStockProducts || [],
          monthlyRevenue: res.data.monthlyRevenue || [],
          orderStatusCounts: res.data.orderStatusCounts || {},
          revenueByStatus: res.data.revenueByStatus || {},
          paymentMethodBreakdown:
            res.data.paymentMethodBreakdown || { cod: 0, online: 0 },
        });
        setLastRefreshed(new Date());
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      if (err.response?.status === 401) {
        setError(
          "Admin login required. Please log in to view the dashboard."
        );
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    try {
      setLoadingOrderDetails(true);
      const res = await api.get(`/orders/${order._id || order.id || order.orderId}`);
      if (res.data?.success && (res.data.order || res.data.data)) {
        setSelectedOrder(res.data.order || res.data.data);
      }
    } catch (err) {
      console.log("Using current order summary:", err);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      toast.loading(`Updating order to ${newStatus}...`, { id: "dash-status" });
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.success) {
        toast.success(`Order marked as ${newStatus}!`, { id: "dash-status" });
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        fetchDashboard();
      } else {
        toast.error(res.data?.message || "Failed to update status", { id: "dash-status" });
      }
    } catch (err) {
      toast.error("Error updating status", { id: "dash-status" });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const { stats, orders, products, topProducts, monthlyRevenue } = data;

  const pendingOrders = data.orderStatusCounts.Pending || 0;
  const processingOrders = data.orderStatusCounts.Processing || 0;
  const confirmedOrders = data.orderStatusCounts.Confirmed || 0;
  const shippedOrders = data.orderStatusCounts.Shipped || 0;
  const deliveredOrders = data.orderStatusCounts.Delivered || 0;
  const cancelledOrders = data.orderStatusCounts.Cancelled || 0;

  const totalRevenue = stats.totalRevenue;
  const todayRevenue = stats.todayRevenue;

  const todayOrdersChange =
    stats.totalOrders > 0
      ? Math.round((stats.todayOrders / (stats.totalOrders || 1)) * 100)
      : 0;
  const revenueChange = monthlyRevenue.length >= 2
    ? (() => {
        const curr = monthlyRevenue[monthlyRevenue.length - 1]?.sales || 0;
        const prev = monthlyRevenue[monthlyRevenue.length - 2]?.sales || 1;
        return Math.round(((curr - prev) / prev) * 100);
      })()
    : 0;

  const lowStockCount = stats.lowStock;
  const outOfStockCount = stats.outOfStock;

  const hasNotifications = lowStockCount > 0 || outOfStockCount > 0 || pendingOrders > 0;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Dashboard
              </h1>
              <p className="text-slate-500 mt-0.5">
                Welcome back — here&apos;s your store overview
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
              <Clock size={14} />
              Updated {lastRefreshed.toLocaleTimeString("en-IN")}
            </div>
          )}

          <button
            onClick={() => fetchDashboard(true)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 px-4 py-2.5 font-medium text-slate-700 shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <div className="relative">
            <button className="w-11 h-11 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center shadow-sm transition">
              <Bell size={18} className="text-slate-600" />
            </button>
            {hasNotifications && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {Math.min(
                  9,
                  lowStockCount + outOfStockCount + pendingOrders
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-200 bg-red-50 text-red-800 px-5 py-4 flex items-start gap-3"
        >
          <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to load dashboard</p>
            <p className="text-sm mt-1 opacity-90">{error}</p>
          </div>
          <button
            onClick={() => fetchDashboard()}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
          >
            Retry
          </button>
        </motion.div>
      )}

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          subValue={todayRevenue > 0 ? `₹${todayRevenue.toLocaleString("en-IN")} today` : "No sales yet today"}
          icon={DollarSign}
          color="emerald"
          change={revenueChange >= 0 ? `+${revenueChange}%` : `${revenueChange}%`}
          trend={revenueChange >= 0 ? "up" : "down"}
        />

        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          subValue={`${stats.todayOrders} today · ${stats.last7DaysOrders} last 7 days`}
          icon={ShoppingCart}
          color="blue"
          change={pendingOrders > 0 ? `${pendingOrders} pending` : "All caught up"}
          trend="neutral"
        />

        <StatsCard
          title="Customers"
          value={stats.totalCustomers}
          subValue="Unique buyers"
          icon={Users}
          color="purple"
          change={stats.totalCustomers > 0 ? "Growing list" : "Awaiting first order"}
          trend="up"
        />

        <StatsCard
          title="Products"
          value={`${stats.activeProducts}/${stats.totalProducts}`}
          subValue={`${lowStockCount} low · ${outOfStockCount} OOS`}
          icon={Package}
          color="orange"
          change={
            outOfStockCount > 0
              ? `${outOfStockCount} out of stock`
              : lowStockCount > 0
              ? `${lowStockCount} running low`
              : "All in stock"
          }
          trend={outOfStockCount > 0 ? "down" : "neutral"}
        />
      </div>

      {/* Secondary Stats (Inventory + Payment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Inventory Value
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                ₹{stats.totalInventoryValue.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Price × Stock for active SKUs
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <IndianRupee size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Stock Units
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {products.reduce(
                  (s, p) => s + Number(p.stock || 0),
                  0
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Across {stats.activeProducts} active products
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Boxes size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Online Payments
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {data.paymentMethodBreakdown.online}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Razorpay · UPI / Cards / Netbanking
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <CreditCard size={20} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                COD Orders
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                {data.paymentMethodBreakdown.cod}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Cash on Delivery orders
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote size={20} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Revenue Chart + Status Cards */}
      <div className="gap-6 space-y-3">
        <div className="xl:col-span-2">
          <RevenueChart data={monthlyRevenue} title="Monthly Revenue (Last 6 months)" />
        </div>
        <div>
          <StatusCards
            pending={pendingOrders}
            confirmed={confirmedOrders}
            processing={processingOrders}
            shipped={shippedOrders}
            delivered={deliveredOrders}
            cancelled={cancelledOrders}
            total={stats.totalOrders || 1}
          />
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="space-y-3 gap-6">
        <div className="xl:col-span-2">
          <RecentOrders
            loading={loading}
            orders={orders.slice(0, 8)}
            onView={handleViewOrder}
          />
        </div>
        <div>
          <QuickActions stats={stats} counts={data.orderStatusCounts} />
        </div>
      </div>

      {/* Top Products + Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TopProducts
            loading={loading}
            products={topProducts.slice(0, 5)}
          />
        </div>

        {/* Alerts Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Inventory Alerts</h3>
            <span className="text-xs text-slate-500">
              {lowStockCount + outOfStockCount} items
            </span>
          </div>
          <div className="p-4 space-y-3 max-h-[420px] overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-slate-100 animate-pulse"
                />
              ))
            ) : lowStockCount === 0 && outOfStockCount === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <CheckCircle2
                  size={40}
                  className="mx-auto text-emerald-500 mb-3"
                />
                <p className="font-semibold text-slate-700">
                  All products stocked
                </p>
                <p className="text-sm mt-1">No alerts at this time.</p>
              </div>
            ) : (
              <>
                {data.outOfStockProducts.map((p) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={getProductImageSrc(p)}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-red-200 bg-white flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <XCircle size={15} className="text-red-500 flex-shrink-0" />
                          <p className="font-semibold text-slate-800 truncate">
                            {p.name}
                          </p>
                        </div>
                        <p className="text-xs text-red-700 mt-0.5">
                          Out of stock · SKU: {p.sku || "—"}
                        </p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-xs font-bold text-red-700 bg-red-100 rounded-lg px-2 py-1">
                      0 left
                    </span>
                  </motion.div>
                ))}
                {data.lowStockProducts.map((p) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={getProductImageSrc(p)}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-amber-200 bg-white flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
                          <p className="font-semibold text-slate-800 truncate">
                            {p.name}
                          </p>
                        </div>
                        <p className="text-xs text-amber-700 mt-0.5">
                          Running low · SKU: {p.sku || "—"}
                        </p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-xs font-bold text-amber-700 bg-amber-100 rounded-lg px-2 py-1">
                      {p.stock} left
                    </span>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Orders Pipeline Quick View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Order Pipeline</h3>
          <span className="text-xs text-slate-500">Status breakdown</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-row-8 gap-1 p-2">
          {Object.entries(data.orderStatusCounts).map(([status, count]) => {
            const Icon = {
              Pending: Clock,
              Confirmed: CheckCircle2,
              Processing: Package,
              Shipped: Truck,
              "Out for Delivery": PackageCheck,
              Delivered: CheckCircle2,
              Cancelled: XCircle,
              Returned: PackageCheck,
            }[status] || Clock;
            const total = stats.totalOrders || 1;
            const pct = Math.round((count / total) * 100);
            return (
              <motion.div
                key={status}
                whileHover={{ y: -2 }}
                className={`rounded-xl p-4 border ${getStatusStyle(
                  status
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={16} />
                  <span className="text-[10px] font-bold opacity-75">
                    {pct}%
                  </span>
                </div>
                <p className="text-2xl font-extrabold">{count}</p>
                <p className="text-[11px] mt-0.5 opacity-80 font-semibold">
                  {status}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-slate-200">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin" />
            <h2 className="font-bold text-xl mt-6 text-slate-800">
              Loading Dashboard
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Pulling latest orders, products and revenue…
            </p>
          </div>
        </div>
      )}

      {/* Empty State (no data at all) */}
      {!loading &&
        !error &&
        stats.totalOrders === 0 &&
        stats.totalProducts === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto border border-slate-200">
              <Package size={42} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mt-6">
              Your store is ready
            </h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Add products via the Products page and start accepting orders.
              Stats, orders and revenue will appear here automatically.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-200 flex items-center gap-2">
                <Package size={16} /> Add Products
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      {/* ======================================================== */}
      {/* ORDER DETAILS MODAL (VIEW ORDER)                         */}
      {/* ======================================================== */}
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
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1 ${getStatusStyle(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status || "Pending"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Update Status:</span>
                  <select
                    value={selectedOrder.status || "Pending"}
                    disabled={updatingStatus}
                    onChange={(e) =>
                      handleUpdateStatus(
                        selectedOrder._id || selectedOrder.id || selectedOrder.orderId,
                        e.target.value
                      )
                    }
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50"
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
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedOrder.customerName ||
                      (selectedOrder.customer
                        ? `${selectedOrder.customer.firstName || ""} ${selectedOrder.customer.lastName || ""}`.trim()
                        : "Customer")}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 font-mono">
                    <Phone size={12} className="text-slate-400" />
                    {selectedOrder.customerPhone || selectedOrder.customer?.phone || "No phone"}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Mail size={12} className="text-slate-400" />
                    {selectedOrder.customerEmail || selectedOrder.customer?.email || "No email"}
                  </p>
                </div>

                {/* Shipping Address */}
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                    <MapPin size={14} className="text-slate-500" /> Delivery Address
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {selectedOrder.shippingAddress?.address || "Address details on orders page"}
                    <br />
                    {selectedOrder.shippingAddress?.city && `${selectedOrder.shippingAddress.city}, `}
                    {selectedOrder.shippingAddress?.state && `${selectedOrder.shippingAddress.state} `}
                    {selectedOrder.shippingAddress?.pincode && `- ${selectedOrder.shippingAddress.pincode}`}
                  </p>
                </div>
              </div>

              {/* Delhivery Courier Tracking info */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Truck size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Delhivery Courier Tracking
                    </span>
                    <span className="text-xs font-mono text-slate-600">
                      AWB: {selectedOrder.delhivery?.waybill || "Not Assigned"}
                    </span>
                  </div>
                </div>
                {selectedOrder.delhivery?.waybill ? (
                  <a
                    href={`https://www.delhivery.com/track/package/${selectedOrder.delhivery.waybill}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    <ExternalLink size={12} /> Track Live
                  </a>
                ) : (
                  <a
                    href="/admin/orders"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Ship on Orders Page →
                  </a>
                )}
              </div>

              {/* Items Ordered */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                  Items Ordered ({selectedOrder.items?.length || 1})
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border flex items-center justify-center font-bold text-slate-400">
                            <ShoppingBag size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {item.name || item.product?.name || "DailyFix Beard Colour"}
                            </p>
                            <p className="text-slate-400">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-500 italic">
                      DailyFix Natural Beard Colour (1 pack)
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span>Payment Mode</span>
                  <span className="font-semibold text-white">
                    {selectedOrder.paymentMethod || "COD"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-300">
                  <span>Payment Status</span>
                  <span className="font-semibold text-emerald-400">
                    {selectedOrder.paymentStatus || (selectedOrder.paymentMethod === "COD" ? "Pending (COD)" : "Paid")}
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                  <span className="font-bold text-sm">Total Paid / Payable</span>
                  <span className="font-extrabold text-lg text-emerald-400">
                    ₹{selectedOrder.total || selectedOrder.totalAmount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center">
              <a
                href="/admin/orders"
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                Open in Full Orders Management →
              </a>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
