import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, ArrowUpRight, Sparkles, ShieldCheck, Award } from 'lucide-react';
import founderImg from '../../assets/images/rohit-jaiswal.jpg';

const LINKEDIN_URL = 'https://in.linkedin.com/in/rohit-jaiswal-694843430';

/**
 * OPTION 3: THE EXECUTIVE KEYNOTE (LIGHT THEME — WITH IMAGE)
 * Apple-style executive split-screen presentation in warm white & cream,
 * featuring an overflowing architectural portrait silhouette, crisp typography,
 * and high-contrast precision metrics.
 */
export default function FounderCardWithImage({
  kicker = 'The Face Behind Dailyfix',
  name = 'Rohit Jaiswal',
  role = 'Founder',
  company = 'Dailyfix',
  p1 = 'Rohit didn\'t start Dailyfix because it was easy — he started it because he saw a gap nobody was addressing seriously. Most beard colours on the market were harsh, ammonia-loaded, and built for quick fixes rather than real confidence. He believed men deserved better: a product that worked with their grooming, not against their skin.',
  p2 = 'That belief turned into months of research, testing, and refining — not stopping until the formula was right. Natural-looking colour. Zero ammonia. Zero compromise.',
  p3 = 'Today, Dailyfix stands as proof that solving a problem properly, with patience and precision, builds something people can actually trust. For Rohit, this isn\'t just a product — it\'s a standard he refused to lower.',
  linkedinUrl = LINKEDIN_URL,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative pt-12 sm:pt-16 lg:pt-20"
    >
      {/* Outer Executive Keynote Slab (Light Theme) */}
      <div className="relative rounded-[32px] sm:rounded-[44px] bg-white border border-[#143D28]/12 shadow-[0_20px_70px_rgba(20,61,40,0.07)] hover:shadow-[0_28px_90px_rgba(20,61,40,0.12)] p-6 sm:p-10 lg:p-14 transition-all duration-500">
        
        {/* Ambient Keynote Soft Light */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-b from-[#2D7D52]/8 via-[#4EA874]/4 to-transparent rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* ========================================================
              LEFT COLUMN: OVERFLOWING FOUNDER PORTRAIT
          ========================================================= */}
          <div className="lg:col-span-5 flex justify-center order-1">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] -mt-20 sm:-mt-28 lg:-mt-36">
              
              {/* Diffused Aura Behind Head */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#2D7D52]/20 via-[#4EA874]/15 to-transparent rounded-[36px] blur-2xl transform translate-y-4 pointer-events-none"
              />

              {/* Portrait Frame with Apple Keynote Precision */}
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-white p-2 shadow-[0_25px_60px_rgba(20,61,40,0.18)] border-2 border-white group">
                <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden aspect-[3/4] bg-[#0A1A11]">
                  <img
                    src={founderImg}
                    alt={`${name} — ${role} of ${company}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top filter contrast-[1.03] group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient mask at base */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Top Keynote Live Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 backdrop-blur-md bg-black/55 border border-white/20 px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider text-emerald-300 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Leadership</span>
                    </div>

                    <div className="w-8 h-8 rounded-full backdrop-blur-md bg-white/20 border border-white/30 flex items-center justify-center text-white">
                      <Award size={15} />
                    </div>
                  </div>

                  {/* Bottom Founder Identity */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                      {name}
                    </p>
                    <p className="text-xs font-mono uppercase tracking-widest text-emerald-300 mt-0.5">
                      {role} • {company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Keynote Precision Badge */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="absolute -bottom-5 -right-2 sm:-bottom-6 sm:-right-4 backdrop-blur-xl bg-white/95 p-3.5 sm:p-4 rounded-2xl shadow-xl border border-[#143D28]/15 max-w-[210px] z-20 transition-all duration-300"
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
                  Calibrated for natural blend & skin safety.
                </p>
              </motion.div>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: EXECUTIVE KEYNOTE NARRATIVE (LIGHT THEME)
          ========================================================= */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 order-2 text-[#143D28]">
            
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

            {/* Action Row: Apple-Style Executive LinkedIn Pill */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Connect with ${name} on LinkedIn (opens in a new tab)`}
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#143D28] hover:bg-[#1E5437] text-white font-sans text-xs sm:text-sm font-bold shadow-lg shadow-[#143D28]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out group/btn focus:outline-none focus:ring-2 focus:ring-[#143D28]"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Linkedin size={14} />
                </div>
                <span>Connect with Rohit on LinkedIn</span>
                <ArrowUpRight
                  size={16}
                  className="text-white/80 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300"
                />
              </a>

              <div className="flex items-center gap-2 text-xs font-mono text-[#4A6352] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#2D7D52] animate-pulse" />
                <span>Verified Executive Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
