import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Play,
  Box,
  ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useCart } from '../context/CartContext';
import api from '../services/api';
import { getListingImage } from '../utils/productImages';
import { getShadeSortRank } from '../data/productDetailData';
import { blogPosts } from '../data/blogData.js';

// Visual Assets from /sample1 & Home
import heroProductImg from '../assets/images/Dailyfix Beard Colour Product Only.png';
import shadeBlackImg from '../assets/images/001 Natural black1.png';
import shadeDarkBrownImg from '../assets/images/003 Drak brown3.png';
import shadeBrownBlackImg from '../assets/images/002 Brown black2.png';
import poster from '../assets/images/poster.png';
import beardVideo from '../assets/Untitled design (3).mp4';

// Reusable Components
import InstagramFeed from '../components/Instagramfeed.jsx';
import Marketplaces from '../components/Marketplaces.jsx';
import HomeFAQ from '../components/HomeFAQ.jsx';

import styles from './Sample1.module.css';

const SHADES = [
  {
    id: 'natural-black',
    slug: 'natural-black-beard-colour',
    number: '01',
    name: 'Natural Black',
    badge: 'Best Seller',
    tagline: 'Deep, authentic coverage without artificial bluish tint.',
    price: 450,
    rating: 4.9,
    reviews: '1,420+',
    colorHex: '#18181B',
    img: shadeBlackImg
  },
  {
    id: 'dark-brown',
    slug: 'dark-brown-beard-colour',
    number: '02',
    name: 'Dark Brown',
    badge: "Gentleman's Choice",
    tagline: 'Rich espresso tone with warm depth for versatile styling.',
    price: 450,
    rating: 4.9,
    reviews: '890+',
    colorHex: '#3E2723',
    img: shadeDarkBrownImg
  },
  {
    id: 'brown-black',
    slug: 'black-brown-beard-colour',
    number: '03',
    name: 'Brown Black',
    badge: 'Natural Blend',
    tagline: 'Balanced transition shade for a naturally textured beard.',
    price: 450,
    rating: 4.8,
    reviews: '560+',
    colorHex: '#271D18',
    img: shadeBrownBlackImg
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeShadeIndex, setActiveShadeIndex] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    document.title = 'DailyFix | Beard Colour for Men | Natural, Ammonia-Free Shades';

    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const list =
          (res.data && res.data.products) ||
          (Array.isArray(res.data) ? res.data : []);

        if (!Array.isArray(list) || list.length === 0) {
          setProducts([]);
          return;
        }

        const mappedProducts = list.map((product) => ({
          id: product._id || product.id,
          name: product.name,
          desc: 'Ammonia-Free Formula',
          price: Number(product.price || 450),
          image: getListingImage(product.slug),
          slug: product.slug,
          sku: product.sku,
          brand: product.brand,
          stock: product.stock
        }));
        mappedProducts.sort((a, b) => getShadeSortRank(a.slug) - getShadeSortRank(b.slug));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getProductForShade = (shade) => {
    return products.find(
      (p) =>
        p.slug === shade.slug ||
        p.slug === shade.id ||
        (p.slug && shade.slug && (p.slug.includes(shade.id) || shade.slug.includes(p.slug))) ||
        (p.name && shade.name && p.name.toLowerCase().includes(shade.name.toLowerCase()))
    );
  };

  const getShadePrice = (shade) => {
    const matched = getProductForShade(shade);
    return matched?.price || shade.price || 450;
  };

  const handleAddToCart = (shade) => {
    const matchedProduct = getProductForShade(shade);
    const effectivePrice = matchedProduct?.price || shade.price || 450;

    const itemToAdd = matchedProduct
      ? {
          ...matchedProduct,
          price: effectivePrice,
          image: matchedProduct.image || shade.img
        }
      : {
          id: shade.id,
          name: `DailyFix Beard Colour - ${shade.name}`,
          price: effectivePrice,
          slug: shade.slug,
          image: shade.img
        };

    addToCart(itemToAdd, 1);
    toast.success(`${shade.name} added to cart!`, {
      style: {
        background: '#143D28',
        color: '#FFFFFF',
        borderRadius: '14px',
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
      {/* Decorative ambient subtle green glows from /sample1 */}
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowMiddle} aria-hidden="true" />

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
              Experience an undetectable, salon-grade beard transformation in just 10 minutes.
              Crafted with nourishing olive and taurine extracts for gentle, skin-friendly coverage.
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

              {/* Rating Tag anchored safely to bottom-right of product stage */}
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
            Unlike harsh boxed dyes, DailyFix is designed specifically for coarser beard hair textures
            while preserving skin comfort.
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
                No waiting around for hours. The specialized micro-pigment delivery penetrates the
                beard shaft in 10 minutes flat, delivering natural coverage that lasts weeks.
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
                Infused with natural olive extract and taurine. Nourishes facial skin and minimizes
                itching, irritation, and dryness.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#143D28]">
              <CheckCircle2 size={16} className="text-[#2D7D52]" />
              <span>Dermatologically tested for regular grooming</span>
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
                Non-drip consistency adheres cleanly to beard hair fibers, keeping cheek lines and
                necklines sharp without messy patches.
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
                <span className={styles.bentoTag}>Proven Results</span>
              </div>

              <h3 className={styles.bentoTitle}>Consistent, Professional Tone</h3>
              <p className={styles.bentoText}>
                Calibrated specifically for Indian and South Asian beard textures, creating a seamless
                match that looks 100% natural under daylight.
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

          <h2 className={styles.sectionHeading}>Find Your Signature Shade</h2>

          <p className={styles.sectionSubheading}>
            3 expertly calibrated shades designed to blend seamlessly with your natural facial hair tone.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className={styles.productGridContainer}>
          {SHADES.map((product, index) => {
            const price = getShadePrice(product);

            return (
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
                      <span className={styles.productPrice}>₹{price}</span>
                      <span className={styles.productPriceTax}>M.R.P. (Incl. of all taxes)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className={styles.btnAddToCart}
                >
                  <ShoppingBag size={16} />
                  <span>Add to Bag • ₹{price}</span>
                </button>
              </motion.div>
            );
          })}
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
          SECTION 4: REAL TRANSFORMATIONS IN INSTAGRAM REELS
          (Shifted directly after 3-Shade Product Showcase)
      ========================================================= */}
      <InstagramFeed />

      {/* ========================================================
          SECTION 5: PHILOSOPHY & BOTANICAL CRAFT
      ========================================================= */}
      <section id="about-section" className="py-20 px-4 sm:px-8 md:px-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Poster Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 flex justify-center"
            >
              <div className="relative group w-full max-w-[340px] sm:max-w-[400px]">
                <div className="absolute inset-0 bg-[#2D7D52]/15 rounded-[24px] blur-2xl transform translate-x-2 translate-y-2 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1" />
                <div className="relative w-full rounded-[20px] shadow-[0_20px_50px_rgba(27,77,49,0.12)] border border-[#1B4D31]/20 overflow-hidden bg-black">
                  <img
                    src={poster}
                    alt="DailyFix Botanical Grooming"
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

            {/* Right Philosophy Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 space-y-6 mt-8 lg:mt-0"
            >
              <div className={styles.pillTag}>
                <Leaf size={14} className="text-[#2D7D52]" />
                <span>Our Philosophy</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
                Premium Grooming <br />
                <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#1B4D31] via-[#2D7D52] to-[#4EA874]">
                  for the Modern Gentleman
                </span>
              </h2>

              <p className="font-sans text-base sm:text-lg text-[#4A6352] leading-relaxed">
                DailyFix was born to solve a real frustration: harsh boxed dyes that leave an artificial,
                stiff stain on skin and facial hair. We engineered a gentle, botanical alternative that
                gives undetectable gray coverage while actively nourishing your beard and face.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-[#1B4D31]/10 shadow-xs">
                  <p className="font-serif text-3xl font-bold text-[#143D28]">
                    3<span className="text-[#2D7D52]">+</span>
                  </p>
                  <p className="font-sans text-xs font-bold text-[#4A6352] uppercase tracking-wider mt-1">
                    Calibrated Shades
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#1B4D31]/10 shadow-xs">
                  <p className="font-serif text-3xl font-bold text-[#143D28]">
                    0<span className="text-[#2D7D52]">%</span>
                  </p>
                  <p className="font-sans text-xs font-bold text-[#4A6352] uppercase tracking-wider mt-1">
                    Harsh Chemicals
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/about" className={styles.btnSecondaryOutline}>
                  <span>Read Full Story</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: VIDEO TRANSFORMATION SHOWCASE (Light Luxury)
      ========================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="bg-white rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[0_16px_48px_rgba(27,77,49,0.06)] border border-[#1B4D31]/12 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Video Player Frame */}
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden shadow-lg bg-[#F7F5EE] border border-[#1B4D31]/10 flex items-center justify-center">
            <video
              className="w-full h-auto aspect-video lg:aspect-auto object-cover max-h-[380px]"
              src={beardVideo}
              controls
              autoPlay
              muted
              loop
              playsInline
              poster={poster}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Transformation Copy */}
          <div className="w-full lg:w-1/2 space-y-5">
            <div className={styles.pillTag}>
              <Play size={13} className="text-[#2D7D52] fill-[#2D7D52]" />
              <span>Real 10-Min Demonstration</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#143D28] tracking-tight leading-snug">
              Transform Your Look in Minutes, <br />
              <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#1B4D31] via-[#2D7D52] to-[#4EA874]">
                Retain 100% Natural Character.
              </span>
            </h2>

            <p className="text-[#4A6352] font-sans text-sm sm:text-base leading-relaxed">
              Watch how cleanly DailyFix applies with zero mess. Keratin-bonding botanical pigments
              blend effortlessly across beards, mustaches, and sideburns without artificial dye sheen.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('product-collection')}
                className={styles.btnPrimaryGreen}
              >
                <span>Find Your Match</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: OFFICIAL MARKETPLACES
      ========================================================= */}
      <Marketplaces />

      {/* ========================================================
          SECTION 7: BLOG & GROOMING TIPS INFINITE CAROUSEL
      ========================================================= */}
      <section className="py-16 sm:py-20 px-0 overflow-hidden relative z-10 bg-[#F7F5EE]/60 border-t border-[#1B4D31]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className={styles.pillTag}>
                <Leaf size={14} className="text-[#2D7D52]" />
                <span>From Our Journal</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#143D28] tracking-tight mt-3">
                Expert Grooming Guides & Rituals
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-[#2D7D52] font-bold hover:text-[#143D28] transition-colors text-sm"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Continuous Right-to-Left Marquee */}
        <style>{`
          @keyframes marquee-home-blog {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .home-blog-marquee-track {
            display: flex;
            width: max-content;
            animation: marquee-home-blog 38s linear infinite;
          }
          .home-blog-marquee-wrap:hover .home-blog-marquee-track {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .home-blog-marquee-track { animation: none; }
          }
        `}</style>

        <div className="home-blog-marquee-wrap w-full overflow-hidden" aria-label="Blog articles carousel">
          <div className="home-blog-marquee-track gap-5 sm:gap-6 pl-4 sm:pl-8">
            {[...blogPosts, ...blogPosts].map((post, i) => (
              <Link
                key={`${post.id}-${i}`}
                to={`/blog/${post.slug}`}
                className="flex-shrink-0 w-[290px] sm:w-[350px] bg-white rounded-[26px] overflow-hidden shadow-[0_8px_30px_rgba(27,77,49,0.05)] border border-[#1B4D31]/10 hover:shadow-[0_16px_40px_rgba(27,77,49,0.12)] hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden bg-[#F7F5EE] h-44 sm:h-52">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-[11px] text-[#637D6C] font-semibold mb-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#143D28] mb-2 leading-snug line-clamp-2 group-hover:text-[#2D7D52] transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#4A6352] line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 8: FREQUENTLY ASKED QUESTIONS (Bento Box Model)
      ========================================================= */}
      <HomeFAQ />

      {/* ========================================================
          SECTION 10: ELEVATED CLOSING BANNER (Light Luxury)
      ========================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto relative z-10">
        <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-14 lg:p-16 text-center relative overflow-hidden shadow-[0_18px_50px_rgba(27,77,49,0.06)] border border-[#1B4D31]/12">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5 sm:space-y-6">
            <div className={styles.pillTag}>
              <Sparkles size={14} className="text-[#2D7D52]" />
              <span>Elevate Your Daily Ritual</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
              Ready to Experience Clean, Natural Confidence?
            </h2>

            <p className="font-sans text-xs sm:text-base text-[#4A6352] leading-relaxed max-w-xl mx-auto">
              Join thousands of discerning Indian gentlemen who have switched to DailyFix Ammonia-Free Beard Colour.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full">
              <button
                onClick={() => scrollToSection('product-collection')}
                className={`${styles.btnPrimaryGreen} w-full sm:w-auto`}
              >
                <span>Select Your Shade</span>
                <ArrowRight size={16} />
              </button>

              <Link
                to="/about"
                className={`${styles.btnSecondaryOutline} w-full sm:w-auto`}
              >
                <span>Learn Our Science</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;