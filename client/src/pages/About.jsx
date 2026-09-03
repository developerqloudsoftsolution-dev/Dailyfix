import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  ShieldCheck,
  Star,
  CheckCircle2,
  Award,
  Heart,
  TrendingUp,
  Users,
  Sparkles,
  Clock,
  Droplets,
  ArrowRight,
  ArrowUpRight,
  Check
} from 'lucide-react';

import poster from '../assets/images/poster.png';
import threeProducts from '../assets/images/three.png';
import productOnly from '../assets/images/Dailyfix Beard Colour Product Only.png';
import shadeBlackImg from '../assets/images/001 Natural black1.png';
import shadeDarkBrownImg from '../assets/images/003 Drak brown3.png';
import shadeBrownBlackImg from '../assets/images/002 Brown black2.png';

const About = () => {
  useEffect(() => {
    document.title = 'About DailyFix | Botanical Men’s Grooming & Ammonia-Free Beard Colour';
  }, []);

  const stats = [
    { number: '3', suffix: 'Calibrated Shades', label: 'Engineered specifically for Indian beard hair textures' },
    { number: '100%', suffix: 'Ammonia-Free', label: 'Gentle on sensitive facial skin with zero harsh odors' },
    { number: '12.8K+', suffix: 'Gentlemen Served', label: 'Trusted across India for undetectable gray coverage' }
  ];

  const pillars = [
    {
      title: 'Botanical Defense & Nourishment',
      badge: 'Formula Safety',
      desc: 'Infused with natural olive oil and taurine to condition facial hair while preventing dryness, itching, and redness.',
      icon: Leaf,
      span: 'lg:col-span-7'
    },
    {
      title: '10-Minute Rapid Gray Fusion',
      badge: 'Fast Routine',
      desc: 'Formulated for busy professionals. A simple 1:1 cream mix delivers salon-grade gray coverage in just 10 minutes flat.',
      icon: Clock,
      span: 'lg:col-span-5'
    },
    {
      title: 'Zero Skin-Stain Barrier',
      badge: 'Clean Lines',
      desc: 'Non-drip consistency adheres strictly to facial hair keratin fibers without staining cheeks, jawlines, or hands.',
      icon: Droplets,
      span: 'lg:col-span-5'
    },
    {
      title: 'Undetectable Natural Finish',
      badge: 'True Tone',
      desc: 'Eliminates the artificial, bluish-purple shoe-polish sheen of traditional boxed dyes for a soft, authentic look under sunlight.',
      icon: Sparkles,
      span: 'lg:col-span-7'
    }
  ];

  const values = [
    {
      icon: Award,
      num: '01',
      title: 'Uncompromised Purity',
      desc: 'We formulate strictly without ammonia, parabens, resorcinol, or harsh oxidants. Your skin’s long-term health is never sacrificed for quick results.'
    },
    {
      icon: Heart,
      num: '02',
      title: 'Precision for Men',
      desc: 'Men’s facial hair is thicker and coarser than scalp hair. We calibrate each shade specifically for beard textures to ensure deep, even, and natural pigment fusion.'
    },
    {
      icon: Users,
      num: '03',
      title: 'The Gentleman’s Respect',
      desc: 'From discreet luxury packaging to prompt personal grooming advice, we treat our customers with the utmost sophistication, dignity, and care.'
    }
  ];

  const shadeShowcase = [
    {
      num: '01',
      name: 'Natural Black',
      tag: 'Best Seller',
      desc: 'Deep, authentic charcoal-black coverage without artificial blue tones.',
      colorHex: '#18181B',
      img: shadeBlackImg,
      link: '/product/natural-black'
    },
    {
      num: '02',
      name: 'Dark Brown',
      tag: "Gentleman's Choice",
      desc: 'Rich espresso tone with warm depth, perfect for contemporary styling.',
      colorHex: '#3E2723',
      img: shadeDarkBrownImg,
      link: '/product/dark-brown'
    },
    {
      num: '03',
      name: 'Brown Black',
      tag: 'Natural Blend',
      desc: 'Subtle transitional shade for naturally textured, multidimensional beards.',
      colorHex: '#271D18',
      img: shadeBrownBlackImg,
      link: '/product/black-brown'
    }
  ];

  return (
    <div className="bg-[#F7F5EE] min-h-screen relative overflow-hidden">
      {/* Decorative ambient subtle green glows matching /sample1 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#2D7D52]/10 via-[#4EA874]/6 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-[#2D7D52]/5 rounded-full blur-3xl pointer-events-none" />

      {/* ========================================================
          HERO SECTION: EDITORIAL BANNER
      ========================================================= */}
      <section className="relative pt-40 pb-20 sm:pt-48 lg:pt-52 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest shadow-xs"
          >
            <Sparkles size={14} className="text-[#2D7D52]" />
            <span>Our Heritage & Purpose</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#143D28] tracking-tight leading-tight"
          >
            Pure Grooming, <br />
            <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#1B4D31] via-[#2D7D52] to-[#4EA874]">
              Naturally Defined.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-sans text-base sm:text-lg lg:text-xl text-[#4A6352] leading-relaxed max-w-2xl mx-auto"
          >
            DailyFix was created with a singular focus: to redefine modern men’s grooming with botanical formulas that deliver undetectable gray coverage in 10 minutes without burning or staining skin.
          </motion.p>
        </div>
      </section>

      {/* ========================================================
          OUR STORY SECTION: CRAFT & PURPOSE
      ========================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Poster Presentation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative group w-full max-w-[340px] sm:max-w-[400px]">
              <div className="absolute inset-0 bg-[#2D7D52]/15 rounded-[24px] blur-2xl transform translate-x-2 translate-y-2 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />
              <div className="relative w-full rounded-[20px] shadow-[0_20px_50px_rgba(27,77,49,0.12)] border border-[#1B4D31]/20 overflow-hidden bg-black">
                <img
                  src={poster}
                  alt="DailyFix Craft Poster"
                  loading="lazy"
                  className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 right-2 sm:-bottom-5 sm:right-[-10px] bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-[16px] shadow-xl border border-[#1B4D31]/12 max-w-[180px] sm:max-w-[210px] z-20">
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#2D7D52]">100%</p>
                <p className="font-sans text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-[#143D28] mt-0.5">
                  Ammonia-Free
                </p>
                <p className="font-sans text-[10px] sm:text-[11px] text-[#4A6352] mt-0.5 leading-snug">
                  Gentle olive extract formula with zero harsh odors.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6 mt-6 lg:mt-0"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest shadow-xs">
              <Leaf size={14} className="text-[#2D7D52]" />
              <span>The Genesis</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
              Born to Replace Harsh Boxed Dyes
            </h2>

            <div className="space-y-4 font-sans text-sm sm:text-base text-[#4A6352] leading-relaxed">
              <p>
                For decades, Indian men looking to maintain their beard encountered an unacceptable trade-off: harsh boxed hair dyes full of ammonia and abrasive oxidants. These products left a stiff, artificial purple sheen on hair, caused burning sensations on delicate facial skin, and stained cheeks with messy patches.
              </p>
              <p>
                DailyFix was founded to solve this problem from the ground up. We dedicated our research to formulating a beard colour specifically calibrated for coarser facial hair textures, powered by natural botanical extracts that nourish skin and hair fibers simultaneously.
              </p>
              <p>
                The result is a clean, 10-minute ritual that looks 100% natural in daylight, feels completely undetectable to the touch, and gives gentlemen the confidence of looking sharp every single day.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#1B4D31]/10">
              {stats.map((s, idx) => (
                <div key={idx} className="bg-white p-4 sm:p-5 rounded-2xl border border-[#1B4D31]/10 shadow-xs">
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-[#143D28]">
                    {s.number}
                  </p>
                  <p className="font-sans text-xs font-bold text-[#2D7D52] uppercase tracking-wider mt-0.5">
                    {s.suffix}
                  </p>
                  <p className="font-sans text-[11px] text-[#637D6C] mt-1 leading-snug">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          BENTO GRID: FORMULATION HIGHLIGHTS & SCIENCE
      ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xs">
            <Award size={14} className="text-[#2D7D52]" />
            <span>Formulation Highlights</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
            Engineered for Precision, <br />
            <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#1B4D31] via-[#2D7D52] to-[#4EA874]">
              Kind to Your Skin.
            </span>
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#4A6352] mt-3 max-w-xl mx-auto">
            Every ingredient in DailyFix serves a functional purpose: achieving optimal color depth while preserving your natural skin barrier.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`${pillar.span} bg-white rounded-[28px] p-7 sm:p-9 border border-[#1B4D31]/10 shadow-[0_10px_35px_rgba(27,77,49,0.05)] hover:shadow-[0_18px_45px_rgba(27,77,49,0.1)] hover:border-[#2D7D52]/30 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-[#F7F5EE] text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-wider border border-[#1B4D31]/10">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143D28] mb-3 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-[#4A6352] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-[#1B4D31]/8 flex items-center gap-2 text-xs font-bold text-[#143D28]">
                  <CheckCircle2 size={16} className="text-[#2D7D52]" />
                  <span>Dermatologically tested for regular facial grooming</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          VALUES SECTION: WHAT WE STAND FOR
      ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto relative z-10 border-t border-[#1B4D31]/10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xs">
            <Heart size={14} className="text-[#2D7D52]" />
            <span>Our Core Values</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight">
            What We Stand For
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#4A6352] mt-3 max-w-xl mx-auto">
            Three non-negotiable principles that guide every batch, bottle, and customer interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white rounded-[28px] p-7 sm:p-9 border border-[#1B4D31]/10 shadow-[0_10px_35px_rgba(27,77,49,0.05)] hover:shadow-[0_18px_45px_rgba(27,77,49,0.1)] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center">
                      <Icon size={22} />
                    </div>
                    <span className="font-serif text-2xl font-bold text-[#143D28]/30">
                      {v.num}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#143D28] mb-3">
                    {v.title}
                  </h3>

                  <p className="font-sans text-sm sm:text-base text-[#4A6352] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          SHADE TRIO SHOWCASE
      ========================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto relative z-10 border-t border-[#1B4D31]/10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles size={14} className="text-[#2D7D52]" />
            <span>The Trio Collection</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight">
            Discover Your Signature Match
          </h2>

          <p className="font-sans text-sm sm:text-base text-[#4A6352] mt-3 max-w-xl mx-auto">
            3 expertly calibrated shades designed for seamless blending with Indian beard tones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {shadeShowcase.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-[28px] p-6 sm:p-7 border border-[#1B4D31]/12 shadow-[0_12px_36px_rgba(27,77,49,0.06)] hover:shadow-[0_20px_50px_rgba(27,77,49,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#EAF5EE] text-[#1B4D31] text-[11px] font-extrabold uppercase tracking-wider">
                    {s.tag}
                  </span>
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                    style={{ backgroundColor: s.colorHex }}
                    title={s.name}
                  />
                </div>

                <div className="h-56 rounded-2xl bg-[#F7F5EE]/80 flex items-center justify-center p-4 overflow-hidden mb-5">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-serif text-xl font-bold text-[#143D28] mb-1.5">
                  {s.num} • {s.name}
                </h3>

                <p className="font-sans text-xs sm:text-sm text-[#4A6352] leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-[#1B4D31]/8">
                <Link
                  to={s.link}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#EAF5EE] hover:bg-[#2D7D52] text-[#143D28] hover:text-white font-bold text-xs sm:text-sm transition-all duration-250"
                >
                  <span>Explore Shade</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================
          CLOSING BANNER: ELEVATED LUXURY CARD
      ========================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-8 sm:p-14 lg:p-16 text-center relative overflow-hidden shadow-[0_18px_50px_rgba(27,77,49,0.06)] border border-[#1B4D31]/12">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest shadow-xs">
              <Sparkles size={14} className="text-[#2D7D52]" />
              <span>Ready for Undetectable Coverage?</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
              Experience the DailyFix Difference
            </h2>

            <p className="font-sans text-xs sm:text-base text-[#4A6352] leading-relaxed max-w-xl mx-auto">
              Join thousands of Indian gentlemen who have upgraded their grooming ritual with our 100% ammonia-free beard colour.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full">
              <Link
                to="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#2D7D52] to-[#1B4D31] hover:brightness-110 text-white font-bold text-sm shadow-md hover:scale-105 transition-all"
              >
                <span>Shop All Shades</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white hover:bg-[#EAF5EE] text-[#143D28] hover:text-[#2D7D52] font-bold text-sm border border-[#1B4D31]/20 transition-all"
              >
                <span>Contact Grooming Advisors</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
