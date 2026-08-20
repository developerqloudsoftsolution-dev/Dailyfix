import Avatar from "../../components/Avatar";
import Modal from "../../components/Modal";
import {
  Users,
  Search,
  IndianRupee,
  ShoppingBag,
  Mail,
  Phone,
  Eye,
  X,
  ExternalLink,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  RefreshCw,
  Clock,
} from "lucide-react";

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [ordersModalCustomer, setOrdersModalCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      const list = res.data?.data || [];
      setCustomers(list);
      setFilteredCustomers(list);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let data = [...customers];
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower) ||
          c.phone?.includes(search) ||
          c.city?.toLowerCase().includes(searchLower) ||
          c.state?.toLowerCase().includes(searchLower)
      );
    }
    setFilteredCustomers(data);
  };

  const totalCustomers = customers.length;

  const totalOrders = useMemo(() => {
    return customers.reduce(
      (sum, customer) => sum + Number(customer.totalOrders || 0),
      0
    );
  }, [customers]);

  const totalRevenue = useMemo(() => {
    return customers.reduce(
      (sum, customer) => sum + Number(customer.totalSpent || 0),
      0
    );
  }, [customers]);

  // Open Customer Orders Modal
  const openCustomerOrders = async (customer) => {
    setOrdersModalCustomer(customer);
    setCustomerOrders([]);
    setLoadingOrders(true);
    try {
      const identifier = customer.email || customer.phone;
      const res = await api.get(`/admin/users/${encodeURIComponent(identifier)}/orders`);
      if (res.data?.data) {
        setCustomerOrders(res.data.data);
      }
    } catch (err) {
      console.log("Failed to fetch customer orders:", err);
      toast.error("Could not load customer orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="text-emerald-600" size={32} />
            Customers
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View and manage customer profiles, address books, and order history.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          className="self-start md:self-auto flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition text-sm font-medium"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-5">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Total Customers
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">{totalCustomers}</h2>
          <p className="text-xs text-slate-400 mt-1">Registered e-commerce buyers</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Total Orders Placed
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">{totalOrders}</h2>
          <p className="text-xs text-slate-400 mt-1">Cumulative order volume</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Total Revenue Generated
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <IndianRupee size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Lifetime customer value</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, phone, or city..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Delivery Location</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-500">
                    <Users className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="font-medium text-slate-600">No Customers Found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={customer.name || "Customer"}
                          size="lg"
                        />
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {customer.name || "Customer"}
                          </h3>
                          <p className="text-xs text-slate-400">
                            Last Active:{" "}
                            {customer.lastOrderDate
                              ? new Date(customer.lastOrderDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Recent"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Mail size={13} className="text-slate-400" />
                          <span className="truncate max-w-[170px]">{customer.email || "No Email"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Phone size={13} className="text-slate-400" />
                          <span>{customer.phone || "No Phone"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Orders */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {customer.totalOrders || 0} Orders
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td className="px-6 py-4 font-bold text-emerald-700">
                      ₹{Number(customer.totalSpent || 0).toLocaleString("en-IN")}
                    </td>

                    {/* Address */}
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div className="max-w-[200px] truncate">
                        {customer.address ||
                          (customer.city && `${customer.city}, ${customer.state || ""}`) ||
                          "Address not provided"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <Eye size={13} /> View
                        </button>

                        <button
                          onClick={() => openCustomerOrders(customer)}
                          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <ShoppingBag size={13} /> Orders
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
      {/* CUSTOMER DETAILS MODAL (VIEW)            */}
      {/* ========================================= */}
      <Modal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        maxWidth="max-w-lg"
      >
        {selectedCustomer && (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <div className="flex items-center gap-3">
                <Avatar
                  name={selectedCustomer.name || "Customer"}
                  size="md"
                />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedCustomer.name}
                  </h2>
                  <p className="text-xs text-slate-500">Customer Profile</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Total Orders</span>
                  <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                    {selectedCustomer.totalOrders || 0}
                  </span>
                </div>
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-xs text-emerald-700 font-medium block">Lifetime Spend</span>
                  <span className="text-xl font-bold text-emerald-800 mt-0.5 block">
                    ₹{Number(selectedCustomer.totalSpent || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2.5">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Contact Details
                </h3>
                <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail size={13} /> Email:
                  </span>
                  <a
                    href={`mailto:${selectedCustomer.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {selectedCustomer.email || "N/A"}
                  </a>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone size={13} /> Phone:
                  </span>
                  <a
                    href={`tel:${selectedCustomer.phone}`}
                    className="font-medium text-emerald-700 hover:underline"
                  >
                    {selectedCustomer.phone || "N/A"}
                  </a>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" /> Default Delivery Address
                </h3>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {selectedCustomer.address || "Address details not available"}
                  <br />
                  {selectedCustomer.city && `${selectedCustomer.city}, `}
                  {selectedCustomer.state && `${selectedCustomer.state} `}
                  {selectedCustomer.pincode && `- ${selectedCustomer.pincode}`}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-between items-center">
              <button
                onClick={() => {
                  const cust = selectedCustomer;
                  setSelectedCustomer(null);
                  openCustomerOrders(cust);
                }}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
              >
                <ShoppingBag size={14} /> View Order History
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================= */}
      {/* CUSTOMER ORDERS MODAL                     */}
      {/* ========================================= */}
      <Modal
        isOpen={Boolean(ordersModalCustomer)}
        onClose={() => setOrdersModalCustomer(null)}
        maxWidth="max-w-3xl"
      >
        {ordersModalCustomer && (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Orders Placed by {ordersModalCustomer.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {ordersModalCustomer.email || ordersModalCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOrdersModalCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {loadingOrders ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin" size={16} /> Loading customer orders...
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Package className="mx-auto text-slate-300 mb-2" size={36} />
                  <p className="font-medium text-slate-600">No Orders Found</p>
                  <p className="text-xs text-slate-400 mt-1">This customer has not completed any orders yet.</p>
                </div>
              ) : (
                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {customerOrders.map((order) => (
                    <div
                      key={order._id}
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/80 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm">{order.orderId}</span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : order.status === "Shipped"
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : order.status === "Cancelled"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("en-IN")
                            : "Recent"}
                          {" • "}
                          {order.paymentMethod || "COD"}
                          {order.delhivery?.waybill && (
                            <span className="text-emerald-600 font-mono ml-2">
                              AWB: {order.delhivery.waybill}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-900 text-sm">
                          ₹{order.total || order.totalAmount || 0}
                        </span>
                        <button
                          onClick={() => {
                            setOrdersModalCustomer(null);
                            navigate(`/admin/orders?search=${order.orderId}`);
                          }}
                          className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                          View in Orders <ExternalLink size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
              <button
                onClick={() => setOrdersModalCustomer(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition"
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