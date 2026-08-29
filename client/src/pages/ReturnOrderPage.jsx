import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Search,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Phone,
  Mail,
  ChevronRight,
  Check,
  X,
  CreditCard,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import { orderAPI, productAPI } from "../services/api";

const RETURN_REASONS = [
  { id: "damaged", label: "Damaged in transit / Broken seal", icon: "📦" },
  { id: "defective", label: "Defective packaging / Leaking item", icon: "🧴" },
  { id: "wrong_item", label: "Wrong shade or incorrect item received", icon: "🎨" },
  { id: "quality", label: "Quality concern / Manufacturing issue", icon: "⚠️" },
  { id: "other", label: "Other issue", icon: "❓" },
];

export default function ReturnOrderPage() {
  // Step 1: Order Lookup State
  const [orderId, setOrderId] = useState("");
  const [contactIdentifier, setContactIdentifier] = useState(""); // phone or email
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [order, setOrder] = useState(null);

  // Step 2: Return Request Form State
  const [selectedReason, setSelectedReason] = useState(RETURN_REASONS[0].label);
  const [returnType, setReturnType] = useState("Replacement"); // "Replacement" | "Refund"
  const [customerComments, setCustomerComments] = useState("");
  const [proofImages, setProofImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
  });
  const [showBankForm, setShowBankForm] = useState(false);

  // Step 3: Submission Status
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  // 1. Handle Order Lookup
  const handleLookupOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error("Please enter your Order ID");
      return;
    }
    if (!contactIdentifier.trim()) {
      toast.error("Please enter your registered phone number or email");
      return;
    }

    try {
      setLoadingOrder(true);
      const res = await orderAPI.getOrderById(orderId.trim());
      if (res.ok && res.data?.order) {
        const fetchedOrder = res.data.order;
        const cleanInput = contactIdentifier.trim().toLowerCase().replace(/\D/g, "");
        const orderPhone = String(fetchedOrder.customer?.phone || "").replace(/\D/g, "");
        const orderEmail = String(fetchedOrder.customer?.email || "").trim().toLowerCase();

        const matches =
          (cleanInput && orderPhone.includes(cleanInput)) ||
          contactIdentifier.trim().toLowerCase() === orderEmail;

        if (!matches) {
          toast.error("Phone number or email does not match this Order ID.");
          setOrder(null);
          return;
        }

        setOrder(fetchedOrder);

        // If order already has a return request
        if (fetchedOrder.returnRequest && fetchedOrder.returnRequest.status !== "None") {
          setSubmittedRequest(fetchedOrder.returnRequest);
        } else {
          setSubmittedRequest(null);
        }

        toast.success("Order verified successfully!");
      } else {
        toast.error(res.data?.message || "Order not found. Please check your Order ID.");
        setOrder(null);
      }
    } catch (err) {
      toast.error("Error looking up order. Please try again.");
      setOrder(null);
    } finally {
      setLoadingOrder(false);
    }
  };

  // 2. Handle Image Upload for Proof
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (proofImages.length >= 3) {
      toast.error("Maximum 3 proof images allowed.");
      return;
    }

    try {
      setUploadingImage(true);
      toast.loading("Uploading photo...", { id: "upload-proof" });
      const res = await productAPI.uploadProductImage(file);
      if (res.ok && res.data?.imageUrl) {
        setProofImages((prev) => [...prev, res.data.imageUrl]);
        toast.success("Photo attached successfully!", { id: "upload-proof" });
      } else {
        toast.error("Failed to upload image.", { id: "upload-proof" });
      }
    } catch (err) {
      toast.error("Error uploading image.", { id: "upload-proof" });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeProofImage = (index) => {
    setProofImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 3. Handle Submit Return Request
  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!order) return;

    if (returnType === "Refund" && order.paymentMethod === "COD" && !upiId.trim() && !bankDetails.accountNumber.trim()) {
      toast.error("Please provide your UPI ID or Bank Details for your COD refund.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        orderId: order.orderId,
        phone: contactIdentifier,
        email: contactIdentifier,
        reason: selectedReason,
        returnType,
        customerComments,
        proofImages,
        upiId: upiId.trim(),
        bankDetails,
      };

      const res = await orderAPI.initiateReturn(payload);
      if (res.ok) {
        toast.success("Return request submitted successfully!");
        setSubmittedRequest(res.data.order?.returnRequest || {
          status: "Pending",
          reason: selectedReason,
          returnType,
          requestedAt: new Date(),
        });
      } else {
        toast.error(res.data?.message || "Failed to submit return request.");
      }
    } catch (err) {
      toast.error("An error occurred while submitting your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 shadow-sm">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span>DailyFix Hassle-Free Returns & Replacements</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Initiate Product Return
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Received a damaged, defective, or incorrect shade? Submit your request below for an instant doorstep reverse pickup or free replacement.
          </p>
        </div>

        {/* 3 Steps Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Verify Your Order</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Enter your Order ID & phone number to retrieve details.</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Choose Action</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Select Free Replacement or Direct Refund with reasons.</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Doorstep Pickup</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Ekart courier will collect the parcel from your home.</p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: ORDER LOOKUP FORM                             */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search size={18} className="text-indigo-600" />
              Step 1: Look Up Your Order
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Find your order using your Order ID (from email/SMS) and registered mobile number.
            </p>
          </div>

          <form onSubmit={handleLookupOrder} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Order ID *
              </label>
              <div className="relative">
                <Package size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. DFX2026..."
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 uppercase"
                />
              </div>
            </div>

            <div className="sm:col-span-6 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Registered Phone / Email *
              </label>
              <div className="relative">
                <Phone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={contactIdentifier}
                  onChange={(e) => setContactIdentifier(e.target.value)}
                  placeholder="10-digit mobile number or email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="sm:col-span-12 flex justify-end pt-2">
              <button
                type="submit"
                disabled={loadingOrder}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loadingOrder ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Searching Order...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: VERIFIED ORDER SUMMARY & RETURN FORM           */}
        {/* ========================================================= */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Order Card Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Order #{order.orderId}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} • Payment: {order.paymentMethod}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="text-lg font-bold text-slate-900">₹{order.total}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600">Ordered Items:</p>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {item.quantity || 1}x
                        </div>
                        <span className="font-medium text-slate-800">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">₹{item.price * (item.quantity || 1)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 flex items-start gap-2.5">
                <Truck size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Delivery & Pickup Address:</span>
                  <p className="text-slate-500 mt-0.5">
                    {order.customer?.firstName} {order.customer?.lastName} • {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* SUB-VIEW A: RETURN REQUEST ALREADY SUBMITTED             */}
            {/* ========================================================= */}
            {submittedRequest ? (
              <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Return Request Active</h3>
                    <p className="text-xs text-slate-500">Status: <strong className="text-emerald-700">{submittedRequest.status}</strong></p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Requested Action:</span>
                      <strong className="text-slate-800 font-semibold">{submittedRequest.returnType}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Reason:</span>
                      <strong className="text-slate-800 font-semibold">{submittedRequest.reason}</strong>
                    </div>
                    {submittedRequest.returnWaybill && (
                      <div className="sm:col-span-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <span className="text-emerald-800 font-bold block">🚚 Ekart Reverse Pickup Scheduled:</span>
                        <p className="text-emerald-700 mt-0.5">AWB: <strong className="font-mono">{submittedRequest.returnWaybill}</strong></p>
                      </div>
                    )}
                  </div>

                  {submittedRequest.customerComments && (
                    <p className="text-slate-600 italic border-t pt-2">"{submittedRequest.customerComments}"</p>
                  )}
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500">
                    Need additional support? Contact us directly at <a href="mailto:orders@dailyfixcare.com" className="text-indigo-600 font-bold underline">orders@dailyfixcare.com</a>.
                  </p>
                </div>
              </div>
            ) : (
              /* ========================================================= */
              /* SUB-VIEW B: NEW RETURN REQUEST FORM                      */
              /* ========================================================= */
              <form onSubmit={handleSubmitReturn} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <RotateCcw size={18} className="text-emerald-600" />
                    Step 2: Choose Return / Replacement Details
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your preferred solution and provide reason details.
                  </p>
                </div>

                {/* Return Type Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    What would you like? *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setReturnType("Replacement")}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                        returnType === "Replacement"
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                        returnType === "Replacement" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"
                      }`}>
                        {returnType === "Replacement" && <Check size={12} className="stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Free Replacement (Recommended)</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          We will dispatch a brand-new sealed unit to your doorstep immediately at no extra cost.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setReturnType("Refund")}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 ${
                        returnType === "Refund"
                          ? "border-emerald-600 bg-emerald-50/50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                        returnType === "Refund" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"
                      }`}>
                        {returnType === "Refund" && <Check size={12} className="stroke-[3]" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Direct Refund</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Refund back to your original payment mode (or UPI for COD orders).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Reason for Return / Replacement *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {RETURN_REASONS.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedReason(r.label)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-2.5 text-xs ${
                          selectedReason === r.label
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold"
                            : "border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        <span className="text-base">{r.icon}</span>
                        <span>{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Comments */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Explain the issue in detail (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={customerComments}
                    onChange={(e) => setCustomerComments(e.target.value)}
                    placeholder="Describe what was wrong with the package or product..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                {/* Photo Proof Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Attach Photos of Damaged / Defective Item (Optional but speeds up approval)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {proofImages.map((imgUrl, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden group shadow-sm bg-white">
                        <img src={imgUrl} alt={`Proof ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeProofImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 transition shadow"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {proofImages.length < 3 && (
                      <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition text-slate-400 hover:text-emerald-700">
                        <Upload size={18} />
                        <span className="text-[10px] font-medium">Add Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* COD Refund UPI ID / Bank Details */}
                {returnType === "Refund" && (
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 text-xs">
                    <p className="font-bold text-amber-900 flex items-center gap-1.5">
                      <CreditCard size={15} /> Refund Account Details:
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      For Cash on Delivery orders, please specify your UPI ID or Bank Account where you want the refund deposited.
                    </p>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        UPI ID (e.g. 9876543210@paytm, name@okhdfcbank)
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-400">
                    By submitting, an Ekart reverse pickup request will be evaluated by our admin team.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Return Request</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
}
