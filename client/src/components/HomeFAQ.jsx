import React from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  Sparkles,
  Clock,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeFAQ = () => {
  return (
    <section className="py-20 sm:py-24 bg-[#F7F5EE] relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#2D7D52]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#4EA874]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xs"
          >
            <HelpCircle size={14} className="text-[#2D7D52]" />
            <span>Clarity & Formulation</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight"
          >
            Got Questions? <br />
            <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#1B4D31] via-[#2D7D52] to-[#4EA874]">
              We’ve Got Clear Answers.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-base sm:text-lg text-[#4A6352] font-sans max-w-2xl mx-auto"
          >
            Everything you need to know about our ammonia-free formulation, shade selection, rapid 10-minute application, and lasting results.
          </motion.p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Will it look natural? (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 bg-white rounded-[28px] p-7 sm:p-9 border border-[#1B4D31]/10 shadow-[0_10px_35px_rgba(27,77,49,0.05)] hover:shadow-[0_18px_45px_rgba(27,77,49,0.1)] hover:border-[#2D7D52]/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center">
                  <Sparkles size={22} />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#F7F5EE] text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-wider border border-[#1B4D31]/10">
                  Undetectable Finish
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143D28] mb-3 leading-snug">
                Will the beard colour look completely natural?
              </h3>

              <p className="font-sans text-sm sm:text-base text-[#4A6352] leading-relaxed">
                Yes, absolutely. Unlike harsh generic dyes that produce an artificial, dense shoe-polish
                tint, DailyFix is calibrated specifically for Indian and South Asian beard hair textures.
                Its botanical micro-pigments bind selectively to gray and white hair, blending seamlessly
                with your facial hair tone under bright daylight.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-[#1B4D31]/8">
              <div className="flex items-center gap-2 text-xs font-bold text-[#143D28]">
                <CheckCircle2 size={16} className="text-[#2D7D52] flex-shrink-0" />
                <span>Zero shoe-polish sheen</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#143D28]">
                <CheckCircle2 size={16} className="text-[#2D7D52] flex-shrink-0" />
                <span>True daylight match</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#143D28]">
                <CheckCircle2 size={16} className="text-[#2D7D52] flex-shrink-0" />
                <span>Soft conditioned touch</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Easy to apply at home? (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 bg-white rounded-[28px] p-7 sm:p-9 border border-[#1B4D31]/10 shadow-[0_10px_35px_rgba(27,77,49,0.05)] hover:shadow-[0_18px_45px_rgba(27,77,49,0.1)] hover:border-[#2D7D52]/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center">
                  <Clock size={22} />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#F7F5EE] text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-wider border border-[#1B4D31]/10">
                  10-Min Application
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143D28] mb-3 leading-snug">
                Is it simple to apply at home?
              </h3>

              <p className="font-sans text-sm sm:text-base text-[#4A6352] leading-relaxed">
                Extremely simple. Every pack includes developer, colorant, and our precision applicator
                brush. No messy bowls or professional salon trips needed.
              </p>
            </div>

            {/* 3 Step Visual Routine */}
            <div className="space-y-2.5 pt-5 mt-5 border-t border-[#1B4D31]/8">
              <div className="flex items-center gap-3 bg-[#F7F5EE]/80 p-2.5 rounded-xl border border-[#1B4D31]/8">
                <span className="w-6 h-6 rounded-full bg-[#143D28] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <span className="text-xs font-semibold text-[#143D28]">Dispense 1:1 ratio into tray</span>
              </div>
              <div className="flex items-center gap-3 bg-[#F7F5EE]/80 p-2.5 rounded-xl border border-[#1B4D31]/8">
                <span className="w-6 h-6 rounded-full bg-[#2D7D52] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <span className="text-xs font-semibold text-[#143D28]">Brush evenly & wait 10 mins</span>
              </div>
              <div className="flex items-center gap-3 bg-[#F7F5EE]/80 p-2.5 rounded-xl border border-[#1B4D31]/8">
                <span className="w-6 h-6 rounded-full bg-[#4EA874] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <span className="text-xs font-semibold text-[#143D28]">Rinse thoroughly with water</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Safe for sensitive skin & Zero Stains? (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 bg-white rounded-[28px] p-7 sm:p-9 border border-[#1B4D31]/10 shadow-[0_10px_35px_rgba(27,77,49,0.05)] hover:shadow-[0_18px_45px_rgba(27,77,49,0.1)] hover:border-[#2D7D52]/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#F7F5EE] text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-wider border border-[#1B4D31]/10">
                  Skin Safety
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143D28] mb-3 leading-snug">
                Does it burn or leave skin stains?
              </h3>

              <p className="font-sans text-sm sm:text-base text-[#4A6352] leading-relaxed">
                Zero ammonia means zero stinging, burning, or eye-watering chemical fumes. Our formula
                is infused with olive oil and taurine to condition skin. The non-drip cream adheres
                to beard keratin and wipes cleanly off skin with mild soap.
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#1B4D31]/8 flex items-center gap-2 text-xs font-bold text-[#143D28]">
              <Leaf size={16} className="text-[#2D7D52]" />
              <span>Dermatologically tested for regular facial use</span>
            </div>
          </motion.div>

          {/* Card 4: Longevity & Face Wash Proof? (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 bg-white rounded-[28px] p-7 sm:p-9 border border-[#1B4D31]/10 shadow-[0_10px_35px_rgba(27,77,49,0.05)] hover:shadow-[0_18px_45px_rgba(27,77,49,0.1)] hover:border-[#2D7D52]/30 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center">
                  <RefreshCw size={22} />
                </div>
                <span className="px-3.5 py-1 rounded-full bg-[#F7F5EE] text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-wider border border-[#1B4D31]/10">
                  Keratin-Lock Formula
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143D28] mb-3 leading-snug">
                Will the colour fade after daily washing & showering?
              </h3>

              <p className="font-sans text-sm sm:text-base text-[#4A6352] leading-relaxed">
                No. DailyFix locks directly onto the beard's keratin fibers. Daily face washes, warm showers,
                and beard oils won't wash away the colour. It remains rich for 4+ weeks, requiring touch-ups
                only as new gray roots naturally sprout.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-[#1B4D31]/8">
              <div className="bg-[#F7F5EE]/80 p-3.5 rounded-2xl border border-[#1B4D31]/8">
                <p className="font-serif text-2xl font-bold text-[#143D28]">4+ Weeks</p>
                <p className="font-sans text-xs text-[#4A6352] mt-0.5 font-medium">
                  Long-lasting keratin bond
                </p>
              </div>
              <div className="bg-[#F7F5EE]/80 p-3.5 rounded-2xl border border-[#1B4D31]/8">
                <p className="font-serif text-2xl font-bold text-[#143D28]">100% Proof</p>
                <p className="font-sans text-xs text-[#4A6352] mt-0.5 font-medium">
                  Face-wash & shower resistant
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Full Width Concierge & Support Bento Card (Span 12) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-12 bg-white rounded-[28px] p-6 sm:p-8 border border-[#1B4D31]/12 shadow-[0_12px_36px_rgba(27,77,49,0.06)] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#EAF5EE] border border-[#2D7D52]/20 flex items-center justify-center text-[#2D7D52] flex-shrink-0">
                <MessageCircle size={28} />
              </div>
              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#143D28]">
                  Still unsure which shade matches your beard?
                </h4>
                <p className="font-sans text-xs sm:text-sm text-[#4A6352] mt-1 max-w-xl">
                  Our grooming advisors are ready to assist you free. Choose between 01 Natural Black,
                  02 Dark Brown, or 03 Brown Black with expert advice.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
              <Link
                to="/contact"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#2D7D52] to-[#1B4D31] hover:brightness-110 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Ask Our Specialists</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
