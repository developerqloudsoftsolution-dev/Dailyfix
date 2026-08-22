import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  Calendar,
  IndianRupee,
  Percent,
  Tag,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  ShoppingBag,
  Eye,
  Check,
  Upload,
  Image,
  ImageIcon,
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountAmount, setDiscountAmount] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [minQuantity, setMinQuantity] = useState("1");
  const [applicableType, setApplicableType] = useState("all"); // 'all' | 'specific'
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAsPopup, setShowAsPopup] = useState(false);
  const [popupHeadline, setPopupHeadline] = useState("Special Visitor Offer!");
  const [theme, setTheme] = useState("purple");
  const [bannerImage, setBannerImage] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");


  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/coupons");
      if (res.data?.success && res.data.coupons) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.products || res.data?.data || [];
      setProducts(list);
    } catch (err) {
      console.warn("Products fetch notice:", err.message);
    }
  };

  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be under 10MB");
      return;
    }

    try {
      setUploadingBanner(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/coupons/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success && res.data.imageUrl) {
        setBannerImage(res.data.imageUrl);
        toast.success("Offer creative uploaded successfully!");
      } else {
        toast.error(res.data?.message || "Failed to upload image");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discountAmount) {
      toast.error("Please enter a coupon code and discount amount.");
      return;
    }

    if (applicableType === "specific" && selectedProducts.length === 0) {
      toast.error("Please select at least one specific product for this coupon.");
      return;
    }

    try {
      setCreating(true);
      const res = await api.post("/coupons", {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        description: description.trim(),
        discountType,
        discountAmount: Number(discountAmount),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        minQuantity: Number(minQuantity || 1),
        applicableType,
        applicableProducts: applicableType === "specific" ? selectedProducts : [],
        showAsPopup,
        popupHeadline,
        theme,
        bannerImage: showAsPopup ? bannerImage : "",
        expiryDate: expiryDate || null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Customized coupon created successfully!");
        // Reset form
        setCode("");
        setTitle("");
        setDescription("");
        setDiscountAmount("");
        setMinOrderAmount("");
        setMaxDiscountAmount("");
        setMinQuantity("1");
        setApplicableType("all");
        setSelectedProducts([]);
        setShowAsPopup(false);
        setPopupHeadline("Special Visitor Offer!");
        setTheme("purple");
        setBannerImage("");
        setExpiryDate("");
        setUsageLimit("");
        fetchCoupons();
      } else {
        toast.error(res.data?.message || "Failed to create coupon");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setCreating(false);
    }
  };


  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/coupons/${id}/toggle`);
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchCoupons();
      }
    } catch (err) {
      toast.error("Failed to update coupon status");
    }
  };

  const handleDeleteCoupon = async (id, codeName) => {
    if (!window.confirm(`Are you sure you want to delete coupon '${codeName}'?`)) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchCoupons();
      }
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied '${text}' to clipboard!`);
  };

  const themeBadges = {
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    gold: "bg-amber-100 text-amber-800 border-amber-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    dark: "bg-slate-800 text-slate-100 border-slate-700",
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Ticket className="text-purple-600" size={32} /> Coupons & Promotional Offers
          </h1>
          <p className="text-slate-500 mt-1">
            Create high-converting coupons, multi-product bundles, visitor popups, and product-specific deals
          </p>
        </div>
        <button
          onClick={fetchCoupons}
          disabled={loading}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium shadow-sm transition text-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Grid: Create Form on Left, List on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Coupon Form (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-100/80 h-fit space-y-6"
        >
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Sparkles className="text-purple-600" size={20} />
            <h2 className="text-lg font-bold text-slate-900">Create Customized Coupon</h2>
          </div>

          <form onSubmit={handleCreateCoupon} className="space-y-4">
            {/* Coupon Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. BUNDLE20, SUMMER50, BEARDCARE"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-purple-500 focus:bg-white transition"
                required
              />
            </div>

            {/* Offer Title & Subtitle */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Offer Title / Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Buy 2 & Get 25% OFF!"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Offer Description / Subtitle
                </label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Special bundle offer for hair & beard care products"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition text-xs"
                />
              </div>
            </div>

            {/* Discount Type & Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Discount Type *
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Discount Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder={discountType === "percentage" ? "20" : "150"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-8 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-purple-500 focus:bg-white transition text-sm"
                    min="1"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    {discountType === "percentage" ? "%" : "₹"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bundle Min Quantity & Min Order */}
            <div className="grid grid-cols-2 gap-3 bg-purple-50/60 border border-purple-100 p-3 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">
                  Min. Items in Cart
                </label>
                <input
                  type="number"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  placeholder="1"
                  min="1"
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-purple-500 transition text-sm"
                />
                <span className="text-[10px] text-purple-600 font-medium">
                  {Number(minQuantity) > 1 ? `Requires ${minQuantity}+ items (Bundle Deal)` : "No minimum items"}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">
                  Min. Cart Total (₹)
                </label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  className="w-full bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-slate-900 focus:outline-none focus:border-purple-500 transition text-sm"
                />
                <span className="text-[10px] text-purple-600 font-medium">
                  {minOrderAmount > 0 ? `Min. ₹${minOrderAmount}` : "No minimum amount"}
                </span>
              </div>
            </div>

            {/* Product Scope: Storewide vs Specific Products */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Applies To:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setApplicableType("all")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                    applicableType === "all"
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <ShoppingBag size={14} /> All Products
                </button>
                <button
                  type="button"
                  onClick={() => setApplicableType("specific")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                    applicableType === "specific"
                      ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Layers size={14} /> Specific Products
                </button>
              </div>

              {applicableType === "specific" && (
                <div className="max-h-44 overflow-y-auto border border-purple-200 bg-purple-50/40 rounded-xl p-2.5 space-y-1.5 mt-2">
                  <p className="text-[11px] font-bold text-purple-900 mb-1">
                    Select Eligible Products ({selectedProducts.length} selected):
                  </p>
                  {products.map((p) => (
                    <label
                      key={p._id}
                      className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition text-xs text-slate-800"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(p._id)}
                        onChange={() => handleProductToggle(p._id)}
                        className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                      />
                      <span className="truncate font-medium">{p.name}</span>
                      <span className="text-slate-400 text-[10px] ml-auto">₹{p.price}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Visitor Promo Popup Toggle */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <Eye className="text-purple-600" size={18} />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Show as Visitor Promo Popup</p>
                    <p className="text-[10px] text-slate-500">
                      Displays interactive popup modal when customers visit your store
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={showAsPopup}
                  onChange={(e) => setShowAsPopup(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
              </label>

              {showAsPopup && (
                <div className="pt-2 border-t border-slate-200 space-y-3">
                  <input
                    type="text"
                    value={popupHeadline}
                    onChange={(e) => setPopupHeadline(e.target.value)}
                    placeholder="Popup headline (e.g. Exclusive Visitor Deal)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                  />

                  {/* Creative Banner Image Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Offer Creative / Banner Image:
                    </label>

                    {bannerImage ? (
                      <div className="relative rounded-xl overflow-hidden border border-purple-200 bg-white p-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <img
                            src={bannerImage}
                            alt="Banner Preview"
                            className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                          />
                          <div className="text-left truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">Banner Uploaded</p>
                            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                              <Check size={10} /> Ready for popup
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBannerImage("")}
                          className="text-slate-400 hover:text-red-500 text-xs font-bold px-2 py-1 bg-slate-100 hover:bg-red-50 rounded-lg transition"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 rounded-xl p-3 cursor-pointer transition text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerUpload}
                          disabled={uploadingBanner}
                          className="hidden"
                        />
                        {uploadingBanner ? (
                          <div className="flex items-center gap-2 text-purple-600 text-xs font-semibold">
                            <RefreshCw className="animate-spin" size={14} /> Uploading creative...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold">
                            <Upload size={14} /> Upload Offer Image (PNG / JPG / WEBP)
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Recommended: 600x400 or square promo creative
                        </p>
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Popup Theme Color:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {["purple", "emerald", "gold", "rose", "blue", "dark"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTheme(t)}
                          className={`w-6 h-6 rounded-full border-2 transition ${
                            theme === t ? "ring-2 ring-purple-600 scale-110" : ""
                          } ${
                            t === "purple"
                              ? "bg-purple-600"
                              : t === "emerald"
                              ? "bg-emerald-600"
                              : t === "gold"
                              ? "bg-amber-500"
                              : t === "rose"
                              ? "bg-rose-500"
                              : t === "blue"
                              ? "bg-blue-600"
                              : "bg-slate-900"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Expiry Date & Usage Limit */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white transition text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="Unlimited"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition text-sm"
                  min="1"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  <Plus size={18} /> Publish Coupon & Offer
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Existing Coupons List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Active Offers & Coupons ({coupons.length})
            </h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center">
              <RefreshCw className="animate-spin text-purple-600 mb-3" size={32} />
              <p className="text-slate-500 text-sm font-medium">Loading coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm space-y-3">
              <Tag className="text-slate-300 mx-auto" size={48} />
              <h3 className="text-lg font-bold text-slate-800">No Coupons Created Yet</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Use the customized creator on the left to set up discounts, bundle deals, and visitor popups!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map((coupon) => (
                <motion.div
                  key={coupon._id}
                  whileHover={{ y: -2 }}
                  className={`bg-white rounded-2xl p-5 border transition shadow-sm relative overflow-hidden flex flex-col justify-between ${
                    coupon.status === "active"
                      ? "border-purple-100 ring-1 ring-purple-100"
                      : "border-slate-200 opacity-60"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 tracking-wider">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => copyToClipboard(coupon.code)}
                          title="Copy Code"
                          className="text-slate-400 hover:text-purple-600 transition p-1"
                        >
                          <Copy size={15} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {coupon.showAsPopup && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                            <Eye size={10} /> Popup
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            coupon.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {coupon.status}
                        </span>
                      </div>
                    </div>

                    {/* Headline & Discount */}
                    <div className="space-y-1">
                      {coupon.title && (
                        <h4 className="font-bold text-sm text-slate-800 line-clamp-1">
                          {coupon.title}
                        </h4>
                      )}
                      <p className="text-2xl font-black text-slate-900">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountAmount}% OFF`
                          : `₹${coupon.discountAmount} FLAT OFF`}
                      </p>
                      {coupon.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {coupon.description}
                        </p>
                      )}
                    </div>

                    {/* Rules & Scopes Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                      {coupon.minQuantity > 1 && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                          📦 {coupon.minQuantity}+ Items Bundle
                        </span>
                      )}
                      {coupon.minOrderAmount > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          Min: ₹{coupon.minOrderAmount}
                        </span>
                      )}
                      {coupon.applicableType === "specific" && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                          🎯 {coupon.applicableProducts?.length || 0} Specific Product(s)
                        </span>
                      )}
                    </div>

                    {coupon.expiryDate && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar size={12} />
                        Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Used: <strong className="text-slate-700">{coupon.usedCount || 0}</strong>
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(coupon._id)}
                        className="text-xs font-semibold text-slate-600 hover:text-purple-600 transition px-2 py-1 bg-slate-50 hover:bg-purple-50 rounded-lg"
                      >
                        {coupon.status === "active" ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleDeleteCoupon(coupon._id, coupon.code)}
                        className="text-red-500 hover:text-red-700 transition p-1"
                        title="Delete Coupon"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;
