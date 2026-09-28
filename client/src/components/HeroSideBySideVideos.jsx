import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSideBySideVideos.module.css';

const VIDEOS = [
  {
    id: 'vid-1',
    src: '/slide-vid/Video-31289.mp4',
    title: '10-Min Fast Action'
  },
  {
    id: 'vid-2',
    src: '/slide-vid/Video-57861.mp4',
    title: '0% Ammonia Formula'
  },
  {
    id: 'vid-3',
    src: '/slide-vid/WhatsApp%20Video%202026-09-28%20at%2011.30.54%20AM.mp4',
    title: 'Salon Quality Finish'
  }
];

const HeroSideBySideVideos = () => {
  const videoRefs = useRef([]);
  const [isMuted, setIsMuted] = useState(true);

  // Ensure autoplay on mount with muted audio
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = true;
        video.play().catch((err) => {
          console.warn('Autoplay prevented:', err);
        });
      }
    });
  }, []);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = nextMuted;
      }
    });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Repeated ticker copy with yellow square divider
  const tickerItems = [
    'no ammonia',
    'no harsh odour',
    'no skin stains',
    '10-min action',
    'botanical oils',
    '100% gentle',
    'salon grade'
  ];

  return (
    <section id="hero-section" className={styles.heroSection}>
      {/* 3-Video Panoramic Composite Background (Side-by-side, 0 gap) */}
      <div className={styles.videoStrip}>
        {VIDEOS.map((item, idx) => (
          <div key={item.id} className={styles.videoCol}>
            <video
              ref={(el) => (videoRefs.current[idx] = el)}
              src={item.src}
              className={styles.videoElement}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            />
          </div>
        ))}
      </div>

      {/* Cinematic Contrast Overlay */}
      <div className={styles.cinematicOverlay} />

      {/* Top Right Floating Sound Toggle */}
      <div className={styles.topRightControls}>
        <button
          type="button"
          onClick={toggleSound}
          className={`${styles.soundBtn} ${!isMuted ? styles.soundBtnActive : ''}`}
          title={isMuted ? 'Click to enable audio' : 'Click to mute audio'}
        >
          <i className={isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high'} />
          <span>{isMuted ? 'Muted' : 'Sound On'}</span>
        </button>
      </div>

      {/* Center Editorial Content ("Your beard's not GREY" + SHOP BESTSELLERS) */}
      <div className={styles.centerOverlay}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className={styles.centerOverlayContent}
        >
          <h1 className={styles.heroMainTitle}>
            Your beard’s not <br />
            <span className={styles.strikethroughWrap}>
              GREY
              <span className={styles.strikeLine} aria-hidden="true" />
            </span>
          </h1>

          <button
            onClick={() => scrollToSection('product-collection')}
            className={styles.shopBestsellerBtn}
          >
            <span>SHOP BESTSELLERS</span>
          </button>
        </motion.div>
      </div>

      {/* Wavy Curvy Ticker Ribbon (Moxie Beauty Inspired) */}
      <div className={styles.wavyTickerWrapper} aria-hidden="true">
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          className={styles.wavySvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="dailyfixRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#143D28" />
              <stop offset="30%" stopColor="#1E5236" />
              <stop offset="65%" stopColor="#2A6E49" />
              <stop offset="100%" stopColor="#143D28" />
            </linearGradient>

            {/* Continuous wavy curve path for the text to flow and animate along */}
            <path
              id="moxieWaveTextPath"
              d="M -1440,40 C -1200,66 -960,14 -720,40 C -480,66 -240,14 0,40 C 240,66 480,14 720,40 C 960,66 1200,14 1440,40 C 1680,66 1920,14 2160,40 C 2400,66 2640,14 2880,40"
              fill="none"
              stroke="none"
            />
          </defs>

          {/* Wavy Ribbon Body (Parallel top and bottom waves of constant thickness) */}
          <path
            d="M 0,22 C 240,48 480,-4 720,22 C 960,48 1200,-4 1440,22 L 1440,58 C 1200,32 960,84 720,58 C 480,32 240,84 0,58 Z"
            fill="url(#dailyfixRibbonGrad)"
          />

          {/* Bottom curve fill that transitions seamlessly into the cream background (#F7F5EE) */}
          <path
            d="M 0,58 C 240,84 480,32 720,58 C 960,84 1200,32 1440,58 L 1440,70 L 0,70 Z"
            fill="#F7F5EE"
          />

          {/* Flowing animated ticker along the wavy path with Dailyfix emerald square bullets */}
          <text className={styles.tickerTextPath} dy="5">
            <textPath href="#moxieWaveTextPath" startOffset="0%">
              {Array(6).fill(null).map((_, groupIdx) => (
                <React.Fragment key={groupIdx}>
                  {tickerItems.map((item, idx) => (
                    <React.Fragment key={`${groupIdx}-${idx}`}>
                      <tspan fill="#FFFFFF">{item}</tspan>
                      <tspan fill="#4EA874" fontWeight="900">  ■  </tspan>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
              <animate
                attributeName="startOffset"
                from="0%"
                to="-50%"
                dur="26s"
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
};

export default HeroSideBySideVideos;
