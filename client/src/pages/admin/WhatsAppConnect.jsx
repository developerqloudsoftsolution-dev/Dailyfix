import { useEffect, useState } from "react";
import { whatsappAPI } from "../../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  QrCode,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Send,
  Bell,
  Phone,
  Shield,
  Smartphone,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
  Package,
  MailCheck,
  UserCheck,
  Zap,
  Globe,
  Server,
  RotateCcw,
  Activity,
} from "lucide-react";

export default function WhatsAppConnect() {
  const [statusData, setStatusData] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(60);

  // Settings
  const [settings, setSettings] = useState({
    adminPhones: [],
    notifyConnectedNumber: true,
    apiUrl: "",
    apiKey: "",
    enabled: true,
    notifyCustomerOnOrder: true,
    notifyAdminOnOrder: true,
    notifyCustomerOnShipment: true,
    notifyAdminOnProductAdd: true,
    notifyAdminOnContact: true,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // New Phone Input
  const [newPhone, setNewPhone] = useState("");
  const [newLabel, setNewLabel] = useState("");

  // Test Message
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState(
    "🧪 *DailyFix Care WhatsApp Bot Test*\n\nYour WhatsApp connection is working smoothly! ✅"
  );
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    fetchStatus();
    fetchSettings();
  }, []);

  // Poll status periodically when scanning
  useEffect(() => {
    let interval = null;
    if (statusData?.status !== "connected") {
      interval = setInterval(() => {
        fetchStatus(false);
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [statusData?.status]);

  // QR countdown timer
  useEffect(() => {
    let timer = null;
    if (qrData?.qr && statusData?.status !== "connected") {
      setQrCountdown(60);
      timer = setInterval(() => {
        setQrCountdown((prev) => {
          if (prev <= 1) {
            fetchQrCode(2);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [qrData?.qr, statusData?.status]);

  const fetchStatus = async (showLoading = true) => {
    try {
      if (showLoading) setLoadingStatus(true);
      const res = await whatsappAPI.getStatus();
      if (res.ok) {
        setStatusData(res.data);
        if (res.data.status !== "connected" && !qrData?.qr) {
          fetchQrCode(3);
        }
      } else {
        setStatusData({ status: "disconnected", serviceOnline: false });
      }
    } catch (err) {
      setStatusData({ status: "disconnected", serviceOnline: false });
    } finally {
      if (showLoading) setLoadingStatus(false);
    }
  };

  const fetchQrCode = async (retries = 3) => {
    try {
      setLoadingQr(true);
      for (let i = 0; i < retries; i++) {
        const res = await whatsappAPI.getQr();
        if (res.ok && res.data?.qr) {
          setQrData(res.data);
          setLoadingQr(false);
          return true;
        }
        if (i < retries - 1) {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
      setQrData(null);
      return false;
    } catch (err) {
      setQrData(null);
      return false;
    } finally {
      setLoadingQr(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await whatsappAPI.getSettings();
      if (res.ok && res.data?.data) {
        const data = res.data.data;
        setSettings({
          adminPhones: data.adminPhones || [{ phone: data.adminPhone || "9503997749", label: "Primary Admin" }],
          notifyConnectedNumber: data.notifyConnectedNumber !== false,
          apiUrl: data.apiUrl || "",
          apiKey: data.apiKey || "",
          enabled: data.enabled !== false,
          notifyCustomerOnOrder: data.notifyCustomerOnOrder !== false,
          notifyAdminOnOrder: data.notifyAdminOnOrder !== false,
          notifyCustomerOnShipment: data.notifyCustomerOnShipment !== false,
          notifyAdminOnProductAdd: data.notifyAdminOnProductAdd !== false,
          notifyAdminOnContact: data.notifyAdminOnContact !== false,
        });
        if (!testPhone) {
          const first = data.adminPhones?.[0]?.phone || data.adminPhone;
          if (first) setTestPhone(first);
        }
      }
    } catch (err) {
      console.log("Failed to load settings:", err);
    }
  };

  const handleConnect = async () => {
    try {
      setLoadingQr(true);
      toast.loading("Generating WhatsApp QR code...", { id: "wa-connect" });
      const res = await whatsappAPI.connect();
      if (res.ok) {
        toast.loading("Fetching QR Code...", { id: "wa-connect" });
        const qrFound = await fetchQrCode(5);
        if (qrFound) {
          toast.success("Scan the QR code with WhatsApp!", { id: "wa-connect" });
        } else {
          toast.error("QR generating... click 'Refresh QR' in a few seconds.", { id: "wa-connect" });
        }
      } else {
        toast.error(res.data?.message || "Failed to initialize connection", { id: "wa-connect" });
      }
    } catch (err) {
      toast.error("Error connecting to WhatsApp", { id: "wa-connect" });
    } finally {
      setLoadingQr(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to disconnect WhatsApp? You can scan the QR code to reconnect anytime.")) {
      return;
    }
    try {
      toast.loading("Disconnecting session...", { id: "wa-logout" });
      const res = await whatsappAPI.logout();
      if (res.ok) {
        toast.success("WhatsApp logged out successfully", { id: "wa-logout" });
        setStatusData({ status: "disconnected", serviceOnline: true });
        setQrData(null);
        setTimeout(() => fetchQrCode(3), 1000);
      } else {
        toast.error("Failed to disconnect", { id: "wa-logout" });
      }
    } catch (err) {
      toast.error("Error disconnecting WhatsApp", { id: "wa-logout" });
    }
  };

  const handleAddAdminPhone = (e) => {
    e.preventDefault();
    if (!newPhone.trim()) {
      toast.error("Please enter a phone number");
      return;
    }
    const cleanPhone = newPhone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Phone number must have at least 10 digits");
      return;
    }

    const currentList = settings.adminPhones || [];
    if (currentList.some((item) => item.phone.replace(/\D/g, "") === cleanPhone)) {
      toast.error("This phone number is already in your admin list");
      return;
    }

    const updated = [
      ...currentList,
      { phone: newPhone.trim(), label: newLabel.trim() || `Admin ${currentList.length + 1}` },
    ];

    setSettings({ ...settings, adminPhones: updated });
    setNewPhone("");
    setNewLabel("");
    toast.success("Phone number added! Remember to save settings.");
  };

  const handleRemoveAdminPhone = (index) => {
    const currentList = settings.adminPhones || [];
    const updated = currentList.filter((_, i) => i !== index);
    setSettings({ ...settings, adminPhones: updated });
    toast.success("Number removed. Click 'Save Notification Settings' to apply.");
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await whatsappAPI.updateSettings(settings);
      if (res.ok) {
        toast.success("WhatsApp alert settings saved successfully!");
      } else {
        toast.error(res.data?.message || "Failed to save settings");
      }
    } catch (err) {
      toast.error("Error saving settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendTestMessage = async (targetPhone = null) => {
    const destination = targetPhone || testPhone;
    if (!destination || !destination.trim()) {
      toast.error("Please enter a recipient phone number");
      return;
    }
    try {
      setSendingTest(true);
      toast.loading(`Sending test message to ${destination}...`, { id: "wa-test" });
      const res = await whatsappAPI.sendTestMessage(destination.trim(), testMessage);
      if (res.ok) {
        toast.success(res.data?.message || `Message delivered to ${destination}!`, { id: "wa-test" });
      } else {
        toast.error(res.data?.message || "Failed to send message. Is WhatsApp connected?", { id: "wa-test" });
      }
    } catch (err) {
      toast.error("Error sending test message", { id: "wa-test" });
    } finally {
      setSendingTest(false);
    }
  };

  const isConnected = statusData?.status === "connected";
  const connectedNumber = statusData?.phone || (statusData?.user?.id ? statusData.user.id.split(":")[0] : null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="text-emerald-600" size={32} />
            WhatsApp Notifications & Bot
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Connect your WhatsApp to receive instant store alerts and send customer order receipts automatically.
          </p>
        </div>

        <button
          onClick={() => {
            fetchStatus();
            fetchSettings();
          }}
          className="self-start md:self-auto flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition text-sm font-medium"
        >
          <RefreshCw size={16} className={loadingStatus ? "animate-spin" : ""} /> Refresh Status
        </button>
      </div>

      {/* Main Grid: Left = QR & Connection, Right = Admin Recipients & Toggles */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* ========================================= */}
        {/* LEFT COLUMN: CONNECTION & QR CODE         */}
        {/* ========================================= */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5"
          >
            {/* Header / Badge */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isConnected
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <Smartphone size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">WhatsApp Device</h3>
                  <p className="text-xs text-slate-400">
                    {isConnected ? "Linked & Ready" : "Scan QR to Link"}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isConnected
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            {/* Connected State */}
            {isConnected ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Active WhatsApp Session</h4>
                    <p className="text-xs font-mono font-semibold text-emerald-800 mt-0.5">
                      +{connectedNumber || "Linked Phone"}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Auto-sending alerts and order receipts 🚀
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendTestMessage(connectedNumber)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-semibold transition shadow-sm"
                  >
                    <Send size={13} /> Test Ping Linked Number
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
                  >
                    <LogOut size={14} /> Disconnect
                  </button>
                </div>
              </div>
            ) : (
              /* Disconnected / QR Box */
              <div className="space-y-5">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[270px]">
                  {loadingQr ? (
                    <div className="flex flex-col items-center gap-2.5 text-slate-400 text-xs py-10">
                      <RefreshCw size={26} className="animate-spin text-emerald-600" />
                      <span className="font-medium text-slate-600">Generating live QR code...</span>
                    </div>
                  ) : qrData?.qr ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={qrData.qr}
                        alt="Scan WhatsApp QR"
                        className="w-56 h-56 rounded-xl border border-slate-200 shadow-sm bg-white p-2"
                      />
                      <div className="mt-3 flex items-center justify-between w-full px-4 text-xs">
                        <span className="flex items-center gap-1 text-slate-500 font-medium">
                          <RefreshCw size={11} className="animate-spin text-emerald-600" />
                          <span>Refreshes in {qrCountdown}s</span>
                        </span>
                        <button
                          onClick={() => fetchQrCode(2)}
                          className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline"
                        >
                          Refresh QR
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-3 py-6">
                      <QrCode size={48} className="mx-auto text-slate-300" />
                      <div>
                        <p className="font-semibold text-slate-700 text-sm">QR Code Ready</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">
                          Click below to start the WhatsApp connection and display your QR.
                        </p>
                      </div>
                      <button
                        onClick={handleConnect}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md shadow-emerald-600/20"
                      >
                        <QrCode size={15} /> Show QR Code
                      </button>
                    </div>
                  )}
                </div>

                {/* 3 Step Guide */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Shield size={14} className="text-emerald-600" /> 3 Steps to link:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11px]">
                    <li>Open <strong>WhatsApp</strong> on your mobile phone</li>
                    <li>Go to <strong>Settings</strong> / <strong>⋮ Menu</strong> &gt; <strong>Linked Devices</strong></li>
                    <li>Tap <strong>Link a Device</strong> and scan the QR code above</li>
                  </ol>
                </div>
              </div>
            )}
          </motion.div>

          {/* WhatsApp Microservice Health & Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3.5"
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Server size={15} className="text-slate-500" />
                WhatsApp Cloud Microservice
              </h4>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  statusData?.serviceOnline
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                <Activity size={12} className={statusData?.serviceOnline ? "text-emerald-500 animate-pulse" : "text-rose-500"} />
                {statusData?.serviceOnline ? "Online & Healthy" : "Offline / Connecting"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400 font-sans">Active Microservice:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={statusData?.apiUrl || settings.apiUrl || "Render Microservice"}>
                    {statusData?.apiUrl || settings.apiUrl || "https://dailyfix-whatsapp-backend.onrender.com"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="text-slate-400 font-sans">Connection Protocol:</span>
                  <span className="font-semibold text-slate-700 font-sans">Baileys Multi-Device (Render Cloud)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                The WhatsApp bot engine runs on the dedicated Render cloud microservice. Even if your store server restarts, your WhatsApp session remains linked.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ========================================= */}
        {/* RIGHT COLUMN: RECIPIENTS & TOGGLES        */}
        {/* ========================================= */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Card 1: Admin Alert Recipients */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Admin Alert Numbers
                    </h3>
                    <p className="text-xs text-slate-400">
                      Who receives instant WhatsApp alerts when new orders or inquiries arrive
                    </p>
                  </div>
                </div>
              </div>

              {/* Option A: Auto-notify the Connected/Linked WhatsApp Number */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="text-emerald-600" size={18} />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Auto-Notify Connected WhatsApp Number
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Automatically send store alerts to whichever phone is linked to WhatsApp
                        {connectedNumber && ` (+${connectedNumber})`}
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyConnectedNumber}
                    onChange={(e) =>
                      setSettings({ ...settings, notifyConnectedNumber: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Option B: Additional Admin Phone Numbers List */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Additional Admin Recipient Numbers ({settings.adminPhones?.length || 0})
                  </label>
                </div>

                {/* List of Numbers */}
                <div className="space-y-2">
                  {settings.adminPhones && settings.adminPhones.length > 0 ? (
                    settings.adminPhones.map((admin, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/70 rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-semibold text-slate-800">{admin.label || "Admin"}:</span>
                          <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-100">
                            {admin.phone}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSendTestMessage(admin.phone)}
                            title="Send test message to this number"
                            className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border px-2.5 py-1 rounded-lg text-[11px] font-medium transition"
                          >
                            <Send size={11} /> Test
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAdminPhone(idx)}
                            title="Remove number"
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                      No extra admin numbers added yet. Add numbers below.
                    </p>
                  )}
                </div>

                {/* Add New Number Form */}
                <div className="p-3 bg-slate-50/70 rounded-xl border border-dashed border-slate-200 space-y-2 pt-3">
                  <span className="text-xs font-semibold text-slate-700 block">
                    + Add Another Admin Phone Number
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    <input
                      type="text"
                      placeholder="Label (e.g. Manager / Packing)"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="md:col-span-4 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Phone (e.g. 919876543210)"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="md:col-span-5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddAdminPhone}
                      className="md:col-span-3 inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      <Plus size={14} /> Add Number
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Notification Event Triggers */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Automated Event Triggers
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enable or disable automatic WhatsApp messages
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* 1. Customer Order Confirmation */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <ShoppingBag size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Customer Order Receipt
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sends instant order receipt with items, total & tracking link to buyer
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyCustomerOnOrder}
                    onChange={(e) =>
                      setSettings({ ...settings, notifyCustomerOnOrder: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                {/* 2. Admin New Order Alert */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Admin New Order Alert
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sends new order summary instantly to all configured admin WhatsApp numbers
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyAdminOnOrder}
                    onChange={(e) =>
                      setSettings({ ...settings, notifyAdminOnOrder: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                {/* 3. Customer Shipment & Waybill */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Truck size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Customer Shipment & Tracking
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sends Delhivery AWB tracking number & tracking link when order is shipped
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyCustomerOnShipment}
                    onChange={(e) =>
                      setSettings({ ...settings, notifyCustomerOnShipment: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>

                {/* 4. Contact Form Inquiries */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                      <MailCheck size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        Contact Form Inquiry Alert
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sends visitor messages from the Contact Us page to admin numbers
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifyAdminOnContact}
                    onChange={(e) =>
                      setSettings({ ...settings, notifyAdminOnContact: e.target.checked })
                    }
                    className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  <Zap size={14} />
                  {savingSettings ? "Saving Settings..." : "Save Notification Settings"}
                </button>
              </div>
            </motion.div>

            {/* Card 3: Send Test WhatsApp Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Send size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Send Test WhatsApp Message</h3>
                  <p className="text-xs text-slate-400">Verify instant message delivery to any WhatsApp number</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Recipient Phone Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 919503997749 or 9876543210"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Message Content
                  </label>
                  <textarea
                    rows={2}
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleSendTestMessage()}
                    disabled={sendingTest || !isConnected}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition disabled:opacity-50 shadow-sm"
                  >
                    <Send size={13} />
                    {sendingTest ? "Sending Ping..." : isConnected ? "Send Test Message" : "Connect WhatsApp First"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Card 4: Advanced Microservice Settings */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Globe size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">API Cloud Microservice Config</h3>
                    <p className="text-xs text-slate-400">Backend endpoint for Baileys Multi-Device integration</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      apiUrl: "https://dailyfix-whatsapp-backend.onrender.com",
                      apiKey: process.env.VITE_WHATSAPP_API_KEY || "local-development-key",
                    });
                    toast.success("Reset API URL to Render Default! Remember to click Save.");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg font-medium transition"
                >
                  <RotateCcw size={12} /> Reset to Render Default
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    WhatsApp Microservice URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://dailyfix-whatsapp-backend.onrender.com"
                    value={settings.apiUrl || ""}
                    onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    API Secret Key
                  </label>
                  <input
                    type="text"
                    placeholder="local-development-key"
                    value={settings.apiKey || ""}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
}
