import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/images/dailyfix new logo.png';

const MINIMUM_DURATION_MS = 2000; // 2 seconds minimum duration

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const startTime = useRef(Date.now());

  useEffect(() => {
    let timeoutId;

    const finishLoading = () => {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, MINIMUM_DURATION_MS - elapsed);

      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      window.addEventListener('load', finishLoading);
    }

    // Safety fallback: in case window 'load' event was already dispatched or stalled
    const maxTimeoutId = setTimeout(() => {
      finishLoading();
    }, 4500);

    return () => {
      window.removeEventListener('load', finishLoading);
      if (timeoutId) clearTimeout(timeoutId);
      if (maxTimeoutId) clearTimeout(maxTimeoutId);
    };
  }, []);

  // Lock scroll while loader is visible
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="dailyfix-page-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(8px)',
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center select-none cursor-wait overflow-hidden"
          style={{
            backgroundColor: '#0D2417',
            backgroundImage:
              'radial-gradient(circle at 50% 48%, rgba(45, 125, 82, 0.32) 0%, rgba(13, 36, 23, 0.96) 60%, #0D2417 100%)'
          }}
          role="status"
          aria-live="polite"
          aria-label="Loading Dailyfix"
        >
          {/* Subtle decorative background ambient glow */}
          <div
            className="absolute w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: 'rgba(78, 168, 116, 0.15)' }}
            aria-hidden="true"
          />

          {/* Centralized Bouncing Logo Group */}
          <div className="relative flex flex-col items-center z-10 px-6">
            {/* Logo with Centralized Bouncing Effect */}
            <motion.div
              animate={{
                y: [0, -32, 0],
                scaleY: [0.96, 1.04, 0.96],
                scaleX: [1.04, 0.97, 1.04]
              }}
              transition={{
                duration: 1.05,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative flex items-center justify-center"
            >
              <img
                src={logo}
                alt="Dailyfix Logo"
                fetchPriority="high"
                className="w-48 sm:w-56 md:w-64 h-auto object-contain filter drop-shadow-[0_12px_32px_rgba(78,168,116,0.35)]"
              />
            </motion.div>

            {/* Realistic Dynamic Shadow Beneath Bouncing Logo */}
            <motion.div
              animate={{
                scaleX: [1.1, 0.58, 1.1],
                scaleY: [1.1, 0.65, 1.1],
                opacity: [0.65, 0.18, 0.65]
              }}
              transition={{
                duration: 1.05,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-36 sm:w-44 md:w-52 h-3.5 rounded-full bg-black/60 blur-md mt-4"
              aria-hidden="true"
            />

            {/* Brand Accent Tagline & Progress Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 flex flex-col items-center space-y-3.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EA874] animate-ping" />
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] font-extrabold text-[#C4DEC9]/90">
                  Botanical Grooming
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EA874] animate-ping" />
              </div>

              {/* Minimal Luxury Shimmer Loading Bar */}
              <div className="w-44 sm:w-52 h-[2px] bg-white/12 rounded-full overflow-hidden relative">
                <motion.div
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.3,
                    ease: 'easeInOut'
                  }}
                  className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#4EA874] to-transparent rounded-full shadow-[0_0_8px_#4EA874]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
