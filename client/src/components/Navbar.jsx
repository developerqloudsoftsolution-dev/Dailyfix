import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  CheckCircle,
  ArrowUpRight,
  Leaf,
  Truck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { getProductImageSrc } from '../utils/productImages';
import logo from '../assets/images/dailyfix new logo.png';

const ANNOUNCEMENTS = [
  {
    icon: Leaf,
    highlight: '100% Natural Colour',
    suffix: 'Ammonia-Free Gentle Botanical Formula'
  },
  {
    icon: Truck,
    highlight: 'Free Shipping All Over India',
    suffix: 'Dispatched within 24 Hours'
  },
  {
    icon: Sparkles,
    highlight: 'Easy & Safe to Use',
    suffix: '10-Minute Salon Finish at Home'
  }
];

const Navbar = () => {
  const location = useLocation();
  const isSample1 = location.pathname === '/sample1';

  const {
    getItemCount,
    lastAddedProduct,
    setLastAddedProduct,
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [activeAnnouncement, setActiveAnnouncement] = useState(0);

  /* Auto-slide announcements every 3.5s */
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  /* Close mobile menu when route changes */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /* Cart popup */
  useEffect(() => {
    if (!lastAddedProduct) return;

    setShowCartPopup(true);

    const timer = setTimeout(() => {
      setShowCartPopup(false);
      setLastAddedProduct(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [lastAddedProduct, setLastAddedProduct]);

  const navItems = [
    {
      label: 'HOME',
      path: '/',
    },
    {
      label: 'BEARD COLOUR',
      path: '/shop',
    },
    {
      label: 'ABOUT US',
      path: '/about',
    },
    {
      label: 'BLOG',
      path: '/blog',
    },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  const productImage = getProductImageSrc(lastAddedProduct?.product);

  const productPrice =
    lastAddedProduct?.product?.discount_price ||
    lastAddedProduct?.product?.price ||
    0;

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="fixed top-0 left-0 right-0 z-[9999]">

        {/* =====================================================
            AUTO-SLIDING ANNOUNCEMENT TOP BAR
        ====================================================== */}
        <div className="relative z-40 bg-[#F7F5EE] text-[#143D28] text-xs border-b border-[#1B4D31]/15 shadow-xs overflow-hidden h-[36px] flex items-center justify-center">
          <div className="max-w-[1500px] mx-auto w-full flex items-center justify-between px-3 sm:px-8">
            <button
              onClick={() => setActiveAnnouncement((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length)}
              className="hidden sm:inline-flex p-1 text-[#143D28] hover:text-[#2D7D52] transition-colors opacity-70 hover:opacity-100 cursor-pointer"
              aria-label="Previous announcement"
            >
              <ChevronLeft size={14} />
            </button>

            <div className="flex-1 flex items-center justify-center overflow-hidden h-5 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAnnouncement}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center justify-center gap-2 text-center whitespace-nowrap text-[11px] sm:text-xs tracking-wide"
                >
                  {React.createElement(ANNOUNCEMENTS[activeAnnouncement].icon, {
                    size: 13,
                    className: 'text-[#2D7D52] flex-shrink-0'
                  })}
                  <span className="font-extrabold text-[#0D2417]">
                    {ANNOUNCEMENTS[activeAnnouncement].highlight}
                  </span>
                  <span className="hidden md:inline text-[#1B4D31]/30">•</span>
                  <span className="hidden md:inline text-[#385E46] font-medium">
                    {ANNOUNCEMENTS[activeAnnouncement].suffix}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => setActiveAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length)}
              className="hidden sm:inline-flex p-1 text-[#143D28] hover:text-[#2D7D52] transition-colors opacity-70 hover:opacity-100 cursor-pointer"
              aria-label="Next announcement"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Background */}
        <div className="relative z-30 bg-[#0D2417]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_6px_28px_rgba(0,0,0,0.35)] transition-all duration-300">

          <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12">

            <div className="h-[76px] lg:h-[84px] flex items-center justify-between">

              {/* =================================================
                  LOGO
              ================================================== */}

              <Link
                to="/"
                className="flex items-center gap-3 sm:gap-4 flex-shrink-0 group"
              >
                <img
                  src={logo}
                  alt="Dailyfix"
                  className="
                    h-9
                    sm:h-10
                    lg:h-11
                    w-auto
                    object-contain
                    filter
                    drop-shadow-[0_2px_8px_rgba(255,255,255,0.12)]
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />
                <div className="hidden sm:block w-[1px] h-7 bg-white/20" />
                <div className="hidden sm:flex flex-col justify-center">
                  <span className="font-extrabold text-[10px] tracking-widest uppercase text-white/95">
                    Botanical Grooming
                  </span>
                  <span className="font-semibold text-[9px] tracking-wider text-[#A3C9B0]">
                    Pure Men's Care
                  </span>
                </div>
              </Link>


              {/* =================================================
                  DESKTOP NAVIGATION
              ================================================== */}

              <nav className="hidden lg:flex items-center gap-8 xl:gap-11">

                {navItems.map((item) => {

                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        relative
                        py-3
                        text-[14px]
                        xl:text-[15px]
                        font-semibold
                        tracking-wide
                        transition-all
                        duration-200
                        ${
                          active
                            ? 'text-white'
                            : 'text-[#C4DEC9] hover:text-white'
                        }
                      `}
                    >

                      {item.label}

                      {/* Active Indicator */}

                      {active && (
                        <motion.span
                          layoutId="activeNavbar"
                          className="
                            absolute
                            left-0
                            right-0
                            -bottom-1
                            h-[2.5px]
                            rounded-full
                            bg-[#4EA874]
                            shadow-[0_0_10px_rgba(78,168,116,0.6)]
                          "
                        />
                      )}

                    </Link>
                  );
                })}

              </nav>


              {/* =================================================
                  RIGHT ACTIONS
              ================================================== */}

              <div className="hidden lg:flex items-center gap-4">

                {/* Cart Capsule Pill */}

                <Link
                  to="/cart"
                  className="
                    relative
                    group
                    flex
                    items-center
                    gap-2.5
                    px-4
                    py-2.5
                    rounded-full
                    bg-white/10
                    border
                    border-white/20
                    text-white
                    text-sm
                    font-bold
                    shadow-sm
                    hover:bg-white/15
                    hover:border-[#4EA874]
                    hover:shadow-[0_4px_16px_rgba(78,168,116,0.25)]
                    hover:-translate-y-0.5
                    transition-all
                    duration-300
                  "
                >

                  <ShoppingBag
                    className="
                      w-[18px]
                      h-[18px]
                      text-[#4EA874]
                      transition-colors
                    "
                  />

                  <span>Cart</span>

                  {getItemCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="
                        flex
                        items-center
                        justify-center
                        min-w-[20px]
                        h-[20px]
                        px-1.5
                        rounded-full
                        bg-[#2D7D52]
                        text-white
                        text-[11px]
                        font-extrabold
                      "
                    >
                      {getItemCount()}
                    </motion.span>
                  )}

                </Link>


                {/* Contact Button */}

                <Link
                  to="/contact"
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    px-5
                    py-2.5
                    rounded-full
                    bg-gradient-to-r
                    from-[#2D7D52]
                    to-[#1E5D3B]
                    hover:from-[#35905f]
                    hover:to-[#247047]
                    text-white
                    text-sm
                    font-bold
                    border
                    border-[#4EA874]/30
                    shadow-[0_4px_16px_rgba(45,125,82,0.35)]
                    hover:shadow-[0_8px_24px_rgba(78,168,116,0.4)]
                    hover:-translate-y-0.5
                    transition-all
                    duration-300
                    min-h-[42px]
                  "
                >

                  Contact Us

                  <ArrowUpRight
                    className="
                      w-4
                      h-4
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />

                </Link>

              </div>


              {/* =================================================
                  MOBILE ACTIONS
              ================================================== */}

              <div className="lg:hidden flex items-center gap-3">

                {/* Mobile Cart */}

                <Link
                  to="/cart"
                  className="
                    relative
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-full
                    bg-white/10
                    border
                    border-white/20
                    text-white
                    shadow-sm
                  "
                >

                  <ShoppingBag className="w-5 h-5 text-[#4EA874]" />

                  {getItemCount() > 0 && (
                    <span
                      className="
                        absolute
                        -top-1
                        -right-1
                        flex
                        items-center
                        justify-center
                        min-w-[18px]
                        h-[18px]
                        rounded-full
                        bg-[#2D7D52]
                        text-white
                        text-[10px]
                        font-bold
                      "
                    >
                      {getItemCount()}
                    </span>
                  )}

                </Link>


                {/* Menu Button */}

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-full
                    bg-white/10
                    border
                    border-white/20
                    text-white
                    hover:bg-white/20
                    shadow-sm
                    transition-colors
                  "
                  aria-label="Toggle menu"
                >

                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}

                </button>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        <AnimatePresence>

          {mobileMenuOpen && (

            <>

              {/* Overlay (starts below 112px combined header: 36px topbar + 76px navbar) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="
                  fixed
                  top-[112px]
                  left-0
                  right-0
                  bottom-0
                  bg-black/45
                  backdrop-blur-xs
                  lg:hidden
                  z-10
                "
              />

              {/* Mobile Panel (drops down below header) */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="
                  relative
                  z-20
                  lg:hidden
                  bg-[#0D2417]
                  border-b
                  border-[#2D7D52]/25
                  shadow-2xl
                "
              >

                <nav className="max-w-[1500px] mx-auto px-5 py-6">

                  <div className="flex flex-col gap-2">

                    {navItems.map((item) => {

                      const active = isActive(item.path);

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`
                            flex
                            items-center
                            justify-between
                            px-5
                            py-3.5
                            rounded-xl
                            text-base
                            font-semibold
                            transition-all
                            ${
                              active
                                ? 'bg-[#143D28] text-white border border-[#2D7D52]/30'
                                : 'text-[#C4DEC9] hover:bg-white/5 hover:text-white'
                            }
                          `}
                        >

                          {item.label}

                          {active && (
                            <span
                              className="
                                w-2
                                h-2
                                rounded-full
                                bg-[#4EA874]
                              "
                            />
                          )}

                        </Link>
                      );
                    })}


                    {/* Cart */}

                    <Link
                      to="/cart"
                      className="
                        flex
                        items-center
                        justify-between
                        px-5
                        py-3.5
                        rounded-xl
                        text-base
                        font-semibold
                        text-[#C4DEC9]
                        hover:bg-white/5
                        hover:text-white
                        transition-all
                      "
                    >

                      <span>Shopping Cart</span>

                      {getItemCount() > 0 && (
                        <span
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-[#2D7D52]
                            text-white
                            text-xs
                            font-bold
                          "
                        >
                          {getItemCount()} Items
                        </span>
                      )}

                    </Link>


                    {/* Contact */}

                    <Link
                      to="/contact"
                      className="
                        mt-3
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-6
                        py-3.5
                        rounded-xl
                        bg-gradient-to-r
                        from-[#2D7D52]
                        to-[#1E5D3B]
                        text-white
                        font-bold
                        border
                        border-[#4EA874]/30
                        shadow-md
                        transition-all
                        min-h-[44px]
                      "
                    >

                      Contact Us

                      <ArrowUpRight className="w-5 h-5" />

                    </Link>

                  </div>

                </nav>

              </motion.div>

            </>

          )}

        </AnimatePresence>

      </header>


      {/* =====================================================
          NAVBAR SPACER
      ====================================================== */}

      <div className="h-[76px] lg:h-[84px]" />


      {/* =====================================================
          ADD TO CART POPUP
      ====================================================== */}

      <AnimatePresence>

        {showCartPopup && lastAddedProduct && (

          <motion.div
            initial={{ opacity: 0, y: -20, x: 30 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 30 }}
            transition={{ duration: 0.3 }}
            className="
              fixed
              top-24
              right-4
              sm:right-6
              z-[10000]
              w-[calc(100%-2rem)]
              sm:w-[390px]
            "
          >

            <div
              className="
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
                border
                border-gray-100
              "
            >

              {/* Top Accent */}

              <div className="h-1 bg-emerald-400" />


              <div className="p-5">

                <div className="flex items-start gap-4">

                  {/* Product Image */}

                  <div
                    className="
                      w-16
                      h-16
                      rounded-xl
                      bg-gray-50
                      flex-shrink-0
                      overflow-hidden
                      border
                      border-gray-100
                    "
                  >

                    <img
                      src={productImage}
                      alt={lastAddedProduct.product.name}
                      className="w-full h-full object-contain"
                    />

                  </div>


                  {/* Product Info */}

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center gap-2 mb-1">

                      <CheckCircle className="w-5 h-5 text-emerald-500" />

                      <span className="text-sm font-bold text-gray-900">
                        Added to Cart
                      </span>

                    </div>


                    <p className="text-sm text-gray-700 truncate">
                      {lastAddedProduct.product.name}
                    </p>


                    <div className="flex items-center justify-between mt-2">

                      <span className="text-xs text-gray-500">
                        Qty: {lastAddedProduct.quantity}
                      </span>

                      <span className="text-base font-bold text-emerald-600">
                        ₹
                        {productPrice *
                          lastAddedProduct.quantity}
                      </span>

                    </div>

                  </div>


                  {/* Close */}

                  <button
                    onClick={() => {
                      setShowCartPopup(false);
                      setLastAddedProduct(null);
                    }}
                    className="
                      text-gray-400
                      hover:text-gray-900
                      transition-colors
                    "
                  >
                    <X className="w-5 h-5" />
                  </button>

                </div>


                {/* View Cart */}

                <Link
                  to="/cart"
                  onClick={() => {
                    setShowCartPopup(false);
                    setLastAddedProduct(null);
                  }}
                  className="
                    mt-4
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    py-3
                    rounded-xl
                    bg-gray-900
                    text-white
                    text-sm
                    font-bold
                    hover:bg-emerald-500
                    hover:text-black
                    transition-all
                  "
                >

                  View Cart

                  <ArrowUpRight className="w-4 h-4" />

                </Link>

              </div>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </>
  );
};

export default Navbar;