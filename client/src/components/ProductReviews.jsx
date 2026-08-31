import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  ThumbsUp,
  MessageSquarePlus,
  Filter,
  Sparkles,
  Search,
  X,
  Send,
  Award,
  Leaf,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import {
  getShadeDefaultReviews,
  calculateReviewStats,
  normalizeReviewSlug
} from '../data/productReviews';
import toast from 'react-hot-toast';

const AVATAR_GRADIENTS = [
  'from-emerald-500 to-teal-700',
  'from-amber-500 to-orange-700',
  'from-blue-600 to-indigo-800',
  'from-purple-600 to-pink-700',
  'from-rose-500 to-red-700',
  'from-stone-700 to-amber-950'
];

export const StarRating = ({ rating = 5, size = 16, className = '' }) => {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = rating >= star;
        const isHalf = !isFull && rating >= star - 0.5;

        return (
          <Star
            key={star}
            size={size}
            className={`${
              isFull
                ? 'fill-amber-400 text-amber-400'
                : isHalf
                ? 'fill-amber-300 text-amber-400'
                : 'fill-stone-200 text-stone-300'
            } transition-colors`}
          />
        );
      })}
    </div>
  );
};

const ProductReviews = ({ product, slug }) => {
  const productSlug = slug || product?.slug || 'natural-black-beard-colour';
  const productName = product?.name || "Dailyfix Men's Beard Colour";

  // 1. Core Review State
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Filter & Search State
  const [ratingFilter, setRatingFilter] = useState('all'); // 'all' | '5' | '4' | 'verified'
  const [sortBy, setSortBy] = useState('helpful'); // 'helpful' | 'newest' | 'highest'
  const [searchQuery, setSearchQuery] = useState('');
  const [votedMap, setVotedMap] = useState({});

  // 3. Slider Navigation State
  const sliderRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 4. Modal & Form State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    email: '',
    rating: 5,
    headline: '',
    content: '',
    shade: product?.sku || 'Natural Black',
    skinType: 'Sensitive Skin',
    usageDuration: 'First Time User'
  });

  // 5. Initial Data Fetch
  useEffect(() => {
    let isMounted = true;
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/reviews/product/${productSlug}`);
        if (res.data?.success && Array.isArray(res.data.reviews) && res.data.reviews.length > 0) {
          if (isMounted) {
            setReviews(res.data.reviews);
            setStats(res.data.stats);
          }
          return;
        }
      } catch (err) {
        console.warn('API review fetch notice, loading fallback reviews:', err.message);
      }

      if (isMounted) {
        const defaultList = getShadeDefaultReviews(productSlug);
        setReviews(defaultList);
        setStats(calculateReviewStats(defaultList));
      }
      if (isMounted) setLoading(false);
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [productSlug]);

  useEffect(() => {
    if (reviews.length > 0) {
      setStats(calculateReviewStats(reviews));
      setLoading(false);
    }
  }, [reviews]);

  // 6. Filtered & Sorted Reviews Computation
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (ratingFilter === '5') {
      list = list.filter((r) => Math.round(r.rating) === 5);
    } else if (ratingFilter === '4') {
      list = list.filter((r) => Math.round(r.rating) === 4);
    } else if (ratingFilter === 'verified') {
      list = list.filter((r) => r.verified);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.author?.toLowerCase().includes(q) ||
          r.headline?.toLowerCase().includes(q) ||
          r.content?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'helpful') {
      list.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortBy === 'highest') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [reviews, ratingFilter, searchQuery, sortBy]);

  // 7. Slider State Updater
  const updateSliderState = useCallback(() => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    const firstCard = container.children[0];
    const cpv =
      firstCard && firstCard.offsetWidth > 0
        ? Math.max(1, Math.min(filteredReviews.length, Math.round(container.clientWidth / firstCard.offsetWidth)))
        : 1;
    setCardsPerView(cpv);

    const maxValidIndex = Math.max(0, filteredReviews.length - cpv);

    if (maxScroll <= 10) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      setCurrentSlideIndex(0);
      return;
    }

    if (scrollLeft >= maxScroll - 15) {
      setCanScrollLeft(true);
      setCanScrollRight(false);
      setCurrentSlideIndex(maxValidIndex);
      return;
    }

    if (scrollLeft <= 15) {
      setCanScrollLeft(false);
      setCanScrollRight(true);
      setCurrentSlideIndex(0);
      return;
    }

    setCanScrollLeft(true);
    setCanScrollRight(true);

    const cards = Array.from(container.children);
    let closestIdx = 0;
    let minDistance = Infinity;
    cards.forEach((card, idx) => {
      const cardLeft = card.offsetLeft - container.offsetLeft;
      const distance = Math.abs(cardLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    setCurrentSlideIndex(Math.min(maxValidIndex, closestIdx));
  }, [filteredReviews.length]);

  // 8. Slide Next / Prev Controls
  const slidePrev = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const targetIdx = Math.max(0, currentSlideIndex - 1);
    const targetCard = container.children[targetIdx];
    if (targetCard) {
      const targetLeft = targetCard.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setCurrentSlideIndex(targetIdx);
    }
  };

  const slideNext = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const maxValidIndex = Math.max(0, filteredReviews.length - cardsPerView);
    const targetIdx = Math.min(maxValidIndex, currentSlideIndex + 1);
    const targetCard = container.children[targetIdx];
    if (targetCard) {
      const targetLeft = targetCard.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setCurrentSlideIndex(targetIdx);
    }
  };

  const scrollToIndex = (idx) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const targetCard = container.children[idx];
    if (targetCard) {
      const targetLeft = targetCard.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
      setCurrentSlideIndex(idx);
    }
  };

  // Reset slider on filter changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      setCurrentSlideIndex(0);
      const timer = setTimeout(updateSliderState, 120);
      return () => clearTimeout(timer);
    }
  }, [filteredReviews.length, ratingFilter, sortBy, updateSliderState]);

  // Resize listener
  useEffect(() => {
    updateSliderState();
    const handleResize = () => setTimeout(updateSliderState, 100);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateSliderState]);

  // 9. Upvote Helpful
  const handleHelpfulVote = async (reviewId) => {
    if (votedMap[reviewId]) {
      toast('You already found this review helpful!', { icon: '👍' });
      return;
    }

    setVotedMap((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) =>
        r._id === reviewId || r.id === reviewId
          ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 }
          : r
      )
    );

    try {
      if (String(reviewId).length === 24) {
        await api.post(`/reviews/${reviewId}/helpful`);
      }
      toast.success('Thank you for your feedback!');
    } catch (e) {
      // Optimistic state preserved
    }
  };

  // 10. Submit Review
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.author.trim() || !formData.headline.trim() || !formData.content.trim()) {
      toast.error('Please fill in your name, title, and review.');
      return;
    }

    setIsSubmitting(true);
    const newRev = {
      id: 'local-' + Date.now(),
      productSlug: normalizeReviewSlug(productSlug),
      productName,
      author: formData.author.trim(),
      email: formData.email.trim(),
      rating: Number(formData.rating),
      headline: formData.headline.trim(),
      content: formData.content.trim(),
      shade: formData.shade || 'Natural Black',
      verified: true,
      status: 'Approved',
      helpfulCount: 1,
      tags: ['Customer Review', 'Verified Buyer'],
      skinType: formData.skinType,
      usageDuration: formData.usageDuration,
      date: 'Just now',
      createdAt: new Date()
    };

    try {
      const res = await api.post('/reviews', {
        ...newRev,
        productSlug: normalizeReviewSlug(productSlug)
      });
      if (res.data?.review) {
        setReviews((prev) => [res.data.review, ...prev]);
      } else {
        setReviews((prev) => [newRev, ...prev]);
      }
      toast.success('Your review has been published! Thank you!');
    } catch (err) {
      setReviews((prev) => [newRev, ...prev]);
      toast.success('Your review has been submitted! Thank you!');
    } finally {
      setIsSubmitting(false);
      setIsWriteModalOpen(false);
      setFormData({
        author: '',
        email: '',
        rating: 5,
        headline: '',
        content: '',
        shade: product?.sku || 'Natural Black',
        skinType: 'Sensitive Skin',
        usageDuration: 'First Time User'
      });
      if (sliderRef.current) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  };

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    });
    return counts;
  }, [reviews]);

  const totalReviewsCount = reviews.length || 148;
  const avgScore = stats?.averageRating || 4.9;

  return (
    <section id="customer-reviews" className="mt-20 pt-14 border-t border-stone-200/80 scroll-mt-28">
      <div className="max-w-9xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs"
          >
            <Sparkles size={14} className="text-emerald-600 animate-pulse" />
            Verified Customer Feedback
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight"
          >
            Real Results from Real Men
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-base sm:text-lg text-stone-600 leading-relaxed"
          >
            Discover why thousands of men trust Dailyfix Ammonia-Free Beard Colour for 100% natural grey coverage without skin irritation.
          </motion.p>
        </div>

        {/* ===================== RATING HERO & BREAKDOWN CARD ===================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-emerald-900 via-stone-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden mb-12 border border-emerald-500/20"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Big Score & Recommend % */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/15 pb-8 lg:pb-0 lg:pr-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-6xl sm:text-7xl font-black tracking-tight text-white">
                  {avgScore}
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-xl font-bold text-emerald-400">/ 5.0</span>
                  <span className="text-xs text-stone-300 font-medium">Overall Rating</span>
                </div>
              </div>

              <div className="my-2">
                <StarRating rating={avgScore} size={24} />
              </div>

              <p className="text-stone-300 text-sm font-medium mt-1">
                Based on <span className="font-bold text-white">{totalReviewsCount}+ verified reviews</span>
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                <span>98% of customers recommend this product</span>
              </div>

              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition-all"
              >
                <MessageSquarePlus size={18} />
                Write a Review
              </button>
            </div>

            {/* Middle: Star Rating Distribution Progress Bars */}
            <div className="lg:col-span-4 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">
                Rating Breakdown
              </h4>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingCounts[stars] || 0;
                const percent = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;

                return (
                  <button
                    key={stars}
                    onClick={() => setRatingFilter(ratingFilter === String(stars) ? 'all' : String(stars))}
                    className="w-full flex items-center gap-3 text-xs group text-left hover:opacity-100 transition-opacity"
                  >
                    <div className="flex items-center gap-1 w-12 font-bold text-stone-200">
                      <span>{stars}</span>
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                    </div>

                    {/* Progress Track */}
                    <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          stars === 5
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                            : stars === 4
                            ? 'bg-gradient-to-r from-teal-400 to-cyan-400'
                            : 'bg-stone-500'
                        }`}
                      />
                    </div>

                    <span className="w-10 text-right font-medium text-stone-300">
                      {percent}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Customer Satisfaction KPI Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              {[
                { icon: CheckCircle2, label: 'Grey Coverage', value: '99%', sub: 'Complete uniform tone' },
                { icon: Leaf, label: 'Skin Comfort', value: '98%', sub: 'Zero stinging / ammonia' },
                { icon: Sparkles, label: 'Natural Shine', value: '97%', sub: 'No fake ink look' },
                { icon: Clock, label: 'Long Lasting', value: '96%', sub: 'Holds for 3-4 weeks' }
              ].map((kpi, idx) => {
                const Icon = kpi.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon size={16} className="text-emerald-400" />
                      <span className="text-lg font-black text-emerald-400">{kpi.value}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{kpi.label}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5 leading-tight">{kpi.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ===================== FILTER & CONTROLS STRIP ===================== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-soft">
          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 pl-1 pr-2">
              <Filter size={14} />
              Filter:
            </span>

            {[
              { id: 'all', label: `All (${reviews.length})` },
              { id: '5', label: `5 Stars (${ratingCounts[5]})` },
              { id: '4', label: `4 Stars (${ratingCounts[4]})` },
              { id: 'verified', label: 'Verified Buyers' }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setRatingFilter(chip.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  ratingFilter === chip.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Search, Sort & Slider Arrows Header */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-44">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="helpful">Most Helpful</option>
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
            </select>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-stone-200">
              <button
                onClick={slidePrev}
                disabled={!canScrollLeft}
                className="w-9 h-9 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs"
                aria-label="Previous review"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={slideNext}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-xs"
                aria-label="Next review"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ===================== REVIEWS SLIDER / CAROUSEL ===================== */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-md mx-auto">
            <MessageSquarePlus size={36} className="mx-auto text-stone-400 mb-3" />
            <h4 className="text-lg font-bold text-stone-800">No reviews found matching criteria</h4>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              Try resetting your search or filter options.
            </p>
            <button
              onClick={() => {
                setRatingFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="relative group/slider">
            {/* Left/Right Floating Quick Buttons */}
            <button
              onClick={slidePrev}
              disabled={!canScrollLeft}
              className={`hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-stone-800 items-center justify-center shadow-xl border border-stone-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all ${
                !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-90 hover:opacity-100 hover:scale-110'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={slideNext}
              disabled={!canScrollRight}
              className={`hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-stone-800 items-center justify-center shadow-xl border border-stone-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all ${
                !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-90 hover:opacity-100 hover:scale-110'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>

            {/* Horizontal Scrolling Track */}
            <div
              ref={sliderRef}
              onScroll={updateSliderState}
              className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 snap-x snap-mandatory scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {filteredReviews.map((rev, index) => {
                const reviewId = rev._id || rev.id || index;
                const hasVoted = !!votedMap[reviewId];
                const authorInitials = (rev.author || 'User')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase();

                const avatarGrad =
                  rev.avatarColor ||
                  AVATAR_GRADIENTS[Math.abs(index) % AVATAR_GRADIENTS.length];

                return (
                  <motion.div
                    key={reviewId}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className={`flex-shrink-0 w-[86vw] sm:w-[calc(50%-12px)] lg:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)] snap-start bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 shadow-soft hover:shadow-xl hover:border-emerald-300 flex flex-col justify-between ${
                      rev.isFeatured ? 'border-emerald-300 ring-1 ring-emerald-400/30' : 'border-stone-200/90'
                    }`}
                  >
                    <div>
                      {/* Top: Avatar, Name, Verified Badge & Date */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div
                            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${avatarGrad} flex items-center justify-center text-white font-extrabold text-sm shadow-md flex-shrink-0`}
                          >
                            {authorInitials}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                                {rev.author}
                              </h4>
                              {rev.verified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] sm:text-[11px] font-bold">
                                  <CheckCircle2 size={11} className="text-emerald-600" />
                                  Verified Buyer
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                              {rev.location && <span>{rev.location}</span>}
                              {rev.location && <span>•</span>}
                              <span>
                                {rev.date ||
                                  (rev.createdAt
                                    ? new Date(rev.createdAt).toLocaleDateString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })
                                    : 'Verified')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Featured Badge */}
                        {rev.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                            <Award size={12} className="text-amber-600" />
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Rating Stars & Shade Pill */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <StarRating rating={rev.rating || 5} size={15} />
                        <span className="text-xs font-bold text-stone-800">{rev.rating || 5}.0</span>
                        <span className="text-stone-300">•</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-medium">
                          Shade: <strong>{rev.shade || 'Natural Black'}</strong>
                        </span>
                        {rev.skinType && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                            {rev.skinType}
                          </span>
                        )}
                      </div>

                      {/* Review Title / Headline */}
                      <h3 className="text-base font-bold text-stone-900 leading-snug mb-2">
                        {rev.headline}
                      </h3>

                      {/* Review Body */}
                      <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-4">
                        {rev.content}
                      </p>

                      {/* Tag Chips */}
                      {rev.tags && rev.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {rev.tags.slice(0, 3).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 text-[11px] font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Helpful count & Upvote button */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium truncate max-w-[160px]">
                        {rev.usageDuration || 'Verified Customer Experience'}
                      </span>

                      <button
                        onClick={() => handleHelpfulVote(reviewId)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                          hasVoted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700'
                        }`}
                      >
                        <ThumbsUp size={13} className={hasVoted ? 'fill-emerald-700 text-emerald-700' : ''} />
                        <span>Helpful ({rev.helpfulCount || 0})</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Slider Dots / Indicator */}
            {filteredReviews.length > cardsPerView && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {Array.from({ length: Math.max(1, filteredReviews.length - cardsPerView + 1) }).map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => scrollToIndex(dotIdx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      dotIdx === currentSlideIndex
                        ? 'w-8 bg-emerald-600 shadow-xs'
                        : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================== WRITE A REVIEW POPUP MODAL ===================== */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-stone-200"
            >
              {/* Close button */}
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <MessageSquarePlus size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-stone-900">Write a Product Review</h3>
                  <p className="text-xs text-stone-500">{productName}</p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Interactive Star Picker */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                    Overall Rating
                  </label>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          size={32}
                          className={`${
                            formData.rating >= star
                              ? 'fill-amber-400 text-amber-400'
                              : 'fill-stone-200 text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-emerald-700 mt-2">
                    {formData.rating === 5 && '★★★★★ 5.0 - Outstanding Experience!'}
                    {formData.rating === 4 && '★★★★☆ 4.0 - Great Product!'}
                    {formData.rating === 3 && '★★★☆☆ 3.0 - Good'}
                    {formData.rating <= 2 && '★★☆☆☆ 2.0 - Needs Improvement'}
                  </p>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. vikram@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>

                {/* Shade Variant & Skin Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Shade Used</label>
                    <select
                      value={formData.shade}
                      onChange={(e) => setFormData({ ...formData, shade: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                    >
                      <option value="Natural Black">Natural Black</option>
                      <option value="Black Brown">Black Brown</option>
                      <option value="Dark Brown">Dark Brown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Skin Type</label>
                    <select
                      value={formData.skinType}
                      onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
                    >
                      <option value="Sensitive Skin">Sensitive Skin</option>
                      <option value="Normal Skin">Normal Skin</option>
                      <option value="Combination Skin">Combination Skin</option>
                      <option value="Dry Skin">Dry Skin</option>
                    </select>
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Review Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100% grey coverage with zero irritation"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Review *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share what you liked about the formula, grey coverage, application speed, and how your beard felt afterwards..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  >
                    <Send size={18} />
                    {isSubmitting ? 'Publishing Review...' : 'Submit & Publish Review'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductReviews;
