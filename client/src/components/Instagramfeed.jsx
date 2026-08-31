import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  ArrowUpRight
} from "lucide-react";
import api from "../services/api";
import beardVideo from "../assets/Untitled design (3).mp4";
import posterImg from "../assets/images/poster.png";
import howToUseImg from "../assets/images/How to use1.jpg.jpeg";
import naturalBlackImg from "../assets/images/001 Natural black1.png";
import brownBlackImg from "../assets/images/002 Brown black2.png";

const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/dailyfix_care/";

// 3 High-Impact Curated Showcase Reels/Posts (3 in a row)
const SHOWCASE_ITEMS = [
  {
    id: "ig-reel-1",
    type: "VIDEO",
    videoSrc: beardVideo,
    poster: posterImg,
    caption: "10-minute transformation before shower! 100% natural grey coverage with zero skin burning. Ammonia-Free formula. 🧔⚡",
    likes: 3840,
    comments: 214,
    tag: "Reel • Transformation",
    badgeColor: "from-pink-500 to-rose-600",
    shade: "Natural Black"
  },
  {
    id: "ig-post-2",
    type: "IMAGE",
    imageSrc: naturalBlackImg,
    caption: "Natural Black shade in natural daylight. Soft, multi-tonal richness — no fake ink or painted shoe-polish look. 🌿✨",
    likes: 2450,
    comments: 156,
    tag: "Post • Results",
    badgeColor: "from-emerald-500 to-teal-600",
    shade: "Natural Black"
  },
  {
    id: "ig-reel-3",
    type: "VIDEO",
    videoSrc: beardVideo,
    poster: howToUseImg,
    caption: "How to use at home: Mix 1:1, comb through dry beard, wait 5–10 mins, rinse. Effortless salon finish every time! 🚿🧼",
    likes: 4920,
    comments: 320,
    tag: "Reel • Tutorial",
    badgeColor: "from-purple-500 to-indigo-600",
    shade: "Black Brown"
  }
];

const ReelCard = ({ item, index, onOpenReel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 2400);

  const isVideo = item.type === "VIDEO";

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
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      className="group relative rounded-3xl overflow-hidden bg-stone-950 shadow-xl hover:shadow-2xl transition-all duration-500 border border-stone-200/90 hover:border-pink-500/50 flex flex-col justify-between"
    >
      {/* Media Viewport */}
      <div className="relative aspect-[4/5] sm:aspect-[9/13] w-full overflow-hidden bg-stone-950">
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
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Play/Pause state indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
                  <Play size={26} className="ml-1 fill-white" />
                </div>
              </div>
            )}

            {/* Audio Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 hover:scale-110 transition-all border border-white/20 shadow-md"
              aria-label={isMuted ? "Unmute reel" : "Mute reel"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-emerald-400" />}
            </button>

            {/* Tap to Play/Pause controller */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 w-full h-full z-10 cursor-pointer focus:outline-none"
              aria-label="Toggle play/pause"
            />
          </>
        ) : (
          <img
            src={item.imageSrc || item.media_url || naturalBlackImg}
            alt={item.caption || "Dailyfix Instagram Post"}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 bg-stone-900"
          />
        )}

        {/* Top Header Scrim & User Badge */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-20 pointer-events-none flex items-center justify-between">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="pointer-events-auto flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 hover:bg-black/70 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[1px] flex-shrink-0">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <Instagram size={11} className="text-white" />
              </div>
            </div>
            <span className="text-xs font-bold text-white tracking-tight">dailyfix_care</span>
            <CheckCircle2 size={12} className="text-blue-400 fill-blue-400" />
          </a>

          <span className={`px-2.5 py-1 rounded-full text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md bg-gradient-to-r ${item.badgeColor || 'from-pink-500 to-rose-600'} shadow-md`}>
            {isVideo ? <Film size={12} /> : <Instagram size={12} />}
            {isVideo ? "Reel" : "Post"}
          </span>
        </div>

        {/* Bottom Content Scrim */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pt-16 bg-gradient-to-t from-black/95 via-black/65 to-transparent z-20 pointer-events-none">
          {/* Action Row */}
          <div className="flex items-center justify-between mb-2.5 pointer-events-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className="flex items-center gap-1.5 text-white hover:scale-110 transition-transform"
              >
                <Heart
                  size={20}
                  className={`transition-colors ${
                    isLiked ? "fill-rose-500 text-rose-500" : "text-white hover:text-rose-400"
                  }`}
                />
                <span className="text-xs font-bold">{likeCount.toLocaleString()}</span>
              </button>

              <div className="flex items-center gap-1.5 text-white/90">
                <MessageCircle size={19} />
                <span className="text-xs font-bold">{item.comments}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenReel(item)}
              className="text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 pointer-events-auto transition-all hover:scale-105"
            >
              <span>Watch Reel</span>
              <Play size={11} className="fill-white" />
            </button>
          </div>

          {/* Caption */}
          <p className="text-white text-xs sm:text-sm font-medium leading-relaxed line-clamp-2 drop-shadow-md">
            {item.caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const InstagramFeed = () => {
  const [items, setItems] = useState(SHOWCASE_ITEMS);
  const [activeModalItem, setActiveModalItem] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchInstagramPosts = async () => {
      try {
        const res = await api.get("/instagram");
        if (
          res.data?.success &&
          Array.isArray(res.data.posts) &&
          res.data.posts.length > 0 &&
          res.data.source === "api"
        ) {
          // Take top 3 for the 3-in-a-row layout
          const formatted = res.data.posts.slice(0, 3).map((p, i) => ({
            id: p.id || `api-${i}`,
            type: p.media_type === "VIDEO" ? "VIDEO" : "IMAGE",
            videoSrc: p.media_type === "VIDEO" ? p.media_url : null,
            imageSrc: p.media_type !== "VIDEO" ? p.media_url : null,
            poster: p.thumbnail_url || posterImg,
            caption: p.caption || "Dailyfix Ammonia-Free Beard Colour 🧔✨",
            likes: 2100 + i * 550,
            comments: 110 + i * 35,
            tag: p.media_type === "VIDEO" ? "Reel" : "Post",
            badgeColor: p.media_type === "VIDEO" ? "from-pink-500 to-rose-600" : "from-emerald-500 to-teal-600"
          }));
          if (isMounted) setItems(formatted);
        }
      } catch (err) {
        // Retain curated 3 showcase items
      }
    };

    fetchInstagramPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 via-white to-stone-50 border-t border-stone-200/80">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 border border-pink-500/20 text-pink-700 text-xs font-extrabold uppercase tracking-wider mb-3 hover:scale-105 transition-transform"
            >
              <Instagram size={14} className="text-pink-600" />
              <span>Follow @dailyfix_care</span>
            </a>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Real Transformations on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500">
                Instagram Reels
              </span>
            </h2>

            <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl">
              Watch real customer results, 10-minute application tutorials, and shade guides from men across India.
            </p>
          </div>

          {/* Follow Button */}
          <div className="flex-shrink-0">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-pink-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <Instagram size={17} />
              <span>Follow on Instagram</span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Exact 3-in-a-Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.slice(0, 3).map((item, index) => (
            <ReelCard
              key={item.id || index}
              item={item}
              index={index}
              onOpenReel={(selected) => setActiveModalItem(selected)}
            />
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-12 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-stone-500 font-medium text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <span>Join <strong>12,800+</strong> men leveling up their grooming game</span>
          </div>

          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-stone-700 hover:text-pink-600 font-semibold transition-colors"
          >
            <span>Tag <strong>#DailyfixGrooming</strong> in your reels to get featured</span>
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* ===================== INTERACTIVE FULLSCREEN REEL MODAL ===================== */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm sm:max-w-md bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-40 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all border border-white/20"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Modal Video / Media Viewport */}
              <div className="relative aspect-[9/14] w-full bg-black flex items-center justify-center">
                {activeModalItem.type === "VIDEO" ? (
                  <video
                    src={activeModalItem.videoSrc || beardVideo}
                    poster={activeModalItem.poster || posterImg}
                    autoPlay
                    controls
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={activeModalItem.imageSrc || activeModalItem.media_url || naturalBlackImg}
                    alt={activeModalItem.caption}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Modal Footer info & Instagram link */}
              <div className="p-5 bg-stone-900 border-t border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[1.5px]">
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                        <Instagram size={14} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white">dailyfix_care</span>
                        <CheckCircle2 size={12} className="text-blue-400 fill-blue-400" />
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">Dailyfix Official Instagram</span>
                    </div>
                  </div>

                  <a
                    href={INSTAGRAM_PROFILE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <span>View on Instagram</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {activeModalItem.caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default InstagramFeed;