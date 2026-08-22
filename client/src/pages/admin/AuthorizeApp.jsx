import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Lock,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Truck,
  UserCheck,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";


const AuthorizeApp = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const appName = searchParams.get("app_name") || "Third-Party Application";
  const scope = searchParams.get("scope") || "read_write";
  const userId = searchParams.get("user_id") || "";
  const returnUrl = searchParams.get("return_url") || "";
  const callbackUrl = searchParams.get("callback_url") || "";

  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve' | 'deny'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // In-line Login state for unauthenticated admins
  const [email, setEmail] = useState("orders@dailyfixcare.com");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setCheckingAuth(false);
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      setLoggingIn(true);
      const res = await api.post("/admin/login", { email, password });
      if (res.data && res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        setIsAuthenticated(true);
        toast.success("Admin authenticated successfully!");
      } else {
        toast.error(res.data?.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleApprove = async () => {
    if (!returnUrl || !callbackUrl) {
      toast.error("Invalid return_url or callback_url provided by client.");
      return;
    }

    try {
      setLoading(true);
      setActionType("approve");

      const res = await api.post("/auth/authorize/approve", {
        app_name: appName,
        scope,
        user_id: userId,
        return_url: returnUrl,
        callback_url: callbackUrl,
      });

      if (res.data && res.data.redirect_url) {
        toast.success(`Access granted to ${appName}! Redirecting...`, { duration: 3000 });
        setTimeout(() => {
          window.location.href = res.data.redirect_url;
        }, 1200);
      } else {
        toast.error("Failed to generate authorization credentials.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Approve error:", err);
      toast.error(err.response?.data?.message || "Authorization approval failed.");
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!returnUrl) {
      navigate("/admin");
      return;
    }

    try {
      setLoading(true);
      setActionType("deny");

      const res = await api.post("/auth/authorize/deny", {
        app_name: appName,
        user_id: userId,
        return_url: returnUrl,
      });

      if (res.data && res.data.redirect_url) {
        toast.error(`Access denied. Redirecting...`, { duration: 2000 });
        setTimeout(() => {
          window.location.href = res.data.redirect_url;
        }, 1000);
      } else {
        navigate("/admin");
      }
    } catch (err) {
      // Fallback redirect
      const url = new URL(returnUrl);
      url.searchParams.set("success", "0");
      url.searchParams.set("denied", "1");
      window.location.href = url.toString();
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <RefreshCw className="animate-spin text-purple-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Top Glow Accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />

        {/* Store Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg">
              DF
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Dailyfix Store</h2>
              <p className="text-xs text-slate-400">WooCommerce App Authorization Bridge</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Lock size={12} /> Secure OAuth
          </div>
        </div>

        {!isAuthenticated ? (
          /* Admin Login Form if not logged in */
          <div className="py-6 space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white">Store Admin Login Required</h3>
              <p className="text-sm text-slate-400">
                Please log in as a store administrator to authorize <strong>{appName}</strong>.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition"
                  placeholder="admin@dailyfixcare.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loggingIn ? <RefreshCw className="animate-spin" size={18} /> : "Log In & Continue"}
              </button>
            </form>
          </div>
        ) : (
          /* Authorization Request Details */
          <div className="py-6 space-y-6">
            {/* Request Card */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                {appName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">{appName}</h3>
                <p className="text-xs text-slate-400 truncate">
                  External User ID: <span className="font-mono text-purple-300">{userId || "N/A"}</span>
                </p>
                <p className="text-xs text-slate-400">
                  Wants to connect to your <strong>Dailyfix Store</strong>
                </p>
              </div>
            </div>

            {/* Scope Permissions Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Requested Access Level:
              </h4>

              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                  <ShoppingBag className="text-purple-400 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {scope === "read"
                        ? "Read Orders & Customer Addresses"
                        : "Read & Update Store Orders"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Allows {appName} to fetch shipping details, customer addresses, and order items.
                    </p>
                  </div>
                </div>

                {(scope === "write" || scope === "read_write") && (
                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                    <Truck className="text-indigo-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Create Shipments & Update Tracking AWB
                      </p>
                      <p className="text-xs text-slate-400">
                        Allows {appName} to assign AWB numbers, download packing slips, and update order statuses.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Warning / Info */}
            <div className="flex items-start gap-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-xs text-purple-200">
              <ShieldCheck className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
              <p>
                A dedicated pair of credentials (<code>Consumer Key</code> & <code>Consumer Secret</code>) will be securely transmitted to {appName}. You can revoke this access at any time in Store Settings.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDeny}
                disabled={loading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-semibold border border-white/10 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && actionType === "deny" ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <>
                    <XCircle size={16} /> Deny
                  </>
                )}
              </button>

              <button
                onClick={handleApprove}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-purple-600/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && actionType === "approve" ? (
                  <RefreshCw className="animate-spin" size={16} />
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Approve & Connect
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthorizeApp;
