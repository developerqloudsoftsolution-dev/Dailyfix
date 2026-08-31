import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2, ShieldCheck, Zap, Truck, ArrowUpRight } from "lucide-react";

import amazonLogo from "../assets/images/logos/amazon.svg";
import flipkartLogo from "../assets/logo/Flipkart-Logo-2015-present.jpg";
import shopsyLogo from "../assets/logo/flipkart-shopsyjpg.webp";
import nykaaLogo from "../assets/images/logos/nykaa.svg";

// Official Marketplaces with exact requested brand assets
const MARKETPLACES = [
  {
    id: "amazon",
    name: "Amazon",
    tagline: "Prime Fast Delivery",
    badge: "Official Store",
    logoSrc: amazonLogo,
    logoAlt: "Amazon India",
    logoHeight: "h-8 sm:h-9",
    accentColor: "hover:border-amber-400/80 hover:shadow-amber-500/15",
    buttonBg: "bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold",
    url: "https://www.amazon.in/s?k=dailyfix+beard+colour"
  },
  {
    id: "flipkart",
    name: "Flipkart",
    tagline: "Flipkart Assured",
    badge: "100% Genuine",
    logoSrc: flipkartLogo,
    logoAlt: "Flipkart",
    logoHeight: "h-11 sm:h-12",
    accentColor: "hover:border-blue-500/80 hover:shadow-blue-500/15",
    buttonBg: "bg-blue-600 hover:bg-blue-700 text-white font-bold",
    url: "https://www.flipkart.com/search?q=dailyfix+beard+colour"
  },
  {
    id: "shopsy",
    name: "Shopsy",
    tagline: "By Flipkart Deals",
    badge: "Best Value",
    logoSrc: shopsyLogo,
    logoAlt: "Shopsy by Flipkart",
    logoHeight: "h-11 sm:h-12",
    accentColor: "hover:border-rose-500/80 hover:shadow-rose-500/15",
    buttonBg: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold",
    url: "https://www.shopsy.in/search?q=dailyfix"
  },
  {
    id: "nykaa",
    name: "Nykaa",
    tagline: "Beauty & Men's Care",
    badge: "100% Authentic",
    logoSrc: nykaaLogo,
    logoAlt: "Nykaa",
    logoHeight: "h-8 sm:h-9",
    accentColor: "hover:border-pink-500/80 hover:shadow-pink-500/15",
    buttonBg: "bg-pink-600 hover:bg-pink-700 text-white font-bold",
    url: "https://www.nykaa.com/search/result/?q=dailyfix"
  }
];

const Marketplaces = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-stone-50/80 to-white border-t border-stone-200/70">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-sm"
          >
            <ShieldCheck size={15} className="text-emerald-600" />
            <span>Available on Leading Marketplaces</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight leading-tight"
          >
            Find Dailyfix On Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">
              Favorite Apps
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            Prefer shopping on your trusted platform? Order genuine Dailyfix Ammonia-Free Beard Colour with fast doorstep shipping across India.
          </motion.p>
        </div>

        {/* 4 Marketplace Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6">
          {MARKETPLACES.map((market, index) => (
            <motion.a
              key={market.id}
              href={market.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`group relative bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 ${market.accentColor}`}
            >
              {/* Top Row: Badge + Arrow */}
              <div className="flex items-center justify-between mb-5">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-extrabold uppercase tracking-wider group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  {market.badge}
                </span>

                <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-stone-900 text-stone-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Official Brand Logo */}
              <div className="h-16 flex items-center justify-start mb-6">
                <img
                  src={market.logoSrc}
                  alt={market.logoAlt}
                  loading="lazy"
                  className={`${market.logoHeight} w-auto max-w-[180px] object-contain group-hover:scale-105 transition-transform duration-300`}
                />
              </div>

              {/* Tagline & Action Button */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500 font-semibold mb-4">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>{market.tagline}</span>
                </div>

                <div
                  className={`w-full py-3 px-4 rounded-2xl text-xs sm:text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ${market.buttonBg}`}
                >
                  <span>Shop on {market.name}</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">100% Genuine Stock</p>
              <p className="text-xs text-stone-500">Verified official brand presence</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">Pan-India Delivery</p>
              <p className="text-xs text-stone-500">Express doorstep shipping</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900 uppercase tracking-wider">Hassle-Free Returns</p>
              <p className="text-xs text-stone-500">Protected by platform guarantees</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplaces;
