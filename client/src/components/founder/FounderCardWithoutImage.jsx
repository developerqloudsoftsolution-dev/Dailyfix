import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, ArrowUpRight, Sparkles, Feather, ShieldCheck, Award } from 'lucide-react';

const LINKEDIN_URL = 'https://in.linkedin.com/in/rohit-jaiswal-694843430';
const INSTAGRAM_URL = 'https://www.instagram.com/_._rohitjaiswal_._?stkn=MTM3cXo1cTM5NjdrZA%3D%3D';

/**
 * OPTION 3: THE EXECUTIVE KEYNOTE (LIGHT THEME — WITHOUT IMAGE)
 * Mirrored executive split-screen presentation in warm white & cream,
 * featuring an architectural platinum/champagne monogram plaque,
 * exact story copy, and high-contrast precision metrics.
 */
export default function FounderCardWithoutImage({
  kicker = 'The Face Behind Dailyfix',
  name = 'Rohit Jaiswal',
  role = 'Founder',
  company = 'Dailyfix',
  p1 = 'Rohit didn\'t start Dailyfix because it was easy — he started it because he saw a gap nobody was addressing seriously. Most beard colours on the market were harsh, ammonia-loaded, and built for quick fixes rather than real confidence. He believed men deserved better: a product that worked with their grooming, not against their skin.',
  p2 = 'That belief turned into months of research, testing, and refining — not stopping until the formula was right. Natural-looking colour. Zero ammonia. Zero compromise.',
  p3 = 'Today, Dailyfix stands as proof that solving a problem properly, with patience and precision, builds something people can actually trust. For Rohit, this isn\'t just a product — it\'s a standard he refused to lower.',
  linkedinUrl = LINKEDIN_URL,
  instagramUrl = INSTAGRAM_URL,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      className="relative pt-12 sm:pt-16 lg:pt-20"
    >
      {/* Outer Executive Keynote Slab (Light Theme) */}
      <div className="relative rounded-[32px] sm:rounded-[44px] bg-white border border-[#143D28]/12 shadow-[0_20px_70px_rgba(20,61,40,0.07)] hover:shadow-[0_28px_90px_rgba(20,61,40,0.12)] p-6 sm:p-10 lg:p-14 transition-all duration-500">
        
        {/* Ambient Keynote Soft Light */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-1/4 translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-b from-[#2D7D52]/8 via-[#4EA874]/4 to-transparent rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* ========================================================
              LEFT COLUMN: EXECUTIVE KEYNOTE NARRATIVE (order-2 on mobile)
          ========================================================= */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 order-2 lg:order-1 text-[#143D28]">
            
            {/* Minimalist Sub-Header */}
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/25 text-[#1B4D31] text-xs font-mono uppercase tracking-widest font-bold">
                {kicker}
              </span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#2D7D52]/20 to-transparent" />
            </div>

            {/* Typography Hierarchy */}
            <div className="space-y-1.5">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
                {name}
              </h2>
              <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-[#2D7D52]">
                {role} • {company}
              </p>
            </div>

            {/* Paragraph 1 */}
            <p className="font-sans text-sm sm:text-base text-[#415949] leading-relaxed">
              {p1}
            </p>

            {/* Paragraph 2 */}
            <p className="font-sans text-sm sm:text-base text-[#415949] leading-relaxed">
              {p2}
            </p>

            {/* Keynote Pull-Quote Chamber */}
            <div className="relative rounded-2xl bg-[#F7F4EB] p-5 sm:p-6 border-l-4 border-[#2D7D52] shadow-2xs">
              <p className="font-serif italic text-base sm:text-lg text-[#143D28] leading-relaxed">
                "{p3}"
              </p>
            </div>

            {/* Apple-Style 3-Metric Strip (Light Theme) */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="rounded-2xl bg-[#F7F5EE] p-3.5 sm:p-4 border border-[#143D28]/10 text-center">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#143D28]">
                  0<span className="text-sm font-sans text-[#2D7D52]">%</span>
                </p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#4A6352] mt-1 font-semibold">
                  Ammonia
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F5EE] p-3.5 sm:p-4 border border-[#143D28]/10 text-center">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#143D28]">
                  10<span className="text-sm font-sans text-[#2D7D52]">m</span>
                </p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#4A6352] mt-1 font-semibold">
                  Activation
                </p>
              </div>

              <div className="rounded-2xl bg-[#F7F5EE] p-3.5 sm:p-4 border border-[#143D28]/10 text-center">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#143D28]">
                  100<span className="text-sm font-sans text-[#2D7D52]">%</span>
                </p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-[#4A6352] mt-1 font-semibold">
                  Natural Blend
                </p>
              </div>
            </div>

            {/* Action Row: Authentic Brand Social Executive Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Connect with ${name} on LinkedIn (opens in a new tab)`}
                className="inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white font-sans text-xs sm:text-sm font-bold shadow-[0_6px_20px_rgba(10,102,194,0.3)] hover:shadow-[0_10px_28px_rgba(10,102,194,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ease-out group/linkedin focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover/linkedin:scale-110 transition-transform duration-300">
                  <Linkedin size={14} className="fill-white" />
                </div>
                <span>Connect on LinkedIn</span>
                <ArrowUpRight
                  size={16}
                  className="text-white/80 group-hover/linkedin:translate-x-1 group-hover/linkedin:-translate-y-1 transition-transform duration-300"
                />
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow ${name} on Instagram (opens in a new tab)`}
                className="inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:from-[#6B2896] hover:via-[#D61515] hover:to-[#E56525] text-white font-sans text-xs sm:text-sm font-bold shadow-[0_6px_20px_rgba(253,29,29,0.3)] hover:shadow-[0_10px_28px_rgba(253,29,29,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 ease-out group/insta focus:outline-none focus:ring-2 focus:ring-[#FD1D1D] focus:ring-offset-2"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover/insta:scale-110 transition-transform duration-300">
                  <Instagram size={14} />
                </div>
                <span>Follow on Instagram</span>
                <ArrowUpRight
                  size={16}
                  className="text-white/80 group-hover/insta:translate-x-1 group-hover/insta:-translate-y-1 transition-transform duration-300"
                />
              </a>

              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/20 text-xs font-mono text-[#1B4D31] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2D7D52] animate-pulse" />
                <span>Verified Formula Standard</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: ARCHITECTURAL PLATINUM/CHAMPAGNE PLAQUE
          ========================================================= */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] -mt-20 sm:-mt-28 lg:-mt-36">
              
              {/* Backing Diffused Soft Emerald Glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#2D7D52]/20 via-[#4EA874]/15 to-transparent rounded-[36px] blur-2xl transform translate-y-4 pointer-events-none"
              />

              {/* Master Monolith Plaque (Light Theme) */}
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-b from-white via-[#F7F5EE] to-[#ECE7DC] p-8 sm:p-10 shadow-[0_25px_60px_rgba(20,61,40,0.15)] border-2 border-white flex flex-col items-center justify-center text-center aspect-[3/4] group">
                
                {/* Architectural blueprint/grid subtle background */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-15 bg-[radial-gradient(#143D28_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
                />

                {/* Central Illuminated Medallion */}
                <div className="relative mb-6">
                  {/* Concentric Precision Ring */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#2D7D52]/30 flex items-center justify-center relative">
                    <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full border border-dashed border-[#2D7D52]/40 flex items-center justify-center">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#1B4D31] via-[#2D7D52] to-[#4EA874] flex items-center justify-center shadow-xl border-2 border-white group-hover:scale-105 transition-transform duration-500">
                        <span className="font-serif text-3xl sm:text-4xl font-black text-white tracking-wider">
                          RJ
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Micro Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-[#143D28] text-white p-2 rounded-full shadow-md border-2 border-white">
                    <Feather size={14} />
                  </div>
                </div>

                {/* Typography inside Plaque */}
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#143D28] tracking-tight">
                  Rohit Jaiswal
                </h3>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#2D7D52] mt-1">
                  Founder • Dailyfix
                </p>

                {/* Spec details strip */}
                <div className="mt-6 pt-5 border-t border-[#143D28]/10 w-full flex items-center justify-around text-[11px] text-[#4A6352] font-mono uppercase tracking-wider font-semibold">
                  <span>Bengaluru, IN</span>
                  <span>•</span>
                  <span>Est. 2026</span>
                  <span>•</span>
                  <span>Zero Compromise</span>
                </div>
              </div>

              {/* Floating Keynote Precision Badge */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="absolute -bottom-5 -left-2 sm:-bottom-6 sm:-left-4 backdrop-blur-xl bg-white/95 p-3.5 sm:p-4 rounded-2xl shadow-xl border border-[#143D28]/15 max-w-[210px] z-20 transition-all duration-300"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={15} />
                  </div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#143D28]">
                    Zero Compromise
                  </p>
                </div>
                <p className="text-[11px] text-[#4A6352] mt-1.5 leading-snug">
                  A standard he refused to lower.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

