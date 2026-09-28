import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import styles from './ThreeShadesShowcaseSection.module.css';

// The client's favorite showcase image featuring all 3 shades
import threeShadesShowcase from '../assets/images/three-shades-showcase.jpg';
import shadeBlackImg from '../assets/images/001 Natural black1.png';
import shadeBrownBlackImg from '../assets/images/002 Brown black2.png';
import shadeDarkBrownImg from '../assets/images/003 Drak brown3.png';

const SHADES = [
  {
    id: 'natural-black',
    slug: 'natural-black',
    number: '001',
    name: 'Natural Black',
    price: 450,
    colorHex: '#18181B',
    img: shadeBlackImg
  },
  {
    id: 'black-brown',
    slug: 'black-brown',
    number: '002',
    name: 'Black Brown',
    price: 450,
    colorHex: '#271D18',
    img: shadeBrownBlackImg
  },
  {
    id: 'dark-brown',
    slug: 'dark-brown',
    number: '003',
    name: 'Dark Brown',
    price: 450,
    colorHex: '#3E2723',
    img: shadeDarkBrownImg
  }
];

const ThreeShadesShowcaseSection = ({ onAddToCart, onAddTrioToCart }) => {
  const { addToCart } = useCart();

  const handleQuickAdd = (shade) => {
    if (onAddToCart) {
      onAddToCart(shade);
    } else {
      addToCart(
        {
          id: shade.id,
          name: `Dailyfix Beard Colour - ${shade.name}`,
          price: shade.price,
          slug: shade.slug,
          image: shade.img
        },
        1
      );
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
    }
  };

  const handleBuyTrio = () => {
    if (onAddTrioToCart) {
      onAddTrioToCart();
    } else {
      SHADES.forEach((shade) => {
        addToCart(
          {
            id: shade.id,
            name: `Dailyfix Beard Colour - ${shade.name}`,
            price: shade.price,
            slug: shade.slug,
            image: shade.img
          },
          1
        );
      });
      toast.success('Complete Trio (All 3 Shades) added to cart • ₹1,350', {
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
    }
  };

  return (
    <section id="three-shades-feature" className={styles.sectionWrapper}>
      {/* Subtle ambient lighting glows */}
      <div className={styles.ambientGlowLeft} aria-hidden="true" />
      <div className={styles.ambientGlowRight} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.showcaseGrid}>
          {/* ========================================================
              LEFT: HIGHLIGHTED IMAGE WITH ANIMATED RAINBOW BORDER
          ========================================================= */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={styles.visualColumn}
          >
            <div className={styles.rainbowGlowWrapper}>
              {/* Outer soft ambient rainbow aura */}
              <div className={styles.rainbowAura} aria-hidden="true" />

              {/* Sharp frame with spinning rainbow border */}
              <div className={styles.rainbowBorderFrame}>
                {/* 360-degree spinning rainbow gradient */}
                <div className={styles.rainbowSpinningTrack} aria-hidden="true" />

                {/* Inner image stage - Unobstructed Artwork */}
                <div className={styles.imageStage}>
                  <img
                    src={threeShadesShowcase}
                    alt="Dailyfix Where Confidence Meets Natural Look - All 3 Shades"
                    className={styles.posterImage}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================
              RIGHT: MINIMAL MODERN EDITORIAL & DIRECT PURCHASE
          ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className={styles.contentColumn}
          >
            {/* Minimal Eyebrow Tag */}
            <div className={styles.eyebrowTag}>
              <Sparkles size={13} className="text-[#2D7D52]" />
              <span>Ammonia-Free Botanical Formula</span>
            </div>

            {/* Clean Serif Heading */}
            <h2 className={styles.mainHeading}>
              Where Confidence Meets <br />
              <span className={styles.headingHighlight}>Natural Look</span>
            </h2>

            {/* Minimal Lead Text */}
            <p className={styles.sectionLead}>
              All 3 signature shades engineered specifically for coarse facial hair textures.
              Infused with nourishing olive extract and taurine for undetectable, salon-grade
              coverage in just 10 minutes.
            </p>

            {/* Sleek Minimal Trio Offer Card */}
            <div className={styles.trioCard}>
              <div className={styles.trioCardTop}>
                <h3 className={styles.trioCardTitle}>The Complete 3-Shade Trio Kit</h3>
                <span className={styles.trioSaveBadge}>SAVE ₹447 (25% OFF)</span>
              </div>

              <div className={styles.trioPriceRow}>
                <span className={styles.trioCurrentPrice}>₹1,350</span>
                <span className={styles.trioOldPrice}>₹1,797</span>
                <span className={styles.trioPriceNote}>• Includes all 3 applicator kits</span>
              </div>

              <button
                type="button"
                onClick={handleBuyTrio}
                className={styles.btnBuyTrio}
                id="btn-add-trio-showcase"
              >
                <ShoppingBag size={18} />
                <span>ADD COMPLETE TRIO TO CART • ₹1,350</span>
              </button>
            </div>

            {/* Quick Individual Shade Chips */}
            <div>
              <p className={styles.quickShadesTitle}>Or select individual shade:</p>
              <div className={styles.shadeChipsRow}>
                {SHADES.map((shade) => (
                  <div
                    key={shade.id}
                    onClick={() => handleQuickAdd(shade)}
                    className={styles.shadeChip}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd(shade)}
                  >
                    <div className={styles.shadeChipLeft}>
                      <span
                        className={styles.shadeDot}
                        style={{ backgroundColor: shade.colorHex }}
                      />
                      <span className={styles.shadeChipName}>{shade.name}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.shadeChipBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickAdd(shade);
                      }}
                    >
                      <Plus size={11} className="inline mr-0.5" />
                      ₹{shade.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Minimal Trust Checkmarks */}
            <div className={styles.trustCheckmarks}>
              <div className={styles.trustCheckItem}>
                <CheckCircle2 size={15} className={styles.trustCheckIcon} />
                <span>10-Min Fast Action</span>
              </div>
              <div className={styles.trustCheckItem}>
                <CheckCircle2 size={15} className={styles.trustCheckIcon} />
                <span>Zero Skin Staining</span>
              </div>
              <div className={styles.trustCheckItem}>
                <CheckCircle2 size={15} className={styles.trustCheckIcon} />
                <span>Free Pan-India Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThreeShadesShowcaseSection;
