import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Ticket,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const PromoModal = () => {
  const [coupon, setCoupon] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 45, seconds: 20 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopupPromo();
  }, []);

  const fetchPopupPromo = async () => {
    try {
      const res = await api.get("/coupons/popup");
      if (res.data?.success && res.data.coupon) {
        const promo = res.data.coupon;
        const sessionKey = `dailyfix_promo_seen_${promo.code}`;
        const hasSeenInSession = sessionStorage.getItem(sessionKey);

        if (!hasSeenInSession) {
          setCoupon(promo);
          // Show popup smoothly after 1.5 seconds of visiting
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    } catch (err) {
      // Quietly ignore
    }
  };

  // Live countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    if (coupon) {
      sessionStorage.setItem(`dailyfix_promo_seen_${coupon.code}`, "true");
    }
    setIsOpen(false);
  };

  const handleCopyCode = (e) => {
    if (e) e.stopPropagation();
    if (!coupon) return;
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success(`Coupon '${coupon.code}' copied! Applied at checkout.`);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShopNow = () => {
    handleCopyCode();
    handleClose();
    navigate("/shop");
  };

  if (!isOpen || !coupon) return null;

  const hasCreativeImage = Boolean(coupon.bannerImage);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Dark Dim Blur Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-lg bg-slate-950 border border-white/15 rounded-3xl text-white shadow-2xl overflow-hidden z-10 my-auto flex flex-col group"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-purple-600/30 blur-3xl rounded-full pointer-events-none" />

          {/* Floating High-Contrast Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/80 hover:bg-black text-white/90 hover:text-white border border-white/25 flex items-center justify-center transition shadow-2xl z-30 backdrop-blur-md"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* =========================================================
              CREATIVE POSTER HERO (Focus 100% on the graphic)
              ========================================================= */}
          {hasCreativeImage ? (
            <div
              onClick={handleShopNow}
              className="relative w-full bg-black/60 cursor-pointer overflow-hidden max-h-[58vh] sm:max-h-[64vh] flex items-center justify-center"
            >
              <img
                src={coupon.bannerImage}
                alt={coupon.title || "Special Offer"}
                className="w-full h-auto max-h-[58vh] sm:max-h-[64vh] object-contain block transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Floating Top Left Urgent Countdown Badge */}
              <div className="absolute top-3.5 left-3.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-xl z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1 font-mono">
                  <Clock size={12} className="text-emerald-400" />
                  {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          ) : (
            /* Fallback Text Banner when no image is uploaded */
            <div className="p-8 text-center space-y-3 bg-gradient-to-b from-purple-900/60 to-slate-950">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-purple-300">
                <Sparkles size={13} className="text-purple-400" />
                {coupon.popupHeadline || "Limited Time Offer"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {coupon.title ||
                  (coupon.discountType === "percentage"
                    ? `${coupon.discountAmount}% OFF`
                    : `₹${coupon.discountAmount} FLAT OFF`)}
              </h2>
              {coupon.description && (
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  {coupon.description}
                </p>
              )}
            </div>
          )}

          {/* =========================================================
              CLEAN ACTION & COUPON STRIP AT BOTTOM
              ========================================================= */}
          <div className="bg-slate-900/95 border-t border-white/10 p-4 sm:p-5 space-y-3 relative z-10 backdrop-blur-lg">
            {/* Coupon Code Row */}
            <div className="flex items-center justify-between gap-2.5 bg-white/5 border border-dashed border-white/25 rounded-2xl px-3.5 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 flex-shrink-0">
                  <Ticket size={16} />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                    Use Coupon Code
                  </p>
                  <p className="font-mono text-base sm:text-lg font-black text-white tracking-widest truncate">
                    {coupon.code}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md flex-shrink-0 ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-slate-950 hover:bg-slate-100"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={13} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy Code
                  </>
                )}
              </button>
            </div>

            {/* Shop Now CTA Button */}
            <button
              type="button"
              onClick={handleShopNow}
              className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition group"
            >
              <ShoppingBag size={18} />
              <span>Claim Offer & Shop Now</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PromoModal;
