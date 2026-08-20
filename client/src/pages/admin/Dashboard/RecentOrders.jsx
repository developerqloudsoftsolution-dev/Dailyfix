import { motion } from "framer-motion";
import {
  Eye,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

const statusConfig = {
  Pending: {
    color: "bg-amber-100 text-amber-700",
    icon: Clock3,
  },
  Processing: {
    color: "bg-blue-100 text-blue-700",
    icon: Package,
  },
  Shipped: {
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
  },
  Delivered: {
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  Cancelled: {
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};
 
export default function RecentOrders({
  orders = [],
  loading = false,
  onView,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1,2,3,4,5].map((item) => (
            <div
              key={item}
              className="h-14 bg-slate-100 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
    >
      <div className="flex justify-between items-center px-6 py-5 border-b">
        <div>
          <h2 className="font-bold text-lg">
            Recent Orders
          </h2>
          <p className="text-slate-500 text-sm">
            Latest customer orders
          </p>
        </div>
        <a href="/admin/orders" className="text-emerald-600 text-sm font-semibold hover:underline">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                Customer
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                Order ID
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                Amount
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                Payment
              </th>

              <th className="px-6 py-4 text-left text-xs uppercase text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs uppercase text-slate-500">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => {

              const status =
                statusConfig[order.status] ||
                statusConfig.Pending;

              const Icon = status.icon;

              const customerDisplayName =
                order.customerName ||
                (order.customer
                  ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}`.trim()
                  : "") ||
                "Customer";

              const customerContact =
                order.customerPhone ||
                order.customer?.phone ||
                order.customerEmail ||
                order.customer?.email ||
                "—";

              return (
                <tr
                  key={order._id || order.id || order.orderId}
                  className="border-b hover:bg-slate-50 transition"
                >
                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          customerDisplayName
                        )}&background=10b981&color=fff`}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {customerDisplayName}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">
                          {customerContact}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Order */}

                  <td className="px-6 py-4 font-medium">
                    {order.orderId}
                  </td>

                  {/* Amount */}

                  <td className="px-6 py-4 font-semibold">
                    ₹{order.total}
                  </td>

                  {/* Payment */}

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentMethod === "COD"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {order.paymentMethod}
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}
                    >

                      <Icon size={14} />

                      {order.status}

                    </span>

                  </td>

                  {/* Action */}

                  <td className="px-6 py-4 text-right">

                    <button
                      onClick={() => onView(order)}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition"
                    >

                      <Eye size={16} />

                      View

                    </button>

                  </td>

                </tr>

              );
            })}

          </tbody>

        </table>

      </div>

    </motion.div>
  );
}