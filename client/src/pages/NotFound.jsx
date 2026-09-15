import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, ArrowRight, Compass, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

const NotFound = () => {
  useEffect(() => {
    document.title = '404: Page Not Found | Dailyfix Grooming Essentials';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F5EE] px-4 py-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2D7D52]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center relative z-10 space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-widest"
        >
          <Compass size={14} className="text-[#2D7D52]" />
          <span>Error 404 • Lost in the Grooming Routine</span>
        </motion.div>

        {/* Large 404 Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-serif text-7xl sm:text-8xl lg:text-9xl font-extrabold text-[#143D28] tracking-tight">
            404
          </h1>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#143D28] mt-2">
            The Page You Are Looking For Does Not Exist
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-sans text-base sm:text-lg text-[#4A6352] max-w-lg mx-auto leading-relaxed"
        >
          The page may have been moved, renamed, or expired. Let us guide you back to our botanical beard grooming essentials.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#143D28] hover:bg-[#2D7D52] text-white font-bold text-sm tracking-wide shadow-md hover:scale-105 transition-all"
          >
            <Home size={17} />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#EAF5EE] text-[#143D28] border border-[#1B4D31]/20 font-bold text-sm tracking-wide shadow-xs hover:scale-105 transition-all"
          >
            <ShoppingBag size={17} className="text-[#2D7D52]" />
            <span>Explore 3 Shades</span>
          </Link>
        </motion.div>

        {/* Helpful Quick Links Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#1B4D31]/10 max-w-md mx-auto mt-8 shadow-xs text-left"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-[#143D28] mb-3 flex items-center gap-2">
            <Sparkles size={14} className="text-[#2D7D52]" />
            <span>Popular Destinations:</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm text-[#2D7D52] font-semibold">
            <Link to="/about" className="hover:underline flex items-center gap-1">
              <span>• About Dailyfix</span>
            </Link>
            <Link to="/blog" className="hover:underline flex items-center gap-1">
              <span>• Grooming Journal</span>
            </Link>
            <Link to="/track-order" className="hover:underline flex items-center gap-1">
              <span>• Track Order</span>
            </Link>
            <Link to="/contact" className="hover:underline flex items-center gap-1">
              <span>• Contact Support</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
