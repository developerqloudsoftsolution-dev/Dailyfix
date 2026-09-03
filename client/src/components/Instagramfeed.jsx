import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Instagram,
  Heart,
  MessageCircle,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Film,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Music2,
  Flame,
  Pause
} from "lucide-react";
import api from "../services/api";

// High quality media assets
import beardVideo from "../assets/Untitled design (3).mp4";
import posterImg from "../assets/images/poster.png";
import howToUseImg from "../assets/images/How to use1.jpg.jpeg";
import naturalBlackImg from "../assets/images/001 Natural black1.png";
import brownBlackImg from "../assets/images/002 Brown black2.png";
import darkBrownImg from "../assets/images/003 Drak brown3.png";
import perfectBeardImg from "../assets/images/Perfect beard color.jpg.jpeg";
import dImg from "../assets/images/d.jpg.jpeg";

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/dailyfix_care/";

// 6 Curated High-Impact Reels with Masonry Heights & Varied Aspects
const SHOWCASE_REELS = [
  {
    id: "reel-1",
    type: "VIDEO",
    videoSrc: beardVideo,
    poster: posterImg,
    caption: "10-minute transformation before shower! 100% natural grey coverage with zero skin burning. Ammonia-Free formula. 🧔⚡ #DailyfixGrooming",
    likes: 4820,
    comments: 284,
    tag: "Transformation Reel",
    badgeGradient: "from-pink-500 via-rose-500 to-amber-500",
    shade: "Natural Black",
    soundTitle: "Dailyfix Original Audio • Beard Magic",
    masonryHeight: "h-[470px]", // Tall full reel
    masonryOffset: "md:mt-0",
    permalink: INSTAGRAM_PROFILE_URL
  },
  {
    id: "reel-2",
    type: "IMAGE_REEL",
    imageSrc: naturalBlackImg,
    caption: "Natural Black in direct sunlight. Soft, rich texture with no artificial shoe-polish look. 🌿✨ #RealResults",
    likes: 3450,
    comments: 192,
    tag: "Shade Spotlight",
    badgeGradient: "from-emerald-500 via-teal-500 to-cyan-600",
    shade: "Natural Black",
    soundTitle: "Grooming Beats • Men's Care",
    masonryHeight: "h-[400px]", // Mid height
    masonryOffset: "md:mt-8",
    permalink: INSTAGRAM_PROFILE_URL
  },
  {
    id: "reel-3",
    type: "VIDEO",
    videoSrc: beardVideo,
    poster: howToUseImg,
    caption: "How to apply at home: Mix 1:1, comb through dry beard, wait 5–10 mins, rinse. Effortless salon finish! 🚿🧼 #Tutorial",
    likes: 5910,
    comments: 340,
    tag: "Step-By-Step Reel",
    badgeGradient: "from-purple-500 via-pink-500 to-rose-500",
    shade: "Black Brown",
    soundTitle: "Original Sound • Dailyfix Academy",
    masonryHeight: "h-[445px]", // Long reel
    masonryOffset: "md:mt-3",
    permalink: INSTAGRAM_PROFILE_URL
  },
  {
    id: "reel-4",
    type: "IMAGE_REEL",
    imageSrc: brownBlackImg,
    caption: "002 Black Brown — our #1 best-seller for Indian beards. Warm, sharp, and distinguished. 🔥 #TrendingShade",
    likes: 4120,
    comments: 215,
    tag: "Customer Favourite",
    badgeGradient: "from-amber-500 via-orange-500 to-rose-600",
    shade: "Black Brown",
    soundTitle: "Confidence Starts Here • Dailyfix",
    masonryHeight: "h-[470px]", // Tall full reel
    masonryOffset: "md:mt-0",
    permalink: INSTAGRAM_PROFILE_URL
  },
  {
    id: "reel-5",
    type: "VIDEO",
    videoSrc: beardVideo,
    poster: dImg,
    caption: "No ammonia. No staining. No eye burning. The gentlest beard colour in India tested on sensitive skin. 🛡️ #SkinFirst",
    likes: 3890,
    comments: 180,
    tag: "Ammonia Free",
    badgeGradient: "from-cyan-500 via-blue-500 to-indigo-600",
    shade: "Dark Brown",
    soundTitle: "Gentle Formula • Dermat Tested",
    masonryHeight: "h-[400px]", // Mid height
    masonryOffset: "md:mt-7",
    permalink: INSTAGRAM_PROFILE_URL
  },
  {
    id: "reel-6",
    type: "IMAGE_REEL",
    imageSrc: perfectBeardImg,
    caption: "Before vs After — watch 10 years vanish from your face in just 10 minutes. Clean, youthful, sharp. ⚡ #Transformation",
    likes: 6430,
    comments: 412,
    tag: "Before & After",
    badgeGradient: "from-rose-500 via-purple-500 to-indigo-600",
    shade: "Natural Black",
    soundTitle: "Dailyfix Viral Sound • 100K+ Uses",
    masonryHeight: "h-[445px]", // Long reel
    masonryOffset: "md:mt-2",
    permalink: INSTAGRAM_PROFILE_URL
  }
];

// Single Masonry Reel Card
const MasonryReelCard = ({ item, isAutoPlaying }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 3200);

  const isVideo = item.type === "VIDEO";
  const postUrl = item.permalink || INSTAGRAM_PROFILE_URL;

  // Auto-play videos in muted state
  useEffect(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [isVideo]);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLiked) {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    } else {
      setLikeCount((prev) => Math.max(0, prev - 1));
      setIsLiked(false);
    }
  };

  return (
    <div
      className={`relative flex-shrink-0 w-[275px] sm:w-[305px] lg:w-[325px] ${item.masonryHeight} ${item.masonryOffset} rounded-[28px] overflow-hidden bg-white shadow-[0_12px_36px_rgba(27,77,49,0.08)] hover:shadow-[0_20px_50px_rgba(27,77,49,0.16)] transition-all duration-500 border border-[#1B4D31]/12 hover:border-[#2D7D52]/60 group select-none flex flex-col justify-between`}
    >
      {/* Background Media Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#F7F5EE]">
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={item.videoSrc || beardVideo}
              poster={item.poster || posterImg}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Play/Pause icon overlay on manual pause */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px] pointer-events-none transition-all">
                <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-xl">
                  <Play size={26} className="ml-1 fill-white text-white" />
                </div>
              </div>
            )}

            {/* Audio Mute/Unmute toggle */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 hover:scale-110 transition-all border border-white/20 shadow-lg cursor-pointer"
              aria-label={isMuted ? "Unmute reel" : "Mute reel"}
            >
              {isMuted ? (
                <VolumeX size={14} className="text-white/80" />
              ) : (
                <Volume2 size={14} className="text-[#A8E6A1]" />
              )}
            </button>

            {/* Interactive Tap Zone to play/pause */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 w-full h-full z-10 cursor-pointer focus:outline-none"
              aria-label="Toggle reel play"
            />
          </>
        ) : (
          <img
            src={item.imageSrc || item.media_url || naturalBlackImg}
            alt={item.caption || "Dailyfix Instagram Reel"}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out bg-[#F7F5EE]"
          />
        )}
      </div>

      {/* Top Scrim & Reels Header */}
      <div className="relative z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none flex items-center justify-between">
        <a
          href={INSTAGRAM_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/40 hover:bg-white transition-colors shadow-sm"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#2D7D52] to-[#1B4D31] p-[1px] flex-shrink-0">
            <div className="w-full h-full bg-[#143D28] rounded-full flex items-center justify-center">
              <Instagram size={10} className="text-white" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#143D28] tracking-tight">dailyfix_care</span>
          <CheckCircle2 size={11} className="text-[#2D7D52] fill-[#2D7D52]" />
        </a>

        <div className="flex items-center gap-1.5 pointer-events-none">
          <span
            className="px-2.5 py-1 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md bg-[#143D28]/85 border border-white/10 shadow-sm"
          >
            {isVideo ? <Film size={11} /> : <Flame size={11} className="fill-white" />}
            {isVideo ? "Reel" : "Post"}
          </span>
        </div>
      </div>

      {/* Bottom Scrim & Content Controls */}
      <div className="relative z-20 p-4 sm:p-5 pt-12 bg-gradient-to-t from-black via-black/75 to-transparent pointer-events-none flex flex-col justify-end">
        {/* Actions Row */}
        <div className="flex items-center justify-between mb-2.5 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Heart / Like Button */}
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            >
              <Heart
                size={18}
                className={`transition-colors ${
                  isLiked ? "fill-rose-500 text-rose-500" : "text-white hover:text-rose-400"
                }`}
              />
              <span className="text-xs font-bold">{likeCount.toLocaleString()}</span>
            </button>

            {/* Comments Counter */}
            <div className="flex items-center gap-1 text-white/90 text-xs font-bold">
              <MessageCircle size={17} />
              <span>{item.comments}</span>
            </div>
          </div>

          {/* Direct CTA Button */}
          <a
            href={postUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-bold text-white bg-gradient-to-r from-[#2D7D52] to-[#1B4D31] hover:brightness-110 px-3 py-1 rounded-full shadow-md flex items-center gap-1 pointer-events-auto transition-all hover:scale-105"
          >
            <span>Watch</span>
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Audio Track Marquee */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/70 mb-2 truncate">
          <Music2 size={11} className="text-pink-400 flex-shrink-0 animate-pulse" />
          <span className="truncate">{item.soundTitle || "Dailyfix Original Audio"}</span>
        </div>

        {/* Caption */}
        <p className="text-white text-xs font-medium leading-snug line-clamp-2 drop-shadow-md">
          {item.caption}
        </p>
      </div>
    </div>
  );
};

const InstagramFeed = () => {
  const [reels, setReels] = useState(SHOWCASE_REELS);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Fetch dynamic posts from backend API if available, fallback to 6 curated reels
  useEffect(() => {
    let isMounted = true;
    const fetchInstagramPosts = async () => {
      try {
        const res = await api.get("/instagram");
        if (
          res.data?.success &&
          Array.isArray(res.data.posts) &&
          res.data.posts.length >= 3 &&
          res.data.source === "api"
        ) {
          const apiReels = res.data.posts.slice(0, 6).map((p, i) => ({
            id: p.id || `api-reel-${i}`,
            type: p.media_type === "VIDEO" ? "VIDEO" : "IMAGE_REEL",
            videoSrc: p.media_type === "VIDEO" ? p.media_url : null,
            imageSrc: p.media_type !== "VIDEO" ? p.media_url : null,
            poster: p.thumbnail_url || posterImg,
            caption: p.caption || "Dailyfix 100% Ammonia-Free Beard Colour 🧔✨",
            likes: 3100 + i * 480,
            comments: 180 + i * 42,
            tag: p.media_type === "VIDEO" ? "Instagram Reel" : "Customer Post",
            badgeGradient: p.media_type === "VIDEO" ? "from-pink-500 to-rose-600" : "from-emerald-500 to-teal-600",
            shade: "Natural Black",
            soundTitle: "Original Audio • dailyfix_care",
            masonryHeight: i % 3 === 0 ? "h-[470px]" : i % 3 === 1 ? "h-[400px]" : "h-[445px]",
            masonryOffset: i % 3 === 0 ? "md:mt-0" : i % 3 === 1 ? "md:mt-8" : "md:mt-3",
            permalink: p.permalink || INSTAGRAM_PROFILE_URL
          }));
          if (isMounted) setReels(apiReels);
        }
      } catch (err) {
        // Fallback to 6 curated showcase reels
      }
    };

    fetchInstagramPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth Auto-Slider Effect (Gentle continuous horizontal motion)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationFrameId;
    const scrollSpeed = 0.65; // pixels per frame for silky continuous drift

    const step = () => {
      // Only drift if autoPlay is enabled, not hovered, and not dragging
      if (autoPlayEnabled && !isHovered && !isDraggingRef.current && slider) {
        slider.scrollLeft += scrollSpeed;

        // Infinite loop wrap: if scrolled to the end, wrap smoothly to start
        const maxScroll = slider.scrollWidth - slider.clientWidth;
        if (slider.scrollLeft >= maxScroll - 2) {
          slider.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [autoPlayEnabled, isHovered]);

  // Robust Manual Arrow Scroll Controls that turn off auto-play completely once clicked
  const scrollByAmount = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Once user clicks on arrow, turn off auto-play completely as requested
    setAutoPlayEnabled(false);

    // Measure actual card step width
    const firstCard = slider.querySelector("div");
    const cardStep = firstCard ? firstCard.offsetWidth + 24 : 330;
    const currentScroll = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    let target = direction === "next" ? currentScroll + cardStep : currentScroll - cardStep;

    // Smooth boundary handling
    if (target < 0) {
      target = 0;
    } else if (target > maxScroll) {
      target = maxScroll;
    }

    slider.scrollTo({
      left: target,
      behavior: "smooth"
    });
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - slider.offsetLeft;
    scrollLeftRef.current = slider.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      temporarilyPause(2500);
    }
  };

  // Duplicate reels array for endless seamless scrolling
  const displayReels = [...reels, ...reels];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#F7F5EE] border-t border-[#1B4D31]/10 overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#2D7D52]/10 via-[#4EA874]/8 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/30 text-[#1B4D31] text-xs font-extrabold uppercase tracking-wider mb-3">
              <Instagram size={14} className="text-[#2D7D52]" />
              <span>@dailyfix_care • Real Community</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight leading-tight">
              Real Transformations in{" "}
              <span className="italic bg-clip-text text-transparent bg-gradient-to-r from-[#1B4D31] via-[#2D7D52] to-[#4EA874]">
                Instagram Reels
              </span>
            </h2>

            <p className="text-[#4A6352] text-sm sm:text-base mt-2 max-w-xl leading-relaxed font-sans">
              Watch real customer results, 10-minute application tutorials, and shade guides from men across India.
            </p>
          </div>

          {/* Controls & CTA Group */}
          <div className="flex items-center gap-3">
            {/* Auto-play status button */}
            <button
              type="button"
              onClick={() => setAutoPlayEnabled((prev) => !prev)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#EAF5EE] text-[#143D28] border border-[#1B4D31]/15 text-xs font-semibold transition cursor-pointer shadow-xs"
              title={autoPlayEnabled ? "Click to turn off auto-slide" : "Click to resume auto-slide"}
            >
              {autoPlayEnabled ? (
                <>
                  <Pause size={12} className="text-[#2D7D52]" />
                  <span>Auto-Sliding</span>
                </>
              ) : (
                <>
                  <Play size={12} className="text-[#2D7D52] fill-[#2D7D52]" />
                  <span>Auto-Play Off</span>
                </>
              )}
            </button>

            {/* Prev Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollByAmount("prev");
              }}
              className="w-10 h-10 rounded-xl bg-white hover:bg-[#EAF5EE] active:bg-[#EAF5EE] text-[#143D28] hover:text-[#2D7D52] flex items-center justify-center border border-[#1B4D31]/15 transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm z-20"
              aria-label="Previous reel"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                scrollByAmount("next");
              }}
              className="w-10 h-10 rounded-xl bg-white hover:bg-[#EAF5EE] active:bg-[#EAF5EE] text-[#143D28] hover:text-[#2D7D52] flex items-center justify-center border border-[#1B4D31]/15 transition hover:scale-105 active:scale-95 cursor-pointer shadow-sm z-20"
              aria-label="Next reel"
            >
              <ChevronRight size={20} />
            </button>

            {/* Follow Button */}
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#2D7D52] to-[#1B4D31] hover:brightness-105 text-white font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all duration-300"
            >
              <Instagram size={15} />
              <span>Follow</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Masonry Auto-Slider Track */}
      <div
        ref={sliderRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handleMouseUpOrLeave();
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        className="flex items-start gap-5 sm:gap-6 px-4 sm:px-8 overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing pb-8 pt-2 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {displayReels.map((item, idx) => (
          <MasonryReelCard key={`${item.id}-${idx}`} item={item} isAutoPlaying={autoPlayEnabled && !isHovered} />
        ))}
      </div>

      {/* Bottom Floating Stats & Social Proof */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl py-4 px-6 sm:px-8 border border-[#1B4D31]/10 shadow-[0_6px_24px_rgba(27,77,49,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[#4A6352] text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#EAF5EE] text-[#2D7D52] flex items-center justify-center flex-shrink-0">
              <Sparkles size={15} />
            </div>
            <span>
              Join <strong className="text-[#143D28] font-bold">12,800+</strong> gentlemen elevating their daily grooming with DailyFix
            </span>
          </div>

          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[#2D7D52] hover:text-[#143D28] font-bold transition-colors"
          >
            <span>Tag <span className="underline decoration-[#2D7D52]/40">#DailyfixGrooming</span> in your reels to get featured</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;