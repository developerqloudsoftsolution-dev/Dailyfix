import { useEffect, useState, useMemo } from "react";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  UserPlus,
  Search,
  KeyRound,
  Edit,
  Trash2,
  X,
  Check,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Crown,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [passwordModalAdmin, setPasswordModalAdmin] = useState(null);
  const [deletingAdmin, setDeletingAdmin] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Admin",
    status: "Active",
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllAdmins();
      if (res.ok && res.data?.data) {
        setAdmins(res.data.data);
      } else {
        toast.error(res.data?.message || "Failed to load admin accounts");
      }
    } catch (err) {
      toast.error("Error fetching admins");
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = useMemo(() => {
    return admins.filter((a) => {
      const matchSearch =
        search === "" ||
        a.name?.toLowerCase().includes(search.toLowerCase()) ||
        a.email?.toLowerCase().includes(search.toLowerCase()) ||
        a.role?.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === "All" || a.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [admins, search, roleFilter]);

  // Handle Create Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      toast.error("Please fill in email/username and password");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminAPI.createAdmin({
        name: formData.name.trim() || "Admin User",
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        status: formData.status,
      });

      if (res.ok) {
        toast.success("Admin account created successfully!");
        setShowCreateModal(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "Admin",
          status: "Active",
        });
        fetchAdmins();
      } else {
        toast.error(res.data?.message || "Failed to create admin");
      }
    } catch (err) {
      toast.error("Error creating admin");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Update Admin Details
  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!editingAdmin) return;
    if (!formData.email.trim()) {
      toast.error("Email or Username is required");
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminAPI.updateAdmin(editingAdmin._id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
      });

      if (res.ok) {
        toast.success("Admin details updated!");
        setEditingAdmin(null);
        fetchAdmins();
      } else {
        toast.error(res.data?.message || "Failed to update admin");
      }
    } catch (err) {
      toast.error("Error updating admin");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordModalAdmin) return;
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setSubmitting(true);
      const res = await adminAPI.updateAdminPassword(
        passwordModalAdmin._id,
        passwordForm.newPassword
      );

      if (res.ok) {
        toast.success(res.data?.message || "Password updated successfully!");
        setPasswordModalAdmin(null);
        setPasswordForm({ newPassword: "", confirmPassword: "" });
      } else {
        toast.error(res.data?.message || "Failed to update password");
      }
    } catch (err) {
      toast.error("Error updating password");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Admin
  const handleDeleteAdmin = async () => {
    if (!deletingAdmin) return;

    try {
      setSubmitting(true);
      const res = await adminAPI.deleteAdmin(deletingAdmin._id);
      if (res.ok) {
        toast.success("Admin account deleted successfully");
        setDeletingAdmin(null);
        fetchAdmins();
      } else {
        toast.error(res.data?.message || "Failed to delete admin");
      }
    } catch (err) {
      toast.error("Error deleting admin");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name || "Admin User",
      email: admin.email || "",
      role: admin.role || "Admin",
      status: admin.status || "Active",
      password: "",
      confirmPassword: "",
    });
  };

  const openPasswordModal = (admin) => {
    setPasswordModalAdmin(admin);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setShowPassword(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="text-emerald-600" size={32} />
            Manage Admins
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create and manage administrator accounts, reset passwords, and assign roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdmins}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition text-sm font-medium"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={() => {
              setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "Admin",
                status: "Active",
              });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition text-sm font-semibold shadow-md shadow-emerald-600/20"
          >
            <UserPlus size={17} /> Add New Admin
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Total Administrators
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Shield size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">{admins.length}</h2>
          <p className="text-xs text-slate-400 mt-1">Authorized dashboard users</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Super Admins
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Crown size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {admins.filter((a) => a.role === "Super Admin").length}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Full system privilege accounts</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Active Accounts
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {admins.filter((a) => a.status !== "Inactive").length}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Ready for dashboard login</p>
        </motion.div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by Name, Username or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none"
        >
          <option value="All">All Roles</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Support">Support</option>
        </select>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider border-b">
              <tr>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Username / Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-500">
                    <Shield className="mx-auto text-slate-300 mb-2" size={36} />
                    <p className="font-medium text-slate-600">No Admin Accounts Found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Name & Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            admin.name || admin.email
                          )}&background=10b981&color=fff`}
                          alt={admin.name}
                          className="w-10 h-10 rounded-full border border-emerald-100 shadow-sm"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{admin.name || "Admin User"}</p>
                          <p className="text-xs text-slate-400">ID: {admin._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email / Username */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {admin.email}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          admin.role === "Super Admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : admin.role === "Manager"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {admin.role === "Super Admin" && <Crown size={12} />}
                        {admin.role || "Admin"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          admin.status === "Inactive"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {admin.status || "Active"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {admin.createdAt
                        ? new Date(admin.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button
                          onClick={() => openPasswordModal(admin)}
                          title="Change Password"
                          className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <KeyRound size={13} /> Password
                        </button>
                        <button
                          onClick={() => openEditModal(admin)}
                          title="Edit Info"
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingAdmin(admin)}
                          title="Delete Admin"
                          className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 p-1.5 rounded-lg text-xs font-semibold transition"
                        >
                          <Trash2 size={14} />
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
      {/* CREATE NEW ADMIN MODAL                    */}
      {/* ========================================= */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
                <div className="flex items-center gap-2">
                  <UserPlus className="text-emerald-600" size={20} />
                  <h2 className="text-base font-bold text-slate-900">Add New Administrator</h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Amar Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Username or Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. amarvcode or amar@dailyfixcare.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Password * (Min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    {submitting ? "Creating..." : "Create Admin"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* EDIT ADMIN INFO MODAL                     */}
      {/* ========================================= */}
      <AnimatePresence>
        {editingAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
                <div className="flex items-center gap-2">
                  <Edit className="text-emerald-600" size={18} />
                  <h2 className="text-base font-bold text-slate-900">Edit Admin Info</h2>
                </div>
                <button
                  onClick={() => setEditingAdmin(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateAdmin} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Username / Email Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingAdmin(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* CHANGE PASSWORD MODAL                     */}
      {/* ========================================= */}
      <AnimatePresence>
        {passwordModalAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50">
                <div className="flex items-center gap-2">
                  <KeyRound className="text-amber-600" size={18} />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Change Admin Password</h2>
                    <p className="text-xs text-slate-500">{passwordModalAdmin.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPasswordModalAdmin(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    New Password * (Min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPasswordModalAdmin(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    {submitting ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* DELETE CONFIRMATION MODAL                 */}
      {/* ========================================= */}
      <AnimatePresence>
        {deletingAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Delete Admin Account?</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Are you sure you want to remove <strong>{deletingAdmin.email}</strong>? This user will no longer be able to log in to the admin panel.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingAdmin(null)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAdmin}
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    {submitting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
