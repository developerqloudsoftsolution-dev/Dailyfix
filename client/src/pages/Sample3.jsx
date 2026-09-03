import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Droplets,
  ArrowRight,
  Check,
  Star,
  ShoppingBag,
  CheckCircle2,
  RefreshCw,
  Truck,
  Award,
  Zap
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Assets
import heroProductImg from '../assets/images/Dailyfix Beard Colour Product Only.png';
import shadeBlackImg from '../assets/images/001 Natural black1.png';
import shadeDarkBrownImg from '../assets/images/003 Drak brown3.png';
import shadeBrownBlackImg from '../assets/images/002 Brown black2.png';
import brandFavicon from '../assets/images/favicon logo.jpeg';

import styles from './Sample3.module.css';

const SHADES = [
  {
    id: 'natural-black',
    number: '01',
    name: 'Natural Black',
    badge: 'Best Seller',
    tagline: 'Deep, authentic black coverage with zero artificial bluish undertones.',
    price: 399,
    rating: 4.9,
    reviews: '1,420+',
    colorHex: '#18181B',
    img: shadeBlackImg
  },
  {
    id: 'dark-brown',
    number: '02',
    name: 'Dark Brown',
    badge: "Gentleman's Choice",
    tagline: 'Rich espresso tone with warm depth designed for versatile executive styling.',
    price: 399,
    rating: 4.9,
    reviews: '890+',
    colorHex: '#3E2723',
    img: shadeDarkBrownImg
  },
  {
    id: 'brown-black',
    number: '03',
    name: 'Brown Black',
    badge: 'Natural Blend',
    tagline: 'Balanced transition shade for an authentically textured, feathered beard look.',
    price: 399,
    rating: 4.8,
    reviews: '560+',
    colorHex: '#271D18',
    img: shadeBrownBlackImg
  }
];

const TICKER_ITEMS = [
  '10-MINUTE RAPID ACTION',
  '100% AMMONIA-FREE FORMULA',
  'ENRICHED WITH ARGAN & OLIVE OIL',
  'ZERO SKIN-STAINING BARRIER',
  'DERMATOLOGICALLY TESTED',
  'PAN-INDIA DOORSTEP EXPRESS DELIVERY',
  'NATURAL DAYLIGHT BLENDING'
];

const Sample3 = () => {
  const [activeShadeIndex, setActiveShadeIndex] = useState(0);
  const [cartCount, setCartCount] = useState(1);

  useEffect(() => {
    document.title = 'DailyFix Sample 3 | Editorial Maximalism Edition';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCart = (shadeName) => {
    setCartCount((prev) => prev + 1);
    toast.success(`${shadeName} added to maximalist demo bag!`, {
      style: {
        background: '#0D0D10',
        color: '#FFFFFF',
        borderRadius: '16px',
        fontSize: '15px',
        fontWeight: '800',
        padding: '14px 22px',
        border: '2px solid #D8A257',
        boxShadow: '6px 6px 0px #D8A257'
      },
      iconTheme: {
        primary: '#D8A257',
        secondary: '#0D0D10'
      }
    });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeShade = SHADES[activeShadeIndex];

  return (
    <div className={styles.demoWrapper}>
      <Toaster position="bottom-right" />

      {/* Ambient background glow */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />

      {/* ========================================================
          DEDICATED MAXIMALIST STICKY HEADER
      ========================================================= */}
      <header className={styles.headerSticky}>
        <div className={styles.headerInner}>
          <div className={styles.brandLogoWrap} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={brandFavicon} alt="DailyFix" className={styles.brandLogoImg} />
            <div className={styles.brandDivider} />
            <div className={styles.brandTaglineCol}>
              <span className={styles.brandSubtag}>DailyFix</span>
              <span className={styles.brandTaglineSmall}>Maximalist Edition</span>
            </div>
          </div>

          <nav className={styles.navLinks} aria-label="Demo Navigation">
            <button onClick={() => scrollToSection('hero-section')} className={styles.navLinkItem}>
              01 // HERO
            </button>
            <button onClick={() => scrollToSection('bento-features')} className={styles.navLinkItem}>
              02 // METRICS
            </button>
            <button onClick={() => scrollToSection('product-collection')} className={styles.navLinkItem}>
              03 // POSTERS
            </button>
            <span className={styles.pillTagMax}>
              <span className={styles.pulseDotGold} />
              Sample 3
            </span>
          </nav>

          <div className={styles.headerActions}>
            <div
              className={styles.demoCartPill}
              onClick={() => handleAddToCart(activeShade.name)}
              title="Click to simulate item addition"
            >
              <ShoppingBag size={18} className="text-[#D8A257]" />
              <span>BAG</span>
              <span className={styles.cartCountDot}>{cartCount}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          SECTION 1: THE GIANT VIEWPORT HERO
      ========================================================= */}
      <section id="hero-section" className={styles.heroSection}>
        <div className={styles.heroMaxWidth}>
          {/* Top Pill & Announcement Row */}
          <div className={styles.heroTagRow}>
            <div className={styles.heroBigPill}>
              <Sparkles size={16} className="text-[#D8A257]" />
              <span>Maximalist Big Typography Edition • 100% Ammonia-Free</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#8C5922]">
              <span>Salon Grade Formula</span>
              <span>•</span>
              <span>Dermatologist Approved</span>
            </div>
          </div>

          {/* GIANT HEADLINE */}
          <h1 className={styles.giantHeroHeading}>
            PURE. RAW. <br />
            <span className={styles.giantHeadingSpanGold}>Defined.</span>
          </h1>

          {/* Split Content Grid */}
          <div className={styles.heroSplitGrid}>
            {/* Left: Statement, Metrics & Big Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={styles.heroLeftCol}
            >
              <p className={styles.heroLeadStatement}>
                The fastest, cleanest botanical beard colour engineered for the modern man. 10 minutes from tired grays to commanding, natural presence.
              </p>

              {/* 3 Chunky Metric Mini Cards */}
              <div className={styles.heroThreeCardsRow}>
                <div className={styles.heroStatMiniCard}>
                  <div className={styles.heroMiniStatNum}>10 MIN</div>
                  <div className={styles.heroMiniStatLabel}>Rapid Action</div>
                </div>

                <div className={styles.heroStatMiniCard}>
                  <div className={styles.heroMiniStatNum}>0%</div>
                  <div className={styles.heroMiniStatLabel}>Zero Ammonia</div>
                </div>

                <div className={styles.heroStatMiniCard}>
                  <div className={styles.heroMiniStatNum}>100%</div>
                  <div className={styles.heroMiniStatLabel}>Botanical Oil</div>
                </div>
              </div>

              {/* Huge CTAs */}
              <div className={styles.heroCtaGroup}>
                <button
                  onClick={() => scrollToSection('product-collection')}
                  className={styles.btnMaxPrimary}
                >
                  <span>EXPLORE 3 SHADES</span>
                  <ArrowRight size={22} />
                </button>

                <button
                  onClick={() => scrollToSection('bento-features')}
                  className={styles.btnMaxSecondary}
                >
                  <span>WHY DAILYFIX?</span>
                </button>
              </div>

              {/* Heavy Rating Badge */}
              <div className="flex items-center gap-4 pt-4 border-t-2 border-[#0D0D10]/20">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} className="fill-[#B88344] text-[#B88344]" />
                  ))}
                </div>
                <div className="font-extrabold text-sm uppercase tracking-wide text-[#0D0D10]">
                  4.9 / 5.0 Rating <span className="text-[#8C5922]">• 2,800+ Verified Gentlemen</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Massive Product Stage Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
              className={styles.heroRightCard}
            >
              <div className={styles.heroGhostWatermark}>DF</div>

              <div className={styles.heroProductStage}>
                <div className={styles.heroStageRing} />
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeShade.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    src={activeShade.img || heroProductImg}
                    alt={activeShade.name}
                    className={styles.heroProductImg}
                  />
                </AnimatePresence>
              </div>

              {/* Interactive Shade Selector */}
              <div className={styles.shadeSelectorBlock}>
                <div className={styles.shadeLabelBig}>
                  <span>SELECT SHADE:</span>
                  <span className={styles.selectedShadeHighlight}>
                    {activeShade.number} // {activeShade.name.toUpperCase()}
                  </span>
                </div>

                <div className={styles.shadePillGroup}>
                  {SHADES.map((shade, idx) => (
                    <button
                      key={shade.id}
                      onClick={() => setActiveShadeIndex(idx)}
                      className={`${styles.shadeOptionBtn} ${
                        activeShadeIndex === idx ? styles.shadeOptionBtnActive : ''
                      }`}
                    >
                      <span
                        className={styles.shadeSwatchCircle}
                        style={{ backgroundColor: shade.colorHex }}
                      />
                      <span className={styles.shadeOptionTitle}>{shade.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FULL-BLEED KINETIC RUNNING MARQUEE TICKER TAPE
      ========================================================= */}
      <div className={styles.marqueeBand} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <span key={idx} className={styles.marqueeItem}>
              <span>{item}</span>
              <span className={styles.marqueeStar}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ========================================================
          SECTION 2: GIANT NUMBERS & IMPACT BENTO
      ========================================================= */}
      <section id="bento-features" className={styles.bentoSection}>
        <h2 className={styles.sectionHeadingHuge}>
          ENGINEERED FOR MEN. <br />
          BACKED BY NUMBERS.
        </h2>

        <div className={styles.bentoContainer}>
          {/* Card 1: 10 MINUTES (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`${styles.bentoCardMax} ${styles.bentoSpan7}`}
          >
            <div>
              <div className={styles.giantNumberDisplay}>
                <span>10</span>
                <span className={styles.giantNumberSubword}>MINUTES</span>
              </div>
              <h3 className={styles.bentoCardTitle}>RAPID GRAY COVERAGE</h3>
              <p className={styles.bentoCardBody}>
                Specialized micro-pigments penetrate dense facial hair follicles in 10 minutes flat. Wash away grays with lasting vibrancy that doesn't fade into brassy tones.
              </p>
            </div>

            <div className={styles.routineStepStrip}>
              <div className={styles.routineStepBox}>
                <span className={styles.stepNumberTag}>STEP 01</span>
                <p className={styles.stepTitleBig}>Mix & Dispense</p>
              </div>
              <div className={styles.routineStepBox}>
                <span className={styles.stepNumberTag}>STEP 02</span>
                <p className={styles.stepTitleBig}>Rest 10 Minutes</p>
              </div>
              <div className={styles.routineStepBox}>
                <span className={styles.stepNumberTag}>STEP 03</span>
                <p className={styles.stepTitleBig}>Rinse & Reveal</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: 0% AMMONIA (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`${styles.bentoCardMax} ${styles.bentoSpan5}`}
          >
            <div>
              <div className={styles.giantNumberDisplay}>
                <span>0%</span>
                <span className={styles.giantNumberSubword}>AMMONIA</span>
              </div>
              <h3 className={styles.bentoCardTitle}>ZERO HARSH CHEMICALS</h3>
              <p className={styles.bentoCardBody}>
                No burning, no stinging, and no unpleasant chemical fumes. Enriched with botanical olive oil and taurine for total skin protection.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm font-black uppercase text-[#0D0D10]">
              <CheckCircle2 size={20} className="text-[#8C5922]" />
              <span>Dermatologically tested for regular facial grooming</span>
            </div>
          </motion.div>

          {/* Card 3: 100% SKIN-SAFE (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`${styles.bentoCardMax} ${styles.bentoSpan5}`}
          >
            <div>
              <div className={styles.giantNumberDisplay}>
                <span>100%</span>
                <span className={styles.giantNumberSubword}>CLEAN</span>
              </div>
              <h3 className={styles.bentoCardTitle}>ZERO SKIN-STAIN BARRIER</h3>
              <p className={styles.bentoCardBody}>
                Engineered specifically to bond to keratin beard fibers without staining cheek skin, jawline, or fingers. Washes clean effortlessly.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm font-black uppercase text-[#0D0D10]">
              <CheckCircle2 size={20} className="text-[#8C5922]" />
              <span>Crisp, razor-clean beard and cheek boundaries</span>
            </div>
          </motion.div>

          {/* Card 4: 98% MATCH & 4+ WKS (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`${styles.bentoCardMax} ${styles.bentoSpan7}`}
          >
            <div>
              <div className={styles.giantNumberDisplay}>
                <span>98%</span>
                <span className={styles.giantNumberSubword}>NATURAL MATCH</span>
              </div>
              <h3 className={styles.bentoCardTitle}>CONFIDENCE THAT LASTS WEEKS</h3>
              <p className={styles.bentoCardBody}>
                Formulated to reflect light naturally like authentic beard hair rather than artificial shoe-polish black. Each application stays rich for up to 4+ weeks.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-[#F8F4EC] border-2 border-[#0D0D10] rounded-2xl p-4 text-center">
                <div className="font-['Bebas_Neue'] text-3xl text-[#0D0D10]">4+ WEEKS</div>
                <div className="text-xs font-black uppercase text-[#8C5922]">Color Retention</div>
              </div>
              <div className="bg-[#F8F4EC] border-2 border-[#0D0D10] rounded-2xl p-4 text-center">
                <div className="font-['Bebas_Neue'] text-3xl text-[#0D0D10]">2,800+</div>
                <div className="text-xs font-black uppercase text-[#8C5922]">Gentlemen Served</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: OVERSIZED 3-SHADE POSTER SHOWCASE
      ========================================================= */}
      <section id="product-collection" className={styles.posterSection}>
        <h2 className={styles.sectionHeadingHuge}>
          CHOOSE YOUR <br />
          COMMANDING TONE.
        </h2>

        <div className={styles.posterGrid}>
          {SHADES.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={styles.posterCard}
            >
              {/* Ghost Watermark Number */}
              <div className={styles.posterWatermarkNum}>{product.number}</div>

              <div>
                <div className={styles.posterTopBar}>
                  <span className={styles.posterBadge}>{product.badge}</span>
                  <div
                    className={styles.shadeSwatchCircle}
                    style={{ backgroundColor: product.colorHex, width: 24, height: 24 }}
                    title={product.name}
                  />
                </div>

                <div className={styles.posterImageFrame}>
                  <img
                    src={product.img}
                    alt={product.name}
                    className={styles.posterImg}
                  />
                </div>

                <div className={styles.posterMetaWrap}>
                  <div className="flex items-center gap-1.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={15} className="fill-[#B88344] text-[#B88344]" />
                    ))}
                    <span className="text-xs font-black text-[#0D0D10] ml-1">{product.rating}</span>
                    <span className="text-xs text-[#5C564E] font-bold">({product.reviews})</span>
                  </div>

                  <h3 className={styles.posterTitle}>
                    {product.number} // {product.name.toUpperCase()}
                  </h3>

                  <p className={styles.posterDesc}>{product.tagline}</p>

                  <div className={styles.posterPriceRow}>
                    <span className={styles.posterPriceBig}>₹{product.price}</span>
                    <span className={styles.posterPriceTax}>M.R.P. INCL. OF ALL TAXES</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product.name)}
                className={styles.btnPosterAdd}
              >
                <ShoppingBag size={20} />
                <span>ADD TO BAG — ₹{product.price}</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Giant Trust Strip */}
        <div className={styles.trustStripMax}>
          <div className={styles.trustItemMax}>
            <div className={styles.trustIconBoxMax}>
              <Truck size={28} />
            </div>
            <div>
              <p className={styles.trustTitleMax}>FREE PAN-INDIA DELIVERY</p>
              <p className={styles.trustDescMax}>Fast express shipping dispatched within 24 hours in discreet luxury packaging</p>
            </div>
          </div>

          <div className={styles.trustItemMax}>
            <div className={styles.trustIconBoxMax}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className={styles.trustTitleMax}>100% GENUINE FORMULA</p>
              <p className={styles.trustDescMax}>Certified authentic, non-irritating ammonia-free direct-to-consumer formulation</p>
            </div>
          </div>

          <div className={styles.trustItemMax}>
            <div className={styles.trustIconBoxMax}>
              <RefreshCw size={28} />
            </div>
            <div>
              <p className={styles.trustTitleMax}>SHADE ADVISORY</p>
              <p className={styles.trustDescMax}>Unsure about your tone? Our master grooming advisors assist free of charge</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DEDICATED MAXIMALIST FOOTER
      ========================================================= */}
      <footer className={styles.footerContainer}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerBrandLogoWrap} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={brandFavicon} alt="DailyFix" className={styles.footerLogoImg} />
              <span className="font-['Bebas_Neue'] text-3xl tracking-wider text-white">DailyFix Grooming</span>
            </div>
            <h4 className={styles.footerHeadlineHuge}>
              MAXIMALIST MEN'S CARE.
            </h4>
            <p className={styles.footerText}>
              Engineered with clean botanicals, zero ammonia, and unapologetic masculine confidence. Built for modern gentlemen who demand immediate results.
            </p>
          </div>

          <div>
            <h4 className={styles.footerHeadingMax}>THE SHADE ROSTER</h4>
            <ul className={styles.footerLinksList}>
              <li>
                <button
                  onClick={() => {
                    setActiveShadeIndex(0);
                    scrollToSection('hero-section');
                  }}
                  className={styles.footerLinkMax}
                >
                  SHADE 01 — NATURAL BLACK
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveShadeIndex(1);
                    scrollToSection('hero-section');
                  }}
                  className={styles.footerLinkMax}
                >
                  SHADE 02 — DARK BROWN
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveShadeIndex(2);
                    scrollToSection('hero-section');
                  }}
                  className={styles.footerLinkMax}
                >
                  SHADE 03 — BROWN BLACK
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerHeadingMax}>SAMPLE THREE</h4>
            <p className="text-sm font-bold text-white/70 leading-relaxed mb-4">
              This demonstration is specifically crafted under the Editorial Maximalism ("Everything Big Big") guidelines for client presentation.
            </p>
            <div className="inline-block border-2 border-[#D8A257] px-4 py-2 rounded-xl text-xs font-black uppercase text-[#D8A257]">
              ✓ Maximalist Typography System
            </div>
          </div>
        </div>

        <div className={styles.footerBottomMax}>
          <p className="font-bold text-sm text-white/70">
            © {new Date().getFullYear()} DailyFix Grooming Essentials. All rights reserved.
          </p>
          <div className="flex items-center gap-6 font-bold text-xs uppercase tracking-widest text-[#D8A257]">
            <span>Ammonia-Free</span>
            <span>•</span>
            <span>10-Min Action</span>
            <span>•</span>
            <span>Cruelty-Free</span>
          </div>
        </div>

        {/* Huge Ghost Watermark */}
        <div className={styles.giantFooterWatermark}>DAILYFIX</div>
      </footer>
    </div>
  );
};

export default Sample3;
