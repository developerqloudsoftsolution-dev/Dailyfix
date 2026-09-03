import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Menu,
  X,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { getProductImageSrc } from '../utils/productImages';
import logo from '../assets/images/dailyfix new logo.png';

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

  /* Close mobile menu when route changes */
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

      <header className="fixed top-0 left-0 right-0 z-[9999] ">

        {/* Background */}
        <div className={`backdrop-blur-2xl border-b transition-colors duration-300 ${
          isSample1
            ? 'bg-[#0B2510]/85 border-[#A8E6A1]/20 shadow-lg'
            : 'bg-black/90 border-white/10'
        }`}>

          <div className="max-w-[1500px] mx-auto px-5  sm:px-8 lg:px-12">

            <div className="h-[76px] lg:h-[84px] flex items-center justify-between">

              {/* =================================================
                  LOGO
              ================================================== */}

              <Link
                to="/"
                className="flex-shrink-0 group"
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
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />
              </Link>


              {/* =================================================
                  DESKTOP NAVIGATION
              ================================================== */}

              <nav className="hidden lg:flex items-center gap-9 xl:gap-12">

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
                        font-medium
                        tracking-wide
                        transition-all
                        duration-300
                        ${
                          active
                            ? 'text-emerald-400'
                            : 'text-white/80 hover:text-white'
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
                            h-[2px]
                            rounded-full
                            bg-emerald-400
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

              <div className="hidden lg:flex items-center gap-5">

                {/* Cart */}

                <Link
                  to="/cart"
                  className="
                    relative
                    group
                    flex
                    items-center
                    justify-center
                    w-11
                    h-11
                    rounded-full
                    border
                    border-white/10
                    hover:border-emerald-400/50
                    hover:bg-emerald-400/10
                    transition-all
                    duration-300
                  "
                >

                  <ShoppingBag
                    className="
                      w-[19px]
                      h-[19px]
                      text-white/80
                      group-hover:text-emerald-400
                      transition-colors
                    "
                  />

                  {getItemCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="
                        absolute
                        -top-1
                        -right-1
                        flex
                        items-center
                        justify-center
                        min-w-[19px]
                        h-[19px]
                        px-1
                        rounded-full
                        bg-emerald-400
                        text-black
                        text-[10px]
                        font-bold
                        border-2
                        border-black
                      "
                    >
                      {getItemCount()}
                    </motion.span>
                  )}

                </Link>


                {/* Contact Button */}

                <Link
                  to="/contact"
                  className={
                    isSample1
                      ? 'group flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-[#66BB6A] to-[#1B5E20] hover:brightness-110 text-white text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(102,187,106,0.3)] min-h-[44px]'
                      : `group
                    flex
                    items-center
                    gap-3
                    px-5
                    py-3
                    rounded-full
                    bg-emerald-400
                    hover:bg-emerald-300
                    text-black
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    hover:shadow-[0_0_25px_rgba(52,211,153,0.25)]`
                  }
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
                    border
                    border-white/10
                  "
                >

                  <ShoppingBag className="w-5 h-5 text-white" />

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
                        bg-emerald-400
                        text-black
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
                    border
                    border-white/10
                    text-white
                    hover:text-emerald-400
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

              {/* Overlay */}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="
                  fixed
                  inset-0
                  bg-black/70
                  backdrop-blur-sm
                  lg:hidden
                "
              />


              {/* Mobile Panel */}

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className={`
                  relative
                  z-10
                  lg:hidden
                  ${isSample1 ? 'bg-[#0B2510]/95 border-[#A8E6A1]/20' : 'bg-[#07110D] border-white/10'}
                  border-b
                  shadow-2xl
                `}
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
                            py-4
                            rounded-xl
                            text-base
                            font-medium
                            transition-all
                            ${
                              active
                                ? 'bg-emerald-400/10 text-emerald-400'
                                : 'text-white hover:bg-white/5'
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
                                bg-emerald-400
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
                        py-4
                        rounded-xl
                        text-base
                        font-medium
                        text-white
                        hover:bg-white/5
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
                            bg-emerald-400
                            text-black
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
                      className={`
                        mt-4
                        flex
                        items-center
                        justify-center
                        gap-2
                        px-6
                        py-4
                        rounded-xl
                        ${isSample1 ? 'bg-gradient-to-r from-[#66BB6A] to-[#1B5E20] text-white' : 'bg-emerald-400 text-black hover:bg-emerald-300'}
                        font-semibold
                        transition-colors
                        min-h-[44px]
                      `}
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