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
  Leaf,
  CheckCircle2,
  RefreshCw,
  Truck,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Assets
import heroProductImg from '../assets/images/Dailyfix Beard Colour Product Only.png';
import shadeBlackImg from '../assets/images/001 Natural black1.png';
import shadeDarkBrownImg from '../assets/images/003 Drak brown3.png';
import shadeBrownBlackImg from '../assets/images/002 Brown black2.png';
import brandFavicon from '../assets/images/favicon logo.jpeg';

import styles from './Sample1.module.css';

const SHADES = [
  {
    id: 'natural-black',
    number: '01',
    name: 'Natural Black',
    badge: 'Best Seller',
    tagline: 'Deep, authentic coverage without artificial bluish tint.',
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
    tagline: 'Rich espresso tone with warm depth for versatile styling.',
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
    tagline: 'Balanced transition shade for a naturally textured beard.',
    price: 399,
    rating: 4.8,
    reviews: '560+',
    colorHex: '#271D18',
    img: shadeBrownBlackImg
  }
];

const Sample1 = () => {
  const [activeShadeIndex, setActiveShadeIndex] = useState(0);
  const [cartCount, setCartCount] = useState(1);

  useEffect(() => {
    document.title = 'DailyFix | Luxury Green & Cream Client Demonstration';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAddToCart = (shadeName) => {
    setCartCount((prev) => prev + 1);
    toast.success(`${shadeName} added to demonstration bag!`, {
      style: {
        background: '#143D28',
        color: '#FFFFFF',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        padding: '12px 18px'
      },
      iconTheme: {
        primary: '#4EA874',
        secondary: '#143D28'
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

      {/* Decorative ambient subtle green glows */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowMiddle} aria-hidden="true" />

      {/* ========================================================
          DEDICATED STICKY LUXURY HEADER (Cream & Forest Green)
      ========================================================= */}
      <header className={styles.headerSticky}>
        <div className={styles.headerInner}>
          <div className={styles.brandLogoWrap} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={brandFavicon} alt="DailyFix" className={styles.brandLogoImg} />
            <div className={styles.brandDivider} />
            <div className={styles.brandTaglineCol}>
              <span className={styles.brandSubtag}>Botanical Grooming</span>
              <span className={styles.brandTaglineSmall}>Pure Men's Care</span>
            </div>
          </div>

          <nav className={styles.navLinks} aria-label="Demo Navigation">
            <button onClick={() => scrollToSection('hero-section')} className={styles.navLinkItem}>
              Hero
            </button>
            <button onClick={() => scrollToSection('bento-features')} className={styles.navLinkItem}>
              Features Bento
            </button>
            <button onClick={() => scrollToSection('product-collection')} className={styles.navLinkItem}>
              3-Shade Collection
            </button>
            <span className={styles.pillTag}>
              <span className={styles.pulseDot} />
              Client Preview
            </span>
          </nav>

          <div className={styles.headerActions}>
            <div
              className={styles.demoCartPill}
              onClick={() => handleAddToCart(activeShade.name)}
              title="Click to simulate item addition"
            >
              <ShoppingBag size={16} className="text-[#2D7D52]" />
              <span>Demo Bag</span>
              <span className={styles.cartCountDot}>{cartCount}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          SECTION 1: SPLIT EDITORIAL HERO (Warm Cream + Green)
      ========================================================= */}
      <section id="hero-section" className={styles.heroSection}>
        <div className={styles.heroContainer}>
          {/* Left Column: Headline, Proof Points & Action */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={styles.heroContent}
          >
            <div className={styles.pillTag}>
              <Sparkles size={14} className="text-[#2D7D52]" />
              <span>100% Ammonia-Free • Botanical Formula</span>
            </div>

            <h1 className={styles.heroTitle}>
              Pure Grooming, <br />
              <span className={styles.heroTitleHighlight}>Naturally Defined.</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Experience an undetectable, salon-grade beard transformation in just 10 minutes. Crafted with nourishing olive and taurine extracts for gentle, skin-friendly coverage.
            </p>

            {/* 3 Quick Value Bullets */}
            <div className={styles.heroBulletsGrid}>
              <div className={styles.heroBulletCard}>
                <div className={styles.heroBulletIcon}>
                  <Clock size={18} />
                </div>
                <div>
                  <p className={styles.heroBulletTitle}>10-Min Action</p>
                  <p className={styles.heroBulletDesc}>Fast gray coverage</p>
                </div>
              </div>

              <div className={styles.heroBulletCard}>
                <div className={styles.heroBulletIcon}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className={styles.heroBulletTitle}>0% Ammonia</p>
                  <p className={styles.heroBulletDesc}>Zero harsh odor</p>
                </div>
              </div>

              <div className={styles.heroBulletCard}>
                <div className={styles.heroBulletIcon}>
                  <Droplets size={18} />
                </div>
                <div>
                  <p className={styles.heroBulletTitle}>Botanical Oil</p>
                  <p className={styles.heroBulletDesc}>Conditions facial hair</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className={styles.heroCtas}>
              <button
                onClick={() => scrollToSection('product-collection')}
                className={styles.btnPrimaryGreen}
              >
                <span>Explore 3 Shades</span>
                <ArrowRight size={17} />
              </button>

              <button
                onClick={() => scrollToSection('bento-features')}
                className={styles.btnSecondaryOutline}
              >
                <span>Why DailyFix?</span>
              </button>
            </div>

            {/* Social Proof Bar */}
            <div className={styles.socialProofSnippet}>
              <div className={styles.avatarGroup}>
                <div className={styles.avatarCircle}>DF</div>
                <div className={styles.avatarCircle}>AK</div>
                <div className={styles.avatarCircle}>RS</div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className="fill-[#2D7D52] text-[#2D7D52]" />
                  ))}
                  <span className="text-xs font-bold text-[#143D28] ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-[#637D6C] font-medium mt-0.5">
                  Trusted by 2,800+ modern Indian gentlemen
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card with Shade Switcher */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
            className={styles.heroVisualCard}
          >
            {/* Top Floating Badge */}
            <div className={styles.floatingGlassBadge}>
              <span className="w-2 h-2 rounded-full bg-[#2D7D52] animate-ping" />
              <span className="text-xs font-extrabold text-[#143D28] uppercase tracking-wider">
                Ammonia-Free Certified
              </span>
            </div>

            {/* Center Product Visual */}
            <div className={styles.heroProductStage}>
              <div className={styles.stageBackdropCircle} />
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeShade.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  src={activeShade.img || heroProductImg}
                  alt={activeShade.name}
                  className={styles.heroProductImg}
                />
              </AnimatePresence>

              {/* Rating Tag */}
              <div className={styles.floatingRatingBadge}>
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-[#143D28]">4.9</span>
                <span className="text-[11px] text-[#637D6C]">({activeShade.reviews})</span>
              </div>
            </div>

            {/* Interactive Shade Selector */}
            <div className={styles.shadeSelectorWrap}>
              <div className={styles.shadeLabelRow}>
                <span className={styles.shadeLabelText}>Interactive Shade Selector</span>
                <span className={styles.selectedShadeText}>
                  {activeShade.number} • {activeShade.name}
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
      </section>

      {/* ========================================================
          SECTION 2: ASYMMETRIC BENTO GRID (Features & Science)
      ========================================================= */}
      <section id="bento-features" className={styles.bentoSection}>
        <div className={styles.sectionHeaderCenter}>
          <div className={styles.pillTag}>
            <Award size={14} className="text-[#2D7D52]" />
            <span>Formulation Highlights</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Engineered for Precision, <br />
            Kind to Your Skin.
          </h2>

          <p className={styles.sectionSubheading}>
            Unlike harsh boxed dyes, DailyFix is designed specifically for coarser beard hair textures while preserving skin comfort.
          </p>
        </div>

        <div className={styles.bentoGridContainer}>
          {/* Card 1: 10-Minute Rapid Action (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`${styles.bentoCard} ${styles.bentoCardSpan7}`}
          >
            <div>
              <div className={styles.bentoCardHeader}>
                <div className={styles.bentoIconWrap}>
                  <Clock size={24} />
                </div>
                <span className={styles.bentoTag}>Fast Routine</span>
              </div>

              <h3 className={styles.bentoTitle}>10-Minute Rapid Gray Fusion</h3>
              <p className={styles.bentoText}>
                No waiting around for hours. The specialized micro-pigment delivery penetrates the beard shaft in 10 minutes flat, delivering natural coverage that lasts weeks.
              </p>
            </div>

            <div className={styles.bentoStepRow}>
              <div className={styles.bentoStepItem}>
                <span className={styles.bentoStepNum}>Step 01</span>
                <p className={styles.bentoStepText}>Dispense & Mix</p>
              </div>
              <div className={styles.bentoStepItem}>
                <span className={styles.bentoStepNum}>Step 02</span>
                <p className={styles.bentoStepText}>Apply for 10 Min</p>
              </div>
              <div className={styles.bentoStepItem}>
                <span className={styles.bentoStepNum}>Step 03</span>
                <p className={styles.bentoStepText}>Rinse & Reveal</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Pure Botanical Defense (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`${styles.bentoCard} ${styles.bentoCardSpan5}`}
          >
            <div>
              <div className={styles.bentoCardHeader}>
                <div className={styles.bentoIconWrap}>
                  <Leaf size={24} />
                </div>
                <span className={styles.bentoTag}>Safe Formula</span>
              </div>

              <h3 className={styles.bentoTitle}>Zero Ammonia & Harsh Odors</h3>
              <p className={styles.bentoText}>
                Infused with natural olive extract and taurine. Nourishes facial skin and minimizes itching, irritation, and dryness.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#143D28]">
              <CheckCircle2 size={16} className="text-[#2D7D52]" />
              <span>Dermatologically tested for daily grooming</span>
            </div>
          </motion.div>

          {/* Card 3: Zero-Stain Guarantee (Span 5) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`${styles.bentoCard} ${styles.bentoCardSpan5}`}
          >
            <div>
              <div className={styles.bentoCardHeader}>
                <div className={styles.bentoIconWrap}>
                  <Droplets size={24} />
                </div>
                <span className={styles.bentoTag}>Clean Application</span>
              </div>

              <h3 className={styles.bentoTitle}>Zero Skin-Stain Barrier</h3>
              <p className={styles.bentoText}>
                Non-drip consistency adheres only to keratin beard fibres, keeping cheek lines and neckline clean without messy patches.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#143D28]">
              <CheckCircle2 size={16} className="text-[#2D7D52]" />
              <span>Easily washes off hands with mild soap</span>
            </div>
          </motion.div>

          {/* Card 4: Why Gentlemen Choose DailyFix (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`${styles.bentoCard} ${styles.bentoCardSpan7}`}
          >
            <div>
              <div className={styles.bentoCardHeader}>
                <div className={styles.bentoIconWrap}>
                  <Zap size={24} />
                </div>
                <span className={styles.bentoTag}>Client Proven</span>
              </div>

              <h3 className={styles.bentoTitle}>Consistent, Professional Results</h3>
              <p className={styles.bentoText}>
                Engineered specifically for Asian and Mediterranean beard textures, creating a seamless match that looks 100% natural under daylight.
              </p>
            </div>

            <div className={styles.statsGridWrap}>
              <div className={styles.statMetricBox}>
                <div className={styles.statMetricNumber}>98%</div>
                <div className={styles.statMetricLabel}>Natural Blend Rating</div>
              </div>
              <div className={styles.statMetricBox}>
                <div className={styles.statMetricNumber}>4+ Wks</div>
                <div className={styles.statMetricLabel}>Color Longevity</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: 3-SHADE PRODUCT TRIO SHOWCASE & TRUST BAR
      ========================================================= */}
      <section id="product-collection" className={styles.productSection}>
        <div className={styles.sectionHeaderCenter}>
          <div className={styles.pillTag}>
            <ShoppingBag size={14} className="text-[#2D7D52]" />
            <span>The Trio Collection</span>
          </div>

          <h2 className={styles.sectionHeading}>
            Find Your Signature Shade
          </h2>

          <p className={styles.sectionSubheading}>
            3 expertly calibrated shades designed to blend seamlessly with your natural facial hair tone.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className={styles.productGridContainer}>
          {SHADES.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className={styles.productCard}
            >
              <div>
                <div className={styles.productTopRow}>
                  <span className={styles.productTag}>{product.badge}</span>
                  <div
                    className={styles.shadeSwatchCircle}
                    style={{ backgroundColor: product.colorHex, width: 20, height: 20 }}
                    title={product.name}
                  />
                </div>

                <div className={styles.productImageFrame}>
                  <img
                    src={product.img}
                    alt={product.name}
                    className={styles.productImg}
                  />
                </div>

                <div className={styles.productMetaWrap}>
                  <div className={styles.ratingRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={13} className="fill-[#2D7D52] text-[#2D7D52]" />
                    ))}
                    <span className="text-xs font-black text-[#143D28] ml-1">{product.rating}</span>
                    <span className="text-[11px] text-[#637D6C]">({product.reviews})</span>
                  </div>

                  <h3 className={styles.productTitle}>
                    {product.number} • {product.name}
                  </h3>

                  <p className={styles.productDesc}>{product.tagline}</p>

                  <div className={styles.productPriceRow}>
                    <span className={styles.productPrice}>₹{product.price}</span>
                    <span className={styles.productPriceTax}>M.R.P. (Incl. of all taxes)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAddToCart(product.name)}
                className={styles.btnAddToCart}
              >
                <ShoppingBag size={16} />
                <span>Add to Bag • ₹{product.price}</span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Indicators */}
        <div className={styles.trustBannerContainer}>
          <div className={styles.trustItem}>
            <div className={styles.trustIconBox}>
              <Truck size={22} />
            </div>
            <div>
              <p className={styles.trustTitle}>Free Pan-India Delivery</p>
              <p className={styles.trustDesc}>Dispatched within 24 hours in discreet luxury packaging</p>
            </div>
          </div>

          <div className={styles.trustItem}>
            <div className={styles.trustIconBox}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className={styles.trustTitle}>100% Genuine Direct Formula</p>
              <p className={styles.trustDesc}>Certified authentic, non-irritating ammonia-free blend</p>
            </div>
          </div>

          <div className={styles.trustItem}>
            <div className={styles.trustIconBox}>
              <RefreshCw size={22} />
            </div>
            <div>
              <p className={styles.trustTitle}>Shade Guarantee</p>
              <p className={styles.trustDesc}>Not sure about your shade? Our advisors assist free</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          DEDICATED LUXURY MINIMAL FOOTER
      ========================================================= */}
      <footer className={styles.footerContainer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrandCol}>
            <div className={styles.brandLogoWrap} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={brandFavicon} alt="DailyFix" className={styles.brandLogoImg} />
              <div className={styles.brandDivider} />
              <div className={styles.brandTaglineCol}>
                <span className={styles.brandSubtag}>Botanical Grooming</span>
                <span className={styles.brandTaglineSmall}>Pure Men's Care</span>
              </div>
            </div>
            <p className={styles.footerText}>
              Elevating men's daily grooming rituals with clean, skin-friendly botanical formulations and timeless confidence.
            </p>
          </div>

          <div>
            <h4 className={styles.footerHeading}>Shade Portfolio</h4>
            <ul className={styles.footerLinkList}>
              <li>
                <button
                  onClick={() => {
                    setActiveShadeIndex(0);
                    scrollToSection('hero-section');
                  }}
                  className={styles.footerLinkItem}
                >
                  01 Natural Black (Deep Coverage)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveShadeIndex(1);
                    scrollToSection('hero-section');
                  }}
                  className={styles.footerLinkItem}
                >
                  02 Dark Brown (Espresso Tone)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveShadeIndex(2);
                    scrollToSection('hero-section');
                  }}
                  className={styles.footerLinkItem}
                >
                  03 Brown Black (Textured Blend)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={styles.footerHeading}>Client Demonstration</h4>
            <ul className={styles.footerLinkList}>
              <li>
                <span className="text-xs text-[#4A6352] leading-relaxed block">
                  This static demonstration page is configured exclusively for client review under the Cream & Green aesthetic guidelines.
                </span>
              </li>
              <li className="pt-2">
                <span className={styles.demoWatermark}>
                  <Check size={13} />
                  Production Ready Layout
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            © {new Date().getFullYear()} DailyFix Grooming Essentials. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#637D6C]">
            <span>Ammonia-Free</span>
            <span>•</span>
            <span>Cruelty-Free</span>
            <span>•</span>
            <span>Dermatologist Approved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Sample1;
